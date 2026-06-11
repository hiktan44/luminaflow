import { CsvImport } from '@/components/import/CsvImport'

export default function ImportPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">CSV İçe Aktarma</h1>
        <p className="text-slate-500 text-sm mt-1">
          Banka ekstrenizi veya işlem geçmişinizi CSV olarak yükleyin
        </p>
      </div>

      <CsvImport />
    </div>
  )
}
