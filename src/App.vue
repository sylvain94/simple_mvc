<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentTheme = ref('light')

const themes = ['light', 'dark', 'cupcake']

const changeTheme = (theme) => {
  currentTheme.value = theme
  document.documentElement.setAttribute('data-theme', theme)
}

// Navigation items
const navItems = [
  { name: 'Dashboard', path: '/', icon: '🏠' },
  { name: 'Paramètres', path: '/settings', icon: '⚙️' },
  { name: 'Connexion', path: '/login', icon: '🔐' }
]
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
          <li v-for="item in navItems" :key="item.path">
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

        <!-- Mobile Menu -->
        <div class="dropdown dropdown-end lg:hidden">
          <label tabindex="0" class="btn btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
            <li v-for="item in navItems" :key="item.path">
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
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main>
      <router-view />
    </main>
  </div>
</template>
