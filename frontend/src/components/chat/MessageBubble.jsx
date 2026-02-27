export default function MessageBubble({ role, text, timestamp }) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ring-1
          ${isUser ? 'bg-primary text-black ring-white/10' : 'bg-secondary text-text ring-white/10'}`}
      >
        <div>{text}</div>
        {timestamp ? (
          <div className={`mt-1 text-[10px] ${isUser ? 'text-black/60' : 'text-white/60'}`}>{timestamp}</div>
        ) : null}
      </div>
    </div>
  )
}
