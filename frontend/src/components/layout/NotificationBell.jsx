import { useState, useRef, useEffect } from 'react'
import { Bell } from 'lucide-react'

export default function NotificationBell({ notifications = [] }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    function onClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const hasNotifications = Array.isArray(notifications) && notifications.length > 0

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((v) => !v)}
        className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        <Bell className="w-5 h-5" />
        {hasNotifications && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(99,211,242,0.8)]" />
        )}
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Notifications menu"
          className="absolute right-0 z-50 mt-2 w-72 sm:w-80 rounded-xl border border-white/10 bg-secondary shadow-2xl overflow-hidden origin-top-right transition transform duration-150 ease-out"
          style={{ transformOrigin: 'top right' }}
        >
          <div className="px-4 py-3 border-b border-white/10">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Notifications
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto custom-scrollbar">
            {hasNotifications ? (
              <ul className="divide-y divide-white/5">
                {notifications.map((n, i) => (
                  <li key={i} className="p-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-white">{n.title}</div>
                        <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {n.message}
                        </div>
                      </div>
                      {n.timestamp && (
                        <div className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
                          {typeof n.timestamp === 'string'
                            ? new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center">
                <div className="text-sm font-medium text-slate-300">No notifications yet</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">
                  You’ll see alerts and updates here
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
