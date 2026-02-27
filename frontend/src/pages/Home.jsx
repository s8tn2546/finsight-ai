import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Card from '../components/common/Card.jsx'
import StatCard from '../components/common/StatCard.jsx'
import StockLineChart from '../components/charts/StockLineChart.jsx'
import AllocationPieChart from '../components/charts/AllocationPieChart.jsx'
import AccuracyBarChart from '../components/charts/AccuracyBarChart.jsx'
import MultiStockBarChart from '../components/charts/MultiStockBarChart.jsx'
import { formatCurrency, formatPercent } from '../services/format.js'
import { portfolioApi, newsApi } from '../services/api'
import { useAuth } from '../routes/AuthContext'
import { Loader2 } from 'lucide-react'

const SENTIMENT_SYMBOL = 'AAPL'

export default function Dashboard() {
  const { user } = useAuth()
  const userId = user?._id ?? user?.id
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [sentiment, setSentiment] = useState(null)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])

  const fetchDashboardData = useCallback(async () => {
    if (!userId) return
    setError(null)
    try {
      setLoading(true)
      const [portfolioRes, newsRes, histRes] = await Promise.all([
        portfolioApi.getPortfolio(userId),
        newsApi.getNews(SENTIMENT_SYMBOL).catch(() => ({ data: null })),
        portfolioApi.getHistory(userId).catch(() => ({ data: { series: [] } })),
      ])
      setData(portfolioRes.data)
      setSentiment(newsRes.data?.sentiment ?? null)
      setHistory(histRes.data?.series ?? [])
    } catch (err) {
      setError('Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (userId) {
      fetchDashboardData()
    } else {
      setLoading(false)
    }
  }, [userId, fetchDashboardData])

  const allocData = useMemo(() => {
    return data?.analytics?.allocationPercentages
      ? Object.entries(data.analytics.allocationPercentages)
          .map(([name, value]) => ({
            name,
            value: Math.round((value || 0) * 100),
          }))
          .filter((d) => d.value > 0)
      : []
  }, [data?.analytics?.allocationPercentages])

  const lineData = useMemo(() => {
    return history && history.length > 0
      ? history.map((d) => ({ time: d.time || d.date, price: d.price }))
      : []
  }, [history])

  const barData = useMemo(() => {
    return data?.analytics?.bySymbolValues
      ? Object.entries(data.analytics.bySymbolValues).map(([symbol, value]) => ({
          symbol,
          value: Number(value.toFixed(2)),
        }))
      : []
  }, [data?.analytics?.bySymbolValues])

  const sentimentLabel = sentiment
    ? sentiment.sentiment_score > 0.2
      ? 'Bullish'
      : sentiment.sentiment_score < -0.2
        ? 'Bearish'
        : 'Neutral'
    : '—'
  const sentimentSub = sentiment
    ? `Score ${(sentiment.sentiment_score * 100).toFixed(0)}% · Impact ${sentiment.impact_strength ?? 5}/10`
    : 'No data'

  const stats = [
    {
      label: 'Portfolio Value',
      value: data?.analytics?.currentValue != null ? formatCurrency(data.analytics.currentValue) : formatCurrency(0),
    },
    {
      label: 'System Accuracy',
      value: '—',
      subvalue: 'Use Predict to build history',
      accent: true,
    },
    {
      label: 'Market Sentiment',
      value: sentimentLabel,
      subvalue: sentimentSub,
    },
    {
      label: 'Risk Score',
      value: data?.analytics?.riskScore != null ? (data.analytics.riskScore * 10).toFixed(1) : '0.0',
      subvalue:
        data?.analytics?.riskScore < 0.3
          ? 'Low Risk'
          : data?.analytics?.riskScore < 0.6
            ? 'Moderate'
            : 'High Risk',
    },
  ]

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
          <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">
            Welcome back, {user?.name || user?.email}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 rounded-lg bg-slate-900 border border-white/5 text-[10px] font-black text-primary uppercase">
            Market: Open
          </div>
          <div className="px-3 py-1 rounded-lg bg-slate-900 border border-white/5 text-[10px] font-black text-cyan-400 uppercase">
            AI: Optimal
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} subvalue={s.subvalue} accent={s.accent} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Portfolio Growth Engine" className="lg:col-span-2">
          <div className="h-[350px]">
            <StockLineChart data={lineData} loading={loading} />
          </div>
        </Card>
        <div className="space-y-6">
          <Card title="Asset Distribution">
            <div className="py-2">
              <AllocationPieChart data={allocData} loading={loading} />
            </div>
          </Card>
          <Card title="Holdings Value">
            <MultiStockBarChart data={barData} loading={loading} />
          </Card>
        </div>
      </div>
    </div>
  )
}
