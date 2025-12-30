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
  Home,
  Reply
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const Dashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { t } = useLanguage()
  const isPreviewPage = location.pathname === '/preview'

  const menuItems = [
    { id: 'home', label: t('home'), icon: Home, path: '/home', color: 'blue' },
    { id: 'create', label: t('create'), icon: Plus, path: '/create', color: 'green' },
    { id: 'chatbots', label: t('chatbots'), icon: Bot, path: '/chatbots', color: 'purple' },
    { id: 'appearance', label: t('appearance'), icon: Palette, path: '/appearance', color: 'pink' },
    { id: 'preview', label: t('preview'), icon: Eye, path: '/preview', color: 'yellow' },
    { id: 'replies', label: 'Replies', icon: Reply, path: '/replies', color: 'cyan' },
    { id: 'settings', label: t('settings'), icon: Settings, path: '/settings', color: 'indigo' },
  ]
  
  const getIconColor = (color, active) => {
    const colors = {
      blue: active ? 'text-blue-400' : 'text-blue-500',
      green: active ? 'text-green-400' : 'text-green-500',
      purple: active ? 'text-purple-400' : 'text-purple-500',
      pink: active ? 'text-pink-400' : 'text-pink-500',
      yellow: active ? 'text-yellow-400' : 'text-yellow-500',
      indigo: active ? 'text-indigo-400' : 'text-indigo-500',
      cyan: active ? 'text-cyan-400' : 'text-cyan-500',
    }
    return colors[color] || 'text-white'
  }
  
  const getIconBgColor = (color, active) => {
    const colors = {
      blue: active ? 'bg-blue-500/30' : 'bg-blue-500/20',
      green: active ? 'bg-green-500/30' : 'bg-green-500/20',
      purple: active ? 'bg-purple-500/30' : 'bg-purple-500/20',
      pink: active ? 'bg-pink-500/30' : 'bg-pink-500/20',
      yellow: active ? 'bg-yellow-500/30' : 'bg-yellow-500/20',
      indigo: active ? 'bg-indigo-500/30' : 'bg-indigo-500/20',
      cyan: active ? 'bg-cyan-500/30' : 'bg-cyan-500/20',
    }
    return colors[color] || 'bg-gray-500/20'
  }

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
    <div className="flex h-screen relative overflow-hidden" style={{ 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 20%, #334155 40%, #475569 60%, #64748b 80%, #0f172a 100%)',
      backgroundSize: '400% 400%'
    }}>
      {/* Animated Main  Gradient */}
      <div 
        className="absolute inset-0 animate-gradient-x opacity-100"
        style={{ 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 15%, #334155 30%, #475569 45%, #64748b 60%, #475569 75%, #334155 90%, #1e293b 100%)',
          backgroundSize: '400% 400%',
          animationDuration: '15s'
        }}
      ></div>
      
      {/* Secondary Animated Gradient Layer */}
      <div 
        className="absolute inset-0 animate-gradient-x opacity-80"
        style={{ 
          background: 'linear-gradient(225deg, #1e293b 0%, #334155 25%, #475569 50%, #64748b 75%, #334155 100%)',
          backgroundSize: '300% 300%',
          animationDuration: '20s',
          animationDelay: '2s'
        }}
      ></div>
      
      {/* Multiple Gradient Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(75,85,99,0.4),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(31,41,55,0.4),transparent_50%),radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.3),transparent_70%)] animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(55,65,81,0.3),transparent_60%),radial-gradient(circle_at_90%_80%,rgba(31,41,55,0.3),transparent_60%)] animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(75,85,99,0.25),transparent_55%),radial-gradient(circle_at_30%_60%,rgba(17,24,39,0.25),transparent_55%)] animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Animated Gradient Waves */}
      <div className="absolute inset-0 animate-gradient-x" style={{ backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, rgba(0,0,0,0.4), rgba(17,24,39,0.5), rgba(31,41,55,0.5), rgba(55,65,81,0.5), rgba(75,85,99,0.4))' }}></div>
      <div className="absolute inset-0 animate-gradient-x" style={{ backgroundSize: '300% 100%', backgroundImage: 'linear-gradient(45deg, rgba(31,41,55,0.3), rgba(55,65,81,0.3), rgba(75,85,99,0.3), rgba(55,65,81,0.3), rgba(31,41,55,0.3))', animationDuration: '15s', animationDelay: '2s' }}></div>
      <div className="absolute inset-0 animate-gradient-x" style={{ backgroundSize: '250% 100%', backgroundImage: 'linear-gradient(135deg, rgba(17,24,39,0.3), rgba(31,41,55,0.3), rgba(55,65,81,0.3), rgba(31,41,55,0.3), rgba(17,24,39,0.3))', animationDuration: '20s', animationDelay: '1s' }}></div>
      
      {/* Shiny Overlay Layers */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05)_0%,transparent_50%,rgba(255,255,255,0.03)_100%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.03)_0%,transparent_40%,rgba(255,255,255,0.05)_80%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(225deg,rgba(255,255,255,0.02)_0%,transparent_60%,rgba(255,255,255,0.04)_100%)]"></div>
      
      {/* Large Floating Gradient Orbs */}
      
      
      {/* Medium Floating Gradient Orbs */}
      {!isPreviewPage && (
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => {
          const animations = ['animate-float', 'animate-float-fast', 'animate-float-wave', 'animate-float-circular']
          const animationClass = animations[i % animations.length]
          return (
            <div
              key={`orb-medium-${i}`}
              className={`absolute rounded-full ${animationClass} blur-xl`}
              style={{
                width: `${80 + Math.random() * 120}px`,
                height: `${80 + Math.random() * 120}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${8 + Math.random() * 12}s`,
                background: `radial-gradient(circle, rgba(${75 + Math.random() * 60}, ${85 + Math.random() * 60}, ${99 + Math.random() * 60}, 0.35), transparent)`,
                opacity: 0.5 + Math.random() * 0.5
              }}
            ></div>
          )
        })}
      </div>
      )}
      
      {/* Small Floating Gradient Orbs */}
      {!isPreviewPage && (
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => {
          const animations = ['animate-float-fast', 'animate-float', 'animate-float-wave', 'animate-float-circular']
          const animationClass = animations[i % animations.length]
          return (
            <div
              key={`orb-small-${i}`}
              className={`absolute rounded-full ${animationClass} blur-lg`}
              style={{
                width: `${40 + Math.random() * 80}px`,
                height: `${40 + Math.random() * 80}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${6 + Math.random() * 10}s`,
                background: `radial-gradient(circle, rgba(${107 + Math.random() * 50}, ${114 + Math.random() * 50}, ${128 + Math.random() * 50}, 0.5), transparent)`,
                opacity: 0.4 + Math.random() * 0.6
              }}
            ></div>
          )
        })}
      </div>
      )}
      
      {/* Floating Particles - Multiple Sizes */}
      {!isPreviewPage && (
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => {
          const animations = ['animate-float', 'animate-float-fast', 'animate-float-wave']
          const animationClass = animations[i % animations.length]
          return (
            <div
              key={`particle-large-${i}`}
              className={`absolute rounded-full ${animationClass}`}
              style={{
                width: `${3 + Math.random() * 2}px`,
                height: `${3 + Math.random() * 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`,
                backgroundColor: `rgba(${107 + Math.random() * 50}, ${114 + Math.random() * 50}, ${128 + Math.random() * 50}, 0.7)`,
                boxShadow: `0 0 ${4 + Math.random() * 4}px rgba(${107 + Math.random() * 50}, ${114 + Math.random() * 50}, ${128 + Math.random() * 50}, 0.8)`
              }}
            ></div>
          )
        })}
      </div>
      )}
      
      {/* Medium Particles */}
      {!isPreviewPage && (
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => {
          const animations = ['animate-float', 'animate-float-fast', 'animate-float-circular']
          const animationClass = animations[i % animations.length]
          return (
            <div
              key={`particle-medium-${i}`}
              className={`absolute rounded-full ${animationClass}`}
              style={{
                width: `${1.5 + Math.random() * 1.5}px`,
                height: `${1.5 + Math.random() * 1.5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 8}s`,
                backgroundColor: `rgba(${107 + Math.random() * 50}, ${114 + Math.random() * 50}, ${128 + Math.random() * 50}, 0.6)`,
                boxShadow: `0 0 ${2 + Math.random() * 3}px rgba(${107 + Math.random() * 50}, ${114 + Math.random() * 50}, ${128 + Math.random() * 50}, 0.7)`
              }}
            ></div>
          )
        })}
      </div>
      )}
      
      {/* Small Particles */}
      {!isPreviewPage && (
      <div className="absolute inset-0">
        {[...Array(60)].map((_, i) => {
          const animations = ['animate-float-fast', 'animate-float', 'animate-float-wave']
          const animationClass = animations[i % animations.length]
          return (
            <div
              key={`particle-small-${i}`}
              className={`absolute rounded-full ${animationClass}`}
              style={{
                width: `${0.5 + Math.random() * 1}px`,
                height: `${0.5 + Math.random() * 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 7}s`,
                backgroundColor: `rgba(${107 + Math.random() * 50}, ${114 + Math.random() * 50}, ${128 + Math.random() * 50}, 0.5)`,
                boxShadow: `0 0 ${1 + Math.random() * 2}px rgba(${107 + Math.random() * 50}, ${114 + Math.random() * 50}, ${128 + Math.random() * 50}, 0.6)`
              }}
            ></div>
          )
        })}
      </div>
      )}
      
      {/* Animated Gradient Rings */}
      {!isPreviewPage && (
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => {
          const animations = ['animate-float-slow', 'animate-float-circular', 'animate-float']
          const animationClass = animations[i % animations.length]
          return (
            <div
              key={`ring-${i}`}
              className={`absolute rounded-full ${animationClass} border-2`}
              style={{
                width: `${200 + i * 150}px`,
                height: `${200 + i * 150}px`,
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${15 + i * 5}s`,
                borderColor: `rgba(${107 + Math.random() * 50}, ${114 + Math.random() * 50}, ${128 + Math.random() * 50}, 0.1)`,
                opacity: 0.3 + Math.random() * 0.3
              }}
            ></div>
          )
        })}
      </div>
      )}
      
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-24'} backdrop-blur-2xl border-r shadow-2xl transition-all duration-500 ease-in-out flex flex-col relative z-10`} style={{ background: 'linear-gradient(180deg, rgb(0, 0, 0) 0%, rgb(17, 24, 39) 25%, rgb(31, 41, 55) 50%, rgb(55, 65, 81) 75%, rgb(75, 85, 99) 100%)', borderColor: 'rgba(107, 114, 128, 0.4)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)' }}>
        {/* Logo Section */}
        <div className="h-20 flex items-center justify-between px-4 border-b relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgb(0, 0, 0) 0%, rgb(17, 24, 39) 25%, rgb(31, 41, 55) 50%, rgb(55, 65, 81) 75%, rgb(75, 85, 99) 100%)', borderColor: 'rgba(107, 114, 128, 0.3)' }}>
          {/* Grey Overlay */}
          <div className="absolute inset-0 animate-gradient-x" style={{ backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, transparent, rgba(107, 114, 128, 0.2), transparent)' }}></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(107,114,128,0.15),transparent_50%)] animate-pulse"></div>
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(107,114,128,0.1)_0%,transparent_50%,rgba(107,114,128,0.1)_100%)]"></div>
          {/* Shiny Animated Background Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.05),transparent_50%)] animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-gradient-x" style={{ backgroundSize: '200% 100%' }}></div>
          
          <div className="flex items-center space-x-2.5 relative z-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md shadow-xl transform hover:scale-110 hover:rotate-6 transition-all duration-300 hover:shadow-gray-400/50 animate-bounce" style={{ backgroundColor: 'rgba(107, 114, 128, 0.3)', border: '2px solid rgba(107, 114, 128, 0.5)' }}>
              <MessageSquare className="w-5 h-5 text-white drop-shadow-xl" />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col animate-fade-in">
                <h1 className="text-lg font-extrabold tracking-tight drop-shadow-xl" style={{ color: 'rgb(255, 255, 255)' }}>AllMyTab</h1>
                <span className="text-[10px] font-semibold drop-shadow-md mt-0.5" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Chatbot Platform</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:rotate-90 text-white backdrop-blur-sm border-2 border-white/20 hover:border-white/40 hover:shadow-xl hover:shadow-gray-400/30 relative z-10"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <li key={item.id} className="group">
                  <button
                    onClick={(e) => {
                      // Add popup effect
                      const button = e.currentTarget
                      if (button) {
                        button.style.transform = 'scale(0.95)'
                        button.style.transition = 'transform 0.1s ease-out'
                        
                        setTimeout(() => {
                          if (button && document.contains(button)) {
                            button.style.transform = 'scale(1.05)'
                            button.style.transition = 'transform 0.2s ease-out'
                            
                            setTimeout(() => {
                              if (button && document.contains(button)) {
                                button.style.transform = ''
                                button.style.transition = ''
                              }
                            }, 200)
                          }
                        }, 100)
                      }
                      
                      // Navigate immediately
                      navigate(item.path)
                    }}
                    data-item-id={item.id}
                    className={`w-full flex items-center ${sidebarOpen ? 'justify-start space-x-2.5' : 'justify-center'} px-2.5 py-2 rounded-2xl transition-all duration-300 relative overflow-hidden group ${
                      active
                        ? 'text-white shadow-2xl scale-[1.03]'
                        : 'text-white/90 hover:text-white hover:shadow-xl hover:scale-[1.02]'
                    }`}
                    style={active ? { background: 'linear-gradient(135deg, rgb(55, 65, 81) 0%, rgb(31, 41, 55) 50%, rgb(17, 24, 39) 50%, rgb(0, 0, 0) 100%)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.6)', animationDelay: `${index * 50}ms` } : { background: 'rgba(17, 24, 39, 0.3)', boxShadow: 'none', animationDelay: `${index * 50}ms` }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = 'rgba(55, 65, 81, 0.4)'
                        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.4)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = 'rgba(17, 24, 39, 0.3)'
                        e.currentTarget.style.boxShadow = 'none'
                      }
                    }}
                  >
                    {/* Active Indicator */}
                    {active && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent"></div>
                      </>
                    )}
                    
                    {/* Icon Container */}
                    <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300 ${getIconBgColor(item.color, active)} ${
                      active 
                        ? 'shadow-xl animate-bounce' 
                        : 'group-hover:shadow-lg group-hover:animate-pulse'
                    }`}
                    style={active ? { boxShadow: `0 10px 15px -3px rgba(0, 0, 0, 0.5)` } : {}}
                    >
                      <Icon className={`w-4 h-4 transition-all duration-300 drop-shadow-lg ${getIconColor(item.color, active)} ${
                        active 
                          ? 'scale-110' 
                          : 'group-hover:scale-110'
                      }`} />
                    </div>
                    
                    {/* Label */}
                    {sidebarOpen && (
                      <span className={`font-semibold text-xs transition-all duration-300 relative z-10 drop-shadow-md ${
                        active ? 'text-white' : 'text-white/90 group-hover:text-white'
                      }`}>
                        {item.label}
                      </span>
                    )}
                    
                    {/* Hover Effect */}
                    {!active && (
                      <div className="absolute inset-0 transition-all duration-300 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(107, 114, 128, 0) 0%, rgba(75, 85, 99, 0) 50%, rgba(107, 114, 128, 0) 100%)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(107, 114, 128, 0.15) 0%, rgba(75, 85, 99, 0.15) 50%, rgba(107, 114, 128, 0.15) 100%)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(107, 114, 128, 0) 0%, rgba(75, 85, 99, 0) 50%, rgba(107, 114, 128, 0) 100%)'
                      }}
                      ></div>
                    )}
                    
                    {/* Active Pulse Effect */}
                    {active && (
                      <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse shadow-xl shadow-white/70"></div>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="pt-4 px-4 pb-0 border-t backdrop-blur-sm" style={{ borderColor: 'rgba(107, 114, 128, 0.3)', background: 'rgba(17, 24, 39, 0.3)' }}>
          <a 
            href="mailto:asif786minto@gmail.com?subject=Need Help - AllMyTab Support&body=Hello,%0D%0A%0D%0AI need help with the following:%0D%0A%0D%0A"
            className={`${sidebarOpen ? 'block' : 'hidden'} rounded-2xl p-4 transition-all duration-300 cursor-pointer group backdrop-blur-sm hover:scale-[1.02] relative overflow-hidden animate-popup`}
            style={{ background: 'linear-gradient(135deg, rgba(55, 65, 81, 0.4) 0%, rgba(31, 41, 55, 0.4) 50%, rgba(17, 24, 39, 0.4) 50%, rgba(0, 0, 0, 0.4) 100%)', border: '1px solid rgba(107, 114, 128, 0.4)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {/* Shiny Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05)_0%,transparent_50%)] group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
            <div className="flex items-start space-x-3 relative z-10">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, rgb(55, 65, 81), rgb(31, 41, 55))', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <MessageSquare className="w-5 h-5 text-white drop-shadow-lg" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white mb-1 group-hover:text-gray-300 transition-colors drop-shadow-md">{t('needHelp')}</p>
                <p className="text-xs text-white/90 group-hover:text-white transition-colors">{t('contactSupport')}</p>
              </div>
            </div>
          </a>
          
          {/* Collapsed Footer Icon */}
          {!sidebarOpen && (
            <a 
              href="mailto:asif786minto@gmail.com?subject=Need Help - AllMyTab Support&body=Hello,%0D%0A%0D%0AI need help with the following:%0D%0A%0D%0A"
              className="flex items-center justify-center w-12 h-12 mx-auto rounded-xl transition-all duration-300 cursor-pointer hover:scale-110 hover:shadow-xl animate-popup"
              style={{ background: 'linear-gradient(135deg, rgba(55, 65, 81, 0.4) 0%, rgba(31, 41, 55, 0.4) 100%)', border: '1px solid rgba(107, 114, 128, 0.4)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <MessageSquare className="w-5 h-5 text-white drop-shadow-lg" />
            </a>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-10 backdrop-blur-md animate-popup" style={{ background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(17, 24, 39, 0.4) 25%, rgba(31, 41, 55, 0.5) 50%, rgba(55, 65, 81, 0.4) 75%, rgba(75, 85, 99, 0.3) 100%)', fontFamily: "'Inter', 'Segoe UI', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif" }}>
        <div className="pt-4 px-4 md:pt-6 md:px-6 pb-0 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Dashboard

