<template>
  <div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">SRT Gateways</h2>
      <div class="flex gap-2">
        <button 
          class="btn btn-success gap-2 hover:scale-105 transition-transform"
          @click="createGateway"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Gateway
        </button>
        <button 
          class="btn btn-primary gap-2 hover:scale-105 transition-transform"
          @click="refreshGateways"
          :disabled="isRefreshing"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="{ 'animate-spin': isRefreshing }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
    </div>
    
    <!-- Statistics cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">Total Gateways</h3>
          <div class="stat">
            <div class="stat-value">{{ gateways.length }}</div>
          </div>
        </div>
      </div>

      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">Running Gateways</h3>
          <div class="stat">
            <div class="stat-value text-success">{{ runningGateways }}</div>
          </div>
        </div>
      </div>

      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">Active Gateways</h3>
          <div class="stat">
            <div class="stat-value text-primary">{{ activeGateways }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Gateways table -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h3 class="card-title">SRT Gateways List</h3>
        
        <!-- Loading state -->
        <div v-if="isLoading" class="text-center py-8">
          <span class="loading loading-spinner loading-lg"></span>
          <p class="mt-2">Loading SRT gateways...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ error }}</span>
          <button class="btn btn-sm" @click="loadGateways">Retry</button>
        </div>

        <!-- Gateways table -->
        <div v-else class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Address</th>
                <th>Mode</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="gateways.length === 0">
                <td colspan="6" class="text-center py-4">
                  No SRT gateways found
                  <br>
                  <button class="btn btn-sm btn-primary mt-2" @click="createGateway">
                    Create your first gateway
                  </button>
                </td>
              </tr>
              <tr v-for="gateway in gateways" :key="gateway.id" class="hover">
                <td>
                  <div class="font-medium">{{ gateway.name || '-' }}</div>
                  <div class="text-sm opacity-50">{{ gateway.id?.substring(0, 8) }}</div>
                </td>
                <td>
                  <span class="badge badge-outline">{{ formatType(gateway) }}</span>
                </td>
                <td>
                  <div class="flex items-center gap-2">
                    <span 
                      class="badge" 
                      :class="{
                        'badge-success': gateway.running && gateway.enabled,
                        'badge-warning': gateway.running && !gateway.enabled,
                        'badge-error': !gateway.running
                      }"
                    >
                      {{ gateway.running ? 'Running' : 'Stopped' }}
                    </span>
                    <span v-if="!gateway.enabled" class="badge badge-ghost badge-sm">Disabled</span>
                  </div>
                </td>
                <td>
                  <div class="text-sm">{{ formatAddress(gateway) }}</div>
                </td>
                <td>
                  <span class="badge badge-ghost">{{ gateway.srtConfig?.srtMode || gateway.mode || '-' }}</span>
                </td>
                <td>
                  <div class="btn-group">
                    <button 
                      v-if="!gateway.running"
                      class="btn btn-sm btn-success"
                      @click="startGateway(gateway.id)"
                      title="Start gateway"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-10V7a3 3 0 11-6 0V4h6zM7 7a3 3 0 016 0v3H7V7z" />
                      </svg>
                    </button>
                    <button 
                      v-if="gateway.running"
                      class="btn btn-sm btn-error"
                      @click="stopGateway(gateway.id)"
                      title="Stop gateway"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10h6v4H9z" />
                      </svg>
                    </button>
                    <button 
                      class="btn btn-sm btn-info"
                      @click="editGateway(gateway.id)"
                      title="Edit gateway"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      class="btn btn-sm btn-error btn-outline"
                      @click="deleteGateway(gateway.id)"
                      title="Delete gateway"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- SRT Gateway Modal -->
    <SRTGatewayModal
      :is-visible="showCreateModal"
      :gateway="editingGateway"
      @close="closeModal"
      @submit="handleGatewaySubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '../stores/app.js'
import SRTGatewayModal from '../components/SRTGatewayModal.vue'

const appStore = useAppStore()
const isRefreshing = ref(false)
const isLoading = ref(false)
const error = ref(null)
const showCreateModal = ref(false)
const editingGateway = ref(null)

// Use reactive data from store
const gateways = computed(() => appStore.srtGateways)

const activeGateways = computed(() => 
  gateways.value.filter(g => g.running && g.enabled).length
)

