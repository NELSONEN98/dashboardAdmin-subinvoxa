"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Header } from "@/components/header"

export default function LogsPage() {
  const logs = useQuery(api.adminDashboard.listDianLogs, { limit: 100 })

  return (
    <>
      <Header title="Logs DIAN" />
      <div className="flex-1 p-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Factura</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cuenta</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">HTTP</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado DIAN</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mensaje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {!logs && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Cargando...</td></tr>
              )}
              {logs?.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">
                    {new Date(log.emittedAt).toLocaleString("es-CO")}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">
                    {log.documentNumber ?? log.invoice?.fullNumber ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{log.account?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      log.httpStatus === 200 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {log.httpStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      log.responseStatus === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {log.statusCode ? `${log.statusCode}` : log.responseStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs max-w-xs truncate">
                    {log.responseMessage}
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
