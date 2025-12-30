import { useState, useEffect } from 'react'
import { Save, Eye, Upload, X, Bot, Palette } from 'lucide-react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import ChatbotWidget from './ChatbotWidget'

const Appearance = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [chatbots, setChatbots] = useState([])
  const [chatbot, setChatbot] = useState(location.state?.chatbot || null)
  const [formData, setFormData] = useState({
    name: '',
    welcomeMessage: '',
    personality: 'Friendly',
    theme: 'light',
    primaryColor: '#3B82F6',
    position: 'Bottom Right',
    icon: '💬',
    iconImage: '',
    knowledgeSource: '',
    faqs: [],
    enableMongoDBJokes: false
  })
  const [loading, setLoading] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewChatOpen, setPreviewChatOpen] = useState(false)
  const [uploadedIcon, setUploadedIcon] = useState(null)

  useEffect(() => {
    fetchChatbots()
    if (location.state?.chatbot) {
      setChatbot(location.state.chatbot)
    }
  }, [])

  useEffect(() => {
    if (chatbot) {
      setFormData({
        name: chatbot.name || '',
        welcomeMessage: chatbot.welcomeMessage || '',
        personality: chatbot.personality || 'Friendly',
        theme: chatbot.theme || 'light',
        primaryColor: chatbot.primaryColor || '#3B82F6',
        position: chatbot.position || 'Bottom Right',
        icon: chatbot.icon || '💬',
        iconImage: chatbot.iconImage || '',
        knowledgeSource: chatbot.knowledgeSource || '',
        faqs: chatbot.faqs || [],
        enableMongoDBJokes: chatbot.enableMongoDBJokes || false
      })
      if (chatbot.iconImage) {
        setUploadedIcon(chatbot.iconImage)
      }
    }
  }, [chatbot])

  const fetchChatbots = async () => {
    try {
      const response = await axios.get('/api/chatbots')
      setChatbots(response.data || [])
      // If no chatbot selected but chatbots exist, select first one
      if (!chatbot && response.data && response.data.length > 0) {
        setChatbot(response.data[0])
      }
    } catch (error) {
      console.error('Error fetching chatbots:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleIconUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formDataUpload = new FormData()
    formDataUpload.append('icon', file)

    try {
      const response = await axios.post('/api/upload/icon', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      setUploadedIcon(response.data.url)
      setFormData(prev => ({ ...prev, iconImage: response.data.url }))
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload icon')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!chatbot) {
      alert('No chatbot selected')
      return
    }

    setLoading(true)

    try {
      await axios.put(`/api/chatbots/${chatbot._id}`, formData)
      alert('Chatbot updated successfully!')
      navigate('/chatbots')
    } catch (error) {
      console.error('Error updating chatbot:', error)
      alert('Failed to update chatbot')
    } finally {
      setLoading(false)
    }
  }

  if (!chatbot) {
    return (
      <div className="max-w-4xl mx-auto relative">
        {/* Floating Background Effects */}
        
        <div className="rounded-lg shadow-sm p-8 text-center backdrop-blur-md animate-popup" style={{ background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.9))', border: '1px solid rgba(107, 114, 128, 0.3)' }}>
          <Bot className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-1.5">No chatbot selected</h3>
          <p className="text-gray-300 mb-4 text-sm">Please select a chatbot to edit its appearance</p>
          {chatbots.length > 0 ? (
            <div className="space-y-2 max-w-md mx-auto">
              {chatbots.map((cb) => (
                <button
                  key={cb._id}
                  onClick={() => setChatbot(cb)}
                  className="w-full px-4 py-2 text-sm text-white rounded-lg transition-all duration-300 font-semibold shadow-lg hover:shadow-xl text-left"
                  style={{ background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))' }}
                >
                  {cb.name || cb.propertyName + ' Chatbot'}
                </button>
              ))}
            </div>
          ) : (
            <button
              onClick={() => navigate('/chatbots')}
              className="px-4 py-2 text-sm text-white rounded-lg transition-colors font-semibold"
              style={{ background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))' }}
            >
              Go to My Chatbots
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto relative">
      
      
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white">Appearance Settings</h2>
        <p className="text-gray-300 mt-1 text-sm">Customize the look and feel of your chatbot</p>
      </div>

      {/* Chatbot Selector */}
      {chatbots.length > 1 && (
        <div className="rounded-xl shadow-md p-4 mb-6 backdrop-blur-md animate-popup" style={{ background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.9))', border: '1px solid rgba(107, 114, 128, 0.3)' }}>
          <label className="block text-sm font-semibold text-gray-300 mb-3">Select Chatbot</label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {chatbots.map((cb) => (
              <button
                key={cb._id}
                onClick={() => setChatbot(cb)}
                className={`p-3 rounded-lg border-2 transition-all duration-300 text-left ${
                  chatbot?._id === cb._id
                    ? 'shadow-md'
                    : ''
                }`}
                style={chatbot?._id === cb._id ? { background: 'linear-gradient(135deg, rgba(55, 65, 81, 0.8), rgba(31, 41, 55, 0.8))', borderColor: 'rgba(107, 114, 128, 0.5)' } : { background: 'rgba(31, 41, 55, 0.6)', borderColor: 'rgba(107, 114, 128, 0.3)' }}
                onMouseEnter={(e) => {
                  if (chatbot?._id !== cb._id) {
                    e.currentTarget.style.background = 'rgba(55, 65, 81, 0.7)'
                    e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.5)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (chatbot?._id !== cb._id) {
                    e.currentTarget.style.background = 'rgba(31, 41, 55, 0.6)'
                    e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.3)'
                  }
                }}
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                    style={{ backgroundColor: cb.primaryColor + '20', border: '1px solid rgba(107, 114, 128, 0.3)' }}
                  >
                    {cb.iconImage ? (
                      <img src={cb.iconImage} alt={cb.name} className="w-full h-full rounded-lg object-cover" />
                    ) : (
                      <span>{cb.icon}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-300 truncate">{cb.name || cb.propertyName + ' Chatbot'}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl shadow-lg overflow-hidden backdrop-blur-md animate-popup" style={{ background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.9))', border: '1px solid rgba(107, 114, 128, 0.3)' }}>
        <div className="p-6 border-b relative overflow-hidden" style={{ borderColor: 'rgba(107, 114, 128, 0.3)', background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.8))' }}>
          {/* Animated Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(107,114,128,0.1),transparent_50%)] animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent animate-gradient-x" style={{ backgroundSize: '200% 100%' }}></div>
          
          <div className="flex items-center space-x-3 relative z-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))' }}>
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Edit Appearance</h2>
              <p className="text-xs text-gray-300 mt-1">Customize the look and feel of your chatbot</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Chatbot Theme */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Chatbot Theme *
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, theme: 'light' }))}
                className={`px-3 py-2.5 border-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg ${
                  formData.theme === 'light'
                    ? 'text-white scale-105'
                    : 'text-gray-400'
                }`}
                style={formData.theme === 'light' ? { background: 'linear-gradient(135deg, rgba(55, 65, 81, 0.8), rgba(31, 41, 55, 0.8))', borderColor: 'rgba(107, 114, 128, 0.5)' } : { background: 'rgba(31, 41, 55, 0.5)', borderColor: 'rgba(107, 114, 128, 0.3)' }}
                onMouseEnter={(e) => {
                  if (formData.theme !== 'light') {
                    e.currentTarget.style.background = 'rgba(55, 65, 81, 0.6)'
                    e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.5)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (formData.theme !== 'light') {
                    e.currentTarget.style.background = 'rgba(31, 41, 55, 0.5)'
                    e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.3)'
                  }
                }}
              >
                <div className="text-center">
                  <div className="w-full h-8 rounded-lg mb-2" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(107, 114, 128, 0.3)' }}></div>
                  <span className="text-xs font-medium">Light</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, theme: 'dark' }))}
                className={`px-3 py-2.5 border-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg ${
                  formData.theme === 'dark'
                    ? 'text-white scale-105'
                    : 'text-gray-400'
                }`}
                style={formData.theme === 'dark' ? { background: 'linear-gradient(135deg, rgba(55, 65, 81, 0.8), rgba(31, 41, 55, 0.8))', borderColor: 'rgba(107, 114, 128, 0.5)' } : { background: 'rgba(31, 41, 55, 0.5)', borderColor: 'rgba(107, 114, 128, 0.3)' }}
                onMouseEnter={(e) => {
                  if (formData.theme !== 'dark') {
                    e.currentTarget.style.background = 'rgba(55, 65, 81, 0.6)'
                    e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.5)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (formData.theme !== 'dark') {
                    e.currentTarget.style.background = 'rgba(31, 41, 55, 0.5)'
                    e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.3)'
                  }
                }}
              >
                <div className="text-center">
                  <div className="w-full h-8 rounded-lg mb-2" style={{ background: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(107, 114, 128, 0.5)' }}></div>
                  <span className="text-xs font-semibold">Dark</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, theme: 'custom' }))}
                className={`px-3 py-2.5 border-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg ${
                  formData.theme === 'custom'
                    ? 'text-white scale-105'
                    : 'text-gray-400'
                }`}
                style={formData.theme === 'custom' ? { background: 'linear-gradient(135deg, rgba(55, 65, 81, 0.8), rgba(31, 41, 55, 0.8))', borderColor: 'rgba(107, 114, 128, 0.5)' } : { background: 'rgba(31, 41, 55, 0.5)', borderColor: 'rgba(107, 114, 128, 0.3)' }}
                onMouseEnter={(e) => {
                  if (formData.theme !== 'custom') {
                    e.currentTarget.style.background = 'rgba(55, 65, 81, 0.6)'
                    e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.5)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (formData.theme !== 'custom') {
                    e.currentTarget.style.background = 'rgba(31, 41, 55, 0.5)'
                    e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.3)'
                  }
                }}
              >
                <div className="text-center">
                  <div className="w-full h-8 rounded-lg mb-2" style={{ background: 'linear-gradient(90deg, rgba(55, 65, 81, 0.8), rgba(31, 41, 55, 0.8))' }}></div>
                  <span className="text-xs font-medium">Custom</span>
                </div>
              </button>
            </div>
          </div>

          {/* Primary Color */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Primary Color *
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="color"
                name="primaryColor"
                value={formData.primaryColor}
                onChange={handleChange}
                className="w-20 h-12 rounded-xl cursor-pointer shadow-md hover:shadow-lg transition-all duration-300"
                style={{ border: '2px solid rgba(107, 114, 128, 0.3)' }}
              />
              <input
                type="text"
                value={formData.primaryColor}
                onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="flex-1 px-4 py-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md text-white placeholder-gray-500"
                style={{ background: 'rgba(31, 41, 55, 0.6)', border: '1px solid rgba(107, 114, 128, 0.3)' }}
                placeholder="#3B82F6"
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(107, 114, 128, 0.6)'
                  e.target.style.boxShadow = '0 0 0 2px rgba(107, 114, 128, 0.2)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(107, 114, 128, 0.3)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Position *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, position: 'Bottom Left' }))}
                className={`px-4 py-2.5 border-2 rounded-lg transition-all duration-300 font-semibold text-sm shadow-md hover:shadow-lg ${
                  formData.position === 'Bottom Left'
                    ? 'text-white scale-105'
                    : 'text-gray-400'
                }`}
                style={formData.position === 'Bottom Left' ? { background: 'linear-gradient(135deg, rgba(55, 65, 81, 0.8), rgba(31, 41, 55, 0.8))', borderColor: 'rgba(107, 114, 128, 0.5)' } : { background: 'rgba(31, 41, 55, 0.5)', borderColor: 'rgba(107, 114, 128, 0.3)' }}
                onMouseEnter={(e) => {
                  if (formData.position !== 'Bottom Left') {
                    e.currentTarget.style.background = 'rgba(55, 65, 81, 0.6)'
                    e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.5)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (formData.position !== 'Bottom Left') {
                    e.currentTarget.style.background = 'rgba(31, 41, 55, 0.5)'
                    e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.3)'
                  }
                }}
              >
                Bottom Left
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, position: 'Bottom Right' }))}
                className={`px-4 py-2.5 border-2 rounded-lg transition-all duration-300 font-semibold text-sm shadow-md hover:shadow-lg ${
                  formData.position === 'Bottom Right'
                    ? 'text-white scale-105'
                    : 'text-gray-400'
                }`}
                style={formData.position === 'Bottom Right' ? { background: 'linear-gradient(135deg, rgba(55, 65, 81, 0.8), rgba(31, 41, 55, 0.8))', borderColor: 'rgba(107, 114, 128, 0.5)' } : { background: 'rgba(31, 41, 55, 0.5)', borderColor: 'rgba(107, 114, 128, 0.3)' }}
                onMouseEnter={(e) => {
                  if (formData.position !== 'Bottom Right') {
                    e.currentTarget.style.background = 'rgba(55, 65, 81, 0.6)'
                    e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.5)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (formData.position !== 'Bottom Right') {
                    e.currentTarget.style.background = 'rgba(31, 41, 55, 0.5)'
                    e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.3)'
                  }
                }}
              >
                Bottom Right
              </button>
            </div>
          </div>

          {/* Chatbot Icon */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Chatbot Icon
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md text-white placeholder-gray-500"
                  style={{ background: 'rgba(31, 41, 55, 0.6)', border: '1px solid rgba(107, 114, 128, 0.3)' }}
                  placeholder="💬"
                  maxLength={2}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(107, 114, 128, 0.6)'
                    e.target.style.boxShadow = '0 0 0 2px rgba(107, 114, 128, 0.2)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(107, 114, 128, 0.3)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                <p className="text-xs text-gray-400 mt-2">Enter an emoji or upload an image</p>
              </div>
              <div className="text-3xl">{formData.icon}</div>
            </div>
            <div className="mt-4">
              <label className="flex items-center justify-center px-4 py-2 text-sm rounded-lg cursor-pointer transition-all duration-300 font-semibold shadow-sm hover:shadow-md text-gray-300"
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
                <Upload className="w-5 h-5 mr-2" />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIconUpload}
                  className="hidden"
                />
              </label>
            </div>
            {uploadedIcon && (
              <div className="mt-4 flex items-center space-x-3 p-3 rounded-xl" style={{ background: 'rgba(31, 41, 55, 0.6)', border: '1px solid rgba(107, 114, 128, 0.3)' }}>
                <img src={uploadedIcon} alt="Icon" className="w-12 h-12 rounded-xl object-cover border-2 shadow-md" style={{ borderColor: 'rgba(107, 114, 128, 0.5)' }} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Icon uploaded</p>
                  <p className="text-xs text-gray-500">Click X to remove</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setUploadedIcon(null)
                    setFormData(prev => ({ ...prev, iconImage: '' }))
                  }}
                  className="p-2 rounded-lg transition-colors text-red-400 hover:text-red-300"
                  style={{ background: 'rgba(31, 41, 55, 0.5)' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Welcome Message */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Welcome Message *
            </label>
            <textarea
              name="welcomeMessage"
              value={formData.welcomeMessage}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md text-white placeholder-gray-500 resize-none"
              style={{ background: 'rgba(31, 41, 55, 0.6)', border: '1px solid rgba(107, 114, 128, 0.3)' }}
              placeholder="Hello! How can I help you today?"
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(107, 114, 128, 0.6)'
                e.target.style.boxShadow = '0 0 0 2px rgba(107, 114, 128, 0.2)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(107, 114, 128, 0.3)'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* Bot Personality */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Bot Personality *
            </label>
            <select
              name="personality"
              value={formData.personality}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md text-white font-medium"
              style={{ background: 'rgba(31, 41, 55, 0.6)', border: '1px solid rgba(107, 114, 128, 0.3)' }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(107, 114, 128, 0.6)'
                e.target.style.boxShadow = '0 0 0 2px rgba(107, 114, 128, 0.2)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(107, 114, 128, 0.3)'
                e.target.style.boxShadow = 'none'
              }}
            >
              <option value="Friendly" style={{ background: 'rgb(31, 41, 55)' }}>Friendly</option>
              <option value="Professional" style={{ background: 'rgb(31, 41, 55)' }}>Professional</option>
              <option value="Funny" style={{ background: 'rgb(31, 41, 55)' }}>Funny</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'rgba(107, 114, 128, 0.3)' }}>
            <button
              type="button"
              onClick={() => navigate('/chatbots')}
              className="px-4 py-2 text-sm rounded-lg transition-all duration-300 font-semibold hover:scale-105 active:scale-95 text-gray-300"
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
              Cancel
            </button>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="flex items-center space-x-1.5 px-4 py-2 text-sm rounded-lg transition-all duration-300 font-semibold hover:scale-105 active:scale-95 shadow-md hover:shadow-lg text-gray-300"
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
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-1.5 px-5 py-2 text-sm text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))' }}
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => {
          setPreviewOpen(false)
          setPreviewChatOpen(false)
        }}>
          <div className="rounded-xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto backdrop-blur-md animate-popup" style={{ background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95))', border: '1px solid rgba(107, 114, 128, 0.5)' }} onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b relative overflow-hidden" style={{ borderColor: 'rgba(107, 114, 128, 0.3)', background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.8))' }}>
              {/* Animated Background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(107,114,128,0.1),transparent_50%)] animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent animate-gradient-x" style={{ backgroundSize: '200% 100%' }}></div>
              
              <div className="flex justify-between items-center relative z-10">
                <h3 className="text-2xl font-bold text-white">Live Preview</h3>
                <button
                  onClick={() => {
                    setPreviewOpen(false)
                    setPreviewChatOpen(false)
                  }}
                  className="p-2 rounded-lg transition-colors text-gray-400 hover:text-white"
                  style={{ background: 'rgba(31, 41, 55, 0.5)' }}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="rounded-xl p-4 relative overflow-hidden" style={{ minHeight: '600px', background: 'rgba(17, 24, 39, 0.6)', border: '1px solid rgba(107, 114, 128, 0.3)' }}>
                {/* Floating button */}
                {!previewChatOpen && (
                  <button
                    onClick={() => setPreviewChatOpen(true)}
                    className="absolute bottom-4 right-4 w-16 h-16 rounded-full flex items-center justify-center text-2xl text-white shadow-2xl hover:scale-110 transition-all duration-300 z-20 ring-4 ring-gray-600/40 hover:ring-gray-500/60 hover:shadow-2xl animate-popup"
                    style={{ background: 'linear-gradient(135deg, rgb(17, 24, 39) 0%, rgb(31, 41, 55) 50%, rgb(0, 0, 0) 100%)' }}
                  >
                    {uploadedIcon || formData.iconImage ? (
                      <img
                        src={uploadedIcon || formData.iconImage}
                        alt="Chatbot Icon"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span>{formData.icon}</span>
                    )}
                  </button>
                )}

                {/* Chatbot Widget */}
                {previewChatOpen && (
                  <div className={`absolute ${formData.position === 'Bottom Left' ? 'bottom-4 left-4' : 'bottom-4 right-4'} z-10`}>
                    <ChatbotWidget
                      chatbot={{
                        ...formData,
                        _id: chatbot._id,
                        name: chatbot.name || chatbot.propertyName + ' Chatbot',
                        iconImage: uploadedIcon || formData.iconImage,
                        theme: formData.theme
                      }}
                      messages={[]}
                      onSendMessage={() => {}}
                      inputMessage=""
                      setInputMessage={() => {}}
                      onClose={() => setPreviewChatOpen(false)}
                      showInput={true}
                    />
                  </div>
                )}

                {!previewChatOpen && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500 text-lg">Click the floating button to open the chatbot preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Appearance

