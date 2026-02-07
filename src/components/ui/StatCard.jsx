export function StatCard({ title, value, icon: Icon, trend, trendValue, color = 'brand' }) {
  const colors = {
    brand: 'bg-brand-50 text-brand-600',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600'
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h4 className="text-2xl font-bold text-gray-900 mt-2">{value}</h4>
        </div>
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon size={24} />
        </div>
      </div>
      {(trend || trendValue) && (
        <div className="mt-4 flex items-center text-sm">
          <span className={trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
          <span className="text-gray-400 mx-2">مقارنة بالشهر الماضي</span>
        </div>
      )}
    </div>
  )
}
