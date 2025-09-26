<template>
  <div class="min-h-screen flex items-center justify-center bg-base-100">
    <div class="card w-96 bg-base-200 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl font-bold text-center mb-6">Login</h2>
        
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Username -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Username</span>
            </label>
            <input 
              v-model="loginForm.username"
              type="text" 
              class="input input-bordered w-full" 
              :class="{ 'input-error': errors.username }"
              required
            />
            <label v-if="errors.username" class="label">
              <span class="label-text-alt text-error">{{ errors.username }}</span>
            </label>
          </div>

          <!-- Password -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Password</span>
            </label>
            <input 
              v-model="loginForm.password"
              type="password" 
              class="input input-bordered w-full" 
              :class="{ 'input-error': errors.password }"
              autocomplete="current-password"
              required
            />
            <label v-if="errors.password" class="label">
              <span class="label-text-alt text-error">{{ errors.password }}</span>
            </label>
          </div>

          <!-- Error message -->
          <div v-show="errors.general" class="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ errors.general }}</span>
          </div>

          <!-- Login button -->
          <button 
            type="submit" 
            class="btn btn-primary w-full"
            :class="{ 'loading': isLoading }"
            :disabled="isLoading"
          >
            <span v-show="!isLoading">Login</span>
            <span v-show="isLoading">Login in progress...</span>
          </button>
        </form>

        <!-- Debug toggle button (development only) -->
        <div v-if="isDevelopment" class="text-center mt-4">
          <button 
            @click="showDebug = !showDebug" 
            class="btn btn-ghost btn-xs"
          >
            {{ showDebug ? 'Hide' : 'Show' }} Debug Console
          </button>
        </div>

        <!-- Debug console (only in development) -->
        <div v-if="showDebug && isDevelopment" class="mt-4">
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body p-4">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-sm font-bold">Debug Console</h3>
                <button @click="clearDebugLogs" class="btn btn-xs btn-outline">
                  Clear
                </button>
              </div>
              
              <div class="bg-base-300 rounded-lg p-3 max-h-64 overflow-y-auto">
                <div v-if="debugLogs.length === 0" class="text-base-content/50 text-center py-2 text-xs">
                  No logs available
                </div>
                <div v-else>
                  <div 
                    v-for="(log, index) in debugLogs" 
                    :key="index"
                    class="mb-2 p-2 rounded text-xs font-mono"
                    :class="{
                      'bg-info/20 text-info': log.type === 'info',
                      'bg-success/20 text-success': log.type === 'success', 
                      'bg-error/20 text-error': log.type === 'error',
                      'bg-base-200': log.type === 'log'
                    }"
                  >
                    <div class="flex justify-between items-start">
                      <span class="font-bold">[{{ log.timestamp }}]</span>
                      <span class="text-xs opacity-75">{{ log.type }}</span>
                    </div>
                    <div class="mt-1">{{ log.message }}</div>
                    <div v-if="log.data" class="mt-2 bg-black/20 p-2 rounded text-xs overflow-x-auto">
                      <pre>{{ log.data }}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(false)
const debugLogs = ref([])
const showDebug = ref(false)

// detect development environment
const isDevelopment = ref(import.meta.env.DEV)

const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

const errors = reactive({
  username: '',
  password: '',
  general: ''
})

function addDebugLog(type, message, data = null) {
  const timestamp = new Date().toLocaleTimeString()
  debugLogs.value.push({
    timestamp,
    type,
    message,
    data: data ? JSON.stringify(data, null, 2) : null
  })
  // Keep only the last 20 logs
  if (debugLogs.value.length > 20) {
    debugLogs.value.shift()
  }
}

// Check if the user is already connected
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})

async function handleLogin() {
  // Reset errors
  errors.username = ''
  errors.password = ''
  errors.general = ''
  
  // Basic validation
  if (!loginForm.username) {
    errors.username = 'The username is required'
    return
  }
  
  if (!loginForm.password) {
    errors.password = 'The password is required'
    return
  }
  
  isLoading.value = true
  
  // Debug logging only in development
  if (isDevelopment.value) {
    debugLogs.value = []
    showDebug.value = true
    addDebugLog('info', '🚀 Start of authentication', { userid: loginForm.username })
  }
  
  try {
    // Use the authentication service
    const result = await authStore.login(loginForm.username, loginForm.password)
    
    if (isDevelopment.value) {
      addDebugLog('success', '✅ Authentication successful, redirection...')
    }
    
    // Check if we're actually authenticated
    if (authStore.isAuthenticated) {
      // Redirection to the dashboard in case of success
      await router.push('/')
    } else {
      console.error('❌ Authentication failed - user not authenticated after login')
      errors.general = 'Authentication failed'
    }
  } catch (error) {
    console.error('❌ Connection error:', error)
    
    if (isDevelopment.value) {
      addDebugLog('error', '❌ Authentication error', { error: error.message })
    }
    
    errors.general = error.message || 'Username or password incorrect'
  } finally {
    isLoading.value = false
  }
}

function clearDebugLogs() {
  debugLogs.value = []
  showDebug.value = false
}
</script>
