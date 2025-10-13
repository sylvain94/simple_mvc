<template>
  <div class="container mx-auto p-6">
    <!-- Header with stats and actions -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold">SRT Gateways Management</h2>
        <p class="text-base-content/70 mt-1" v-if="stats">
          {{ stats.total }} gateways total • {{ stats.active }} active • {{ stats.enabled }} enabled
        </p>
      </div>
      <div class="flex gap-2">
        <button 
          @click="createGateway"
          class="btn btn-secondary gap-2"
          :disabled="isLoading"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Gateway
        </button>
        <button 
          @click="refreshGateways"
          class="btn btn-primary gap-2"
          :class="{ 'loading': isLoading }"
          :disabled="isLoading"
        >
          <svg v-if="!isLoading" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
    </div>

    <!-- Search bar -->
    <div class="mb-4">
      <div class="form-control">
        <div class="input-group">
          <input 
            v-model="searchQuery"
            @input="onSearchInput"
            type="text" 
            placeholder="Search gateways by name, address, mode, or type..." 
            class="input input-bordered flex-1"
          />
          <button class="btn btn-square">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Tabs for Incoming/Outgoing -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="flex justify-between items-center mb-4">
          <div class="tabs tabs-boxed">
            <a 
              class="tab" 
              :class="{ 'tab-active': activeTab === 'incoming' }"
              @click="activeTab = 'incoming'"
            >
              Incoming ({{ incomingGateways.length }})
            </a>
            <a 
              class="tab" 
              :class="{ 'tab-active': activeTab === 'outgoing' }"
              @click="activeTab = 'outgoing'"
            >
              Outgoing ({{ outgoingGateways.length }})
            </a>
          </div>
          <div class="text-sm text-base-content/70">
            Last updated: {{ lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never' }}
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-if="isLoading && gateways.length === 0" class="text-center py-8">
          <div class="loading loading-spinner loading-lg"></div>
          <p class="mt-4">Loading SRT gateways...</p>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ error }}</span>
          <button @click="refreshGateways" class="btn btn-sm">Retry</button>
        </div>
        
        <!-- Gateways Table -->
        <div v-else class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>
                  <label>
                    <input 
                      type="checkbox" 
                      class="checkbox"
                      :checked="allSelected"
                      @change="toggleAllSelection"
                    />
                  </label>
                </th>
                <th>Name</th>
                <th>Type</th>
                <th>Status</th>
                <th v-if="activeTab === 'incoming'">Incoming SRT</th>
                <th>Outgoing Multicast</th>
                <th>Mode</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <!-- No gateways message -->
              <tr v-if="currentTabGateways.length === 0 && !isLoading">
                <td :colspan="activeTab === 'incoming' ? 8 : 7" class="text-center py-8">
                  <div class="text-base-content/50">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p class="font-medium">No {{ activeTab }} SRT gateways found</p>
                    <p class="text-sm">{{ searchQuery ? 'Try adjusting your search criteria' : `Add your first ${activeTab} SRT gateway to get started` }}</p>
                  </div>
                </td>
              </tr>
              
              <!-- Gateway rows -->
              <tr v-for="gateway in currentTabGateways" :key="gateway.id" class="hover">
                <td>
                  <label>
                    <input 
                      type="checkbox" 
                      class="checkbox"
                      :checked="selectedGateways.includes(gateway.id)"
                      @change="toggleGatewaySelection(gateway.id)"
                    />
                  </label>
                </td>
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
                <td v-if="activeTab === 'incoming'">
                  <div class="text-sm font-mono">{{ formatIncomingSRTUrl(gateway) }}</div>
                </td>
                <td>
                  <div class="text-sm">{{ formatAddress(gateway) }}</div>
                </td>
                <td>
                  <span class="badge badge-ghost">{{ gateway.srtConfig?.srtMode || gateway.mode || '-' }}</span>
                </td>
                <td>
                  <div class="flex gap-1">
                    <!-- Start/Stop button -->
                    <button 
                      @click="toggleGateway(gateway)"
                      :class="gateway.running ? 'btn-error' : 'btn-success'"
                      class="btn btn-xs"
                      :disabled="isProcessing.includes(gateway.id)"
                    >
                      <span v-if="isProcessing.includes(gateway.id)" class="loading loading-spinner loading-xs"></span>
                      <span v-else>{{ gateway.running ? 'Stop' : 'Start' }}</span>
                    </button>
                    
                    <!-- Edit button -->
                    <button 
                      @click="editGateway(gateway.id)"
                      class="btn btn-xs btn-primary"
                      :disabled="gateway.running || isProcessing.includes(gateway.id)"
                      :title="gateway.running ? 'The gateway must be stopped to be edited' : 'Edit this gateway'"
                    >
                      Edit
                    </button>
                    
                    <!-- Analyze button -->
                    <button 
                      @click="analyzeGateway(gateway)"
                      class="btn btn-xs btn-info"
                      :disabled="!gateway.running || isProcessing.includes(gateway.id)"
                      :title="!gateway.running ? 'The gateway must be running to be analyzed' : 'Analyze this gateway'"
                    >
                      Analyze
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Bulk actions -->
        <div v-if="selectedGateways.length > 0" class="mt-4 p-4 bg-base-200 rounded-lg">
          <div class="flex justify-between items-center">
            <span class="text-sm font-medium">{{ selectedGateways.length }} gateway(s) selected</span>
            <div class="flex gap-2">
              <button @click="startSelectedGateways" class="btn btn-xs btn-success">Start Selected</button>
              <button @click="stopSelectedGateways" class="btn btn-xs btn-error">Stop Selected</button>
              <button @click="deleteSelectedGateways" class="btn btn-xs btn-error">Delete Selected</button>
            </div>
          </div>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useAppStore } from '../stores/app.js'
