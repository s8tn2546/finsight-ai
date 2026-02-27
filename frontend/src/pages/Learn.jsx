import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  CheckCircle,
  ChevronRight,
  Star,
  Award,
  HelpCircle,
  ArrowLeft,
  Volume2,
  VolumeX,
} from 'lucide-react'
import Card from '../components/common/Card'
import ProgressBar from '../components/common/ProgressBar'
import { useAuth } from '../routes/AuthContext'
import { userApi } from '../services/api'

const LESSONS = [
  {
    id: 'intro-to-stocks',
    title: 'Stock Market 101',
    description: 'Learn the fundamentals of stock exchanges and how trading works.',
    duration: '10 mins',
    category: 'Basics',
    content: `Stocks represent ownership in a company. When you buy a share, you're buying a small piece of that business. The stock market is where these shares are bought and sold.`,
    keyPoints: [
      'Tickers: Unique symbols like AAPL or TSLA identify each company.',
      'Exchanges: Markets like the NYSE or NASDAQ where shares are traded.',
      'Bull vs Bear: Bull markets are rising; Bear markets are falling.',
    ],
    realWorldExample: 'When Apple (AAPL) reports strong iPhone sales, demand for its shares often rises and the stock price can go up.',
    quiz: [
      {
        question: 'What does a stock ticker represent?',
        options: ['A company address', 'A unique trading symbol', 'A CEO name', 'A phone number'],
        correct: 1,
      },
      {
        question: 'What is a "Bull Market"?',
        options: [
          'A market where prices are falling',
          'A market where trading is closed',
          'A market where prices are rising',
          'A market only for cattle stocks',
        ],
        correct: 2,
      },
      {
        question: 'Which exchange is known for tech-heavy listings?',
        options: ['NYSE', 'NASDAQ', 'LSE', 'Euronext'],
        correct: 1,
      },
      {
        question: 'Owning a share means you are a:',
        options: ['Lender', 'Customer', 'Partial owner', 'Employee'],
        correct: 2,
      },
      {
        question: 'Primary market activity refers to:',
        options: ['IPO issuance', 'Secondary trading', 'Dividend payout', 'Stock splits'],
        correct: 0,
      },
    ],
  },
  {
    id: 'technical-indicators',
    title: 'Technical Indicators',
    description: 'Master RSI, Moving Averages, and Bollinger Bands.',
    duration: '15 mins',
    category: 'Analysis',
    content: `Technical analysis uses price charts and indicators to spot trends and potential reversals.`,
    keyPoints: [
      'RSI (Relative Strength Index): Overbought above 70, oversold below 30.',
      'Moving Average (MA): Smooths price data to show trend direction.',
      'Bollinger Bands: Show volatility and mean reversion around price.',
    ],
    realWorldExample: 'If Tesla (TSLA) has RSI at 75, technicians may expect a short-term pullback before adding more.',
    quiz: [
      {
        question: 'An RSI value above 70 typically suggests a stock is:',
        options: ['Oversold', 'Overbought', 'Fairly valued', 'About to go bankrupt'],
        correct: 1,
      },
      {
        question: 'A 50-day MA crossing above 200-day MA is a:',
        options: ['Death cross', 'Golden cross', 'Sideways move', 'Bear trap'],
        correct: 1,
      },
      {
        question: 'Bollinger Bands widen when:',
        options: ['Volatility increases', 'Volatility decreases', 'Markets close', 'Dividends are paid'],
        correct: 0,
      },
      {
        question: 'RSI below 30 often signals:',
        options: ['Overbought', 'Oversold', 'Fair value', 'No signal'],
        correct: 1,
      },
      {
        question: 'Moving averages primarily help identify:',
        options: ['News catalysts', 'Earnings dates', 'Trend direction', 'Company valuation'],
        correct: 2,
      },
    ],
  },
  {
    id: 'risk-management',
    title: 'Risk Management',
    description: 'Protect your capital using stop-losses and position sizing.',
    duration: '12 mins',
    category: 'Strategy',
    content: `Risk management is the most important skill for a trader. It keeps losses small and lets winners run.`,
    keyPoints: [
      'Stop-Loss: Automatic sell order at a set price to cap losses.',
      'Position Sizing: Risk only a small percentage of capital per trade.',
      'Diversification: Spread investments across sectors to reduce risk.',
    ],
    realWorldExample: 'Putting 2% of your portfolio in one stock and setting a stop-loss 5% below entry limits damage if the trade goes wrong.',
    quiz: [
      {
        question: 'What is the primary purpose of a stop-loss order?',
        options: [
          'To maximize profit',
          'To prevent further losses',
          'To buy more shares',
          'To pay less tax',
        ],
        correct: 1,
      },
      {
        question: 'Position sizing helps primarily with:',
        options: ['Maximizing returns', 'Controlling risk exposure', 'Finding entries', 'Reading news'],
        correct: 1,
      },
      {
        question: 'Diversification reduces:',
        options: ['Systematic risk', 'Unsyst. risk', 'Returns', 'Liquidity'],
        correct: 1,
      },
      {
        question: 'Risk per trade commonly recommended for beginners is:',
        options: ['10%', '5%', '1-2%', '0.1%'],
        correct: 2,
      },
      {
        question: 'A trailing stop adjusts based on:',
        options: ['Random events', 'Price moving in favor', 'Time of day', 'Volume spikes'],
        correct: 1,
      },
    ],
  },
]

