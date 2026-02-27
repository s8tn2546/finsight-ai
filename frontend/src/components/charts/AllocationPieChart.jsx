import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const COLORS = ['#63D3F2', '#22C4D3', '#4ADE80', '#F59E0B', '#A78BFA']

export default function AllocationPieChart({ data, loading = false, height = 320, innerRadius = 50, outerRadius = 90 }) {
  const hasData = Array.isArray(data) && data.length > 0

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center text-slate-500" style={{ height }}>
        <span className="text-sm font-medium animate-pulse">Loading...</span>
      </div>
    )
  }

  if (!hasData) {
    return (
      <div className="w-full flex items-center justify-center text-slate-500" style={{ height }}>
        <span className="text-sm">No allocation data</span>
      </div>
    )
  }

  return (
    <div className="w-full flex items-center justify-center" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            stroke="rgba(255,255,255,0.08)"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#1D283A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#F8FAFC' }}
          />
          <Legend verticalAlign="bottom" align="center" wrapperStyle={{ color: '#F8FAFC' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
