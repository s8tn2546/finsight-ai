import { useState, useEffect, useCallback, useRef } from 'react'
import Card from '../components/common/Card.jsx'
import SentimentIndicator from '../components/news/SentimentIndicator.jsx'
import { newsApi } from '../services/api'
import { Loader2, Search, Bell } from 'lucide-react'
import { io } from 'socket.io-client'

export default function News() {
  const [symbol, setSymbol] = useState('AAPL')
  const [newsData, setNewsData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [alert, setAlert] = useState(null)
  const seenAlertsRef = useRef(new Set())
  const debounceTimer = useRef(null)
  const socketRef = useRef(null)

  const fetchNews = useCallback(async (sym) => {
    const s = (sym || symbol).toUpperCase().trim()
    if (!s) return
    setIsLoading(true)
    setError(null)
    try {
      const res = await newsApi.getNews(s)
      console.log('[News] fetched', s, res.data?.sentiment)
      setNewsData(res.data)
    } catch {
      setError('Failed to fetch news. Please try again later.')
      setNewsData(null)
    } finally {
      setIsLoading(false)
    }
  }, [symbol])

  useEffect(() => {
    fetchNews('AAPL')
  }, [fetchNews])

  // Debounce on symbol change
  useEffect(() => {
    if (!symbol) return
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      setNewsData(null)
      setError(null)
      fetchNews(symbol)
    }, 400)
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [symbol, fetchNews])

  // Socket alerts
  useEffect(() => {
    const s = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000')
    socketRef.current = s
    s.on('news_alert', (payload) => {
      const key = payload?.id || `${payload?.symbol}-${payload?.ts}`
      if (key && !seenAlertsRef.current.has(key)) {
        seenAlertsRef.current.add(key)
        setAlert(payload)
        if (navigator?.vibrate) navigator.vibrate(10)
        // optional subtle sound
        try {
          const audio = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=')
          audio.volume = 0.1
          audio.play().catch(() => {})
        } catch {
          // ignore audio errors
        }
      }
    })
    return () => {
      s.close()
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const s = symbol.toUpperCase().trim()
    if (s) fetchNews(s)
  }

  const sentiment = newsData?.sentiment
  const scoreNorm = sentiment?.sentiment_score != null
    ? (sentiment.sentiment_score + 1) * 50
    : 50
  const sentimentLabel =
    sentiment?.sentiment_score > 0.2
      ? 'Bullish'
      : sentiment?.sentiment_score < -0.2
        ? 'Bearish'
        : 'Neutral'
  const sentimentColor =
    sentiment?.sentiment_score > 0.2
      ? 'text-emerald-400'
      : sentiment?.sentiment_score < -0.2
        ? 'text-red-400'
        : 'text-amber-400'

  return (
    <div className="space-y-6">
      {alert && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-amber-400" />
            <div className="text-xs">
              <span className="font-bold text-white mr-2">{alert.symbol}</span>
              <span className="text-slate-300">{alert.message}</span>
            </div>
          </div>
          <button
            onClick={() => setAlert(null)}
            className="text-[10px] font-bold uppercase tracking-widest text-amber-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}
      <div className="flex items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="Symbol (e.g. AAPL, TSLA)..."
            className="w-full bg-secondary/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </form>
        <button
          onClick={() => fetchNews(symbol)}
          disabled={isLoading}
          className="bg-primary text-secondary font-bold px-6 py-2 rounded-xl hover:bg-white transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Market Headlines" className="lg:col-span-1">
          <div className="max-h-[34rem] space-y-3 overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm font-medium animate-pulse">Fetching latest updates...</p>
              </div>
            ) : newsData?.headlines?.length > 0 ? (
              newsData.headlines.map((headline, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all"
                >
                  <p className="text-sm text-slate-200 leading-relaxed font-medium">{headline}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-slate-500">
                <p>No news found for {symbol}</p>
              </div>
            )}
          </div>
        </Card>

        <Card title="AI Intelligence" className="lg:col-span-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-sm font-medium">Analyzing sentiment...</p>
            </div>
          ) : newsData?.sentiment ? (
            <div className="space-y-8 p-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5">
                  <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">
                    Sentiment score
                  </div>
                  <SentimentIndicator score={scoreNorm} />
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm text-slate-500 font-medium">Impact strength</span>
                    <span className="text-lg font-bold text-white">
                      {sentiment.impact_strength ?? '—'}/10
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-2">
                      Primary sentiment
                    </div>
                    <div className={`text-xl font-bold ${sentimentColor}`}>{sentimentLabel}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-2">
                      Raw score
                    </div>
                    <div className="text-xl font-bold text-white">
                      {(sentiment.sentiment_score ?? 0).toFixed(2)} (-1 to 1)
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                  AI summary
                </div>
                <div className="p-6 rounded-2xl bg-slate-900/50 border border-primary/10 leading-relaxed text-slate-200">
                  {newsData.sentiment.summary || 'No analysis available for this symbol.'}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <p>Enter a symbol and load news to see AI sentiment analysis.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
