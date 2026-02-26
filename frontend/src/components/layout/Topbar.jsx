import { Menu, Bell, Search, User } from 'lucide-react'
import { useAuth } from '../../routes/AuthContext'

export default function Topbar({ onMenuClick }) {
  const { user } = useAuth()
  
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              aria-label="Open menu"
              onClick={onMenuClick}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white transition-all sm:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Search Bar - Desktop */}
            <div className="hidden md:flex relative items-center">
              <Search className="absolute left-3 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Quick search (Cmd + K)"
                className="bg-white/[0.03] border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-300 w-64 focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(99,211,242,0.8)]"></span>
            </button>

            <div className="h-8 w-[1px] bg-white/5 hidden sm:block"></div>

            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="hidden text-right sm:block">
                <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">{user?.name || 'Investor'}</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Pro Member</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 group-hover:border-primary/50 transition-all">
                <User className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
