import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateSafeToSpend } from '@/lib/calculations/safe-to-spend'
import { calculateMonthlyBurnRate } from '@/lib/calculations/runway'

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [transactionsResult, profileResult] = await Promise.all([
      supabase
        .from('transactions')
        .select('amount, type, date')
        .eq('user_id', user.id)
        .gte('date', startOfMonth.toISOString().split('T')[0]),
      supabase.from('profiles').select('*').eq('user_id', user.id).single(),
    ])

    const transactions = transactionsResult.data ?? []
    const profile = profileResult.data

    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const expenseItems = transactions
      .filter((t) => t.type === 'expense')
      .map((t) => ({ amount: t.amount, date: t.date }))

    const monthlyBurnRate = calculateMonthlyBurnRate(expenseItems)

    const result = calculateSafeToSpend({
      totalIncome,
      totalExpenses,
      taxRateIncome: profile?.tax_rate_income ?? 20,
      taxRateVat: profile?.tax_rate_vat ?? 20,
      emergencyFundMonths: profile?.emergency_fund_months ?? 3,
      monthlyBurnRate,
    })

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
