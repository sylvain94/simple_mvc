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
    userName: (state) => state.user ? `${state.user.first_name} ${state.user.last_name}` : null,
    userEmail: (state) => state.user?.email || null
  },

  actions: {
    /**
     * Initialize the store with existing session data
     */
    initializeAuth() {
      if (authService.isAuthenticated()) {
        this.user = authService.getCurrentUser()
        this.token = authService.getToken()
        this.isAuthenticated = true
      }
    },

    /**
     * Login action
     * @param {string} username 
     * @param {string} password 
     */
    async login(username, password) {
      this.isLoading = true
      this.error = null

      try {
        const result = await authService.login(username, password)
        
        this.user = result.user
        this.token = result.token
        this.isAuthenticated = true
        
        return result
      } catch (error) {
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
    }
  }
})
