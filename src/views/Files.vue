<template>
  <div class="container mx-auto p-6">
    <!-- Header with stats and actions -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold">Files Management</h2>
        <p class="text-base-content/70 mt-1" v-if="stats">
          {{ stats.total }} files total • {{ stats.active }} active • {{ stats.enabled }} enabled
        </p>
      </div>
      <div class="flex gap-2">
        <button 
          @click="openCreateModal"
          class="btn btn-secondary gap-2"
          :disabled="isLoading"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add File
        </button>
        <button 
          @click="refreshFiles"
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
            placeholder="Search files by name, path, multicast IP, or command..." 
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
    
    <!-- Input Files Table -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="flex justify-between items-center mb-4">
          <h3 class="card-title">Input Files</h3>
          <div class="text-sm text-base-content/70">
            Last updated: {{ lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never' }}
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-if="isLoading && inputFiles.length === 0" class="text-center py-8">
          <div class="loading loading-spinner loading-lg"></div>
          <p class="mt-4">Loading input files...</p>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ error }}</span>
          <button @click="refreshFiles" class="btn btn-sm">Retry</button>
        </div>
        
        <!-- Files Table -->
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
                <th>Path</th>
                <th>Status</th>
                <th>Multicast</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <!-- No files message -->
              <tr v-if="filteredFiles.length === 0 && !isLoading">
                <td colspan="6" class="text-center py-8">
                  <div class="text-base-content/50">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p class="font-medium">No input files found</p>
                    <p class="text-sm">{{ searchQuery ? 'Try adjusting your search criteria' : 'Add your first input file to get started' }}</p>
                  </div>
                </td>
              </tr>
              
              <!-- File rows -->
              <tr v-for="file in filteredFiles" :key="file.id" class="hover">
                <td>
                  <label>
                    <input 
                      type="checkbox" 
                      class="checkbox"
                      :checked="selectedFiles.includes(file.id)"
                      @change="toggleFileSelection(file.id)"
                    />
                  </label>
                </td>
                <td>
                  <div class="flex items-center gap-3">
                    <div class="avatar">
                      <div class="mask mask-squircle w-12 h-12">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <div class="font-bold">{{ file.name }}</div>
                      <div class="text-sm opacity-50" v-if="file.description">{{ file.description }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="text-sm">{{ file.fullPath }}</div>
                  <div class="text-xs opacity-50" v-if="file.inputType">Type: {{ file.inputType }}</div>
                </td>
                <td>
                  <div class="badge" :class="file.getStatusBadgeClass()">
                    {{ file.status }}
                  </div>
                  <div class="text-xs opacity-50 mt-1" v-if="file.auto_run">Auto-start</div>
                </td>
                <td>
                  <div class="text-sm">{{ file.multicastAddressFormatted }}</div>
                  <div class="text-xs opacity-50" v-if="file.packetSize">Packet: {{ file.packetSize }}</div>
                </td>
                <td>
                  <div class="flex gap-1">
                    <!-- Start/Stop button -->
                    <button 
                      @click="toggleFile(file)"
                      :class="file.running ? 'btn-error' : 'btn-success'"
                      class="btn btn-xs"
                      :disabled="isProcessing.includes(file.id)"
                    >
                      <span v-if="isProcessing.includes(file.id)" class="loading loading-spinner loading-xs"></span>
                      <span v-else>{{ file.running ? 'Stop' : 'Start' }}</span>
                    </button>
                    
                    <!-- Edit button -->
                    <button 
                      @click="editFile(file)"
                      class="btn btn-xs btn-primary"
                      :disabled="file.running || isProcessing.includes(file.id)"
                      :title="file.running ? 'The file must be stopped to be edited' : 'Edit this file'"
                    >
                      Edit
                    </button>
                    
                    <!-- Analyze button -->
                    <button 
                      @click="analyzeFile(file)"
                      class="btn btn-xs btn-info"
                      :disabled="!file.running || isProcessing.includes(file.id)"
                      :title="!file.running ? 'The file must be running to be analyzed' : 'Analyze this file'"
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
        <div v-if="selectedFiles.length > 0" class="mt-4 p-4 bg-base-200 rounded-lg">
          <div class="flex justify-between items-center">
            <span class="text-sm font-medium">{{ selectedFiles.length }} file(s) selected</span>
            <div class="flex gap-2">
              <button @click="startSelectedFiles" class="btn btn-xs btn-success">Start Selected</button>
              <button @click="stopSelectedFiles" class="btn btn-xs btn-error">Stop Selected</button>
              <button @click="deleteSelectedFiles" class="btn btn-xs btn-error">Delete Selected</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit/Create Modal -->
    <div v-if="showEditModal" class="modal modal-open">
      <div class="modal-box max-w-4xl">
        <h3 class="font-bold text-lg mb-4">
          {{ isCreatingFile ? 'Create New File' : 'Edit File' }}
        </h3>
        
        <form @submit.prevent="saveFile" class="space-y-4">
          <!-- File Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Name -->
            <div class="form-control">
              <label class="block text-sm font-medium mb-2">Name *</label>
              <input 
                v-model="editingFile.name"
                type="text" 
                class="input input-bordered w-full" 
                placeholder="File name"
                required
              />
            </div>

            <!-- Description -->
            <div class="form-control">
              <label class="block text-sm font-medium mb-2">Description</label>
              <input 
                v-model="editingFile.description"
                type="text" 
                class="input input-bordered w-full" 
                placeholder="Optional description"
              />
            </div>
          </div>

          <!-- File Path Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- File Path -->
            <div class="form-control">
              <label class="block text-sm font-medium mb-2">File Path *</label>
              <input 
                v-model="editingFile.filePath"
                type="text" 
                class="input input-bordered w-full" 
                placeholder="/path/to/file/"
                required
              />
            </div>

            <!-- File Name -->
            <div class="form-control">
              <label class="block text-sm font-medium mb-2">File Name *</label>
              <input 
                v-model="editingFile.fileName"
                type="text" 
                class="input input-bordered w-full" 
                placeholder="video.ts"
                required
              />
            </div>
          </div>

          <!-- Network Configuration -->
          <div class="divider">Network Configuration</div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Multicast Address -->
            <div class="form-control">
              <label class="block text-sm font-medium mb-2">Multicast Address</label>
              <input 
                v-model="editingFile.multicastAddress"
                type="text" 
                class="input input-bordered w-full" 
                placeholder="239.0.0.1"
              />
            </div>

            <!-- Multicast Port -->
            <div class="form-control">
              <label class="block text-sm font-medium mb-2">Multicast Port</label>
              <input 
                v-model="editingFile.multicastPort"
                type="number" 
                class="input input-bordered w-full" 
                placeholder="5000"
                min="1"
                max="65535"
              />
            </div>

            <!-- Source Address -->
            <div class="form-control">
              <label class="block text-sm font-medium mb-2">Source Address</label>
              <input 
                v-model="editingFile.sourceAddress"
                type="text" 
                class="input input-bordered w-full" 
                placeholder="192.168.1.100"
              />
            </div>
          </div>

          <!-- Advanced Settings -->
          <div class="divider">Advanced Settings</div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Packet Size -->
            <div class="form-control">
              <label class="block text-sm font-medium mb-2">Packet Size</label>
              <input 
                v-model="editingFile.packetSize"
                type="number" 
                class="input input-bordered w-full" 
                placeholder="1316"
                min="188"
                max="65507"
              />
            </div>
          </div>
          <!-- Checkboxes -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div class="form-control">
              <label class="flex items-center gap-2 cursor-pointer">
                <input 
                  v-model="editingFile.enabled"
                  type="checkbox" 
                  class="checkbox checkbox-primary" 
                />
                <span class="text-sm font-medium">Enabled</span>
              </label>
            </div>

            <div class="form-control">
              <label class="flex items-center gap-2 cursor-pointer">
                <input 
                  v-model="editingFile.autoRun"
                  type="checkbox" 
                  class="checkbox checkbox-primary" 
                />
                <span class="text-sm font-medium">Auto Run</span>
              </label>
            </div>
  
            <div class="form-control">
              <label class="flex items-center gap-2 cursor-pointer">
                <input 
                  v-model="editingFile.persistent"
                  type="checkbox" 
                  class="checkbox checkbox-primary" 
                />
                <span class="text-sm font-medium">Persistent</span>
              </label>
            </div>
          </div>

          <!-- Modal Actions -->
          <div class="modal-action">
            <button type="button" @click="closeEditModal" class="btn">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              {{ isCreatingFile ? 'Create File' : 'Update File' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Analyze Modal -->
    <AnalyzeModal
      :is-visible="showAnalyzeModal"
      :input-file="analyzingFile"
      @close="closeAnalyzeModal"
      @analysis-complete="onAnalysisComplete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { InputFileController } from '../controllers/InputFileController.js'
import { AnalyzeController } from '../controllers/AnalyzeController.js'
import AnalyzeModal from '../components/AnalyzeModal.vue'

// Reactive data
const inputFiles = ref([])
const isLoading = ref(false)
const error = ref(null)
const lastUpdated = ref(null)
const searchQuery = ref('')
const selectedFiles = ref([])
const isProcessing = ref([])
const stats = ref(null)

// Modal state
const showEditModal = ref(false)
const isCreatingFile = ref(false)
const showAnalyzeModal = ref(false)
const analyzingFile = ref(null)
const editingFile = ref({
  id: null,
  name: '',
  description: '',
  filePath: '',
  fileName: '',
  multicastAddress: '',
  multicastPort: '',
  sourceAddress: '',
  packetSize: 1316,
  enabled: true,
  persistent: true
})

// Computed properties
const filteredFiles = computed(() => {
  if (!searchQuery.value.trim()) {
    return inputFiles.value
  }
  
  const query = searchQuery.value.toLowerCase().trim()
  return inputFiles.value.filter(file => 
    file.name.toLowerCase().includes(query) ||
    file.fullPath.toLowerCase().includes(query) ||
    (file.description && file.description.toLowerCase().includes(query)) ||
    file.multicastAddress.includes(query) ||
    file.sourceAddress.includes(query) ||
    file.command.toLowerCase().includes(query)
  )
})

const allSelected = computed(() => {
  return filteredFiles.value.length > 0 && 
         filteredFiles.value.every(file => selectedFiles.value.includes(file.id))
})

// Methods
async function refreshFiles() {
  isLoading.value = true
  error.value = null
  
  try {
    
    // Load files and statistics in parallel
    const [files, fileStats] = await Promise.all([
      InputFileController.getAllInputFiles(),
      InputFileController.getInputFileStats()
    ])
    
    inputFiles.value = files
    stats.value = fileStats
    lastUpdated.value = new Date()
    
    
  } catch (err) {
    console.error('❌ Error loading input files:', err)
    error.value = err.message || 'Failed to load input files'
  } finally {
    isLoading.value = false
  }
}

async function toggleFile(file) {
  const fileId = file.id
  const action = file.running ? 'stop' : 'start'
  
  if (isProcessing.value.includes(fileId)) {
    return
  }
  
  isProcessing.value.push(fileId)
  
  try {
    
    let response
    if (action === 'start') {
      response = await InputFileController.startInputFile(fileId)
    } else {
      response = await InputFileController.stopInputFile(fileId)
    }
    
    // Update the file locally
    const fileIndex = inputFiles.value.findIndex(f => f.id === fileId)
    if (fileIndex !== -1) {
      inputFiles.value[fileIndex].running = !inputFiles.value[fileIndex].running
      
      // Optional: refresh completely to ensure synchronization
      // setTimeout(() => refreshFiles(), 1000)
    }
    
    // Update statistics
    await updateStats()
       
  } catch (err) {
    console.error(`❌ Error ${action}ing file ${file.name}:`, err)
    error.value = `Failed to ${action} file "${file.name}": ${err.message}`
    
    // Clear the error after 5 seconds
    setTimeout(() => {
      if (error.value && error.value.includes(file.name)) {
        error.value = null
      }
    }, 5000)
  } finally {
    isProcessing.value = isProcessing.value.filter(id => id !== fileId)
  }
}


function editFile(file) {
  console.log('✏️ Editing file:', file.name)
  
  // Copy file data to editing form
  editingFile.value = {
    id: file.id,
    name: file.name || '',
    description: file.description || '',
    filePath: file.filePath || '',
    fileName: file.fileName || '',
    multicastAddress: file.multicastAddress || '',
    multicastPort: file.multicastPort || '',
    sourceAddress: file.sourceAddress || '',
    packetSize: file.packetSize || 1316,
    enabled: file.enabled !== undefined ? file.enabled : true,
    persistent: file.persistent !== undefined ? file.persistent : true
  }
  
  isCreatingFile.value = false
  showEditModal.value = true
}

function openCreateModal() {
  console.log('➕ Opening create file modal')
  
  // Reset form for new file
  editingFile.value = {
    id: null,
    name: '',
    description: '',
    filePath: '',
    fileName: '',
    multicastAddress: '',
    multicastPort: '',
    sourceAddress: '',
    packetSize: 1316,
    enabled: true,
    persistent: true
  }
  
  isCreatingFile.value = true
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  isCreatingFile.value = false
  editingFile.value = {
    id: null,
    name: '',
    description: '',
    filePath: '',
    fileName: '',
    multicastAddress: '',
    multicastPort: '',
    sourceAddress: '',
    packetSize: 1316,
    enabled: true,
    persistent: true
  }
}

// Analysis methods
function analyzeFile(file) {
  console.log('🔍 Analyzing file:', file.name)
  
  if (!AnalyzeController.validateInputFileForAnalysis(file)) {
    error.value = 'This file cannot be analyzed in its current state'
    return
  }
  
  analyzingFile.value = file
  showAnalyzeModal.value = true
}

function closeAnalyzeModal() {
  showAnalyzeModal.value = false
  analyzingFile.value = null
}

function onAnalysisComplete(result) {
  console.log('✅ Analysis completed for file:', analyzingFile.value?.name, result)
  // Optionally refresh files to update status
  // refreshFiles()
}

async function saveFile() {
  try {
    console.log('💾 Saving file:', editingFile.value.name)
    console.log('📝 Form data being saved:', {
      id: editingFile.value.id,
      name: editingFile.value.name,
      description: editingFile.value.description,
      filePath: editingFile.value.filePath,
      fileName: editingFile.value.fileName,
      multicastAddress: editingFile.value.multicastAddress,
      multicastPort: editingFile.value.multicastPort,
      sourceAddress: editingFile.value.sourceAddress
    })
    
    if (isCreatingFile.value) {
      // Create new file
      await InputFileController.createInputFile(editingFile.value)
      console.log('✅ File created successfully')
    } else {
      // Update existing file
      await InputFileController.updateInputFile(editingFile.value.id, editingFile.value)
      console.log('✅ File updated successfully')
    }
    
    // Refresh the files list
    await refreshFiles()
    
    // Close modal
    closeEditModal()
    
  } catch (err) {
    console.error('❌ Error saving file:', err)
    error.value = `Failed to save file: ${err.message}`
  }
}

// Selection methods
function toggleFileSelection(fileId) {
  const index = selectedFiles.value.indexOf(fileId)
  if (index > -1) {
    selectedFiles.value.splice(index, 1)
  } else {
    selectedFiles.value.push(fileId)
  }
}

function toggleAllSelection() {
  if (allSelected.value) {
    selectedFiles.value = []
  } else {
    selectedFiles.value = filteredFiles.value.map(file => file.id)
  }
}

// Bulk actions
async function startSelectedFiles() {
  const selected = inputFiles.value.filter(f => 
    selectedFiles.value.includes(f.id) && !f.running
  )
  
  if (selected.length === 0) {
    return
  }
  
  try {
    
    await Promise.all(
      selected.map(file => InputFileController.startInputFile(file.id))
    )
    
    // Refresh the list
    await refreshFiles()
    selectedFiles.value = []
    
  } catch (err) {
    console.error('❌ Error starting selected files:', err)
    error.value = `Failed to start selected files: ${err.message}`
  }
}

async function stopSelectedFiles() {
  const selected = inputFiles.value.filter(f => 
    selectedFiles.value.includes(f.id) && f.running
  )
  
  if (selected.length === 0) {
    return
  }
  
  try {
    
    await Promise.all(
      selected.map(file => InputFileController.stopInputFile(file.id))
    )
    
    // Refresh the list
    await refreshFiles()
    selectedFiles.value = []
    
  } catch (err) {
    console.error('❌ Error stopping selected files:', err)
    error.value = `Failed to stop selected files: ${err.message}`
  }
}

async function deleteSelectedFiles() {
  if (selectedFiles.value.length === 0) {
    return
  }
  
  const confirmed = confirm(`Are you sure you want to delete ${selectedFiles.value.length} file(s)?`)
  if (!confirmed) {
    return
  }
  
  try {
    
    await Promise.all(
      selectedFiles.value.map(fileId => InputFileController.deleteInputFile(fileId))
    )
    
    // Refresh the list
    await refreshFiles()
    selectedFiles.value = []
    
  } catch (err) {
    console.error('❌ Error deleting selected files:', err)
    error.value = `Failed to delete selected files: ${err.message}`
  }
}

// Search handling with debounce
let searchTimeout = null
function onSearchInput() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
  }, 300)
}

// Update statistics
async function updateStats() {
  try {
    stats.value = await InputFileController.getInputFileStats()
  } catch (err) {
    console.warn('⚠️ Failed to update stats:', err)
  }
}

// Lifecycle
onMounted(() => {
  refreshFiles()
})

// Watch for route changes to refresh data
watch(() => inputFiles.value.length, (newLength) => {
})
</script>
