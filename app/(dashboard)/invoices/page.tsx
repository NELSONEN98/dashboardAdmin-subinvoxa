"use client"

import { useQuery, useConvexAuth } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Header } from "@/components/header"
import { DataTable, Column } from "@/components/data-table"

type InvoiceRow = {
  _id: string
  fullNumber?: string
  ownerId: string
  ownerType: string
  status: string
  grandTotal: number
  issueDate: number
  client?: { name: string } | null
}

const STATUS: Record<string, { label: string; cls: string }> = {
  draft:             { label: "Borrador",        cls: "bg-gray-100 text-gray-600" },
  pending_signature: { label: "Pend. firma",     cls: "bg-indigo-100 text-indigo-700" },
  signed:            { label: "Firmada",         cls: "bg-purple-100 text-purple-700" },
  pending_dian:      { label: "Pend. DIAN",      cls: "bg-yellow-100 text-yellow-700" },
  sent_to_dian:      { label: "Enviada DIAN",    cls: "bg-blue-100 text-blue-700" },
  accepted_dian:     { label: "Aceptada DIAN",   cls: "bg-emerald-100 text-emerald-700" },
  rejected_dian:     { label: "Rechazada DIAN",  cls: "bg-red-100 text-red-700" },
  voided:            { label: "Anulada",         cls: "bg-orange-100 text-orange-700" },
}

const columns: Column<InvoiceRow>[] = [
  {
    key: "fullNumber",
    label: "Número",
    render: (row) => (
      <span className="font-mono text-xs font-semibold text-gray-800">{row.fullNumber ?? "—"}</span>
    ),
  },
  {
    key: "client",
    label: "Cliente",
    render: (row) => <span className="text-gray-700">{row.client?.name ?? "—"}</span>,
  },
  {
    key: "ownerId",
    label: "Emisor",
    render: (row) => (
      <span className="text-xs text-gray-400 font-mono truncate max-w-[120px] block">{row.ownerId}</span>
    ),
  },
  {
    key: "grandTotal",
    label: "Total",
    render: (row) => (
      <span className="font-semibold text-gray-900">
        {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(row.grandTotal / 100)}
      </span>
    ),
  },
  {
    key: "issueDate",
    label: "Fecha",
    render: (row) => (
      <span className="text-xs text-gray-500">
        {new Date(row.issueDate).toLocaleDateString("es-CO")}
      </span>
    ),
  },
  {
    key: "status",
    label: "Estado",
    render: (row) => {
      const s = STATUS[row.status] ?? { label: row.status, cls: "bg-gray-100 text-gray-600" }
      return (
        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${s.cls}`}>
          {s.label}
        </span>
      )
    },
  },
]

export default function InvoicesPage() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const invoices = useQuery(api.adminDashboard.listInvoices, isAuthenticated ? { limit: 500 } : "skip")

  return (
    <>
      <Header title="Facturas" />
      <div className="flex-1 p-8 bg-white">
        <DataTable
          data={invoices as InvoiceRow[] | undefined}
          columns={columns}
          loading={isLoading || !isAuthenticated || invoices === undefined}
          searchPlaceholder="Buscar por número, cliente o emisor..."
          getSearchText={(row) => `${row.fullNumber ?? ""} ${row.client?.name ?? ""} ${row.ownerId}`}
          filters={[
            {
              key: "status",
              label: "Estado",
              options: Object.entries(STATUS).map(([value, { label }]) => ({ value, label })),
            },
          ]}
          pageSize={20}
          emptyMessage="No se encontraron facturas"
        />
      </div>
    </>
  )
}
