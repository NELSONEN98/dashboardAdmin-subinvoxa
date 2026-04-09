"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Ticket,
  ScrollText,
  ChevronRight,
} from "lucide-react"

const nav = [
  { href: "/metrics", label: "Métricas", icon: LayoutDashboard },
  { href: "/users", label: "Usuarios", icon: Users },
  { href: "/organizations", label: "Organizaciones", icon: Building2 },
  { href: "/invoices", label: "Facturas", icon: FileText },
  { href: "/folios", label: "Folios", icon: Ticket },
  { href: "/logs", label: "Logs DIAN", icon: ScrollText },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-200">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Admin</p>
        <h1 className="text-base font-bold text-gray-900 mt-0.5">Subinvoxa</h1>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon size={16} />
              {label}
              {active && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-200 text-xs text-gray-400 text-center">
        Subinvoxa Admin v1.0
      </div>
    </aside>
  )
}
