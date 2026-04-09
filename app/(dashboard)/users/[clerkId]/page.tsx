"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Header } from "@/components/header"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function UserDetailPage() {
  const { clerkId } = useParams<{ clerkId: string }>()
  const router = useRouter()
  const data = useQuery(api.adminDashboard.getUserDetail, { clerkId })

  if (!data) {
    return (
      <>
        <Header title="Detalle de usuario" />
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400">Cargando...</div>
      </>
    )
  }

  const { user, account, organizations, folioPackages, folioBalance, subscription, plan } = data

  return (
    <>
      <Header title="Detalle de usuario" />
      <div className="flex-1 p-6 space-y-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft size={14} /> Volver
        </button>

        {/* User info */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Información del usuario</h3>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-gray-400">Nombre</dt><dd className="font-medium">{user.firstName} {user.lastName}</dd></div>
            <div><dt className="text-gray-400">Email</dt><dd className="font-medium">{user.email}</dd></div>
            <div><dt className="text-gray-400">Clerk ID</dt><dd className="font-mono text-xs text-gray-600">{user.clerkId}</dd></div>
            <div><dt className="text-gray-400">Cuenta</dt><dd className="font-medium">{account?.name ?? "Sin cuenta"}</dd></div>
            <div>
              <dt className="text-gray-400">Estado</dt>
              <dd>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${account?.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {account?.isActive ? "Activo" : "Inactivo"}
                </span>
              </dd>
            </div>
            <div><dt className="text-gray-400">Plan</dt><dd className="font-medium">{plan?.name ?? "Sin plan"}</dd></div>
          </dl>
        </div>

        {/* Folios */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Folios — <span className="text-green-600">{folioBalance} disponibles</span>
          </h3>
          <div className="space-y-2">
            {folioPackages.length === 0 && <p className="text-sm text-gray-400">Sin paquetes</p>}
            {folioPackages.map((pkg) => (
              <div key={pkg._id} className="flex items-center justify-between text-sm border border-gray-100 rounded-lg px-3 py-2">
                <span className="text-gray-700">{pkg.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">{pkg.used}/{pkg.total} usados</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    pkg.status === "active" ? "bg-green-100 text-green-700" :
                    pkg.status === "depleted" ? "bg-orange-100 text-orange-700" :
                    "bg-red-100 text-red-700"
                  }`}>{pkg.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Organizations */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Organizaciones ({organizations.length})</h3>
          {organizations.length === 0 && <p className="text-sm text-gray-400">Sin organizaciones</p>}
          <div className="space-y-2">
            {organizations.map((org) => (
              <div key={org._id} className="flex items-center justify-between text-sm border border-gray-100 rounded-lg px-3 py-2">
                <span className="font-medium text-gray-900">{org.name}</span>
                <span className="text-gray-400 font-mono text-xs">{org.clerkId}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
