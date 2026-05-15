import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { analyticsAPI } from '../services/api'
import { formatCurrency, getCategoryColor } from '../utils/helpers'
import Toast from '../components/Toast'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [categoryData, setCategoryData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [insights, setInsights] = useState([])
  const [toast, setToast] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const [statsRes, categoryRes, monthlyRes, insightsRes] = await Promise.all([
        analyticsAPI.getDashboard(),
        analyticsAPI.getCategoryBreakdown(),
        analyticsAPI.getMonthlyTrends(6),
        analyticsAPI.getInsights(),
      ])
      setStats(statsRes.data)
      setCategoryData(categoryRes.data)
      setMonthlyData(monthlyRes.data)
      setInsights(insightsRes.data)
    } catch (error) {
      setToast({ message: 'Failed to load dashboard data', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className=\"min-h-screen flex items-center justify-center\">
        <div className=\"text-center\">
          <div className=\"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto\"></div>
          <p className=\"mt-4 text-gray-400\">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className=\"card\">
      <div className=\"flex items-center justify-between\">
        <div>
          <p className=\"text-gray-400 text-sm\">{label}</p>
          <p className=\"text-2xl font-bold text-white mt-1\">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className=\"text-white\" />
        </div>
      </div>
    </div>
  )

  return (
    <div className=\"p-6 md:p-8\">
      <div className=\"mb-8\">
        <h1 className=\"text-3xl font-bold text-white mb-2\">Dashboard</h1>
        <p className=\"text-gray-400\">Your financial overview</p>
      </div>
      <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8\">
        <StatCard icon={DollarSign} label=\"Total Income\" value={formatCurrency(stats?.total_income || 0)} color=\"bg-green-500/20\" />
        <StatCard icon={TrendingDown} label=\"Total Expense\" value={formatCurrency(stats?.total_expense || 0)} color=\"bg-red-500/20\" />
        <StatCard icon={TrendingUp} label=\"Balance\" value={formatCurrency(stats?.remaining_balance || 0)} color=\"bg-blue-500/20\" />
        <StatCard icon={Percent} label=\"Savings Rate\" value={`${stats?.savings_percentage?.toFixed(1) || 0}%`} color=\"bg-purple-500/20\" />
      </div>
      <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8\">
        <div className=\"card\">
          <h2 className=\"text-xl font-bold text-white mb-4\">Spending by Category</h2>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width=\"100%\" height={300}>
              <PieChart>
                <Pie data={categoryData} dataKey=\"amount\" nameKey=\"category\" cx=\"50%\" cy=\"50%\" outerRadius={100}>
                  {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />)}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className=\"text-gray-400 text-center py-8\">No data available</p>
          )}
        </div>
        <div className=\"card\">
          <h2 className=\"text-xl font-bold text-white mb-4\">Monthly Trends</h2>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width=\"100%\" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray=\"3 3\" stroke=\"rgba(255,255,255,0.1)\" />
                <XAxis dataKey=\"month\" stroke=\"rgba(255,255,255,0.5)\" />
                <YAxis stroke=\"rgba(255,255,255,0.5)\" />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey=\"income\" fill=\"#10b981\" />
                <Bar dataKey=\"expense\" fill=\"#ef4444\" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className=\"text-gray-400 text-center py-8\">No data available</p>
          )}
        </div>
      </div>
      <div className=\"card\">
        <h2 className=\"text-xl font-bold text-white mb-4\">🤖 AI Insights</h2>
        {insights.length > 0 ? (
          <div className=\"space-y-3\">
            {insights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-lg border ${ insight.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' : insight.type === 'insight' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-green-500/10 border-green-500/30' }`}>
                <p className=\"text-white\">{insight.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className=\"text-gray-400\">No insights available yet</p>
        )}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}