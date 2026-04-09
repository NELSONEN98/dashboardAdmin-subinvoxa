"use client"

import { useQuery, useConvexAuth } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Header } from "@/components/header"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Building2, FileText, Ticket, AlertCircle } from "lucide-react"

const STATUS: Record<string, { label: string; cls: string }> = {
  accepted_dian:     { label: "Aceptada",    cls: "bg-emerald-100 text-emerald-700" },
  rejected_dian:     { label: "Rechazada",   cls: "bg-red-100 text-red-700" },
  draft:             { label: "Borrador",    cls: "bg-gray-100 text-gray-600" },
  sent_to_dian:      { label: "Enviada",     cls: "bg-blue-100 text-blue-700" },
  voided:            { label: "Anulada",     cls: "bg-orange-100 text-orange-700" },
  pending_dian:      { label: "Pend. DIAN",  cls: "bg-yellow-100 text-yellow-700" },
}

export default function OrgDetailPage() {
  const { clerkId } = useParams<{ clerkId: string }>()
  const router = useRouter()
  const { isAuthenticated, isLoading } = useConvexAuth()
  const data = useQuery(api.adminDashboard.getOrganizationDetail, isAuthenticated ? { clerkId } : "skip")

  if (isLoading || !isAuthenticated || data === undefined) {
    return (
      <>
        <Header title="Detalle de organización" />
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400">Cargando...</div>
      </>
    )
  }

  if (!data) {
    return (
      <>
        <Header title="Detalle de organización" />
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400">Organización no encontrada</div>
      </>
    )
  }

  const { org, account, allocation, providers, resolutions, recentInvoices, invoiceCount, recentDianLogs } = data

  return (
    <>
      <Header title="Detalle de organización" />
      <div className="flex-1 p-8 bg-white space-y-5">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={14} /> Volver
        </button>

        {/* Header card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-cyan-100 rounded-xl">
              <Building2 size={22} className="text-cyan-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900">{org.name}</h2>
              {org.fiscalName && <p className="text-sm text-gray-500 mt-0.5">{org.fiscalName}</p>}
              <p className="text-xs font-mono text-gray-400 mt-1">{org.clerkId}</p>
            </div>
            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${org.onboardingCompleted ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
              {org.onboardingCompleted ? "Activa" : "Onboarding pendiente"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {/* Fiscal data */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Datos fiscales</h3>
            <dl className="space-y-2.5 text-sm">
              {[
                { label: "NIT", value: org.fiscalIdentificationNumber ? `${org.fiscalIdentificationNumber}-${org.fiscalVerificationDigit ?? ""}` : null },
                { label: "Razón social", value: org.fiscalName },
                { label: "Nombre comercial", value: org.fiscalTradeName },
                { label: "Dirección", value: org.fiscalAddress },
                { label: "Email fiscal", value: org.fiscalEmail },
                { label: "Teléfono", value: org.fiscalPhone },
                { label: "Cuenta propietaria", value: account?.name },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-gray-400 shrink-0">{label}</dt>
                  <dd className="font-medium text-gray-800 text-right">{value ?? <span className="text-gray-300">—</span>}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Folios & providers */}
          <div className="space-y-4">
            {/* Allocation */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Ticket size={14} className="text-amber-500" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Folios asignados</h3>
              </div>
              {allocation ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {[
                      { label: "Asignados", value: allocation.assigned, cls: "text-gray-700" },
                      { label: "Usados",    value: allocation.used,     cls: "text-orange-600" },
                      { label: "Disponibles", value: allocation.assigned - allocation.used, cls: "text-emerald-600" },
                    ].map(({ label, value, cls }) => (
                      <div key={label} className="bg-gray-50 rounded-xl p-3">
                        <p className={`text-xl font-bold ${cls}`}>{value}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                      style={{ width: `${allocation.assigned > 0 ? Math.round((allocation.used / allocation.assigned) * 100) : 0}%` }}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400">Sin asignación de folios</p>
              )}
            </div>

            {/* Providers */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Cuentas proveedoras</h3>
              {providers.length === 0 ? (
                <p className="text-sm text-gray-400">Sin proveedores configurados</p>
              ) : (
                <div className="space-y-2">
                  {providers.map((p) => (
                    <div key={p._id} className="flex items-center justify-between text-sm border border-gray-100 rounded-xl px-3 py-2.5">
                      <div>
                        <p className="font-medium text-gray-800">{p.providerAccount?.name ?? "—"}</p>
                        <p className="text-xs text-gray-400">Orden: {p.order}</p>
                      </div>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${p.isActive !== false ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                        {p.isActive !== false ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resolutions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Resoluciones DIAN ({resolutions.length})</h3>
          {resolutions.length === 0 ? (
            <p className="text-sm text-gray-400">Sin resoluciones configuradas</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-900 rounded-xl">
                    {["Nombre", "Número", "Prefijo", "Rango", "Actual", "Válida hasta", "Estado"].map((h) => (
                      <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-300 first:rounded-l-xl last:rounded-r-xl">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {resolutions.map((res) => (
                    <tr key={res._id}>
                      <td className="px-4 py-2.5 font-medium text-gray-800">{res.name}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-gray-600">{res.resolutionNumber}</td>
                      <td className="px-4 py-2.5 font-mono font-bold text-gray-800">{res.prefix}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-500">{res.rangeFrom} – {res.rangeTo ?? "∞"}</td>
                      <td className="px-4 py-2.5 font-semibold text-gray-800">{res.currentNumber}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-500">{new Date(res.validTo).toLocaleDateString("es-CO")}</td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${res.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                          {res.isActive ? "Activa" : "Inactiva"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent invoices */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={14} className="text-emerald-500" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Últimas facturas ({invoiceCount} totales)
            </h3>
          </div>
          {recentInvoices.length === 0 ? (
            <p className="text-sm text-gray-400">Sin facturas emitidas</p>
          ) : (
            <div className="space-y-2">
              {recentInvoices.map((inv) => {
                const s = STATUS[inv.status] ?? { label: inv.status, cls: "bg-gray-100 text-gray-600" }
                return (
                  <div key={inv._id} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold text-gray-700">{inv.fullNumber ?? "—"}</span>
                      <span className="text-xs text-gray-400">{new Date(inv.issueDate).toLocaleDateString("es-CO")}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-800">
                        {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(inv.grandTotal / 100)}
                      </span>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${s.cls}`}>{s.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent DIAN logs */}
        {recentDianLogs.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={14} className="text-red-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Últimos logs DIAN</h3>
            </div>
            <div className="space-y-2">
              {recentDianLogs.map((log) => (
                <div key={log._id} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-2.5 text-xs">
                  <span className="text-gray-400">{new Date(log.emittedAt).toLocaleString("es-CO")}</span>
                  <span className="font-mono font-semibold text-gray-700">{log.documentNumber ?? "—"}</span>
                  <span className={`px-2 py-0.5 rounded-full font-medium ${log.responseStatus === "success" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                    {log.responseStatus}
                  </span>
                  <span className="text-gray-500 max-w-xs truncate">{log.responseMessage}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
