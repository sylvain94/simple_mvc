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
          <li class="step" :class="currentStep >= 1 ? 'step-primary' : ''">Application</li>
          <li class="step" :class="currentStep >= 2 ? 'step-primary' : ''">Admin Instance</li>
          <li class="step" :class="currentStep >= 3 ? 'step-primary' : ''">Default Instance</li>
          <li class="step" :class="currentStep >= 4 ? 'step-primary' : ''">Finalization</li>
        </ul>
      </div>

      <!-- Main Card -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <!-- Step 1: Application Validation -->
          <div v-if="currentStep === 1" class="space-y-6">
            <h2 class="card-title text-2xl mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Application Validation
            </h2>
            
            <div class="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 class="font-bold">Application Installation Validation</h3>
                <div class="text-xs">Validate the application installation and display system information.</div>
              </div>
            </div>

            <!-- Validation Button -->
            <div class="text-center">
              <button 
                class="btn btn-primary btn-lg" 
                @click="validateInstallation" 
                :disabled="validating"
              >
                <span v-if="validating" class="loading loading-spinner loading-sm mr-2"></span>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ validating ? 'Validating...' : 'Validate Installation' }}
              </button>
            </div>

            <!-- Application Info (shown after validation) -->
            <div v-if="appProperties" class="bg-base-200 p-4 rounded-lg">
              <h3 class="font-semibold mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Application Information
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span class="text-sm opacity-70">ID:</span>
                  <div class="font-mono text-sm">{{ appProperties.id }}</div>
                </div>
                <div>
                  <span class="text-sm opacity-70">Serial Number:</span>
                  <div class="font-mono text-sm">{{ appProperties.serialNumber }}</div>
                </div>
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
                  <div class="font-medium">{{ appProperties.description || 'N/A' }}</div>
                </div>
                <div>
                  <span class="text-sm opacity-70">Status:</span>
                  <div class="badge" :class="appProperties.configured ? 'badge-success' : 'badge-warning'">
                    {{ appProperties.configured ? 'Configured' : 'Not Configured' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Error Display -->
            <div v-if="validationError" class="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ validationError }}</span>
            </div>

            <div class="card-actions justify-between">
              <button class="btn btn-warning btn-outline btn-sm" @click="skipToDebugDashboard">
                🐛 Debug: Aller au Dashboard
              </button>
              <button 
                class="btn btn-primary" 
                @click="nextStep" 
                :disabled="!appProperties"
              >
                Next: Admin Instance
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Step 2: Admin Instance Configuration -->
          <div v-else-if="currentStep === 2" class="space-y-6">
            <h2 class="card-title text-2xl mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Admin Instance Configuration
            </h2>

            <div class="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 class="font-bold">Admin Instance Setup</h3>
                <div class="text-xs">Configure the administrative instance for your MediaHub application.</div>
              </div>
            </div>

            <!-- Initialize Admin Instance Button -->
            <div v-if="!adminInstance" class="text-center">
              <button 
                class="btn btn-primary btn-lg" 
                @click="initiateAdminConfiguration" 
                :disabled="initiating"
              >
                <span v-if="initiating" class="loading loading-spinner loading-sm mr-2"></span>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {{ initiating ? 'Initializing...' : 'Initialize Admin Instance' }}
              </button>
            </div>

            <!-- Admin Instance Form -->
            <div v-if="adminInstance" class="space-y-4">
              <div class="bg-success/10 p-4 rounded-lg border border-success/20">
                <h3 class="font-semibold mb-3 flex items-center gap-2 text-success">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Admin Instance Created
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Name:</strong> {{ adminInstance.name }}</div>
                  <div><strong>Type:</strong> {{ adminInstance.type }}</div>
                  <div><strong>Status:</strong> {{ adminInstance.status }}</div>
                  <div><strong>Position:</strong> {{ adminInstance.position }}</div>
                </div>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">Position</span>
                </label>
                <select class="select select-bordered" v-model="adminForm.position">
                  <option value="EDGE_IN">EDGE_IN</option>
                  <option value="EDGE_OUT">EDGE_OUT</option>
                  <option value="INTERNAL">INTERNAL</option>
                  <option value="REMOTE">REMOTE</option>
                  <option value="ANY">ANY</option>
                </select>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Start IP</span>
                  </label>
                  <input 
                    type="text" 
                    class="input input-bordered" 
                    v-model="adminForm.startIP"
                    placeholder="224.10.10.10"
                  />
                </div>
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">End IP</span>
                  </label>
                  <input 
                    type="text" 
                    class="input input-bordered" 
                    v-model="adminForm.endIP"
                    placeholder="224.10.10.100"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Start MC Port</span>
                  </label>
                  <input 
                    type="number" 
                    class="input input-bordered" 
                    v-model.number="adminForm.startMCPort"
                    placeholder="2000"
                  />
                </div>
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">End MC Port</span>
                  </label>
                  <input 
                    type="number" 
                    class="input input-bordered" 
                    v-model.number="adminForm.endMCPort"
                    placeholder="2000"
                  />
                </div>
              </div>

              <button 
                class="btn btn-primary w-full" 
                @click="updateAdminConfiguration" 
                :disabled="updating"
              >
                <span v-if="updating" class="loading loading-spinner loading-sm mr-2"></span>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {{ updating ? 'Updating...' : 'Update Admin Configuration' }}
              </button>
            </div>

            <!-- Error Display -->
            <div v-if="adminError" class="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ adminError }}</span>
            </div>

            <div class="card-actions justify-between">
              <button class="btn btn-outline" @click="previousStep">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 15l-3-3m0 0l3-3m-3 3h8m-13 0a9 9 0 1118 0 9 9 0 01-18 0z" />
                </svg>
                Previous
              </button>
              <button 
                class="btn btn-primary" 
                @click="nextStep" 
                :disabled="!adminInstance || !adminConfigured"
              >
                Next: Default Instance
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Step 3: Default Instance Configuration -->
          <div v-else-if="currentStep === 3" class="space-y-6">
            <h2 class="card-title text-2xl mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Default Instance Configuration
            </h2>

            <div class="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 class="font-bold">Default Instance Setup</h3>
                <div class="text-xs">Configure the default instance for your MediaHub application.</div>
              </div>
            </div>

            <!-- Initialize Default Instance Button -->
            <div v-if="!defaultInstance" class="text-center">
              <button 
                class="btn btn-primary btn-lg" 
                @click="initiateDefaultConfiguration" 
                :disabled="initiatingDefault"
              >
                <span v-if="initiatingDefault" class="loading loading-spinner loading-sm mr-2"></span>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {{ initiatingDefault ? 'Initializing...' : 'Initialize Default Instance' }}
              </button>
            </div>

            <!-- Default Instance Form -->
            <div v-if="defaultInstance" class="space-y-4">
              <div class="bg-success/10 p-4 rounded-lg border border-success/20">
                <h3 class="font-semibold mb-3 flex items-center gap-2 text-success">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Default Instance Created
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Name:</strong> {{ defaultInstance.name }}</div>
                  <div><strong>Type:</strong> {{ defaultInstance.type }}</div>
                  <div><strong>Status:</strong> {{ defaultInstance.status }}</div>
                  <div><strong>Position:</strong> {{ defaultInstance.position }}</div>
                </div>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">Position</span>
                </label>
                <select class="select select-bordered" v-model="defaultForm.position">
                  <option value="EDGE_IN">EDGE_IN</option>
                  <option value="EDGE_OUT">EDGE_OUT</option>
                  <option value="INTERNAL">INTERNAL</option>
                  <option value="REMOTE">REMOTE</option>
                  <option value="ANY">ANY</option>
                </select>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Start IP</span>
                  </label>
                  <input 
                    type="text" 
                    class="input input-bordered" 
                    v-model="defaultForm.startIP"
                    placeholder="224.10.10.10"
                  />
                </div>
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">End IP</span>
                  </label>
                  <input 
                    type="text" 
                    class="input input-bordered" 
                    v-model="defaultForm.endIP"
                    placeholder="224.10.10.100"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Start MC Port</span>
                  </label>
                  <input 
                    type="number" 
                    class="input input-bordered" 
                    v-model.number="defaultForm.startMCPort"
                    placeholder="2000"
                  />
                </div>
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">End MC Port</span>
                  </label>
                  <input 
                    type="number" 
                    class="input input-bordered" 
                    v-model.number="defaultForm.endMCPort"
                    placeholder="2000"
                  />
                </div>
              </div>

              <button 
                class="btn btn-primary w-full" 
                @click="updateDefaultConfiguration" 
                :disabled="updatingDefault"
              >
                <span v-if="updatingDefault" class="loading loading-spinner loading-sm mr-2"></span>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {{ updatingDefault ? 'Updating...' : 'Update Default Configuration' }}
              </button>
            </div>

            <!-- Error Display -->
            <div v-if="defaultError" class="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ defaultError }}</span>
            </div>

            <div class="card-actions justify-between">
              <button class="btn btn-outline" @click="previousStep">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 15l-3-3m0 0l3-3m-3 3h8m-13 0a9 9 0 1118 0 9 9 0 01-18 0z" />
                </svg>
                Previous
              </button>
              <button 
                class="btn btn-primary" 
                @click="nextStep" 
                :disabled="!defaultInstance || !defaultConfigured"
              >
                Next: Finalization
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Step 4: Finalization -->
          <div v-else-if="currentStep === 4" class="space-y-6">
            <h2 class="card-title text-2xl mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Configuration Complete
            </h2>

            <div class="alert alert-success">
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 class="font-bold">Setup Complete!</h3>
                <div class="text-xs">Your MediaHub application has been successfully configured and is ready to use.</div>
              </div>
            </div>

            <div class="bg-base-200 p-4 rounded-lg">
              <h3 class="font-semibold mb-3">Configuration Summary</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span>Application Validation:</span>
                  <span class="badge badge-success badge-sm">Complete</span>
                </div>
                <div class="flex justify-between">
                  <span>Admin Instance:</span>
                  <span class="badge badge-success badge-sm">Complete</span>
                </div>
                <div class="flex justify-between">
                  <span>Default Instance:</span>
                  <span class="badge badge-success badge-sm">Complete</span>
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
              <button class="btn btn-success" @click="finishConfiguration" :disabled="finishing">
                <span v-if="finishing" class="loading loading-spinner loading-sm mr-2"></span>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ finishing ? 'Finishing...' : 'Finish & Go to Dashboard' }}
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
import { apiGet, apiPost, apiPut } from '../services/api.js'

