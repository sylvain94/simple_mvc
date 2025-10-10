<template>
  <div 
    v-if="isVisible" 
    class="modal modal-open"
    @click.self="closeModal"
  >
    <div class="modal-box w-11/12 max-w-4xl">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-lg">
          {{ isEditing ? 'Edit SRT Gateway' : 'Create SRT Gateway' }}
        </h3>
        <button 
          class="btn btn-sm btn-circle btn-ghost" 
          @click="closeModal"
        >
          ✕
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <!-- Gateway Type Selection -->
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text font-medium">Gateway Type *</span>
          </label>
          
          <!-- Editable type selection (only for new gateways) -->
          <div v-if="!isEditing" class="flex gap-4">
            <label class="label cursor-pointer">
              <input 
                type="radio" 
                name="gatewayType" 
                value="SRT_MC" 
                v-model="formData.gatewayType"
                class="radio radio-primary" 
              />
              <span class="label-text ml-2">Incoming (SRT → Multicast)</span>
            </label>
            <label class="label cursor-pointer">
              <input 
                type="radio" 
                name="gatewayType" 
                value="MC_SRT" 
                v-model="formData.gatewayType"
                class="radio radio-primary" 
              />
              <span class="label-text ml-2">Outgoing (Multicast → SRT)</span>
            </label>
          </div>
          
          <!-- Read-only type display (for editing existing gateways) -->
          <div v-else class="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 class="font-bold">{{ formatGatewayType(formData.gatewayType) }}</h3>
              <div class="text-xs">Gateway type cannot be changed after creation</div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Basic Information -->
          <div class="card bg-base-200 shadow-xl">
            <div class="card-body">
              <h4 class="card-title">Basic Information</h4>
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Name *</span>
                </label>
                <input 
                  type="text" 
                  v-model="formData.name"
                  class="input input-bordered" 
                  :class="{ 'input-error': errors.name }"
                  placeholder="Enter gateway name"
                  required
                />
                <label v-if="errors.name" class="label">
                  <span class="label-text-alt text-error">{{ errors.name }}</span>
                </label>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Description</span>
                </label>
                <textarea 
                  v-model="formData.description"
                  class="textarea textarea-bordered" 
                  placeholder="Enter description"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">SRT Mode *</span>
                </label>
                <select 
                  v-model="formData.srtMode" 
                  class="select select-bordered"
                  :class="{ 'select-error': errors.srtMode }"
                  required
                >
                  <option value="">Select SRT mode</option>
                  <option value="LISTENER">Listener</option>
                  <option value="CALLER">Caller</option>
                  <option value="RENDEZ_VOUS">Rendezvous</option>
                </select>
                <label v-if="errors.srtMode" class="label">
                  <span class="label-text-alt text-error">{{ errors.srtMode }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- SRT Configuration -->
          <div class="card bg-base-200 shadow-xl">
            <div class="card-body">
              <h4 class="card-title">SRT Configuration</h4>
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Local SRT Listen Address *</span>
                </label>
                <input 
                  type="text" 
                  v-model="formData.localSRTListenAddress"
                  class="input input-bordered" 
                  :class="{ 'input-error': errors.localSRTListenAddress }"
                  placeholder="192.168.1.141"
                  required
                />
                <label v-if="errors.localSRTListenAddress" class="label">
                  <span class="label-text-alt text-error">{{ errors.localSRTListenAddress }}</span>
                </label>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Foreign SRT Address</span>
                </label>
                <input 
                  type="text" 
                  v-model="formData.foreignSRTAddress"
                  class="input input-bordered" 
                  placeholder="Remote SRT address"
                />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Foreign SRT Port *</span>
                </label>
                <input 
                  type="number" 
                  v-model.number="formData.foreignSRTPort"
                  class="input input-bordered" 
                  :class="{ 'input-error': errors.foreignSRTPort }"
                  placeholder="7000"
                  min="1"
                  max="65535"
                  required
                />
                <label v-if="errors.foreignSRTPort" class="label">
                  <span class="label-text-alt text-error">{{ errors.foreignSRTPort }}</span>
                </label>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">SRT Passphrase</span>
                </label>
                <input 
                  type="password" 
                  v-model="formData.srtPassPhrase"
                  class="input input-bordered" 
                  placeholder="Optional SRT passphrase"
                />
              </div>
            </div>
          </div>

          <!-- Multicast Configuration -->
          <div class="card bg-base-200 shadow-xl">
            <div class="card-body">
              <h4 class="card-title">Multicast Configuration</h4>
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Local Multicast Address *</span>
                </label>
                <input 
                  type="text" 
                  v-model="formData.localMCAddress"
                  class="input input-bordered" 
                  :class="{ 'input-error': errors.localMCAddress }"
                  placeholder="232.0.1.1"
                  required
                />
                <label v-if="errors.localMCAddress" class="label">
                  <span class="label-text-alt text-error">{{ errors.localMCAddress }}</span>
                </label>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Local Multicast Port *</span>
                </label>
                <input 
                  type="number" 
                  v-model.number="formData.localMCPort"
                  class="input input-bordered" 
                  :class="{ 'input-error': errors.localMCPort }"
                  placeholder="6000"
                  min="1"
                  max="65535"
                  required
                />
                <label v-if="errors.localMCPort" class="label">
                  <span class="label-text-alt text-error">{{ errors.localMCPort }}</span>
                </label>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Local Source Address</span>
                </label>
                <input 
                  type="text" 
                  v-model="formData.localSRCAddress"
                  class="input input-bordered" 
                  placeholder="192.168.1.141"
                />
              </div>
            </div>
          </div>

          <!-- Advanced Configuration -->
          <div class="card bg-base-200 shadow-xl">
            <div class="card-body">
              <h4 class="card-title">Advanced Configuration</h4>
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Control IP Address</span>
                </label>
                <input 
                  type="text" 
                  v-model="formData.controlIPAddress"
                  class="input input-bordered" 
                  placeholder="192.168.122.23"
                />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Control Port</span>
                </label>
                <input 
                  type="number" 
                  v-model.number="formData.controlPort"
                  class="input input-bordered" 
                  placeholder="2221"
                  min="1"
                  max="65535"
                />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Max Input Signals</span>
                </label>
                <input 
                  type="number" 
                  v-model.number="formData.maxInputSignals"
                  class="input input-bordered" 
                  placeholder="1"
                  min="1"
                />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Max Output Signals</span>
                </label>
                <input 
                  type="number" 
                  v-model.number="formData.maxOutputSignals"
                  class="input input-bordered" 
                  placeholder="1"
                  min="1"
                />
              </div>

              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Auto Run</span>
                  <input 
                    type="checkbox" 
                    v-model="formData.auto_run"
                    class="checkbox checkbox-primary" 
                  />
                </label>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Persistent</span>
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

        <!-- Action Buttons -->
        <div class="modal-action">
          <button 
            type="button" 
            class="btn btn-ghost" 
            @click="closeModal"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting" class="loading loading-spinner loading-sm"></span>
            {{ isSubmitting ? 'Creating...' : (isEditing ? 'Update Gateway' : 'Create Gateway') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  gateway: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['close', 'submit'])

// Reactive state
const isSubmitting = ref(false)
const errors = ref({})

const isEditing = computed(() => !!props.gateway)

// Form data
const formData = reactive({
  name: '',
  description: '',
  gatewayType: 'SRT_MC', // Default to incoming
  srtMode: 'LISTENER',
  localSRTListenAddress: '192.168.1.141',
  foreignSRTAddress: '',
  foreignSRTPort: 7000,
  localMCAddress: '232.0.1.1',
  localMCPort: 6000,
  localSRCAddress: '192.168.1.141',
  srtPassPhrase: '',
  controlIPAddress: '192.168.122.23',
  controlPort: 2221,
  maxInputSignals: 1,
  maxOutputSignals: 1,
  auto_run: false,
  persistent: true,
  // Fixed values based on your example
  command: 'tsp',
  inputType: 'SRT',
  outputType: 'UDP',
  inputOptions: ['-I srt'],
  inputProtocol: 'udp',
  outputOptions: ['-O ip'],
  outputProtocol: 'udp',
  outputAnalyzeCommand: 'tsp',
  outputAnalyzeFormat: 'JSON',
  active: true,
  enabled: true,
  running: false,
  currentOutputSignalNumber: 0,
  currentInputSignalNumber: 0
})

// Watch for gateway prop changes (for editing)
watch(() => props.gateway, (newGateway) => {
  if (newGateway) {
    // Populate form with existing gateway data
    Object.keys(formData).forEach(key => {
      if (newGateway[key] !== undefined) {
        formData[key] = newGateway[key]
      } else if (newGateway.srtConfig && newGateway.srtConfig[key] !== undefined) {
        formData[key] = newGateway.srtConfig[key]
      }
    })
  }
}, { immediate: true })

// Watch for modal visibility changes
watch(() => props.isVisible, (newValue) => {
  if (newValue && !props.gateway) {
    resetForm()
  }
  if (!newValue) {
    errors.value = {}
  }
})

// Methods
const resetForm = () => {
  formData.name = ''
  formData.description = ''
  formData.gatewayType = 'SRT_MC'
  formData.srtMode = 'LISTENER'
  formData.localSRTListenAddress = '192.168.1.141'
  formData.foreignSRTAddress = ''
  formData.foreignSRTPort = 7000
  formData.localMCAddress = '232.0.1.1'
  formData.localMCPort = 6000
  formData.localSRCAddress = '192.168.1.141'
  formData.srtPassPhrase = ''
  formData.controlIPAddress = '192.168.122.23'
  formData.controlPort = 2221
  formData.maxInputSignals = 1
  formData.maxOutputSignals = 1
  formData.auto_run = false
  formData.persistent = true
  errors.value = {}
}

const validateForm = () => {
  errors.value = {}

  if (!formData.name.trim()) {
    errors.value.name = 'Name is required'
  }

  if (!formData.gatewayType) {
    errors.value.gatewayType = 'Gateway type is required'
  }

  if (!formData.srtMode) {
    errors.value.srtMode = 'SRT mode is required'
  }

  if (!formData.localSRTListenAddress.trim()) {
    errors.value.localSRTListenAddress = 'Local SRT listen address is required'
  }

  if (!formData.foreignSRTPort || formData.foreignSRTPort < 1 || formData.foreignSRTPort > 65535) {
    errors.value.foreignSRTPort = 'Valid foreign SRT port is required (1-65535)'
  }

  if (!formData.localMCAddress.trim()) {
    errors.value.localMCAddress = 'Local multicast address is required'
  }

  if (!formData.localMCPort || formData.localMCPort < 1 || formData.localMCPort > 65535) {
    errors.value.localMCPort = 'Valid local multicast port is required (1-65535)'
  }

  // Validate multicast address format
  if (formData.localMCAddress && !isValidMulticastAddress(formData.localMCAddress)) {
    errors.value.localMCAddress = 'Invalid multicast address format (224.0.0.0 - 239.255.255.255)'
  }

  return Object.keys(errors.value).length === 0
}

const isValidMulticastAddress = (address) => {
  const parts = address.split('.')
  if (parts.length !== 4) return false
  
  const firstOctet = parseInt(parts[0])
  return firstOctet >= 224 && firstOctet <= 239
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  
  try {
    // Prepare data for API
    const gatewayData = {
      ...formData,
      // Ensure proper data types
      foreignSRTPort: Number(formData.foreignSRTPort),
      localMCPort: Number(formData.localMCPort),
      controlPort: Number(formData.controlPort),
      maxInputSignals: Number(formData.maxInputSignals),
      maxOutputSignals: Number(formData.maxOutputSignals)
    }

    console.log('🚪 Submitting SRT gateway data:', gatewayData)
    
    emit('submit', {
      data: gatewayData,
      type: formData.gatewayType === 'SRT_MC' ? 'incoming' : 'outgoing',
      isEditing: isEditing.value
    })
    
  } catch (error) {
    console.error('❌ Error submitting form:', error)
  } finally {
    isSubmitting.value = false
  }
}

const formatGatewayType = (gatewayType) => {
  if (gatewayType === 'SRT_MC') {
    return 'Incoming (SRT → Multicast)'
  } else if (gatewayType === 'MC_SRT') {
    return 'Outgoing (Multicast → SRT)'
  }
  return gatewayType
}

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
.modal-box {
  max-height: 90vh;
  overflow-y: auto;
}

.card-title {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.form-control {
  margin-bottom: 1rem;
}

.grid {
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
