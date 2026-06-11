import { createClient } from '@/lib/supabase/server'
import { MetricsCard } from '@/components/dashboard/MetricsCard'
import { RunwayDisplay } from '@/components/dashboard/RunwayDisplay'
import { ReservesPanel } from '@/components/dashboard/ReservesPanel'
import { AlertBanner } from '@/components/dashboard/AlertBanner'
import { TransactionList } from '@/components/transactions/TransactionList'
import { calculateRunway, calculateMonthlyBurnRate } from '@/lib/calculations/runway'
import { calculateSafeToSpend } from '@/lib/calculations/safe-to-spend'
import { calculateTaxReserves } from '@/lib/calculations/tax-reserves'
import type { Transaction, Project, SafeToSpendResult } from '@/types'
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const threeMonthsAgo = new Date()
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

  const [transactionsResult, monthTransactionsResult, profileResult, projectsResult, balanceResult] = await Promise.all([
    // Recent transactions for display (last 10)
    supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(10),
    // Current month transactions for safe-to-spend calc
    supabase
      .from('transactions')
      .select('amount, type, date')
      .eq('user_id', user.id)
      .gte('date', startOfMonth.toISOString().split('T')[0]),
    supabase.from('profiles').select('*').eq('user_id', user.id).single(),
    supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .limit(5),
    // All-time balance aggregation (last 3 months for burn rate)
    supabase
      .from('transactions')
      .select('amount, type, date')
      .eq('user_id', user.id)
      .gte('date', threeMonthsAgo.toISOString().split('T')[0]),
  ])

  const recentTransactions: Transaction[] = (transactionsResult.data ?? []) as Transaction[]
  const monthTransactionsData = monthTransactionsResult.data ?? []
  const profile = profileResult.data
  const activeProjects: Project[] = (projectsResult.data ?? []) as Project[]
  const recentAllData = balanceResult.data ?? []

  const currentMonthIncome = monthTransactionsData
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const currentMonthExpenses = monthTransactionsData
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const allExpenses = recentAllData
    .filter((t) => t.type === 'expense')
    .map((t) => ({ amount: t.amount, date: t.date }))

  const monthlyBurnRate = calculateMonthlyBurnRate(allExpenses)
  const totalIncome = recentAllData
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = recentAllData
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  const currentBalance = totalIncome - totalExpenses

  const runway = calculateRunway(currentBalance, monthlyBurnRate)
  const rawSafeToSpend = calculateSafeToSpend({
    totalIncome: currentMonthIncome,
    totalExpenses: currentMonthExpenses,
    taxRateIncome: profile?.tax_rate_income ?? 20,
    taxRateVat: profile?.tax_rate_vat ?? 20,
    emergencyFundMonths: profile?.emergency_fund_months ?? 3,
    monthlyBurnRate,
  })

  const safeToSpend: SafeToSpendResult = {
    total_income: currentMonthIncome,
    total_expenses: currentMonthExpenses,
    tax_reserve_income: rawSafeToSpend.income_tax_reserve,
    tax_reserve_vat: rawSafeToSpend.vat_reserve,
    emergency_reserve: rawSafeToSpend.emergency_fund_target,
    safe_to_spend: rawSafeToSpend.safe_to_spend,
    breakdown: [
      { label: 'Gelir Vergisi Rezervi', amount: rawSafeToSpend.income_tax_reserve, color: 'bg-amber-500' },
      { label: 'KDV Rezervi', amount: rawSafeToSpend.vat_reserve, color: 'bg-orange-500' },
      { label: 'Acil Durum Fonu', amount: rawSafeToSpend.emergency_fund_target, color: 'bg-indigo-500' },
    ]
  }
  const taxReserves = calculateTaxReserves({
    grossIncome: totalIncome,
    deductibleExpenses: totalExpenses,
    incomeTaxRate: profile?.tax_rate_income ?? 20,
    vatRate: profile?.tax_rate_vat ?? 20,
  })

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          {now.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })} özeti
          <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
            Son 3 aya ait veri bazında hesaplanmıştır
          </span>
        </p>
      </div>

      <AlertBanner runway={runway} safeToSpend={safeToSpend} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard
          title="Bu Ay Gelir"
          value={formatCurrency(currentMonthIncome)}
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
          color="emerald"
        />
        <MetricsCard
          title="Bu Ay Gider"
          value={formatCurrency(currentMonthExpenses)}
          icon={<TrendingDown className="w-5 h-5 text-red-500" />}
          color="red"
        />
        <MetricsCard
          title="Güvenli Harcama"
          value={formatCurrency(safeToSpend.safe_to_spend)}
          icon={<DollarSign className="w-5 h-5 text-blue-600" />}
          color="blue"
        />
        <MetricsCard
          title="Aktif Projeler"
          value={String(activeProjects.length)}
          icon={<Activity className="w-5 h-5 text-purple-600" />}
          color="purple"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <RunwayDisplay runway={runway} />
        <ReservesPanel taxReserves={taxReserves} safeToSpend={safeToSpend} />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Son İşlemler</h2>
        <TransactionList transactions={recentTransactions} showActions={false} />
      </div>
    </div>
  )
}