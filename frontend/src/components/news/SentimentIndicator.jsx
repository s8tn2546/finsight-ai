import ProgressBar from '../common/ProgressBar.jsx'

export default function SentimentIndicator({ score = 0 }) {
  const label =
    score > 60 ? 'Positive' : score < 40 ? 'Negative' : 'Neutral'
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/70">Sentiment</span>
        <span className="font-medium">{label} · {score}</span>
      </div>
      <ProgressBar value={score} colorClass="bg-accent" />
    </div>
  )
}
