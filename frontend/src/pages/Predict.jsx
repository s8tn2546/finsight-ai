import { useState, useEffect } from 'react'
import Card from '../components/common/Card.jsx'
import StockLineChart from '../components/charts/StockLineChart.jsx'
import { predictApi } from '../services/api'
import { Loader2, TrendingUp, TrendingDown, Info, Cpu, User } from 'lucide-react'

const TICKERS = ['AAPL', 'MSFT', 'TSLA', 'NVDA', 'AMZN', 'GOOGL', 'META', 'IBM']

export default function Predict() {
  const [ticker, setTicker] = useState('AAPL')
  const [userPrediction, setUserPrediction] = useState(null)
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const onPredict = async (dir) => {
    setUserPrediction(dir)
    setIsLoading(true)
    setError(null)
    try {
      const res = await predictApi.getPrediction(ticker, dir)
      setResult(res.data)
    } catch (err) {
      setError('Failed to get AI prediction. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Mock series for chart - in a real app, this would come from an API
  const mockSeries = Array.from({ length: 30 }).map((_, i) => ({
    time: `Day ${i + 1}`,
    price: 150 + Math.sin(i / 5) * 10 + i * 0.5
  }))

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
            onChange={(e) => setTicker(e.target.value)}
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
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-black hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
          >
            {isLoading && userPrediction === 'UP' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <TrendingUp className="w-4 h-4 mr-2" />}
            Predict UP
          </button>
          <button
            onClick={() => onPredict('DOWN')}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50"
          >
            {isLoading && userPrediction === 'DOWN' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <TrendingDown className="w-4 h-4 mr-2" />}
            Predict DOWN
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
          <Info className="w-5 h-5" />
          {error}
        </div>
      )}

      <Card title={`${ticker} Price History`}>
        <StockLineChart data={mockSeries} />
      </Card>

      {(isLoading || result) && (
        <div className="grid grid-cols-1 gap-6">
          <Card title="Market Sentiment & AI Signal">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* AI Signal */}
              <div className="relative p-6 rounded-2xl bg-slate-900/50 border border-white/5 overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Cpu className="w-12 h-12" />
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm font-medium mb-4">
                  <Cpu className="w-4 h-4" /> AI Engine Signal
                </div>
                {isLoading ? (
                  <div className="flex items-center gap-3 text-cyan-400">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-xl font-bold italic animate-pulse">ANALYZING...</span>
                  </div>
                ) : (
                  <div>
                    <div className={`text-3xl font-black tracking-tighter mb-1 ${result.ai.prediction === 'UP' ? 'text-primary' : 'text-red-400'}`}>
                      {result.ai.prediction}
                    </div>
                    <div className="text-sm text-slate-500">Confidence: {(result.ai.confidence * 100).toFixed(1)}%</div>
                  </div>
                )}
              </div>

              {/* User Signal */}
              <div className="relative p-6 rounded-2xl bg-slate-900/50 border border-white/5 overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <User className="w-12 h-12" />
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm font-medium mb-4">
                  <User className="w-4 h-4" /> Your Prediction
                </div>
                <div className={`text-3xl font-black tracking-tighter ${userPrediction === 'UP' ? 'text-primary' : 'text-red-400'}`}>
                  {userPrediction}
                </div>
              </div>

              {/* Hybrid Score */}
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <TrendingUp className="w-12 h-12" />
                </div>
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium mb-4">
                  <TrendingUp className="w-4 h-4" /> Hybrid Score
                </div>
                {isLoading ? (
                  <div className="flex items-center gap-3 text-cyan-400">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-xl font-bold italic animate-pulse">CALCULATING...</span>
                  </div>
                ) : (
                  <div>
                    <div className="text-3xl font-black tracking-tighter text-white">
                      {(result.hybrid.hybridScore * 100).toFixed(1)}
                    </div>
                    <div className="text-sm text-slate-400">Dominant: {result.hybrid.dominantSignal}</div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {result && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Market Move Result">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                    <span className="text-slate-400">Actual Market Direction</span>
                    <span className={`font-bold ${result.marketMove.actual === 'UP' ? 'text-primary' : result.marketMove.actual === 'DOWN' ? 'text-red-400' : 'text-slate-400'}`}>
                      {result.marketMove.actual}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                    <span className="text-slate-400">Performance Check</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${result.comparison.case.includes('correct') ? 'bg-primary/20 text-primary' : 'bg-red-500/20 text-red-400'}`}>
                      {result.comparison.case.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </Card>

              <Card title="AI Strategic Analysis">
                <div className="space-y-4">
                  <p className="text-sm text-slate-300 leading-relaxed italic">
                    "{result.explanation}"
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2">
                    <span className="px-2 py-1 rounded bg-white/5 text-[10px] font-bold text-slate-500 uppercase">
                      Dominant: {result.hybrid.dominantSignal}
                    </span>
                    <span className="px-2 py-1 rounded bg-white/5 text-[10px] font-bold text-slate-500 uppercase">
                      Case: {result.comparison.case}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
