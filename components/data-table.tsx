"use client"

import { useState, useMemo } from "react"
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

export interface Column<T> {
  key: string
  label: string
  render: (row: T) => React.ReactNode
  searchable?: boolean // include this field in search
}

export interface FilterOption {
  key: string
  label: string
  options: { value: string; label: string }[]
}

interface DataTableProps<T> {
  data: T[] | undefined
  columns: Column<T>[]
  filters?: FilterOption[]
  searchPlaceholder?: string
  getSearchText?: (row: T) => string  // custom search across multiple fields
  pageSize?: number
  emptyMessage?: string
  onRowClick?: (row: T) => void
  loading?: boolean
}

export function DataTable<T extends { _id: string }>({
  data,
  columns,
  filters = [],
  searchPlaceholder = "Buscar...",
  getSearchText,
  pageSize = 20,
  emptyMessage = "Sin resultados",
  onRowClick,
  loading = false,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  const filtered = useMemo(() => {
    if (!data) return []
    let rows = data

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter((row) => {
        if (getSearchText) return getSearchText(row).toLowerCase().includes(q)
        return columns
          .filter((c) => c.searchable !== false)
          .some((c) => {
            const val = (row as Record<string, unknown>)[c.key]
            return String(val ?? "").toLowerCase().includes(q)
          })
      })
    }

    // Filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (!value) return
      rows = rows.filter((row) => String((row as Record<string, unknown>)[key] ?? "") === value)
    })

    return rows
  }, [data, search, activeFilters, columns, getSearchText])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const setFilter = (key: string, value: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const handleSearch = (v: string) => {
    setSearch(v)
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        {filters.map((f) => (
          <select
            key={f.key}
            value={activeFilters[f.key] ?? ""}
            onChange={(e) => setFilter(f.key, e.target.value)}
            className="text-sm text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 cursor-pointer appearance-none pr-8"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}
          >
            <option value="">{f.label}</option>
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        ))}

        {/* Active filter count */}
        {(search || Object.values(activeFilters).some(Boolean)) && (
          <button
            onClick={() => { setSearch(""); setActiveFilters({}); setPage(1) }}
            className="text-xs text-gray-500 hover:text-gray-900 underline"
          >
            Limpiar filtros
          </button>
        )}

        <span className="ml-auto text-xs text-gray-400">
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-300 whitespace-nowrap"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && (
                <tr>
                  <td colSpan={columns.length} className="px-5 py-10 text-center text-sm text-gray-400">
                    Cargando...
                  </td>
                </tr>
              )}
              {!loading && paginated.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-5 py-10 text-center text-sm text-gray-400">
                    {emptyMessage}
                  </td>
                </tr>
              )}
              {!loading && paginated.map((row) => (
                <tr
                  key={row._id}
                  onClick={() => onRowClick?.(row)}
                  className={`transition-colors ${onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-3.5 text-gray-700">
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <PaginationBtn onClick={() => setPage(1)} disabled={currentPage === 1}>
                <ChevronsLeft size={14} />
              </PaginationBtn>
              <PaginationBtn onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                <ChevronLeft size={14} />
              </PaginationBtn>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p: number
                if (totalPages <= 5) p = i + 1
                else if (currentPage <= 3) p = i + 1
                else if (currentPage >= totalPages - 2) p = totalPages - 4 + i
                else p = currentPage - 2 + i
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                      p === currentPage
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {p}
                  </button>
                )
              })}

              <PaginationBtn onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                <ChevronRight size={14} />
              </PaginationBtn>
              <PaginationBtn onClick={() => setPage(totalPages)} disabled={currentPage === totalPages}>
                <ChevronsRight size={14} />
              </PaginationBtn>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function PaginationBtn({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void
  disabled: boolean
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      {children}
    </button>
  )
}
