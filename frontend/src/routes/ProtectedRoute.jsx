import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-slate-900 text-cyan-400">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return children
}
