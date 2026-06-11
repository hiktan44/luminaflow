'use client'

import type { TaxReserveResult, SafeToSpendResult } from '@/types'
import { PiggyBank } from 'lucide-react'

interface ReservesPanelProps {
  taxReserves: TaxReserveResult
  safeToSpend: SafeToSpendResult
}

export function ReservesPanel({ taxReserves, safeToSpend }: ReservesPanelProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount)

  const totalReserved = taxReserves.total_reserve + safeToSpend.emergency_reserve

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <PiggyBank className="w-5 h-5 text-slate-600" />
        <h3 className="font-semibold text-slate-800">Rezervler</h3>
      </div>

      <div className="space-y-3">
        <ReserveItem
          label="Gelir Vergisi Rezervi"
          amount={formatCurrency(taxReserves.income_tax_reserve)}
          color="bg-amber-500"
          percentage={taxReserves.effective_rate}
        />
        <ReserveItem
          label="KDV Rezervi"
          amount={formatCurrency(taxReserves.vat_reserve)}
          color="bg-orange-500"
          percentage={null}
        />
        <ReserveItem
          label="Acil Durum Fonu"
          amount={formatCurrency(safeToSpend.emergency_reserve)}
          color="bg-indigo-500"
          percentage={null}
        />

        <div className="border-t border-slate-100 pt-3 mt-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">Toplam Rezerv</span>
            <span className="font-bold text-slate-900">{formatCurrency(totalReserved)}</span>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-emerald-700">Güvenli Harcama</span>
            <span className="font-bold text-emerald-700 text-lg">
              {formatCurrency(safeToSpend.safe_to_spend)}
            </span>
          </div>
          <p className="text-emerald-600 text-xs mt-1">
            Vergi ve rezervler düşüldükten sonra
          </p>
        </div>
      </div>
    </div>
  )
}

function ReserveItem({
  label,
  amount,
  color,
  percentage,
}: {
  label: string
  amount: string
  color: string
  percentage: number | null
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${color}`} />
        <span className="text-sm text-slate-600">{label}</span>
        {percentage !== null && (
          <span className="text-xs text-slate-400">(%{percentage.toFixed(1)})</span>
        )}
      </div>
      <span className="text-sm font-semibold text-slate-800">{amount}</span>
    </div>
  )
}
