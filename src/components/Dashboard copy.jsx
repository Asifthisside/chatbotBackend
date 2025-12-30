import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { 
  MessageSquare, 
  Plus, 
  Bot, 
  Palette, 
  Eye, 
  Settings,
  Menu,
  X,
  Home
} from 'lucide-react'

const Dashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/home' },
    { id: 'create', label: 'Create Chatbot', icon: Plus, path: '/create' },
    { id: 'chatbots', label: 'My Chatbots', icon: Bot, path: '/chatbots' },
    { id: 'appearance', label: 'Appearance', icon: Palette, path: '/appearance' },
    { id: 'preview', label: 'Preview', icon: Eye, path: '/preview' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ]

  const isActive = (path) => {
    if (path === '/home') {
      return location.pathname === '/' || location.pathname === '/home'
    }
    if (path === '/create') {
      return location.pathname === '/create'
    }
    return location.pathname === path
  }

  return (
    <div className="flex h-screen relative bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80)',
          filter: 'blur(4px)',
          opacity: 0.3,
          zIndex: 0
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white/80 to-blue-50/30 z-0"></div>
      
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white/95 backdrop-blur-sm border-r border-blue-100 shadow-lg transition-all duration-300 flex flex-col relative z-10`}>
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-blue-100 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg border border-white/30">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <h1 className="text-xl font-bold text-white">AllMyTab</h1>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/20 transition-all duration-300 hover:scale-110 text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <li key={item.id}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                      active
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md'
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${active ? 'scale-110 text-white' : 'group-hover:scale-110'}`} />
                    {sidebarOpen && (
                      <span className={`font-semibold transition-all duration-300 ${active ? 'text-white' : ''}`}>{item.label}</span>
                    )}
                    {active && (
                      <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-blue-100">
          <div className={`${sidebarOpen ? 'block' : 'hidden'} bg-blue-50 rounded-xl p-3 border border-blue-200`}>
            <p className="text-xs font-semibold text-blue-700 mb-1">Need Help?</p>
            <p className="text-xs text-gray-600">Contact support</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Dashboard

