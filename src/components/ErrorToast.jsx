import { useState, useEffect } from 'react'
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

let errorListeners = []
let currentErrors = []

export const showError = (message, type = 'error') => {
  const error = {
    id: Date.now() + Math.random(),
    message,
    type, // 'error', 'success', 'info', 'warning'
    timestamp: Date.now()
  }
  currentErrors.push(error)
  errorListeners.forEach(listener => listener([...currentErrors]))
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    removeError(error.id)
  }, 5000)
}

export const removeError = (id) => {
  currentErrors = currentErrors.filter(e => e.id !== id)
  errorListeners.forEach(listener => listener([...currentErrors]))
}

const ErrorToast = () => {
  const [errors, setErrors] = useState([])

  useEffect(() => {
    const listener = (newErrors) => {
      setErrors(newErrors)
    }
    errorListeners.push(listener)
    setErrors([...currentErrors])

    return () => {
      errorListeners = errorListeners.filter(l => l !== listener)
    }
  }, [])

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />
      default:
        return <AlertCircle className="w-5 h-5 text-red-400" />
    }
  }

  const getBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-900/90 border-green-500'
      case 'warning':
        return 'bg-yellow-900/90 border-yellow-500'
      case 'info':
        return 'bg-blue-900/90 border-blue-500'
      default:
        return 'bg-red-900/90 border-red-500'
    }
  }

  if (errors.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {errors.map((error) => (
        <div
          key={error.id}
          className={`${getBgColor(error.type)} border-2 rounded-lg shadow-2xl p-4 flex items-start space-x-3 animate-slide-in backdrop-blur-sm`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {getIcon(error.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium break-words">
              {error.message}
            </p>
          </div>
          <button
            onClick={() => removeError(error.id)}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default ErrorToast

