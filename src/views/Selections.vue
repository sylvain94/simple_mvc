<template>
  <div class="container mx-auto p-6">
    <!-- Header with stats and actions -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold">Selections Management</h2>
        <p class="text-base-content/70 mt-1" v-if="stats">
          {{ stats.total }} selections total • {{ stats.active }} active • {{ stats.enabled }} enabled
        </p>
      </div>
      <div class="flex gap-2">
        <button 
          @click="$router.push('/selections/create')"
          class="btn btn-secondary gap-2"
          :disabled="isLoading"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Selection
        </button>
        <button 
          @click="refreshSelections"
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
            placeholder="Search selections by name, description, multicast address..." 
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
    
    <!-- Selections Table -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="flex justify-between items-center mb-4">
          <h3 class="card-title">Transcoding Selections</h3>
          <div class="text-sm text-base-content/70">
            Last updated: {{ lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never' }}
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-if="isLoading && selections.length === 0" class="text-center py-8">
          <div class="loading loading-spinner loading-lg"></div>
          <p class="mt-4">Loading selections...</p>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ error }}</span>
          <button @click="refreshSelections" class="btn btn-sm">Retry</button>
        </div>
        
        <!-- Selections Table -->
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
                <th>Inputs</th>
                <th>Output</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <!-- No selections message -->
              <tr v-if="filteredSelections.length === 0 && !isLoading">
                <td colspan="6" class="text-center py-8">
                  <div class="text-base-content/50">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p class="font-medium">No selections found</p>
                    <p class="text-sm">{{ searchQuery ? 'Try adjusting your search criteria' : 'Add your first selection to get started' }}</p>
                  </div>
                </td>
              </tr>
              
              <!-- Selection rows -->
              <tr v-for="selection in filteredSelections" :key="selection.id" class="hover">
                <td>
                  <label>
                    <input 
                      type="checkbox" 
                      class="checkbox"
                      :checked="selectedSelections.includes(selection.id)"
                      @change="toggleSelectionSelection(selection.id)"
                    />
                  </label>
                </td>
                <td>
                  <div class="flex items-center gap-3">
                    <div class="avatar">
                      <div class="mask mask-squircle w-12 h-12">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <div class="font-bold">{{ selection.name }}</div>
                      <div class="text-sm opacity-50" v-if="selection.description">{{ selection.description }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <!-- Input Signals -->
                  <div class="space-y-1">
                    <div v-if="selection.inputSignals && selection.inputSignals.length > 0">
                      <div v-for="input in selection.inputSignals" :key="input.id" class="text-xs">
                        <div class="badge badge-sm badge-outline">
                          {{ input.multicastAddress }}:{{ input.multicastPort }}
                        </div>
                      </div>
                      <div class="text-xs opacity-50 mt-1">
                        {{ selection.currentInputSignalNumber }}/{{ selection.maxInputSignals }} inputs
                      </div>
                    </div>
                    <div v-else class="text-xs opacity-50">No inputs</div>
                    <button 
                      @click="openAddInputModal(selection)"
                      class="btn btn-xs btn-ghost"
                      :disabled="selection.running"
                      title="Add input"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </td>
                <td>
                  <!-- Output Signal -->
                  <div v-if="selection.outputSignals && selection.outputSignals.length > 0">
                    <div v-for="output in selection.outputSignals" :key="output.id" class="text-sm">
                      {{ output.multicastAddress }}:{{ output.multicastPort }}
                    </div>
                    <div class="text-xs opacity-50" v-if="selection.sourceAddress">Source: {{ selection.sourceAddress }}</div>
                  </div>
                  <div v-else class="text-sm opacity-50">No output</div>
                </td>
                <td>
                  <div class="badge" :class="selection.getStatusBadgeClass()">
                    {{ selection.status }}
                  </div>
                  <div class="text-xs opacity-50 mt-1" v-if="selection.auto_run">Auto-start</div>
                </td>
                <td>
                  <div class="flex gap-1">
                    <!-- Start/Stop button -->
                    <button 
                      @click="toggleSelection(selection)"
                      :class="selection.running ? 'btn-error' : 'btn-success'"
                      class="btn btn-xs"
                      :disabled="isProcessing.includes(selection.id)"
                    >
                      <span v-if="isProcessing.includes(selection.id)" class="loading loading-spinner loading-xs"></span>
                      <span v-else>{{ selection.running ? 'Stop' : 'Start' }}</span>
                    </button>
                    
                    <!-- Edit button -->
                    <button 
                      @click="editSelection(selection)"
                      class="btn btn-xs btn-primary"
                      :disabled="selection.running || isProcessing.includes(selection.id)"
                      :title="selection.running ? 'The selection must be stopped to be edited' : 'Edit this selection'"
                    >
                      Edit
                    </button>
                    
                    <!-- Delete button -->
                    <button 
                      @click="deleteSelection(selection)"
                      class="btn btn-xs btn-error"
                      :disabled="selection.running || isProcessing.includes(selection.id)"
                      :title="selection.running ? 'The selection must be stopped to be deleted' : 'Delete this selection'"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Bulk actions -->
        <div v-if="selectedSelections.length > 0" class="mt-4 p-4 bg-base-200 rounded-lg">
          <div class="flex justify-between items-center">
            <span class="text-sm font-medium">
              {{ selectedSelections.length }} selection(s) selected
            </span>
            <div class="flex gap-2">
              <button 
                @click="startSelectedSelections"
                class="btn btn-xs btn-success"
                :disabled="isProcessing.length > 0"
              >
                Start Selected
              </button>
              <button 
                @click="stopSelectedSelections"
                class="btn btn-xs btn-error"
                :disabled="isProcessing.length > 0"
              >
                Stop Selected
              </button>
              <button 
                @click="deleteSelectedSelections"
                class="btn btn-xs btn-error"
                :disabled="isProcessing.length > 0"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Add Input Modal -->
  <div v-if="showAddInputModal" class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">Add Multicast Input</h3>
      <p class="text-sm opacity-70 mb-4">Add a new multicast input to "{{ selectedSelection?.name }}"</p>
      
      <form @submit.prevent="addMulticastInput" class="space-y-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Multicast Address</span>
          </label>
          <input 
            type="text" 
            v-model="newInput.multicastAddress"
            placeholder="224.10.10.10"
            class="input input-bordered"
            pattern="^(22[4-9]|23[0-9])\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$"
            required
          />
          <label class="label">
            <span class="label-text-alt">Multicast address (224.0.0.0 - 239.255.255.255)</span>
          </label>
        </div>
        
        <div class="form-control">
          <label class="label">
            <span class="label-text">Multicast Port</span>
          </label>
          <input 
            type="number" 
            v-model="newInput.multicastPort"
            placeholder="2000"
            class="input input-bordered"
            min="1"
            max="65535"
            required
          />
        </div>
        
        <div class="form-control">
          <label class="label">
            <span class="label-text">Source Address</span>
          </label>
          <input 
            type="text" 
            v-model="newInput.sourceAddress"
            placeholder="192.168.100.141"
            class="input input-bordered"
            pattern="^([0-9]{1,3}\.){3}[0-9]{1,3}$"
            required
          />
          <label class="label">
            <span class="label-text-alt">Source IP address for the multicast stream</span>
          </label>
        </div>
        
        <div class="modal-action">
          <button type="button" @click="closeAddInputModal" class="btn">Cancel</button>
          <button type="submit" class="btn btn-primary" :disabled="addingInput">
            <span v-if="addingInput" class="loading loading-spinner loading-sm mr-2"></span>
            Add Input
          </button>
        </div>
      </form>
    </div>
    <div class="modal-backdrop" @click="closeAddInputModal"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { SelectionController } from '../controllers/index.js'

// Reactive data
const selections = ref([])
const selectedSelections = ref([])
const searchQuery = ref('')
const isLoading = ref(false)
const isProcessing = ref([])
const error = ref(null)
const lastUpdated = ref(null)
const stats = ref(null)

// Add Input Modal data
const showAddInputModal = ref(false)
const selectedSelection = ref(null)
const addingInput = ref(false)
const newInput = ref({
  multicastAddress: '',
  multicastPort: '',
  sourceAddress: ''
})

// Computed properties
const filteredSelections = computed(() => {
  if (!searchQuery.value) return selections.value
  
  const query = searchQuery.value.toLowerCase()
  return selections.value.filter(selection => 
    selection.name.toLowerCase().includes(query) ||
    (selection.description && selection.description.toLowerCase().includes(query)) ||
    (selection.multicastAddress && selection.multicastAddress.toLowerCase().includes(query))
  )
})

const allSelected = computed(() => {
  return filteredSelections.value.length > 0 && 
         selectedSelections.value.length === filteredSelections.value.length
})

// Methods
async function refreshSelections() {
  try {
    isLoading.value = true
    error.value = null
    
    console.log('🔄 Loading selections...')
    const selectionsData = await SelectionController.getAllSelections()
    
    selections.value = selectionsData
    stats.value = SelectionController.getSelectionStatistics(selectionsData)
    lastUpdated.value = new Date()
    
    console.log(`✅ Loaded ${selectionsData.length} selections`)
  } catch (err) {
    console.error('❌ Error loading selections:', err)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

function openCreateModal() {
  // TODO: Implement create selection modal
  console.log('🔄 Create selection - Coming soon')
  alert('Create selection functionality will be implemented soon.')
}

function onSearchInput() {
  // Search is reactive through computed property
  console.log('🔍 Search query:', searchQuery.value)
}

function toggleAllSelection() {
  if (allSelected.value) {
    selectedSelections.value = []
  } else {
    selectedSelections.value = filteredSelections.value.map(s => s.id)
  }
}

function toggleSelectionSelection(selectionId) {
  const index = selectedSelections.value.indexOf(selectionId)
  if (index > -1) {
    selectedSelections.value.splice(index, 1)
  } else {
    selectedSelections.value.push(selectionId)
  }
}

async function toggleSelection(selection) {
  try {
    isProcessing.value.push(selection.id)
    
    if (selection.running) {
      console.log('⏹️ Stopping selection:', selection.name)
      await SelectionController.stopSelection(selection.id)
      selection.running = false
    } else {
      console.log('▶️ Starting selection:', selection.name)
      await SelectionController.startSelection(selection.id)
      selection.running = true
    }
    
    console.log('✅ Selection toggled successfully')
  } catch (err) {
    console.error('❌ Error toggling selection:', err)
    alert(`Error ${selection.running ? 'stopping' : 'starting'} selection: ${err.message}`)
  } finally {
    const index = isProcessing.value.indexOf(selection.id)
    if (index > -1) {
      isProcessing.value.splice(index, 1)
    }
  }
}

function editSelection(selection) {
  // TODO: Implement edit selection modal
  console.log('✏️ Edit selection:', selection.name)
  alert(`Edit selection "${selection.name}" - Coming soon`)
}

async function deleteSelection(selection) {
  if (!confirm(`Are you sure you want to delete "${selection.name}"?`)) {
    return
  }
  
  try {
    isProcessing.value.push(selection.id)
    
    console.log('🗑️ Deleting selection:', selection.name)
    await SelectionController.deleteSelection(selection.id)
    
    // Remove from local array
    const index = selections.value.findIndex(s => s.id === selection.id)
    if (index > -1) {
      selections.value.splice(index, 1)
    }
    
    // Update stats
    stats.value = SelectionController.getSelectionStatistics(selections.value)
    
    console.log('✅ Selection deleted successfully')
  } catch (err) {
    console.error('❌ Error deleting selection:', err)
    alert(`Error deleting selection: ${err.message}`)
  } finally {
    const index = isProcessing.value.indexOf(selection.id)
    if (index > -1) {
      isProcessing.value.splice(index, 1)
    }
  }
}

async function startSelectedSelections() {
  if (selectedSelections.value.length === 0) return
  
  try {
    console.log('▶️ Starting selected selections...')
    
    for (const selectionId of selectedSelections.value) {
      const selection = selections.value.find(s => s.id === selectionId)
      if (selection && !selection.running) {
        await SelectionController.startSelection(selectionId)
        selection.running = true
      }
    }
    
    selectedSelections.value = []
    console.log('✅ Selected selections started successfully')
  } catch (err) {
    console.error('❌ Error starting selections:', err)
    alert(`Error starting selections: ${err.message}`)
  }
}

async function stopSelectedSelections() {
  if (selectedSelections.value.length === 0) return
  
  try {
    console.log('⏹️ Stopping selected selections...')
    
    for (const selectionId of selectedSelections.value) {
      const selection = selections.value.find(s => s.id === selectionId)
      if (selection && selection.running) {
        await SelectionController.stopSelection(selectionId)
        selection.running = false
      }
    }
    
    selectedSelections.value = []
    console.log('✅ Selected selections stopped successfully')
  } catch (err) {
    console.error('❌ Error stopping selections:', err)
    alert(`Error stopping selections: ${err.message}`)
  }
}

async function deleteSelectedSelections() {
  if (selectedSelections.value.length === 0) return
  
  if (!confirm(`Are you sure you want to delete ${selectedSelections.value.length} selection(s)?`)) {
    return
  }
  
  try {
    console.log('🗑️ Deleting selected selections...')
    
    for (const selectionId of selectedSelections.value) {
      await SelectionController.deleteSelection(selectionId)
      
      // Remove from local array
      const index = selections.value.findIndex(s => s.id === selectionId)
      if (index > -1) {
        selections.value.splice(index, 1)
      }
    }
    
    selectedSelections.value = []
    stats.value = SelectionController.getSelectionStatistics(selections.value)
    
    console.log('✅ Selected selections deleted successfully')
  } catch (err) {
    console.error('❌ Error deleting selections:', err)
    alert(`Error deleting selections: ${err.message}`)
  }
}

// Add Input Modal functions
function openAddInputModal(selection) {
  selectedSelection.value = selection
  newInput.value = {
    multicastAddress: '',
    multicastPort: '',
    sourceAddress: ''
  }
  showAddInputModal.value = true
}

function closeAddInputModal() {
  showAddInputModal.value = false
  selectedSelection.value = null
  newInput.value = {
    multicastAddress: '',
    multicastPort: '',
    sourceAddress: ''
  }
}

async function addMulticastInput() {
  if (!selectedSelection.value) return
  
  try {
    addingInput.value = true
    
    console.log('➕ Adding multicast input to selection:', selectedSelection.value.name)
    await SelectionController.addMulticastInput(
      selectedSelection.value.id,
      newInput.value.multicastAddress,
      newInput.value.multicastPort,
      newInput.value.sourceAddress
    )
    
    // Refresh selections to get updated data
    await refreshSelections()
    
    closeAddInputModal()
    
    console.log('✅ Multicast input added successfully')
  } catch (err) {
    console.error('❌ Error adding multicast input:', err)
    alert(`Error adding multicast input: ${err.message}`)
  } finally {
    addingInput.value = false
  }
}

// Lifecycle
onMounted(() => {
  console.log('📋 Selections view mounted')
  refreshSelections()
})
</script>

