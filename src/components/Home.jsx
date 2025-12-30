import { useState, useEffect } from 'react'
import { Plus, Bot, MessageSquare, TrendingUp, Users, ArrowRight, BarChart3, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useLanguage } from '../contexts/LanguageContext'
import Modal from './Modal'

const Home = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [stats, setStats] = useState({
    totalChatbots: 0,
    activeChatbots: 0,
    totalMessages: 0,
    totalUsers: 0
  })
  const [recentChatbots, setRecentChatbots] = useState([])
  const [loading, setLoading] = useState(true)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [apiInfo, setApiInfo] = useState(null)

  useEffect(() => {
    fetchStats()
    fetchRecentChatbots()
    fetchApiInfo()
    // Show welcome modal on first visit
    const hasVisited = localStorage.getItem('hasVisited')
    if (!hasVisited) {
      setTimeout(() => setShowWelcomeModal(true), 500)
      localStorage.setItem('hasVisited', 'true')
    }
  }, [])

  const fetchApiInfo = async () => {
    try {
      // Get API base URL from environment or use default
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
      const baseUrl = apiBaseUrl.replace('/api', '')
      const response = await axios.get(`${baseUrl}/`)
      setApiInfo(response.data)
    } catch (error) {
      console.error('Error fetching API info:', error)
      // Set default info if API is not accessible
      setApiInfo({
        message: 'Chatbot Admin API Server',
        version: '1.0.0',
        endpoints: {
          health: '/api/health',
          chatbots: '/api/chatbots',
          messages: '/api/messages',
          upload: '/api/upload'
        },
        documentation: 'This is an API server. Use /api/* endpoints.'
      })
    }
  }

  const fetchStats = async () => {
    try {
      const [chatbotsResponse, statsResponse] = await Promise.all([
        axios.get('/api/chatbots'),
        axios.get('/api/messages/stats')
      ])
      
      const chatbots = chatbotsResponse.data || []
      const statsData = statsResponse.data || {}
      
      setStats({
        totalChatbots: chatbots.length,
        activeChatbots: chatbots.filter(c => c.isActive).length,
        totalMessages: statsData.totalMessages || 0,
        totalUsers: statsData.totalUsers || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Fallback to chatbots only
      try {
        const response = await axios.get('/api/chatbots')
        const chatbots = response.data || []
        setStats({
          totalChatbots: chatbots.length,
          activeChatbots: chatbots.filter(c => c.isActive).length,
          totalMessages: 0,
          totalUsers: 0
        })
      } catch (err) {
        console.error('Error fetching chatbots:', err)
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentChatbots = async () => {
    try {
      const response = await axios.get('/api/chatbots')
      const chatbots = response.data || []
      // Sort by createdAt and get latest 5
      const sorted = chatbots.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setRecentChatbots(sorted.slice(0, 5))
    } catch (error) {
      console.error('Error fetching recent chatbots:', error)
    }
  }

  return (
    <div className="space-y-5 relative z-10" style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* Welcome Modal */}
      <Modal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        title="Welcome to AllMyTab! 🎉"
        size="md"
      >
        <div className="text-center py-3">
          <div className="w-16 h-16 mx-auto mb-3 rounded-xl flex items-center justify-center shadow-xl" style={{ background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))' }}>
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>Get Started</h3>
          <p className="text-sm text-gray-300 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>Create your first chatbot and start engaging with your customers!</p>
          <button
            onClick={() => {
              setShowWelcomeModal(false)
              navigate('/create')
            }}
            className="px-6 py-2 text-sm text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
            style={{ background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))', fontFamily: "'Inter', sans-serif" }}
          >
            Create Your First Chatbot
          </button>
        </div>
      </Modal>

      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md tracking-tight" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>{t('dashboard')}</h1>
          <p className="text-gray-300 mt-1.5 text-sm font-normal" style={{ fontFamily: "'Inter', sans-serif" }}>{t('welcomeBack')}</p>
        </div>
        <button
          onClick={() => navigate('/create')}
          className="flex items-center space-x-2 px-4 py-2 text-sm text-white rounded-lg transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 border border-gray-600 hover:border-gray-500"
          style={{ background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))', fontFamily: "'Inter', sans-serif" }}
        >
          <Plus className="w-4 h-4" />
          <span>{t('createNewChatbot')}</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Chatbots */}
        <div className="rounded-xl shadow-lg p-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group cursor-pointer relative overflow-hidden backdrop-blur-sm animate-popup" style={{ background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.8))', border: '1px solid rgba(107, 114, 128, 0.3)' }}>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(135deg, rgba(75, 85, 99, 0.2), rgba(55, 65, 81, 0.2))' }}></div>
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-xl" style={{ background: 'radial-gradient(circle, rgba(107, 114, 128, 0.3), transparent)' }}></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-300 font-semibold mb-1.5 uppercase tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>{t('totalChatbots')}</p>
              <p className="text-3xl font-bold text-white mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>{stats.totalChatbots}</p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 border border-gray-600" style={{ background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))' }}>
              <Bot className="w-6 h-6 drop-shadow-md" style={{ color: 'rgb(96, 165, 250)' }} />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs relative z-10">
            <TrendingUp className="w-4 h-4 mr-1.5 animate-pulse text-gray-400" />
            <span className="text-gray-300 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>All time</span>
          </div>
        </div>

        {/* Active Chatbots */}
        <div className="rounded-xl shadow-lg p-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group cursor-pointer relative overflow-hidden backdrop-blur-sm animate-popup" style={{ background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.8))', border: '1px solid rgba(107, 114, 128, 0.3)' }}>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(135deg, rgba(75, 85, 99, 0.2), rgba(55, 65, 81, 0.2))' }}></div>
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-xl" style={{ background: 'radial-gradient(circle, rgba(107, 114, 128, 0.3), transparent)' }}></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-300 font-semibold mb-1.5 uppercase tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>{t('activeChatbots')}</p>
              <p className="text-3xl font-bold text-white mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>{stats.activeChatbots}</p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 border border-gray-600" style={{ background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))' }}>
              <MessageSquare className="w-6 h-6 drop-shadow-md" style={{ color: 'rgb(74, 222, 128)' }} />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs relative z-10">
            <div className="w-2.5 h-2.5 rounded-full mr-1.5 animate-pulse shadow-md" style={{ background: 'rgb(34, 197, 94)' }}></div>
            <span className="text-gray-300 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Currently running</span>
          </div>
        </div>

        {/* Total Messages */}
        <div className="rounded-xl shadow-lg p-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group cursor-pointer relative overflow-hidden backdrop-blur-sm animate-popup" style={{ background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.8))', border: '1px solid rgba(107, 114, 128, 0.3)' }}>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(135deg, rgba(75, 85, 99, 0.2), rgba(55, 65, 81, 0.2))' }}></div>
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-xl" style={{ background: 'radial-gradient(circle, rgba(107, 114, 128, 0.3), transparent)' }}></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-300 font-semibold mb-1.5 uppercase tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>{t('totalMessages')}</p>
              <p className="text-3xl font-bold text-white mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>{stats.totalMessages}</p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 border border-gray-600" style={{ background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))' }}>
              <MessageSquare className="w-6 h-6 drop-shadow-md" style={{ color: 'rgb(192, 132, 252)' }} />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs relative z-10">
            <span className="text-gray-300 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>All conversations</span>
          </div>
        </div>

        {/* Total Users */}
        <div className="rounded-xl shadow-lg p-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group cursor-pointer relative overflow-hidden backdrop-blur-sm animate-popup" style={{ background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.8))', border: '1px solid rgba(107, 114, 128, 0.3)' }}>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(135deg, rgba(75, 85, 99, 0.2), rgba(55, 65, 81, 0.2))' }}></div>
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-xl" style={{ background: 'radial-gradient(circle, rgba(107, 114, 128, 0.3), transparent)' }}></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-300 font-semibold mb-1.5 uppercase tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>{t('totalUsers')}</p>
              <p className="text-3xl font-bold text-white mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>{stats.totalUsers}</p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 border border-gray-600" style={{ background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))' }}>
              <Users className="w-6 h-6 drop-shadow-md" style={{ color: 'rgb(251, 146, 60)' }} />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs relative z-10">
            <span className="text-gray-300 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Engaged users</span>
          </div>
        </div>
      </div>

      {/* API Server Information */}
      {apiInfo && (
        <div className="rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 backdrop-blur-sm animate-popup" style={{ background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.9))', border: '1px solid rgba(107, 114, 128, 0.3)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))' }}>
                <BarChart3 className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>API Server</h2>
                <p className="text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>Version {apiInfo.version}</p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(34, 197, 94, 0.2)', color: 'rgb(74, 222, 128)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
              Online
            </div>
          </div>
          
          <p className="text-sm text-gray-300 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            {apiInfo.message}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(apiInfo.endpoints || {}).map(([key, endpoint]) => (
              <div 
                key={key}
                className="p-3 rounded-lg border transition-all duration-200 hover:scale-105 cursor-pointer"
                style={{ background: 'rgba(17, 24, 39, 0.6)', borderColor: 'rgba(107, 114, 128, 0.3)' }}
                onClick={() => {
                  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
                  const baseUrl = apiBaseUrl.replace('/api', '')
                  window.open(`${baseUrl}${endpoint}`, '_blank')
                }}
              >
                <p className="text-xs font-semibold text-gray-400 mb-1 uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {key}
                </p>
                <p className="text-xs text-cyan-400 font-mono truncate" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {endpoint}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(107, 114, 128, 0.3)' }}>
            <p className="text-xs text-gray-400 italic" style={{ fontFamily: "'Inter', sans-serif" }}>
              {apiInfo.documentation}
            </p>
          </div>
        </div>
      )}

      {/* Recent Chatbots & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Chatbots */}
        <div className="rounded-xl shadow-lg p-4 hover:shadow-xl transition-all duration-300 backdrop-blur-sm animate-popup" style={{ background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.8))', border: '1px solid rgba(107, 114, 128, 0.3)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>{t('recentChatbots')}</h2>
            <button
              onClick={() => navigate('/chatbots')}
              className="text-xs text-white px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 group transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))', fontFamily: "'Inter', sans-serif" }}
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
            </button>
          </div>
          {loading ? (
            <div className="text-center py-8">
              <div className="relative inline-block">
                <div className="animate-spin rounded-full h-10 w-10 border-3 border-gray-600"></div>
                <div className="animate-spin rounded-full h-10 w-10 border-t-3 border-gray-400 absolute top-0 left-0"></div>
              </div>
              <p className="text-gray-300 mt-3 text-sm font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Loading...</p>
            </div>
          ) : recentChatbots.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ background: 'rgba(55, 65, 81, 0.5)' }}>
                <Bot className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-300 mb-4 font-semibold text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>No chatbots yet</p>
              <button
                onClick={() => navigate('/create')}
                className="px-4 py-2 text-xs text-white rounded-lg transition-all duration-300 font-semibold shadow-md hover:shadow-lg hover:scale-105"
                style={{ background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))', fontFamily: "'Inter', sans-serif" }}
              >
                {t('createNewChatbot')}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {recentChatbots.map((chatbot) => (
                <div
                  key={chatbot._id}
                  className="flex items-center justify-between p-3 rounded-lg transition-all duration-300 cursor-pointer group hover:shadow-lg hover:scale-[1.01] backdrop-blur-sm"
                  style={{ background: 'rgba(31, 41, 55, 0.6)', border: '1px solid rgba(107, 114, 128, 0.3)' }}
                  onClick={() => navigate('/chatbots')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(55, 65, 81, 0.7)'
                    e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.5)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(31, 41, 55, 0.6)'
                    e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.3)'
                  }}
                >
                  <div className="flex items-center space-x-2.5">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-sm shadow-sm group-hover:scale-105 group-hover:rotate-6 transition-all duration-300 border border-gray-600"
                      style={{ background: 'rgba(55, 65, 81, 0.8)' }}
                    >
                      {chatbot.iconImage ? (
                        <img
                          src={chatbot.iconImage}
                          alt={chatbot.name}
                          className="w-full h-full rounded-lg object-cover"
                        />
                      ) : (
                        <span className="text-white text-sm">{chatbot.icon || '💬'}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-white group-hover:text-gray-200 transition-colors duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>{chatbot.name || chatbot.propertyName + ' Chatbot'}</p>
                      <p className="text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {chatbot.propertyName} • {new Date(chatbot.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold shadow-sm transition-all duration-300 ${
                    chatbot.isActive
                      ? 'text-white group-hover:scale-105'
                      : 'text-gray-400 border border-gray-600'
                  }`}
                  style={chatbot.isActive ? { background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))', fontFamily: "'Inter', sans-serif" } : { background: 'rgba(31, 41, 55, 0.5)', fontFamily: "'Inter', sans-serif" }}
                  >
                    {chatbot.isActive ? t('active') : t('inactive')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl shadow-lg p-4 hover:shadow-xl transition-all duration-300 backdrop-blur-sm animate-popup" style={{ background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.8))', border: '1px solid rgba(107, 114, 128, 0.3)' }}>
          <h2 className="text-lg font-bold text-white mb-4 tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>{t('quickActions')}</h2>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/create')}
              className="w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 group hover:shadow-lg hover:scale-[1.01] backdrop-blur-sm"
              style={{ background: 'rgba(31, 41, 55, 0.6)', border: '1px solid rgba(107, 114, 128, 0.3)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(55, 65, 81, 0.7)'
                e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(31, 41, 55, 0.6)'
                e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.3)'
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 group-hover:rotate-12 transition-all duration-300 border border-gray-600" style={{ background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))' }}>
                  <Plus className="w-5 h-5 text-white drop-shadow-md" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm text-white group-hover:text-gray-200 transition-colors duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>Create New Chatbot</p>
                  <p className="text-xs text-gray-400 font-normal" style={{ fontFamily: "'Inter', sans-serif" }}>Set up a new chatbot for your website</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
            </button>

            <button
              onClick={() => navigate('/chatbots')}
              className="w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 group hover:shadow-lg hover:scale-[1.01] backdrop-blur-sm"
              style={{ background: 'rgba(31, 41, 55, 0.6)', border: '1px solid rgba(107, 114, 128, 0.3)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(55, 65, 81, 0.7)'
                e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(31, 41, 55, 0.6)'
                e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.3)'
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 group-hover:rotate-12 transition-all duration-300 border border-gray-600" style={{ background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))' }}>
                  <Bot className="w-5 h-5 text-white drop-shadow-md" />
                </div>
                <div className="text-left">
                    <p className="font-semibold text-sm text-white group-hover:text-gray-200 transition-colors duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>{t('manageChatbots')}</p>
                  <p className="text-xs text-gray-400 font-normal" style={{ fontFamily: "'Inter', sans-serif" }}>View and edit your existing chatbots</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
            </button>

            <button
              onClick={() => navigate('/appearance')}
              className="w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 group hover:shadow-lg hover:scale-[1.01] backdrop-blur-sm"
              style={{ background: 'rgba(31, 41, 55, 0.6)', border: '1px solid rgba(107, 114, 128, 0.3)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(55, 65, 81, 0.7)'
                e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(31, 41, 55, 0.6)'
                e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.3)'
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 group-hover:rotate-12 transition-all duration-300 border border-gray-600" style={{ background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))' }}>
                  <BarChart3 className="w-5 h-5 text-white drop-shadow-md" />
                </div>
                <div className="text-left">
                    <p className="font-semibold text-sm text-white group-hover:text-gray-200 transition-colors duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>{t('customizeAppearance')}</p>
                  <p className="text-xs text-gray-400 font-normal" style={{ fontFamily: "'Inter', sans-serif" }}>Change themes and styling</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
            </button>

            <button
              onClick={() => navigate('/preview')}
              className="w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 group hover:shadow-lg hover:scale-[1.01] backdrop-blur-sm"
              style={{ background: 'rgba(31, 41, 55, 0.6)', border: '1px solid rgba(107, 114, 128, 0.3)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(55, 65, 81, 0.7)'
                e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(31, 41, 55, 0.6)'
                e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.3)'
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 group-hover:rotate-12 transition-all duration-300 border border-gray-600" style={{ background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))' }}>
                  <MessageSquare className="w-5 h-5 text-white drop-shadow-md" />
                </div>
                <div className="text-left">
                    <p className="font-semibold text-sm text-white group-hover:text-gray-200 transition-colors duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>{t('previewChatbot')}</p>
                  <p className="text-xs text-gray-400 font-normal" style={{ fontFamily: "'Inter', sans-serif" }}>Test your chatbot before going live</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

