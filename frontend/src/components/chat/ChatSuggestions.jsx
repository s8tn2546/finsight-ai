export default function ChatSuggestions({ onSelect }) {
  const items = ['Analyze my portfolio', 'Market outlook', 'Risk assessment']
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <button
          key={t}
          onClick={() => onSelect?.(t)}
          className="rounded-full border border-accent/50 bg-secondary/60 px-3 py-1.5 text-xs text-white/80 hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {t}
        </button>
      ))}
    </div>
  )
}
