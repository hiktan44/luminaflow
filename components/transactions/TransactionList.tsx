'use client'

import type { Transaction } from '@/types'
import { useState } from 'react'
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { clsx } from 'clsx'

interface TransactionListProps {
  transactions: Transaction[]
  showActions?: boolean
}

const categoryLabels: Record<string, string> = {
  freelance_income: 'Freelance Gelir',
  project_income: 'Proje Geliri',
  other_income: 'Diğer Gelir',
  tools_software: 'Araç & Yazılım',
  office: 'Ofis',
  marketing: 'Pazarlama',
  education: 'Eğitim',
  travel: 'Seyahat',
  utilities: 'Faturalar',
  other_expense: 'Diğer Gider',
}

export function TransactionList({ transactions, showActions = true }: TransactionListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const formatCurrency = (amount: number, currency?: string) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: currency || 'TRY' }).format(amount)

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })

  async function handleDelete(id: string) {
    if (!confirm('Bu işlemi silmek istediğinize emin misiniz?')) return
    setDeletingId(id)
    try {
      const response = await fetch(`/api/transactions/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        const data = await response.json() as { error?: string }
        alert(data.error ?? 'Silme işlemi başarısız')
        return
      }
      router.refresh()
    } finally {
      setDeletingId(null)
    }
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 text-sm">
        Henüz işlem bulunmuyor
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="divide-y divide-slate-100">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors"
          >
            <div
              className={clsx(
                'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                transaction.type === 'income'
                  ? 'bg-emerald-100'
                  : 'bg-red-100'
              )}
            >
              {transaction.type === 'income' ? (
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-medium text-slate-800 text-sm truncate">
                {transaction.description}
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>{categoryLabels[transaction.category] ?? transaction.category}</span>
                <span>•</span>
                <span>{formatDate(transaction.date)}</span>
              </div>
            </div>

            <div
              className={clsx(
                'font-semibold text-sm flex-shrink-0',
                transaction.type === 'income' ? 'text-emerald-600' : 'text-red-500'
              )}
            >
              {transaction.type === 'income' ? '+' : '-'}
              {formatCurrency(transaction.amount, transaction.currency)}
            </div>

            {showActions && (
              <button
                onClick={() => handleDelete(transaction.id)}
                disabled={deletingId === transaction.id}
                className="p-1.5 text-slate-300 hover:text-red-500 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
