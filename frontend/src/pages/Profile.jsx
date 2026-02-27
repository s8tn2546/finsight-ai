import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/common/Card.jsx'
import ProgressBar from '../components/common/ProgressBar.jsx'
import AllocationPieChart from '../components/charts/AllocationPieChart.jsx'
import { formatCurrency, formatPercent } from '../services/format.js'
import { userApi, portfolioApi } from '../services/api'
import { useAuth } from '../routes/AuthContext'
import {
  BookOpen,
  Award,
  TrendingUp,
  TrendingDown,
  PieChart,
  Loader2,
  User,
  Target,
  BarChart3,
  Briefcase,
} from 'lucide-react'

const TOTAL_LESSONS = 3

export default function Profile() {
  const { user: authUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [portfolioData, setPortfolioData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const userId = authUser?._id ?? authUser?.id

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }
    let cancelled = false
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const [profileRes, portfolioRes] = await Promise.all([
          userApi.getProfile(),
          portfolioApi.getPortfolio(userId).catch(() => ({ data: null })),
        ])
        if (!cancelled) {
          setProfile(profileRes.data)
          setPortfolioData(portfolioRes.data ?? null)
        }
      } catch (err) {
        if (!cancelled) setError('Failed to load profile data.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => { cancelled = true }
  }, [userId])

  const completedCount = profile?.completedLessons?.length ?? 0
  const learningProgress = TOTAL_LESSONS ? (completedCount / TOTAL_LESSONS) * 100 : 0
  const allocation = portfolioData?.analytics?.allocationPercentages
    ? Object.entries(portfolioData.analytics.allocationPercentages).map(([name, value]) => ({
        name,
        value: Math.round((value || 0) * 100),
      }))
    : []

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-white">Profile</h1>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Profile header */}
      <Card className="overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10">
            <User className="h-10 w-10 text-primary" />
          </div>
          <div className="flex-1 text-center sm:text-left min-w-0">
            <h2 className="text-xl font-bold text-white truncate">
              {profile?.name || authUser?.name || 'Investor'}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5 truncate">
              {profile?.email || authUser?.email || '—'}
            </p>
            {profile?.riskTolerance && (
              <p className="text-xs font-medium text-slate-400 mt-2 uppercase tracking-wider">
                Risk: {profile.riskTolerance}
              </p>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Learning progress */}
        <Card title="Learning progress">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2.5">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Lessons completed</p>
                  <p className="text-xs text-slate-500">Stock basics, indicators, risk</p>
                </div>
              </div>
              <span className="text-2xl font-black text-primary">
                {completedCount}<span className="text-slate-500 text-sm">/{TOTAL_LESSONS}</span>
              </span>
            </div>
            <ProgressBar value={learningProgress} />
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-slate-300">Quizzes passed</span>
              </div>
              <span className="text-sm font-bold text-white">{completedCount}</span>
            </div>
            {profile?.quizResults?.length > 0 && (
              <div className="pt-4 border-t border-white/5 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Quiz scores</p>
                {profile.quizResults.map((q, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-slate-400 truncate mr-2">{q.lessonId?.replace(/-/g, ' ') || `Quiz ${i + 1}`}</span>
                    <span className="text-white font-bold">{q.score}% ({q.correct}/{q.total})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Prediction history (summary – no backend history yet) */}
        <Card title="Prediction history">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-xl bg-slate-800/50 p-4 mb-4">
              <BarChart3 className="h-10 w-10 text-slate-500 mx-auto" />
            </div>
            <p className="text-sm font-medium text-white mb-1">User vs AI accuracy</p>
            <p className="text-xs text-slate-500 max-w-[260px]">
              Use the Predict page to make forecasts. Your accuracy summary will appear here as you build history.
            </p>
            <Link
              to="/predict"
              className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
            >
              <Target className="h-4 w-4" />
              Go to Predict
            </Link>
          </div>
        </Card>
      </div>

      {/* Portfolio insights */}
      <Card title="Portfolio insights">
        {portfolioData?.analytics ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Total investment
                </p>
                <p className="text-xl font-black text-white">
                  {formatCurrency(portfolioData.analytics.totalInvestment ?? 0)}
                </p>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Current value
                </p>
                <p className="text-xl font-black text-white">
                  {formatCurrency(portfolioData.analytics.currentValue ?? 0)}
                </p>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  P/L
                </p>
                <p
                  className={`text-xl font-black flex items-center gap-1 ${
                    (portfolioData.analytics.profitLoss ?? 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {(portfolioData.analytics.profitLoss ?? 0) >= 0 ? (
                    <TrendingUp className="h-5 w-5" />
                  ) : (
                    <TrendingDown className="h-5 w-5" />
                  )}
                  {formatCurrency(portfolioData.analytics.profitLoss ?? 0)}
                </p>
                {portfolioData.analytics.totalInvestment > 0 && (
                  <p
                    className={`text-xs font-bold mt-0.5 ${
                      (portfolioData.analytics.profitLoss ?? 0) >= 0 ? 'text-emerald-400/80' : 'text-red-400/80'
                    }`}
                  >
                    {formatPercent(
                      (portfolioData.analytics.profitLoss / portfolioData.analytics.totalInvestment) * 100
                    )}
                  </p>
                )}
              </div>
            </div>
            {allocation.length > 0 && (
              <div className="pt-4 border-t border-white/5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  Allocation
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <div className="w-full sm:max-w-[240px] mx-auto aspect-square">
                    <AllocationPieChart data={allocation} height={240} innerRadius={60} outerRadius={90} />
                  </div>
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
                    {allocation.slice(0, 6).map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/5"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(99,211,242,0.5)]" />
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 truncate uppercase">
                            {item.name}
                          </p>
                          <p className="text-sm font-black text-white">{item.value}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="rounded-xl bg-slate-800/50 p-4 mb-4">
              <Briefcase className="h-10 w-10 text-slate-500 mx-auto" />
            </div>
            <p className="text-sm font-medium text-white mb-1">No portfolio data yet</p>
            <p className="text-xs text-slate-500 max-w-[280px]">
              Add holdings in the Portfolio page to see total investment, P/L, and allocation here.
            </p>
            <Link
              to="/portfolio"
              className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
            >
              Go to Portfolio
            </Link>
          </div>
        )}
      </Card>
    </div>
  )
}
