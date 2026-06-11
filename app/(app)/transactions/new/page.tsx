import { createClient } from '@/lib/supabase/server'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import type { Project } from '@/types'

export default async function NewTransactionPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: projects } = await supabase
    .from('projects')
    .select('id, name')
    .eq('user_id', user.id)
    .eq('status', 'active')

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Yeni İşlem</h1>
        <p className="text-slate-500 text-sm mt-1">Gelir veya gider ekleyin</p>
      </div>
      <TransactionForm projects={(projects ?? []) as Pick<Project, 'id' | 'name'>[]} />
    </div>
  )
}