import SRTGatewayModal from '../components/SRTGatewayModal.vue'

const appStore = useAppStore()
const isRefreshing = ref(false)
const isLoading = ref(false)
const error = ref(null)
const showCreateModal = ref(false)
const editingGateway = ref(null)
const isProcessing = ref([])

// Search and selection
const searchQuery = ref('')
const selectedGateways = ref([])
const lastUpdated = ref(null)
const stats = ref(null)
const activeTab = ref('incoming')

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

// Separate gateways by type
const incomingGateways = computed(() => 
  gateways.value.filter(g => g.gatewayType === 'SRT_MC')
)

const outgoingGateways = computed(() => 
  gateways.value.filter(g => g.gatewayType === 'MC_SRT')
)

// Get gateways for current tab
const currentTabGateways = computed(() => {
  const baseGateways = activeTab.value === 'incoming' ? incomingGateways.value : outgoingGateways.value
  
  if (!searchQuery.value.trim()) {
    return baseGateways
  }
  
  const query = searchQuery.value.toLowerCase().trim()
  return baseGateways.filter(gateway => 
    (gateway.name && gateway.name.toLowerCase().includes(query)) ||
    (gateway.description && gateway.description.toLowerCase().includes(query)) ||
    (gateway.gatewayType && gateway.gatewayType.toLowerCase().includes(query)) ||
    (gateway.srtConfig?.srtMode && gateway.srtConfig.srtMode.toLowerCase().includes(query)) ||
    (gateway.srtConfig?.foreignSRTAddress && gateway.srtConfig.foreignSRTAddress.includes(query)) ||
    (gateway.localMCAddress && gateway.localMCAddress.includes(query)) ||
    (gateway.localSRTListenAddress && gateway.localSRTListenAddress.includes(query))
  )
})

// Legacy computed for backward compatibility (used in bulk actions)
const filteredGateways = computed(() => currentTabGateways.value)

const allSelected = computed(() => {
  return filteredGateways.value.length > 0 && 
         filteredGateways.value.every(gateway => selectedGateways.value.includes(gateway.id))
})

onMounted(() => {
  loadGateways()
})

// Clear selection when switching tabs
watch(activeTab, () => {
  selectedGateways.value = []
})

