"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Header } from "@/components/header"

export default function OrganizationsPage() {
  const orgs = useQuery(api.adminDashboard.listOrganizations, { limit: 100 })

  return (
    <>
      <Header title="Organizaciones" />
      <div className="flex-1 p-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Organización</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">NIT</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cuenta</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Folios asignados</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Facturas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {!orgs && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Cargando...</td></tr>
              )}
              {orgs?.map((org) => (
                <tr key={org._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{org.name}</td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                    {org.fiscalIdentificationNumber
                      ? `${org.fiscalIdentificationNumber}-${org.fiscalVerificationDigit ?? ""}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{org.account?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {org.folioAllocation
                      ? `${org.folioAllocation.assigned - org.folioAllocation.used} / ${org.folioAllocation.assigned}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{org.invoiceCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
