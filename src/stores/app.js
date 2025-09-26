/**
 * App Store - Main application state management
 * 
 * Replaces the Alpine.js store from the original project
 * Manages application-wide state, navigation, and UI interactions
 */

import { defineStore } from 'pinia'
import { useAuthStore } from './auth.js'

export const useAppStore = defineStore('app', {
  state: () => ({
    // Page navigation
    currentPage: 'dashboard',
    sidebarOpen: true,
    
    // Application info
    hubName: 'Mediahub',
    initialized: false,
    theme: localStorage.getItem('theme') || 'light',
    
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
      console.log('🚀 Initializing app store');
      
      if (this.initialized) {
        console.log('⚠️ App store already initialized');
        return;
      }

      // Initialize theme system first
      this.initTheme();

      // Load initial data
      await this.updateHubProperties();
      
      this.initialized = true;
      console.log('✅ App store initialized successfully');
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
      
      console.log(`🎨 Theme applied: ${effectiveTheme}`);
    },

    getEffectiveTheme() {
      if (this.theme === 'auto') {
        // Détection automatique basée sur les préférences système
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return this.theme;
    },

    initTheme() {
      // Charger le thème depuis localStorage ou utiliser les préférences système
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
        this.theme = savedTheme;
      } else {
        // Par défaut, utiliser les préférences système
        this.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      
      this.applyTheme();
      
      // Écouter les changements de préférences système
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
        const authStore = useAuthStore();
        const response = await fetch('/api/v1/getAllUsers', {
          headers: {
            'Authorization': `Bearer ${authStore.getToken()}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const users = await response.json();
        this.users = users;
      } catch (error) {
        console.error('Error loading users:', error);
        this.users = [];
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