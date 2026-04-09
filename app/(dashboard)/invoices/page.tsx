"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Header } from "@/components/header"

const STATUS_LABELS: Record<string, string> = {
  draft: "Borrador",
  pending_signature: "Pendiente firma",
  signed: "Firmada",
  pending_dian: "Pendiente DIAN",
  sent_to_dian: "Enviada DIAN",
  accepted_dian: "Aceptada DIAN",
  rejected_dian: "Rechazada DIAN",
  voided: "Anulada",
}

const STATUS_COLORS: Record<string, string> = {
  accepted_dian: "bg-green-100 text-green-700",
  rejected_dian: "bg-red-100 text-red-700",
  draft: "bg-gray-100 text-gray-600",
  sent_to_dian: "bg-blue-100 text-blue-700",
  voided: "bg-orange-100 text-orange-700",
  pending_dian: "bg-yellow-100 text-yellow-700",
  signed: "bg-purple-100 text-purple-700",
  pending_signature: "bg-indigo-100 text-indigo-700",
}

export default function InvoicesPage() {
  const invoices = useQuery(api.adminDashboard.listInvoices, { limit: 100 })

  return (
    <>
      <Header title="Facturas" />
      <div className="flex-1 p-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Número</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Emisor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {!invoices && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Cargando...</td></tr>
              )}
              {invoices?.map((inv) => (
                <tr key={inv._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{inv.fullNumber ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-700">{inv.client?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{inv.ownerId}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(inv.grandTotal / 100)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {new Date(inv.issueDate).toLocaleDateString("es-CO")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[inv.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {STATUS_LABELS[inv.status] ?? inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
