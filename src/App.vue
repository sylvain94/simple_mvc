<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth.js'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const currentTheme = ref('light')

const themes = ['light', 'dark', 'cupcake']

const changeTheme = (theme) => {
  currentTheme.value = theme
  document.documentElement.setAttribute('data-theme', theme)
}

// Navigation items (filtrés selon l'authentification)
const navItems = ref([
  { name: 'Dashboard', path: '/', icon: '🏠', requiresAuth: true },
  { name: 'Paramètres', path: '/settings', icon: '⚙️', requiresAuth: true }
])

// Filtrer les éléments de navigation selon l'authentification
const visibleNavItems = computed(() => {
  return navItems.value.filter(item => !item.requiresAuth || authStore.isAuthenticated)
})

function logout() {
  authStore.logout()
}

// Initialiser l'authentification au démarrage
onMounted(() => {
  authStore.initializeAuth()
})
</script>

<template>
  <div :data-theme="currentTheme" class="min-h-screen bg-base-100">
    <!-- Navigation -->
    <div class="navbar bg-base-200 shadow-lg">
      <div class="flex-1">
        <router-link to="/" class="btn btn-ghost normal-case text-xl">🚀 Simple MVC</router-link>
      </div>
      
      <!-- Navigation Menu -->
      <div class="flex-none">
        <ul class="menu menu-horizontal px-1 hidden lg:flex">
          <li v-for="item in visibleNavItems" :key="item.path">
            <router-link 
              :to="item.path" 
              :class="{ 'active': route.path === item.path }"
              class="flex items-center gap-2"
            >
              <span class="text-base">{{ item.icon }}</span>
              {{ item.name }}
            </router-link>
          </li>
        </ul>
        
        <!-- Theme Selector -->
        <div class="dropdown dropdown-end ml-4">
          <label tabindex="0" class="btn btn-ghost">
            Thème
            <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
            </svg>
          </label>
          <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
            <li v-for="theme in themes" :key="theme">
              <a @click="changeTheme(theme)" :class="{ 'active': currentTheme === theme }">
                {{ theme.charAt(0).toUpperCase() + theme.slice(1) }}
              </a>
            </li>
          </ul>
        </div>

        <!-- User Menu (authentifié seulement) -->
        <div v-if="authStore.isAuthenticated" class="dropdown dropdown-end ml-4">
          <label tabindex="0" class="btn btn-ghost">
            <div class="flex items-center gap-2">
              <div class="avatar">
                <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span class="text-primary text-sm font-bold">
                    {{ authStore.userName ? authStore.userName.split(' ').map(n => n[0]).join('') : '?' }}
                  </span>
                </div>
              </div>
              <span class="hidden lg:inline">{{ authStore.userName || 'Utilisateur' }}</span>
              <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
              </svg>
            </div>
          </label>
          <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <router-link to="/settings" class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profil
              </router-link>
            </li>
            <li>
              <a @click="logout" class="flex items-center gap-2 text-error">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Déconnexion
              </a>
            </li>
          </ul>
        </div>

        <!-- Bouton de connexion (non authentifié seulement) -->
        <div v-else class="ml-4">
          <router-link to="/login" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Connexion
          </router-link>
        </div>

        <!-- Mobile Menu -->
        <div class="dropdown dropdown-end lg:hidden">
          <label tabindex="0" class="btn btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
            <li v-for="item in visibleNavItems" :key="item.path">
              <router-link 
                :to="item.path" 
                :class="{ 'active': route.path === item.path }"
                class="flex items-center gap-2"
              >
                <span class="text-base">{{ item.icon }}</span>
                {{ item.name }}
              </router-link>
            </li>
            <li v-if="authStore.isAuthenticated" class="border-t border-base-300 mt-2 pt-2">
              <a @click="logout" class="flex items-center gap-2 text-error">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Déconnexion
              </a>
            </li>
            <li v-else class="border-t border-base-300 mt-2 pt-2">
              <router-link to="/login" class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Connexion
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main>
      <router-view />
    </main>
  </div>
</template>
