import { useState, useEffect } from 'react'
import { Save, User, Bell, Shield } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const Settings = () => {
  const { language, changeLanguage, t } = useLanguage()
  const [settings, setSettings] = useState({
    profile: {
      name: 'Admin User',
      email: 'admin@example.com',
      language: language
    },
    notifications: {
      emailNotifications: true,
      chatbotAlerts: true,
      weeklyReports: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30
    },
  })

  useEffect(() => {
    // Update settings when language changes
    setSettings(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        language: language
      }
    }))
  }, [language])

  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
    
    // If language is being changed, update the language context
    if (section === 'profile' && field === 'language') {
      changeLanguage(value)
    }
  }

  const handleSave = () => {
    // Save settings logic here
    const successMessages = {
      'English': 'Settings saved successfully!',
      'Hindi': 'सेटिंग्स सफलतापूर्वक सहेजी गईं!',
      'Spanish': '¡Configuración guardada con éxito!',
      'French': 'Paramètres enregistrés avec succès!'
    }
    alert(successMessages[language] || successMessages['English'])
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white mb-1">Settings</h2>
        <p className="text-gray-400 text-sm">Manage your account and application settings</p>
      </div>

      <div className="space-y-4">
        {/* Profile Settings */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
          <div className="p-4 border-b border-gray-700 flex items-center space-x-2.5">
            <User className="w-4 h-4 text-gray-300" />
            <h3 className="text-base font-semibold text-white">Profile Settings</h3>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Name
              </label>
              <input
                type="text"
                value={settings.profile.name}
                onChange={(e) => handleChange('profile', 'name', e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={settings.profile.email}
                onChange={(e) => handleChange('profile', 'email', e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Language
              </label>
              <select
                value={settings.profile.language}
                onChange={(e) => handleChange('profile', 'language', e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
          <div className="p-4 border-b border-gray-700 flex items-center space-x-2.5">
            <Bell className="w-4 h-4 text-gray-300" />
            <h3 className="text-base font-semibold text-white">Notifications</h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-medium text-gray-300">Email Notifications</label>
                <p className="text-xs text-gray-400">Receive email updates about your chatbots</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.emailNotifications}
                  onChange={(e) => handleChange('notifications', 'emailNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-medium text-gray-300">Chatbot Alerts</label>
                <p className="text-xs text-gray-400">Get notified when chatbots need attention</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.chatbotAlerts}
                  onChange={(e) => handleChange('notifications', 'chatbotAlerts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-medium text-gray-300">Weekly Reports</label>
                <p className="text-xs text-gray-400">Receive weekly performance reports</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.weeklyReports}
                  onChange={(e) => handleChange('notifications', 'weeklyReports', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
          <div className="p-4 border-b border-gray-700 flex items-center space-x-2.5">
            <Shield className="w-4 h-4 text-gray-300" />
            <h3 className="text-base font-semibold text-white">Security</h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-medium text-gray-300">Two-Factor Authentication</label>
                <p className="text-xs text-gray-400">Add an extra layer of security to your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.security.twoFactorAuth}
                  onChange={(e) => handleChange('security', 'twoFactorAuth', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleChange('security', 'sessionTimeout', parseInt(e.target.value))}
                min="5"
                max="120"
                className="w-full px-3 py-1.5 text-sm border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center space-x-1.5 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings


