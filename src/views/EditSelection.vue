<template>
  <div class="container mx-auto p-6">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-6">
      <button 
        @click="$router.go(-1)"
        class="btn btn-ghost btn-circle"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <div>
        <h2 class="text-2xl font-bold">Edit Selection</h2>
        <p class="text-base-content/70 mt-1">Modify selection function configuration</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <span class="loading loading-spinner loading-lg"></span>
      <span class="ml-3">Loading selection...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-error mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ error }}</span>
    </div>

    <!-- Edit Form -->
    <div v-else-if="selection" class="card bg-base-100 shadow-xl max-h-[80vh] flex flex-col">
      <div class="card-body flex-1 overflow-hidden">
        <!-- Tabs Navigation -->
        <div class="tabs tabs-bordered mb-6">
          <button 
            @click="activeTab = 'configuration'"
            :class="['tab tab-lg', { 'tab-active': activeTab === 'configuration' }]"
          >
            Configuration
          </button>
          <button 
            @click="activeTab = 'inputs'"
            :class="['tab tab-lg', { 'tab-active': activeTab === 'inputs' }]"
          >
            Input Signals
          </button>
        </div>
          
        <!-- Configuration Tab -->
        <form v-if="activeTab === 'configuration'" @submit.prevent="updateSelection" class="flex flex-col h-full">
          <!-- Scrollable Content Area -->
          <div class="flex-1 overflow-y-auto pr-2 space-y-6 max-h-[500px] scrollbar-thin scrollbar-thumb-primary scrollbar-track-base-200">
          <!-- General Information -->
          <div class="space-y-4">
            <h3 class="font-bold text-lg text-base-content border-b border-base-300 pb-2">General Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium w-40">Name *</span>
                </label>
                <input 
                  type="text" 
                  v-model="form.name"
                  class="input input-bordered w-full"
                  :class="{ 'input-error': !form.name }"
                  required
                  placeholder="Selection name"
                />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium w-40">Description</span>
                </label>
                <input 
                  type="text" 
                  v-model="form.description"
                  class="input input-bordered w-full"
                  placeholder="Selection description"
                />
              </div>
            </div>
          </div>

          <!-- Protocol Configuration -->
          <div class="space-y-4">
            <h3 class="font-bold text-lg text-base-content border-b border-base-300 pb-2">Protocol Configuration</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium w-40">Output Protocol</span>
                </label>
                <select v-model="form.outputProtocol" class="select select-bordered w-full">
                  <option value="udp">UDP</option>
                  <option value="tcp">TCP</option>
                  <option value="http">HTTP</option>
                  <option value="https">HTTPS</option>
                </select>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium w-40">Input Analyze Format</span>
                </label>
                <select v-model="form.inputAnalyzeFormat" class="select select-bordered w-full">
                  <option value="JSON">JSON</option>
                  <option value="XML">XML</option>
                  <option value="TEXT">TEXT</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Control Configuration -->
          <div class="space-y-4">
            <h3 class="font-bold text-lg text-base-content border-b border-base-300 pb-2">Control Configuration</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium w-40">Control IP Address</span>
                </label>
                <input 
                  type="text" 
                  v-model="form.controlIPAddress"
                  class="input input-bordered w-full"
                  placeholder="192.168.1.141"
                  pattern="^([0-9]{1,3}\.){3}[0-9]{1,3}$"
                />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium w-40">Control Port</span>
                </label>
                <input 
                  type="number" 
                  v-model.number="form.controlPort"
                  class="input input-bordered w-full"
                  placeholder="445"
                  min="1"
                  max="65535"
                />
              </div>
            </div>
          </div>

          <!-- Signal Configuration -->
          <div class="space-y-4">
            <h3 class="font-bold text-lg text-base-content border-b border-base-300 pb-2">Signal Configuration</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium w-40">Max Input Signals</span>
                </label>
                <input 
                  type="number" 
                  v-model.number="form.maxInputSignals"
                  class="input input-bordered w-full"
                  placeholder="10"
                  min="1"
                  max="100"
                />
              </div>
              <div></div> <!-- Empty div for grid alignment -->
            </div>
          </div>

          <!-- Service Configuration -->
          <div class="space-y-4">
            <h3 class="font-bold text-lg text-base-content border-b border-base-300 pb-2">Service Configuration</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium w-40">Technical Service ID</span>
                </label>
                <input 
                  type="text" 
                  v-model="form.technicalServiceID"
                  class="input input-bordered w-full"
                  placeholder="Service ID"
                />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium w-40">Technical Service Name</span>
                </label>
                <input 
                  type="text" 
                  v-model="form.technicalServiceName"
                  class="input input-bordered w-full"
                  placeholder="Service name"
                />
              </div>
            </div>
          </div>

          <!-- Resource Configuration -->
          <div class="space-y-4">
            <h3 class="font-bold text-lg text-base-content border-b border-base-300 pb-2">Resource Configuration</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium w-40">External ID</span>
                </label>
                <input 
                  type="text" 
                  v-model="form.externalID"
                  class="input input-bordered w-full"
                  placeholder="External ID"
                />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium w-40">Consumed Resource ID</span>
                </label>
                <input 
                  type="text" 
                  v-model="form.consumedResourceId"
                  class="input input-bordered w-full"
                  placeholder="Resource ID"
                />
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium w-40">Topology ID</span>
                </label>
                <input 
                  type="text" 
                  v-model="form.topologyID"
                  class="input input-bordered w-full"
                  placeholder="Topology ID"
                />
              </div>
              <div></div> <!-- Empty div for grid alignment -->
            </div>
          </div>

          <!-- Options -->
          <div class="space-y-4">
            <h3 class="font-bold text-lg text-base-content border-b border-base-300 pb-2">Options</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              <div class="form-control">
                <label class="label cursor-pointer justify-start gap-1.5">
                  <input type="checkbox" v-model="form.active" class="checkbox checkbox-primary" />
                  <span class="label-text font-medium">Active</span>
                </label>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer justify-start gap-1.5">
                  <input type="checkbox" v-model="form.enabled" class="checkbox checkbox-primary" />
                  <span class="label-text font-medium">Enabled</span>
                </label>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer justify-start gap-1.5">
                  <input type="checkbox" v-model="form.running" class="checkbox checkbox-primary" />
                  <span class="label-text font-medium">Running</span>
                </label>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer justify-start gap-1.5">
                  <input type="checkbox" v-model="form.auto_run" class="checkbox checkbox-primary" />
                  <span class="label-text font-medium">Auto Run</span>
                </label>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer justify-start gap-1.5">
                  <input type="checkbox" v-model="form.persistent" class="checkbox checkbox-primary" />
                  <span class="label-text font-medium">Persistent</span>
                </label>
              </div>
            </div>
          </div>
          </div>

          <!-- Fixed Form Actions -->
          <div class="flex justify-end gap-4 pt-4 border-t border-base-300 bg-base-100 shadow-lg">
            <button 
              type="button" 
              @click="$router.go(-1)"
              class="btn btn-outline"
              :disabled="saving"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="saving || !form.name"
            >
              <span v-if="saving" class="loading loading-spinner loading-sm mr-2"></span>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {{ saving ? 'Updating...' : 'Save' }}
            </button>
          </div>
        </form>

        <!-- Input Signals Tab -->
        <div v-else-if="activeTab === 'inputs'" class="flex flex-col h-full">
          <!-- Input Signals Header -->
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-lg">Input Signals Management</h3>
            <button 
              @click="openAddSignalModal"
              class="btn btn-secondary gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Signal
            </button>
          </div>

          <!-- Input Signals Table -->
          <div class="flex-1 overflow-y-auto">
            <div v-if="inputSignals.length === 0" class="text-center py-8">
              <div class="text-base-content/50">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <p class="font-medium">No input signals configured</p>
                <p class="text-sm">Click "Add Signal" to create your first input signal</p>
              </div>
            </div>

            <div v-else class="overflow-x-auto">
              <table class="table w-full">
                <thead>
                  <tr>
                    <th>Signal Name</th>
                    <th>Protocol</th>
                    <th>Multicast Address</th>
                    <th>Port</th>
                    <th>Source Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(signal, index) in inputSignals" :key="signal.id" class="hover">
                    <td>
                      <div class="font-medium">
                        {{ signal.signalName || `Signal ${index + 1}` }}
                      </div>
                      <div class="text-sm opacity-50">{{ signal.signalType }}</div>
                    </td>
                    <td>
                      <div class="badge badge-outline">{{ signal.protocol }}</div>
                    </td>
                    <td>
                      <code class="text-sm">{{ signal.multicastAddress }}</code>
                    </td>
                    <td>
                      <span class="font-mono">{{ signal.multicastPort }}</span>
                    </td>
                    <td>
                      <code class="text-sm">{{ signal.sourceAddress || 'Auto' }}</code>
                    </td>
                    <td>
                      <div class="flex gap-2">

                        <!-- Edit button -->
                        <button 
                          @click="editSignal(signal, index)"
                          class="btn btn-xs btn-primary"
                          title="Edit signal"
                        >
                        Edit
                        </button>

                        <!-- Delete button -->
                        <button 
                          @click="deleteSignal(index)"
                          class="btn btn-xs btn-error"
                          title="Delete signal"
                          >
                          Delete
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
    </div>
  </div>

  <!-- Edit Signal Modal -->
  <div v-if="showEditSignalModal" class="modal modal-open">
    <div class="modal-box max-w-2xl">
      <h3 class="font-bold text-lg mb-4">Edit Signal</h3>
      
      <form @submit.prevent="saveSignalChanges" class="space-y-6">
        <!-- Signal Name (full width) -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium w-40">Signal Name</span>
          </label>
          <input 
            type="text" 
            v-model="editingSignal.signalName"
            placeholder="Signal name"
            class="input input-bordered w-full"
          />
        </div>

        <!-- Two columns layout -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium w-40">Multicast Address *</span>
            </label>
            <input 
              type="text" 
              v-model="editingSignal.multicastAddress"
              placeholder="224.10.10.10"
              class="input input-bordered w-full"
              pattern="^(22[4-9]|23[0-9])\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$"
              required
            />
            <label class="label">
              <span class="label-text-alt">Multicast range: 224.0.0.0 - 239.255.255.255</span>
            </label>
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium w-40">Multicast Port *</span>
            </label>
            <input 
              type="number" 
              v-model.number="editingSignal.multicastPort"
              placeholder="2000"
              class="input input-bordered w-full"
              min="1"
              max="65535"
              required
            />
            <label class="label">
              <span class="label-text-alt">Port range: 1 - 65535</span>
            </label>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium w-40">Source Address</span>
            </label>
            <input 
              type="text" 
              v-model="editingSignal.sourceAddress"
              placeholder="192.168.1.141"
              class="input input-bordered w-full"
              pattern="^([0-9]{1,3}\.){3}[0-9]{1,3}$"
            />
            <label class="label">
              <span class="label-text-alt">Source IP (optional)</span>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium w-40">Protocol</span>
            </label>
            <select v-model="editingSignal.protocol" class="select select-bordered w-full">
              <option value="UDP">UDP</option>
              <option value="TCP">TCP</option>
            </select>
            <label class="label">
              <span class="label-text-alt">Transport protocol</span>
            </label>
          </div>
        </div>
        
        <div class="modal-action pt-4">
          <button type="button" @click="closeEditSignalModal" class="btn">Cancel</button>
          <button type="submit" class="btn btn-primary" :disabled="savingSignal">
            <span v-if="savingSignal" class="loading loading-spinner loading-sm mr-2"></span>
            Save Changes
          </button>
        </div>
      </form>
    </div>
    <div class="modal-backdrop" @click="closeEditSignalModal"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiGet, apiPut } from '../services/api.js'

