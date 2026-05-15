import { useState } from 'react'
import { User, Mail, Lock, Save } from 'lucide-react'
import { authAPI } from '../services/api'
import { useAuthStore } from '../store'
import Toast from '../components/Toast'

export default function ProfilePage() {
  const { user, setUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [formData, setFormData] = useState({ username: user?.username || '', email: user?.email || '' })
  const [passwordData, setPasswordData] = useState({ old_password: '', new_password: '' })

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await authAPI.updateProfile(formData)
      setUser(response.data)
      setToast({ message: 'Profile updated successfully', type: 'success' })
    } catch (error) {
      setToast({ message: error.response?.data?.detail || 'Failed to update profile', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await authAPI.changePassword(passwordData)
      setPasswordData({ old_password: '', new_password: '' })
      setToast({ message: 'Password changed successfully', type: 'success' })
    } catch (error) {
      setToast({ message: error.response?.data?.detail || 'Failed to change password', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className=\"p-6 md:p-8\">
      <div className=\"mb-8\">
        <h1 className=\"text-3xl font-bold text-white mb-2\">Profile Settings</h1>
        <p className=\"text-gray-400\">Manage your account information</p>
      </div>
      <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-8\">
        <form onSubmit={handleProfileUpdate} className=\"card\">
          <h2 className=\"text-xl font-bold text-white mb-6 flex items-center space-x-2\">
            <User size={24} />
            <span>Profile Information</span>
          </h2>
          <div className=\"space-y-4 mb-6\">
            <div>
              <label className=\"block text-sm font-medium text-gray-300 mb-2\">Username</label>
              <input type=\"text\" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className=\"input-field\" />
            </div>
            <div>
              <label className=\"block text-sm font-medium text-gray-300 mb-2\">Email</label>
              <input type=\"email\" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className=\"input-field\" />
            </div>
          </div>
          <button type=\"submit\" disabled={isLoading} className=\"btn-primary w-full flex items-center justify-center space-x-2\">
            <Save size={20} />
            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </form>
        <form onSubmit={handlePasswordChange} className=\"card\">
          <h2 className=\"text-xl font-bold text-white mb-6 flex items-center space-x-2\">
            <Lock size={24} />
            <span>Change Password</span>
          </h2>
          <div className=\"space-y-4 mb-6\">
            <div>
              <label className=\"block text-sm font-medium text-gray-300 mb-2\">Current Password</label>
              <input type=\"password\" value={passwordData.old_password} onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })} className=\"input-field\" required />
            </div>
            <div>
              <label className=\"block text-sm font-medium text-gray-300 mb-2\">New Password</label>
              <input type=\"password\" value={passwordData.new_password} onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })} className=\"input-field\" required />
            </div>
          </div>
          <button type=\"submit\" disabled={isLoading} className=\"btn-secondary w-full flex items-center justify-center space-x-2\">
            <Lock size={20} />
            <span>{isLoading ? 'Updating...' : 'Change Password'}</span>
          </button>
        </form>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}