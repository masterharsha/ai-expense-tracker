import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Filter } from 'lucide-react'
import { transactionAPI } from '../services/api'
import { formatCurrency, formatDate, getCategoryEmoji } from '../utils/helpers'
import Toast from '../components/Toast'

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [filters, setFilters] = useState({ category: '', type: '' })
  const [formData, setFormData] = useState({ category: 'Food', type: 'expense', amount: '', description: '', date: new Date().toISOString().split('T')[0] })

  useEffect(() => { fetchTransactions() }, [filters])

  const fetchTransactions = async () => {
    try {
      setIsLoading(true)
      const response = await transactionAPI.getAll(filters)
      setTransactions(response.data)
    } catch (error) {
      setToast({ message: 'Failed to load transactions', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await transactionAPI.update(editingId, formData)
        setToast({ message: 'Transaction updated successfully', type: 'success' })
      } else {
        await transactionAPI.create(formData)
        setToast({ message: 'Transaction added successfully', type: 'success' })
      }
      setShowForm(false)
      setEditingId(null)
      setFormData({ category: 'Food', type: 'expense', amount: '', description: '', date: new Date().toISOString().split('T')[0] })
      fetchTransactions()
    } catch (error) {
      setToast({ message: error.response?.data?.detail || 'Failed to save transaction', type: 'error' })
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this transaction?')) {
      try {
        await transactionAPI.delete(id)
        setToast({ message: 'Transaction deleted successfully', type: 'success' })
        fetchTransactions()
      } catch (error) {
        setToast({ message: 'Failed to delete transaction', type: 'error' })
      }
    }
  }

  const categories = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other']

  return (
    <div className=\"p-6 md:p-8\">
      <div className=\"flex items-center justify-between mb-8\">
        <div>
          <h1 className=\"text-3xl font-bold text-white mb-2\">Transactions</h1>
          <p className=\"text-gray-400\">Manage your income and expenses</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className=\"btn-primary flex items-center space-x-2\">
          <Plus size={20} />
          <span>Add Transaction</span>
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className=\"card mb-8 animate-fade-in\">
          <h2 className=\"text-xl font-bold text-white mb-4\">{editingId ? 'Edit Transaction' : 'Add New Transaction'}</h2>
          <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4\">
            <div>
              <label className=\"block text-sm font-medium text-gray-300 mb-2\">Type</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className=\"input-field\">
                <option value=\"expense\">Expense</option>
                <option value=\"income\">Income</option>
              </select>
            </div>
            {formData.type === 'expense' && (
              <div>
                <label className=\"block text-sm font-medium text-gray-300 mb-2\">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className=\"input-field\">
                  {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className=\"block text-sm font-medium text-gray-300 mb-2\">Amount (₹)</label>
              <input type=\"number\" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className=\"input-field\" placeholder=\"0.00\" step=\"0.01\" required />
            </div>
            <div>
              <label className=\"block text-sm font-medium text-gray-300 mb-2\">Date</label>
              <input type=\"date\" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className=\"input-field\" required />
            </div>
          </div>
          <div className=\"mb-4\">
            <label className=\"block text-sm font-medium text-gray-300 mb-2\">Description</label>
            <input type=\"text\" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className=\"input-field\" placeholder=\"Optional description\" />
          </div>
          <div className=\"flex space-x-4\">
            <button type=\"submit\" className=\"btn-primary\">{editingId ? 'Update' : 'Add'} Transaction</button>
            <button type=\"button\" onClick={() => { setShowForm(false); setEditingId(null) }} className=\"btn-ghost\">Cancel</button>
          </div>
        </form>
      )}
      <div className=\"card mb-6 space-y-4\">
        <div className=\"flex items-center space-x-2 mb-4\">
          <Filter size={20} className=\"text-blue-400\" />
          <h3 className=\"text-lg font-semibold text-white\">Filters</h3>
        </div>
        <div className=\"grid grid-cols-1 md:grid-cols-3 gap-4\">
          <div>
            <label className=\"block text-sm font-medium text-gray-300 mb-2\">Type</label>
            <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} className=\"input-field\">
              <option value=\"\">All Types</option>
              <option value=\"income\">Income</option>
              <option value=\"expense\">Expense</option>
            </select>
          </div>
          <div>
            <label className=\"block text-sm font-medium text-gray-300 mb-2\">Category</label>
            <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className=\"input-field\">
              <option value=\"\">All Categories</option>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className=\"block text-sm font-medium text-gray-300 mb-2\">Reset</label>
            <button onClick={() => setFilters({ category: '', type: '' })} className=\"btn-ghost w-full\">Clear Filters</button>
          </div>
        </div>
      </div>
      <div className=\"card overflow-x-auto\">
        {isLoading ? (
          <div className=\"text-center py-8\">
            <p className=\"text-gray-400\">Loading transactions...</p>
          </div>
        ) : transactions.length > 0 ? (
          <table className=\"w-full\">
            <thead>
              <tr className=\"border-b border-white/10\">
                <th className=\"text-left py-4 px-4 text-gray-300 font-semibold\">Date</th>
                <th className=\"text-left py-4 px-4 text-gray-300 font-semibold\">Category</th>
                <th className=\"text-left py-4 px-4 text-gray-300 font-semibold\">Description</th>
                <th className=\"text-left py-4 px-4 text-gray-300 font-semibold\">Type</th>
                <th className=\"text-right py-4 px-4 text-gray-300 font-semibold\">Amount</th>
                <th className=\"text-center py-4 px-4 text-gray-300 font-semibold\">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className=\"border-b border-white/5 hover:bg-white/5 transition\">
                  <td className=\"py-4 px-4 text-gray-300\">{formatDate(transaction.date)}</td>
                  <td className=\"py-4 px-4\"><span className=\"text-lg\">{transaction.type === 'expense' ? getCategoryEmoji(transaction.category) : '📥'}</span>{transaction.type === 'expense' && <span className=\"ml-2 text-gray-300\">{transaction.category}</span>}</td>
                  <td className=\"py-4 px-4 text-gray-300\">{transaction.description || '-'}</td>
                  <td className=\"py-4 px-4\"><span className={`px-2 py-1 rounded text-xs font-semibold ${transaction.type === 'income' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{transaction.type}</span></td>
                  <td className=\"py-4 px-4 text-right font-semibold\"><span className={transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}>{transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}</span></td>
                  <td className=\"py-4 px-4 text-center space-x-2 flex justify-center\">
                    <button onClick={() => { setEditingId(transaction.id); setFormData({ category: transaction.category || 'Food', type: transaction.type, amount: transaction.amount, description: transaction.description, date: transaction.date.split('T')[0] }); setShowForm(true) }} className=\"p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30\">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(transaction.id)} className=\"p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30\">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className=\"text-center py-8\">
            <p className=\"text-gray-400\">No transactions found. Add one to get started!</p>
          </div>
        )}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}