<template>
  <div class="container mx-auto p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-base-content mb-2">Settings</h1>
      <p class="text-base-content/70">Configure your application according to your preferences</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Navigation menu -->
      <div class="lg:col-span-1">
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body p-4">
            <h2 class="card-title text-lg mb-4">Categories</h2>
            <ul class="menu">
              <li v-for="category in categories" :key="category.id">
                <a 
                  @click="activeCategory = category.id"
                  :class="{ 'active': activeCategory === category.id }"
                  class="flex items-center gap-3"
                >
                  <svg v-if="category.id === 'profile'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <svg v-else-if="category.id === 'appearance'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                  <svg v-else-if="category.id === 'notifications'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <svg v-else-if="category.id === 'security'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {{ category.name }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Parameter content -->
      <div class="lg:col-span-3">
        <!-- User Profile -->
        <div v-if="activeCategory === 'profile'" class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <h2 class="card-title mb-6">User Profile</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-control">
                <label class="label">
                  <span class="label-text">First name</span>
                </label>
                <input v-model="userProfile.firstName" type="text" class="input input-bordered" />
              </div>
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Last name</span>
                </label>
                <input v-model="userProfile.lastName" type="text" class="input input-bordered" />
              </div>
              
              <div class="form-control md:col-span-2">
                <label class="label">
                  <span class="label-text">Email</span>
                </label>
                <input v-model="userProfile.email" type="email" class="input input-bordered" />
              </div>
              
              <div class="form-control md:col-span-2">
                <label class="label">
                  <span class="label-text">Bio</span>
                </label>
                <textarea v-model="userProfile.bio" class="textarea textarea-bordered" rows="3"></textarea>
              </div>
            </div>
            
            <div class="card-actions justify-end mt-6">
              <button class="btn btn-primary">Save</button>
            </div>
          </div>
        </div>

        <!-- Theme and Appearance -->
        <div v-else-if="activeCategory === 'appearance'" class="card bg-base-100 shadow-elevated">
          <div class="card-body">
            <h2 class="card-title mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v6a2 2 0 002 2h4a2 2 0 002-2V5z" />
              </svg>
              Thème et Apparence
            </h2>
            
            <!-- Theme Selection Cards -->
            <div class="form-control mb-8">
              <label class="label">
                <span class="label-text font-semibold">Sélection du thème</span>
                <span class="label-text-alt text-sm opacity-70">Thème actuel: {{ appStore.theme }}</span>
              </label>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <!-- Light Theme Card -->
                <div 
                  @click="appStore.setTheme('light')"
                  :class="{ 'ring-2 ring-primary ring-offset-2': appStore.theme === 'light' }"
                  class="card bg-base-100 border cursor-pointer hover:shadow-lg transition-all duration-300"
                >
                  <div class="card-body p-4">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 class="font-semibold text-sm">Mode Clair</h3>
                        <p class="text-xs opacity-70">Interface lumineuse</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Dark Theme Card -->
                <div 
                  @click="appStore.setTheme('dark')"
                  :class="{ 'ring-2 ring-primary ring-offset-2': appStore.theme === 'dark' }"
                  class="card bg-base-100 border cursor-pointer hover:shadow-lg transition-all duration-300"
                >
                  <div class="card-body p-4">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      </div>
                      <div>
                        <h3 class="font-semibold text-sm">Mode Sombre</h3>
                        <p class="text-xs opacity-70">Interface sombre</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Auto Theme Card -->
                <div 
                  @click="appStore.setTheme('auto')"
                  :class="{ 'ring-2 ring-primary ring-offset-2': appStore.theme === 'auto' }"
                  class="card bg-base-100 border cursor-pointer hover:shadow-lg transition-all duration-300"
                >
                  <div class="card-body p-4">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-blue-500 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 class="font-semibold text-sm">Automatique</h3>
                        <p class="text-xs opacity-70">Suit le système</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Theme Preview -->
            <div class="form-control mb-6">
              <label class="label">
                <span class="label-text font-semibold">Aperçu</span>
              </label>
              <div class="p-4 border rounded-lg bg-base-200">
                <div class="flex items-center gap-4">
                  <div class="w-3 h-3 rounded-full bg-primary"></div>
                  <div class="w-3 h-3 rounded-full bg-secondary"></div>
                  <div class="w-3 h-3 rounded-full bg-accent"></div>
                  <span class="text-sm">Couleurs du thème actuel</span>
                </div>
              </div>
            </div>
            
            <!-- Additional Options -->
            <div class="divider">Options avancées</div>
            
            <div class="form-control mb-4">
              <label class="label cursor-pointer">
                <span class="label-text">Animations réduites</span>
                <input v-model="reducedMotion" type="checkbox" class="toggle toggle-primary" />
              </label>
              <label class="label">
                <span class="label-text-alt">Réduit les animations pour améliorer les performances</span>
              </label>
            </div>
            
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Transitions fluides</span>
                <input v-model="smoothTransitions" type="checkbox" class="toggle toggle-primary" />
              </label>
              <label class="label">
                <span class="label-text-alt">Active les transitions fluides entre les thèmes</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Notifications -->
        <div v-else-if="activeCategory === 'notifications'" class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <h2 class="card-title mb-6">Notifications</h2>
            
            <div class="space-y-4">
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Notifications by email</span>
                  <input v-model="notifications.email" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>
              
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Notifications push</span>
                  <input v-model="notifications.push" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>
              
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Projects notifications</span>
                  <input v-model="notifications.projects" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>
              
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Weekly summary</span>
                  <input v-model="notifications.weekly" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Security -->
        <div v-else-if="activeCategory === 'security'" class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <h2 class="card-title mb-6">Security</h2>
            
            <div class="space-y-6">
              <div class="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Last login: {{ lastLogin }}</span>
              </div>
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text">New password</span>
                </label>
                <input v-model="security.newPassword" type="password" class="input input-bordered" />
              </div>
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Confirm password</span>
                </label>
                <input v-model="security.confirmPassword" type="password" class="input input-bordered" />
              </div>
              
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Two-factor authentication</span>
                  <input v-model="security.twoFactor" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>
              
              <div class="card-actions">
                <button class="btn btn-primary">Change password</button>
                <button class="btn btn-outline btn-error">Disconnect all devices</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAppStore } from '../stores/app.js'

