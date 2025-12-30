import { useState, useEffect, useRef } from 'react'
import { Home, MessageSquare, HelpCircle, CheckSquare, Send, ChevronDown, Search, ArrowRight, CheckCircle2, Clock, Plus, Trash2, X, User } from 'lucide-react'
import axios from 'axios'

const ChatbotWidget = ({ chatbot, messages = [], onSendMessage, inputMessage, setInputMessage, onClose, showInput = true }) => {
  const [activeTab, setActiveTab] = useState('home')
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [chatView, setChatView] = useState(false) // For inbox/chat view
  const [chatMessages, setChatMessages] = useState([]) // Messages in the chat
  const [chatInput, setChatInput] = useState('') // Input for chat
  const [sending, setSending] = useState(false) // Loading state for sending
  const [welcomeShown, setWelcomeShown] = useState(false) // Track if welcome message has been shown
  const [showWelcomePopup, setShowWelcomePopup] = useState(() => {
    // Check if welcome popup has been shown before for this chatbot
    const welcomeKey = `chatbot_welcome_${chatbot?._id || 'default'}`
    return !localStorage.getItem(welcomeKey)
  })
  const messagesEndRef = useRef(null) // Ref for auto-scrolling to bottom

  // Generate device ID (stored in localStorage)
  const getDeviceId = () => {
    let deviceId = localStorage.getItem('chatbot_deviceId')
    if (!deviceId) {
      deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('chatbot_deviceId', deviceId)
    }
    return deviceId
  }

  // Get user name (stored in localStorage or generate default)
  const getUserName = () => {
    let userName = localStorage.getItem('chatbot_userName')
    if (!userName) {
      userName = 'User ' + Math.floor(Math.random() * 1000)
      localStorage.setItem('chatbot_userName', userName)
    }
    return userName
  }

  // Get user avatar initial
  const getUserAvatarInitial = () => {
    const userName = getUserName()
    return userName.charAt(0).toUpperCase()
  }

  // Send message to API
  const handleSendMessage = async (text) => {
    if (!text.trim() || !chatbot?._id || sending) return

    const messageText = text.trim()
    
    // Create user message object
    const userMessage = {
      type: 'user',
      text: messageText,
      timestamp: new Date()
    }
    
    // Add user message to chat immediately
    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setSending(true)

    try {
      // Send message to backend API
      const deviceId = getDeviceId()
      const response = await axios.post('/api/messages/send', {
        chatbotId: chatbot._id,
        text: messageText,
        type: 'user',
        deviceId: deviceId
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      console.log('Message sent successfully:', response.data)

      // Generate bot response based on chatbot settings
      let botResponseText = chatbot.welcomeMessage || 'Thank you for your message! How can I help you?'
      
      // Check if chatbot has FAQs
      if (chatbot.faqs && chatbot.faqs.length > 0) {
        const matchedFAQ = chatbot.faqs.find(faq => 
          messageText.toLowerCase().includes(faq.question?.toLowerCase() || '') ||
          faq.question?.toLowerCase().includes(messageText.toLowerCase())
        )
        if (matchedFAQ && matchedFAQ.answer) {
          botResponseText = matchedFAQ.answer
        }
      }

      // Add bot response after a short delay
      setTimeout(() => {
        const botResponse = {
          type: 'bot',
          text: botResponseText,
          timestamp: new Date()
        }
        setChatMessages(prev => [...prev, botResponse])
        setSending(false)
      }, 800)
    } catch (error) {
      console.error('Error sending message:', error)
      setSending(false)
      
      // Show error message to user
      const errorMessage = {
        type: 'bot',
        text: error.response?.data?.error || 'Sorry, there was an error sending your message. Please try again.',
        timestamp: new Date(),
        isError: true
      }
      setChatMessages(prev => [...prev, errorMessage])
    }
  }

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatMessages])

  // Show welcome message only once when inbox is opened
  useEffect(() => {
    if (chatView && chatMessages.length === 0) {
      // Check if welcome message has been shown for this chatbot session
      const welcomeMessageKey = `chatbot_welcome_message_${chatbot?._id || 'default'}_${getDeviceId()}`
      const hasWelcomeBeenShown = localStorage.getItem(welcomeMessageKey)
      
      if (!hasWelcomeBeenShown) {
        const welcomeMsg = {
          type: 'bot',
          text: chatbot?.welcomeMessage || 'Hello! How can I help you today?',
          timestamp: new Date()
        }
        setChatMessages([welcomeMsg])
        setWelcomeShown(true)
        localStorage.setItem(welcomeMessageKey, 'true')
      }
    }
  }, [chatView, chatMessages.length, chatbot])

  const handleTabClick = (tab) => {
    setActiveTab(tab)
    // You can add specific actions for each tab here
  }

  if (!chatbot) return null

  const primaryColor = chatbot.primaryColor || '#3B82F6'
  const chatbotName = chatbot.name || 'Chatbot'
  const chatbotIcon = chatbot.icon || '💬'
  const chatbotIconImage = chatbot.iconImage || null
  const theme = chatbot.theme || 'light'

  // Theme-based styling
  const getThemeStyles = () => {
    switch (theme) {
      case 'dark':
        return {
          widgetBg: 'bg-gray-900',
          headerBg: 'bg-gray-800',
          textPrimary: 'text-white',
          textSecondary: 'text-gray-300',
          borderColor: 'border-gray-700',
          inputBg: 'bg-gray-800',
          inputBorder: 'border-gray-700',
          inputText: 'text-white',
          messageBg: 'bg-gray-800',
          navBg: 'bg-gray-800',
          navBorder: 'border-gray-700'
        }
      case 'custom':
        return {
          widgetBg: 'bg-gradient-to-br from-blue-50 to-purple-50',
          headerBg: 'bg-blue-50',
          textPrimary: 'text-gray-800',
          textSecondary: 'text-gray-600',
          borderColor: 'border-blue-200',
          inputBg: 'bg-white',
          inputBorder: 'border-blue-300',
          inputText: 'text-gray-800',
          messageBg: 'bg-white',
          navBg: 'bg-blue-50',
          navBorder: 'border-blue-200'
        }
      default: // light
        return {
          widgetBg: 'bg-white',
          headerBg: primaryColor + '10',
          textPrimary: 'text-gray-800',
          textSecondary: 'text-gray-600',
          borderColor: 'border-gray-200',
          inputBg: 'bg-white',
          inputBorder: 'border-gray-300',
          inputText: 'text-gray-800',
          messageBg: 'bg-white',
          navBg: primaryColor + '05',
          navBorder: 'border-gray-200'
        }
    }
  }

  const themeStyles = getThemeStyles()

  // Helper function to convert hex to rgba
  const hexToRgba = (hex, alpha = 0.1) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  // Get custom background style for custom theme
  const getCustomBgStyle = () => {
    if (theme === 'custom') {
      return {
        background: `linear-gradient(to bottom right, ${hexToRgba(primaryColor, 0.1)}, rgba(147, 51, 234, 0.1))`
      }
    }
    return {}
  }

  // Get header background color
  const getHeaderBg = () => {
    if (activeTab === 'home') {
      if (theme === 'dark' || theme === 'custom') {
        return '#1A1A1A'
      }
      // Light theme - use white background for home tab
      return '#FFFFFF'
    }
    if (theme === 'custom') {
      return hexToRgba(primaryColor, 0.1)
    }
    if (theme === 'dark') {
      return '#1F2937' // gray-800
    }
    return undefined
  }

  return (
    <>
      {/* Welcome Popup Modal - Shows first when chatbot opens */}
      {showWelcomePopup ? (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-fade-in">
          <div className="w-[400px] h-[400px] rounded-2xl shadow-2xl overflow-hidden relative animate-scale-in">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80)'
              }}
            >
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-violet-900/85 via-purple-900/85 to-indigo-900/85"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-between p-8">
              {/* Top Spacer */}
              <div></div>
              
              {/* Main Content */}
              <div className="flex flex-col items-center text-center space-y-5">
                {/* Icon */}
                <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl shadow-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 ring-4 ring-white/40 animate-bounce">
                  {chatbotIconImage ? (
                    <img
                      src={chatbotIconImage}
                      alt={chatbotName}
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  ) : (
                    <span className="text-white text-5xl">{chatbotIcon}</span>
                  )}
                </div>
                
                {/* Welcome Text */}
                <div className="space-y-3">
                  <h2 className="text-3xl font-extrabold text-white drop-shadow-2xl animate-fade-in">
                    Welcome to
                  </h2>
                  <h1 className="text-4xl font-extrabold text-white drop-shadow-2xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    AllMyTab Chatbot
                  </h1>
                  <p className="text-white/95 text-base font-medium mt-4 px-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    {chatbot.welcomeMessage || 'We\'re here to help you!'}
                  </p>
                </div>
              </div>
              
              {/* Start Button */}
              <button
                onClick={() => {
                  // Mark welcome popup as shown in localStorage
                  const welcomeKey = `chatbot_welcome_${chatbot?._id || 'default'}`
                  localStorage.setItem(welcomeKey, 'true')
                  setShowWelcomePopup(false)
                  setWelcomeShown(true)
                }}
                className="w-full px-6 py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-purple-500/50 hover:scale-105 active:scale-95 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: '0.6s' }}
              >
                Start
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Chatbot Widget - Only shows after welcome popup is closed */
        <div className={`${themeStyles.widgetBg} rounded-t-lg rounded-b-lg shadow-2xl w-80 h-[500px] flex flex-col overflow-hidden ${theme === 'dark' ? 'border-gray-700' : ''}`} style={{ ...getCustomBgStyle() }}>
      {/* Header */}
      <div className={`p-4 border-b ${themeStyles.borderColor} flex items-center justify-between transition-all duration-300`} style={{ backgroundColor: getHeaderBg() }}>
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Chatbot Logo */}
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-md flex-shrink-0 bg-gradient-to-br from-green-500 to-emerald-600">
            {chatbotIconImage ? (
              <img
                src={chatbotIconImage}
                alt={chatbotName}
                className="w-full h-full rounded-lg object-cover"
              />
            ) : (
              <span className="text-white text-lg">{chatbotIcon}</span>
            )}
          </div>
          {/* Chatbot Name */}
          <h4 className={`font-bold text-base truncate ${
            activeTab === 'home' 
              ? (theme === 'dark' || theme === 'custom' ? 'text-white' : themeStyles.textPrimary)
              : themeStyles.textPrimary
          }`}>{chatbotName}.</h4>
        </div>
        {/* Right Side - User Avatars */}
        <div className="flex items-center space-x-2 ml-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-gray-800 text-white flex-shrink-0">
            {getUserAvatarInitial()}
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-gray-800 text-white flex-shrink-0">
            S
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-gray-800 text-white flex-shrink-0">
            R
          </div>
          <button
            onClick={onClose}
            className={`ml-1 p-2 rounded-lg transition-all duration-300 flex-shrink-0 group ${
              theme === 'dark' || theme === 'custom' 
                ? 'text-white hover:bg-red-500/20 hover:text-red-300' 
                : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
            }`}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)'
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <X className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className={`flex-1 overflow-hidden flex flex-col min-h-0 ${
        activeTab === 'home' 
          ? theme === 'dark' || theme === 'custom'
            ? 'bg-gradient-to-b from-teal-900/30 via-emerald-900/20 to-teal-900/30' 
            : 'bg-gradient-to-b from-teal-50 via-emerald-50 to-teal-50'
          : theme === 'dark' 
            ? 'bg-gray-900' 
            : themeStyles.widgetBg
      }`} style={activeTab === 'home' && theme === 'custom' ? getCustomBgStyle() : {}}>
        {activeTab === 'home' && (
          <div className="p-5 space-y-4 flex-1 overflow-y-auto" style={{ 
            background: theme === 'dark' || theme === 'custom' 
              ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' 
              : '#f8fafc'
          }}>
            {/* Greeting Message */}
            <div className="mb-4">
              <h2 className={`text-2xl font-bold mb-2 ${
                theme === 'dark' || theme === 'custom' 
                  ? 'text-white' 
                  : themeStyles.textPrimary
              }`}>
                Hello {getUserName().toLowerCase()}!
              </h2>
              <h3 className={`text-xl font-medium ${
                theme === 'dark' || theme === 'custom' 
                  ? 'text-gray-200' 
                  : themeStyles.textSecondary
              }`}>
                {chatbot.welcomeMessage || 'How can we help?'}
              </h3>
            </div>

            {/* Recent Message Card */}
            <div 
              className={`${theme === 'dark' || theme === 'custom' ? 'bg-white/10' : 'bg-white'} rounded-xl p-4 shadow-md cursor-pointer hover:shadow-lg transition-all duration-300 border ${theme === 'dark' || theme === 'custom' ? 'border-white/20' : 'border-gray-200'} group`}
              onClick={() => setActiveTab('messages')}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  {/* Stacked Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex flex-col items-center justify-center text-xs font-bold ${theme === 'dark' || theme === 'custom' ? 'bg-gray-800' : 'bg-gray-900'}`}>
                      <span className="text-white leading-tight">{getUserAvatarInitial()}</span>
                      <span className="text-white text-[10px] leading-tight">SR</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mb-1">
                      <span className={`text-xs font-semibold ${theme === 'dark' || theme === 'custom' ? 'text-gray-600' : 'text-gray-500'}`}>Recent message</span>
                    </div>
                    <p className={`text-sm mb-2 line-clamp-2 ${theme === 'dark' || theme === 'custom' ? 'text-gray-800' : 'text-gray-700'}`}>
                      {messages[messages.length - 1]?.text || 'Welcome back! 🎉 How can I assist you today?'}
                    </p>
                    <div className={`flex items-center space-x-1 text-xs ${theme === 'dark' || theme === 'custom' ? 'text-gray-500' : 'text-gray-500'}`}>
                      <span className="font-medium">{chatbotName}</span>
                      <span>•</span>
                      <span>
                        {messages[messages.length - 1]?.timestamp 
                          ? `${Math.floor((new Date() - new Date(messages[messages.length - 1].timestamp)) / (1000 * 60 * 60 * 24))}d`
                          : '5d'}
                      </span>
                    </div>
                  </div>
                </div>
                <ArrowRight className={`w-5 h-5 flex-shrink-0 mt-1 transition-all duration-300 text-green-600 group-hover:translate-x-1`} />
              </div>
            </div>

            {/* Status Card */}
            <div 
              className={`${theme === 'dark' || theme === 'custom' ? 'bg-white/10' : 'bg-white'} rounded-xl p-4 shadow-md border ${theme === 'dark' || theme === 'custom' ? 'border-white/20' : 'border-gray-200'}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === 'dark' || theme === 'custom' ? 'bg-green-500/20' : 'bg-green-100'}`}>
                    <CheckCircle2 className={`w-6 h-6 ${theme === 'dark' || theme === 'custom' ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-sm font-semibold ${theme === 'dark' || theme === 'custom' ? 'text-gray-600' : 'text-gray-600'}`}>Status:</span>
                    <span className={`text-sm font-semibold ${theme === 'dark' || theme === 'custom' ? 'text-green-600' : 'text-green-600'}`}>All Systems Operational</span>
                  </div>
                  <div className={`flex items-center space-x-1 text-xs ${theme === 'dark' || theme === 'custom' ? 'text-gray-500' : 'text-gray-500'}`}>
                    <span>
                      Updated {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} UTC
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'messages' && (
          <div className="flex flex-col h-full min-h-0">
            {/* Messages Header */}
            <div className={`px-4 py-3 border-b ${themeStyles.borderColor} flex items-center justify-between flex-shrink-0 ${themeStyles.messageBg}`}>
              <div className="flex items-center space-x-3">
                {chatView && (
                  <button
                    onClick={() => setChatView(false)}
                    className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'}`}
                  >
                    <ArrowRight className={`w-5 h-5 rotate-180 transition-transform duration-300 hover:-translate-x-1`} />
                  </button>
                )}
                <h3 className={`text-lg font-semibold ${themeStyles.textPrimary}`}>
                  {chatView ? 'Inbox' : 'Messages'}
                </h3>
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className={`p-1 rounded transition-colors ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Messages List or Chat View */}
            {chatView ? (
              /* Chat/Inbox View */
              <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
                {/* Chat Messages */}
                <div className={`flex-1 overflow-y-auto p-4 space-y-4 min-h-0 ${themeStyles.messageBg}`}>
                  {chatMessages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className={`w-12 h-12 mx-auto mb-2 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`} />
                      <p className={`text-sm ${themeStyles.textSecondary}`}>No messages yet</p>
                      <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Start the conversation</p>
                    </div>
                  ) : (
                    chatMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                      >
                        <div className={`max-w-[80%] rounded-2xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                          msg.type === 'user'
                            ? theme === 'dark' ? 'bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 text-white border border-violet-400/30' : 'bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 text-white border border-violet-400/30 shadow-violet-500/30'
                            : msg.isError
                              ? theme === 'dark' ? 'bg-red-900/50 text-red-200 border border-red-700' : 'bg-red-50 text-red-700 border border-red-200'
                              : theme === 'dark' ? 'bg-gray-800 text-white border border-gray-700' : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 border border-gray-200 shadow-md'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{msg.text}</p>
                          <p className={`text-xs mt-2 ${
                            msg.type === 'user' ? 'text-violet-100' : msg.isError ? (theme === 'dark' ? 'text-red-300' : 'text-red-600') : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className={`p-4 border-t flex-shrink-0 ${themeStyles.borderColor} ${themeStyles.messageBg}`}>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && chatInput.trim()) {
                          handleSendMessage(chatInput.trim())
                        }
                      }}
                      placeholder="Type a message..."
                      className={`flex-1 px-4 py-2 border ${themeStyles.inputBorder} rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-400 text-sm ${themeStyles.inputBg} ${themeStyles.inputText} transition-all duration-300`}
                      style={theme === 'light' ? { backgroundColor: '#ffffff', color: '#1f2937' } : {}}
                    />
                    <button
                      onClick={() => {
                        if (chatInput.trim()) {
                          handleSendMessage(chatInput.trim())
                        }
                      }}
                      className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 text-white transition-all duration-300 hover:opacity-90 hover:scale-110 hover:shadow-xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      disabled={!chatInput.trim()}
                    >
                      <Send className="w-5 h-5 transition-transform duration-300 hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Messages List View */
              <div className={`flex-1 overflow-y-auto min-h-0 ${themeStyles.messageBg}`}>
                {messages.length === 0 ? (
                  <div className="p-4">
                    <div className="text-center py-8">
                      <MessageSquare className={`w-12 h-12 mx-auto mb-2 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`} />
                      <p className={`text-sm ${themeStyles.textSecondary}`}>No messages yet</p>
                      <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Start a conversation below</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-2">
                    {/* Sample Message Items */}
                    <div className="space-y-1">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setChatView(true)
                            // Initialize chat with this message
                            setChatMessages([{
                              type: 'bot',
                              text: message.text,
                              timestamp: message.timestamp || new Date()
                            }])
                          }}
                          className={`flex items-start space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-300 group border ${theme === 'dark' ? 'hover:bg-gray-800 hover:border-gray-600 border-gray-700/50 hover:shadow-lg' : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-transparent hover:border-blue-200 hover:shadow-md'}`}
                        >
                          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-semibold">
                              {chatbotName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-sm font-semibold ${themeStyles.textPrimary}`}>{chatbotName}</span>
                              <span className={`text-xs ${themeStyles.textSecondary}`}>
                                {message.timestamp 
                                  ? `${Math.floor((new Date() - new Date(message.timestamp)) / (1000 * 60 * 60))}h`
                                  : '18h'}
                              </span>
                            </div>
                            <p className={`text-sm line-clamp-2 ${themeStyles.textSecondary}`}>
                              {message.text}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {index === messages.length - 1 && (
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            )}
                            <ArrowRight className={`w-4 h-4 transition-colors ${theme === 'dark' ? 'text-gray-500 group-hover:text-green-400' : 'text-gray-400 group-hover:text-green-600'}`} />
                          </div>
                        </div>
                      ))}
                      
                      {/* Additional sample messages if needed */}
                      {messages.length === 1 && (
                        <div
                          onClick={() => {
                            setChatView(true)
                            // Add welcome message only if not shown yet
                            if (!welcomeShown) {
                              setChatMessages([{
                                type: 'bot',
                                text: chatbot?.welcomeMessage || 'Hello! How can I help you today?',
                                timestamp: new Date()
                              }, {
                                type: 'bot',
                                text: '👋 Need help with your next project?',
                                timestamp: new Date()
                              }])
                              setWelcomeShown(true)
                            } else {
                              setChatMessages([{
                                type: 'bot',
                                text: '👋 Need help with your next project?',
                                timestamp: new Date()
                              }])
                            }
                          }}
                          className={`flex items-start space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-300 group border ${theme === 'dark' ? 'hover:bg-gray-800 hover:border-gray-600 border-gray-700/50 hover:shadow-lg' : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-transparent hover:border-blue-200 hover:shadow-md'}`}
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center flex-shrink-0 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                            <span className="text-white text-xs font-bold">
                              {chatbotName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-sm font-semibold ${themeStyles.textPrimary}`}>{chatbotName}</span>
                              <span className={`text-xs ${themeStyles.textSecondary}`}>18h</span>
                            </div>
                            <p className={`text-sm line-clamp-2 ${themeStyles.textSecondary}`}>
                              👋 Need help with your next project?
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <ArrowRight className={`w-4 h-4 transition-all duration-300 ${theme === 'dark' ? 'text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1' : 'text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1'}`} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

          
          </div>
        )}

        {activeTab === 'help' && (
          <div className={`p-4 ${themeStyles.widgetBg}`}>
            <h5 className={`font-semibold mb-3 ${themeStyles.textPrimary}`}>Frequently Asked Questions</h5>
            {chatbot.faqs && chatbot.faqs.length > 0 ? (
              <div className="space-y-3">
                {chatbot.faqs.map((faq, index) => (
                  <div key={index} className={`border ${themeStyles.borderColor} rounded-lg p-3 ${themeStyles.messageBg}`}>
                    <p className={`text-sm font-medium mb-1 ${themeStyles.textPrimary}`}>{faq.question}</p>
                    <p className={`text-xs ${themeStyles.textSecondary}`}>{faq.answer}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <HelpCircle className={`w-12 h-12 mx-auto mb-2 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={`text-sm ${themeStyles.textSecondary}`}>No FAQs available</p>
              </div>
            )}
            {chatbot.knowledgeSource && (
              <div className={`mt-4 p-3 rounded-lg ${themeStyles.messageBg}`} style={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : primaryColor + '10', border: `1px solid ${themeStyles.borderColor.replace('border-', '')}` }}>
                <p className={`text-xs font-medium mb-1 ${themeStyles.textPrimary}`}>Knowledge Base:</p>
                <p className={`text-xs ${themeStyles.textSecondary}`}>{chatbot.knowledgeSource}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="flex flex-col h-full">
            {/* Tasks Header */}
            <div className={`px-4 py-3 border-b ${themeStyles.borderColor} ${themeStyles.messageBg}`}>
              <h5 className={`font-semibold mb-2 ${themeStyles.textPrimary}`}>Your Tasks</h5>
              
              {/* Progress Bar */}
              {tasks.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium ${themeStyles.textSecondary}`}>
                      Progress
                    </span>
                    <span className="text-xs font-semibold" style={{ color: primaryColor }}>
                      {tasks.filter(t => t.completed).length} of {tasks.length} completed
                    </span>
                  </div>
                  <div className={`w-full rounded-full h-2 overflow-hidden ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div
                      className="h-full rounded-full transition-all duration-300 ease-out"
                      style={{
                        width: `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%`,
                        backgroundColor: primaryColor
                      }}
                    ></div>
                  </div>
                  <div className="mt-1">
                    <span className={`text-xs ${themeStyles.textSecondary}`}>
                      {Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}% complete
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Tasks List */}
            <div className={`flex-1 overflow-y-auto p-4 ${themeStyles.messageBg}`}>
              {tasks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckSquare className={`w-12 h-12 mx-auto mb-2 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`} />
                  <p className={`text-sm ${themeStyles.textSecondary}`}>No tasks available</p>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Add a task below to get started</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {tasks.map((task, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-3 rounded-lg border ${themeStyles.borderColor} transition-colors group ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}
                    >
                      <button
                        onClick={() => {
                          const updatedTasks = [...tasks]
                          updatedTasks[index].completed = !updatedTasks[index].completed
                          setTasks(updatedTasks)
                        }}
                        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                          task.completed
                            ? 'bg-green-500 border-green-500 shadow-md'
                            : theme === 'dark' ? 'border-gray-600 hover:border-green-500 hover:bg-green-500/20' : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
                        }`}
                      >
                        {task.completed && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                      </button>
                      <span
                        className={`flex-1 text-sm ${
                          task.completed
                            ? `line-through ${themeStyles.textSecondary}`
                            : themeStyles.textPrimary
                        }`}
                      >
                        {task.text}
                      </span>
                      <button
                        onClick={() => {
                          setTasks(tasks.filter((_, i) => i !== index))
                        }}
                        className={`flex-shrink-0 p-1.5 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 ${theme === 'dark' ? 'hover:bg-red-900/30' : 'hover:bg-red-50'}`}
                      >
                        <Trash2 className="w-4 h-4 text-red-500 transition-transform duration-300 hover:scale-110" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Task Input */}
            <div className={`p-4 border-t ${themeStyles.borderColor} ${themeStyles.messageBg}`}>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newTask.trim()) {
                      setTasks([...tasks, { text: newTask.trim(), completed: false }])
                      setNewTask('')
                    }
                  }}
                  placeholder="Add a new task..."
                  className={`flex-1 px-4 py-2 border ${themeStyles.inputBorder} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${themeStyles.inputBg} ${themeStyles.inputText}`}
                  style={theme === 'light' ? { backgroundColor: '#ffffff', color: '#1f2937' } : {}}
                />
                <button
                  onClick={() => {
                    if (newTask.trim()) {
                      setTasks([...tasks, { text: newTask.trim(), completed: false }])
                      setNewTask('')
                    }
                  }}
                  className="p-2 rounded-lg text-white transition-all duration-300 hover:opacity-90 hover:scale-110 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{ backgroundColor: primaryColor }}
                  disabled={!newTask.trim()}
                >
                  <Plus className="w-5 h-5 transition-transform duration-300 hover:rotate-90" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs - Bottom */}
      <div className={`flex border-t flex-shrink-0 rounded-b-lg ${themeStyles.navBorder}`} style={{ backgroundColor: theme === 'dark' || theme === 'custom' ? '#1A1A1A' : '#ffffff' }}>
        <button
          onClick={() => handleTabClick('home')}
          className={`flex-1 py-3 px-2 flex flex-col items-center justify-center space-y-1 transition-all duration-300 relative group rounded-bl-lg ${
            activeTab === 'home'
              ? 'text-green-600 font-semibold'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          <Home className={`w-5 h-5 transition-all duration-300 ${activeTab === 'home' ? 'text-green-600 scale-110' : 'group-hover:scale-110'}`} />
          <span className={`text-xs font-medium transition-all duration-300 ${activeTab === 'home' ? 'text-green-600' : ''}`}>Home</span>
        </button>
        <button
          onClick={() => handleTabClick('messages')}
          className={`flex-1 py-3 px-2 flex flex-col items-center justify-center space-y-1 transition-all duration-300 relative group ${
            activeTab === 'messages'
              ? 'text-gray-800 font-semibold'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <div className="relative">
            <MessageSquare className={`w-5 h-5 transition-all duration-300 ${activeTab === 'messages' ? 'scale-110' : 'group-hover:scale-110'}`} />
            {chatMessages.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold bg-red-500 text-white">
                1
              </span>
            )}
          </div>
          <span className={`text-xs font-medium transition-all duration-300`}>Messages</span>
        </button>
        <button
          onClick={() => handleTabClick('help')}
          className={`flex-1 py-3 px-2 flex flex-col items-center justify-center space-y-1 transition-all duration-300 group ${
            activeTab === 'help'
              ? 'text-gray-800 font-semibold'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <HelpCircle className={`w-5 h-5 transition-all duration-300 ${activeTab === 'help' ? 'scale-110' : 'group-hover:scale-110'}`} />
          <span className="text-xs font-medium">Help</span>
        </button>
        <button
          onClick={() => handleTabClick('tasks')}
          className={`flex-1 py-3 px-2 flex flex-col items-center justify-center space-y-1 transition-all duration-300 group rounded-br-lg ${
            activeTab === 'tasks'
              ? 'text-gray-800 font-semibold'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <CheckSquare className={`w-5 h-5 transition-all duration-300 ${activeTab === 'tasks' ? 'scale-110' : 'group-hover:scale-110'}`} />
          <span className="text-xs font-medium">Tasks</span>
        </button>
      </div>
        </div>
      )}
    </>
  )
}

export default ChatbotWidget

