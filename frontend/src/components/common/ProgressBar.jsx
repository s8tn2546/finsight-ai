export default function ProgressBar({ value = 0, className = '', colorClass }) {
  const pct = Math.max(0, Math.min(100, value))
  const color = colorClass
    ? colorClass
    : pct < 40
    ? 'bg-primary'
    : pct < 70
    ? 'bg-accent'
    : 'bg-red-500'
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-white/10 ${className}`}>
      <div
        className={`h-full ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
