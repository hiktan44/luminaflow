import Link from 'next/link'
import { ArrowRight, BarChart3, PiggyBank, TrendingUp, Shield, Zap, Users } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">LuminaFlow</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-slate-400 hover:text-white transition-colors text-sm">
                Giriş Yap
              </Link>
              <Link
                href="/register"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Ücretsiz Başla
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 text-emerald-400 text-sm mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            Freelancerlar için tasarlandı
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
            Nakit Akışını{' '}
            <span className="text-emerald-400">Kontrol Et</span>,
            <br />
            Vergiyi Planla
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            LuminaFlow, freelancerlar için akıllı nakit akışı ve vergi rezervi yönetimi.
            Ne kadar harcayabileceğini, ne kadar ayırman gerektiğini anında gör.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors"
            >
              Hemen Başla
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white px-8 py-4 rounded-xl text-lg font-medium transition-colors"
            >
              Demo Gör
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Finansal netlik, her zaman
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Tüm gelir ve giderlerinizi takip edin, vergi rezervlerinizi otomatik hesaplayın.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BarChart3 className="w-7 h-7 text-emerald-400" />}
              title="Runway Hesaplama"
              description="Mevcut nakit akışınızla kaç ay daha rahat çalışabileceğinizi anında görün."
            />
            <FeatureCard
              icon={<PiggyBank className="w-7 h-7 text-emerald-400" />}
              title="Vergi Rezervleri"
              description="Gelir vergisi ve KDV için otomatik rezerv hesaplama. Vergi sürprizi yok."
            />
            <FeatureCard
              icon={<TrendingUp className="w-7 h-7 text-emerald-400" />}
              title="Güvenli Harcama"
              description="Vergi ve rezervler çıktıktan sonra ne kadar harcayabileceğinizi net olarak görün."
            />
            <FeatureCard
              icon={<Shield className="w-7 h-7 text-emerald-400" />}
              title="Proje Takibi"
              description="Projelerinizin gelir ve gider durumunu takip edin, karlılığı ölçün."
            />
            <FeatureCard
              icon={<Zap className="w-7 h-7 text-emerald-400" />}
              title="CSV Import"
              description="Banka ekstrenizi CSV olarak yükleyin, işlemler otomatik sınıflandırılsın."
            />
            <FeatureCard
              icon={<Users className="w-7 h-7 text-emerald-400" />}
              title="Türk Vergi Sistemi"
              description="Türkiye vergi oranlarına göre özelleştirilmiş hesaplamalar ve raporlar."
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 px-4 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">500+</div>
              <div className="text-slate-400">Aktif Freelancer</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">₺2M+</div>
              <div className="text-slate-400">Takip Edilen Gelir</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">%30</div>
              <div className="text-slate-400">Daha Az Vergi Sürprizi</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Finansal özgürlüğünüzü kazanın
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            Bugün ücretsiz kaydolun, nakit akışınızı kontrol altına alın.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 rounded-xl text-lg font-semibold transition-colors"
          >
            Ücretsiz Başla
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-slate-400 text-sm">LuminaFlow © 2026</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="/login" className="hover:text-slate-300 transition-colors">Giriş</Link>
            <Link href="/register" className="hover:text-slate-300 transition-colors">Kayıt</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
      <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  )
}
