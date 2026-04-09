"use client"

import { useQuery, useConvexAuth } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Header } from "@/components/header"
import { Users, Building2, FileText, TrendingUp, DollarSign, Ticket } from "lucide-react"

const CARDS = [
  {
    key: "users",
    label: "Usuarios",
    icon: Users,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    valueBg: "bg-violet-50",
    accent: "border-l-violet-500",
  },
  {
    key: "accounts",
    label: "Cuentas",
    icon: Users,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    valueBg: "bg-blue-50",
    accent: "border-l-blue-500",
  },
  {
    key: "organizations",
    label: "Organizaciones",
    icon: Building2,
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
    valueBg: "bg-cyan-50",
    accent: "border-l-cyan-500",
  },
  {
    key: "invoices",
    label: "Facturas",
    icon: FileText,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    valueBg: "bg-emerald-50",
    accent: "border-l-emerald-500",
  },
  {
    key: "subscriptions",
    label: "Suscripciones activas",
    icon: TrendingUp,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    valueBg: "bg-amber-50",
    accent: "border-l-amber-500",
  },
  {
    key: "revenue",
    label: "Ingresos totales",
    icon: DollarSign,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    valueBg: "bg-rose-50",
    accent: "border-l-rose-500",
  },
]

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  accepted_dian: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Aceptada DIAN" },
  rejected_dian: { bg: "bg-red-100", text: "text-red-700", label: "Rechazada DIAN" },
  draft: { bg: "bg-gray-100", text: "text-gray-600", label: "Borrador" },
  sent_to_dian: { bg: "bg-blue-100", text: "text-blue-700", label: "Enviada DIAN" },
  voided: { bg: "bg-orange-100", text: "text-orange-700", label: "Anulada" },
  pending_dian: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pendiente DIAN" },
  signed: { bg: "bg-purple-100", text: "text-purple-700", label: "Firmada" },
  pending_signature: { bg: "bg-indigo-100", text: "text-indigo-700", label: "Pendiente firma" },
}

export default function MetricsPage() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const metrics = useQuery(api.adminDashboard.getMetrics, isAuthenticated ? {} : "skip")

  if (isLoading || !isAuthenticated || !metrics) {
    return (
      <>
        <Header title="Métricas generales" />
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
          Cargando...
        </div>
      </>
    )
  }

  const revenueFormatted = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(metrics.revenue.totalCOP)

  const cardValues: Record<string, { value: string | number; sub?: string }> = {
    users: { value: metrics.users.total },
    accounts: { value: metrics.accounts.total, sub: `${metrics.accounts.active} activas` },
    organizations: { value: metrics.organizations.total },
    invoices: { value: metrics.invoices.total, sub: `${metrics.invoices.last30Days} en 30 días` },
    subscriptions: { value: metrics.subscriptions.active, sub: `de ${metrics.subscriptions.total} totales` },
    revenue: { value: revenueFormatted },
  }

  const folioPercent = metrics.folios.totalGranted > 0
    ? Math.round((metrics.folios.totalUsed / metrics.folios.totalGranted) * 100)
    : 0

  return (
    <>
      <Header title="Métricas generales" />
      <div className="flex-1 p-8 bg-white space-y-8">

        {/* Stat cards */}
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
          {CARDS.map(({ key, label, icon: Icon, iconBg, iconColor, accent }) => {
            const { value, sub } = cardValues[key]
            return (
              <div
                key={key}
                className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5 border-l-4 ${accent}`}
              >
                <div className={`${iconBg} p-3 rounded-xl shrink-0`}>
                  <Icon size={22} className={iconColor} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{label}</p>
                  <p className="text-3xl font-bold text-gray-900 leading-none">{value}</p>
                  {sub && <p className="text-xs text-gray-400 mt-1.5">{sub}</p>}
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

          {/* Invoices by status */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <FileText size={16} className="text-emerald-500" />
              <h3 className="text-sm font-semibold text-gray-800">Facturas por estado</h3>
            </div>
            <div className="space-y-3">
              {Object.entries(metrics.invoices.byStatus).map(([status, count]) => {
                const s = STATUS_COLORS[status] ?? { bg: "bg-gray-100", text: "text-gray-600", label: status }
                const pct = metrics.invoices.total > 0 ? Math.round((count / metrics.invoices.total) * 100) : 0
                return (
                  <div key={status} className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.bg} ${s.text} w-36 text-center shrink-0`}>
                      {s.label}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${s.bg.replace("100", "400")}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-800 w-8 text-right">{count}</span>
                  </div>
                )
              })}
              {Object.keys(metrics.invoices.byStatus).length === 0 && (
                <p className="text-sm text-gray-400">Sin facturas</p>
              )}
            </div>
          </div>

          {/* Folio pool */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Ticket size={16} className="text-amber-500" />
              <h3 className="text-sm font-semibold text-gray-800">Pool de folios</h3>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "Otorgados", value: metrics.folios.totalGranted, color: "text-gray-700", bg: "bg-gray-50", border: "border-gray-200" },
                { label: "Usados", value: metrics.folios.totalUsed, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
                { label: "Disponibles", value: metrics.folios.totalAvailable, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
              ].map(({ label, value, color, bg, border }) => (
                <div key={label} className={`${bg} border ${border} rounded-xl p-4 text-center`}>
                  <p className="text-2xl font-bold mb-1 ${color}">{value.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Uso del pool</span>
                <span>{folioPercent}%</span>
              </div>
              <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all"
                  style={{ width: `${folioPercent}%` }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
