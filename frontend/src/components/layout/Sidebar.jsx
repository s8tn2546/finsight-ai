import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BookOpen, TrendingUp, Newspaper, Briefcase, Bot, Users, LogOut, Activity } from 'lucide-react'
import { useAuth } from '../../routes/AuthContext'

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/predict', label: 'Predict', icon: TrendingUp },
  { to: '/news', label: 'News', icon: Newspaper },
  { to: '/portfolio', label: 'Portfolio', icon: Briefcase },
  { to: '/advisor', label: 'AI Advisor', icon: Bot },
  { to: '/community', label: 'Community', icon: Users },
]

function Item({ to, label, icon: Icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-widest transition-all
         ${isActive ? 'bg-primary text-secondary shadow-[0_0_15px_rgba(99,211,242,0.3)]' : 'text-slate-500 hover:bg-white/[0.03] hover:text-white'}`
      }
      end={to === '/dashboard'}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </NavLink>
  )
}

export default function Sidebar({ open, onClose }) {
  const { logout } = useAuth()

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform border-r border-white/5 bg-background transition-transform duration-300 ease-in-out sm:static sm:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Sidebar Header / Logo */}
        <div className="flex h-20 items-center px-6 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(99,211,242,0.4)]">
              <Activity className="text-secondary w-5 h-5" />
            </div>
            <span className="text-lg font-black tracking-tighter text-white uppercase italic">
              FinSight<span className="text-primary">AI</span>
            </span>
          </div>
        </div>

        <nav className="px-3 flex flex-col h-[calc(100vh-80px)]">
          <div className="space-y-1.5 flex-1">
            <div className="px-4 mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Main Menu</span>
            </div>
            {nav.map((n) => (
              <Item key={n.to} to={n.to} label={n.label} icon={n.icon} onClick={onClose} />
            ))}
          </div>

          {/* Logout Section */}
          <div className="pb-8 px-3">
            <button
              onClick={() => { logout(); onClose?.(); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      </aside>
      {open ? (
        <button
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm sm:hidden"
        />
      ) : null}
    </>
  )
}
