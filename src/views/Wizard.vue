<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
    <div class="max-w-4xl w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-base-content mb-2">Configuration Wizard</h1>
        <p class="text-base-content/70">Welcome! Let's configure your MediaHub application</p>
      </div>

      <!-- Progress Steps -->
      <div class="flex justify-center mb-8">
        <ul class="steps steps-horizontal">
          <li class="step" :class="currentStep >= 1 ? 'step-primary' : ''">Verification</li>
          <li class="step" :class="currentStep >= 2 ? 'step-primary' : ''">Network</li>
          <li class="step" :class="currentStep >= 3 ? 'step-primary' : ''">Instances</li>
          <li class="step" :class="currentStep >= 4 ? 'step-primary' : ''">Finalization</li>
        </ul>
      </div>

      <!-- Main Card -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <!-- Step 1: System Verification -->
          <div v-if="currentStep === 1" class="space-y-6">
            <h2 class="card-title text-2xl mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              System Verification
            </h2>
            
            <div class="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 class="font-bold">Initial Configuration Required</h3>
                <div class="text-xs">Your MediaHub application requires an initial configuration before use.</div>
              </div>
            </div>

            <!-- Application Info -->
            <div v-if="appProperties" class="bg-base-200 p-4 rounded-lg">
              <h3 class="font-semibold mb-3">Application Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span class="text-sm opacity-70">Name:</span>
                  <div class="font-medium">{{ appProperties.name }}</div>
                </div>
                <div>
                  <span class="text-sm opacity-70">Version:</span>
                  <div class="font-medium">{{ appProperties.version }}</div>
                </div>
                <div>
                  <span class="text-sm opacity-70">Description:</span>
                  <div class="font-medium">{{ appProperties.description }}</div>
                </div>
                <div>
                  <span class="text-sm opacity-70">Status:</span>
                  <div class="badge badge-warning">Not Configured</div>
                </div>
              </div>
            </div>

            <div class="card-actions justify-between">
              <button class="btn btn-warning btn-outline btn-sm" @click="skipToDebugDashboard">
                🐛 Debug: Aller au Dashboard
              </button>
              <button class="btn btn-primary" @click="nextStep">
                Start Configuration
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Step 2: Network Configuration -->
          <div v-else-if="currentStep === 2" class="space-y-6">
            <h2 class="card-title text-2xl mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.881-6.08 2.33l-.147.083A7.994 7.994 0 0112 21.001z" />
              </svg>
              Network Settings
            </h2>

            <div class="alert alert-warning">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h3 class="font-bold">Network Settings</h3>
                <div class="text-xs">Please configure the network interfaces in the Network section before continuing.</div>
              </div>
            </div>

            <div class="card-actions justify-between">
              <button class="btn btn-outline" @click="previousStep">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 15l-3-3m0 0l3-3m-3 3h8m-13 0a9 9 0 1118 0 9 9 0 01-18 0z" />
                </svg>
                Previous
              </button>
              <div class="flex gap-2">
                <button class="btn btn-secondary" @click="openNetworkSettings">
                  Configure the Network Settings
                </button>
                <button class="btn btn-primary" @click="nextStep">
                  Continue
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Step 3: Instance Configuration -->
          <div v-else-if="currentStep === 3" class="space-y-6">
            <h2 class="card-title text-2xl mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
              Instance Settings
            </h2>

            <div class="alert alert-warning">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h3 class="font-bold">Instance Settings</h3>
                <div class="text-xs">Please configure the system instances in the Settings > Instances section.</div>
              </div>
            </div>

            <div class="card-actions justify-between">
              <button class="btn btn-outline" @click="previousStep">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 15l-3-3m0 0l3-3m-3 3h8m-13 0a9 9 0 1118 0 9 9 0 01-18 0z" />
                </svg>
                Previous
              </button>
              <div class="flex gap-2">
                <button class="btn btn-secondary" @click="openInstanceSettings">
                  Configure the Instance Settings
                </button>
                <button class="btn btn-primary" @click="nextStep">
                  Continue
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Step 4: Finalization -->
          <div v-else-if="currentStep === 4" class="space-y-6">
            <h2 class="card-title text-2xl mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Finalization of the Configuration
            </h2>

            <div class="alert alert-success">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 class="font-bold">Configuration Almost Finished</h3>
                <div class="text-xs">Click on "Finalize" to mark the application as configured.</div>
              </div>
            </div>

            <div class="bg-base-200 p-4 rounded-lg">
              <h3 class="font-semibold mb-3">Summary of the Configuration</h3>
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>System verification completed</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Network configuration validated</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>System instances configured</span>
                </div>
              </div>
            </div>

            <div class="card-actions justify-between">
              <button class="btn btn-outline" @click="previousStep">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 15l-3-3m0 0l3-3m-3 3h8m-13 0a9 9 0 1118 0 9 9 0 01-18 0z" />
                </svg>
                Previous
              </button>
              <button class="btn btn-success" @click="finishConfiguration" :disabled="isFinishing">
                <span v-if="isFinishing" class="loading loading-spinner loading-sm mr-2"></span>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ isFinishing ? 'Finalization...' : 'Finalize the Configuration' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ApplicationController } from '../controllers/ApplicationController.js'

const router = useRouter()
const currentStep = ref(1)
const isFinishing = ref(false)
const appProperties = ref(null)

onMounted(async () => {
  try {
    // Load the application properties
    appProperties.value = await ApplicationController.getAllProperties()
  } catch (error) {
    console.error('❌ Error loading application properties:', error)
  }
})

const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const openNetworkSettings = () => {
  // Open the Network page in a new tab or navigate
  router.push('/network')
}

const openInstanceSettings = () => {
  // Open the Settings > Instances page
  router.push('/settings')
}

const finishConfiguration = async () => {
  try {
    isFinishing.value = true
    
    // Mark the application as configured
    await ApplicationController.markAsConfigured()
    
    // Redirect to the dashboard
    router.push('/dashboard')
    
  } catch (error) {
    console.error('❌ Error finishing configuration:', error)
    // Show an error notification
  } finally {
    isFinishing.value = false
  }
}

const skipToDebugDashboard = () => {
  console.log('🐛 Debug: Forcing navigation to dashboard')
  router.push('/dashboard')
}
</script>
