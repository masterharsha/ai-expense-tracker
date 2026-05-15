import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

export default function Toast({ message, type = 'info', onClose }) {
  const icons = { success: <CheckCircle size={20} className=\"text-green-400\" />, error: <AlertCircle size={20} className=\"text-red-400\" />, warning: <AlertTriangle size={20} className=\"text-yellow-400\" />, info: <Info size={20} className=\"text-blue-400\" /> }
  const colors = { success: 'bg-green-500/20 border-green-500/50', error: 'bg-red-500/20 border-red-500/50', warning: 'bg-yellow-500/20 border-yellow-500/50', info: 'bg-blue-500/20 border-blue-500/50' }
  return (
    <div className={`fixed bottom-4 right-4 flex items-center space-x-3 px-4 py-3 rounded-lg border ${colors[type]} text-white animate-fade-in z-50`}>
      {icons[type]}
      <span>{message}</span>
      <button onClick={onClose} className=\"ml-2 text-white/60 hover:text-white\">✕</button>
    </div>
  )
}