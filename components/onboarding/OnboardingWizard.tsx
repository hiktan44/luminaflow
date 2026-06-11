'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Zap, ChevronRight, Check } from 'lucide-react'

type Step = 'welcome' | 'profile' | 'tax' | 'done'

export function OnboardingWizard() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('welcome')
  const [loading, setLoading] = useState(false)

  // Form fields
  const [fullName, setFullName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [taxRateIncome, setTaxRateIncome] = useState(20)
  const [taxRateVat, setTaxRateVat] = useState(20)
  const [monthlyExpenses, setMonthlyExpenses] = useState(5000)
  const [emergencyMonths, setEmergencyMonths] = useState(3)

  async function handleFinish() {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      await supabase.from('profiles').upsert({
        user_id: user.id,
        full_name: fullName || null,
        business_name: businessName || null,
        tax_rate_income: taxRateIncome,
        tax_rate_vat: taxRateVat,
        monthly_fixed_expenses: monthlyExpenses,
        emergency_fund_months: emergencyMonths,
        currency: 'TRY',
        updated_at: new Date().toISOString(),
      })

      setStep('done')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'done') {
    return (
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Check className="w-9 h-9 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Harika! Hazırsınız</h2>
        <p className="text-slate-500 mb-8">
          Profiliniz oluşturuldu. Dashboard&#39;a giderek nakit akışınızı takip etmeye başlayın.
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
        >
          Dashboard&#39;a Git
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">LuminaFlow</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Kurulum Sihirbazı</h1>
        <p className="text-slate-500 text-sm">2 dakikada başlayın</p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {(['welcome', 'profile', 'tax'] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step === s
                  ? 'bg-emerald-500 text-white'
                  : (['welcome', 'profile', 'tax'].indexOf(step) > i)
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-slate-200 text-slate-400'
              }`}
            >
              {['welcome', 'profile', 'tax'].indexOf(step) > i ? (
                <Check className="w-4 h-4" />
              ) : (
                i + 1
              )}
            </div>
            {i < 2 && <div className="w-8 h-0.5 bg-slate-200" />}
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8">
        {step === 'welcome' && (
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-900 mb-3">Hoş Geldiniz!</h2>
            <p className="text-slate-500 mb-8">
              LuminaFlow&#39;u kullanmaya başlamak için birkaç bilgiye ihtiyacımız var.
              Bu bilgiler vergi rezervlerinizi ve güvenli harcama limitinizi hesaplamak için kullanılacak.
            </p>
            <button
              onClick={() => setStep('profile')}
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
            >
              Başlayalım
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 'profile' && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Profil Bilgileri</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ad Soyad (opsiyonel)
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Adınız Soyadınız"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  İşletme Adı (opsiyonel)
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Şahıs firması veya freelance ismi"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setStep('welcome')}
                className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-lg font-medium"
              >
                Geri
              </button>
              <button
                onClick={() => setStep('tax')}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-medium transition-colors"
              >
                İleri
              </button>
            </div>
          </div>
        )}

        {step === 'tax' && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Vergi ve Rezerv Ayarları</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Gelir Vergisi Oranı (%)
                </label>
                <input
                  type="number"
                  value={taxRateIncome}
                  onChange={(e) => setTaxRateIncome(Number(e.target.value))}
                  min={0}
                  max={100}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-400 mt-1">Türkiye için genellikle %15-40 arası</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  KDV Oranı (%)
                </label>
                <input
                  type="number"
                  value={taxRateVat}
                  onChange={(e) => setTaxRateVat(Number(e.target.value))}
                  min={0}
                  max={100}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-400 mt-1">Türkiye standart KDV: %20</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
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
                <label className="block text-sm font-medium text-slate-700 mb-2">
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

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setStep('profile')}
                className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-lg font-medium"
              >
                Geri
              </button>
              <button
                onClick={handleFinish}
                disabled={loading}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors"
              >
                {loading ? 'Kaydediliyor...' : 'Tamamla'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
