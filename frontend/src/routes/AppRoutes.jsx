import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import Landing from '../pages/Landing.jsx'
import Dashboard from '../pages/Home.jsx'
import Learn from '../pages/Learn.jsx'
import Predict from '../pages/Predict.jsx'
import News from '../pages/News.jsx'
import Portfolio from '../pages/Portfolio.jsx'
import Advisor from '../pages/Advisor.jsx'
import Community from '../pages/Community.jsx'
import Profile from '../pages/Profile.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/learn"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Learn />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/predict"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Predict />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/news"
        element={
          <ProtectedRoute>
            <AppLayout>
              <News />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/portfolio"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Portfolio />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/advisor"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Advisor />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/community"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Community />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
