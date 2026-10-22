import axios from 'axios'

// Create axios instance with base URL from env or fallback to /api proxy
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fitzone_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response envelope and 401 globally
api.interceptors.response.use(
  (response) => {
    // If backend returned { success: true, data: ... }, unwrap the data payload
    if (
      response.data &&
      typeof response.data === 'object' &&
      response.data.success === true &&
      'data' in response.data
    ) {
      response.data = response.data.data
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fitzone_token')
      localStorage.removeItem('fitzone_user')
      if (
        !window.location.pathname.startsWith('/login') &&
        !window.location.pathname.startsWith('/register')
      ) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
