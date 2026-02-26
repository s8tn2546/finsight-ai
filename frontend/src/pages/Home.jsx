import React, { useState, useEffect } from 'react'
import Card from '../components/common/Card.jsx'
import StatCard from '../components/common/StatCard.jsx'
import StockLineChart from '../components/charts/StockLineChart.jsx'
import AllocationPieChart from '../components/charts/AllocationPieChart.jsx'
import AccuracyBarChart from '../components/charts/AccuracyBarChart.jsx'
import { formatCurrency, formatPercent } from '../services/format.js'
import { portfolioApi } from '../services/api'
import { useAuth } from '../routes/AuthContext'
import { Loader2 } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const res = await portfolioApi.getPortfolio(user.id)
      setData(res.data)
    } catch (err) {
      setError('Failed to load portfolio data')
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    { 
      label: 'Portfolio Value', 
      value: data ? formatCurrency(data.analytics.currentValue) : formatCurrency(0) 
    },
    { 
      label: "System Accuracy", 
      value: '74.2%', 
      subvalue: 'Top 5% of Users',
      accent: true 
    },
    { 
      label: 'Market Sentiment', 
      value: 'Bullish', 
      subvalue: 'Strong Momentum' 
    },
    { 
      label: 'Risk Score', 
      value: data ? (data.analytics.riskScore * 10).toFixed(1) : '0.0', 
      subvalue: data?.analytics.riskScore < 0.3 ? 'Low Risk' : data?.analytics.riskScore < 0.6 ? 'Moderate' : 'High Risk' 
    },
  ]

  const allocData = data ? Object.entries(data.analytics.allocationPercentages).map(([name, value]) => ({
    name,
    value: Math.round(value * 100)
  })) : []

  const accuracyData = [
    { month: 'Jan', user: 58, ai: 66 },
    { month: 'Feb', user: 61, ai: 68 },
    { month: 'Mar', user: 60, ai: 70 },
    { month: 'Apr', user: 62, ai: 71 },
    { month: 'May', user: 63, ai: 73 },
    { month: 'Jun', user: 64, ai: 74 },
  ]

  const lineData = Array.from({ length: 30 }).map((_, i) => ({
    time: `Day ${i + 1}`,
    price: 100 + Math.sin(i / 5) * 6 + i * 0.8,
  }))

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm font-bold uppercase tracking-widest animate-pulse">Syncing Financial Data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">Intelligence Terminal</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Welcome back, {user?.name || user?.email}</p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 rounded-lg bg-slate-900 border border-white/5 text-[10px] font-black text-primary uppercase">Market: Open</div>
          <div className="px-3 py-1 rounded-lg bg-slate-900 border border-white/5 text-[10px] font-black text-cyan-400 uppercase">AI: Optimal</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} subvalue={s.subvalue} accent={s.accent} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Portfolio Growth Engine" className="lg:col-span-2">
          <div className="h-[350px]">
            <StockLineChart data={lineData} />
          </div>
        </Card>
        <div className="space-y-6">
          <Card title="Asset Distribution">
            <div className="py-2">
              <AllocationPieChart data={allocData} />
            </div>
          </Card>
          <Card title="System Performance">
            <AccuracyBarChart data={accuracyData} />
          </Card>
        </div>
      </div>
    </div>
  )
}
