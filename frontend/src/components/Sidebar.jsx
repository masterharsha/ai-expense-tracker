import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, Home, TrendingUp, Wallet, User } from 'lucide-react'
import { useAuthStore } from '../store'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuthStore()

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: Home },
    { label: 'Transactions', path: '/transactions', icon: Wallet },
    { label: 'Analytics', path: '/analytics', icon: TrendingUp },
    { label: 'Profile', path: '/profile', icon: User },
  ]

  const handleLogout = () => { logout(); navigate('/login') }
  const isActive = (path) => location.pathname === path

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className=\"md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg glass text-white\">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <aside className={`fixed left-0 top-0 h-screen w-64 glass border-r border-white/20 p-6 transform transition-transform duration-300 z-40 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className=\"mb-8\">
          <h1 className=\"text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent\">💰 ExpenseTrack</h1>
          <p className=\"text-sm text-gray-400 mt-1\">AI Financial Insights</p>
        </div>
        <div className=\"mb-8 p-4 glass-sm rounded-lg\">
          <p className=\"text-sm text-gray-400\">Logged in as</p>
          <p className=\"font-semibold text-white truncate\">{user?.username}</p>
        </div>
        <nav className=\"space-y-2 mb-8\">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)} className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${active ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-white/10'}`}>
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <button onClick={handleLogout} className=\"w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all\">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>
      {isOpen && <div className=\"fixed inset-0 bg-black/50 md:hidden z-30\" onClick={() => setIsOpen(false)} />}
    </>
  )
}