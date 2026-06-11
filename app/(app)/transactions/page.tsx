import { createClient } from '@/lib/supabase/server'
import { TransactionList } from '@/components/transactions/TransactionList'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import type { Transaction } from '@/types'

export default async function TransactionsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(100)

  const transactions: Transaction[] = (data ?? []) as Transaction[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">İşlemler</h1>
          <p className="text-slate-500 text-sm mt-1">{transactions.length} işlem bulundu</p>
        </div>
        <Link
          href="/transactions/new"
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni İşlem
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Henüz işlem yok</h3>
          <p className="text-slate-500 mb-6">İlk işleminizi ekleyin veya CSV yükleyin</p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/transactions/new"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              İşlem Ekle
            </Link>
            <Link
              href="/import"
              className="border border-slate-300 hover:border-slate-400 text-slate-700 px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              CSV Yükle
            </Link>
          </div>
        </div>
      ) : (
        <TransactionList transactions={transactions} showActions={true} />
      )}
    </div>
  )
}
