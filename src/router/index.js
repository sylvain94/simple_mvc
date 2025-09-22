import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Settings from '../views/Settings.vue'
import Login from '../views/Login.vue'
import { authService } from '../services/authService.js'

const routes = [
  { 
    path: '/', 
    name: 'Dashboard', 
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  { 
    path: '/settings', 
    name: 'Settings', 
    component: Settings,
    meta: { requiresAuth: true }
  },
  { 
    path: '/login', 
    name: 'Login', 
    component: Login,
    meta: { requiresAuth: false }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard pour vérifier l'authentification
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = authService.isAuthenticated()

  if (requiresAuth && !isAuthenticated) {
    // Rediriger vers la page de login si authentification requise
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    // Rediriger vers le dashboard si déjà connecté et tentative d'accès au login
    next('/')
  } else {
    next()
  }
})

export default router
