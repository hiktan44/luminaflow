import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateTaxReserves } from '@/lib/calculations/tax-reserves'

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
    const startOfYear = new Date(now.getFullYear(), 0, 1)

    const [transactionsResult, profileResult] = await Promise.all([
      supabase
        .from('transactions')
        .select('amount, type, is_taxable')
        .eq('user_id', user.id)
        .gte('date', startOfYear.toISOString().split('T')[0]),
      supabase.from('profiles').select('*').eq('user_id', user.id).single(),
    ])

    const transactions = transactionsResult.data ?? []
    const profile = profileResult.data

    const grossIncome = transactions
      .filter((t) => t.type === 'income' && t.is_taxable)
      .reduce((sum, t) => sum + t.amount, 0)

    const deductibleExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const result = calculateTaxReserves({
      grossIncome,
      deductibleExpenses,
      incomeTaxRate: profile?.tax_rate_income ?? 20,
      vatRate: profile?.tax_rate_vat ?? 20,
    })

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
