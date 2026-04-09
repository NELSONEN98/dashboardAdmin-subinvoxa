"use client"

import { useQuery, useConvexAuth } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Header } from "@/components/header"
import { CreditFoliosModal } from "@/components/credit-folios-modal"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Ticket } from "lucide-react"
import { useState } from "react"

export default function UserDetailPage() {
  const { clerkId } = useParams<{ clerkId: string }>()
  const router = useRouter()
  const { isAuthenticated, isLoading } = useConvexAuth()
  const data = useQuery(api.adminDashboard.getUserDetail, isAuthenticated ? { clerkId } : "skip")
  const [showCreditModal, setShowCreditModal] = useState(false)

  if (isLoading || !isAuthenticated || data === undefined) {
    return (
      <>
        <Header title="Detalle de usuario" />
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400">Cargando...</div>
      </>
    )
  }

  if (!data) {
    return (
      <>
        <Header title="Detalle de usuario" />
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400">Usuario no encontrado</div>
      </>
    )
  }

  const { user, account, organizations, folioPackages, folioBalance, subscription, plan } = data

  return (
    <>
      <Header title="Detalle de usuario" />
      <div className="flex-1 p-8 bg-white space-y-5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={14} /> Volver
          </button>

          <button
            onClick={() => setShowCreditModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Ticket size={14} />
            Acreditar folios
          </button>
        </div>

        {/* User info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Información del usuario</h3>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-400 text-xs mb-0.5">Nombre</dt>
              <dd className="font-semibold text-gray-900">{user.firstName} {user.lastName}</dd>
            </div>
            <div>
              <dt className="text-gray-400 text-xs mb-0.5">Email</dt>
              <dd className="font-medium text-gray-700">{user.email}</dd>
            </div>
            <div>
              <dt className="text-gray-400 text-xs mb-0.5">Clerk ID</dt>
              <dd className="font-mono text-xs text-gray-500">{user.clerkId}</dd>
            </div>
            <div>
              <dt className="text-gray-400 text-xs mb-0.5">Cuenta</dt>
              <dd className="font-medium text-gray-700">{account?.name ?? "Sin cuenta"}</dd>
            </div>
            <div>
              <dt className="text-gray-400 text-xs mb-0.5">Estado</dt>
              <dd>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${account?.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                  {account?.isActive ? "Activo" : "Inactivo"}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-gray-400 text-xs mb-0.5">Plan</dt>
              <dd>
                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-700">
                  {plan?.name ?? "Sin plan"}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Folios */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Folios</h3>
            <span className="text-sm font-bold text-emerald-600">{folioBalance} disponibles</span>
          </div>
          {folioPackages.length === 0 ? (
            <p className="text-sm text-gray-400">Sin paquetes de folios</p>
          ) : (
            <div className="space-y-2">
              {folioPackages.map((pkg) => {
                const pct = pkg.total > 0 ? Math.round((pkg.used / pkg.total) * 100) : 0
                return (
                  <div key={pkg._id} className="flex items-center gap-4 border border-gray-100 rounded-xl px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{pkg.name}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${pct >= 100 ? "bg-red-400" : pct > 70 ? "bg-orange-400" : "bg-emerald-400"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 shrink-0">{pkg.used}/{pkg.total}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        pkg.status === "active" ? "bg-emerald-100 text-emerald-700" :
                        pkg.status === "depleted" ? "bg-orange-100 text-orange-700" :
                        "bg-red-100 text-red-700"
                      }`}>{pkg.status}</span>
                      <p className="text-xs text-gray-400 mt-1">
                        Vence {new Date(pkg.expiresAt).toLocaleDateString("es-CO")}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Organizations */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
            Organizaciones ({organizations.length})
          </h3>
          {organizations.length === 0 ? (
            <p className="text-sm text-gray-400">Sin organizaciones</p>
          ) : (
            <div className="space-y-2">
              {organizations.map((org) => (
                <div
                  key={org._id}
                  onClick={() => router.push(`/organizations/${org.clerkId}`)}
                  className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{org.name}</p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">{org.clerkId}</p>
                  </div>
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${org.onboardingCompleted ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {org.onboardingCompleted ? "Activa" : "Onboarding"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreditModal && account && (
        <CreditFoliosModal
          email={user.email}
          accountName={account.name}
          onClose={() => setShowCreditModal(false)}
          onSuccess={() => {}}
        />
      )}
    </>
  )
}
