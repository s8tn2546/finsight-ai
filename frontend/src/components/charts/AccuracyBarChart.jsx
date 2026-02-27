import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

export default function AccuracyBarChart({ data, loading = false }) {
  const hasData = Array.isArray(data) && data.length > 0

  if (loading) {
    return (
      <div className="h-80 w-full flex items-center justify-center text-slate-500">
        <span className="text-sm font-medium animate-pulse">Loading...</span>
      </div>
    )
  }

  if (!hasData) {
    return (
      <div className="h-80 w-full flex items-center justify-center text-slate-500">
        <span className="text-sm">No accuracy data yet. Use Predict to build history.</span>
      </div>
    )
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="month" stroke="rgba(248,250,252,0.6)" tickLine={false} />
          <YAxis stroke="rgba(248,250,252,0.6)" tickLine={false} domain={[0, 100]} />
          <Tooltip
            contentStyle={{ background: '#1D283A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#F8FAFC' }}
          />
          <Legend wrapperStyle={{ color: '#F8FAFC' }} />
          <Bar dataKey="user" name="User" fill="#22C4D3" radius={[6, 6, 0, 0]} />
          <Bar dataKey="ai" name="AI" fill="#63D3F2" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
