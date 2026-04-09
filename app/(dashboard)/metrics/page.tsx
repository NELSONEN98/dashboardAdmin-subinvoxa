"use client"

import { useQuery, useConvexAuth } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Header } from "@/components/header"
import { Users, Building2, FileText, Ticket, DollarSign, TrendingUp } from "lucide-react"

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string
  value: string | number
  sub?: string
  icon: React.ElementType
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
      <div className="p-2 bg-gray-100 rounded-lg">
        <Icon size={18} className="text-gray-700" />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function StatusBadge({ status, count }: { status: string; count: number }) {
  const colors: Record<string, string> = {
    accepted_dian: "bg-green-100 text-green-700",
    rejected_dian: "bg-red-100 text-red-700",
    draft: "bg-gray-100 text-gray-600",
    sent_to_dian: "bg-blue-100 text-blue-700",
    voided: "bg-orange-100 text-orange-700",
    pending_dian: "bg-yellow-100 text-yellow-700",
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status.replace(/_/g, " ")}
      <span className="font-bold">{count}</span>
    </span>
  )
}

export default function MetricsPage() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const metrics = useQuery(
    api.adminDashboard.getMetrics,
    isAuthenticated ? {} : "skip"
  )

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

  return (
    <>
      <Header title="Métricas generales" />
      <div className="flex-1 p-6 space-y-6">
        {/* Top stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard label="Usuarios" value={metrics.users.total} icon={Users} />
          <StatCard
            label="Cuentas"
            value={metrics.accounts.total}
            sub={`${metrics.accounts.active} activas`}
            icon={Users}
          />
          <StatCard label="Organizaciones" value={metrics.organizations.total} icon={Building2} />
          <StatCard
            label="Facturas"
            value={metrics.invoices.total}
            sub={`${metrics.invoices.last30Days} en 30 días`}
            icon={FileText}
          />
          <StatCard
            label="Suscripciones activas"
            value={metrics.subscriptions.active}
            sub={`de ${metrics.subscriptions.total} totales`}
            icon={TrendingUp}
          />
          <StatCard label="Ingresos totales" value={revenueFormatted} icon={DollarSign} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Invoices by status */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Facturas por estado</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(metrics.invoices.byStatus).map(([status, count]) => (
                <StatusBadge key={status} status={status} count={count} />
              ))}
            </div>
          </div>

          {/* Folio pool */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Pool de folios</h3>
            <div className="space-y-3">
              {[
                { label: "Otorgados", value: metrics.folios.totalGranted, color: "bg-gray-200" },
                { label: "Usados", value: metrics.folios.totalUsed, color: "bg-orange-400" },
                { label: "Disponibles", value: metrics.folios.totalAvailable, color: "bg-green-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                  <span className="text-sm text-gray-600 flex-1">{label}</span>
                  <span className="text-sm font-semibold text-gray-900">{value.toLocaleString()}</span>
                </div>
              ))}
              <div className="mt-3 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-orange-400 rounded-full"
                  style={{
                    width: `${metrics.folios.totalGranted > 0 ? (metrics.folios.totalUsed / metrics.folios.totalGranted) * 100 : 0}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-400">
                {metrics.folios.totalGranted > 0
                  ? `${Math.round((metrics.folios.totalUsed / metrics.folios.totalGranted) * 100)}% usado`
                  : "Sin folios"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
