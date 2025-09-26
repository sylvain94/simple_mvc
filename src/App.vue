<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth.js'
import { useAppStore } from './stores/app.js'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

// Initialize stores on mount
onMounted(async () => {
  console.log('🚀 App.vue mounted - initializing')
  
  // Always initialize theme first
  console.log('🎨 Initializing theme system')
  appStore.initTheme()
  
  await authStore.initializeAuth()
  console.log('🔐 Auth initialized, isAuthenticated:', authStore.isAuthenticated)
  
  if (authStore.isAuthenticated) {
    console.log('✅ User authenticated, initializing app store')
    await appStore.init()
  } else {
    console.log('ℹ️ User not authenticated')
  }
})

// Computed properties for reactive updates
const currentPage = computed(() => appStore.currentPage)
const sidebarOpen = computed(() => appStore.sidebarOpen)
const hubName = computed(() => appStore.hubName)
const theme = computed(() => appStore.theme)
const effectiveTheme = computed(() => {
  if (appStore.theme === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return appStore.theme
})

// Navigation functions
function logout() {
  appStore.handleLogout()
}

function toggleSidebar() {
  appStore.sidebarOpen = !appStore.sidebarOpen
}

// Theme functions are now handled directly by appStore.setTheme()

function navigateTo(page) {
  appStore.currentPage = page
  
  // Map page names to Vue Router paths
  const routeMap = {
    'dashboard': '/',
    'gateways': '/gateways',
    'ristGateways': '/rist-gateways',
    'mbtsGateways': '/mbts-gateways',
    'files': '/files',
    'packaging': '/packaging',
    'transcoding': '/transcoding',
    'settings': '/settings',
    'network': '/network',
    'users': '/users',
    'help': '/help'
  }
  
  const routePath = routeMap[page] || '/'
  if (route.path !== routePath) {
    router.push(routePath)
  }
}

// Load users when accessing users page
function goToUsers() {
  navigateTo('users')
  appStore.loadUsers()
}

// Open user profile
function openUserProfile() {
  console.log('Open user profile')
  // For now, just log - we'll implement modal later
}
</script>

<template>
  <div :data-theme="theme" class="min-h-screen bg-base-100">
    <!-- Always show router-view for login page -->
    <template v-if="route.path === '/login'">
      <router-view />
    </template>
    
    <!-- Main application layout (authenticated users) -->
    <template v-else-if="authStore.isAuthenticated">
      <!-- Navbar -->
      <div class="navbar bg-base-200">
        <div class="flex-none">
          <button class="btn btn-square btn-ghost" @click="toggleSidebar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      <div class="flex-1">
          <div class="flex items-center gap-2">
            <img src="/logo.svg" alt="logo" class="w-8 h-8"/>
            <span class="text-xl">{{ hubName }}</span>
          </div>
      </div>
      <div class="flex-none">
          <div class="dropdown dropdown-end">
            <button 
              tabindex="0"
              class="btn btn-square btn-ghost"
              :aria-label="theme === 'light' ? 'Activate dark mode' : 'Activate light mode'"
              :title="`Current theme: ${theme}`"
            >
              <!-- Sun icon for light mode -->
              <svg 
                v-if="effectiveTheme === 'light'"
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                class="inline-block w-5 h-5 stroke-current transition-all duration-300"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              <!-- Moon icon for dark mode -->
              <svg 
                v-else
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                class="inline-block w-5 h-5 stroke-current transition-all duration-300"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </svg>
            </button>
            <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <button 
                  @click="appStore.setTheme('light')"
                  :class="{ 'active': theme === 'light' }"
                  class="flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Light Mode
                </button>
              </li>
              <li>
                <button 
                  @click="appStore.setTheme('dark')"
                  :class="{ 'active': theme === 'dark' }"
                  class="flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  Dark Mode
                </button>
              </li>
              <li>
                <button 
                  @click="appStore.setTheme('auto')"
                  :class="{ 'active': theme === 'auto' }"
                  class="flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Auto
                </button>
          </li>
        </ul>
          </div>
        </div>
        <div class="flex-none gap-2">
          <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost btn-circle avatar">
              <div class="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                <img src="/avatar.png" alt="Logo" class="w-8 h-8"/>
              </div>
          </label>
            <ul tabindex="0" class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52">
              <li>
                <a class="justify-between">
                  <span>{{ authStore.user?.username }}</span>
                  <span class="badge badge-primary" v-show="authStore.user?.admin">Admin</span>
                </a>
              </li>
              <li>
                <a @click="openUserProfile">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
              </a>
            </li>
              <li>
                <button class="text-error" @click="logout">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
                  Logout
                </button>
            </li>
          </ul>
        </div>
      </div>
    </div>

      <!-- Content -->
      <div class="flex">
        <!-- Sidebar -->
        <div class="w-64 bg-base-200 min-h-screen" v-show="sidebarOpen">
          <div class="p-4">
            <h2 class="text-lg font-bold text-base-content/70 mb-2">MENU</h2>
            <ul class="menu">
              <li>
                <a 
                  class="flex items-center gap-2" 
                  :class="{ 'active': currentPage === 'dashboard' }"
                  @click="navigateTo('dashboard')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Dashboard
                </a>
              </li>
              <div class="divider my-0"></div>
              <li>
                <a 
                  class="flex items-center gap-2"
                  :class="{ 'active': currentPage === 'gateways' }"
                  @click="navigateTo('gateways')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  SRT Gateways
                </a>
              </li>
              <li>
                <a 
                  class="flex items-center gap-2"
                  :class="{ 'active': currentPage === 'ristGateways' }"
                  @click="navigateTo('ristGateways')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  RIST Gateways
                </a>
              </li>
              <li>
                <a 
                  class="flex items-center gap-2"
                  :class="{ 'active': currentPage === 'mbtsGateways' }"
                  @click="navigateTo('mbtsGateways')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  MBTS Gateways
                </a>
              </li>
              <li>
                <a 
                  class="flex items-center gap-2"
                  :class="{ 'active': currentPage === 'files' }"
                  @click="navigateTo('files')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                  </svg>
                  Files
                </a>
              </li>
              <li>
                <a 
                  class="flex items-center gap-2"
                  :class="{ 'active': currentPage === 'packaging' }"
                  @click="navigateTo('packaging')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                  Packaging
                </a>
              </li>
              <li>
                <a 
                  class="flex items-center gap-2"
                  :class="{ 'active': currentPage === 'transcoding' }"
                  @click="navigateTo('transcoding')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                Transcoding
                </a>
              </li>
            </ul>
            <h2 class="text-lg font-bold text-base-content/70 mb-2 mt-4">GENERAL</h2>
            <ul class="menu">
              <li>
                <a 
                  class="flex items-center gap-2"
                  :class="{ 'active': currentPage === 'settings' }"
                  @click="navigateTo('settings')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                  </svg>
                  Settings
                </a>
              </li>
              <li>
                <a 
                  class="flex items-center gap-2"
                  :class="{ 'active': currentPage === 'network' }"
                  @click="navigateTo('network')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Network
                </a>
              </li>
              <li>
                <a 
                  class="flex items-center gap-2"
                  :class="{ 'active': currentPage === 'users' }"
                  @click="goToUsers"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                  Users
                </a>
              </li>
              <li>
                <a 
                  class="flex items-center gap-2"
                  :class="{ 'active': currentPage === 'help' }"
                  @click="navigateTo('help')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                  </svg>
                  Help
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Main content -->
        <div class="flex-1 p-4">
      <router-view />
        </div>
      </div>
    </template>
    
    <!-- Loading state or fallback -->
    <template v-else>
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <div class="loading loading-spinner loading-lg"></div>
          <p class="mt-4">Loading...</p>
        </div>
      </div>
    </template>
  </div>
</template>
