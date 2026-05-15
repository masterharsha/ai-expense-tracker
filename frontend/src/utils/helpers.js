export const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount)
export const formatDate = (date) => new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(date))
export const getCategoryColor = (category) => ({ Food: '#ef4444', Travel: '#f97316', Shopping: '#ec4899', Bills: '#6366f1', Entertainment: '#8b5cf6', Health: '#10b981', Education: '#06b6d4', Other: '#6b7280' }[category] || '#6b7280')
export const getCategoryEmoji = (category) => ({ Food: '🍔', Travel: '🚗', Shopping: '🛍️', Bills: '📄', Entertainment: '🎬', Health: '⚕️', Education: '📚', Other: '📦' }[category] || '💰')
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
export const calculatePercentage = (part, total) => total > 0 ? (part / total * 100).toFixed(1) : 0
export const debounce = (func, delay) => { let timeoutId; return (...args) => { clearTimeout(timeoutId); timeoutId = setTimeout(() => func(...args), delay); } }