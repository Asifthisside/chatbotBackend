import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

const translations = {
  en: {
    // Dashboard
    dashboard: 'Dashboard',
    welcomeBack: 'Welcome back! Here\'s what\'s happening with your chatbots.',
    createNewChatbot: 'Create New Chatbot',
    totalChatbots: 'Total Chatbots',
    activeChatbots: 'Active Chatbots',
    totalMessages: 'Total Messages',
    totalUsers: 'Total Users',
    allTime: 'All time',
    currentlyRunning: 'Currently running',
    allConversations: 'All conversations',
    engagedUsers: 'Engaged users',
    recentChatbots: 'Recent Chatbots',
    viewAll: 'View All',
    quickActions: 'Quick Actions',
    manageChatbots: 'Manage Chatbots',
    customizeAppearance: 'Customize Appearance',
    previewChatbot: 'Preview Chatbot',
    
    // Navigation
    home: 'Home',
    create: 'Create Chatbot',
    chatbots: 'My Chatbots',
    appearance: 'Appearance',
    preview: 'Preview',
    settings: 'Settings',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    active: 'Active',
    inactive: 'Inactive',
    needHelp: 'Need Help?',
    contactSupport: 'Contact support'
  },
  hi: {
    // Dashboard
    dashboard: 'डैशबोर्ड',
    welcomeBack: 'वापसी पर स्वागत है! यहाँ आपके चैटबॉट्स के साथ क्या हो रहा है।',
    createNewChatbot: 'नया चैटबॉट बनाएं',
    totalChatbots: 'कुल चैटबॉट्स',
    activeChatbots: 'सक्रिय चैटबॉट्स',
    totalMessages: 'कुल संदेश',
    totalUsers: 'कुल उपयोगकर्ता',
    allTime: 'सभी समय',
    currentlyRunning: 'वर्तमान में चल रहा है',
    allConversations: 'सभी बातचीत',
    engagedUsers: 'लगे हुए उपयोगकर्ता',
    recentChatbots: 'हाल के चैटबॉट्स',
    viewAll: 'सभी देखें',
    quickActions: 'त्वरित कार्य',
    manageChatbots: 'चैटबॉट्स प्रबंधित करें',
    customizeAppearance: 'उपस्थिति अनुकूलित करें',
    previewChatbot: 'चैटबॉट पूर्वावलोकन',
    
    // Navigation
    home: 'होम',
    create: 'चैटबॉट बनाएं',
    chatbots: 'मेरे चैटबॉट्स',
    appearance: 'उपस्थिति',
    preview: 'पूर्वावलोकन',
    settings: 'सेटिंग्स',
    
    // Common
    save: 'सहेजें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    close: 'बंद करें',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    needHelp: 'मदद चाहिए?',
    contactSupport: 'सहायता से संपर्क करें'
  },
  es: {
    // Dashboard
    dashboard: 'Panel de Control',
    welcomeBack: '¡Bienvenido de nuevo! Esto es lo que está pasando con tus chatbots.',
    createNewChatbot: 'Crear Nuevo Chatbot',
    totalChatbots: 'Total de Chatbots',
    activeChatbots: 'Chatbots Activos',
    totalMessages: 'Total de Mensajes',
    totalUsers: 'Total de Usuarios',
    allTime: 'Todo el tiempo',
    currentlyRunning: 'En ejecución',
    allConversations: 'Todas las conversaciones',
    engagedUsers: 'Usuarios comprometidos',
    recentChatbots: 'Chatbots Recientes',
    viewAll: 'Ver Todo',
    quickActions: 'Acciones Rápidas',
    manageChatbots: 'Gestionar Chatbots',
    customizeAppearance: 'Personalizar Apariencia',
    previewChatbot: 'Vista Previa del Chatbot',
    
    // Navigation
    home: 'Inicio',
    create: 'Crear Chatbot',
    chatbots: 'Mis Chatbots',
    appearance: 'Apariencia',
    preview: 'Vista Previa',
    settings: 'Configuración',
    
    // Common
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    close: 'Cerrar',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    active: 'Activo',
    inactive: 'Inactivo',
    needHelp: '¿Necesitas Ayuda?',
    contactSupport: 'Contactar Soporte'
  },
  fr: {
    // Dashboard
    dashboard: 'Tableau de Bord',
    welcomeBack: 'Bon retour ! Voici ce qui se passe avec vos chatbots.',
    createNewChatbot: 'Créer un Nouveau Chatbot',
    totalChatbots: 'Total des Chatbots',
    activeChatbots: 'Chatbots Actifs',
    totalMessages: 'Total des Messages',
    totalUsers: 'Total des Utilisateurs',
    allTime: 'Tout le temps',
    currentlyRunning: 'En cours d\'exécution',
    allConversations: 'Toutes les conversations',
    engagedUsers: 'Utilisateurs engagés',
    recentChatbots: 'Chatbots Récents',
    viewAll: 'Voir Tout',
    quickActions: 'Actions Rapides',
    manageChatbots: 'Gérer les Chatbots',
    customizeAppearance: 'Personnaliser l\'Apparence',
    previewChatbot: 'Aperçu du Chatbot',
    
    // Navigation
    home: 'Accueil',
    create: 'Créer un Chatbot',
    chatbots: 'Mes Chatbots',
    appearance: 'Apparence',
    preview: 'Aperçu',
    settings: 'Paramètres',
    
    // Common
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    close: 'Fermer',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    active: 'Actif',
    inactive: 'Inactif',
    needHelp: 'Besoin d\'Aide?',
    contactSupport: 'Contacter le Support'
  }
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get language from localStorage or default to English
    const savedLanguage = localStorage.getItem('app_language')
    return savedLanguage || 'English'
  })

  useEffect(() => {
    // Save language to localStorage whenever it changes
    localStorage.setItem('app_language', language)
  }, [language])

  const getLanguageCode = () => {
    switch (language) {
      case 'Hindi':
        return 'hi'
      case 'Spanish':
        return 'es'
      case 'French':
        return 'fr'
      default:
        return 'en'
    }
  }

  const t = (key) => {
    const langCode = getLanguageCode()
    return translations[langCode]?.[key] || translations.en[key] || key
  }

  const changeLanguage = (lang) => {
    setLanguage(lang)
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}




