import { useState, useEffect } from 'react'
import { Save, Eye, Upload, X, Copy, Check } from 'lucide-react'
import api, { axios } from '../utils/api'
import ChatbotWidget from './ChatbotWidget'

const CreateChatbot = () => {
  const [formData, setFormData] = useState({
    propertyName: '',
    siteUrl: '',
    name: '',
    welcomeMessage: 'Hello! How can I help you today?',
    personality: 'Friendly',
    theme: 'light', // light, dark, custom
    primaryColor: '#3B82F6',
    position: 'Bottom Right',
    icon: '💬',
    iconImage: '',
    knowledgeSource: '',
    faqs: [{ question: '', answer: '' }],
    enableMongoDBJokes: false
  })
  const [loading, setLoading] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewChatOpen, setPreviewChatOpen] = useState(false)
  const [uploadedIcon, setUploadedIcon] = useState(null)
  const [createdChatbot, setCreatedChatbot] = useState(null)
  const [copied, setCopied] = useState(false)
  const [currentStep, setCurrentStep] = useState(1) // 1: Property Details, 2: Chatbot Configuration, 3: Installation

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFAQChange = (index, field, value) => {
    const newFAQs = [...formData.faqs]
    newFAQs[index][field] = value
    setFormData(prev => ({ ...prev, faqs: newFAQs }))
  }

  const addFAQ = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }))
  }

  const removeFAQ = (index) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }))
  }

  const handleIconUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formDataUpload = new FormData()
    formDataUpload.append('icon', file)

    try {
      const response = await api.post('/upload/icon', formDataUpload, {
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
    setLoading(true)

    try {
      const payload = {
        ...formData,
        // Set default values for removed fields
        name: formData.propertyName || 'Chatbot',
        welcomeMessage: 'Hello! How can I help you today?',
        personality: 'Friendly',
        primaryColor: '#3B82F6',
        faqs: [],
        enableMongoDBJokes: false,
        knowledgeSource: ''
      }
      console.log('Submitting payload:', payload)
      const response = await api.post('/chatbots', payload)
      console.log('Chatbot created:', response.data)
      setCreatedChatbot(response.data)
      // Automatically move to installation step to show script
      setCurrentStep(3)
    } catch (error) {
      console.error('Error creating chatbot:', error)
      console.error('Error response:', error.response?.data)
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create chatbot'
      alert(`Failed to create chatbot: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const generateScriptCode = () => {
    if (!createdChatbot) return ''
    const chatbotId = createdChatbot._id
    const position = createdChatbot.position === 'Bottom Left' ? 'left' : 'right'
    
    // Use environment variables or fallback to current origin
    const frontendUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin
    const apiUrl = import.meta.env.VITE_API_URL || `${window.location.origin.replace(':3000', ':5000')}/api`
    
    // Widget URL - use frontend URL
    const widgetUrl = `${frontendUrl}/chatbot-widget.js`
    
    return `<!--Start of AllMyTab Chatbot Widget Script-->
<script type="text/javascript">
(function(){
var Chatbot_API = Chatbot_API || {};
Chatbot_API.chatbotId = '${chatbotId}';
Chatbot_API.position = '${position}';
Chatbot_API.apiUrl = '${apiUrl}';
var s1 = document.createElement("script");
var s0 = document.getElementsByTagName("script")[0];
s1.async = true;
s1.src = '${widgetUrl}';
s1.charset = 'UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1, s0);
})();
</script>
<!--End of AllMyTab Chatbot Widget Script-->`
  }

  const handleCopyCode = () => {
    const code = generateScriptCode()
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleNext = () => {
    if (currentStep === 1) {
      // Validate Property Details
      if (!formData.propertyName.trim() || !formData.siteUrl.trim()) {
        alert('Please fill in Property Name and Site URL')
        return
      }
      setCurrentStep(2)
    }
  }

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1)
    }
  }

  const handleDone = () => {
    // Reset everything
    setCreatedChatbot(null)
    setCurrentStep(1)
    setFormData({
      propertyName: '',
      siteUrl: '',
      name: '',
      welcomeMessage: 'Hello! How can I help you today?',
      personality: 'Friendly',
      theme: 'light',
      primaryColor: '#3B82F6',
      position: 'Bottom Right',
      icon: '💬',
      iconImage: '',
      knowledgeSource: '',
      faqs: [{ question: '', answer: '' }],
      enableMongoDBJokes: false
    })
    setUploadedIcon(null)
  }

  useEffect(() => {
    if (createdChatbot) {
      setCurrentStep(3)
    }
  }, [createdChatbot])

  return (
    <div className="max-w-5xl mx-auto relative">
      {/* Floating Background Effects */}
      <div className="absolute inset-0 -z-10">
        {[...Array(10)].map((_, i) => (
          <div
            key={`bg-orb-${i}`}
            className="absolute rounded-full animate-float blur-2xl"
            style={{
              width: `${100 + Math.random() * 200}px`,
              height: `${100 + Math.random() * 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 12}s`,
              background: `radial-gradient(circle, rgba(${107 + Math.random() * 50}, ${114 + Math.random() * 50}, ${128 + Math.random() * 50}, 0.2), transparent)`,
              opacity: 0.3 + Math.random() * 0.3
            }}
          ></div>
        ))}
      </div>
      
      <div className="rounded-xl shadow-xl overflow-hidden backdrop-blur-md animate-popup" style={{ background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.9))', border: '1px solid rgba(107, 114, 128, 0.3)' }}>
        {/* Progress Indicator */}
        <div className="p-4 border-b relative overflow-hidden" style={{ borderColor: 'rgba(107, 114, 128, 0.3)', background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.8))' }}>
          {/* Animated Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(107,114,128,0.1),transparent_50%)] animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent animate-gradient-x" style={{ backgroundSize: '200% 100%' }}></div>
          
          <div className="relative z-10">
            <h1 className="text-xl font-bold text-white mb-3">Create New Chatbot</h1>
          <div className="flex items-center justify-center space-x-3 mb-2">
            <div className={`flex items-center transition-all duration-300 ${currentStep >= 1 ? 'text-white' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-lg ${
                currentStep >= 1 ? 'text-white scale-110' : 'border-gray-600'
              }`}
              style={currentStep >= 1 ? { background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))', borderColor: 'rgba(107, 114, 128, 0.5)' } : { background: 'rgba(31, 41, 55, 0.5)', borderColor: 'rgba(107, 114, 128, 0.5)' }}
              >
                {currentStep > 1 ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <span className="text-xs font-bold">1</span>
                )}
              </div>
              <span className="ml-2 text-xs font-semibold text-gray-300">Property Details</span>
            </div>
            <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${currentStep >= 2 ? '' : ''}`}
            style={currentStep >= 2 ? { background: 'linear-gradient(90deg, rgb(55, 65, 81), rgb(31, 41, 55))' } : { background: 'rgba(55, 65, 81, 0.3)' }}
            ></div>
            <div className={`flex items-center transition-all duration-300 ${currentStep >= 2 ? 'text-white' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-lg ${
                currentStep >= 2 ? 'text-white scale-110' : 'border-gray-600'
              }`}
              style={currentStep >= 2 ? { background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))', borderColor: 'rgba(107, 114, 128, 0.5)' } : { background: 'rgba(31, 41, 55, 0.5)', borderColor: 'rgba(107, 114, 128, 0.5)' }}
              >
                {currentStep > 2 ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <span className="text-xs font-bold">2</span>
                )}
              </div>
              <span className="ml-2 text-xs font-semibold text-gray-300">Configuration</span>
            </div>
            {createdChatbot && (
              <>
                <div className={`flex-1 h-1 rounded-full transition-all duration-300`}
                style={currentStep >= 3 ? { background: 'linear-gradient(90deg, rgb(55, 65, 81), rgb(31, 41, 55))' } : { background: 'rgba(55, 65, 81, 0.3)' }}
                ></div>
                <div className={`flex items-center transition-all duration-300 ${currentStep >= 3 ? 'text-white' : 'text-gray-500'}`}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-lg ${
                    currentStep >= 3 ? 'text-white scale-110' : 'border-gray-600'
                  }`}
                  style={currentStep >= 3 ? { background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))', borderColor: 'rgba(107, 114, 128, 0.5)' } : { background: 'rgba(31, 41, 55, 0.5)', borderColor: 'rgba(107, 114, 128, 0.5)' }}
                  >
                    <span className="text-xs font-bold">3</span>
                  </div>
                  <span className="ml-2 text-xs font-semibold text-gray-300">Install Widget</span>
                </div>
              </>
            )}
          </div>
          </div>
        </div>

        {!createdChatbot ? (
          currentStep === 1 ? (
            /* Step 1: Property Details */
            <div className="p-4">
              <h2 className="text-lg font-bold text-white mb-4">Property Details</h2>
              
              <div className="space-y-4">
                {/* Property Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    Property Name *
                  </label>
                  <input
                    type="text"
                    name="propertyName"
                    value={formData.propertyName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm rounded-lg transition-all duration-300 shadow-sm hover:shadow-md text-white placeholder-gray-400"
                    style={{ background: 'rgba(75, 85, 99, 0.5)', border: '1px solid rgba(156, 163, 175, 0.4)' }}
                    placeholder="Enter property name"
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(156, 163, 175, 0.7)'
                      e.target.style.boxShadow = '0 0 0 2px rgba(156, 163, 175, 0.3)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(156, 163, 175, 0.4)'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>

                {/* Site URL */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    Site URL *
                  </label>
                  <input
                    type="url"
                    name="siteUrl"
                    value={formData.siteUrl}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm rounded-lg transition-all duration-300 shadow-sm hover:shadow-md text-white placeholder-gray-400"
                    style={{ background: 'rgba(75, 85, 99, 0.5)', border: '1px solid rgba(156, 163, 175, 0.4)' }}
                    placeholder="https://"
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(156, 163, 175, 0.7)'
                      e.target.style.boxShadow = '0 0 0 2px rgba(156, 163, 175, 0.3)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(156, 163, 175, 0.4)'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-4 pt-4 border-t" style={{ borderColor: 'rgba(107, 114, 128, 0.3)' }}>
                <button
                  type="button"
                  onClick={() => window.history.back()}
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
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2 text-sm text-white rounded-lg transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))' }}
                >
                  Next →
                </button>
              </div>
            </div>
          ) : (
            /* Step 2: Chatbot Configuration */
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <h2 className="text-lg font-bold text-white mb-1">Chatbot Configuration</h2>
              <p className="text-gray-300 mb-4 text-sm">Configure your chatbot settings and appearance</p>

            {/* Chatbot Theme */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-2">
              Chatbot Theme *
            </label>
            <div className="grid grid-cols-3 gap-3">
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
                  <div className="w-full h-6 rounded mb-1.5" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(107, 114, 128, 0.3)' }}></div>
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
                  <div className="w-full h-6 rounded-lg mb-1.5" style={{ background: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(107, 114, 128, 0.5)' }}></div>
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
                  <div className="w-full h-6 rounded mb-1.5" style={{ background: 'linear-gradient(90deg, rgba(55, 65, 81, 0.8), rgba(31, 41, 55, 0.8))' }}></div>
                  <span className="text-xs font-medium">Custom</span>
                </div>
              </button>
            </div>
          </div>

          {/* Position */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-2">
              Position *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, position: 'Bottom Left' }))}
                className={`px-4 py-2.5 text-sm border-2 rounded-lg transition-all duration-300 font-semibold shadow-md hover:shadow-lg ${
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
                className={`px-4 py-2.5 text-sm border-2 rounded-lg transition-all duration-300 font-semibold shadow-md hover:shadow-lg ${
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
            <label className="block text-xs font-medium text-gray-300 mb-2">
              Chatbot Icon
            </label>
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 text-sm rounded-lg text-white placeholder-gray-500 transition-all duration-300"
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
                <p className="text-xs text-gray-400 mt-1">Or use emoji</p>
              </div>
              <div className="relative">
                <label className="flex items-center justify-center px-3 py-1.5 text-sm rounded-lg cursor-pointer transition-colors text-gray-300"
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
                  <Upload className="w-4 h-4 mr-1.5" />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleIconUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            {uploadedIcon && (
              <div className="mt-3 flex items-center space-x-2">
                <img src={uploadedIcon} alt="Icon" className="w-10 h-10 rounded" />
                <button
                  type="button"
                  onClick={() => {
                    setUploadedIcon(null)
                    setFormData(prev => ({ ...prev, iconImage: '' }))
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'rgba(107, 114, 128, 0.3)' }}>
            <button
              type="button"
              onClick={handleBack}
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
              ← Back
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
                <span>{loading ? 'Saving...' : 'Create Chatbot'}</span>
              </button>
            </div>
          </div>
        </form>
          )
        ) : (
          /* Step 3: Installation */
          <div className="p-4">
            {/* Progress Indicator */}
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))' }}>
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 h-1" style={{ background: 'linear-gradient(90deg, rgb(55, 65, 81), rgb(31, 41, 55))' }}></div>
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))' }}>
                  <span className="text-white text-xs font-semibold">2</span>
                </div>
              </div>
            </div>

            {/* Success Message */}
            {createdChatbot && (
              <div className="mb-4 p-4 rounded-lg border" style={{ background: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.3)' }}>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <div>
                    <h3 className="text-sm font-semibold text-green-400">Chatbot Created Successfully!</h3>
                    <p className="text-xs text-gray-300 mt-1">Copy the script below and add it to your website to display the floating chatbot button.</p>
                  </div>
                </div>
              </div>
            )}

            <h2 className="text-lg font-bold text-white mb-4">Install Widget Script</h2>

            {/* Manual Installation */}
            <div className="mb-4">
              <p className="text-gray-300 mb-3 text-sm">
                Copy and paste this script code before the closing <code className="px-1 rounded text-xs" style={{ background: 'rgba(31, 41, 55, 0.6)', color: 'rgb(204, 153, 0)' }}>&lt;/body&gt;</code> tag on every page of your website where you want the chatbot to appear.
              </p>
              
              <div className="relative rounded-lg p-4 border" style={{ background: 'rgba(17, 24, 39, 0.9)', borderColor: 'rgba(107, 114, 128, 0.5)' }}>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Embed Script</p>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center space-x-1.5 px-3 py-1.5 text-xs rounded-lg transition-all duration-300 font-semibold hover:scale-105"
                    style={{ background: copied ? 'rgba(34, 197, 94, 0.2)' : 'rgba(55, 65, 81, 0.6)', border: `1px solid ${copied ? 'rgba(34, 197, 94, 0.5)' : 'rgba(107, 114, 128, 0.3)'}`, color: copied ? 'rgb(74, 222, 128)' : 'rgb(209, 213, 219)' }}
                    onMouseEnter={(e) => {
                      if (!copied) {
                        e.currentTarget.style.background = 'rgba(55, 65, 81, 0.8)'
                        e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.5)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!copied) {
                        e.currentTarget.style.background = 'rgba(55, 65, 81, 0.6)'
                        e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.3)'
                      }
                    }}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Script</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-xs overflow-x-auto text-gray-300 font-mono bg-black/30 p-3 rounded border" style={{ borderColor: 'rgba(107, 114, 128, 0.2)' }}>
                  <code className="whitespace-pre">{generateScriptCode()}</code>
                </pre>
              </div>
            </div>

            {/* Done Button */}
            <div className="flex justify-end pt-3 border-t" style={{ borderColor: 'rgba(107, 114, 128, 0.3)' }}>
              <button
                onClick={handleDone}
                className="px-4 py-2 text-sm text-white rounded-lg transition-colors font-semibold"
                style={{ background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => {
          setPreviewOpen(false)
          setPreviewChatOpen(false)
        }}>
          <div className="rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto backdrop-blur-md animate-popup" style={{ background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95))', border: '1px solid rgba(107, 114, 128, 0.5)' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Chatbot Preview</h3>
              <button
                onClick={() => setPreviewOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="rounded-lg p-4 relative" style={{ minHeight: '500px', background: 'rgba(17, 24, 39, 0.6)', border: '1px solid rgba(107, 114, 128, 0.3)' }}>
              <div className={`absolute ${formData.position === 'Bottom Left' ? 'bottom-4 left-4' : 'bottom-4 right-4'} z-50 flex flex-col items-end gap-2`}>
                {previewChatOpen && (
                  <div className="mb-2">
                    <ChatbotWidget
                      chatbot={{
                        ...formData,
                        iconImage: uploadedIcon || formData.iconImage
                      }}
                      messages={[]}
                      showInput={false}
                      onClose={() => setPreviewChatOpen(false)}
                    />
                  </div>
                )}
                <button
                  onClick={() => setPreviewChatOpen(!previewChatOpen)}
                  className="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110 hover:shadow-gray-500/50 flex-shrink-0 animate-popup bg-gradient-to-br from-gray-900 via-gray-800 to-black ring-4 ring-gray-600/40 hover:ring-gray-500/60 hover:shadow-2xl"
                >
                  {uploadedIcon || formData.iconImage ? (
                    <img
                      src={uploadedIcon || formData.iconImage}
                      alt={formData.name || 'Chatbot'}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span>{formData.icon || '💬'}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateChatbot

