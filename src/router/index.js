import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '../services/authService.js'
import { ApplicationController } from '../controllers/ApplicationController.js'

const routes = [
  { 
    path: '/login', 
    name: 'Login', 
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  { 
    path: '/wizard', 
    name: 'Wizard', 
    component: () => import('../views/Wizard.vue'),
    meta: { requiresAuth: true, requiresConfiguration: false }
  },
  { 
    path: '/', 
    name: 'Dashboard', 
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true, page: 'dashboard' }
  },
  { 
    path: '/gateways', 
    name: 'SRTGateways', 
    component: () => import('../views/SRTGateways.vue'),
    meta: { requiresAuth: true, page: 'gateways' }
  },
  { 
    path: '/rist-gateways', 
    name: 'RISTGateways', 
    component: () => import('../views/RISTGateways.vue'),
    meta: { requiresAuth: true, page: 'ristGateways' }
  },
  { 
    path: '/mbts-gateways', 
    name: 'MBTSGateways', 
    component: () => import('../views/MBTSGateways.vue'),
    meta: { requiresAuth: true, page: 'mbtsGateways' }
  },
  { 
    path: '/files', 
    name: 'Files', 
    component: () => import('../views/Files.vue'),
    meta: { requiresAuth: true, page: 'files' }
  },
  { 
    path: '/packaging', 
    name: 'Packaging', 
    component: () => import('../views/Packaging.vue'),
    meta: { requiresAuth: true, page: 'packaging' }
  },
  { 
    path: '/transcoding', 
    name: 'Transcoding', 
    component: () => import('../views/Transcoding.vue'),
    meta: { requiresAuth: true, page: 'transcoding' }
  },
  { 
    path: '/selections', 
    name: 'Selections', 
    component: () => import('../views/Selections.vue'),
    meta: { requiresAuth: true, page: 'selections' }
  },
  { 
    path: '/selections/create', 
    name: 'CreateSelection', 
    component: () => import('../views/CreateSelection.vue'),
    meta: { requiresAuth: true, page: 'selections' }
  },
  { 
    path: '/settings', 
    name: 'Settings', 
    component: () => import('../views/Settings.vue'),
    meta: { requiresAuth: true, page: 'settings' }
  },
  { 
    path: '/network', 
    name: 'Network', 
    component: () => import('../views/Network.vue'),
    meta: { requiresAuth: true, page: 'network' }
  },
  { 
    path: '/users', 
    name: 'Users', 
    component: () => import('../views/Users.vue'),
    meta: { requiresAuth: true, page: 'users' }
  },
  { 
    path: '/help', 
    name: 'Help', 
    component: () => import('../views/Help.vue'),
    meta: { requiresAuth: true, page: 'help' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard to check authentication and configuration
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresConfiguration = to.matched.some(record => record.meta.requiresConfiguration !== false)
  const isAuthenticated = authService.isAuthenticated()

  if (requiresAuth && !isAuthenticated) {
    // Redirect to login page if authentication is required
    next('/login')
    return
  }

  if (to.path === '/login' && isAuthenticated) {
    // Check configuration status after successful authentication
    try {
      console.log('🔍 Router: Checking configuration status after login...')
      const isConfigured = await ApplicationController.isConfigured()
      console.log(`📋 Router: Configuration status: ${isConfigured}`)
      
      if (!isConfigured) {
        console.log('🧙‍♂️ Router: Redirecting to wizard (not configured)')
        next('/wizard')
      } else {
        console.log('✅ Router: Redirecting to dashboard (configured)')
        next('/')
      }
    } catch (error) {
      console.error('❌ Router: Error checking configuration status:', error)
      // En cas d'erreur, rediriger vers le wizard par sécurité
      console.log('🧙‍♂️ Router: Redirecting to wizard (error fallback)')
      next('/wizard')
    }
    return
  }

  // Si l'utilisateur est authentifié et essaie d'accéder à une page qui nécessite une configuration
  if (isAuthenticated && requiresConfiguration && to.path !== '/wizard') {
    try {
      console.log(`🔍 Router: Checking configuration for page access: ${to.path}`)
      const isConfigured = await ApplicationController.isConfigured()
      console.log(`📋 Router: Configuration status for ${to.path}: ${isConfigured}`)
      
      if (!isConfigured) {
        console.log(`🧙‍♂️ Router: Redirecting to wizard from ${to.path} (not configured)`)
        next('/wizard')
        return
      }
    } catch (error) {
      console.error('❌ Router: Error checking configuration status for page access:', error)
      // En cas d'erreur, rediriger vers le wizard par sécurité
      console.log(`🧙‍♂️ Router: Redirecting to wizard from ${to.path} (error fallback)`)
      next('/wizard')
      return
    }
  }

  next()
  
  // Update app store current page after navigation
  if (to.meta.page) {
    // Use setTimeout to avoid circular dependency issues
    setTimeout(async () => {
      try {
        const { useAppStore } = await import('../stores/app.js')
        const appStore = useAppStore()
        appStore.currentPage = to.meta.page
      } catch (error) {
        console.warn('Could not update current page in app store:', error)
      }
    }, 0)
  }
})

export default router
