import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { useAuthStore } from '../store'
import Toast from '../components/Toast'
import { Mail, Lock, LogIn } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [formData, setFormData] = useState({ email: 'demo@expensetracker.com', password: 'DemoUser123' })

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await authAPI.login(formData)
      setAuth(response.data.user, response.data.access_token)
      setToast({ message: 'Login successful!', type: 'success' })
      setTimeout(() => navigate('/dashboard'), 500)
    } catch (error) {
      setToast({ message: error.response?.data?.detail || 'Login failed', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className=\"min-h-screen flex items-center justify-center p-4\">
      <div className=\"w-full max-w-md\">
        <div className=\"text-center mb-8\">
          <h1 className=\"text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2\">💰 ExpenseTrack</h1>
          <p className=\"text-gray-400\">Your AI-Powered Financial Assistant</p>
        </div>
        <form onSubmit={handleSubmit} className=\"card space-y-6 animate-fade-in\">
          <h2 className=\"text-2xl font-bold text-white\">Welcome Back</h2>
          <div>
            <label className=\"block text-sm font-medium text-gray-300 mb-2\">Email</label>
            <div className=\"relative\">
              <Mail size={18} className=\"absolute left-3 top-3 text-gray-400\" />
              <input type=\"email\" name=\"email\" value={formData.email} onChange={handleChange} className=\"input-field pl-10\" placeholder=\"your@email.com\" required />
            </div>
          </div>
          <div>
            <label className=\"block text-sm font-medium text-gray-300 mb-2\">Password</label>
            <div className=\"relative\">
              <Lock size={18} className=\"absolute left-3 top-3 text-gray-400\" />
              <input type=\"password\" name=\"password\" value={formData.password} onChange={handleChange} className=\"input-field pl-10\" placeholder=\"••••••••\" required />
            </div>
          </div>
          <button type=\"submit\" disabled={isLoading} className=\"btn-primary w-full flex items-center justify-center space-x-2\">
            <LogIn size={18} />
            <span>{isLoading ? 'Logging in...' : 'Login'}</span>
          </button>
          <p className=\"text-center text-gray-400\">Don't have an account? <Link to=\"/signup\" className=\"text-blue-400 hover:text-blue-300\">Sign up</Link></p>
        </form>
        <div className=\"mt-6 p-4 glass-sm rounded-lg text-sm text-gray-300\">
          <p className=\"font-semibold mb-2\">📝 Demo Account:</p>
          <p>Email: demo@expensetracker.com</p>
          <p>Password: DemoUser123</p>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}