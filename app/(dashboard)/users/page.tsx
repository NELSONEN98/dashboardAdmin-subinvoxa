"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Header } from "@/components/header"
import { useRouter } from "next/navigation"

export default function UsersPage() {
  const users = useQuery(api.adminDashboard.listUsers, { limit: 100 })
  const router = useRouter()

  return (
    <>
      <Header title="Usuarios" />
      <div className="flex-1 p-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuario</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cuenta</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Orgs</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {!users && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">Cargando...</td>
                </tr>
              )}
              {users?.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/users/${user.clerkId}`)}
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {user.firstName || user.lastName
                      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-gray-600">{user.account?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{user.orgsCount}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.account?.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {user.account?.isActive ? "Activo" : "Inactivo"}
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
