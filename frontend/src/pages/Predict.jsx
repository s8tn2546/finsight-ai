import { useState, useEffect, useCallback } from 'react'
import Card from '../components/common/Card.jsx'
import StockLineChart from '../components/charts/StockLineChart.jsx'
import { predictApi, marketApi } from '../services/api'
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react'

const TICKERS = ['AAPL', 'MSFT', 'TSLA', 'NVDA', 'AMZN', 'GOOGL', 'META', 'IBM']

export default function Predict() {
  const [ticker, setTicker] = useState('AAPL')
  const [userPrediction, setUserPrediction] = useState(null)
  const [result, setResult] = useState(null)
  const [dailyData, setDailyData] = useState(null)
  const [chartLoading, setChartLoading] = useState(true)
  const [predictLoading, setPredictLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchDailyData = useCallback(async (symbol) => {
    setChartLoading(true)
    setError(null)
    try {
      const res = await marketApi.getDaily(symbol, 30)
      const raw = (res.data?.series || []).map((d) => ({
        time: d.date || d.time,
        price: d.close ?? d.price,
      }))
      const series = raw.length > 1 ? raw.slice(0, raw.length - 1) : raw
      setDailyData(series)
    } catch (err) {
      setDailyData([])
      setError('Failed to load chart data. You can still submit a prediction.')
    } finally {
      setChartLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDailyData(ticker)
  }, [ticker, fetchDailyData])

  const handleTickerChange = (e) => {
    const next = e.target.value
    setTicker(next)
    setUserPrediction(null)
    setResult(null)
    setError(null)
    setDailyData(null)
  }

  const onPredict = async (dir) => {
    setUserPrediction(dir)
    setPredictLoading(true)
    setError(null)
    try {
      const res = await predictApi.getPrediction(ticker, dir)
      setResult(res.data)
    } catch (err) {
      setError(err?.response?.data?.error === 'predict_failed'
        ? 'Prediction failed. Market data may be unavailable.'
        : 'Failed to get AI prediction. Please try again.')
    } finally {
      setPredictLoading(false)
    }
  }

  const case_ = result?.comparison?.case
  const winner =
    result?.marketMove?.actual != null && case_
      ? case_ === 'user_correct' || case_ === 'both_correct'
        ? case_ === 'both_correct'
          ? 'Both'
          : 'You'
        : case_ === 'ai_correct'
          ? 'AI'
          : 'Neither'
      : null

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <label htmlFor="ticker" className="text-sm text-white/70">
            Stock
          </label>
          <select
            id="ticker"
            value={ticker}
            onChange={handleTickerChange}
            className="rounded-lg border border-white/10 bg-secondary px-3 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-accent"
          >
            {TICKERS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPredict('UP')}
            disabled={predictLoading}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-black hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
          >
            {predictLoading && userPrediction === 'UP' ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <TrendingUp className="w-4 h-4 mr-2" />
            )}
            Predict UP
          </button>
          <button
            onClick={() => onPredict('DOWN')}
            disabled={predictLoading}
            className="inline-flex items-center justify-center rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50"
          >
            {predictLoading && userPrediction === 'DOWN' ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-2" />
            )}
            Predict DOWN
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <Card title={`${ticker} — Price up to day-before-yesterday`}>
        <StockLineChart data={dailyData} loading={chartLoading} />
      </Card>

      {(predictLoading || result) && (
        <div className="grid grid-cols-1 gap-6">
          <Card title="Comparison">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5">
                <div className="text-slate-400 text-sm font-medium mb-2">Your prediction</div>
                {predictLoading ? (
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-bold">...</span>
                  </div>
                ) : (
                  <div
                    className={`text-2xl font-black ${userPrediction === 'UP' ? 'text-primary' : 'text-red-400'}`}
                  >
                    {userPrediction}
                  </div>
                )}
              </div>
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5">
                <div className="text-slate-400 text-sm font-medium mb-2">AI prediction</div>
                {predictLoading ? (
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-bold">...</span>
                  </div>
                ) : (
                  <div>
                    <div
                      className={`text-2xl font-black ${result?.ai?.prediction === 'UP' ? 'text-primary' : 'text-red-400'}`}
                    >
                      {result?.ai?.prediction ?? '—'}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Confidence: {result?.ai?.confidence != null ? (result.ai.confidence * 100).toFixed(1) : '—'}%
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5">
                <div className="text-slate-400 text-sm font-medium mb-2">Actual outcome</div>
                {predictLoading ? (
                  <div className="flex items-center gap-2 text-slate-500">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-bold">...</span>
                  </div>
                ) : (
                  <div>
                    <div
                      className={`text-2xl font-black ${
                        result?.marketMove?.actual === 'UP'
                          ? 'text-primary'
                          : result?.marketMove?.actual === 'DOWN'
                            ? 'text-red-400'
                            : 'text-slate-400'
                      }`}
                    >
                      {result?.marketMove?.actual ?? '—'}
                    </div>
                    {winner && (
                      <div className="text-xs text-slate-500 mt-1">
                        Winner: <span className="font-bold text-white">{winner}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {result && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Market result">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                    <span className="text-slate-400">Actual direction</span>
                    <span
                      className={`font-bold ${
                        result.marketMove.actual === 'UP'
                          ? 'text-primary'
                          : result.marketMove.actual === 'DOWN'
                            ? 'text-red-400'
                            : 'text-slate-400'
                      }`}
                    >
                      {result.marketMove.actual}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                    <span className="text-slate-400">Performance</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        result.comparison?.case?.includes('correct')
                          ? 'bg-primary/20 text-primary'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {result.comparison?.case?.replace('_', ' ') ?? '—'}
                    </span>
                  </div>
                </div>
              </Card>
              <Card title="AI analysis">
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  {result.explanation ?? 'No explanation available.'}
                </p>
                <div className="pt-2 flex flex-wrap gap-2 mt-2">
                  {result.hybrid?.dominantSignal && (
                    <span className="px-2 py-1 rounded bg-white/5 text-[10px] font-bold text-slate-500 uppercase">
                      Dominant: {result.hybrid.dominantSignal}
                    </span>
                  )}
                  {result.comparison?.case && (
                    <span className="px-2 py-1 rounded bg-white/5 text-[10px] font-bold text-slate-500 uppercase">
                      Case: {result.comparison.case}
                    </span>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
