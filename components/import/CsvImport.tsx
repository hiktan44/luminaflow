'use client'

import { useState, useRef } from 'react'
import Papa from 'papaparse'
import { Upload, CheckCircle, AlertCircle, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ParsedRow {
  date: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
}

interface CsvRawRow {
  [key: string]: string
}

export function CsvImport() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([])
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const [imported, setImported] = useState<number | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setError(null)
    setParsedRows([])
    setImported(null)

    Papa.parse<CsvRawRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const rows = results.data.map((row): ParsedRow => {
            const amountRaw = row['amount'] ?? row['tutar'] ?? row['Amount'] ?? '0'
            const amount = parseFloat(String(amountRaw).replace(',', '.').replace(/[^\d.-]/g, ''))
            const type: 'income' | 'expense' = amount >= 0 ? 'income' : 'expense'

            return {
              date:
                row['date'] ?? row['tarih'] ?? row['Date'] ?? new Date().toISOString().split('T')[0],
              description:
                row['description'] ?? row['aciklama'] ?? row['Description'] ?? row['Açıklama'] ?? 'İçe aktarılan işlem',
              amount: Math.abs(amount),
              type,
              category: type === 'income' ? 'other_income' : 'other_expense',
            }
          })
          setParsedRows(rows)
        } catch {
          setError('CSV dosyası işlenirken hata oluştu. Lütfen formatı kontrol edin.')
        }
      },
      error: () => {
        setError('CSV dosyası okunamadı.')
      },
    })
  }

  async function handleImport() {
    if (parsedRows.length === 0) return
    setImporting(true)
    setError(null)

    try {
      const response = await fetch('/api/import/csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions: parsedRows }),
      })

      const data = await response.json() as { imported?: number; error?: string }

      if (!response.ok) {
        setError(data.error ?? 'İçe aktarma başarısız')
        return
      }

      setImported(data.imported ?? 0)
      setParsedRows([])
      setFileName(null)
      router.refresh()
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 hover:border-emerald-400 rounded-xl p-12 text-center cursor-pointer transition-colors group"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
        <Upload className="w-10 h-10 text-slate-400 group-hover:text-emerald-500 mx-auto mb-4 transition-colors" />
        <h3 className="font-semibold text-slate-700 mb-2">CSV dosyası yükleyin</h3>
        <p className="text-slate-500 text-sm">
          Dosyanızı sürükleyip bırakın veya tıklayın
        </p>
        <p className="text-slate-400 text-xs mt-2">
          Desteklenen sütunlar: date, description, amount
        </p>
      </div>

      {/* CSV Format Guide */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <h4 className="font-medium text-slate-700 mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          CSV Formatı
        </h4>
        <p className="text-slate-500 text-sm mb-3">
          CSV dosyanız aşağıdaki sütunları içermelidir:
        </p>
        <div className="bg-white border border-slate-200 rounded-lg p-3 font-mono text-xs text-slate-600">
          date,description,amount<br />
          2026-01-15,Web sitesi projesi,5000<br />
          2026-01-20,Yazılım lisansı,-200
        </div>
        <p className="text-slate-400 text-xs mt-2">
          * Pozitif tutar = gelir, negatif tutar = gider
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Success */}
      {imported !== null && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-700 text-sm">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          {imported} işlem başarıyla içe aktarıldı!
        </div>
      )}

      {/* Preview */}
      {parsedRows.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-800">
              Önizleme ({parsedRows.length} işlem)
            </h3>
            <span className="text-sm text-slate-500">{fileName}</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left px-4 py-3 font-medium text-slate-600">Tarih</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600">Açıklama</th>
                    <th className="text-right px-4 py-3 font-medium text-slate-600">Tutar</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600">Tür</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parsedRows.slice(0, 10).map((row, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2.5 text-slate-600">{row.date}</td>
                      <td className="px-4 py-2.5 text-slate-800">{row.description}</td>
                      <td className={`px-4 py-2.5 text-right font-medium ${row.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                        {row.type === 'income' ? '+' : '-'}
                        {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(row.amount)}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${row.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {row.type === 'income' ? 'Gelir' : 'Gider'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parsedRows.length > 10 && (
              <div className="px-4 py-3 border-t border-slate-100 text-sm text-slate-400">
                ve {parsedRows.length - 10} işlem daha...
              </div>
            )}
          </div>

          <button
            onClick={handleImport}
            disabled={importing}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-colors"
          >
            {importing ? 'İçe Aktarılıyor...' : `${parsedRows.length} İşlemi İçe Aktar`}
          </button>
        </div>
      )}
    </div>
  )
}
