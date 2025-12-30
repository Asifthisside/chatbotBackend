import { X, User, Globe, Monitor, Calendar, MessageSquare } from 'lucide-react'

const MessageDetails = ({ message, onClose }) => {
  if (!message) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-md" style={{ background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95))', border: '1px solid rgba(107, 114, 128, 0.5)' }}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Message Details</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors text-gray-400 hover:text-white"
              style={{ background: 'rgba(31, 41, 55, 0.5)' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Message Content */}
          <div className="mb-6">
            <div className={`p-4 rounded-lg ${
              message.type === 'user' ? '' : ''
            }`}
            style={message.type === 'user' ? { background: 'rgba(55, 65, 81, 0.6)', border: '1px solid rgba(107, 114, 128, 0.3)' } : { background: 'rgba(31, 41, 55, 0.6)', border: '1px solid rgba(107, 114, 128, 0.3)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  message.type === 'user' ? 'text-white' : 'text-gray-300'
                }`}
                style={message.type === 'user' ? { background: 'rgba(55, 65, 81, 0.8)' } : { background: 'rgba(31, 41, 55, 0.8)' }}
                >
                  {message.type === 'user' ? 'User Message' : 'Bot Response'}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(message.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-300 whitespace-pre-wrap">{message.text}</p>
            </div>
          </div>

          {/* User Details */}
          {message.userId && message.type === 'user' && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Sender Information</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg p-4" style={{ background: 'rgba(31, 41, 55, 0.6)', border: '1px solid rgba(107, 114, 128, 0.3)' }}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Monitor className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-400 uppercase">Device ID</span>
                  </div>
                  <p className="text-sm font-mono text-gray-300">{message.userId.deviceId || 'N/A'}</p>
                </div>

                <div className="rounded-lg p-4" style={{ background: 'rgba(31, 41, 55, 0.6)', border: '1px solid rgba(107, 114, 128, 0.3)' }}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-400 uppercase">IP Address</span>
                  </div>
                  <p className="text-sm font-mono text-gray-300">{message.userId.ipAddress || 'N/A'}</p>
                </div>

                <div className="rounded-lg p-4" style={{ background: 'rgba(31, 41, 55, 0.6)', border: '1px solid rgba(107, 114, 128, 0.3)' }}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Monitor className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-400 uppercase">Browser</span>
                  </div>
                  <p className="text-sm text-gray-300">{message.userId.browser || 'Unknown'}</p>
                </div>

                <div className="rounded-lg p-4" style={{ background: 'rgba(31, 41, 55, 0.6)', border: '1px solid rgba(107, 114, 128, 0.3)' }}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Monitor className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-400 uppercase">Operating System</span>
                  </div>
                  <p className="text-sm text-gray-300">{message.userId.os || 'Unknown'}</p>
                </div>

                <div className="rounded-lg p-4" style={{ background: 'rgba(31, 41, 55, 0.6)', border: '1px solid rgba(107, 114, 128, 0.3)' }}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-400 uppercase">First Seen</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    {message.userId.firstSeen 
                      ? new Date(message.userId.firstSeen).toLocaleString() 
                      : 'N/A'}
                  </p>
                </div>

                <div className="rounded-lg p-4" style={{ background: 'rgba(31, 41, 55, 0.6)', border: '1px solid rgba(107, 114, 128, 0.3)' }}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-400 uppercase">Last Seen</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    {message.userId.lastSeen 
                      ? new Date(message.userId.lastSeen).toLocaleString() 
                      : 'N/A'}
                  </p>
                </div>

                <div className="rounded-lg p-4 md:col-span-2" style={{ background: 'rgba(31, 41, 55, 0.6)', border: '1px solid rgba(107, 114, 128, 0.3)' }}>
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-400 uppercase">Total Messages</span>
                  </div>
                  <p className="text-sm text-gray-300">{message.userId.messageCount || 0} messages</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessageDetails



