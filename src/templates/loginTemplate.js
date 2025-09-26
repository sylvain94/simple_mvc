/**
 * Template for the login component - Vue.js version
 * 
 * Adaptation de l'ancien template AlpineJS vers Vue.js
 * Compatible avec votre architecture MVC actuelle
 */

/**
 * Template HTML adapté pour Vue.js
 * Utilise la syntaxe Vue au lieu d'AlpineJS
 */
export const loginTemplate = `
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
      </div>
    </div>
  </div>
`;

/**
 * Configuration du composant Vue correspondant
 */
export const loginComponentConfig = {
  template: loginTemplate,
  
  setup() {
    const { ref, reactive, onMounted } = Vue
    const { useRouter } = VueRouter
    const { useAuthStore } = window.authStores || {}
    
    const router = useRouter()
    const authStore = useAuthStore()
    
    const isLoading = ref(false)
    const loginForm = reactive({
      username: '',
      password: ''
    })
    
    const errors = reactive({
      username: '',
      password: '',
      general: ''
    })
    
    // Check if user is already authenticated
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
      
      try {
        // Use the authentication service
        await authStore.login(loginForm.username, loginForm.password)
        
        // Redirect to dashboard on success
        router.push('/')
      } catch (error) {
        console.error('Connection error:', error)
        errors.general = error.message || 'Username or password incorrect'
      } finally {
        isLoading.value = false
      }
    }
    
    return {
      isLoading,
      loginForm,
      errors,
      handleLogin
    }
  }
}

/**
 * Fonction pour créer le composant login
 * Compatible avec l'ancien pattern d'utilisation
 */
export function createLoginComponent() {
  return loginComponentConfig
}

export default {
  loginTemplate,
  loginComponentConfig,
  createLoginComponent
}
