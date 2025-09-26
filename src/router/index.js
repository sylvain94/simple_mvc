import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '../services/authService.js'

const routes = [
  { 
    path: '/login', 
    name: 'Login', 
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
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

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = authService.isAuthenticated()

  if (requiresAuth && !isAuthenticated) {
    // Redirect to login page if authentication is required
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    // Redirect to dashboard if already authenticated and trying to access login
    next('/')
  } else {
    // Update app store current page
    if (to.meta.page) {
      // Import here to avoid circular dependency
      import('../stores/app.js').then(({ useAppStore }) => {
        const appStore = useAppStore()
        appStore.currentPage = to.meta.page
      })
    }
    next()
  }
})

export default router
