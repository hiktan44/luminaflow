import type { RunwayResult } from '@/types'

export function calculateRunway(
  currentBalance: number,
  monthlyBurnRate: number
): RunwayResult {
  if (monthlyBurnRate <= 0) {
    return {
      months: 999,
      days: 999 * 30,
      monthly_burn_rate: 0,
      current_balance: currentBalance,
      projected_end_date: new Date(Date.now() + 999 * 30 * 24 * 60 * 60 * 1000).toISOString(),
    }
  }

  const months = currentBalance / monthlyBurnRate
  const days = Math.round(months * 30)
  const projectedEndDate = new Date()
  projectedEndDate.setDate(projectedEndDate.getDate() + days)

  return {
    months: Math.max(0, Math.round(months * 10) / 10),
    days: Math.max(0, days),
    monthly_burn_rate: monthlyBurnRate,
    current_balance: currentBalance,
    projected_end_date: projectedEndDate.toISOString(),
  }
}

export function calculateMonthlyBurnRate(
  expenses: { amount: number; date: string }[],
  monthsToAverage = 3
): number {
  if (expenses.length === 0) return 0

  const now = new Date()
  const cutoffDate = new Date()
  cutoffDate.setMonth(cutoffDate.getMonth() - monthsToAverage)

  const recentExpenses = expenses.filter(
    (e) => new Date(e.date) >= cutoffDate && new Date(e.date) <= now
  )

  if (recentExpenses.length === 0) {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0)
    return total / Math.max(1, monthsToAverage)
  }

  const totalExpenses = recentExpenses.reduce((sum, e) => sum + e.amount, 0)
  return totalExpenses / monthsToAverage
}
