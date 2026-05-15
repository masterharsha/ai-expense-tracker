import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { useAuthStore } from '../store'
import Toast from '../components/Toast'
import { User, Mail, Lock, UserPlus } from 'lucide-react'

export default function SignupPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' })

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setToast({ message: 'Passwords do not match', type: 'error' })
      return
    }
    setIsLoading(true)
    try {
      const response = await authAPI.signup({ username: formData.username, email: formData.email, password: formData.password })
      setAuth(response.data.user, response.data.access_token)
      setToast({ message: 'Signup successful!', type: 'success' })
      setTimeout(() => navigate('/dashboard'), 500)
    } catch (error) {
      setToast({ message: error.response?.data?.detail || 'Signup failed', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className=\"min-h-screen flex items-center justify-center p-4\">
      <div className=\"w-full max-w-md\">
        <div className=\"text-center mb-8\">
          <h1 className=\"text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2\">💰 ExpenseTrack</h1>
          <p className=\"text-gray-400\">Join and Start Tracking Your Finances</p>
        </div>
        <form onSubmit={handleSubmit} className=\"card space-y-6 animate-fade-in\">
          <h2 className=\"text-2xl font-bold text-white\">Create Account</h2>
          <div>
            <label className=\"block text-sm font-medium text-gray-300 mb-2\">Username</label>
            <div className=\"relative\">
              <User size={18} className=\"absolute left-3 top-3 text-gray-400\" />
              <input type=\"text\" name=\"username\" value={formData.username} onChange={handleChange} className=\"input-field pl-10\" placeholder=\"john_doe\" required />
            </div>
          </div>
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
          <div>
            <label className=\"block text-sm font-medium text-gray-300 mb-2\">Confirm Password</label>
            <div className=\"relative\">
              <Lock size={18} className=\"absolute left-3 top-3 text-gray-400\" />
              <input type=\"password\" name=\"confirmPassword\" value={formData.confirmPassword} onChange={handleChange} className=\"input-field pl-10\" placeholder=\"••••••••\" required />
            </div>
          </div>
          <button type=\"submit\" disabled={isLoading} className=\"btn-primary w-full flex items-center justify-center space-x-2\">
            <UserPlus size={18} />
            <span>{isLoading ? 'Creating account...' : 'Sign Up'}</span>
          </button>
          <p className=\"text-center text-gray-400\">Already have an account? <Link to=\"/login\" className=\"text-blue-400 hover:text-blue-300\">Login</Link></p>
        </form>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}