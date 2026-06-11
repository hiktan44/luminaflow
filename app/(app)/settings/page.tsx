import { createClient } from '@/lib/supabase/server'
import { TaxProfileForm } from '@/components/settings/TaxProfileForm'
import type { UserProfile } from '@/types'

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Ayarlar</h1>
        <p className="text-slate-500 text-sm mt-1">Vergi profili ve hesap ayarları</p>
      </div>

      <TaxProfileForm profile={profile as UserProfile | null} userEmail={user.email ?? ''} />
    </div>
  )
}
