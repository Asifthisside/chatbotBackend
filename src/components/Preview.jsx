import { useState, useEffect, useRef } from 'react'
import { Bot, MessageSquare } from 'lucide-react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import ChatbotWidget from './ChatbotWidget'
import { MessageList, MessageDetails } from './Messages'

const Preview = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [chatbots, setChatbots] = useState([])
  const [selectedChatbot, setSelectedChatbot] = useState(location.state?.chatbot || null)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [chatOpen, setChatOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null) // Selected message details
  const [showMessageDetails, setShowMessageDetails] = useState(false)
  const [showChatbotDropdown, setShowChatbotDropdown] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowChatbotDropdown(false)
      }
    }

    if (showChatbotDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showChatbotDropdown])

  useEffect(() => {
    fetchChatbots()
    // Don't initialize messages here - let ChatbotWidget handle welcome message internally
    if (selectedChatbot) {
      setMessages([])
    }
  }, [selectedChatbot])

  const fetchChatbots = async () => {
    try {
      const response = await axios.get('/api/chatbots')
      setChatbots(response.data)
      if (!selectedChatbot && response.data.length > 0) {
        setSelectedChatbot(response.data[0])
        setMessages([]) // Don't initialize with welcome message - let ChatbotWidget handle it
      }
    } catch (error) {
      console.error('Error fetching chatbots:', error)
    }
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedChatbot) return

    const userMessage = {
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')

    // Simulate bot response
    setTimeout(() => {
      let botResponse = ''
      
      // Check FAQs
      const matchedFAQ = selectedChatbot.faqs?.find(faq => 
        inputMessage.toLowerCase().includes(faq.question.toLowerCase()) ||
        faq.question.toLowerCase().includes(inputMessage.toLowerCase())
      )

      if (matchedFAQ) {
        botResponse = matchedFAQ.answer
      } else if (selectedChatbot.enableMongoDBJokes && inputMessage.toLowerCase().includes('joke')) {
        botResponse = "Why did the MongoDB developer go to therapy? Because they couldn't find their documents!"
      } else {
        const responses = {
          Friendly: "That's interesting! Can you tell me more?",
          Professional: "I understand. How can I assist you further?",
          Funny: "Haha, that's funny! Tell me more! 😄"
        }
        botResponse = responses[selectedChatbot.personality] || "I'm here to help!"
      }

      setMessages(prev => [...prev, {
        type: 'bot',
        text: botResponse,
        timestamp: new Date()
      }])
    }, 1000)
  }

  if (!selectedChatbot) {
    return (
      <div className="max-w-4xl mx-auto relative">
        <div className="rounded-lg shadow-sm p-12 text-center backdrop-blur-md animate-popup" style={{ background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.9))', border: '1px solid rgba(107, 114, 128, 0.3)' }}>
          <h3 className="text-xl font-semibold text-white mb-2">No chatbot selected</h3>
          <p className="text-gray-300 mb-6">Please select a chatbot to preview</p>
          <button
            onClick={() => navigate('/chatbots')}
            className="px-6 py-3 text-white rounded-lg transition-all duration-300 font-bold shadow-lg hover:shadow-xl"
            style={{ background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))' }}
          >
            Go to My Chatbots
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto relative pb-0 mb-0">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Chatbot Preview</h2>
        <p className="text-gray-400 text-sm">Test and interact with your chatbot in real-time</p>
      </div>

      <div className="mb-0">
        {/* Preview Area */}
        <div className="mb-0">
          <div className="rounded-xl shadow-lg mb-0" style={{ background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.9))', border: '1px solid rgba(107, 114, 128, 0.3)' }}>
            {/* Preview Header */}
            <div className="p-6 border-b" style={{ borderColor: 'rgba(107, 114, 128, 0.3)' }}>
              <div>
                <h3 className="text-lg font-bold text-white">Live Preview</h3>
                <p className="text-xs text-gray-400 mt-1">Interactive chatbot preview</p>
              </div>
            </div>

            {/* Messages List */}
            <div className="p-6 border-b" style={{ borderColor: 'rgba(107, 114, 128, 0.3)' }}>
              <div className="flex items-center space-x-2 mb-4">
                <MessageSquare className="w-5 h-5 text-gray-400" />
                <h4 className="text-sm font-semibold text-gray-300">Recent Messages</h4>
              </div>
              <MessageList 
                chatbotId={selectedChatbot?._id} 
                onMessageClick={(msg) => {
                  setSelectedMessage(msg)
                  setShowMessageDetails(true)
                }}
              />
            </div>

            {/* Chatbot Preview Container */}
            <div className="p-2">
              <div className="relative w-full h-[500px] rounded-lg overflow-hidden" style={{ background: 'rgba(17, 24, 39, 0.6)', border: '1px solid rgba(107, 114, 128, 0.3)' }}>
                {!chatOpen ? (
                  <div className="absolute top-2 right-2">
                    <div className="group relative">
                      <button
                        onClick={() => setChatOpen(true)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br from-gray-900 via-gray-800 to-black ring-2 ring-gray-600/40 hover:ring-gray-500/60"
                      >
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg">
                          {selectedChatbot.iconImage ? (
                            <img
                              src={selectedChatbot.iconImage}
                              alt={selectedChatbot.name}
                              className="w-full h-full rounded-lg object-cover"
                            />
                          ) : (
                            <span>{selectedChatbot.icon}</span>
                          )}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-white">{selectedChatbot.name || 'AllMyTab'}</p>
                          <p className="text-xs text-gray-300">Ask a question</p>
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-start justify-end p-2">
                    <ChatbotWidget
                      chatbot={selectedChatbot}
                      messages={messages}
                      onSendMessage={handleSendMessage}
                      inputMessage={inputMessage}
                      setInputMessage={setInputMessage}
                      onClose={() => setChatOpen(false)}
                      showInput={true}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Message Details Modal */}
        {showMessageDetails && selectedMessage && (
          <MessageDetails 
            message={selectedMessage}
            onClose={() => {
              setShowMessageDetails(false)
              setSelectedMessage(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

export default Preview

