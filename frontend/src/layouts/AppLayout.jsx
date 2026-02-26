import { useState } from 'react'
import Topbar from '../components/layout/Topbar.jsx'
import Sidebar from '../components/layout/Sidebar.jsx'

export default function AppLayout({ children }) {
  const [open, setOpen] = useState(false)
  const toggle = () => setOpen((v) => !v)
  const close = () => setOpen(false)

  return (
    <div className="flex min-h-screen bg-background text-text">
      <Sidebar open={open} onClose={close} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={toggle} />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  )
}
