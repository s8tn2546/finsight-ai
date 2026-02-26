import { useState, useEffect } from 'react'
import Card from '../components/common/Card.jsx'
import SentimentIndicator from '../components/news/SentimentIndicator.jsx'
import { newsApi } from '../services/api'
import { Loader2, Search, Newspaper, Zap, AlertCircle } from 'lucide-react'

export default function News() {
  const [symbol, setSymbol] = useState('AAPL')
  const [newsData, setNewsData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await newsApi.getNews(symbol)
      setNewsData(res.data)
    } catch (err) {
      setError('Failed to fetch news. Please check your API key or try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchNews()
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="Search symbol (e.g. AAPL, BTC)..."
            className="w-full bg-secondary/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </form>
        <button
          onClick={fetchNews}
          disabled={isLoading}
          className="bg-primary text-secondary font-bold px-6 py-2 rounded-xl hover:bg-white transition-all disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* News List */}
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
                  className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <Newspaper className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <p className="text-sm text-slate-200 leading-relaxed font-medium group-hover:text-white transition-colors">
                      {headline}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-slate-500">
                <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No news found for {symbol}</p>
              </div>
            )}
          </div>
        </Card>

        {/* AI Analysis */}
        <Card title="AI Intelligence" className="lg:col-span-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4">
              <Zap className="w-12 h-12 animate-pulse text-primary opacity-20" />
              <p className="text-sm font-medium">Llama 3.3 is analyzing market impact...</p>
            </div>
          ) : newsData?.sentiment ? (
            <div className="space-y-8 p-2">
              {/* Sentiment Score */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-black border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Zap className="w-20 h-20" />
                  </div>
                  <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Sentiment Score</div>
                  <SentimentIndicator score={(newsData.sentiment.sentiment_score + 1) * 50} />
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm text-slate-500 font-medium">Impact Strength</span>
                    <span className="text-lg font-bold text-white">{newsData.sentiment.impact_strength}/10</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-2">Primary Sentiment</div>
                    <div className={`text-xl font-bold ${newsData.sentiment.sentiment_score > 0 ? 'text-primary' : newsData.sentiment.sentiment_score < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                      {newsData.sentiment.sentiment_score > 0.2 ? 'Bullish' : newsData.sentiment.sentiment_score < -0.2 ? 'Bearish' : 'Neutral'}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-2">Market Volatility</div>
                    <div className="text-xl font-bold text-white">
                      {newsData.sentiment.impact_strength > 7 ? 'High' : newsData.sentiment.impact_strength > 4 ? 'Moderate' : 'Low'}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Summary */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                  <Zap className="w-4 h-4 text-primary" /> AI Strategic Summary
                </div>
                <div className="p-6 rounded-2xl bg-slate-900/50 border border-primary/10 leading-relaxed text-slate-200">
                  {newsData.sentiment.summary || "No analysis available for this asset."}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <Zap className="w-16 h-16 mb-4 opacity-10" />
              <p>Enter a symbol to see AI intelligence analysis</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
