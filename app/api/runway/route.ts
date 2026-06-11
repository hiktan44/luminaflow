import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateRunway, calculateMonthlyBurnRate } from '@/lib/calculations/runway'

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

    const { data: transactions } = await supabase
      .from('transactions')
      .select('amount, type, date')
      .eq('user_id', user.id)
      .gte('date', threeMonthsAgo.toISOString().split('T')[0])

    const expenses = (transactions ?? [])
      .filter((t) => t.type === 'expense')
      .map((t) => ({ amount: t.amount, date: t.date }))

    const income = (transactions ?? [])
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = (transactions ?? [])
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const currentBalance = income - totalExpenses
    const monthlyBurnRate = calculateMonthlyBurnRate(expenses)
    const runway = calculateRunway(currentBalance, monthlyBurnRate)

    return NextResponse.json(runway)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
