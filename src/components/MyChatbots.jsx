import { useState, useEffect } from 'react'
import { Bot, Edit, Trash2, Eye, MoreVertical, CheckCircle, XCircle, Sparkles } from 'lucide-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Modal from './Modal'

const MyChatbots = () => {
  const [chatbots, setChatbots] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedChatbot, setSelectedChatbot] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [chatbotToDelete, setChatbotToDelete] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchChatbots()
  }, [])

  const fetchChatbots = async () => {
    try {
      const response = await axios.get('/api/chatbots')
      setChatbots(response.data)
    } catch (error) {
      console.error('Error fetching chatbots:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    setChatbotToDelete(id)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!chatbotToDelete) return

    try {
      await axios.delete(`/api/chatbots/${chatbotToDelete}`)
      fetchChatbots()
      setDeleteModalOpen(false)
      setChatbotToDelete(null)
    } catch (error) {
      console.error('Error deleting chatbot:', error)
      alert('Failed to delete chatbot')
    }
  }

  const toggleActive = async (chatbot) => {
    try {
      await axios.put(`/api/chatbots/${chatbot._id}`, {
        ...chatbot,
        isActive: !chatbot.isActive
      })
      fetchChatbots()
    } catch (error) {
      console.error('Error updating chatbot:', error)
      alert('Failed to update chatbot')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-600"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-400 absolute top-0 left-0"></div>
        </div>
        <p className="mt-4 text-gray-300 font-semibold">Loading chatbots...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setChatbotToDelete(null)
        }}
        title="Delete Chatbot"
        size="sm"
      >
        <div className="text-center py-4">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-2xl" style={{ background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))' }}>
            <Trash2 className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Are you sure?</h3>
          <p className="text-gray-300 mb-6">This action cannot be undone. The chatbot will be permanently deleted.</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setDeleteModalOpen(false)
                setChatbotToDelete(null)
              }}
              className="px-6 py-3 text-gray-300 rounded-xl font-bold transition-all duration-300 hover:scale-105"
              style={{ background: 'rgba(55, 65, 81, 0.6)' }}
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-6 py-3 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, rgb(220, 38, 38), rgb(185, 28, 28))' }}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      <div className="mb-5 animate-fade-in">
        <h2 className="text-xl font-bold text-white mb-1">My Chatbots</h2>
        <p className="text-white/90 text-sm font-normal">Manage all your chatbots</p>
      </div>

      {chatbots.length === 0 ? (
        <div className="rounded-xl shadow-lg p-10 text-center backdrop-blur-sm animate-popup" style={{ background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.8))', border: '1px solid rgba(107, 114, 128, 0.3)' }}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))' }}>
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No chatbots yet</h3>
          <p className="text-gray-300 mb-5 text-sm">Create your first chatbot to get started</p>
          <button
            onClick={() => navigate('/create')}
            className="px-5 py-2.5 text-sm text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-600"
            style={{ background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))' }}
          >
            Create Chatbot
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chatbots.map((chatbot, index) => (
            <div
              key={chatbot._id}
              className="rounded-3xl shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 backdrop-blur-sm group overflow-hidden animate-popup"
              style={{ background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.8))', border: '1px solid rgba(107, 114, 128, 0.3)', animationDelay: `${index * 100}ms` }}
            >
              {/* Shiny overlay */}
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-2xl" style={{ background: 'radial-gradient(circle, rgba(107, 114, 128, 0.3), transparent)' }}></div>
              
              <div className="p-4 relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-lg shadow-lg border-2 border-white/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
                      style={{ 
                        background: chatbot.primaryColor 
                          ? `linear-gradient(135deg, ${chatbot.primaryColor}40, ${chatbot.primaryColor}60)`
                          : 'linear-gradient(135deg, #a855f7, #8b5cf6)'
                      }}
                    >
                      {chatbot.iconImage ? (
                        <img
                          src={chatbot.iconImage}
                          alt={chatbot.name}
                          className="w-full h-full rounded-xl object-cover"
                        />
                      ) : (
                        <span className="text-lg">{chatbot.icon || '💬'}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm group-hover:text-gray-200 transition-colors">{chatbot.name}</h3>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">{chatbot.personality}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setSelectedChatbot(selectedChatbot === chatbot._id ? null : chatbot._id)}
                      className="p-2 rounded-lg transition-all duration-300 hover:scale-110 border-2 border-transparent hover:border-gray-600"
                      style={{ background: 'rgba(55, 65, 81, 0.5)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(75, 85, 99, 0.6)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(55, 65, 81, 0.5)'
                      }}
                    >
                      <MoreVertical className="w-4 h-4 text-gray-300" />
                    </button>
                    {selectedChatbot === chatbot._id && (
                      <div className="absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl z-20 backdrop-blur-sm overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95))', border: '1px solid rgba(107, 114, 128, 0.5)' }}>
                        <button
                          onClick={() => {
                            navigate('/preview', { state: { chatbot } })
                            setSelectedChatbot(null)
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-white transition-all duration-300 flex items-center space-x-2 hover:scale-[1.02]"
                          style={{ background: 'rgba(31, 41, 55, 0.5)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(55, 65, 81, 0.7)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(31, 41, 55, 0.5)'
                          }}
                        >
                          <Eye className="w-4 h-4 text-gray-400" />
                          <span>Preview</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate('/appearance', { state: { chatbot } })
                            setSelectedChatbot(null)
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-white transition-all duration-300 flex items-center space-x-2 hover:scale-[1.02]"
                          style={{ background: 'rgba(31, 41, 55, 0.5)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(55, 65, 81, 0.7)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(31, 41, 55, 0.5)'
                          }}
                        >
                          <Edit className="w-4 h-4 text-gray-400" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            toggleActive(chatbot)
                            setSelectedChatbot(null)
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-white transition-all duration-300 flex items-center space-x-2 hover:scale-[1.02]"
                          style={{ background: 'rgba(31, 41, 55, 0.5)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(55, 65, 81, 0.7)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(31, 41, 55, 0.5)'
                          }}
                        >
                          {chatbot.isActive ? (
                            <>
                              <XCircle className="w-4 h-4 text-red-600" />
                              <span>Deactivate</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                              <span>Activate</span>
                            </>
                          )}
                        </button>
                        <div className="border-t border-gray-600 my-1"></div>
                        <button
                          onClick={() => {
                            handleDelete(chatbot._id)
                            setSelectedChatbot(null)
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-red-400 transition-all duration-300 flex items-center space-x-2 hover:scale-[1.02]"
                          style={{ background: 'rgba(31, 41, 55, 0.5)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(55, 65, 81, 0.7)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(31, 41, 55, 0.5)'
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-300 mb-5 line-clamp-2 font-medium">
                  {chatbot.welcomeMessage}
                </p>

                <div className="flex items-center justify-between pt-5 border-t-2" style={{ borderColor: 'rgba(107, 114, 128, 0.3)' }}>
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full shadow-lg border-2 border-gray-600"
                      style={{ backgroundColor: chatbot.primaryColor || '#6b7280' }}
                    ></div>
                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{chatbot.position}</span>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-xs font-bold shadow-lg ${
                    chatbot.isActive
                      ? 'text-white'
                      : 'text-gray-400'
                  }`}
                  style={chatbot.isActive ? { background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))' } : { background: 'rgba(31, 41, 55, 0.5)' }}
                  >
                    {chatbot.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyChatbots


