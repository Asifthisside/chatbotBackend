import axios from 'axios'
import { showError } from '../components/ErrorToast'

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://chatbot-xi-six-89.vercel.app/api' : 'http://localhost:5000/api')

// Log API configuration on load (helpful for debugging)
if (typeof window !== 'undefined') {
  console.log('API Configuration:', {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    PROD: import.meta.env.PROD,
    API_BASE_URL: API_BASE_URL,
    'Using default': !import.meta.env.VITE_API_URL
  })
}

// Error handler function
const handleError = (error) => {
  // Handle error response
  if (error.response) {
    // Server responded with error status
    const status = error.response.status
    const errorData = error.response.data
    
    let errorMessage = 'An error occurred'
    
    if (errorData?.error) {
      errorMessage = errorData.error
    } else if (errorData?.message) {
      errorMessage = errorData.message
    } else if (typeof errorData === 'string') {
      errorMessage = errorData
    } else {
      // Default messages based on status code
      switch (status) {
        case 400:
          errorMessage = 'Bad Request: Invalid data provided'
          break
        case 401:
          errorMessage = 'Unauthorized: Please login again'
          break
        case 403:
          errorMessage = 'Forbidden: You do not have permission'
          break
        case 404:
          errorMessage = 'Not Found: The requested resource was not found'
          break
        case 500:
          errorMessage = errorData?.error || errorData?.message || 'Server Error: Something went wrong on the server'
          break
        case 502:
          errorMessage = 'Bad Gateway: Server is temporarily unavailable'
          break
        case 503:
          errorMessage = 'Service Unavailable: Server is under maintenance'
          break
        default:
          errorMessage = `Error ${status}: ${errorData?.message || 'An error occurred'}`
      }
    }
    
    // Show error toast
    showError(errorMessage, 'error')
    
    console.error('API Error:', {
      status,
      message: errorMessage,
      data: errorData,
      url: error.config?.url
    })
  } else if (error.request) {
    // Request was made but no response received
    const requestedURL = error.config?.baseURL 
      ? `${error.config.baseURL}${error.config.url || ''}` 
      : error.config?.url || 'Unknown URL'
    const errorMessage = `Network Error: Unable to connect to server at ${requestedURL}. Please check your internet connection and verify the backend URL is correct.`
    showError(errorMessage, 'error')
    console.error('Network Error Details:', {
      message: error.message,
      request: error.request,
      config: error.config,
      requestedURL: requestedURL,
      apiBaseURL: API_BASE_URL
    })
  } else {
    // Something else happened
    const errorMessage = error.message || 'An unexpected error occurred'
    showError(errorMessage, 'error')
    console.error('Error:', error.message)
  }
}

// Create configured axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor for api instance
api.interceptors.request.use(
  (config) => {
    // Log API requests in development
    if (import.meta.env.DEV) {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`
      })
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for api instance
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    handleError(error)
    return Promise.reject(error)
  }
)

// Also configure default axios instance for components using axios directly
// Set default baseURL for relative API calls
// Always set baseURL to ensure API calls go to the correct backend
axios.defaults.baseURL = API_BASE_URL.replace('/api', '')

// Add interceptors to default axios instance
axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Only handle errors for API calls (URLs containing /api)
    if (error.config?.url?.includes('/api') || error.config?.baseURL?.includes('/api')) {
      handleError(error)
    }
    return Promise.reject(error)
  }
)

export default api
export { axios }





