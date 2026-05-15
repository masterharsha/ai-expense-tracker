import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store'

import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import ProfilePage from './pages/ProfilePage'

import Sidebar from './components/Sidebar'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to=\"/login\" replace />
  return <div className=\"flex\"><Sidebar /><main className=\"flex-1 md:ml-64\">{children}</main></div>
}

function App() {
  const { token } = useAuthStore()
  const isAuthenticated = !!token

  return (
    <BrowserRouter>
      <Routes>
        <Route path=\"/login\" element={<LoginPage />} />
        <Route path=\"/signup\" element={<SignupPage />} />
        <Route path=\"/dashboard\" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path=\"/transactions\" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
        <Route path=\"/analytics\" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        <Route path=\"/profile\" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path=\"/\" element={<Navigate to={isAuthenticated ? \"/dashboard\" : \"/login\"} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App