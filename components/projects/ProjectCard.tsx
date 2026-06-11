'use client'

import type { Project } from '@/types'
import Link from 'next/link'
import { Calendar, DollarSign, ArrowRight } from 'lucide-react'
import { clsx } from 'clsx'

interface ProjectCardProps {
  project: Project
}

const statusConfig: Record<string, { label: string; classes: string }> = {
  active: { label: 'Aktif', classes: 'bg-emerald-100 text-emerald-700' },
  completed: { label: 'Tamamlandı', classes: 'bg-blue-100 text-blue-700' },
  paused: { label: 'Beklemede', classes: 'bg-yellow-100 text-yellow-700' },
  cancelled: { label: 'İptal', classes: 'bg-red-100 text-red-700' },
}

export function ProjectCard({ project }: ProjectCardProps) {
  const status = statusConfig[project.status] ?? { label: project.status, classes: 'bg-slate-100 text-slate-700' }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: project.currency }).format(amount)

  const formatDate = (date: string | null) =>
    date ? new Date(date).toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' }) : null

  return (
    <Link href={`/projects/${project.id}`}>
      <div className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 transition-all hover:shadow-sm group">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 truncate">{project.name}</h3>
            {project.client_name && (
              <p className="text-slate-500 text-sm truncate">{project.client_name}</p>
            )}
          </div>
          <span className={clsx('text-xs px-2 py-1 rounded-full font-medium ml-2 flex-shrink-0', status.classes)}>
            {status.label}
          </span>
        </div>

        {project.description && (
          <p className="text-slate-500 text-sm mb-3 line-clamp-2">{project.description}</p>
        )}

        <div className="flex items-center gap-4 text-sm text-slate-500">
          {project.total_budget && (
            <div className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span>{formatCurrency(project.total_budget)}</span>
            </div>
          )}
          {project.start_date && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(project.start_date)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end mt-3 text-emerald-600 text-sm group-hover:gap-2 transition-all">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">
            Detaylar
          </span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </Link>
  )
}
