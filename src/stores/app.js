/**
 * App Store - Main application state management
 * 
 * Replaces the Alpine.js store from the original project
 * Manages application-wide state, navigation, and UI interactions
 */

import { defineStore } from 'pinia'
import { useAuthStore } from './auth.js'
import { userService } from '../services/api.js'

export const useAppStore = defineStore('app', {
  state: () => ({
    // Page navigation
    currentPage: 'dashboard',
    sidebarOpen: true,
    
    // Application info
    hubName: 'Mediahub',
    initialized: false,
    theme: 'light', // Will be set by initTheme()
    
    // Hub properties
    hubProperties: {
      name: 'Not connected',
      serialNumber: 'Not connected',
      version: 'Not connected'
    },
    
    // Data collections
    inputFiles: [],
    networkInterfaces: [],
    srtGateways: [],
    ristGateways: [],
    mbtsGateways: [],
    users: [],
    
    // UI state
    showAnalysisModal: false,
    analysisResult: '',
    showEditModal: false,
    showUserCreateModal: false,
    showUserProfileModal: false,
    currentUserProfile: null,
    
    // Edit forms
    editingFile: {
      fileName: '',
      filePath: '',
      multicastAddress: '',
      multicastPort: '',
      sourceAddress: '',
      muxRate: '9650k'
    },
    
    isCreatingFile: false,
    
    // Selection state
    selectedFiles: [],
    selectedSRTGateways: [],
    
    // New user form
    newUser: {
      userid: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      enabled: true,
      active: true,
      admin: false
    }
  }),
  
  actions: {
    // Initialize the application
    async init() {
      
      if (this.initialized) {
        return;
      }

      // Initialize theme system first
      this.initTheme();

      // Load initial data
      await this.updateHubProperties();
      
      this.initialized = true;
    },

    // Theme management
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      this.saveTheme();
      this.applyTheme();
    },

    setTheme(newTheme) {
      if (['light', 'dark', 'auto'].includes(newTheme)) {
        this.theme = newTheme;
        this.saveTheme();
        this.applyTheme();
      }
    },

    saveTheme() {
      localStorage.setItem('theme', this.theme);
    },

    applyTheme() {
      const effectiveTheme = this.getEffectiveTheme();
      document.documentElement.setAttribute('data-theme', effectiveTheme);
      
      // Pour une compatibilité supplémentaire avec Tailwind
      if (effectiveTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
      
    },

    getEffectiveTheme() {
      if (this.theme === 'auto') {
        // Automatic detection based on system preferences
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return this.theme;
    },

    initTheme() {
      // Load theme from localStorage or use system preferences
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
        this.theme = savedTheme;
      } else {
        // Default to system preferences
        this.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      
      this.applyTheme();
      
      // Listen for system preference changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (this.theme === 'auto') {
          this.applyTheme();
        }
      });
    },

    // Hub properties management
    async updateHubProperties() {
      try {
        const response = await fetch('/api/v1/getAllProperties');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const properties = await response.json();
        this.hubProperties = {
          name: properties.name || 'Not connected',
          serialNumber: properties.serialNumber || 'Not connected',
          version: properties.version || 'Not connected'
        };
        this.hubName = `${properties.name || 'Mediahub'}`;
        
      } catch (error) {
        console.error('Error getting hub properties:', error);
        this.hubName = 'Mediahub - Not connected';
        this.hubProperties = {
          name: 'Not connected',
          serialNumber: 'Not connected',
          version: 'Not connected'
        };
      }
    },

    // Users management
    async loadUsers() {
      try {
        console.log('👥 Loading users from API...')
        const users = await userService.getAllUsers()
        
        // L'API retourne un objet avec les données, on doit extraire la liste
        if (users && typeof users === 'object') {
          // Si c'est un objet avec une propriété contenant la liste
          if (Array.isArray(users.data)) {
            this.users = users.data
          } else if (Array.isArray(users.users)) {
            this.users = users.users
          } else if (Array.isArray(users)) {
            this.users = users
          } else {
            // Si c'est un objet avec des clés numériques, convertir en array
            this.users = Object.values(users)
          }
        } else {
          this.users = []
        }
        
        console.log(`✅ Loaded ${this.users.length} users:`, this.users)
      } catch (error) {
        console.error('❌ Error loading users:', error)
        this.users = []
        throw error // Re-throw pour que la vue puisse gérer l'erreur
      }
    },

    // Delete user
    async deleteUser(userId) {
      try {
        console.log(`🗑️ Deleting user: ${userId}`)
        await userService.deleteUserById(userId)
        
        // Recharger la liste des utilisateurs après suppression
        await this.loadUsers()
        
        console.log('✅ User deleted successfully')
        return { success: true }
      } catch (error) {
        console.error('❌ Error deleting user:', error)
        throw error
      }
    },

    // Create user
    async createUser(userData) {
      try {
        console.log('👥 Creating new user:', userData)
        const newUser = await userService.createUser(userData)
        
        // Recharger la liste des utilisateurs après création
        await this.loadUsers()
        
        console.log('✅ User created successfully:', newUser)
        return { success: true, user: newUser }
      } catch (error) {
        console.error('❌ Error creating user:', error)
        throw error
      }
    },

    // Enable/disable user
    async toggleUserStatus(userId, enable = true) {
      try {
        console.log(`${enable ? '✅' : '❌'} ${enable ? 'Enabling' : 'Disabling'} user: ${userId}`)
        
        if (enable) {
          await userService.enableUserByID(userId)
        } else {
          await userService.disableUserByID(userId)
        }
        
        // Recharger la liste des utilisateurs après modification
        await this.loadUsers()
        
        console.log(`✅ User ${enable ? 'enabled' : 'disabled'} successfully`)
        return { success: true }
      } catch (error) {
        console.error(`❌ Error ${enable ? 'enabling' : 'disabling'} user:`, error)
        throw error
      }
    },

    // Reset user password
    async resetUserPassword(userId, newPassword) {
      try {
        console.log(`🔑 Resetting password for user: ${userId}`)
        await userService.resetPasswordByUserID(userId, newPassword)
        
        console.log('✅ Password reset successfully')
        return { success: true }
      } catch (error) {
        console.error('❌ Error resetting password:', error)
        throw error
      }
    },

    // User profile modal
    openUserProfileModal(user = null) {
      const authStore = useAuthStore();
      this.currentUserProfile = user || authStore.user;
      this.showUserProfileModal = true;
    },

    // User creation modal
    openUserCreateModal() {
      this.showUserCreateModal = true;
      this.newUser = {
        userid: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        enabled: true,
        active: true,
        admin: false
      };
    },

    // Handle logout
    handleLogout() {
      const authStore = useAuthStore();
      authStore.logout();
      this.currentPage = 'login';
      
      // Reset all UI state
      this.editingFile = {
        fileName: '',
        filePath: '',
        multicastAddress: '',
        multicastPort: '',
        sourceAddress: '',
        muxRate: '9650k'
      };
      
      // Close all modals
      this.showUserProfileModal = false;
      this.showUserCreateModal = false;
      this.currentUserProfile = null;
      this.showEditModal = false;
      this.showAnalysisModal = false;
      this.analysisResult = '';
      
      // Reset selections
      this.selectedFiles = [];
      this.selectedSRTGateways = [];
      
      // Reset initialization state
      this.initialized = false;
      
      // Redirect to login
      window.location.href = '/login';
    }
  }
})