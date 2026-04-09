"use client"

import { useQuery, useConvexAuth } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Header } from "@/components/header"
import { DataTable, Column } from "@/components/data-table"
import { useRouter } from "next/navigation"

type OrgRow = {
  _id: string
  clerkId: string
  name: string
  fiscalIdentificationNumber?: string
  fiscalVerificationDigit?: string
  account?: { name: string } | null
  folioAllocation?: { assigned: number; used: number } | null
  invoiceCount: number
  onboardingCompleted?: boolean
}

const columns: Column<OrgRow>[] = [
  {
    key: "name",
    label: "Organización",
    render: (row) => <span className="font-medium text-gray-900">{row.name}</span>,
  },
  {
    key: "nit",
    label: "NIT",
    render: (row) =>
      row.fiscalIdentificationNumber ? (
        <span className="font-mono text-xs text-gray-600">
          {row.fiscalIdentificationNumber}-{row.fiscalVerificationDigit ?? ""}
        </span>
      ) : (
        <span className="text-gray-300">—</span>
      ),
  },
  {
    key: "account",
    label: "Cuenta",
    render: (row) => <span className="text-gray-600">{row.account?.name ?? "—"}</span>,
  },
  {
    key: "folios",
    label: "Folios",
    render: (row) =>
      row.folioAllocation ? (
        <div className="flex items-center gap-2">
          <span className="text-gray-700 font-medium">
            {row.folioAllocation.assigned - row.folioAllocation.used}
          </span>
          <span className="text-gray-400 text-xs">/ {row.folioAllocation.assigned}</span>
        </div>
      ) : (
        <span className="text-gray-300">—</span>
      ),
  },
  {
    key: "invoiceCount",
    label: "Facturas",
    render: (row) => (
      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
        {row.invoiceCount}
      </span>
    ),
  },
  {
    key: "onboarding",
    label: "Onboarding",
    render: (row) => (
      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
        row.onboardingCompleted ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
      }`}>
        {row.onboardingCompleted ? "Completo" : "Pendiente"}
      </span>
    ),
  },
]

export default function OrganizationsPage() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const orgs = useQuery(api.adminDashboard.listOrganizations, isAuthenticated ? { limit: 500 } : "skip")
  const router = useRouter()

  return (
    <>
      <Header title="Organizaciones" />
      <div className="flex-1 p-8 bg-white">
        <DataTable
          data={orgs as OrgRow[] | undefined}
          columns={columns}
          loading={isLoading || !isAuthenticated || orgs === undefined}
          searchPlaceholder="Buscar por nombre o NIT..."
          getSearchText={(row) => `${row.name} ${row.fiscalIdentificationNumber ?? ""} ${row.account?.name ?? ""}`}
          filters={[
            {
              key: "onboardingCompleted",
              label: "Onboarding",
              options: [
                { value: "true", label: "Completo" },
                { value: "false", label: "Pendiente" },
              ],
            },
          ]}
          pageSize={20}
          emptyMessage="No se encontraron organizaciones"
          onRowClick={(row) => router.push(`/organizations/${row.clerkId}`)}
        />
      </div>
    </>
  )
}
