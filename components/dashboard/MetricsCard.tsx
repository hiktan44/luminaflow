'use client'

import { clsx } from 'clsx'

interface MetricsCardProps {
  title: string
  value: string
  icon: React.ReactNode
  subtitle?: string
  color?: 'emerald' | 'red' | 'blue' | 'purple' | 'yellow'
}

const colorClasses = {
  emerald: 'bg-emerald-50 border-emerald-200',
  red: 'bg-red-50 border-red-200',
  blue: 'bg-blue-50 border-blue-200',
  purple: 'bg-purple-50 border-purple-200',
  yellow: 'bg-yellow-50 border-yellow-200',
}

export function MetricsCard({ title, value, icon, subtitle, color = 'emerald' }: MetricsCardProps) {
  return (
    <div className={clsx('rounded-xl border p-4', colorClasses[color])}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-slate-600 text-sm font-medium">{title}</span>
        <div className="p-1.5 bg-white rounded-lg shadow-sm">{icon}</div>
      </div>
      <div className="text-xl font-bold text-slate-900 truncate">{value}</div>
      {subtitle && <div className="text-xs text-slate-500 mt-1">{subtitle}</div>}
    </div>
  )
}
