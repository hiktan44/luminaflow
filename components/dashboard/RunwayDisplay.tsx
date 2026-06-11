interface RunwayDisplayProps {
  runway: { months: number; isHealthy: boolean; isWarning: boolean }
}

export function RunwayDisplay({ runway }: RunwayDisplayProps) {
  const { months, isHealthy, isWarning } = runway
  
  // 12+ ay için %100, altında kademeli azalma
  const barWidth = Math.min((months / 12) * 100, 100)
  
  const getColor = () => {
    if (isHealthy) return 'bg-emerald-500'
    if (isWarning) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getDisplayText = () => {
    if (months >= 12) {
      const years = Math.floor(months / 12)
      const remainingMonths = months % 12
      if (remainingMonths === 0) {
        return `${years} yıl+`
      }
      return `${years}y ${remainingMonths}ay+`
    }
    return `${months.toFixed(1)} ay`
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-700">Runway (Yaşam Süresi)</h3>
        <span className="text-2xl font-bold text-slate-900">
          {getDisplayText()}
        </span>
      </div>
      
      <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${getColor()}`}
          style={{ width: `${barWidth}%` }}
        />
      </div>
      
      <p className="text-slate-500 text-sm">
        Mevcut harcama hızında {getDisplayText()} sürebilirsiniz
        {months >= 12 && (
          <span className="block text-emerald-600 font-medium mt-1">
            ✓ Mükemmel finansal sağlık
          </span>
        )}
      </p>
    </div>
  )
}