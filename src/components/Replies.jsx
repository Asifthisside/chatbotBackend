import { useState, useEffect } from 'react'
import { Send, MessageSquare, User, Bot, Clock, Search, Reply } from 'lucide-react'
import axios from 'axios'

const Replies = () => {
  const [messages, setMessages] = useState([])
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [chatbots, setChatbots] = useState([])
  const [selectedChatbotId, setSelectedChatbotId] = useState('all')

  useEffect(() => {
    fetchMessages()
    fetchChatbots()
  }, [selectedChatbotId])

  const fetchChatbots = async () => {
    try {
      const response = await axios.get('/api/chatbots')
      setChatbots(response.data)
    } catch (error) {
      console.error('Error fetching chatbots:', error)
    }
  }

  const fetchMessages = async () => {
    try {
      setLoading(true)
      let url = '/api/messages'
      if (selectedChatbotId !== 'all') {
        url += `?chatbotId=${selectedChatbotId}`
      }
      const response = await axios.get(url)
      setMessages(response.data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async () => {
    if (!replyText.trim() || !selectedMessage || sending) return

    try {
      setSending(true)
      const response = await axios.post('/api/messages/reply', {
        messageId: selectedMessage._id,
        replyText: replyText.trim()
      })

      // Update the message with the reply
      setMessages(prev => prev.map(msg => 
        msg._id === selectedMessage._id 
          ? { ...msg, reply: replyText.trim(), repliedAt: new Date() }
          : msg
      ))

      setSelectedMessage(prev => ({
        ...prev,
        reply: replyText.trim(),
        repliedAt: new Date()
      }))

      setReplyText('')
      alert('Reply sent successfully!')
    } catch (error) {
      console.error('Error sending reply:', error)
      alert('Failed to send reply. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = searchQuery === '' || 
      msg.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.userName?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const formatDate = (date) => {
    if (!date) return ''
    const d = new Date(date)
    const now = new Date()
    const diff = now - d
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return d.toLocaleDateString()
  }

  return (
    <div className="space-y-5 relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md tracking-tight">
            Replies
          </h1>
          <p className="text-gray-400 mt-1.5 text-sm font-normal">
            View and reply to chatbot messages
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chatbot Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-2">
            Filter by Chatbot
          </label>
          <select
            value={selectedChatbotId}
            onChange={(e) => setSelectedChatbotId(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            <option value="all">All Chatbots</option>
            {chatbots.map(chatbot => (
              <option key={chatbot._id} value={chatbot._id}>
                {chatbot.name || chatbot.propertyName}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-2">
            Search Messages
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <div className="rounded-xl shadow-lg p-4 backdrop-blur-sm" style={{ background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.9))', border: '1px solid rgba(107, 114, 128, 0.3)' }}>
            <h3 className="text-sm font-semibold text-white mb-3">Messages ({filteredMessages.length})</h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-600 border-t-cyan-500 mx-auto"></div>
                  <p className="text-gray-400 mt-2 text-sm">Loading messages...</p>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-600" />
                  <p className="text-gray-400 text-sm">No messages found</p>
                </div>
              ) : (
                filteredMessages.map((message) => (
                  <div
                    key={message._id}
                    onClick={() => setSelectedMessage(message)}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                      selectedMessage?._id === message._id
                        ? 'bg-gray-700 border-cyan-500'
                        : 'bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">
                          {message.userName || 'Anonymous User'}
                        </p>
                        <p className="text-xs text-gray-300 line-clamp-2 mt-1">
                          {message.text}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">
                            {formatDate(message.timestamp)}
                          </span>
                          {message.reply && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                              Replied
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Message Details & Reply */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="rounded-xl shadow-lg backdrop-blur-sm" style={{ background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.9))', border: '1px solid rgba(107, 114, 128, 0.3)' }}>
              {/* Message Header */}
              <div className="p-4 border-b" style={{ borderColor: 'rgba(107, 114, 128, 0.3)' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {selectedMessage.userName || 'Anonymous User'}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {formatDate(selectedMessage.timestamp)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Original Message */}
              <div className="p-4 border-b" style={{ borderColor: 'rgba(107, 114, 128, 0.3)' }}>
                <p className="text-sm text-gray-300 whitespace-pre-wrap">
                  {selectedMessage.text}
                </p>
              </div>

              {/* Existing Reply */}
              {selectedMessage.reply && (
                <div className="p-4 border-b bg-gray-800/50" style={{ borderColor: 'rgba(107, 114, 128, 0.3)' }}>
                  <div className="flex items-start space-x-2 mb-2">
                    <Reply className="w-4 h-4 text-green-400 mt-0.5" />
                    <span className="text-xs font-semibold text-green-400">Your Reply</span>
                  </div>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">
                    {selectedMessage.reply}
                  </p>
                  {selectedMessage.repliedAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Replied {formatDate(selectedMessage.repliedAt)}
                    </p>
                  )}
                </div>
              )}

              {/* Reply Input */}
              <div className="p-4">
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  {selectedMessage.reply ? 'Update Reply' : 'Send Reply'}
                </label>
                <div className="flex items-end space-x-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    rows={4}
                    className="flex-1 px-3 py-2 text-sm border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                  />
                  <button
                    onClick={handleReply}
                    disabled={!replyText.trim() || sending}
                    className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {sending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl shadow-lg p-12 backdrop-blur-sm text-center" style={{ background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.9))', border: '1px solid rgba(107, 114, 128, 0.3)' }}>
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg font-semibold text-white mb-2">Select a Message</h3>
              <p className="text-gray-400 text-sm">Choose a message from the list to view details and reply</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Replies



