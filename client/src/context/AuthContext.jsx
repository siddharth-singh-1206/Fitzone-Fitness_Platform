import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

// Create context
const AuthContext = createContext(null)

/**
 * AuthProvider wraps the app and provides authentication state and actions.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // On mount: hydrate state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('fitzone_token')
    const storedUser = localStorage.getItem('fitzone_user')
    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch {
        // Corrupt data — clear it
        localStorage.removeItem('fitzone_token')
        localStorage.removeItem('fitzone_user')
      }
    }
    setLoading(false)
  }, [])

  /**
   * Login with email and password.
   * Stores token + user in localStorage and sets state.
   */
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    const { token: newToken, user: newUser } = response.data
    localStorage.setItem('fitzone_token', newToken)
    localStorage.setItem('fitzone_user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
    return response
  }

  /**
   * Register a new user.
   * Stores token + user in localStorage and sets state.
   */
  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password })
    const { token: newToken, user: newUser } = response.data
    localStorage.setItem('fitzone_token', newToken)
    localStorage.setItem('fitzone_user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
    return response
  }

  /**
   * Logout — clear all stored credentials and redirect to home.
   */
  const logout = () => {
    localStorage.removeItem('fitzone_token')
    localStorage.removeItem('fitzone_user')
    setToken(null)
    setUser(null)
    navigate('/')
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * useAuth hook — must be used within AuthProvider.
 */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

export default AuthContext
