import { useState, useEffect, useCallback } from 'react'
import Card from '../components/common/Card.jsx'
import ProgressBar from '../components/common/ProgressBar.jsx'
import AllocationPieChart from '../components/charts/AllocationPieChart.jsx'
import { formatCurrency, formatNumber, formatPercent } from '../services/format.js'
import { portfolioApi, marketApi } from '../services/api'
import { useAuth } from '../routes/AuthContext'
import { Plus, Loader2, TrendingUp } from 'lucide-react'

export default function Portfolio() {
  const { user } = useAuth()
  const userId = user?._id ?? user?.id
  const [symbol, setSymbol] = useState('')
  const [qty, setQty] = useState('')
  const [buy, setBuy] = useState('')
  const [portfolioData, setPortfolioData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [priceLoading, setPriceLoading] = useState(false)

  const fetchPortfolio = useCallback(async () => {
    if (!userId) return
    try {
      setIsLoading(true)
      setError(null)
      const res = await portfolioApi.getPortfolio(userId)
      setPortfolioData(res.data)
    } catch (err) {
      setError('Failed to load portfolio.')
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (userId) {
      fetchPortfolio()
    } else {
      setIsLoading(false)
    }
  }, [userId, fetchPortfolio])

  // Auto fill buy price when symbol changes (debounced)
  useEffect(() => {
    if (!symbol) return
    const s = symbol.trim().toUpperCase()
    if (!/^[A-Z.-]{1,6}$/.test(s)) return
    let timer = setTimeout(async () => {
      setPriceLoading(true)
      try {
        const res = await marketApi.getDaily(s, 2)
        const series = res.data?.series || []
        const last = series[series.length - 1]?.close ?? series[series.length - 1]?.price
        if (last != null) {
          setBuy((prev) => (prev ? prev : String(Number(last).toFixed(2))))
        }
      } catch {
        // ignore
      } finally {
        setPriceLoading(false)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [symbol])

  const addHolding = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const sym = symbol?.trim().toUpperCase()
    const quantity = Number(qty)
    const buyPrice = Number(buy)

    if (!sym || !/^[A-Z.-]{1,6}$/.test(sym)) {
      setError('Symbol is required.')
      return
    }
    if (!(quantity > 0)) {
      setError('Quantity must be greater than 0.')
      return
    }
    if (!(buyPrice > 0)) {
      setError('Buy price must be greater than 0.')
      return
    }

    setIsAdding(true)
    try {
      await portfolioApi.addHolding(userId, {
        symbol: sym,
        quantity,
        buyPrice,
      })
      setSymbol('')
      setQty('')
      setBuy('')
      setSuccess('Asset added. Portfolio updated.')
      await fetchPortfolio()
    } catch (err) {
      setError(err?.response?.data?.error === 'portfolio_add_failed' ? 'Failed to add holding. Please try again.' : 'Failed to add holding.')
    } finally {
      setIsAdding(false)
    }
  }

  const allocation =
    portfolioData?.analytics?.allocationPercentages != null
      ? Object.entries(portfolioData.analytics.allocationPercentages)
          .map(([name, value]) => ({
            name,
            value: Math.round((value || 0) * 100),
          }))
          .filter((d) => d.value > 0)
      : []

  const hasHoldings = portfolioData?.holdings?.length > 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-white">Portfolio Analyzer</h2>
        <div className="flex items-center gap-2">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
          <button
            onClick={fetchPortfolio}
            className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Add Asset" className="lg:col-span-2">
          <form onSubmit={addHolding} className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="sm:col-span-1">
              <label htmlFor="symbol" className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Symbol
              </label>
              <input
                id="symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="e.g. AAPL"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="qty" className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Quantity
              </label>
              <input
                id="qty"
                type="number"
                min="0"
                step="any"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="buy" className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Buy Price
              </label>
              <input
                id="buy"
                type="number"
                min="0"
                step="0.01"
                value={buy}
                onChange={(e) => setBuy(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              {priceLoading && <div className="text-[10px] text-slate-500 mt-1">Fetching latest price…</div>}
            </div>
            <div className="flex items-end sm:col-span-1">
              <button
                type="submit"
                disabled={isAdding || !userId}
                className="w-full h-[42px] rounded-xl bg-primary text-secondary font-black uppercase tracking-widest text-xs hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add Asset
              </button>
            </div>
          </form>
        </Card>

        <Card title="Risk Analysis">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 text-left">
                  Overall Risk
                </div>
                <div className="text-2xl font-black text-white">
                  {portfolioData?.analytics?.riskScore != null
                    ? (portfolioData.analytics.riskScore * 10).toFixed(1)
                    : '0.0'}
                  <span className="text-slate-600 text-sm">/10</span>
                </div>
              </div>
            </div>
            <ProgressBar value={(portfolioData?.analytics?.riskScore ?? 0) * 100} />
            <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-bold tracking-tight text-left">
              {portfolioData?.analytics?.riskScore < 0.4
                ? 'Your portfolio is well-diversified. Risk levels are optimal.'
                : 'High concentration detected. Consider diversifying across more sectors.'}
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Active Holdings" className="lg:col-span-2">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm border-separate border-spacing-y-2">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  <th className="px-4 py-2">Asset</th>
                  <th className="px-4 py-2 text-right">Quantity</th>
                  <th className="px-4 py-2 text-right">Avg Buy</th>
                  <th className="px-4 py-2 text-right">Market P/L</th>
                  <th className="px-4 py-2 text-right">Weight</th>
                </tr>
              </thead>
              <tbody className="before:block before:h-2">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-500 italic">
                      Loading your assets...
                    </td>
                  </tr>
                ) : hasHoldings ? (
                  portfolioData.holdings.map((h, i) => {
                    const weight = portfolioData.analytics?.allocationPercentages?.[h.symbol] ?? 0
                    return (
                      <tr key={i} className="bg-white/[0.02] hover:bg-white/[0.05] transition-all rounded-xl">
                        <td className="px-4 py-4 rounded-l-xl">
                          <div className="font-black text-white">{h.symbol}</div>
                          <div className="text-[10px] text-slate-500 uppercase font-bold">Equity</div>
                        </td>
                        <td className="px-4 py-4 text-right font-mono text-slate-300">
                          {formatNumber(h.quantity)}
                        </td>
                        <td className="px-4 py-4 text-right font-mono text-slate-300">
                          {formatCurrency(h.buyPrice)}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-primary font-bold">Live</span>
                        </td>
                        <td className="px-4 py-4 text-right rounded-r-xl">
                          <span className="inline-block px-2 py-1 rounded bg-slate-800 text-[10px] font-black text-white">
                            {(weight * 100).toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-500 italic">
                      No holdings yet. Add an asset above to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Sector Allocation">
          <div className="flex flex-col items-center justify-center py-4">
            <AllocationPieChart data={allocation} loading={isLoading} />
            <div className="mt-6 w-full grid grid-cols-2 gap-3">
              {allocation.slice(0, 4).map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(99,211,242,0.5)]" />
                  <div className="flex-1 overflow-hidden">
                    <div className="text-[10px] font-bold text-slate-400 truncate uppercase">{item.name}</div>
                    <div className="text-xs font-black text-white">{item.value}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