const router = useRouter()

// Navigation
const currentStep = ref(1)

// Step 1: Application Validation
const validating = ref(false)
const appProperties = ref(null)
const validationError = ref(null)

// Step 2: Admin Instance
const initiating = ref(false)
const updating = ref(false)
const adminInstance = ref(null)
const adminConfigured = ref(false)
const adminError = ref(null)
const adminForm = ref({
  position: 'EDGE_OUT',
  startIP: '224.10.10.10',
  endIP: '224.10.10.100',
  startMCPort: 2000,
  endMCPort: 2000
})

// Step 3: Default Instance
const initiatingDefault = ref(false)
const updatingDefault = ref(false)
const defaultInstance = ref(null)
const defaultConfigured = ref(false)
const defaultError = ref(null)
const defaultForm = ref({
  position: 'EDGE_OUT',
  startIP: '224.10.10.10',
  endIP: '224.10.10.100',
  startMCPort: 2000,
  endMCPort: 2000
})

// Step 4: Finalization
const finishing = ref(false)

// Methods for Step 1: Application Validation
const validateInstallation = async () => {
  try {
    validating.value = true
    validationError.value = null
    
    console.log('🔍 Wizard: Validating installation...')
    
    // Call the validation API
    const response = await apiPut('/utils/application/validateInstallation', {}, true)
    console.log('✅ Wizard: Installation validation successful:', response)
    
    // If validation is successful, get application properties
    appProperties.value = await ApplicationController.getAllProperties()
    console.log('📋 Wizard: Application properties loaded:', appProperties.value)
    
  } catch (error) {
    console.error('❌ Wizard: Installation validation failed:', error)
    validationError.value = `Installation validation failed: ${error.message}`
  } finally {
    validating.value = false
  }
}

