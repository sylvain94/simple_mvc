<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200">
    <div class="card w-full max-w-md bg-base-100 shadow-2xl">
      <div class="card-body">
        <!-- Logo/Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-primary">🚀 Simple MVC</h1>
          <p class="text-base-content/70 mt-2">Let's connect to your account</p>
        </div>

        <!-- General error -->
        <div v-if="errors.general" class="alert alert-error mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ errors.general }}</span>
        </div>

        <!-- Login form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Userid</span>
            </label>
            <input 
              v-model="loginForm.username"
              type="text" 
              placeholder="your_userid" 
              class="input input-bordered w-full"
              :class="{ 'input-error': errors.username }"
              required
            />
            <label v-if="errors.username" class="label">
              <span class="label-text-alt text-error">{{ errors.username }}</span>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Password</span>
            </label>
            <input 
              v-model="loginForm.password"
              type="password" 
              placeholder="********" 
              class="input input-bordered w-full"
              :class="{ 'input-error': errors.password }"
              required
            />
            <label v-if="errors.password" class="label">
              <span class="label-text-alt text-error">{{ errors.password }}</span>
            </label>
          </div>

          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">Remember me</span>
              <input v-model="loginForm.remember" type="checkbox" class="checkbox checkbox-primary" />
            </label>
          </div>

          <div class="form-control mt-6">
            <button 
              type="submit" 
              class="btn btn-primary w-full"
              :class="{ 'loading': isLoading }"
              :disabled="isLoading"
            >
              <span v-if="!isLoading">Login</span>
              <span v-else>Login in progress...</span>
            </button>
          </div>
        </form>

        <!-- Additional links -->
        <div class="text-center mt-6 space-y-2">
          <a href="#" class="link link-primary text-sm">Forgot password?</a>
          <div class="divider">OR</div>
          <p class="text-sm">
            No account yet? 
            <a href="#" class="link link-secondary">Register</a>
          </p>
        </div>

        <!-- Debug console -->
        <div v-if="showDebug" class="mt-8">
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold">Debug console</h3>
                <button @click="clearDebugLogs" class="btn btn-sm btn-outline">
                  Clear
                </button>
              </div>
              
              <div class="bg-base-300 rounded-lg p-4 max-h-96 overflow-y-auto">
                <div v-if="debugLogs.length === 0" class="text-base-content/50 text-center py-4">
                  No log available
                </div>
                <div v-else>
                  <div 
                    v-for="(log, index) in debugLogs" 
                    :key="index"
                    class="mb-2 p-2 rounded text-sm font-mono"
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

// Intercept console logs to display in the interface
const originalConsoleLog = console.log
const originalConsoleError = console.error

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

console.log = (...args) => {
  originalConsoleLog(...args)
  if (args[0] && typeof args[0] === 'string' && (args[0].includes('🔐') || args[0].includes('📡') || args[0].includes('✅') || args[0].includes('❌'))) {
    addDebugLog('log', args[0], args[1])
  }
}

console.error = (...args) => {
  originalConsoleError(...args)
  if (args[0] && typeof args[0] === 'string' && (args[0].includes('❌') || args[0].includes('📄'))) {
    addDebugLog('error', args[0], args[1])
  }
}

// Check if the user is already connected
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})

async function handleLogin() {
  // Reset errors and logs
  errors.username = ''
  errors.password = ''
  errors.general = ''
  debugLogs.value = []
  showDebug.value = true
  
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
  addDebugLog('info', '🚀 Start of authentication', { userid: loginForm.username })
  
    try {
      // Use the authentication service
      await authStore.login(loginForm.username, loginForm.password)
    
    addDebugLog('success', '✅ Authentication successful, redirection...')
    // Redirection to the dashboard in case of success
    router.push('/')
  } catch (error) {
    console.error('Connection error:', error)
    addDebugLog('error', '❌ Authentication error', { error: error.message })
    errors.general = error.message || 'Userid or password incorrect'
  } finally {
    isLoading.value = false
  }
}

function clearDebugLogs() {
  debugLogs.value = []
  showDebug.value = false
}
</script>
