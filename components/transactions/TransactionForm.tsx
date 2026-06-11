'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { transactionSchema } from '@/lib/validations/schemas'
import type { Project } from '@/types'

interface TransactionFormProps {
  projects: Pick<Project, 'id' | 'name'>[]
}

const incomeCategories = [
  { value: 'freelance_income', label: 'Freelance Gelir' },
  { value: 'project_income', label: 'Proje Geliri' },
  { value: 'other_income', label: 'Diğer Gelir' },
]

const expenseCategories = [
  { value: 'tools_software', label: 'Araç & Yazılım' },
  { value: 'office', label: 'Ofis' },
  { value: 'marketing', label: 'Pazarlama' },
  { value: 'education', label: 'Eğitim' },
  { value: 'travel', label: 'Seyahat' },
  { value: 'utilities', label: 'Faturalar' },
  { value: 'other_expense', label: 'Diğer Gider' },
]

export function TransactionForm({ projects }: TransactionFormProps) {
  const router = useRouter()
  const [type, setType] = useState<'income' | 'expense'>('income')
  const [category, setCategory] = useState('freelance_income')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [projectId, setProjectId] = useState('')
  const [isTaxable, setIsTaxable] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const categories = type === 'income' ? incomeCategories : expenseCategories

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const parsed = transactionSchema.safeParse({
      type,
      category,
      amount: parseFloat(amount),
      description,
      date,
      project_id: projectId || null,
      is_taxable: isTaxable,
      currency: 'TRY',
    })

    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? 'Geçersiz veri')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error: dbError } = await supabase.from('transactions').insert({
        ...parsed.data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (dbError) {
        setError(dbError.message)
        return
      }

      router.push('/transactions')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Type Toggle */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">İşlem Türü</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setType('income')
                setCategory('freelance_income')
              }}
              className={`py-2.5 rounded-lg text-sm font-medium transition-colors ${
                type === 'income'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Gelir
            </button>
            <button
              type="button"
              onClick={() => {
                setType('expense')
                setCategory('other_expense')
              }}
              className={`py-2.5 rounded-lg text-sm font-medium transition-colors ${
                type === 'expense'
                  ? 'bg-red-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Gider
            </button>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Tutar (₺)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Açıklama</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="İşlem açıklaması"
            required
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Kategori</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Tarih</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* Project */}
        {projects.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Proje (opsiyonel)
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Proje seçin</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Taxable */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_taxable"
            checked={isTaxable}
            onChange={(e) => setIsTaxable(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
          />
          <label htmlFor="is_taxable" className="text-sm text-slate-700">
            Vergiye tabi işlem
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 border border-slate-300 hover:border-slate-400 text-slate-700 py-3 rounded-lg font-medium transition-colors"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  )
}