function getMasteryLevel(scorePct) {
  if (scorePct >= 90) return { label: 'Expert', color: 'text-primary' }
  if (scorePct >= 70) return { label: 'Proficient', color: 'text-emerald-400' }
  if (scorePct >= 50) return { label: 'Learning', color: 'text-amber-400' }
  return { label: 'Needs practice', color: 'text-red-400' }
}

export default function Learn() {
  const { user, loadUser } = useAuth()
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [preparationComplete, setPreparationComplete] = useState(false)
  const [quizStep, setQuizStep] = useState(null)
  const [answers, setAnswers] = useState({})
  const [isFinished, setIsFinished] = useState(false)
  const [reportCard, setReportCard] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [speechPlaying, setSpeechPlaying] = useState(false)
  const speechUtteranceRef = useRef(null)
  const [activeQuiz, setActiveQuiz] = useState([])

  const completedCount = user?.completedLessons?.length || 0
  const progress = LESSONS.length ? (completedCount / LESSONS.length) * 100 : 0

  useEffect(() => {
    const u = speechUtteranceRef.current
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const handleStartLesson = (lesson) => {
    setSelectedLesson(lesson)
    setQuizStep(null)
    setAnswers({})
    setIsFinished(false)
    setReportCard(null)
    setPreparationComplete(false)
    setActiveQuiz([])
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setSpeechPlaying(false)
  }

  const toggleSpeech = () => {
    if (!selectedLesson) return
    if (speechPlaying) {
      window.speechSynthesis.cancel()
      setSpeechPlaying(false)
      return
    }
    const text = [
      selectedLesson.title,
      selectedLesson.content,
      ...(selectedLesson.keyPoints || []),
      selectedLesson.realWorldExample,
    ].join('. ')
    const u = new SpeechSynthesisUtterance(text)
    u.rate = 0.9
    u.onend = () => setSpeechPlaying(false)
    u.onerror = () => setSpeechPlaying(false)
    speechUtteranceRef.current = u
    window.speechSynthesis.speak(u)
    setSpeechPlaying(true)
  }

  const handleMarkPreparationComplete = () => {
    setPreparationComplete(true)
  }

  const handleStartQuiz = () => {
    if (!preparationComplete) return
    // Randomize question order and ensure exactly 5 questions
    const shuffled = [...(selectedLesson.quiz || [])]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
    setActiveQuiz(shuffled)
    setQuizStep(0)
  }

  const handleAnswer = (optionIdx) => {
    const next = { ...answers, [quizStep]: optionIdx }
    setAnswers(next)
    if (quizStep < activeQuiz.length - 1) {
      setQuizStep(quizStep + 1)
    } else {
      setIsFinished(true)
      const total = activeQuiz.length
      let correct = 0
      activeQuiz.forEach((q, i) => {
        if (next[i] === q.correct) correct++
      })
      const score = total ? Math.round((correct / total) * 100) : 0
      setReportCard({ score, correct, total, wrong: total - correct })
    }
  }

  const handleSaveAndComplete = async () => {
    if (!reportCard || !selectedLesson) return
    setIsSubmitting(true)
    try {
      await userApi.submitQuiz(selectedLesson.id, {
        score: reportCard.score,
        total: reportCard.total,
        correct: reportCard.correct,
      })
      await userApi.completeLesson(selectedLesson.id)
      if (typeof loadUser === 'function') {
        await loadUser().catch(() => null)
      }
      setSelectedLesson(null)
      setReportCard(null)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (selectedLesson) {
    const currentQuiz = quizStep !== null ? activeQuiz[quizStep] : null
    const showContent = quizStep === null && !reportCard
    const showQuiz = quizStep !== null && !reportCard
    const showReportCard = reportCard != null

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => setSelectedLesson(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Academy
        </button>

        <Card className="overflow-hidden border-primary/20 bg-slate-900/50">
          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                {selectedLesson.category}
              </span>
              <span className="text-slate-500 text-xs font-medium">{selectedLesson.duration}</span>
            </div>

            <h2 className="text-3xl font-black text-white">{selectedLesson.title}</h2>

            <AnimatePresence mode="wait">
              {showContent && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <p className="text-slate-300 leading-relaxed">{selectedLesson.content}</p>

                  {selectedLesson.keyPoints && selectedLesson.keyPoints.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Key points</h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-300">
                        {selectedLesson.keyPoints.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedLesson.realWorldExample && (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Real-world example</h4>
                      <p className="text-slate-300 text-sm leading-relaxed">{selectedLesson.realWorldExample}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={toggleSpeech}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      {speechPlaying ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                      {speechPlaying ? 'Pause' : 'Listen to Lesson'}
                    </button>
                    <button
                      type="button"
                      onClick={handleMarkPreparationComplete}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-colors"
                    >
                      Mark Preparation Complete
                    </button>
                  </div>

                  <button
                    onClick={handleStartQuiz}
                    disabled={!preparationComplete}
                    className="w-full bg-primary text-secondary font-black py-4 rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Take Knowledge Quiz
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  {!preparationComplete && (
                    <p className="text-xs text-slate-500 text-center">Complete your preparation above first.</p>
                  )}
                </motion.div>
              )}

              {showQuiz && currentQuiz && (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">
                    <HelpCircle className="w-4 h-4" /> Question {quizStep + 1} of {activeQuiz.length}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-6">{currentQuiz.question}</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {currentQuiz.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-primary/10 hover:border-primary/30 text-left text-slate-200 transition-all"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {showReportCard && reportCard && (
                <motion.div
                  key="report"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 space-y-6"
                >
                  <h3 className="text-2xl font-black text-white">Report Card</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="p-4 rounded-xl bg-white/5">
                      <div className="text-2xl font-black text-primary">{reportCard.score}%</div>
                      <div className="text-[10px] font-bold uppercase text-slate-500">Score</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5">
                      <div className="text-2xl font-black text-emerald-400">{reportCard.correct}</div>
                      <div className="text-[10px] font-bold uppercase text-slate-500">Correct</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5">
                      <div className="text-2xl font-black text-red-400">{reportCard.wrong}</div>
                      <div className="text-[10px] font-bold uppercase text-slate-500">Wrong</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 flex flex-col justify-center">
                      <div className={`text-lg font-black ${getMasteryLevel(reportCard.score).color}`}>
                        {getMasteryLevel(reportCard.score).label}
                      </div>
                      <div className="text-[10px] font-bold uppercase text-slate-500">Mastery</div>
                    </div>
                  </div>
                  <button
                    onClick={handleSaveAndComplete}
                    disabled={isSubmitting}
                    className="bg-primary text-secondary font-black px-8 py-3 rounded-xl hover:bg-white transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Claim Achievement'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tight">FinSight Academy</h2>
          <p className="text-slate-500 font-bold uppercase tracking-tighter text-xs mt-1">
            Master the markets with AI-driven education
          </p>
        </div>
        <div className="w-full md:w-64 space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
            <span>Overall Progress</span>
            <span className="text-primary">{progress.toFixed(0)}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LESSONS.map((lesson) => {
          const isCompleted = user?.completedLessons?.includes(lesson.id)
          return (
            <Card
              key={lesson.id}
              className={`group hover:border-primary/50 transition-all relative overflow-hidden ${isCompleted ? 'border-primary/30 bg-primary/5' : ''}`}
            >
              {isCompleted && (
                <div className="absolute top-0 right-0 p-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
              )}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {lesson.category}
                  </span>
                  <span className="text-[10px] text-slate-600 font-bold uppercase">{lesson.duration}</span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{lesson.title}</h3>
                <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{lesson.description}</p>
                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => handleStartLesson(lesson)}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-white transition-colors"
                  >
                    {isCompleted ? 'Review Lesson' : 'Start Learning'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Card title="Your Achievements" className="border-none bg-slate-900/40">
        <div className="flex flex-wrap gap-6 items-center justify-center py-6">
          <div className={`flex flex-col items-center gap-3 transition-opacity ${completedCount >= 1 ? 'opacity-100' : 'opacity-20'}`}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Beginner</span>
          </div>
          <div className={`flex flex-col items-center gap-3 transition-opacity ${completedCount >= 3 ? 'opacity-100' : 'opacity-20'}`}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Award className="w-8 h-8 text-white" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Analyst</span>
          </div>
          <div className={`flex flex-col items-center gap-3 transition-opacity ${completedCount >= 5 ? 'opacity-100' : 'opacity-20'}`}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <Star className="w-8 h-8 text-white" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expert</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