async function loadGateways() {
  try {
    isLoading.value = true
    error.value = null
    console.log('🚪 Loading SRT gateways...')
    await appStore.loadSRTGateways()
    
    // Calculate stats
    const total = gateways.value.length
    const active = activeGateways.value
    const enabled = enabledGateways.value
    
    stats.value = { total, active, enabled }
    lastUpdated.value = new Date()
    
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

async function toggleGateway(gateway) {
  if (isProcessing.value.includes(gateway.id)) {
    return // Already processing
  }

  isProcessing.value.push(gateway.id)
  
  try {
    if (gateway.running) {
      console.log('🚪 Stopping gateway:', gateway.name)
      await appStore.stopSRTGateway(gateway.id)
      console.log('✅ Gateway stopped successfully')
    } else {
      console.log('🚪 Starting gateway:', gateway.name)
      await appStore.startSRTGateway(gateway.id)
      console.log('✅ Gateway started successfully')
    }
    
    await loadGateways() // Refresh to get updated status
  } catch (err) {
    console.error(`❌ Error ${gateway.running ? 'stopping' : 'starting'} gateway:`, err)
    alert(`Failed to ${gateway.running ? 'stop' : 'start'} gateway: ${err.message}`)
  } finally {
    isProcessing.value = isProcessing.value.filter(id => id !== gateway.id)
  }
}

async function startGateway(id) {
  const gateway = gateways.value.find(g => g.id === id)
  if (gateway && !gateway.running) {
    await toggleGateway(gateway)
  }
}

async function stopGateway(id) {
  const gateway = gateways.value.find(g => g.id === id)
  if (gateway && gateway.running) {
    await toggleGateway(gateway)
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

function analyzeGateway(gateway) {
  console.log('🔍 Analyzing gateway:', gateway.name)
  
  // Show "Coming soon" popup
  alert('🚧 Gateway Analysis - Coming Soon!\n\nThis feature is currently under development and will be available in a future update.')
}

function createGateway() {
  console.log('🚪 Create new SRT gateway')
  editingGateway.value = null
  showCreateModal.value = true
}

function formatAddress(gateway) {
  // Display outgoing multicast address (localMCAddress:localMCPort)
  const mcAddress = gateway.localMCAddress
  const mcPort = gateway.localMCPort
  
  if (mcAddress && mcPort) {
    return `${mcAddress}:${mcPort}`
  }
  
  return '-'
}

function formatType(gateway) {
  // Map gatewayType to user-friendly names
  let displayType = gateway.gatewayType
  if (gateway.gatewayType === 'SRT_MC') {
    displayType = 'Incoming'
  } else if (gateway.gatewayType === 'MC_SRT') {
    displayType = 'Outgoing'
  }
  
  // Add SRT mode if available
  if (gateway.srtConfig?.srtMode) {
    return `${displayType} (${gateway.srtConfig.srtMode})`
  }
  return displayType
}

function formatIncomingSRTUrl(gateway) {
  // Format: srt://${localSRTListenAddress}:${foreignSRTPort}
  const listenAddress = gateway.localSRTListenAddress
  const port = gateway.foreignSRTPort
  
  if (listenAddress && port) {
    return `srt://${listenAddress}:${port}`
  }
  
  return '-'
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

// Selection methods
function toggleGatewaySelection(gatewayId) {
  const index = selectedGateways.value.indexOf(gatewayId)
  if (index > -1) {
    selectedGateways.value.splice(index, 1)
  } else {
    selectedGateways.value.push(gatewayId)
  }
}

function toggleAllSelection() {
  if (allSelected.value) {
    selectedGateways.value = []
  } else {
    selectedGateways.value = filteredGateways.value.map(gateway => gateway.id)
  }
}

// Bulk actions
async function startSelectedGateways() {
  const selected = gateways.value.filter(g => 
    selectedGateways.value.includes(g.id) && !g.running
  )
  
  if (selected.length === 0) {
    return
  }
  
  try {
    console.log(`🚪 Starting ${selected.length} selected gateways...`)
    
    await Promise.all(
      selected.map(gateway => appStore.startSRTGateway(gateway.id))
    )
    
    // Refresh the list
    await loadGateways()
    selectedGateways.value = []
    
    console.log(`✅ Started ${selected.length} gateways`)
  } catch (err) {
    console.error('❌ Error starting selected gateways:', err)
    alert(`Failed to start selected gateways: ${err.message}`)
  }
}

async function stopSelectedGateways() {
  const selected = gateways.value.filter(g => 
    selectedGateways.value.includes(g.id) && g.running
  )
  
  if (selected.length === 0) {
    return
  }
  
  try {
    console.log(`🚪 Stopping ${selected.length} selected gateways...`)
    
    await Promise.all(
      selected.map(gateway => appStore.stopSRTGateway(gateway.id))
    )
    
    // Refresh the list
    await loadGateways()
    selectedGateways.value = []
    
    console.log(`✅ Stopped ${selected.length} gateways`)
  } catch (err) {
    console.error('❌ Error stopping selected gateways:', err)
    alert(`Failed to stop selected gateways: ${err.message}`)
  }
}

async function deleteSelectedGateways() {
  if (selectedGateways.value.length === 0) {
    return
  }
  
  // Check if any selected gateways are running
  const runningSelected = gateways.value.filter(g => 
    selectedGateways.value.includes(g.id) && g.running
  )
  
  if (runningSelected.length > 0) {
    alert(`⚠️ Cannot delete running gateways.\n\n${runningSelected.length} selected gateway(s) are currently running. Please stop them first before deletion.`)
    return
  }
  
  const confirmed = confirm(`Are you sure you want to delete ${selectedGateways.value.length} gateway(s)?\n\nThis action cannot be undone.`)
  if (!confirmed) {
    return
  }
  
  try {
    console.log(`🗑️ Deleting ${selectedGateways.value.length} selected gateways...`)
    
    // Delete all selected gateways in parallel
    await Promise.all(
      selectedGateways.value.map(gatewayId => appStore.deleteSRTGateway(gatewayId))
    )
    
    console.log(`✅ Successfully deleted ${selectedGateways.value.length} gateways`)
    
    // Clear selection and refresh the list
    selectedGateways.value = []
    await loadGateways()
    
  } catch (err) {
    console.error('❌ Error deleting selected gateways:', err)
    alert(`Failed to delete selected gateways: ${err.message}`)
  }
}

// Search handling with debounce
let searchTimeout = null
function onSearchInput() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    // Search is reactive, no need to do anything here
    console.log('🔍 Search query:', searchQuery.value)
  }, 300)
}
</script>
