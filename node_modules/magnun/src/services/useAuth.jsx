import { useLocalStorage } from '../hooks/useLocalStorage'
import { authAPI } from './api'

export const useAuth = () => {
  const { getStorage, persistStorage, clearStorage } = useLocalStorage()

  const auth = () => {
    const token = getStorage('lgotniki_token')
    const user = getStorage('lgotniki_user')

    if (!token || !user) return false

    // Check if token is expired (basic check)
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]))
      const now = Math.floor(Date.now() / 1000)
      if (tokenData.exp && tokenData.exp < now) {
        clearStorage('lgotniki_token')
        clearStorage('lgotniki_user')
        return false
      }
    } catch (e) {
      return false
    }

    return true
  }

  const login = async (username, password) => {
    try {
      const result = await authAPI.login(username, password)
      if (result.token) {
        persistStorage('lgotniki_token', result.token)
        persistStorage('lgotniki_user', result.user)
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    authAPI.logout()
    clearStorage('lgotniki_token')
    clearStorage('lgotniki_user')
    return true
  }

  const getUser = () => {
    const stored = getStorage('lgotniki_user')

    if (!stored) return null

    if (typeof stored === 'string') {
      try {
        return JSON.parse(stored)
      } catch (error) {
        return null
      }
    }

    return stored
  }

  const hasRole = role => {
    const user = getUser()
    return user?.role === role
  }

  const isAdmin = () => {
    return hasRole('admin')
  }

  const isOperator = () => {
    return hasRole('operator')
  }

  return { auth, login, logout, getUser, hasRole, isAdmin, isOperator }
}