// Methods for Step 2: Admin Instance Configuration
const initiateAdminConfiguration = async () => {
  try {
    initiating.value = true
    adminError.value = null
    
    console.log('🔍 Wizard: Initiating admin configuration...')
    
    // Call the initiate admin configuration API with empty body
    const response = await apiPost('/utils/instances/initiateAdminConfiguration', {}, true)
    console.log('✅ Wizard: Admin instance created:', response)
    
    adminInstance.value = response
    
  } catch (error) {
    console.error('❌ Wizard: Admin configuration initiation failed:', error)
    adminError.value = `Failed to create admin instance: ${error.message}`
  } finally {
    initiating.value = false
  }
}

const updateAdminConfiguration = async () => {
  try {
    updating.value = true
    adminError.value = null
    
    console.log('🔍 Wizard: Updating admin configuration...', adminForm.value)
    
    // Call the update admin configuration API
    const response = await apiPut('/utils/instances/updateAdminConfiguration', adminForm.value, true)
    console.log('✅ Wizard: Admin configuration updated:', response)
    
    adminConfigured.value = true
    
    // Show success message
    setTimeout(() => {
      adminError.value = null
    }, 3000)
    
  } catch (error) {
    console.error('❌ Wizard: Admin configuration update failed:', error)
    adminError.value = `Failed to update admin configuration: ${error.message}`
  } finally {
    updating.value = false
  }
}

