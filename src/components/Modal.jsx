import { useEffect } from 'react'
import { X } from 'lucide-react'

const Modal = ({ isOpen, onClose, children, title, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4'
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div 
        className={`relative z-50 w-full ${sizeClasses[size]} rounded-3xl shadow-2xl transform transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        }`}
        style={{ background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95))', border: '1px solid rgba(107, 114, 128, 0.5)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Shiny Header */}
        <div className="relative rounded-t-3xl p-6 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))', borderBottom: '1px solid rgba(107, 114, 128, 0.3)' }}>
          {/* Animated Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(107,114,128,0.1),transparent_50%)] animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-gradient-x" style={{ backgroundSize: '200% 100%' }}></div>
          
          <div className="relative z-10 flex items-center justify-between">
            {title && (
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">{title}</h2>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl transition-all duration-300 hover:scale-110 text-white backdrop-blur-sm border border-gray-600 hover:border-gray-500 hover:rotate-90"
              style={{ background: 'rgba(31, 41, 55, 0.5)' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal

