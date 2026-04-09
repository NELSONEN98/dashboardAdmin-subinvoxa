"use client"

import { useQuery, useConvexAuth } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Header } from "@/components/header"
import { DataTable, Column } from "@/components/data-table"

type FolioRow = {
  _id: string
  name: string
  status: "active" | "depleted" | "expired"
  total: number
  used: number
  expiresAt: number
  account?: { name: string } | null
}

const STATUS = {
  active:   { label: "Activo",   cls: "bg-emerald-100 text-emerald-700" },
  depleted: { label: "Agotado",  cls: "bg-orange-100 text-orange-700" },
  expired:  { label: "Vencido",  cls: "bg-red-100 text-red-700" },
}

const columns: Column<FolioRow>[] = [
  {
    key: "name",
    label: "Paquete",
    render: (row) => <span className="font-medium text-gray-900">{row.name}</span>,
  },
  {
    key: "account",
    label: "Cuenta",
    render: (row) => <span className="text-gray-600">{row.account?.name ?? "—"}</span>,
  },
  {
    key: "total",
    label: "Total",
    render: (row) => <span className="text-gray-700 font-medium">{row.total}</span>,
  },
  {
    key: "used",
    label: "Usados",
    render: (row) => <span className="text-gray-600">{row.used}</span>,
  },
  {
    key: "available",
    label: "Disponibles",
    render: (row) => (
      <span className="font-semibold text-emerald-700">{row.total - row.used}</span>
    ),
  },
  {
    key: "progress",
    label: "Uso",
    render: (row) => {
      const pct = row.total > 0 ? Math.round((row.used / row.total) * 100) : 0
      return (
        <div className="flex items-center gap-2 min-w-[100px]">
          <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full ${pct >= 100 ? "bg-red-400" : pct > 70 ? "bg-orange-400" : "bg-emerald-400"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 shrink-0">{pct}%</span>
        </div>
      )
    },
  },
  {
    key: "expiresAt",
    label: "Vence",
    render: (row) => (
      <span className="text-xs text-gray-500">
        {new Date(row.expiresAt).toLocaleDateString("es-CO")}
      </span>
    ),
  },
  {
    key: "status",
    label: "Estado",
    render: (row) => {
      const s = STATUS[row.status]
      return (
        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${s.cls}`}>
          {s.label}
        </span>
      )
    },
  },
]

export default function FoliosPage() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const packages = useQuery(api.adminDashboard.listFolioPackages, isAuthenticated ? { limit: 500 } : "skip")

  return (
    <>
      <Header title="Folios" />
      <div className="flex-1 p-8 bg-white">
        <DataTable
          data={packages as FolioRow[] | undefined}
          columns={columns}
          loading={isLoading || !isAuthenticated || packages === undefined}
          searchPlaceholder="Buscar por paquete o cuenta..."
          getSearchText={(row) => `${row.name} ${row.account?.name ?? ""}`}
          filters={[
            {
              key: "status",
              label: "Estado",
              options: [
                { value: "active",   label: "Activo" },
                { value: "depleted", label: "Agotado" },
                { value: "expired",  label: "Vencido" },
              ],
            },
          ]}
          pageSize={20}
          emptyMessage="No se encontraron paquetes de folios"
        />
      </div>
    </>
  )
}
