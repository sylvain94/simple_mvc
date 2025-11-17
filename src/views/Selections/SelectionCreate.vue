<template>
  <div class="container mx-auto p-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-4 mb-4">
        <button 
          @click="$router.go(-1)" 
          class="btn btn-ghost btn-sm"
          title="Back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 class="text-3xl font-bold text-base-content">Create Selection</h1>
      </div>
      <p class="text-base-content/70">Configure a new selection for the signal processing</p>
    </div>

    <!-- Form -->
    <div class="card bg-base-100 shadow-lg">
      <div class="card-body">
        <form @submit.prevent="createSelection" class="space-y-6">
          
          <!-- Basic Information -->
          <div class="card bg-base-200/50">
            <div class="card-body">
              <h3 class="card-title text-lg mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                General Information
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Name -->
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Name<span class="text-error">*</span></span>
                  </label>
                  <input 
                    type="text" 
                    v-model="formData.name"
                    class="input input-bordered"
                    :class="{ 'input-error': errors.name }"
                    placeholder="Enter selection name"
                    required
                  />
                  <label v-if="errors.name" class="label">
                    <span class="label-text-alt text-error">{{ errors.name }}</span>
                  </label>
                </div>

                <!-- Command -->
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Command<span class="text-error">*</span></span>
                  </label>
                  <input 
                    type="text" 
                    v-model="formData.command"
                    class="input input-bordered"
                    :class="{ 'input-error': errors.command }"
                    placeholder="Enter command"
                    required
                  />
                  <label v-if="errors.command" class="label">
                    <span class="label-text-alt text-error">{{ errors.command }}</span>
                  </label>
                </div>
              </div>

              <!-- Description -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">Description</span>
                </label>
                <textarea 
                  v-model="formData.description"
                  class="textarea textarea-bordered h-20"
                  placeholder="Enter description"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Protocol Configuration -->
          <div class="card bg-base-200/50">
            <div class="card-body">
              <h3 class="card-title text-lg mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
                Protocol Configuration
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Output Protocol -->
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Output Protocol<span class="text-error">*</span></span>
                  </label>
                  <select 
                    v-model="formData.outputProtocol"
                    class="select select-bordered"
                    :class="{ 'select-error': errors.outputProtocol }"
                    required
                  >
                    <option value="">Select a protocol</option>
                    <option value="udp">UDP</option>
                    <option value="tcp">TCP</option>
                    <option value="srt">SRT</option>
                    <option value="rtp">RTP</option>
                  </select>
                  <label v-if="errors.outputProtocol" class="label">
                    <span class="label-text-alt text-error">{{ errors.outputProtocol }}</span>
                  </label>
                </div>

                <!-- Control IP Address -->
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Control IP Address<span class="text-error">*</span></span>
                  </label>
                  <input 
                    type="text" 
                    v-model="formData.controlIPAddress"
                    class="input input-bordered"
                    :class="{ 'input-error': errors.controlIPAddress }"
                    placeholder="Ex: 192.168.1.141"
                    pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$"
                    required
                  />
                  <label v-if="errors.controlIPAddress" class="label">
                    <span class="label-text-alt text-error">{{ errors.controlIPAddress }}</span>
                  </label>
                </div>

                <!-- Control Port -->
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Control Port<span class="text-error">*</span></span>
                  </label>
                  <input 
                    type="number" 
                    v-model.number="formData.controlPort"
                    class="input input-bordered"
                    :class="{ 'input-error': errors.controlPort }"
                    placeholder="Ex: 4445"
                    min="1"
                    max="65535"
                    required
                  />
                  <label v-if="errors.controlPort" class="label">
                    <span class="label-text-alt text-error">{{ errors.controlPort }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Analysis Configuration -->
          <div class="card bg-base-200/50">
            <div class="card-body">
              <h3 class="card-title text-lg mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analysis Configuration
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Input Analyze Command -->
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Input Analyze Command</span>
                  </label>
                  <input 
                    type="text" 
                    v-model="formData.inputAnalyzeCommand"
                    class="input input-bordered"
                    placeholder="Enter input analyze command"
                  />
                </div>

                <!-- Input Analyze Format -->
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Input Analyze Format</span>
                  </label>
                  <select 
                    v-model="formData.inputAnalyzeFormat"
                    class="select select-bordered"
                  >
                    <option value="">Select a format</option>
                    <option value="JSON">JSON</option>
                    <option value="XML">XML</option>
                    <option value="TEXT">TEXT</option>
                  </select>
                </div>

                <!-- Output Analyze Command -->
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Output Analyze Command</span>
                  </label>
                  <input 
                    type="text" 
                    v-model="formData.outputAnalyzeCommand"
                    class="input input-bordered"
                    placeholder="Enter output analyze command"
                  />
                </div>

                <!-- Output Analyze Format -->
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Output Analyze Format</span>
                  </label>
                  <select 
                    v-model="formData.outputAnalyzeFormat"
                    class="select select-bordered"
                  >
                    <option value="">Select a format</option>
                    <option value="JSON">JSON</option>
                    <option value="XML">XML</option>
                    <option value="TEXT">TEXT</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Signal Configuration -->
          <div class="card bg-base-200/50">
            <div class="card-body">
              <h3 class="card-title text-lg mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 10h6m-6 4h6" />
                </svg>
                Signal Configuration
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Max Input Signals -->
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Max Input Signals</span>
                  </label>
                  <input 
                    type="number" 
                    v-model.number="formData.maxInputSignals"
                    class="input input-bordered"
                    placeholder="16"
                    min="0"
                    max="999"
                  />
                </div>

                <!-- Max Output Signals -->
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Max Output Signals</span>
                  </label>
                  <input 
                    type="number" 
                    v-model.number="formData.maxOutputSignals"
                    class="input input-bordered"
                    placeholder="1"
                    min="0"
                    max="999"
                  />
                </div>

                <!-- Current Output Signal Number -->
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Current Output Signal Number</span>
                  </label>
                  <input 
                    type="number" 
                    v-model.number="formData.currentOutputSignalNumber"
                    class="input input-bordered"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <!-- Current Input Signal Number -->
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Current Input Signal Number</span>
                  </label>
                  <input 
                    type="number" 
                    v-model.number="formData.currentInputSignalNumber"
                    class="input input-bordered"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Options -->
          <div class="card bg-base-200/50">
            <div class="card-body">
              <h3 class="card-title text-lg mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                Options
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Active -->
                <div class="form-control">
                  <label class="label cursor-pointer">
                    <span class="label-text font-medium">Active</span>
                    <input 
                      type="checkbox" 
                      v-model="formData.active"
                      class="checkbox checkbox-primary"
                    />
                  </label>
                </div>

                <!-- Enabled -->
                <div class="form-control">
                  <label class="label cursor-pointer">
                    <span class="label-text font-medium">Enabled</span>
                    <input 
                      type="checkbox" 
                      v-model="formData.enabled"
                      class="checkbox checkbox-primary"
                    />
                  </label>
                </div>

                <!-- Auto Run -->
                <div class="form-control">
                  <label class="label cursor-pointer">
                    <span class="label-text font-medium">Auto Run</span>
                    <input 
                      type="checkbox" 
                      v-model="formData.autoRun"
                      class="checkbox checkbox-primary"
                    />
                  </label>
                </div>

                <!-- Persistent -->
                <div class="form-control">
                  <label class="label cursor-pointer">
                    <span class="label-text font-medium">Persistent</span>
                    <input 
                      type="checkbox" 
                      v-model="formData.persistent"
                      class="checkbox checkbox-primary"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-base-300">
            <button 
              type="button" 
              @click="resetForm"
              class="btn btn-ghost"
              :disabled="loading"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
            
            <button 
              type="button" 
              @click="$router.go(-1)"
              class="btn btn-outline"
              :disabled="loading"
            >
              Cancel
            </button>
            
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="loading || !isFormValid"
            >
              <span v-if="loading" class="loading loading-spinner loading-sm mr-2"></span>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              {{ loading ? 'Creating...' : 'Create Selection' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="successMessage" class="alert alert-success mt-6">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ successMessage }}</span>
    </div>

    <div v-if="errorMessage" class="alert alert-error mt-6">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { selectionService } from '../services/api.js'

const router = useRouter()

// Reactive data
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Form data with default values based on the API example
const formData = reactive({
  name: '',
  description: '',
  command: 'tsswitch',
  outputProtocol: 'udp',
  inputAnalyzeCommand: 'tsp',
  inputAnalyzeFormat: 'JSON',
  outputAnalyzeCommand: 'tsp',
  outputAnalyzeFormat: 'JSON',
  active: true,
  enabled: true,
  running: false,
  auto_run: false,
  persistent: true,
  currentOutputSignalNumber: 0,
  maxOutputSignals: 1,
  currentInputSignalNumber: 0,
  maxInputSignals: 16,
  controlIPAddress: '192.168.1.141',
  controlPort: 4445,
  autoRun: false
})

// Form validation errors
const errors = reactive({
  name: '',
  command: '',
  outputProtocol: '',
  controlIPAddress: '',
  controlPort: ''
})

// Computed properties
const isFormValid = computed(() => {
  return formData.name.trim() !== '' &&
         formData.command.trim() !== '' &&
         formData.outputProtocol !== '' &&
         formData.controlIPAddress.trim() !== '' &&
         formData.controlPort > 0 &&
         formData.controlPort <= 65535
})

// Methods
const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  let isValid = true

  // Validate name
  if (!formData.name.trim()) {
    errors.name = 'Name is required'
    isValid = false
  }

  // Validate command
  if (!formData.command.trim()) {
    errors.command = 'La commande est requise'
    isValid = false
  }

  // Validate output protocol
  if (!formData.outputProtocol) {
    errors.outputProtocol = 'Le protocole de sortie est requis'
    isValid = false
  }

  // Validate control IP address
  if (!formData.controlIPAddress.trim()) {
    errors.controlIPAddress = 'L\'adresse IP de contrôle est requise'
    isValid = false
  } else {
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/
    if (!ipRegex.test(formData.controlIPAddress)) {
      errors.controlIPAddress = 'Format d\'adresse IP invalide'
      isValid = false
    }
  }

  // Validate control port
  if (!formData.controlPort || formData.controlPort < 1 || formData.controlPort > 65535) {
    errors.controlPort = 'Le port doit être entre 1 et 65535'
    isValid = false
  }

  return isValid
}

