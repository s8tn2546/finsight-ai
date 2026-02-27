import { useState } from 'react'

export default function ChatInput({ onSend }) {
  const [text, setText] = useState('')
  const send = () => {
    const t = text.trim()
    if (!t) return
    onSend?.(t)
    setText('')
  }
  return (
    <div className="flex items-center gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            send()
          }
        }}
        placeholder="Ask FinSight AI…"
        className="flex-1 rounded-lg border border-white/10 bg-secondary px-3 py-2 text-sm outline-none placeholder:text-white/40 focus:ring-2 focus:ring-accent"
      />
      <button
        onClick={send}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-black hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent"
      >
        Send
      </button>
    </div>
  )
}
