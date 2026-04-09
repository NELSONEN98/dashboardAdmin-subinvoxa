"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Header } from "@/components/header"
import { useState } from "react"

type Status = "active" | "depleted" | "expired" | undefined

export default function FoliosPage() {
  const [status, setStatus] = useState<Status>(undefined)
  const packages = useQuery(api.adminDashboard.listFolioPackages, { limit: 100, status })

  return (
    <>
      <Header title="Folios" />
      <div className="flex-1 p-6 space-y-4">
        {/* Filter */}
        <div className="flex gap-2">
          {(["all", "active", "depleted", "expired"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s === "all" ? undefined : s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                (s === "all" && !status) || status === s
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {s === "all" ? "Todos" : s}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Paquete</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cuenta</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Usados</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Disponibles</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vence</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {!packages && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Cargando...</td></tr>
              )}
              {packages?.map((pkg) => (
                <tr key={pkg._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{pkg.name}</td>
                  <td className="px-4 py-3 text-gray-600">{pkg.account?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{pkg.total}</td>
                  <td className="px-4 py-3 text-gray-600">{pkg.used}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{pkg.total - pkg.used}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {new Date(pkg.expiresAt).toLocaleDateString("es-CO")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      pkg.status === "active" ? "bg-green-100 text-green-700" :
                      pkg.status === "depleted" ? "bg-orange-100 text-orange-700" :
                      "bg-red-100 text-red-700"
                    }`}>{pkg.status}</span>
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
