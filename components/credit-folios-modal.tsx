"use client"

import { useState } from "react"
import { useAction } from "convex/react"
import { api } from "@/convex/_generated/api"
import { X, Ticket, Loader2 } from "lucide-react"

interface Props {
  email: string
  accountName: string
  onClose: () => void
  onSuccess: () => void
}

export function CreditFoliosModal({ email, accountName, onClose, onSuccess }: Props) {
  const creditFolios = useAction(api.adminDashboard.creditFoliosByEmail)

  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState("Crédito manual por admin")
  const [daysValid, setDaysValid] = useState("365")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const amt = parseInt(amount)
    if (!amt || amt <= 0) { setError("La cantidad debe ser mayor a 0"); return }

    setLoading(true)
    setError(null)

    try {
      await creditFolios({
        email,
        amount: amt,
        reason,
        daysValid: parseInt(daysValid) || 365,
      })
      setSuccess(true)
      setTimeout(() => { onSuccess(); onClose() }, 1500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al acreditar folios")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Ticket size={16} className="text-amber-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Acreditar folios</h2>
              <p className="text-xs text-gray-400">{accountName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center py-6 gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <Ticket size={22} className="text-emerald-600" />
            </div>
            <p className="text-sm font-semibold text-emerald-700">¡Folios acreditados correctamente!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
              <p className="mt-1 text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">{email}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Cantidad de folios <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ej: 100"
                className="mt-1 w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder:text-gray-400"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Razón</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-1 w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Días de validez</label>
              <select
                value={daysValid}
                onChange={(e) => setDaysValid(e.target.value)}
                className="mt-1 w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="30">30 días</option>
                <option value="90">90 días</option>
                <option value="180">180 días</option>
                <option value="365">1 año (365 días)</option>
                <option value="730">2 años (730 días)</option>
              </select>
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                {loading ? "Acreditando..." : "Acreditar folios"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
