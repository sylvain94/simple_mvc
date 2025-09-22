<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200">
    <div class="card w-full max-w-md bg-base-100 shadow-2xl">
      <div class="card-body">
        <!-- Logo/Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-primary">🚀 Simple MVC</h1>
          <p class="text-base-content/70 mt-2">Connectez-vous à votre compte</p>
        </div>

        <!-- Formulaire de connexion -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input 
              v-model="loginForm.email"
              type="email" 
              placeholder="votre@email.com" 
              class="input input-bordered w-full"
              :class="{ 'input-error': errors.email }"
              required
            />
            <label v-if="errors.email" class="label">
              <span class="label-text-alt text-error">{{ errors.email }}</span>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Mot de passe</span>
            </label>
            <input 
              v-model="loginForm.password"
              type="password" 
              placeholder="••••••••" 
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
              <span class="label-text">Se souvenir de moi</span>
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
              <span v-if="!isLoading">Se connecter</span>
              <span v-else>Connexion en cours...</span>
            </button>
          </div>
        </form>

        <!-- Liens supplémentaires -->
        <div class="text-center mt-6 space-y-2">
          <a href="#" class="link link-primary text-sm">Mot de passe oublié ?</a>
          <div class="divider">OU</div>
          <p class="text-sm">
            Pas encore de compte ? 
            <a href="#" class="link link-secondary">S'inscrire</a>
          </p>
        </div>

        <!-- Connexion sociale -->
        <div class="mt-6">
          <div class="grid grid-cols-2 gap-3">
            <button class="btn btn-outline btn-sm">
              <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button class="btn btn-outline btn-sm">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
              Twitter
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isLoading = ref(false)
const loginForm = reactive({
  email: '',
  password: '',
  remember: false
})

const errors = reactive({
  email: '',
  password: ''
})

async function handleLogin() {
  // Reset errors
  errors.email = ''
  errors.password = ''
  
  // Basic validation
  if (!loginForm.email) {
    errors.email = 'L\'email est requis'
    return
  }
  
  if (!loginForm.password) {
    errors.password = 'Le mot de passe est requis'
    return
  }
  
  if (loginForm.password.length < 6) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    return
  }
  
  isLoading.value = true
  
  try {
    // Simulation d'une API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Ici tu ferais un appel à ton API
    console.log('Tentative de connexion avec:', loginForm)
    
    // Redirection vers le dashboard en cas de succès
    router.push('/')
  } catch (error) {
    console.error('Erreur de connexion:', error)
    errors.password = 'Email ou mot de passe incorrect'
  } finally {
    isLoading.value = false
  }
}
</script>
