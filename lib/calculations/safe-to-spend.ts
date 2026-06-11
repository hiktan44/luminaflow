interface SafeToSpendParams {
  totalIncome: number
  totalExpenses: number
  taxRateIncome: number // Income tax rate %
  taxRateVat: number // VAT rate %
  emergencyFundMonths: number
  monthlyBurnRate: number
}

interface SafeToSpendResult {
  safe_to_spend: number
  income_tax_reserve: number
  vat_reserve: number
  emergency_fund_target: number
  total_reserves: number
  net_available: number
}

/**
 * Safe-to-spend hesaplama fonksiyonu
 * 
 * NOT: KDV rezervi basitleştirilmiş bir yaklaşımla hesaplanır.
 * Gerçek KDV hesaplama karmaşık olabilir ve fatura bazında yapılmalıdır.
 * Bu hesaplama brüt gelirin yüzdesi olarak KDV rezervi ayırır.
 * 
 * @param params Hesaplama parametreleri
 * @returns Safe-to-spend analizi
 */
export function calculateSafeToSpend({
  totalIncome,
  totalExpenses,
  taxRateIncome,
  taxRateVat,
  emergencyFundMonths,
  monthlyBurnRate,
}: SafeToSpendParams): SafeToSpendResult {
  // Gelir vergisi rezervi
  const incomeTaxReserve = (totalIncome - totalExpenses) * (taxRateIncome / 100)
  
  // KDV rezervi (basitleştirilmiş yaklaşım)
  // NOT: Bu hesaplama brüt gelirin yüzdesi olarak KDV rezervi ayırır
  // Gerçek uygulamada KDV faturalar bazında hesaplanmalıdır
  const vatReserve = totalIncome * (taxRateVat / 100)
  
  // Acil durum fonu hedefi
  const emergencyFundTarget = monthlyBurnRate * emergencyFundMonths
  
  const totalReserves = Math.max(0, incomeTaxReserve) + vatReserve + emergencyFundTarget
  const netAvailable = totalIncome - totalExpenses - totalReserves
  const safeToSpend = Math.max(0, netAvailable)
  
  return {
    safe_to_spend: safeToSpend,
    income_tax_reserve: Math.max(0, incomeTaxReserve),
    vat_reserve: vatReserve,
    emergency_fund_target: emergencyFundTarget,
    total_reserves: totalReserves,
    net_available: netAvailable,
  }
}