import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { TransactionList } from '@/components/transactions/TransactionList'
import Link from 'next/link'
import { ArrowLeft, Calendar, DollarSign } from 'lucide-react'
import type { Transaction } from '@/types'

interface ProjectWithTransactions {
  id: string
  name: string
  client_name: string | null
  status: string
  total_budget: number | null
  currency: string
  start_date: string | null
  end_date: string | null
  description: string | null
  created_at: string
  updated_at: string
  user_id: string
  transactions: Transaction[]
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('projects')
    .select('*, transactions(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !data) {
    notFound()
  }

  const project = data as ProjectWithTransactions
  const transactions = project.transactions ?? []

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: project.currency }).format(amount)

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700',
    completed: 'bg-blue-100 text-blue-700',
    paused: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  const statusLabels: Record<string, string> = {
    active: 'Aktif',
    completed: 'Tamamlandı',
    paused: 'Beklemede',
    cancelled: 'İptal',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Link
          href="/projects"
          className="p-2 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[project.status] ?? ''}`}>
              {statusLabels[project.status] ?? project.status}
            </span>
          </div>
          {project.client_name && (
            <p className="text-slate-500 text-sm">{project.client_name}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <DollarSign className="w-4 h-4" />
            Toplam Gelir
          </div>
          <div className="text-xl font-bold text-emerald-600">{formatCurrency(totalIncome)}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <DollarSign className="w-4 h-4" />
            Toplam Gider
          </div>
          <div className="text-xl font-bold text-red-500">{formatCurrency(totalExpenses)}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <DollarSign className="w-4 h-4" />
            Net Kar
          </div>
          <div className={`text-xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {formatCurrency(totalIncome - totalExpenses)}
          </div>
        </div>
        {project.total_budget && (
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
              <Calendar className="w-4 h-4" />
              Bütçe
            </div>
            <div className="text-xl font-bold text-slate-900">{formatCurrency(project.total_budget)}</div>
          </div>
        )}
      </div>

      {project.description && (
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <h3 className="font-medium text-slate-700 mb-2">Açıklama</h3>
          <p className="text-slate-600 text-sm">{project.description}</p>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">İşlemler</h2>
          <Link
            href={`/transactions/new?project_id=${project.id}`}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            + İşlem Ekle
          </Link>
        </div>
        <TransactionList transactions={transactions} showActions={true} />
      </div>
    </div>
  )
}
