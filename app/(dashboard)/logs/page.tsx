"use client"

import { useQuery, useConvexAuth } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Header } from "@/components/header"
import { DataTable, Column } from "@/components/data-table"

type LogRow = {
  _id: string
  emittedAt: number
  httpStatus: number
  responseStatus: string
  responseMessage: string
  statusCode?: number
  documentNumber?: string
  invoice?: { fullNumber?: string } | null
  account?: { name: string } | null
  org?: { name: string } | null
}

const columns: Column<LogRow>[] = [
  {
    key: "emittedAt",
    label: "Fecha",
    render: (row) => (
      <span className="text-xs text-gray-500 whitespace-nowrap">
        {new Date(row.emittedAt).toLocaleString("es-CO")}
      </span>
    ),
  },
  {
    key: "document",
    label: "Documento",
    render: (row) => (
      <span className="font-mono text-xs font-semibold text-gray-800">
        {row.documentNumber ?? row.invoice?.fullNumber ?? "—"}
      </span>
    ),
  },
  {
    key: "account",
    label: "Cuenta",
    render: (row) => <span className="text-gray-600">{row.account?.name ?? "—"}</span>,
  },
  {
    key: "org",
    label: "Organización",
    render: (row) => <span className="text-gray-600">{row.org?.name ?? "—"}</span>,
  },
  {
    key: "httpStatus",
    label: "HTTP",
    render: (row) => (
      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
        row.httpStatus === 200 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
      }`}>
        {row.httpStatus}
      </span>
    ),
  },
  {
    key: "responseStatus",
    label: "Estado DIAN",
    render: (row) => (
      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
        row.responseStatus === "success" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
      }`}>
        {row.statusCode ? `Código ${row.statusCode}` : row.responseStatus}
      </span>
    ),
  },
  {
    key: "responseMessage",
    label: "Mensaje",
    render: (row) => (
      <span className="text-xs text-gray-500 truncate max-w-xs block" title={row.responseMessage}>
        {row.responseMessage}
      </span>
    ),
  },
]

export default function LogsPage() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const logs = useQuery(api.adminDashboard.listDianLogs, isAuthenticated ? { limit: 500 } : "skip")

  return (
    <>
      <Header title="Logs DIAN" />
      <div className="flex-1 p-8 bg-white">
        <DataTable
          data={logs as LogRow[] | undefined}
          columns={columns}
          loading={isLoading || !isAuthenticated || logs === undefined}
          searchPlaceholder="Buscar por documento, cuenta u organización..."
          getSearchText={(row) => `${row.documentNumber ?? ""} ${row.invoice?.fullNumber ?? ""} ${row.account?.name ?? ""} ${row.org?.name ?? ""}`}
          filters={[
            {
              key: "responseStatus",
              label: "Estado",
              options: [
                { value: "success", label: "Exitoso" },
                { value: "error",   label: "Error" },
              ],
            },
          ]}
          pageSize={20}
          emptyMessage="No se encontraron logs de emisión"
        />
      </div>
    </>
  )
}