// Store imports
const appStore = useAppStore()

// Reactive data
const activeCategory = ref('profile')
const reducedMotion = ref(false)
const smoothTransitions = ref(true)
const lastLogin = ref('26 septembre 2025, 11:06')

// Categories for settings navigation
const categories = ref([
  { id: 'profile', name: 'Profile', icon: 'user' },
  { id: 'appearance', name: 'Apparence', icon: 'palette' },
  { id: 'notifications', name: 'Notifications', icon: 'bell' },
  { id: 'security', name: 'Sécurité', icon: 'shield' }
])

// User profile data (should come from a store in real app)
const userProfile = reactive({
  firstName: 'Sylvain',
  lastName: 'Renard',
  email: 's.renard94@gmail.com',
  bio: 'Développeur passionné par les technologies modernes et l\'architecture MVC.'
})

// Notification preferences
const notifications = reactive({
  email: true,
  push: false,
  projects: true,
  weekly: true
})

// Security settings
const security = reactive({
  newPassword: '',
  confirmPassword: '',
  twoFactor: false
})

// Theme management
const currentTheme = computed(() => appStore.theme)
const effectiveTheme = computed(() => appStore.getEffectiveTheme())

// Initialize component
onMounted(() => {
  console.log('🔧 Settings component mounted');
  // Load user preferences from localStorage or API
  loadUserPreferences();
})

function loadUserPreferences() {
  // Load saved preferences
  const savedReducedMotion = localStorage.getItem('reducedMotion');
  const savedSmoothTransitions = localStorage.getItem('smoothTransitions');
  
  if (savedReducedMotion !== null) {
    reducedMotion.value = JSON.parse(savedReducedMotion);
  }
  
  if (savedSmoothTransitions !== null) {
    smoothTransitions.value = JSON.parse(savedSmoothTransitions);
  }
}

function saveUserPreferences() {
  localStorage.setItem('reducedMotion', JSON.stringify(reducedMotion.value));
  localStorage.setItem('smoothTransitions', JSON.stringify(smoothTransitions.value));
  
  // Apply reduced motion preference
  if (reducedMotion.value) {
    document.documentElement.style.setProperty('--transition-duration', '0s');
  } else {
    document.documentElement.style.removeProperty('--transition-duration');
  }
  
  console.log('💾 User preferences saved');
}

// Watch for changes and save preferences
import { watch } from 'vue'

watch([reducedMotion, smoothTransitions], () => {
  saveUserPreferences();
}, { deep: true })

function saveProfile() {
  // In a real app, this would save to an API
  console.log('💾 Saving profile:', userProfile);
  // You would call UserController.updateProfile(userProfile) here
}

function saveNotifications() {
  console.log('🔔 Saving notifications:', notifications);
  // You would call a notifications API here
}

function changePassword() {
  if (security.newPassword !== security.confirmPassword) {
    alert('Les mots de passe ne correspondent pas');
    return;
  }
  
  if (security.newPassword.length < 8) {
    alert('Le mot de passe doit contenir au moins 8 caractères');
    return;
  }
  
  console.log('🔐 Changing password...');
  // You would call AuthController.changePassword() here
  
  // Clear fields after successful change
  security.newPassword = '';
  security.confirmPassword = '';
}
</script>
