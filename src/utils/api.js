// utils/api.js
import axios from 'axios'

const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://api-n7hd.onrender.com/api' 
  : 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      // Use Bearer token for JWT
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If 401 error and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const response = await axios.post(`${API_BASE}/token/refresh/`, {
            refresh: refreshToken
          })

          const newAccessToken = response.data.access
          localStorage.setItem('access_token', newAccessToken)
          api.defaults.headers.Authorization = `Bearer ${newAccessToken}`
          
          // Retry the original request
          return api(originalRequest)
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        // Clear tokens and redirect to login
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?session=expired'
        }
      }
    }

    return Promise.reject(error)
  }
)

// Helper functions
export const setAuthTokens = (accessToken, refreshToken) => {
  localStorage.setItem('access_token', accessToken)
  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken)
  }
  api.defaults.headers.Authorization = `Bearer ${accessToken}`
}

export const clearAuthTokens = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
  delete api.defaults.headers.Authorization
}

export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token')
}

export const getAuthToken = () => {
  return localStorage.getItem('access_token')
}

export default api