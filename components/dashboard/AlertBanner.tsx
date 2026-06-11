'use client'

import type { RunwayResult, SafeToSpendResult } from '@/types'
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react'

interface AlertBannerProps {
  runway: RunwayResult
  safeToSpend: SafeToSpendResult
}

export function AlertBanner({ runway, safeToSpend }: AlertBannerProps) {
  const alerts: { type: 'error' | 'warning' | 'success'; message: string }[] = []

  if (runway.months < 2) {
    alerts.push({
      type: 'error',
      message: `Kritik: Runway sadece ${runway.months.toFixed(1)} ay. Acil gelir artırmanız gerekiyor!`,
    })
  } else if (runway.months < 3) {
    alerts.push({
      type: 'warning',
      message: `Uyarı: Runway ${runway.months.toFixed(1)} ay. Yeni projeler bulmanızı öneririz.`,
    })
  }

  if (safeToSpend.safe_to_spend < 0) {
    alerts.push({
      type: 'error',
      message: 'Bu ay rezervlerinizi karşılamak için yeterli geliriniz yok.',
    })
  }

  if (alerts.length === 0) return null

  return (
    <div className="space-y-2">
      {alerts.map((alert, i) => {
        const Icon = alert.type === 'error' ? AlertCircle : alert.type === 'warning' ? AlertTriangle : CheckCircle
        const classes = {
          error: 'bg-red-50 border-red-200 text-red-700',
          warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
          success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        }
        return (
          <div key={i} className={`flex items-center gap-3 border rounded-lg px-4 py-3 text-sm ${classes[alert.type]}`}>
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{alert.message}</span>
          </div>
        )
      })}
    </div>
  )
}