const runningGateways = computed(() => 
  gateways.value.filter(g => g.running).length
)

const enabledGateways = computed(() => 
  gateways.value.filter(g => g.enabled).length
)

onMounted(() => {
  loadGateways()
})

async function loadGateways() {
  try {
    isLoading.value = true
    error.value = null
    console.log('🚪 Loading SRT gateways...')
    await appStore.loadSRTGateways()
    console.log(`✅ Loaded ${gateways.value.length} SRT gateways`)
  } catch (err) {
    console.error('❌ Error loading SRT gateways:', err)
    error.value = err.message || 'Failed to load SRT gateways'
  } finally {
    isLoading.value = false
  }
}

async function refreshGateways() {
  isRefreshing.value = true
  try {
    await loadGateways()
  } finally {
    isRefreshing.value = false
  }
}

async function startGateway(id) {
  const gateway = gateways.value.find(g => g.id === id)
  if (gateway && confirm(`Start gateway ${gateway.name}?`)) {
    try {
      console.log(`🚪 Starting gateway ${gateway.name}...`)
      await appStore.startSRTGateway(id)
      console.log(`✅ Started gateway ${gateway.name}`)
    } catch (err) {
      console.error(`❌ Error starting gateway ${gateway.name}:`, err)
      alert(`Failed to start gateway: ${err.message}`)
    }
  }
}

async function stopGateway(id) {
  const gateway = gateways.value.find(g => g.id === id)
  if (gateway && confirm(`Stop gateway ${gateway.name}?`)) {
    try {
      console.log(`🚪 Stopping gateway ${gateway.name}...`)
      await appStore.stopSRTGateway(id)
      console.log(`✅ Stopped gateway ${gateway.name}`)
    } catch (err) {
      console.error(`❌ Error stopping gateway ${gateway.name}:`, err)
      alert(`Failed to stop gateway: ${err.message}`)
    }
  }
}

async function editGateway(id) {
  const gateway = gateways.value.find(g => g.id === id)
  if (gateway) {
    console.log('🚪 Edit gateway:', gateway.name)
    editingGateway.value = gateway
    showCreateModal.value = true
  }
}

async function deleteGateway(id) {
  const gateway = gateways.value.find(g => g.id === id)
  if (gateway && confirm(`Delete gateway ${gateway.name}? This action cannot be undone.`)) {
    try {
      console.log(`🚪 Deleting gateway ${gateway.name}...`)
      await appStore.deleteSRTGateway(id)
      console.log(`✅ Deleted gateway ${gateway.name}`)
    } catch (err) {
      console.error(`❌ Error deleting gateway ${gateway.name}:`, err)
      alert(`Failed to delete gateway: ${err.message}`)
    }
  }
}

function createGateway() {
  console.log('🚪 Create new SRT gateway')
  editingGateway.value = null
  showCreateModal.value = true
}

function formatAddress(gateway) {
  if (gateway.srtConfig?.foreignSRTAddress && gateway.srtConfig?.foreignSRTPort) {
    return `${gateway.srtConfig.foreignSRTAddress}:${gateway.srtConfig.foreignSRTPort}`
  }
  return `${gateway.host}:${gateway.port}`
}

function formatType(gateway) {
  if (gateway.srtConfig?.srtMode) {
    return `${gateway.gatewayType} (${gateway.srtConfig.srtMode})`
  }
  return gateway.gatewayType
}

function closeModal() {
  showCreateModal.value = false
  editingGateway.value = null
}

async function handleGatewaySubmit({ data, type, isEditing }) {
  try {
    console.log(`🚪 ${isEditing ? 'Updating' : 'Creating'} ${type} SRT gateway:`, data)
    
    if (isEditing) {
      await appStore.updateSRTGateway(editingGateway.value.id, data)
      console.log(`✅ Updated SRT gateway: ${data.name}`)
    } else {
      await appStore.createSRTGateway(data, type)
      console.log(`✅ Created ${type} SRT gateway: ${data.name}`)
    }
    
    closeModal()
    
    // Refresh the list to show the new/updated gateway
    await loadGateways()
    
  } catch (err) {
    console.error(`❌ Error ${isEditing ? 'updating' : 'creating'} SRT gateway:`, err)
    alert(`Failed to ${isEditing ? 'update' : 'create'} gateway: ${err.message}`)
  }
}
</script>
