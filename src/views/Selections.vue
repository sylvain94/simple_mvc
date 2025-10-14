<template>
  <div class="container mx-auto p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-base-content mb-2">Selections</h1>
        <p class="text-base-content/70">Manage selection functions and multicast routing</p>
      </div>
      <button 
        @click="createSelection" 
        class="btn btn-primary"
        :disabled="isProcessing"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Selection
      </button>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="stat bg-base-100 shadow-lg rounded-lg">
        <div class="stat-figure text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div class="stat-title">Total Selections</div>
        <div class="stat-value text-primary">{{ stats.total }}</div>
        <div class="stat-desc">{{ lastUpdated }}</div>
      </div>

      <div class="stat bg-base-100 shadow-lg rounded-lg">
        <div class="stat-figure text-success">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="stat-title">Running</div>
        <div class="stat-value text-success">{{ stats.running }}</div>
        <div class="stat-desc">Active selections</div>
      </div>

      <div class="stat bg-base-100 shadow-lg rounded-lg">
        <div class="stat-figure text-info">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div class="stat-title">Enabled</div>
        <div class="stat-value text-info">{{ stats.enabled }}</div>
        <div class="stat-desc">Ready to start</div>
      </div>

      <div class="stat bg-base-100 shadow-lg rounded-lg">
        <div class="stat-figure text-warning">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div class="stat-title">Inactive</div>
        <div class="stat-value text-warning">{{ stats.inactive }}</div>
        <div class="stat-desc">Need attention</div>
      </div>
    </div>

    <!-- Search and Actions -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <div class="flex-1">
        <div class="form-control">
          <div class="input-group">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search selections..." 
              class="input input-bordered flex-1"
              @input="onSearchInput"
            />
            <button class="btn btn-square">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div class="flex gap-2">
        <button 
          @click="loadSelections" 
          class="btn btn-outline"
          :class="{ 'loading': isProcessing }"
          :disabled="isProcessing"
        >
          <svg v-if="!isProcessing" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
    </div>

    <!-- Selections Table -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body p-0">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <span class="loading loading-spinner loading-lg"></span>
          <span class="ml-3">Loading selections...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="alert alert-error m-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 class="font-bold">Error loading selections</h3>
            <div class="text-xs">{{ error }}</div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredSelections.length === 0" class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No selections found</h3>
          <p class="text-gray-500 mb-4">Get started by creating your first selection.</p>
          <button @click="createSelection" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Selection
          </button>
        </div>

        <!-- Selections Table -->
        <div v-else class="overflow-x-auto">
          <table class="table table-zebra w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Multicast Address</th>
                <th>Port</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="selection in filteredSelections" :key="selection.id">
                <td>
                  <div class="font-bold">{{ selection.name }}</div>
                  <div class="text-sm opacity-50">{{ selection.functionType }}</div>
                </td>
                <td>
                  <div class="max-w-xs truncate">{{ selection.description || 'No description' }}</div>
                </td>
                <td>
                  <div class="font-mono">{{ selection.multicastAddress || '-' }}</div>
                  <div v-if="selection.sourceAddress" class="text-sm opacity-50">
                    Source: {{ selection.sourceAddress }}
                  </div>
                </td>
                <td>
                  <span class="badge badge-outline">{{ selection.multicastPort || '-' }}</span>
                </td>
                <td>
                  <span 
                    class="badge"
                    :class="selection.getStatusBadgeClass()"
                  >
                    {{ selection.getStatus() }}
                  </span>
                </td>
                <td>
                  <div class="flex gap-2">
                    <button 
                      @click="viewSelection(selection)"
                      class="btn btn-ghost btn-sm"
                      title="View details"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button 
                      @click="deleteSelection(selection)"
                      class="btn btn-ghost btn-sm text-error"
                      :disabled="isProcessing"
                      title="Delete selection"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { SelectionController } from '../controllers/SelectionController.js'

// Reactive data
const selections = ref([])
const searchQuery = ref('')
const isLoading = ref(false)
const isProcessing = ref(false)
const error = ref(null)
const lastUpdated = ref('')

// Statistics
const stats = reactive({
  total: 0,
  running: 0,
  enabled: 0,
  active: 0,
  inactive: 0
})

// Computed properties
const filteredSelections = computed(() => {
  if (!searchQuery.value) return selections.value
  
  const query = searchQuery.value.toLowerCase()
  return selections.value.filter(selection => 
    selection.name.toLowerCase().includes(query) ||
    selection.description.toLowerCase().includes(query) ||
    selection.multicastAddress.toLowerCase().includes(query)
  )
})

// Methods
async function loadSelections() {
  try {
    isLoading.value = true
    error.value = null
    
    console.log('🔄 Loading selections...')
    const selectionsData = await SelectionController.getAllSelections()
    
    selections.value = selectionsData
    
    // Update statistics
    const selectionStats = SelectionController.getSelectionStatistics(selectionsData)
    Object.assign(stats, selectionStats)
    
    lastUpdated.value = `Updated ${new Date().toLocaleTimeString()}`
    
    console.log(`✅ Loaded ${selectionsData.length} selections`)
  } catch (err) {
    console.error('❌ Error loading selections:', err)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

function createSelection() {
  // TODO: Implement create selection modal
  console.log('🔄 Create selection - Coming soon')
  alert('Create selection functionality will be implemented soon.')
}

function viewSelection(selection) {
  // TODO: Implement view selection modal
  console.log('👁️ View selection:', selection.name)
  alert(`View selection "${selection.name}" - Coming soon`)
}

async function deleteSelection(selection) {
  if (!confirm(`Are you sure you want to delete "${selection.name}"?`)) {
    return
  }
  
  try {
    isProcessing.value = true
    
    console.log('🗑️ Deleting selection:', selection.name)
    await SelectionController.deleteSelection(selection.id)
    
    // Reload selections
    await loadSelections()
    
    console.log('✅ Selection deleted successfully')
  } catch (err) {
    console.error('❌ Error deleting selection:', err)
    alert(`Error deleting selection: ${err.message}`)
  } finally {
    isProcessing.value = false
  }
}

function onSearchInput() {
  // Search is reactive through computed property
  console.log('🔍 Search query:', searchQuery.value)
}

// Lifecycle
onMounted(() => {
  console.log('📋 Selections view mounted')
  loadSelections()
})
</script>

<style scoped>
/* Custom styles for selections view */
.stat {
  padding: 1.5rem;
}

.table th {
  background-color: hsl(var(--b2));
  position: sticky;
  top: 0;
  z-index: 10;
}

.badge {
  font-size: 0.75rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .grid-cols-1.md\\:grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
