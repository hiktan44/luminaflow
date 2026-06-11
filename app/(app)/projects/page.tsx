import { createClient } from '@/lib/supabase/server'
import { ProjectCard } from '@/components/projects/ProjectCard'
import Link from 'next/link'
import { Plus, FolderOpen } from 'lucide-react'
import type { Project } from '@/types'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const projects: Project[] = (data ?? []) as Project[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projeler</h1>
          <p className="text-slate-500 text-sm mt-1">{projects.length} proje</p>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Proje
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Henüz proje yok</h3>
          <p className="text-slate-500 mb-6">İlk projenizi ekleyin</p>
          <Link
            href="/projects/new"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Proje Ekle
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
