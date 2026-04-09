"use client"

import { useQuery, useConvexAuth } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Header } from "@/components/header"
import { DataTable, Column } from "@/components/data-table"
import { useRouter } from "next/navigation"

type UserRow = {
  _id: string
  clerkId: string
  email: string
  firstName?: string
  lastName?: string
  account?: { name: string; isActive: boolean } | null
  orgsCount: number
}

const columns: Column<UserRow>[] = [
  {
    key: "name",
    label: "Nombre",
    render: (row) => (
      <span className="font-medium text-gray-900">
        {row.firstName || row.lastName
          ? `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim()
          : "—"}
      </span>
    ),
  },
  {
    key: "email",
    label: "Email",
    render: (row) => <span className="text-gray-600">{row.email}</span>,
  },
  {
    key: "account",
    label: "Cuenta",
    render: (row) => <span className="text-gray-600">{row.account?.name ?? "—"}</span>,
  },
  {
    key: "orgsCount",
    label: "Orgs",
    render: (row) => (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
        {row.orgsCount}
      </span>
    ),
  },
  {
    key: "status",
    label: "Estado",
    render: (row) => (
      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
        row.account?.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
      }`}>
        {row.account?.isActive ? "Activo" : "Inactivo"}
      </span>
    ),
  },
]

export default function UsersPage() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const users = useQuery(api.adminDashboard.listUsers, isAuthenticated ? { limit: 500 } : "skip")
  const router = useRouter()

  return (
    <>
      <Header title="Usuarios" />
      <div className="flex-1 p-8 bg-white">
        <DataTable
          data={users as UserRow[] | undefined}
          columns={columns}
          loading={isLoading || !isAuthenticated || users === undefined}
          searchPlaceholder="Buscar por nombre o email..."
          getSearchText={(row) => `${row.firstName ?? ""} ${row.lastName ?? ""} ${row.email} ${row.account?.name ?? ""}`}
          filters={[
            {
              key: "status",
              label: "Estado",
              options: [
                { value: "true", label: "Activo" },
                { value: "false", label: "Inactivo" },
              ],
            },
          ]}
          pageSize={20}
          emptyMessage="No se encontraron usuarios"
          onRowClick={(row) => router.push(`/users/${row.clerkId}`)}
        />
      </div>
    </>
  )
}
