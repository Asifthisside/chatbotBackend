import { useState, useEffect } from 'react'
import { MessageSquare, User, Bot, Calendar } from 'lucide-react'
import axios from 'axios'

const MessageList = ({ chatbotId, onMessageClick }) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (chatbotId) {
      fetchMessages()
    }
  }, [chatbotId])

  const fetchMessages = async () => {
    if (!chatbotId) return
    setLoading(true)
    try {
      const response = await axios.get(`/api/messages/chatbot/${chatbotId}`)
      setMessages(response.data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-400 text-sm">Loading messages...</p>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="p-6 text-center">
        <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-3" />
        <p className="text-gray-400 text-sm">No messages yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto pb-0">
      {messages.slice(0, 10).map((msg) => (
        <div
          key={msg._id}
          onClick={() => onMessageClick && onMessageClick(msg)}
          className="p-3 rounded-lg border cursor-pointer transition-all"
          style={{ background: 'rgba(31, 41, 55, 0.6)', borderColor: 'rgba(107, 114, 128, 0.3)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.5)'
            e.currentTarget.style.background = 'rgba(55, 65, 81, 0.6)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.3)'
            e.currentTarget.style.background = 'rgba(31, 41, 55, 0.6)'
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                {msg.type === 'user' ? (
                  <User className="w-4 h-4 text-blue-400 flex-shrink-0" />
                ) : (
                  <Bot className="w-4 h-4 text-green-400 flex-shrink-0" />
                )}
                <p className="text-sm font-medium text-gray-300 line-clamp-2">{msg.text}</p>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Calendar className="w-3 h-3 text-gray-500" />
                <p className="text-xs text-gray-400">
                  {new Date(msg.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-semibold ml-2 flex-shrink-0 ${
              msg.type === 'user' ? 'text-white' : 'text-gray-300'
            }`}
            style={msg.type === 'user' ? { background: 'rgba(55, 65, 81, 0.8)' } : { background: 'rgba(31, 41, 55, 0.8)' }}
            >
              {msg.type === 'user' ? 'User' : 'Bot'}
            </div>
          </div>
        </div>
      ))}
      {messages.length > 10 && (
        <p className="text-xs text-gray-400 mt-3 mb-0 text-center pb-0">
          Showing 10 of {messages.length} messages
        </p>
      )}
    </div>
  )
}

export default MessageList

