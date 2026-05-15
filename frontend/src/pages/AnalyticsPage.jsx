import { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { analyticsAPI } from '../services/api'
import { formatCurrency } from '../utils/helpers'
import Toast from '../components/Toast'

export default function AnalyticsPage() {
  const [monthlyData, setMonthlyData] = useState([])
  const [predictions, setPredictions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState(null)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [monthlyRes, predictionsRes] = await Promise.all([
        analyticsAPI.getMonthlyTrends(12),
        analyticsAPI.getPredictions(),
      ])
      setMonthlyData(monthlyRes.data)
      setPredictions(predictionsRes.data)
    } catch (error) {
      setToast({ message: 'Failed to load analytics', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className=\"min-h-screen flex items-center justify-center\">
        <div className=\"text-center\">
          <div className=\"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto\"></div>
          <p className=\"mt-4 text-gray-400\">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className=\"p-6 md:p-8\">
      <div className=\"mb-8\">
        <h1 className=\"text-3xl font-bold text-white mb-2\">Analytics</h1>
        <p className=\"text-gray-400\">Detailed financial insights and forecasts</p>
      </div>
      <div className=\"card mb-8\">
        <h2 className=\"text-xl font-bold text-white mb-4\">12-Month Trend</h2>
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width=\"100%\" height={400}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray=\"3 3\" stroke=\"rgba(255,255,255,0.1)\" />
              <XAxis dataKey=\"month\" stroke=\"rgba(255,255,255,0.5)\" />
              <YAxis stroke=\"rgba(255,255,255,0.5)\" />
              <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none' }} />
              <Legend />
              <Line type=\"monotone\" dataKey=\"income\" stroke=\"#10b981\" strokeWidth={2} />
              <Line type=\"monotone\" dataKey=\"expense\" stroke=\"#ef4444\" strokeWidth={2} />
              <Line type=\"monotone\" dataKey=\"balance\" stroke=\"#3b82f6\" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className=\"text-gray-400 text-center py-8\">No data available</p>
        )}
      </div>
      <div className=\"card\">
        <h2 className=\"text-xl font-bold text-white mb-4\">🔮 Expense Predictions</h2>
        {predictions.length > 0 ? (
          <div className=\"grid grid-cols-1 md:grid-cols-3 gap-4\">
            {predictions.map((pred, index) => (
              <div key={index} className=\"p-4 glass-sm rounded-lg\">
                <p className=\"text-gray-400 text-sm mb-2\">{pred.month}</p>
                <p className=\"text-2xl font-bold text-white mb-2\">{formatCurrency(pred.predicted_expense)}</p>
                <div className=\"flex items-center space-x-2\">
                  <div className=\"flex-1 bg-white/10 rounded-full h-2\">
                    <div className=\"bg-blue-500 h-2 rounded-full\" style={{ width: `${pred.confidence}%` }}></div>
                  </div>
                  <span className=\"text-xs text-gray-400\">{pred.confidence.toFixed(0)}% confidence</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className=\"text-gray-400\">Not enough data for predictions yet</p>
        )}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}