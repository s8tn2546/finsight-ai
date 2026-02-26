import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, ChevronRight, PlayCircle, Star, Award, HelpCircle, ArrowLeft } from 'lucide-react';
import Card from '../components/common/Card';
import ProgressBar from '../components/common/ProgressBar';
import { useAuth } from '../routes/AuthContext';
import { userApi } from '../services/api';

const LESSONS = [
  {
    id: 'intro-to-stocks',
    title: 'Stock Market 101',
    description: 'Learn the fundamentals of stock exchanges and how trading works.',
    duration: '10 mins',
    category: 'Basics',
    content: `
      Stocks represent ownership in a company. When you buy a share, you're buying a small piece of that business.
      The stock market is where these shares are bought and sold. Key concepts include:
      - Tickers: Unique symbols like AAPL or TSLA.
      - Exchanges: Markets like the NYSE or NASDAQ.
      - Bull vs Bear: Bull markets are rising, Bear markets are falling.
    `,
    quiz: [
      {
        question: 'What does a stock ticker represent?',
        options: ['A company address', 'A unique trading symbol', 'A CEO name', 'A phone number'],
        correct: 1
      },
      {
        question: 'What is a "Bull Market"?',
        options: ['A market where prices are falling', 'A market where trading is closed', 'A market where prices are rising', 'A market only for cattle stocks'],
        correct: 2
      }
    ]
  },
  {
    id: 'technical-indicators',
    title: 'Technical Indicators',
    description: 'Master RSI, Moving Averages, and Bollinger Bands.',
    duration: '15 mins',
    category: 'Analysis',
    content: `
      Technical analysis involves using price charts and indicators to predict future moves.
      - RSI (Relative Strength Index): Measures if a stock is overbought (>70) or oversold (<30).
      - MA (Moving Average): Smooths out price data to identify trends.
      - Bollinger Bands: Measures volatility and price levels relative to moving averages.
    `,
    quiz: [
      {
        question: 'An RSI value above 70 typically suggests a stock is:',
        options: ['Oversold', 'Overbought', 'Fairly valued', 'About to go bankrupt'],
        correct: 1
      }
    ]
  },
  {
    id: 'risk-management',
    title: 'Risk Management',
    description: 'Protect your capital using stop-losses and position sizing.',
    duration: '12 mins',
    category: 'Strategy',
    content: `
      Risk management is the most important skill for a trader.
      - Stop-Loss: An automatic order to sell if a stock hits a certain price to prevent further loss.
      - Position Sizing: Only investing a small percentage of your total capital in a single trade.
      - Diversification: Spreading investments across different sectors to reduce risk.
    `,
    quiz: [
      {
        question: 'What is the primary purpose of a stop-loss order?',
        options: ['To maximize profit', 'To prevent further losses', 'To buy more shares', 'To pay less tax'],
        correct: 1
      }
    ]
  }
];

export default function Learn() {
  const { user } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [quizStep, setQuizStep] = useState(null); // null, 0, 1...
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completedCount = user?.completedLessons?.length || 0;
  const progress = (completedCount / LESSONS.length) * 100;

  const handleStartLesson = (lesson) => {
    setSelectedLesson(lesson);
    setQuizStep(null);
    setAnswers({});
    setIsFinished(false);
  };

  const handleStartQuiz = () => {
    setQuizStep(0);
  };

  const handleAnswer = (optionIdx) => {
    setAnswers({ ...answers, [quizStep]: optionIdx });
    if (quizStep < selectedLesson.quiz.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await userApi.completeLesson(selectedLesson.id);
      // In a real app, you'd refresh the user context here
      setSelectedLesson(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (selectedLesson) {
    const currentQuiz = quizStep !== null ? selectedLesson.quiz[quizStep] : null;

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
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                {selectedLesson.category}
              </span>
              <span className="text-slate-500 text-xs font-medium">{selectedLesson.duration}</span>
            </div>

            <h2 className="text-3xl font-black text-white">{selectedLesson.title}</h2>

            <AnimatePresence mode="wait">
              {quizStep === null ? (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {selectedLesson.content}
                  </div>
                  <button
                    onClick={handleStartQuiz}
                    className="w-full bg-primary text-secondary font-black py-4 rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 group"
                  >
                    Take Knowledge Quiz
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              ) : !isFinished ? (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">
                    <HelpCircle className="w-4 h-4" /> Question {quizStep + 1} of {selectedLesson.quiz.length}
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
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10 space-y-6"
                >
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
                    <Award className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Lesson Mastered!</h3>
                  <p className="text-slate-400">You've successfully completed the quiz and verified your knowledge.</p>
                  <button
                    onClick={handleComplete}
                    disabled={isSubmitting}
                    className="bg-primary text-secondary font-black px-8 py-3 rounded-xl hover:bg-white transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Recording Progress...' : 'Claim Achievement'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tight">FinSight Academy</h2>
          <p className="text-slate-500 font-bold uppercase tracking-tighter text-xs mt-1">Master the markets with AI-driven education</p>
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
          const isCompleted = user?.completedLessons?.includes(lesson.id);
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
                <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                  {lesson.description}
                </p>
                <div className="pt-4 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-slate-800 flex items-center justify-center">
                        <Star className="w-3 h-3 text-slate-600" />
                      </div>
                    ))}
                  </div>
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
          );
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
  );
}
