import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, User, ChevronDown, LogOut } from 'lucide-react'
import { useAuth } from '../../routes/AuthContext'
import NotificationBell from './NotificationBell.jsx'

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleProfile = () => {
    setDropdownOpen(false)
    navigate('/profile')
  }

  const handleLogout = () => {
    setDropdownOpen(false)
    logout()
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              aria-label="Open menu"
              onClick={onMenuClick}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white transition-all sm:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:block h-8 w-px bg-white/5" />
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <NotificationBell />

            <div className="h-8 w-px bg-white/5 hidden sm:block" />

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 sm:gap-3 group cursor-pointer p-1.5 sm:p-0 rounded-xl sm:rounded-none hover:bg-white/5 sm:hover:bg-transparent transition-colors"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <div className="hidden text-right sm:block">
                  <div className="text-sm font-bold text-white group-hover:text-primary transition-colors truncate max-w-[120px]">
                    {user?.name || 'Investor'}
                  </div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Pro Member</div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 group-hover:border-primary/50 transition-all shrink-0">
                  <User className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-500 hidden sm:block transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-xl py-1 z-50"
                  role="menu"
                >
                  <button
                    onClick={handleProfile}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                    role="menuitem"
                  >
                    <User className="w-4 h-4 text-primary" />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-red-400 transition-colors"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
