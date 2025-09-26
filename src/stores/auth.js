import { defineStore } from 'pinia'
import { authService } from '../services/authService.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  }),

  getters: {
    isAdmin: (state) => state.user?.admin === true,
    userName: (state) => {
      if (!state.user) return null
      const firstName = state.user.firstName || state.user.first_name || ''
      const lastName = state.user.lastName || state.user.last_name || ''
      return `${firstName} ${lastName}`.trim() || state.user.username || state.user.userid
    },
    userEmail: (state) => state.user?.email || null
  },

  actions: {
    /**
     * Initialize the store with existing session data
     */
    initializeAuth() {
      console.log('🔄 Initializing auth store')
      if (authService.isAuthenticated()) {
        this.user = authService.getCurrentUser()
        this.token = authService.getToken()
        this.isAuthenticated = true
        console.log('✅ Auth initialized - user authenticated:', this.user?.userid)
      } else {
        console.log('ℹ️ No existing authentication found')
      }
    },

    /**
     * Login action
     * @param {string} username 
     * @param {string} password 
     */
    async login(username, password) {
      console.log('🔐 Auth store login called for:', username)
      this.isLoading = true
      this.error = null

      try {
        const result = await authService.login(username, password)
        console.log('🔐 Auth service returned:', result)
        
        this.user = result.user
        this.token = result.token
        this.isAuthenticated = true
        
        console.log('✅ Auth store updated - isAuthenticated:', this.isAuthenticated)
        console.log('✅ User stored:', this.user)
        console.log('✅ Token stored:', this.token ? 'YES' : 'NO')
        
        return result
      } catch (error) {
        console.error('❌ Auth store login error:', error)
        this.error = error.message
        this.isAuthenticated = false
        this.user = null
        this.token = null
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Logout action
     */
    logout() {
      authService.logout()
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.error = null
    },

    /**
     * Clear error
     */
    clearError() {
      this.error = null
    },

    /**
     * Check if session is still valid
     */
    checkAuth() {
      if (!authService.isAuthenticated()) {
        this.logout()
        return false
      }
      return true
    },

    /**
     * Update user data
     * @param {Object} userData 
     */
    updateUser(userData) {
      this.user = { ...this.user, ...userData }
      localStorage.setItem('user', JSON.stringify(this.user))
    },

    /**
     * Get current token
     * @returns {string|null}
     */
    getToken() {
      return this.token || authService.getToken()
    }
  }
})
