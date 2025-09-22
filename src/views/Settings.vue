<template>
  <div class="container mx-auto p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-base-content mb-2">Paramètres</h1>
      <p class="text-base-content/70">Configurez votre application selon vos préférences</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Menu de navigation -->
      <div class="lg:col-span-1">
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body p-4">
            <h2 class="card-title text-lg mb-4">Catégories</h2>
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

      <!-- Contenu des paramètres -->
      <div class="lg:col-span-3">
        <!-- Profil Utilisateur -->
        <div v-if="activeCategory === 'profile'" class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <h2 class="card-title mb-6">Profil Utilisateur</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Prénom</span>
                </label>
                <input v-model="userProfile.firstName" type="text" class="input input-bordered" />
              </div>
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Nom</span>
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
              <button class="btn btn-primary">Sauvegarder</button>
            </div>
          </div>
        </div>

        <!-- Thème et Apparence -->
        <div v-else-if="activeCategory === 'appearance'" class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <h2 class="card-title mb-6">Thème et Apparence</h2>
            
            <div class="form-control mb-6">
              <label class="label">
                <span class="label-text">Thème</span>
              </label>
              <select v-model="selectedTheme" @change="changeTheme" class="select select-bordered">
                <option v-for="theme in availableThemes" :key="theme.value" :value="theme.value">
                  {{ theme.label }}
                </option>
              </select>
            </div>
            
            <div class="form-control mb-6">
              <label class="label cursor-pointer">
                <span class="label-text">Mode sombre automatique</span>
                <input v-model="autoTheme" type="checkbox" class="toggle toggle-primary" />
              </label>
            </div>
            
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Animations réduites</span>
                <input v-model="reducedMotion" type="checkbox" class="toggle toggle-primary" />
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
                  <span class="label-text">Notifications par email</span>
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
                  <span class="label-text">Notifications de projets</span>
                  <input v-model="notifications.projects" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>
              
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Résumé hebdomadaire</span>
                  <input v-model="notifications.weekly" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Sécurité -->
        <div v-else-if="activeCategory === 'security'" class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <h2 class="card-title mb-6">Sécurité</h2>
            
            <div class="space-y-6">
              <div class="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Dernière connexion: {{ lastLogin }}</span>
              </div>
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Nouveau mot de passe</span>
                </label>
                <input v-model="security.newPassword" type="password" class="input input-bordered" />
              </div>
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Confirmer le mot de passe</span>
                </label>
                <input v-model="security.confirmPassword" type="password" class="input input-bordered" />
              </div>
              
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Authentification à deux facteurs</span>
                  <input v-model="security.twoFactor" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>
              
              <div class="card-actions">
                <button class="btn btn-primary">Changer le mot de passe</button>
                <button class="btn btn-outline btn-error">Déconnecter tous les appareils</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const activeCategory = ref('profile')
const selectedTheme = ref('light')
const autoTheme = ref(false)
const reducedMotion = ref(false)
const lastLogin = ref('18 septembre 2025, 21:45')

const categories = ref([
  { id: 'profile', name: 'Profil' },
  { id: 'appearance', name: 'Apparence' },
  { id: 'notifications', name: 'Notifications' },
  { id: 'security', name: 'Sécurité' }
])

const availableThemes = ref([
  { value: 'light', label: 'Clair' },
  { value: 'dark', label: 'Sombre' },
  { value: 'cupcake', label: 'Cupcake' },
  { value: 'bumblebee', label: 'Bumblebee' },
  { value: 'emerald', label: 'Emerald' },
  { value: 'corporate', label: 'Corporate' }
])

const userProfile = reactive({
  firstName: 'Sylvain',
  lastName: 'Renard',
  email: 's.renard94@gmail.com',
  bio: 'Développeur passionné par les technologies modernes et l\'architecture MVC.'
})

const notifications = reactive({
  email: true,
  push: false,
  projects: true,
  weekly: true
})

const security = reactive({
  newPassword: '',
  confirmPassword: '',
  twoFactor: false
})

function changeTheme() {
  document.documentElement.setAttribute('data-theme', selectedTheme.value)
}
</script>
