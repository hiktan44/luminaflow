import type { TaxReserveResult } from '@/types'

export interface TaxReserveInput {
  grossIncome: number
  deductibleExpenses: number
  incomeTaxRate: number
  vatRate: number
}

export function calculateTaxReserves(input: TaxReserveInput): TaxReserveResult {
  const { grossIncome, deductibleExpenses, incomeTaxRate, vatRate } = input

  const taxableIncome = Math.max(0, grossIncome - deductibleExpenses)
  const incomeTaxReserve = taxableIncome * (incomeTaxRate / 100)
  const vatReserve = grossIncome * (vatRate / 100)
  const totalReserve = incomeTaxReserve + vatReserve
  const effectiveRate = grossIncome > 0 ? (totalReserve / grossIncome) * 100 : 0

  return {
    taxable_income: Math.round(taxableIncome * 100) / 100,
    income_tax_reserve: Math.round(incomeTaxReserve * 100) / 100,
    vat_reserve: Math.round(vatReserve * 100) / 100,
    total_reserve: Math.round(totalReserve * 100) / 100,
    effective_rate: Math.round(effectiveRate * 100) / 100,
  }
}

export function getTurkishTaxBracket(annualIncome: number): number {
  // 2024 Turkey income tax brackets (approximate)
  if (annualIncome <= 110000) return 15
  if (annualIncome <= 230000) return 20
  if (annualIncome <= 580000) return 27
  if (annualIncome <= 3000000) return 35
  return 40
}
