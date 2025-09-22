<!--
  Exemple pratique d'utilisation de l'architecture MVC
  
  Cette vue montre comment utiliser correctement :
  - Models pour la structure des données
  - Controllers pour la logique métier
  - Views pour l'interface utilisateur
-->

<template>
  <div class="example-page container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8">🏗️ Exemple MVC - Gestion Utilisateurs</h1>

    <!-- 📊 Section Statistiques (utilise UserController) -->
    <div class="stats-section mb-8">
      <h2 class="text-2xl font-bold mb-4">📊 Statistiques</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="stat bg-base-200 rounded-lg p-4">
          <div class="stat-title">Total</div>
          <div class="stat-value text-primary">{{ stats.total || 0 }}</div>
        </div>
        <div class="stat bg-base-200 rounded-lg p-4">
          <div class="stat-title">Actifs</div>
          <div class="stat-value text-success">{{ stats.active || 0 }}</div>
        </div>
        <div class="stat bg-base-200 rounded-lg p-4">
          <div class="stat-title">Inactifs</div>
          <div class="stat-value text-warning">{{ stats.inactive || 0 }}</div>
        </div>
        <div class="stat bg-base-200 rounded-lg p-4">
          <div class="stat-title">Admins</div>
          <div class="stat-value text-info">{{ stats.admins || 0 }}</div>
        </div>
      </div>
    </div>

    <!-- 🔍 Section Recherche (utilise UserController.searchUsers) -->
    <div class="search-section mb-8">
      <h2 class="text-2xl font-bold mb-4">🔍 Recherche</h2>
      <div class="flex gap-4 mb-4">
        <input 
          v-model="searchTerm"
          @input="performSearch"
          type="text" 
          placeholder="Rechercher par nom ou email..."
          class="input input-bordered flex-1"
        />
        <select 
          v-model="statusFilter" 
          @change="performSearch"
          class="select select-bordered"
        >
          <option value="">Tous les statuts</option>
          <option value="active">Actifs seulement</option>
          <option value="inactive">Inactifs seulement</option>
          <option value="admin">Admins seulement</option>
        </select>
        <button 
          @click="performSearch" 
          class="btn btn-primary"
          :class="{ 'loading': isSearching }"
        >
          🔍 Rechercher
        </button>
      </div>
    </div>

    <!-- 👥 Section Liste des Utilisateurs -->
    <div class="users-section">
      <h2 class="text-2xl font-bold mb-4">👥 Utilisateurs</h2>
      
      <!-- État de chargement -->
      <div v-if="isLoading" class="text-center py-8">
        <div class="loading loading-spinner loading-lg"></div>
        <p class="mt-2">Chargement des utilisateurs...</p>
      </div>

      <!-- État d'erreur -->
      <div v-else-if="error" class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ error }}</span>
        <button @click="loadUsers" class="btn btn-sm">Réessayer</button>
      </div>

      <!-- Liste des utilisateurs -->
      <div v-else-if="users.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="user in users" 
          :key="user.id"
          class="card bg-base-100 shadow-lg"
        >
          <div class="card-body">
            <!-- Avatar et nom (utilise les getters du Model User) -->
            <div class="flex items-center gap-3 mb-3">
              <div class="avatar">
                <div class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span class="text-primary font-bold">{{ user.initials }}</span>
                </div>
              </div>
              <div>
                <h3 class="font-bold">{{ user.displayName }}</h3>
                <p class="text-sm opacity-70">{{ user.userid }}</p>
              </div>
            </div>

            <!-- Informations (utilise les propriétés du Model) -->
            <div class="space-y-2">
              <div v-if="user.email" class="text-sm">
                📧 {{ user.email }}
              </div>
              <div v-if="user.phone" class="text-sm">
                📞 {{ user.phone }}
              </div>
            </div>

            <!-- Statuts (utilise les getters du Model) -->
            <div class="flex flex-wrap gap-2 mt-3">
              <div 
                class="badge"
                :class="user.isValidUser ? 'badge-success' : 'badge-error'"
              >
                {{ user.isValidUser ? 'Actif' : 'Inactif' }}
              </div>
              <div v-if="user.admin" class="badge badge-warning">
                Admin
              </div>
              <div v-if="user.mustChangePassword" class="badge badge-info">
                Changer mot de passe
              </div>
            </div>

            <!-- Actions -->
            <div class="card-actions justify-end mt-4">
              <button 
                @click="viewUserDetails(user)"
                class="btn btn-sm btn-outline"
              >
                👁️ Voir
              </button>
              <button 
                @click="editUser(user)"
                class="btn btn-sm btn-primary"
              >
                ✏️ Éditer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- État vide -->
      <div v-else class="text-center py-8">
        <div class="text-base-content/50">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
          </svg>
          <p class="text-lg">Aucun utilisateur trouvé</p>
          <p class="text-sm">Modifiez vos critères de recherche</p>
        </div>
      </div>
    </div>

    <!-- 🔧 Section Debug MVC -->
    <div class="debug-section mt-12 p-4 bg-base-200 rounded-lg">
      <h3 class="text-lg font-bold mb-4">🔧 Debug MVC</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <h4 class="font-bold">🏛️ Models</h4>
          <p>{{ users.length }} instances User créées</p>
          <p>Validation: {{ validationErrors.length }} erreurs</p>
        </div>
        <div>
          <h4 class="font-bold">🎮 Controllers</h4>
          <p>{{ controllerCalls }} appels effectués</p>
          <p>Dernière action: {{ lastAction }}</p>
        </div>
        <div>
          <h4 class="font-bold">🎨 Views</h4>
          <p>État: {{ isLoading ? 'Chargement' : 'Prêt' }}</p>
          <p>Filtres: {{ activeFilters }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { UserController } from '../controllers/UserController.js'
import { User } from '../models/User.js'

// 📊 État réactif de la vue
const users = ref([])
const stats = ref({})
const isLoading = ref(false)
const isSearching = ref(false)
const error = ref(null)

// 🔍 État de recherche
const searchTerm = ref('')
const statusFilter = ref('')

// 🔧 Debug info
const controllerCalls = ref(0)
const lastAction = ref('Initialisation')
const validationErrors = ref([])

// 🧮 Propriétés calculées
const activeFilters = computed(() => {
  const filters = []
  if (searchTerm.value) filters.push(`Recherche: "${searchTerm.value}"`)
  if (statusFilter.value) filters.push(`Statut: ${statusFilter.value}`)
  return filters.length > 0 ? filters.join(', ') : 'Aucun'
})

// 🚀 Chargement initial
onMounted(async () => {
  await loadUsers()
  await loadStats()
})

/**
 * 👥 Charge tous les utilisateurs via UserController
 */
async function loadUsers() {
  try {
    isLoading.value = true
    error.value = null
    lastAction.value = 'Chargement utilisateurs'
    controllerCalls.value++

    console.log('🔄 [VIEW] Chargement des utilisateurs via UserController...')
    
    // ✨ Appel au Controller (pas directement au service)
    const loadedUsers = await UserController.getAllUsers()
    
    // 🏛️ Les données sont déjà des instances User grâce au Controller
    users.value = loadedUsers
    
    // 🔍 Vérification des validations
    validationErrors.value = []
    users.value.forEach(user => {
      const validation = user.validate()
      if (!validation.isValid) {
        validationErrors.value.push(...validation.errors)
      }
    })

    console.log(`✅ [VIEW] ${users.value.length} utilisateurs chargés`)
    lastAction.value = 'Utilisateurs chargés'
    
  } catch (err) {
    console.error('❌ [VIEW] Erreur chargement utilisateurs:', err)
    error.value = err.message
    lastAction.value = 'Erreur chargement'
  } finally {
    isLoading.value = false
  }
}

/**
 * 📊 Charge les statistiques via UserController
 */
async function loadStats() {
  try {
    console.log('📊 [VIEW] Chargement des statistiques via UserController...')
    controllerCalls.value++
    
    // ✨ Appel au Controller pour les stats
    stats.value = await UserController.getUserStats()
    
    console.log('✅ [VIEW] Statistiques chargées:', stats.value)
    
  } catch (err) {
    console.error('❌ [VIEW] Erreur chargement statistiques:', err)
  }
}

/**
 * 🔍 Effectue une recherche via UserController
 */
async function performSearch() {
  try {
    isSearching.value = true
    error.value = null
    lastAction.value = 'Recherche en cours'
    controllerCalls.value++

    console.log('🔍 [VIEW] Recherche via UserController...', {
      searchTerm: searchTerm.value,
      statusFilter: statusFilter.value
    })
    
    // ✨ Appel au Controller pour la recherche
    const searchResults = await UserController.searchUsers({
      searchTerm: searchTerm.value,
      status: statusFilter.value
    })
    
    users.value = searchResults
    console.log(`✅ [VIEW] ${searchResults.length} résultats trouvés`)
    lastAction.value = `Recherche: ${searchResults.length} résultats`
    
  } catch (err) {
    console.error('❌ [VIEW] Erreur recherche:', err)
    error.value = err.message
    lastAction.value = 'Erreur recherche'
  } finally {
    isSearching.value = false
  }
}

/**
 * 👁️ Affiche les détails d'un utilisateur
 */
function viewUserDetails(user) {
  console.log('👁️ [VIEW] Affichage détails utilisateur:', user.displayName)
  
  // 🏛️ Utilisation des getters du Model User
  alert(`
Détails utilisateur:
- Nom: ${user.displayName}
- ID: ${user.userid}
- Email: ${user.email || 'Non défini'}
- Statut: ${user.isValidUser ? 'Actif' : 'Inactif'}
- Admin: ${user.admin ? 'Oui' : 'Non'}
- Initiales: ${user.initials}
  `)
}

/**
 * ✏️ Édite un utilisateur
 */
function editUser(user) {
  console.log('✏️ [VIEW] Édition utilisateur:', user.displayName)
  
  // Dans une vraie app, on ouvrirait un modal ou naviguerait vers une page d'édition
  // Ici on fait une démo simple
  const newEmail = prompt('Nouvel email:', user.email || '')
  
  if (newEmail !== null) {
    // 🏛️ Utilisation de la méthode update du Model
    user.update({ email: newEmail })
    
    // 🔍 Validation des nouvelles données
    const validation = user.validate()
    if (!validation.isValid) {
      alert('Erreur de validation: ' + validation.errors.join(', '))
      return
    }
    
    // Dans une vraie app, on appellerait UserController.updateUser()
    console.log('✅ [VIEW] Utilisateur mis à jour (simulation):', user.toJSON())
    alert('Utilisateur mis à jour avec succès!')
  }
}
</script>

<style scoped>
.example-page {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}
</style>
