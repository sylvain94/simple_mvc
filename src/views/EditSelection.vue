<template>
  <div class="container mx-auto p-6 max-w-4xl">
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
        <h1 class="text-3xl font-bold">Edit Selection</h1>
        <p class="text-base-content/70">Modify selection function configuration</p>
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
    <div v-else-if="selection" class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="flex justify-between items-center mb-6">
          <h2 class="card-title">Selection Configuration</h2>
          
          <!-- Section Navigation -->
          <div class="form-control w-64">
            <select v-model="currentSection" class="select select-bordered select-primary">
              <option value="general">General Information</option>
              <option value="protocol">Protocol Configuration</option>
              <option value="control">Control Configuration</option>
              <option value="signal">Signal Configuration</option>
              <option value="service">Service Configuration</option>
              <option value="resource">Resource Configuration</option>
              <option value="options">Options</option>
            </select>
          </div>
        </div>
        
        <form @submit.prevent="updateSelection" class="space-y-6">
          <!-- General Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-base-content border-b border-base-300 pb-2">General Information</h3>
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
            <h3 class="text-lg font-semibold text-base-content border-b border-base-300 pb-2">Protocol Configuration</h3>
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
            <h3 class="text-lg font-semibold text-base-content border-b border-base-300 pb-2">Control Configuration</h3>
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
            <h3 class="text-lg font-semibold text-base-content border-b border-base-300 pb-2">Signal Configuration</h3>
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
            <h3 class="text-lg font-semibold text-base-content border-b border-base-300 pb-2">Service Configuration</h3>
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
            <h3 class="text-lg font-semibold text-base-content border-b border-base-300 pb-2">Resource Configuration</h3>
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
            <h3 class="text-lg font-semibold text-base-content border-b border-base-300 pb-2">Options</h3>
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

          <!-- Form Actions -->
          <div class="card-actions justify-end pt-1">
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
      </div>
    </div>
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

// Lifecycle
onMounted(() => {
  console.log('📝 EditSelection view mounted')
  loadSelection()
})
</script>
