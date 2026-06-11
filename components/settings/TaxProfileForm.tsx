'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { UserProfile } from '@/types'
import { Save } from 'lucide-react'

interface TaxProfileFormProps {
  profile: UserProfile | null
  userEmail: string
}

export function TaxProfileForm({ profile, userEmail }: TaxProfileFormProps) {
  const router = useRouter()
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [businessName, setBusinessName] = useState(profile?.business_name ?? '')
  const [taxId, setTaxId] = useState(profile?.tax_id ?? '')
  const [taxRateIncome, setTaxRateIncome] = useState(profile?.tax_rate_income ?? 20)
  const [taxRateVat, setTaxRateVat] = useState(profile?.tax_rate_vat ?? 20)
  const [monthlyExpenses, setMonthlyExpenses] = useState(profile?.monthly_fixed_expenses ?? 0)
  const [emergencyMonths, setEmergencyMonths] = useState(profile?.emergency_fund_months ?? 3)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { error: dbError } = await supabase.from('profiles').upsert({
        user_id: user.id,
        full_name: fullName || null,
        business_name: businessName || null,
        tax_id: taxId || null,
        tax_rate_income: taxRateIncome,
        tax_rate_vat: taxRateVat,
        monthly_fixed_expenses: monthlyExpenses,
        emergency_fund_months: emergencyMonths,
        currency: 'TRY',
        updated_at: new Date().toISOString(),
      })

      if (dbError) {
        setError(dbError.message)
        return
      }

      setSuccess(true)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-700 text-sm">
            Ayarlar başarıyla kaydedildi.
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div>
          <h3 className="text-base font-semibold text-slate-800 mb-4">Profil Bilgileri</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="text"
                value={userEmail}
                disabled
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-500 bg-slate-50 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Ad Soyad</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Adınız Soyadınız"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">İşletme Adı</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="İşletme adı"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Vergi No</label>
              <input
                type="text"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                placeholder="Vergi kimlik numarası"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Vergi Ayarları</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Gelir Vergisi (%)
              </label>
              <input
                type="number"
                value={taxRateIncome}
                onChange={(e) => setTaxRateIncome(Number(e.target.value))}
                min={0}
                max={100}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">KDV (%)</label>
              <input
                type="number"
                value={taxRateVat}
                onChange={(e) => setTaxRateVat(Number(e.target.value))}
                min={0}
                max={100}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Rezerv Ayarları</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Aylık Sabit Gider (₺)
              </label>
              <input
                type="number"
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                min={0}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Acil Durum Fonu (ay)
              </label>
              <select
                value={emergencyMonths}
                onChange={(e) => setEmergencyMonths(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {[1, 2, 3, 6, 9, 12].map((m) => (
                  <option key={m} value={m}>{m} ay</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  )
}
