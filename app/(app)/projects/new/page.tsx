'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { projectSchema } from '@/lib/validations/schemas'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewProjectPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [clientName, setClientName] = useState('')
  const [budget, setBudget] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const parsed = projectSchema.safeParse({
      name,
      client_name: clientName || null,
      status: 'active',
      total_budget: budget ? parseFloat(budget) : null,
      currency: 'TRY',
      start_date: startDate || null,
      end_date: endDate || null,
      description: description || null,
    })

    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? 'Geçersiz veri')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error: dbError, data } = await supabase
        .from('projects')
        .insert({
          ...parsed.data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (dbError) {
        setError(dbError.message)
        return
      }

      router.push(`/projects/${data.id}`)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/projects"
          className="p-2 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Yeni Proje</h1>
          <p className="text-slate-500 text-sm mt-1">Proje bilgilerini girin</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Proje Adı *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Proje adı"
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Müşteri Adı</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Müşteri adı (opsiyonel)"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Bütçe (₺)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="0.00 (opsiyonel)"
              min="0"
              step="0.01"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Başlangıç</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Bitiş</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Açıklama</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Proje hakkında kısa açıklama (opsiyonel)"
              rows={3}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              href="/projects"
              className="flex-1 border border-slate-300 hover:border-slate-400 text-slate-700 py-3 rounded-lg font-medium transition-colors text-center"
            >
              İptal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Kaydediliyor...' : 'Proje Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
