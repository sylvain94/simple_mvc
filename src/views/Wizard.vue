<template>
  <div class="min-h-screen bg-base-200 flex justify-center p-4 pt-8">
    <div class="max-w-4xl w-full">
      <!-- Header -->
      <div class="text-center mb-6">
        <h1 class="text-4xl font-bold text-base-content mb-2">Configuration Wizard</h1>
        <p class="text-base-content/70">Welcome! Let's configure your MediaHub application</p>
      </div>

      <!-- Progress Steps -->
      <div class="flex justify-center mb-8">
        <ul class="steps steps-horizontal">
          <li class="step" :class="currentStep >= 1 ? 'step-primary' : ''">Application</li>
          <li class="step" :class="currentStep >= 2 ? 'step-primary' : ''">Admin Instance</li>
          <li class="step" :class="currentStep >= 3 ? 'step-primary' : ''">Default Instance</li>
          <li class="step" :class="currentStep >= 4 ? 'step-primary' : ''">Network</li>
          <li class="step" :class="currentStep >= 5 ? 'step-primary' : ''">Instance Interfaces</li>
          <li class="step" :class="currentStep >= 6 ? 'step-primary' : ''">Finalization</li>
        </ul>
      </div>

      <!-- Main Card -->
      <div class="card bg-base-100 shadow-xl min-h-[600px] max-h-[80vh] flex flex-col">
        <div class="card-body flex-1 flex flex-col overflow-hidden">
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

            <div class="card-actions justify-end">
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
                <input 
                  type="text" 
                  class="input input-bordered bg-base-200 cursor-not-allowed" 
                  value="ANY"
                  readonly
                  disabled
                />
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
                Next: Network
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Step 4: Network Configuration -->
          <div v-else-if="currentStep === 4" class="space-y-6">
            <!-- Header Section (Fixed) -->
            <div class="space-y-4">
              <h2 class="card-title text-2xl mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.881-6.08 2.33l-.147.083A7.994 7.994 0 0112 21.001z" />
                </svg>
                Network Configuration
              </h2>

              <div class="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <h3 class="font-bold">Network Interface Configuration</h3>
                  <div class="text-xs">Configure the stream direction for each network interface.</div>
                </div>
              </div>
            </div>

            <!-- Content Section (Scrollable) -->
            <div class="space-y-4">
              <!-- Refresh Network Interfaces Button -->
              <div v-if="!networkInterfaces.length" class="text-center">
                <button 
                  class="btn btn-primary btn-lg" 
                  @click="refreshNetworkInterfaces" 
                  :disabled="refreshingNetwork"
                >
                  <span v-if="refreshingNetwork" class="loading loading-spinner loading-sm mr-2"></span>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {{ refreshingNetwork ? 'Loading...' : 'Load Network Interfaces' }}
                </button>
              </div>

              <!-- Network Interfaces List -->
              <div v-if="networkInterfaces.length" class="space-y-4">
                <h3 class="font-semibold mb-3">Network Interfaces ({{ networkInterfaces.length }})</h3>
                
                <div class="overflow-x-auto max-h-64 overflow-y-auto border border-base-300 rounded-lg">
                  <table class="table w-full">
                    <thead class="sticky top-0 bg-base-200 z-10">
                      <tr>
                        <th>Interface</th>
                        <th>Status</th>
                        <th>IPv4 Address</th>
                        <th>Stream Direction</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="iface in networkInterfaces" :key="iface.id" class="hover">
                        <td>
                          <div class="font-bold">{{ iface.ifName }}</div>
                          <div class="text-sm opacity-70">{{ iface.ifMac }}</div>
                        </td>
                        <td>
                          <div class="badge" :class="iface.ifStatus === 'UP' ? 'badge-success' : 'badge-error'">
                            {{ iface.ifStatus }}
                          </div>
                        </td>
                        <td>
                          <code class="text-sm">{{ getIPv4Address(iface) }}</code>
                        </td>
                        <td>
                          <select 
                            class="select select-bordered select-sm" 
                            :value="iface.ifStreamDirection"
                            @change="updateInterfaceDirection(iface, $event.target.value)"
                            :disabled="updatingInterface === iface.ifName"
                          >
                            <option value="IN">IN</option>
                            <option value="OUT">OUT</option>
                            <option value="BOTH">BOTH</option>
                          </select>
                        </td>
                        <td>
                          <span v-if="updatingInterface === iface.ifName" class="loading loading-spinner loading-sm"></span>
                          <svg v-else-if="interfaceUpdateStatus[iface.ifName] === 'success'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <svg v-else-if="interfaceUpdateStatus[iface.ifName] === 'error'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <!-- Interface Summary -->
                <div class="text-sm text-base-content/70 text-center">
                  Scroll to view all interfaces • Configure stream direction for each interface
                </div>
              </div>

              <!-- Error Display -->
              <div v-if="networkError" class="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ networkError }}</span>
              </div>
            </div>

            <!-- Navigation Buttons (Always Visible) -->
            <div class="card-actions justify-between pt-4 border-t border-base-300">
              <button class="btn btn-outline" @click="previousStep">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 15l-3-3m0 0l3-3m-3 3h8m-13 0a9 9 0 1118 0 9 9 0 01-18 0z" />
                </svg>
                Previous
              </button>
              <button 
                class="btn btn-primary" 
                @click="nextStep" 
                :disabled="!networkInterfaces.length"
              >
                Next: Instance Interfaces
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Step 5: Instance Interfaces Configuration -->
          <div v-else-if="currentStep === 5" class="flex flex-col ">
            <!-- Header Section -->
            <div class="flex-shrink-0 space-y-4 mb-4">
              <h2 class="card-title text-2xl mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
                Instance Interfaces Configuration
              </h2>


              <!-- Global Configuration Dropdown -->

            </div>

            <!-- Content Section -->
            <div class="flex-1 flex flex-col min-h-0">
              <!-- Loading State -->
              <div v-if="loadingInstanceInterfaces" class="flex justify-center items-center py-8">
                <span class="loading loading-spinner loading-lg"></span>
                <span class="ml-3">Loading instances and interfaces...</span>
              </div>

              <!-- Error State -->
              <div v-else-if="instanceInterfacesError" class="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ instanceInterfacesError }}</span>
              </div>

              <!-- Instance Configuration Overview -->
              <div v-else class="flex-1 overflow-y-auto space-y-4 pr-2">
                <h3 class="font-semibold text-lg mb-4">Configuration Overview</h3>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div v-for="instance in instances" :key="instance.id" class="card bg-base-200/50 border-2" 
                       :class="isInstanceFullyConfigured(instance.id) ? 'border-success/30' : 'border-warning/30'">
                    <div class="card-body p-4">
                      <div class="flex items-center justify-between mb-3">
                        <h4 class="card-title text-base">
                          <div class="badge badge-primary badge-sm mr-2">{{ instance.type }}</div>
                          {{ instance.name }}
                        </h4>
                        <div class="badge" :class="isInstanceFullyConfigured(instance.id) ? 'badge-success' : 'badge-warning'">
                          {{ isInstanceFullyConfigured(instance.id) ? 'Complete' : 'Incomplete' }}
                        </div>
                      </div>
                      
                      <!-- Interface Configuration Display -->
                      <div class="space-y-3">
                        <div class="flex items-center justify-between p-2 bg-base-300/50 rounded">
                          <span class="text-sm font-medium">Input Interface (IN):</span>
                          <div class="flex items-center gap-2">
                            <select 
                              :value="getInstanceInputInterface(instance.id)"
                              @change="(event) => updateInstanceInterface(instance.id, 'inputInterface', event.target.value)"
                              class="select select-bordered select-sm min-w-[140px]"
                              :class="{ 'select-error': !getInstanceInputInterface(instance.id) }"
                            >
                              <option value="">Not set</option>
                              <option 
                                v-for="iface in availableInputInterfaces" 
                                :key="iface.ifName" 
                                :value="iface.ifName"
                              >
                                {{ iface.ifName }} ({{ getIPv4Address(iface) }})
                              </option>
                            </select>
                          </div>
                        </div>
                        
                        <div class="flex items-center justify-between p-2 bg-base-300/50 rounded">
                          <span class="text-sm font-medium">Output Interface (OUT):</span>
                          <div class="flex items-center gap-2">
                            <select 
                              :value="getInstanceOutputInterface(instance.id)"
                              @change="(event) => updateInstanceInterface(instance.id, 'outputInterface', event.target.value)"
                              class="select select-bordered select-sm min-w-[140px]"
                              :class="{ 'select-error': !getInstanceOutputInterface(instance.id) }"
                            >
                              <option value="">Not set</option>
                              <option 
                                v-for="iface in availableOutputInterfaces" 
                                :key="iface.ifName" 
                                :value="iface.ifName"
                              >
                                {{ iface.ifName }} ({{ getIPv4Address(iface) }})
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <!-- Instance Details -->
                      <div class="mt-3 p-2 bg-base-300/30 rounded text-xs space-y-1">
                        <div><strong>Position:</strong> {{ instance.position }}</div>
                        <div><strong>IP Range:</strong> {{ instance.startIP }} - {{ instance.endIP }}</div>
                        <div><strong>Port Range:</strong> {{ instance.startMCPort }} - {{ instance.endMCPort }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Global Configuration Summary -->
              </div>
            </div>

            <!-- Navigation - Always visible at bottom -->
            <div class="flex-shrink-0 flex justify-between pt-6 mt-6 border-t border-base-300">
              <button 
                class="btn btn-outline" 
                @click="currentStep = 4"
                :disabled="loadingInstanceInterfaces"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Previous
              </button>
              
              <button 
                class="btn btn-primary" 
                @click="proceedToFinalization"
                :disabled="loadingInstanceInterfaces || !allInstanceInterfacesConfigured"
              >
                <span v-if="savingInstanceInterfaces" class="loading loading-spinner loading-sm mr-2"></span>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                {{ savingInstanceInterfaces ? 'Saving...' : 'Continue to Finalization' }}
              </button>
            </div>
          </div>

          <!-- Step 6: Finalization -->
          <div v-else-if="currentStep === 6" class="space-y-6">
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
import { ref, computed, watch, onMounted } from 'vue'
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
  position: 'ANY', // Admin instance position is always ANY
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

// Step 4: Network Configuration
const refreshingNetwork = ref(false)
const networkInterfaces = ref([])
const networkError = ref(null)
const updatingInterface = ref(null)
const interfaceUpdateStatus = ref({})

// Step 5: Instance Interfaces Configuration
const loadingInstanceInterfaces = ref(false)
const savingInstanceInterfaces = ref(false)
const instanceInterfacesError = ref(null)
const instances = ref([])
const instanceInterfaceConfig = ref({})
const availableInputInterfaces = ref([])
const availableOutputInterfaces = ref([])

// Global dropdown menu variables
const selectedInstanceId = ref('')
const selectedInterfaceType = ref('')
const selectedInterface = ref('')

// Step 6: Finalization
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

// Methods for Step 4: Network Configuration
const refreshNetworkInterfaces = async () => {
  try {
    refreshingNetwork.value = true
    networkError.value = null
    
    console.log('🔍 Wizard: Refreshing network interfaces...')
    
    // First, refresh the interfaces list
    await apiGet('/utils/ifs/refreshAll', true)
    console.log('✅ Wizard: Network interfaces refreshed')
    
    // Then, get the updated list
    const interfaces = await apiGet('/utils/ifs/getAll', true)
    console.log('📋 Wizard: Network interfaces loaded:', interfaces)
    
    // Filter only interfaces with status "UP"
    const upInterfaces = interfaces.filter(iface => iface.ifStatus === 'UP')
    console.log(`📋 Wizard: Filtered ${upInterfaces.length} UP interfaces from ${interfaces.length} total interfaces`)
    
    networkInterfaces.value = upInterfaces
    
  } catch (error) {
    console.error('❌ Wizard: Network interfaces loading failed:', error)
    networkError.value = `Failed to load network interfaces: ${error.message}`
  } finally {
    refreshingNetwork.value = false
  }
}

const updateInterfaceDirection = async (iface, newDirection) => {
  try {
    updatingInterface.value = iface.ifName
    interfaceUpdateStatus.value[iface.ifName] = null
    
    console.log(`🔍 Wizard: Updating ${iface.ifName} direction to ${newDirection}...`)
    
    let endpoint = ''
    if (newDirection === 'IN') {
      endpoint = `/utils/ifs/configureToINStreams/${iface.ifName}`
    } else if (newDirection === 'OUT') {
      endpoint = `/utils/ifs/configureToOUTStreams/${iface.ifName}`
    } else if (newDirection === 'BOTH') {
      endpoint = `/utils/ifs/configureToOUTStreams/${iface.ifName}` // Note: BOTH uses OUT endpoint as specified
    }
    
    const response = await apiPut(endpoint, {}, true)
    console.log(`✅ Wizard: ${iface.ifName} direction updated:`, response)
    
    // Update the interface in the local array
    const interfaceIndex = networkInterfaces.value.findIndex(i => i.id === iface.id)
    if (interfaceIndex !== -1) {
      networkInterfaces.value[interfaceIndex].ifStreamDirection = newDirection
    }
    
    interfaceUpdateStatus.value[iface.ifName] = 'success'
    
    // Clear success status after 3 seconds
    setTimeout(() => {
      interfaceUpdateStatus.value[iface.ifName] = null
    }, 3000)
    
  } catch (error) {
    console.error(`❌ Wizard: ${iface.ifName} direction update failed:`, error)
    interfaceUpdateStatus.value[iface.ifName] = 'error'
    
    // Clear error status after 5 seconds
    setTimeout(() => {
      interfaceUpdateStatus.value[iface.ifName] = null
    }, 5000)
  } finally {
    updatingInterface.value = null
  }
}

const getIPv4Address = (iface) => {
  if (!iface.ifAddresses || !Array.isArray(iface.ifAddresses)) {
    return 'N/A'
  }
  
  // Find the first IPv4 address (not IPv6)
  const ipv4 = iface.ifAddresses.find(addr => 
    addr && !addr.includes(':') && !addr.includes('%')
  )
  
  return ipv4 || 'N/A'
}

// Navigation methods
const nextStep = () => {
  if (currentStep.value < 6) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// Methods for Step 5: Instance Interfaces Configuration
const loadInstancesAndInterfaces = async () => {
  try {
    loadingInstanceInterfaces.value = true
    instanceInterfacesError.value = null
    
    console.log('🔍 Wizard: Loading instances and interfaces...')
    
    // Load instances (admin and default)
    const instancesList = []
    
    if (adminInstance.value) {
      instancesList.push(adminInstance.value)
    }
    
    if (defaultInstance.value) {
      instancesList.push(defaultInstance.value)
    }
    
    instances.value = instancesList
    console.log('📋 Wizard: Instances loaded:', instancesList)
    
    // Initialize interface configuration for each instance
    instancesList.forEach(instance => {
      if (!instanceInterfaceConfig.value[instance.id]) {
        instanceInterfaceConfig.value[instance.id] = {
          inputInterface: '',
          outputInterface: ''
        }
      }
    })
    
    // Load available interfaces (filter UP interfaces)
    const allInterfaces = await apiGet('/utils/ifs/getAll', true)
    const upInterfaces = allInterfaces.filter(iface => iface.ifStatus === 'UP')
    
    // Separate interfaces by direction for better UX
    availableInputInterfaces.value = upInterfaces.filter(iface => 
      iface.ifStreamDirection === 'IN' || iface.ifStreamDirection === 'BOTH'
    )
    
    availableOutputInterfaces.value = upInterfaces.filter(iface => 
      iface.ifStreamDirection === 'OUT' || iface.ifStreamDirection === 'BOTH'
    )
    
    console.log('📋 Wizard: Available input interfaces:', availableInputInterfaces.value.length)
    console.log('📋 Wizard: Available output interfaces:', availableOutputInterfaces.value.length)
    
  } catch (error) {
    console.error('❌ Wizard: Failed to load instances and interfaces:', error)
    instanceInterfacesError.value = `Failed to load instances and interfaces: ${error.message}`
  } finally {
    loadingInstanceInterfaces.value = false
  }
}

const updateInstanceInterface = (instanceId, interfaceType, value) => {
  if (!instanceInterfaceConfig.value[instanceId]) {
    instanceInterfaceConfig.value[instanceId] = {
      inputInterface: '',
      outputInterface: ''
    }
  }
  instanceInterfaceConfig.value[instanceId][interfaceType] = value
  console.log(`🔧 Wizard: Updated ${instanceId} ${interfaceType} to ${value}`)
}

const proceedToFinalization = async () => {
  try {
    savingInstanceInterfaces.value = true
    instanceInterfacesError.value = null
    
    console.log('🔍 Wizard: Saving instance interface configuration...')
    console.log('📋 Wizard: Instance interface config:', instanceInterfaceConfig.value)
    
    // Here you could save the interface configuration to the backend if needed
    // For now, we'll just proceed to finalization
    
    // Move to finalization step
    currentStep.value = 6
    
  } catch (error) {
    console.error('❌ Wizard: Failed to save instance interfaces:', error)
    instanceInterfacesError.value = `Failed to save configuration: ${error.message}`
  } finally {
    savingInstanceInterfaces.value = false
  }
}

// Computed property to check if all instances have interfaces configured
const allInstanceInterfacesConfigured = computed(() => {
  return instances.value.every(instance => {
    const config = instanceInterfaceConfig.value[instance.id]
    return config && config.inputInterface && config.outputInterface
  })
})

// New methods for global dropdown menu
const getAvailableInterfacesForType = (interfaceType) => {
  if (interfaceType === 'inputInterface') {
    return availableInputInterfaces.value
  } else if (interfaceType === 'outputInterface') {
    return availableOutputInterfaces.value
  }
  return []
}

const onInstanceSelectionChange = () => {
  // Reset interface type and interface when instance changes
  selectedInterfaceType.value = ''
  selectedInterface.value = ''
}

const applyInterfaceConfiguration = () => {
  if (selectedInstanceId.value && selectedInterfaceType.value && selectedInterface.value) {
    updateInstanceInterface(selectedInstanceId.value, selectedInterfaceType.value, selectedInterface.value)
    
    // Reset selections after applying
    selectedInterface.value = ''
    
    console.log(`🔧 Wizard: Applied ${selectedInterfaceType.value} = ${selectedInterface.value} to instance ${selectedInstanceId.value}`)
  }
}


const isInstanceFullyConfigured = (instanceId) => {
  const config = instanceInterfaceConfig.value[instanceId]
  return config && config.inputInterface && config.outputInterface
}

const getInstanceInputInterface = (instanceId) => {
  const config = instanceInterfaceConfig.value[instanceId]
  return config ? config.inputInterface : ''
}

const getInstanceOutputInterface = (instanceId) => {
  const config = instanceInterfaceConfig.value[instanceId]
  return config ? config.outputInterface : ''
}

const getConfiguredInstancesCount = () => {
  return instances.value.filter(instance => isInstanceFullyConfigured(instance.id)).length
}


const clearAllConfigurations = () => {
  console.log('🧹 Wizard: Clearing all interface configurations...')
  
  instances.value.forEach(instance => {
    if (instanceInterfaceConfig.value[instance.id]) {
      instanceInterfaceConfig.value[instance.id].inputInterface = ''
      instanceInterfaceConfig.value[instance.id].outputInterface = ''
    }
  })
  
  // Reset dropdown selections
  selectedInstanceId.value = ''
  selectedInterfaceType.value = ''
  selectedInterface.value = ''
  
  console.log('✅ Wizard: All configurations cleared')
}

// Watch for step changes to load data when entering step 5
watch(currentStep, async (newStep) => {
  if (newStep === 5) {
    await loadInstancesAndInterfaces()
  }
})

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

// Lifecycle
onMounted(() => {
  console.log('🧙‍♂️ Wizard: Component mounted')
})
</script>