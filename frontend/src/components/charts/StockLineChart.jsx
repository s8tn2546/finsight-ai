import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

export default function StockLineChart({ data, color = '#63D3F2' }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="time" stroke="rgba(248,250,252,0.6)" tickLine={false} />
          <YAxis stroke="rgba(248,250,252,0.6)" tickLine={false} domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{ background: '#1D283A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#F8FAFC' }}
            labelStyle={{ color: '#F8FAFC' }}
          />
          <Line type="monotone" dataKey="price" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