// Methods for Step 3: Default Instance Configuration
const initiateDefaultConfiguration = async () => {
  try {
    initiatingDefault.value = true
    defaultError.value = null
    
    console.log('🔍 Wizard: Initiating default configuration...')
    
    // Call the initiate default configuration API with empty body
    const response = await apiPost('/utils/instances/initiateDefaultConfiguration', {}, true)
    console.log('✅ Wizard: Default instance created:', response)
    
    defaultInstance.value = response
    
  } catch (error) {
    console.error('❌ Wizard: Default configuration initiation failed:', error)
    defaultError.value = `Failed to create default instance: ${error.message}`
  } finally {
    initiatingDefault.value = false
  }
}

const updateDefaultConfiguration = async () => {
  try {
    updatingDefault.value = true
    defaultError.value = null
    
    console.log('🔍 Wizard: Updating default configuration...', defaultForm.value)
    
    // Call the update default configuration API
    const response = await apiPut('/utils/instances/updateDefaultConfiguration', defaultForm.value, true)
    console.log('✅ Wizard: Default configuration updated:', response)
    
    defaultConfigured.value = true
    
    // Show success message
    setTimeout(() => {
      defaultError.value = null
    }, 3000)
    
  } catch (error) {
    console.error('❌ Wizard: Default configuration update failed:', error)
    defaultError.value = `Failed to update default configuration: ${error.message}`
  } finally {
    updatingDefault.value = false
  }
}

// Navigation methods
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

const finishConfiguration = async () => {
  try {
    finishing.value = true
     
    console.log('✅ Wizard: Configuration completed, redirecting to dashboard...')
    
    // Redirect to the dashboard (main route)
    router.push('/')
    
  } catch (error) {
    console.error('❌ Wizard: Error finishing configuration:', error)
    // Show an error notification or stay on the wizard
  } finally {
    finishing.value = false
  }
}

const skipToDebugDashboard = () => {
  console.log('🐛 Debug: Forcing navigation to dashboard')
  router.push('/')
}

// Lifecycle
onMounted(() => {
  console.log('🧙‍♂️ Wizard: Component mounted')
})
</script>