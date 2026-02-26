import { useEffect, useRef, useState } from 'react'
import Card from '../components/common/Card.jsx'
import MessageBubble from '../components/chat/MessageBubble.jsx'
import ChatSuggestions from '../components/chat/ChatSuggestions.jsx'
import ChatInput from '../components/chat/ChatInput.jsx'
import { advisorApi } from '../services/api'
import { useAuth } from '../routes/AuthContext'
import { Bot, Sparkles, AlertCircle } from 'lucide-react'

function now() {
  const d = new Date()
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

export default function Advisor() {
  const containerRef = useRef(null)
  const { user } = useAuth()
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState(() => [
    { id: 1, role: 'ai', text: 'Hi, I’m your FinSight AI advisor. I have access to your portfolio and real-time market news. How can I help today?', t: now() },
  ])

  const scrollToEnd = () => {
    const el = containerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }

  useEffect(() => {
    scrollToEnd()
  }, [messages, isTyping])

  const onSend = async (text) => {
    const userMsg = { id: Date.now(), role: 'user', text, t: now() }
    setMessages((m) => [...m, userMsg])
    setIsTyping(true)

    try {
      const res = await advisorApi.chat(user.id, text)
      const aiMsg = { 
        id: Date.now() + 1, 
        role: 'ai', 
        text: res.data.reply, 
        t: now(),
        insights: res.data.keyInsights 
      }
      setMessages((m) => [...m, aiMsg])
    } catch (err) {
      const errMsg = { 
        id: Date.now() + 1, 
        role: 'ai', 
        text: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment.", 
        t: now(),
        error: true
      }
      setMessages((m) => [...m, errMsg])
    } finally {
      setIsTyping(false)
    }
  }

  const onSelectSuggestion = (s) => {
    onSend(s)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20 text-primary">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">AI Financial Advisor</h2>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Powered by Llama 3.3</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-white/5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">AI Online</span>
        </div>
      </div>

      <Card className="border-none bg-slate-900/40 backdrop-blur-xl">
        <div className="space-y-6">
          <ChatSuggestions onSelect={onSelectSuggestion} />

          <div
            ref={containerRef}
            className="max-h-[55dvh] min-h-[45dvh] space-y-6 overflow-y-auto rounded-2xl bg-black/20 p-6 custom-scrollbar"
          >
            {messages.map((m) => (
              <div key={m.id} className="space-y-2">
                <MessageBubble role={m.role} text={m.text} timestamp={m.t} />
                {m.insights && (
                  <div className="ml-12 flex flex-wrap gap-2">
                    {m.insights.map((insight, i) => (
                      <div key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] text-primary font-bold">
                        <Sparkles className="w-3 h-3" /> {insight}
                      </div>
                    ))}
                  </div>
                )}
                {m.error && (
                  <div className="ml-12 flex items-center gap-2 text-red-400 text-[10px] font-bold">
                    <AlertCircle className="w-3 h-3" /> Connection unstable
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-3 text-slate-500 ml-4">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce"></span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">AI is thinking...</span>
              </div>
            )}
          </div>

          <div className="pt-2">
            <ChatInput onSend={onSend} disabled={isTyping} />
          </div>
        </div>
      </Card>
    </div>
  )
}