const createSelection = async () => {
  if (!validateForm()) {
    return
  }

  try {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    console.log('🚀 Creating selection with data:', formData)

    const response = await selectionService.createSelection(formData)
    
    console.log('✅ Selection created successfully:', response)
    
    successMessage.value = `Selection "${formData.name}" created successfully!`
    
    // Redirect to selections page after a short delay
    setTimeout(() => {
      router.push('/selections')
    }, 2000)

  } catch (error) {
    console.error('❌ Error creating selection:', error)
    errorMessage.value = `Error creating selection: ${error.message || 'Unknown error'}`
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  // Reset form to default values
  Object.assign(formData, {
    name: '',
    description: '',
    command: 'tsswitch',
    outputProtocol: 'udp',
    inputAnalyzeCommand: 'tsp',
    inputAnalyzeFormat: 'JSON',
    outputAnalyzeCommand: 'tsp',
    outputAnalyzeFormat: 'JSON',
    active: true,
    enabled: true,
    running: false,
    auto_run: false,
    persistent: true,
    currentOutputSignalNumber: 0,
    maxOutputSignals: 1,
    currentInputSignalNumber: 0,
    maxInputSignals: 16,
    controlIPAddress: '192.168.1.141',
    controlPort: 4445,
    autoRun: false
  })

  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  // Reset messages
  successMessage.value = ''
  errorMessage.value = ''
}

// Lifecycle
onMounted(() => {
  console.log('📝 Create Selection form mounted')
})
</script>

<style scoped>
.card {
  transition: all 0.2s ease;
}

.form-control .input:focus,
.form-control .select:focus,
.form-control .textarea:focus {
  border-color: var(--fallback-p, oklch(var(--p)/1));
  box-shadow: 0 0 0 2px var(--fallback-p, oklch(var(--p)/0.2));
}

.input-error,
.select-error {
  border-color: var(--fallback-er, oklch(var(--er)/1));
}

.label-text {
  font-weight: 500;
}

.grid {
  gap: 1rem;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .card-body {
    padding: 1.5rem;
  }
}
</style>