const route = useRoute()
const router = useRouter()

// Reactive data
const loading = ref(true)
const saving = ref(false)
const error = ref(null)
const selection = ref(null)
const activeTab = ref('configuration')
const inputSignals = ref([])

// Edit Signal Modal data
const showEditSignalModal = ref(false)
const editingSignal = ref({})
const editingSignalIndex = ref(-1)
const savingSignal = ref(false)

// Form data
const form = ref({
  name: '',
  description: '',
  outputProtocol: 'udp',
  inputAnalyzeFormat: 'JSON',
  active: false,
  enabled: true,
  running: false,
  auto_run: false,
  persistent: true,
  externalID: '',
  consumedResourceId: '',
  technicalServiceID: '',
  technicalServiceName: '',
  topologyID: '',
  maxInputSignals: 10,
  controlIPAddress: '192.168.1.141',
  controlPort: 445
})

// Methods
const loadSelection = async () => {
  try {
    loading.value = true
    error.value = null
    
    const selectionId = route.params.id
    console.log('🔍 Loading selection:', selectionId)
    
    // Get selection details from the functions API
    const functions = await apiGet('/functions/getAll', true)
    const selectedFunction = functions.find(func => func.id === selectionId)
    
    if (!selectedFunction) {
      throw new Error('Selection not found')
    }
    
    selection.value = selectedFunction
    
    // Populate form with existing data
    form.value = {
      name: selectedFunction.name || '',
      description: selectedFunction.description || '',
      outputProtocol: selectedFunction.outputProtocol || 'udp',
      inputAnalyzeFormat: selectedFunction.inputAnalyzeFormat || 'JSON',
      active: selectedFunction.active || false,
      enabled: selectedFunction.enabled || true,
      running: selectedFunction.running || false,
      auto_run: selectedFunction.auto_run || selectedFunction.autoRun || false,
      persistent: selectedFunction.persistent || true,
      externalID: selectedFunction.externalID || '',
      consumedResourceId: selectedFunction.consumedResourceId || '',
      technicalServiceID: selectedFunction.technicalServiceID || '',
      technicalServiceName: selectedFunction.technicalServiceName || '',
      topologyID: selectedFunction.topologyID || '',
      maxInputSignals: selectedFunction.maxInputSignals || 10,
      controlIPAddress: selectedFunction.controlIPAddress || '192.168.1.141',
      controlPort: selectedFunction.controlPort || 445
    }

    // Load input signals
    inputSignals.value = selectedFunction.inputSignals || []
    console.log('📡 Loaded input signals:', inputSignals.value)
    
    console.log('✅ Selection loaded successfully')
    
  } catch (err) {
    console.error('❌ Error loading selection:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const updateSelection = async () => {
  try {
    saving.value = true
    error.value = null
    
    const selectionId = route.params.id
    console.log('💾 Updating selection:', selectionId)
    
    // Call the update API
    const response = await apiPut(`/functions/selections/updateByID/${selectionId}`, form.value, true)
    
    console.log('✅ Selection updated successfully:', response)
    
    // Redirect back to selections list
    router.push('/selections')
    
  } catch (err) {
    console.error('❌ Error updating selection:', err)
    error.value = err.message
  } finally {
    saving.value = false
  }
}

// Input Signals Management
const openAddSignalModal = () => {
  // TODO: Implement modal for adding new signal
  const newSignal = {
    id: `signal_${Date.now()}`,
    signalType: 'MulticastSignalEntity',
    signalName: `Signal ${inputSignals.value.length + 1}`,
    protocol: 'UDP',
    multicastAddress: '224.10.10.' + (10 + inputSignals.value.length),
    sourceAddress: '192.168.1.141',
    multicastPort: 2000 + inputSignals.value.length
  }
  
  inputSignals.value.push(newSignal)
  console.log('✅ Added new signal:', newSignal)
}

const editSignal = (signal, index) => {
  console.log('✏️ Opening edit modal for signal:', signal.signalName || `Signal ${index + 1}`)
  
  // Copy signal data to editing form
  editingSignal.value = {
    signalName: signal.signalName || `Signal ${index + 1}`,
    multicastAddress: signal.multicastAddress || '',
    multicastPort: signal.multicastPort || 2000,
    sourceAddress: signal.sourceAddress || '',
    protocol: signal.protocol || 'UDP',
    signalType: signal.signalType || 'MulticastSignalEntity'
  }
  
  editingSignalIndex.value = index
  showEditSignalModal.value = true
}

const closeEditSignalModal = () => {
  showEditSignalModal.value = false
  editingSignal.value = {}
  editingSignalIndex.value = -1
  savingSignal.value = false
}

const saveSignalChanges = async () => {
  try {
    savingSignal.value = true
    
    console.log('💾 Saving signal changes:', editingSignal.value)
    
    // Validate required fields
    if (!editingSignal.value.multicastAddress || !editingSignal.value.multicastPort) {
      alert('Multicast address and port are required')
      return
    }
    
    // Update the signal in the array
    if (editingSignalIndex.value >= 0 && editingSignalIndex.value < inputSignals.value.length) {
      const updatedSignal = {
        ...inputSignals.value[editingSignalIndex.value],
        signalName: editingSignal.value.signalName,
        multicastAddress: editingSignal.value.multicastAddress,
        multicastPort: editingSignal.value.multicastPort,
        sourceAddress: editingSignal.value.sourceAddress,
        protocol: editingSignal.value.protocol
      }
      
      inputSignals.value[editingSignalIndex.value] = updatedSignal
      console.log('✅ Signal updated successfully:', updatedSignal)
    }
    
    closeEditSignalModal()
    
  } catch (err) {
    console.error('❌ Error saving signal changes:', err)
    alert(`Error saving signal: ${err.message}`)
  } finally {
    savingSignal.value = false
  }
}

const deleteSignal = (index) => {
  if (confirm('Are you sure you want to delete this signal?')) {
    const deletedSignal = inputSignals.value.splice(index, 1)[0]
    console.log('✅ Deleted signal:', deletedSignal)
  }
}

// Lifecycle
onMounted(() => {
  console.log('📝 EditSelection view mounted')
  loadSelection()
})
</script>
