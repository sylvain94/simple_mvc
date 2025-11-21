<template>
  <div class="h-screen overflow-y-auto bg-base-200" style="height: 100vh; overflow-y: auto;">
    <div class="min-h-screen bg-base-200 flex justify-center p-4 pt-8 pb-20" style="min-height: 120vh;">
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
          <li class="step" :class="currentStep >= 2 ? 'step-primary' : ''">Network</li>
          <li class="step" :class="currentStep >= 3 ? 'step-primary' : ''">Admin Instance</li>
          <li class="step" :class="currentStep >= 4 ? 'step-primary' : ''">Default Instance</li>
          <li class="step" :class="currentStep >= 5 ? 'step-primary' : ''">Finalization</li>
        </ul>
      </div>

      <!-- Main Card -->
      <div class="card bg-base-100 shadow-xl min-h-[600px] flex flex-col">
        <div class="card-body flex-1 flex flex-col overflow-hidden">
          <!-- Step 1: Application Configuration -->
          <div v-if="currentStep === 1" class="space-y-6">
            <h2 class="card-title text-2xl mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Application Configuration
            </h2>
            
            <!-- Two Column Layout -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <!-- Left Column: Form -->
              <div class="space-y-6">
                <h3 class="text-lg font-semibold text-base-content mb-4">Configuration Form</h3>
                
                <!-- Application Form -->
                <form @submit.prevent="validateApplicationForm" class="space-y-4">
                  <!-- Application Name (Editable) -->
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-medium">Application Name</span>
                      <span v-if="loadingMachineName" class="label-text-alt text-info">
                        <span class="loading loading-spinner loading-xs"></span>
                        Loading...
                      </span>
                      <span v-else class="label-text-alt">Auto-detected, editable</span>
                    </label>
                    <div class="input-group">
                      <input 
                        type="text" 
                        class="input input-bordered flex-1" 
                        v-model="applicationForm.name"
                        :placeholder="loadingMachineName ? 'Loading application name...' : 'Enter application name'"
                        @input="validateApplicationNameInput"
                        :class="{ 'input-error': applicationNameError }"
                        required
                      />
                      <button 
                        type="button"
                        class="btn btn-outline" 
                        @click="loadMachineName" 
                        :disabled="loadingMachineName"
                        title="Auto-detect from system"
                      >
                        <span v-if="loadingMachineName" class="loading loading-spinner loading-sm"></span>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    </div>
                    <label class="label">
                      <span v-if="applicationNameError" class="label-text-alt text-error">{{ applicationNameError }}</span>
                      <span v-else class="label-text-alt">This will be used as the application identifier in the configuration</span>
                    </label>
                  </div>

                  <!-- Description (Optional) -->
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-medium">Description</span>
                      <span class="label-text-alt">Optional</span>
                    </label>
                    <textarea 
                      class="textarea textarea-bordered" 
                      placeholder="MediaHub is a media server that allows you to stream media to your clients"
                      v-model="applicationForm.description"
                      rows="3"
                    ></textarea>
                    <label class="label">
                      <span class="label-text-alt">Describe the purpose or role of this MediaHub installation</span>
                    </label>
                  </div>

                  <!-- Licence (Optional) -->
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-medium">Licence</span>
                      <span class="label-text-alt">Optional</span>
                    </label>
                    <input 
                      type="text" 
                      class="input input-bordered" 
                      placeholder="Enter licence key if available"
                      v-model="applicationForm.licence"
                    />
                    <label class="label">
                      <span class="label-text-alt">Leave empty if no licence is required</span>
                    </label>
                  </div>
                </form>

                  <!-- Error Display -->
                  <div v-if="applicationError" class="alert alert-error">
                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ applicationError }}</span>
                    <button 
                      type="button"
                      class="btn btn-sm btn-outline" 
                      @click="loadMachineName"
                      :disabled="loadingMachineName"
                    >
                      Retry
                    </button>
                  </div>
              </div>

              <!-- Right Column: Preview -->
              <div class="space-y-6">
                <h3 class="text-lg font-semibold text-base-content mb-4">Configuration Preview</h3>
                
                <!-- Configuration Preview -->
                <div v-if="applicationForm.name" class="bg-success/10 p-6 rounded-lg border border-success/20 h-fit">
                  <h4 class="font-semibold mb-4 flex items-center gap-2 text-success">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Application Configuration
                  </h4>
                  
                  <div class="space-y-3 text-sm">
                    <div class="flex flex-col">
                      <span class="font-medium text-base-content/70 mb-1">Name:</span>
                      <span class="font-mono bg-base-200 px-2 py-1 rounded">{{ applicationForm.name }}</span>
                    </div>
                    
                    <div class="flex flex-col">
                      <span class="font-medium text-base-content/70 mb-1">Description:</span>
                      <span class="bg-base-200 px-2 py-1 rounded min-h-[2rem] flex items-center">
                        {{ applicationForm.description || 'Not specified' }}
                      </span>
                    </div>
                    
                    <div class="flex flex-col">
                      <span class="font-medium text-base-content/70 mb-1">Licence:</span>
                      <span class="font-mono bg-base-200 px-2 py-1 rounded">
                        {{ applicationForm.licence || 'No licence specified' }}
                      </span>
                    </div>
                  </div>

                  <!-- JSON Preview -->
                  <div class="mt-6 pt-4 border-t border-success/20">
                    <h5 class="font-medium mb-2 text-success flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      JSON Output
                    </h5>
                    <pre class="text-xs bg-base-100 p-3 rounded border overflow-x-auto"><code>{
  "application": {
    "name": "{{ applicationForm.name }}",
    "description": "{{ applicationForm.description || 'MediaHub is a media server that allows you to stream media to your clients' }}",
    "licence": {{ applicationForm.licence ? `"${applicationForm.licence}"` : 'null' }}
  }
}</code></pre>
                  </div>
                </div>

                <!-- Loading State -->
                <div v-else class="bg-base-200/50 p-6 rounded-lg border border-base-300 h-fit">
                  <div class="flex items-center justify-center py-8">
                    <div class="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p class="text-base-content/60">Configuration preview will appear here</p>
                      <p class="text-sm text-base-content/40 mt-1">Fill in the form to see the preview</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Navigation -->
            <div class="card-actions justify-end pt-4 border-t border-base-300">
              <button 
                class="btn btn-primary" 
                @click="nextStep" 
                :disabled="!applicationForm.name || loadingMachineName"
              >
                Next: Network Configuration
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Step 3: Admin Instance Configuration -->
          <div v-else-if="currentStep === 3" class="space-y-6">
            <h2 class="card-title text-2xl mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Admin Instance Configuration
            </h2>

            <!-- Two Column Layout -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <!-- Left Column: Form -->
              <div class="space-y-6">
                <h3 class="text-lg font-semibold text-base-content mb-4">Instance Configuration</h3>
                
                <!-- Admin Instance Form -->
                <form @submit.prevent="validateAdminForm" class="space-y-4">
                  <!-- Instance Name -->
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-medium">Instance Name</span>
                    </label>
                    <input 
                      type="text" 
                      class="input input-bordered" 
                      v-model="adminForm.name"
                      placeholder="admin-instance"
                    />
                  </div>

                  <!-- Description -->
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-medium">Description</span>
                      <span class="label-text-alt">Optional</span>
                    </label>
                    <input 
                      type="text" 
                      class="input input-bordered" 
                      v-model="adminForm.description"
                      placeholder="Dedicated to the admin team"
                    />
                  </div>

                  <!-- Licence -->
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-medium">Licence</span>
                      <span class="label-text-alt">Optional</span>
                    </label>
                    <input 
                      type="text" 
                      class="input input-bordered" 
                      v-model="adminForm.licence"
                      placeholder="Enter licence key if available"
                    />
                  </div>

                  <!-- Type (Fixed) -->
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-medium">Type</span>
                    </label>
                    <input 
                      type="text" 
                      class="input input-bordered bg-base-200 cursor-not-allowed" 
                      value="ADMIN"
                      readonly
                      disabled
                    />
                  </div>

                  <!-- Status (Fixed) -->
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-medium">Status</span>
                    </label>
                    <input 
                      type="text" 
                      class="input input-bordered bg-base-200 cursor-not-allowed" 
                      value="ACTIVE"
                      readonly
                      disabled
                    />
                  </div>

                  <!-- Position (Fixed) -->
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

                  <!-- IP Range -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-medium">Start IP</span>
                      </label>
                      <input 
                        type="text" 
                        class="input input-bordered" 
                        v-model="adminForm.startIP"
                        placeholder="239.0.0.0"
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
                        placeholder="239.0.0.255"
                      />
                    </div>
                  </div>

                  <!-- Port Range -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-medium">Start MC Port</span>
                      </label>
                      <input 
                        type="number" 
                        class="input input-bordered" 
                        v-model.number="adminForm.startMCPort"
                        placeholder="4000"
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
                        placeholder="6535"
                      />
                    </div>
                  </div>
                </form>

                <!-- Error Display -->
                <div v-if="adminError" class="alert alert-error">
                  <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ adminError }}</span>
                </div>
              </div>

              <!-- Right Column: Preview -->
              <div class="space-y-6">
                <h3 class="text-lg font-semibold text-base-content mb-4">JSON Preview</h3>
                
                <!-- Configuration Preview -->
                <div class="bg-success/10 p-6 rounded-lg border border-success/20 h-fit">
                  <h4 class="font-semibold mb-4 flex items-center gap-2 text-success">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Admin Instance Configuration
                  </h4>

                  <!-- JSON Preview -->
                  <div class="mt-4">
                    <h5 class="font-medium mb-2 text-success flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      JSON Output
                    </h5>
                    <pre class="text-xs bg-base-100 p-3 rounded border overflow-x-auto max-h-96 overflow-y-auto"><code>{
  "name": "{{ adminForm.name }}",
  "licence": {{ adminForm.licence ? `"${adminForm.licence}"` : 'null' }},
  "description": "{{ adminForm.description }}",
  "type": "{{ adminForm.type }}",
  "status": "{{ adminForm.status }}",
  "position": "{{ adminForm.position }}",
  "startIP": "{{ adminForm.startIP }}",
  "endIP": "{{ adminForm.endIP }}",
  "startMCPort": {{ adminForm.startMCPort }},
  "endMCPort": {{ adminForm.endMCPort }},
  "interfaces": "auto"
}</code></pre>
                    <div class="mt-3 p-2 bg-info/10 rounded border border-info/20">
                      <p class="text-xs text-info">
                        <strong>Note:</strong> The admin instance automatically inherits all network interfaces. 
                        The "interfaces" field will be populated with all available interfaces at runtime.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Navigation -->
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
                :disabled="!validateAdminForm()"
              >
                Next: Default Instance
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Step 4: Default Instance Configuration -->
          <div v-else-if="currentStep === 4" class="space-y-6">
            <h2 class="card-title text-2xl mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Default Instance Configuration
            </h2>

            <!-- Two Column Layout -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <!-- Left Column: Form -->
              <div class="space-y-6">
                <h3 class="text-lg font-semibold text-base-content mb-4">Instance Configuration</h3>
                
                <!-- Default Instance Form -->
                <form @submit.prevent="validateDefaultForm" class="space-y-4">
                  <!-- Instance Name -->
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-medium">Instance Name</span>
                    </label>
                    <input 
                      type="text" 
                      class="input input-bordered" 
                      v-model="defaultForm.name"
                      placeholder="default-instance"
                    />
                  </div>

                  <!-- Description -->
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-medium">Description</span>
                      <span class="label-text-alt">Optional</span>
                    </label>
                    <input 
                      type="text" 
                      class="input input-bordered" 
                      v-model="defaultForm.description"
                      placeholder="Default instance for MediaHub"
                    />
                  </div>

                  <!-- Licence -->
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-medium">Licence</span>
                      <span class="label-text-alt">Optional</span>
                    </label>
                    <input 
                      type="text" 
                      class="input input-bordered" 
                      v-model="defaultForm.licence"
                      placeholder="Enter licence key if available"
                    />
                  </div>

                  <!-- Type (Fixed) -->
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-medium">Type</span>
                    </label>
                    <input 
                      type="text" 
                      class="input input-bordered bg-base-200 cursor-not-allowed" 
                      value="DEFAULT"
                      readonly
                      disabled
                    />
                  </div>

                  <!-- Status (Fixed) -->
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-medium">Status</span>
                    </label>
                    <input 
                      type="text" 
                      class="input input-bordered bg-base-200 cursor-not-allowed" 
                      value="ACTIVE"
                      readonly
                      disabled
                    />
                  </div>

                  <!-- Position (Editable) -->
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

                  <!-- IP Range -->
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

                  <!-- Port Range -->
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
                </form>

                <!-- Network Interfaces Section -->
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <h4 class="text-md font-semibold text-base-content">Network Interfaces</h4>
                    <div class="flex gap-2">
                      <button 
                        type="button"
                        class="btn btn-sm btn-outline" 
                        @click="loadNetworkInterfaces"
                        :disabled="loadingNetworkInterfaces"
                      >
                        <span v-if="loadingNetworkInterfaces" class="loading loading-spinner loading-sm mr-1"></span>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {{ loadingNetworkInterfaces ? 'Loading...' : 'Refresh' }}
                      </button>
                      <button 
                        type="button"
                        class="btn btn-sm btn-primary" 
                        @click="addDefaultInterface"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Interface
                      </button>
                    </div>
                  </div>

                  <!-- Network Interfaces Error -->
                  <div v-if="networkInterfacesError" class="alert alert-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span>{{ networkInterfacesError }}</span>
                  </div>

                  <!-- Interface List -->
                  <div v-if="defaultForm.interfaces.length === 0" class="text-center py-8 bg-base-200/50 rounded-lg border border-dashed border-base-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.881-6.08 2.33l-.147.083A7.994 7.994 0 0112 21.001z" />
                    </svg>
                    <p class="text-base-content/60">No network interfaces configured</p>
                    <p class="text-sm text-base-content/40 mt-1">Click "Add Interface" to add one</p>
                  </div>

                  <div v-else class="space-y-3">
                    <div 
                      v-for="(iface, index) in defaultForm.interfaces" 
                      :key="index"
                      class="bg-base-200/50 p-4 rounded-lg border border-base-300"
                    >
                      <div class="flex items-center justify-between mb-3">
                        <h5 class="font-medium">Interface {{ index + 1 }}</h5>
                        <button 
                          type="button"
                          class="btn btn-xs btn-error" 
                          @click="removeDefaultInterface(index)"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      
                      <!-- 1ère ligne: Select Network Interface available -->
                      <div class="form-control mb-3">
                        <label class="label">
                          <span class="label-text font-medium text-sm">Select Network Interface available</span>
                          <span class="label-text-alt">{{ networkInterfaces.length }} total interfaces</span>
                        </label>
                        <select 
                          class="select select-bordered select-sm" 
                          :value="iface.ifName"
                          @change="selectDefaultNetworkInterface(index, $event.target.value)"
                        >
                          <option value="">Choose an interface...</option>
                          <option 
                            v-for="netIface in networkInterfaces" 
                            :key="netIface.ifName" 
                            :value="netIface.ifName"
                          >
                            {{ netIface.ifName }} ({{ getIPv4Address(netIface) }}) - {{ netIface.ifStreamDirection }}
                          </option>
                        </select>
                      </div>
                      
                      <!-- 2ème ligne: Stream Direction et Interface Name -->
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div class="form-control">
                          <label class="label">
                            <span class="label-text font-medium text-sm">Stream Direction</span>
                          </label>
                          <input 
                            type="text" 
                            class="input input-bordered input-sm bg-base-200 cursor-not-allowed" 
                            v-model="iface.ifStreamDirection"
                            placeholder="Auto-filled from interface"
                            readonly
                            disabled
                          />
                        </div>
                        
                        <div class="form-control">
                          <label class="label">
                            <span class="label-text font-medium text-sm">Interface Name</span>
                          </label>
                          <input 
                            type="text" 
                            class="input input-bordered input-sm bg-base-200 cursor-not-allowed" 
                            v-model="iface.ifName"
                            placeholder="Select interface above"
                            readonly
                            disabled
                          />
                        </div>
                      </div>
                      
                      <!-- 3ème ligne: IP Address -->
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text font-medium text-sm">IP Address</span>
                        </label>
                        <input 
                          type="text" 
                          class="input input-bordered input-sm bg-base-200 cursor-not-allowed" 
                          v-model="iface.ifAddresses[0]"
                          placeholder="Auto-filled from interface"
                          readonly
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Error Display -->
                <div v-if="defaultError" class="alert alert-error">
                  <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ defaultError }}</span>
                </div>
              </div>

              <!-- Right Column: Preview -->
              <div class="space-y-6">
                <h3 class="text-lg font-semibold text-base-content mb-4">JSON Preview</h3>
                
                <!-- Configuration Preview -->
                <div class="bg-success/10 p-6 rounded-lg border border-success/20 h-fit">
                  <h4 class="font-semibold mb-4 flex items-center gap-2 text-success">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Default Instance Configuration
                  </h4>

                  <!-- JSON Preview -->
                  <div class="mt-4">
                    <h5 class="font-medium mb-2 text-success flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      JSON Output
                    </h5>
                    <pre class="text-xs bg-base-100 p-3 rounded border overflow-x-auto max-h-96 overflow-y-auto"><code>{
  "name": "{{ defaultForm.name }}",
  "licence": {{ defaultForm.licence ? `"${defaultForm.licence}"` : 'null' }},
  "description": "{{ defaultForm.description }}",
  "type": "{{ defaultForm.type }}",
  "status": "{{ defaultForm.status }}",
  "position": "{{ defaultForm.position }}",
  "startIP": "{{ defaultForm.startIP }}",
  "endIP": "{{ defaultForm.endIP }}",
  "startMCPort": {{ defaultForm.startMCPort }},
  "endMCPort": {{ defaultForm.endMCPort }},
  "interfaces": [{{ defaultForm.interfaces.filter(iface => iface.ifName && iface.ifName.trim() !== '').map((iface, index) => `
    {
      "ifName": "${iface.ifName}"
    }`).join(',') }}
  ]
}</code></pre>
                  </div>
                </div>
              </div>
            </div>

            <!-- Navigation -->
            <div class="card-actions justify-between pt-4 border-t border-base-300">
              <button class="btn btn-outline" @click="previousStep">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 15l-3-3m0 0l3-3m-3 3h8m-13 0a9 9 0 1118 0 9 9 0 01-18 0z" />
                </svg>
                Previous
              </button>
              <button 
                class="btn btn-primary" 
                @click="handleDefaultInstanceNext"
              >
                Next: Finalization
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Step 2: Network Configuration -->
          <div v-else-if="currentStep === 2" class="space-y-6">
            <!-- Header Section (Fixed) -->
            <div class="space-y-4">
              <h2 class="card-title text-2xl mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.881-6.08 2.33l-.147.083A7.994 7.994 0 0112 21.001z" />
                </svg>
                Network Configuration
              </h2>

            </div>

            <!-- Content Section (Scrollable) -->
            <div class="space-y-4">
              <!-- Loading State -->
              <div v-if="refreshingNetwork && !networkInterfaces.length" class="text-center py-8">
                <span class="loading loading-spinner loading-lg"></span>
                <p class="mt-4 text-base-content/70">Loading network interfaces...</p>
              </div>

              <!-- Error State -->
              <div v-else-if="networkError && !networkInterfaces.length" class="text-center py-8">
                <div class="alert alert-error max-w-md mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span>{{ networkError }}</span>
                </div>
                <button 
                  class="btn btn-outline mt-4" 
                  @click="refreshNetworkInterfaces"
                  :disabled="refreshingNetwork"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Retry
                </button>
              </div>

              <!-- Network Interfaces List -->
              <div v-else-if="networkInterfaces.length" class="space-y-4">
                <div class="flex justify-between items-center mb-3">
                  <h3 class="font-semibold">Network Interfaces ({{ networkInterfaces.length }})</h3>
                  <button 
                    class="btn btn-outline btn-sm" 
                    @click="refreshNetworkInterfaces"
                    :disabled="refreshingNetwork"
                    title="Refresh network interfaces"
                  >
                    <span v-if="refreshingNetwork" class="loading loading-spinner loading-xs"></span>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                
                <div class="overflow-x-auto max-h-96 overflow-y-auto border border-base-300 rounded-lg">
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
              >
                Next: Admin Instance
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Step 5: Finalization -->
          <div v-else-if="currentStep === 5" class="space-y-6">
            <h2 class="card-title text-2xl mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Configuration Review & Apply
            </h2>


            <!-- Configuration Summary -->
            <div class="bg-base-200 p-4 rounded-lg">
              <h3 class="font-semibold mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Configuration Summary
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span>Application Validation:</span>
                    <span class="badge badge-success badge-sm">✓ Complete</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Admin Instance:</span>
                    <span class="badge badge-success badge-sm">✓ Complete</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Default Instance:</span>
                    <span class="badge badge-success badge-sm">✓ Complete</span>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span>Application Configuration:</span>
                    <span class="badge badge-success badge-sm">✓ Configured</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Network Interfaces:</span>
                    <span class="badge badge-success badge-sm">✓ {{ networkInterfaces.length }} configured</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Admin Instance:</span>
                    <span class="badge badge-success badge-sm">✓ Configured</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Default Instance:</span>
                    <span class="badge badge-success badge-sm">✓ Configured</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Ready to Apply:</span>
                    <span class="badge badge-success badge-sm">✓ Yes</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- JSON Preview Toggle -->
            <div class="text-center">
              <button 
                class="btn btn-outline btn-sm" 
                @click="showJsonPreview = !showJsonPreview; if (showJsonPreview) generateUnattendConfig()"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {{ showJsonPreview ? 'Hide' : 'Preview' }} unattend.json
              </button>
            </div>

            <!-- JSON Preview -->
            <div v-if="showJsonPreview" class="bg-base-300 p-4 rounded-lg">
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-semibold flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Generated unattend.json
                </h4>
                <button 
                  class="btn btn-xs btn-outline" 
                  @click="downloadUnattendJson"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download
                </button>
              </div>
              <pre class="text-xs bg-base-100 p-3 rounded border overflow-x-auto max-h-64 overflow-y-auto"><code>{{ JSON.stringify(unattendConfig, null, 2) }}</code></pre>
            </div>

            <!-- Action Buttons -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                class="btn btn-outline btn-lg" 
                @click="downloadUnattendJson"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download unattend.json
              </button>
              
              <button 
                class="btn btn-success btn-lg" 
                @click="applyUnattendConfiguration" 
                :disabled="finishing"
              >
                <span v-if="finishing" class="loading loading-spinner loading-sm mr-2"></span>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ finishing ? 'Applying Configuration...' : 'Apply Configuration Now' }}
              </button>
            </div>

            <!-- Navigation -->
            <div class="card-actions justify-between pt-4 border-t border-base-300">
              <button class="btn btn-outline" @click="previousStep">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 15l-3-3m0 0l3-3m-3 3h8m-13 0a9 9 0 1118 0 9 9 0 01-18 0z" />
                </svg>
                Previous
              </button>
              
              <div class="text-sm text-base-content/70">
                Review your configuration and choose an action above
              </div>
            </div>
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

// ================================
// WIZARD NAVIGATION & STATE
// ================================
const currentStep = ref(1)

// ================================
// STEP 1: APPLICATION CONFIGURATION
// ================================
const loadingMachineName = ref(false)
const applicationForm = ref({
  name: '',
  description: '',
  licence: ''
})
const applicationError = ref(null)
const applicationNameError = ref(null)

// ================================
// STEP 3: ADMIN INSTANCE CONFIGURATION
// ================================
const initiating = ref(false)
const updating = ref(false)
const adminInstance = ref(null)
const adminConfigured = ref(false)
const adminError = ref(null)
const adminForm = ref({
  name: 'admin-instance',
  licence: '',
  description: 'Dedicated to the admin team',
  type: 'ADMIN',
  status: 'ACTIVE',
  position: 'ANY', // Admin instance position is always ANY
  startIP: '239.0.0.0',
  endIP: '239.0.0.255',
  startMCPort: 4000,
  endMCPort: 6535,
  interfaces: []
})

// Network interfaces from API
const availableNetworkInterfaces = ref([])
const loadingNetworkInterfaces = ref(false)
const networkInterfacesError = ref(null)

// ================================
// STEP 4: DEFAULT INSTANCE CONFIGURATION
// ================================
const initiatingDefault = ref(false)
const updatingDefault = ref(false)
const defaultInstance = ref(null)
const defaultConfigured = ref(false)
const defaultError = ref(null)
const defaultForm = ref({
  name: 'default-instance',
  licence: '',
  description: 'Default instance for MediaHub',
  type: 'DEFAULT',
  status: 'ACTIVE',
  position: 'EDGE_OUT',
  startIP: '224.10.10.10',
  endIP: '224.10.10.100',
  startMCPort: 2000,
  endMCPort: 2000,
  interfaces: []
})

// ================================
// STEP 2: NETWORK CONFIGURATION
// ================================
const refreshingNetwork = ref(false)
const networkInterfaces = ref([])
const networkError = ref(null)
const updatingInterface = ref(null)
const interfaceUpdateStatus = ref({})

// ================================
// COMPUTED PROPERTIES
// ================================

// Filter available interfaces based on selected stream direction
const getFilteredInterfacesForDirection = (selectedDirection) => {
  if (!selectedDirection) {
    console.log('⚠️ Wizard: No stream direction selected')
    return []
  }
  
  if (!networkInterfaces.value.length) {
    console.log('⚠️ Wizard: No network interfaces available from Step 2 (Network Configuration)')
    return []
  }
  
  console.log(`🔍 Wizard: Filtering interfaces for direction: ${selectedDirection}`)
  console.log(`📋 Wizard: Available network interfaces from Step 2:`, networkInterfaces.value)
  
  let filteredInterfaces = []
  
  if (selectedDirection === 'BOTH') {
    // Show all interfaces that are configured as IN or OUT (exclude ADMIN)
    filteredInterfaces = networkInterfaces.value.filter(iface => 
      iface.ifStreamDirection === 'IN' || 
      iface.ifStreamDirection === 'OUT'
    )
  } else if (selectedDirection === 'IN') {
    // Show only interfaces configured as IN
    filteredInterfaces = networkInterfaces.value.filter(iface => 
      iface.ifStreamDirection === 'IN'
    )
  } else if (selectedDirection === 'OUT') {
    // Show only interfaces configured as OUT
    filteredInterfaces = networkInterfaces.value.filter(iface => 
      iface.ifStreamDirection === 'OUT'
    )
  }
  
  console.log(`✅ Wizard: Filtered ${filteredInterfaces.length} interfaces for direction ${selectedDirection}:`, filteredInterfaces)
  
  if (filteredInterfaces.length === 0) {
    console.log(`⚠️ Wizard: No interfaces found with direction ${selectedDirection}. Please configure interfaces in Step 2 (Network Configuration) first.`)
  }
  
  return filteredInterfaces
}

// ================================
// STEP 5: FINALIZATION
// ================================
const finishing = ref(false)

// Unattend JSON Configuration
const unattendConfig = ref({
  application: {
    name: 'MediaHub',
    description: 'MediaHub is a media server that allows you to stream media to your clients',
    licence: null
  },
  instances: []
})

const showJsonPreview = ref(false)

// Methods for generating unattend.json
const generateUnattendConfig = () => {
  console.log('📋 Wizard: Generating unattend.json configuration...')
  
  // Step 1: Application Configuration
  unattendConfig.value.application = {
    name: applicationForm.value.name || 'MediaHub',
    description: applicationForm.value.description || 'MediaHub is a media server that allows you to stream media to your clients',
    licence: applicationForm.value.licence || null
  }
  
  // Generate instances configuration from Steps 3 and 4
  const instancesConfig = []
  
  // Step 3: Admin Instance Configuration
  instancesConfig.push({
    name: adminForm.value.name || 'admin-instance',
    licence: adminForm.value.licence || null,
    description: adminForm.value.description || 'Dedicated to the admin team',
    type: 'ADMIN',
    status: 'ACTIVE',
    position: 'ANY', // Admin instance position is always ANY
    startIP: adminForm.value.startIP || '239.0.0.0',
    endIP: adminForm.value.endIP || '239.0.0.255',
    startMCPort: adminForm.value.startMCPort || 4000,
    endMCPort: adminForm.value.endMCPort || 6535,
    interfaces: 'auto' // Admin instance has automatic access to all interfaces
  })
  
  // Step 4: Default Instance Configuration
  // Transform interfaces to only keep the interface name (ifName)
  const simplifiedInterfaces = (defaultForm.value.interfaces || [])
    .filter(iface => iface.ifName && iface.ifName.trim() !== '') // Only keep configured interfaces
    .map(iface => ({
      ifName: iface.ifName
    }))
  
  instancesConfig.push({
    name: defaultForm.value.name || 'default-instance',
    licence: defaultForm.value.licence || null,
    description: defaultForm.value.description || 'Default instance for MediaHub',
    type: 'DEFAULT',
    status: 'ACTIVE',
    position: defaultForm.value.position || 'EDGE_OUT',
    startIP: defaultForm.value.startIP || '224.10.10.10',
    endIP: defaultForm.value.endIP || '224.10.10.100',
    startMCPort: defaultForm.value.startMCPort || 2000,
    endMCPort: defaultForm.value.endMCPort || 2000,
    interfaces: simplifiedInterfaces // Only interface names for M2M relationship
  })
  
  unattendConfig.value.instances = instancesConfig
  
  console.log('✅ Wizard: Unattend configuration generated:', unattendConfig.value)
  console.log('📋 Step 1 (Application):', unattendConfig.value.application)
  console.log('📋 Step 3 (Admin Instance):', instancesConfig[0])
  console.log('📋 Step 4 (Default Instance):', instancesConfig[1])
  
  return unattendConfig.value
}


const downloadUnattendJson = () => {
  const config = generateUnattendConfig()
  const jsonString = JSON.stringify(config, null, 4)
  
  // Create and download file
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'unattend.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  console.log('📥 Wizard: Unattend.json downloaded')
}

const applyUnattendConfiguration = async () => {
  try {
    finishing.value = true
    
    console.log('🚀 Wizard: Starting configuration application workflow...')
    
    // Generate the final configuration
    const config = generateUnattendConfig()
    console.log('📋 Wizard: Configuration to apply:', config)
    
    // Step 1: Activate application
    console.log('📋 Step 1: Activating application...')
    const activationResult = await apiPut('/utils/application/validateInstallation', null, true)
    console.log('✅ Step 1: Application activation result:', activationResult)
    
    // If we reach here without exception, the API returned 200, so activation is successful
    console.log('✅ Step 1: Application activation successful (HTTP 200)')
    
    // Step 2: Update description if not empty
    if (config.application.description && config.application.description.trim() !== '') {
      console.log('📋 Step 2: Updating application description...')
      await apiPut(`/utils/application/updateDescription/${encodeURIComponent(config.application.description)}`, null, true)
      console.log('✅ Step 2: Application description updated')
    } else {
      console.log('⏭️ Step 2: Skipping description update (empty description)')
    }
    
    // Step 3: Configure Admin Instance
    console.log('📋 Step 3: Configuring admin instance...')
    const adminInstanceResponse = await apiPost('/utils/instances/initiateAdminConfiguration', {}, true)
    console.log('✅ Step 3: Admin instance created:', adminInstanceResponse)
    
    const adminInstanceId = adminInstanceResponse.id || adminInstanceResponse.instanceId
    if (!adminInstanceId) {
      throw new Error('Failed to get admin instance ID from response')
    }
    
    // Step 4: Configure admin instance multicast IP range
    const adminInstance = config.instances.find(instance => instance.type === 'ADMIN')
    if (adminInstance) {
      console.log('📋 Step 4: Configuring admin instance multicast IP range...')
      await apiPut(`/utils/instances/defineMulticastAddressRange/startIP/${adminInstance.startIP}/endIP/${adminInstance.endIP}/instance/${adminInstanceId}`, null, true)
      console.log('✅ Step 4: Admin instance IP range configured')
      
      // Step 5: Configure admin instance port range
      console.log('📋 Step 5: Configuring admin instance port range...')
      await apiPut(`/utils/instances/defineMulticastPortRange/startPort/${adminInstance.startMCPort}/endPort/${adminInstance.endMCPort}/instance/${adminInstanceId}`, null, true)
      console.log('✅ Step 5: Admin instance port range configured')
    }
    
    // Step 6: Configure Default Instance
    console.log('📋 Step 6: Configuring default instance...')
    const defaultInstanceResponse = await apiPost('/utils/instances/initiateDefaultConfiguration', {}, true)
    console.log('✅ Step 6: Default instance created:', defaultInstanceResponse)
    
    const defaultInstanceId = defaultInstanceResponse.id || defaultInstanceResponse.instanceId
    if (!defaultInstanceId) {
      throw new Error('Failed to get default instance ID from response')
    }
    
    // Step 7: Configure default instance multicast IP range
    const defaultInstance = config.instances.find(instance => instance.type === 'DEFAULT')
    if (defaultInstance) {
        console.log('📋 Step 7: Configuring default instance multicast IP range...')
        await apiPut(`/utils/instances/defineMulticastPortRange/startPort/${adminInstance.startMCPort}/endPort/${adminInstance.endMCPort}/instance/${adminInstanceId}`, null, true)
        console.log('✅ Step 7: Default instance IP range configured')
        
        // Step 8: Configure default instance port range
        console.log('📋 Step 8: Configuring default instance port range...')
        await apiPut(`/utils/instances/defineMulticastPortRange/startPort/${defaultInstance.startMCPort}/endPort/${defaultInstance.endMCPort}/instance/${defaultInstanceId}`, null, true)
        console.log('✅ Step 8: Default instance port range configured')
      
      // Step 9: Bind network interfaces to default instance
      if (defaultInstance.interfaces && Array.isArray(defaultInstance.interfaces) && defaultInstance.interfaces.length > 0) {
        console.log('📋 Step 9: Binding network interfaces to default instance...')
        
        for (let i = 0; i < defaultInstance.interfaces.length; i++) {
          const interfaceConfig = defaultInstance.interfaces[i]
          if (interfaceConfig.ifName) {
            console.log(`📋 Step 9.${i + 1}: Binding interface ${interfaceConfig.ifName}...`)
            await apiPut(`/utils/instances/bindNetworkInterface/interface_name/${interfaceConfig.ifName}/instance/${defaultInstanceId}`, null, true)
            console.log(`✅ Step 9.${i + 1}: Interface ${interfaceConfig.ifName} bound successfully`)
          }
        }
        
        console.log('✅ Step 9: All network interfaces bound successfully')
      } else {
        console.log('⏭️ Step 9: No network interfaces to bind')
      }
    }
    
    console.log('🎉 Wizard: Configuration applied successfully! All steps completed with HTTP 200.')
    
    // Show success message briefly before redirect
    setTimeout(() => {
      console.log('🏠 Wizard: Redirecting to dashboard...')
      router.push('/')
    }, 1500)
    
  } catch (error) {
    console.error('❌ Wizard: Error applying configuration:', error)
    
    // Show error to user
    alert(`Configuration application failed: ${error.message}. Please check the console for details and try again.`)
    
  } finally {
    finishing.value = false
  }
}

// Helper function to try getting the real hostname
const tryGetRealHostname = async () => {
  try {
    // Method 1: Try a system command API if available
    try {
      console.log('🔍 Trying to get hostname via system command API...')
      const response = await apiGet('/utils/system/hostname', true)
      if (response && response.hostname) {
        console.log('✅ Got hostname from system API:', response.hostname)
        return response.hostname
      }
    } catch (error) {
      console.log('⚠️ System hostname API not available:', error.message)
    }

    // Method 2: Try getting hostname from environment info API
    try {
      console.log('🔍 Trying to get hostname via environment API...')
      const response = await apiGet('/utils/environment/info', true)
      if (response && (response.hostname || response.HOSTNAME || response.HOST)) {
        const hostname = response.hostname || response.HOSTNAME || response.HOST
        console.log('✅ Got hostname from environment API:', hostname)
        return hostname
      }
    } catch (error) {
      console.log('⚠️ Environment API not available:', error.message)
    }

    // Method 3: Try to extract from server headers or other sources
    try {
      console.log('🔍 Trying to get hostname via server info...')
      const response = await fetch(window.location.origin + '/api/v1/utils/server/info', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('session') ? JSON.parse(localStorage.getItem('session')).token : ''}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data && (data.hostname || data.serverName || data.host)) {
          const hostname = data.hostname || data.serverName || data.host
          console.log('✅ Got hostname from server info:', hostname)
          return hostname
        }
      }
    } catch (error) {
      console.log('⚠️ Server info API not available:', error.message)
    }

    // Method 4: Try to parse from URL or other browser info
    const url = new URL(window.location.href)
    if (url.hostname && !url.hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
      // If hostname is not an IP, try to use it
      const hostname = url.hostname.split('.')[0]
      if (hostname && hostname !== 'localhost') {
        console.log('✅ Extracted hostname from URL:', hostname)
        return hostname
      }
    }

    return null
  } catch (error) {
    console.error('❌ Error trying to get real hostname:', error)
    return null
  }
}

// ================================
// STEP 1 METHODS: APPLICATION CONFIGURATION
// ================================
const loadMachineName = async () => {
  try {
    loadingMachineName.value = true
    applicationError.value = null
    
    console.log('🔍 Wizard: Loading machine name...')
    
    // Try to get machine name from system properties
    try {
      const appProperties = await ApplicationController.getAllProperties()
      console.log('📋 Wizard: Application properties received:', appProperties)
      
      // Try different possible property names for machine name
      const machineName = appProperties.name || 
                         appProperties.machineName || 
                         appProperties.hostname || 
                         appProperties.instanceName ||
                         await tryGetRealHostname() ||
                         'dev-01'
      
      applicationForm.value.name = machineName
      console.log('✅ Wizard: Machine name loaded:', applicationForm.value.name)
      
    } catch (error) {
      console.error('⚠️ Wizard: Primary API call failed, trying alternative methods:', error)
      
      // Try alternative API endpoints for system information
      try {
        console.log('🔄 Wizard: Trying alternative system info API...')
        const systemInfo = await apiGet('/utils/system/info', true)
        console.log('📋 Wizard: System info received:', systemInfo)
        
        const machineName = systemInfo.hostname || 
                           systemInfo.name || 
                           systemInfo.machineName ||
                           await tryGetRealHostname() ||
                           'dev-01'
        
        applicationForm.value.name = machineName
        console.log('✅ Wizard: Machine name loaded from system info:', applicationForm.value.name)
        
      } catch (systemError) {
        console.error('⚠️ Wizard: System info API also failed, trying instances API:', systemError)
        
        // Try instances API which might have system information
        try {
          console.log('🔄 Wizard: Trying instances API for system info...')
          const instancesInfo = await apiGet('/utils/instances/getAllNetworkInterfaces', true)
          console.log('📋 Wizard: Instances info received:', instancesInfo)
          
          // Try to extract machine name from network interfaces or use IP-based name
          if (instancesInfo && instancesInfo.interfaces && instancesInfo.interfaces.length > 0) {
            // Look for a non-loopback interface with a meaningful name
            const mainInterface = instancesInfo.interfaces.find(iface => 
              iface.name && 
              !iface.name.includes('lo') && 
              !iface.name.includes('docker') &&
              !iface.name.includes('br-') &&
              iface.inetAddresses && 
              iface.inetAddresses.length > 0
            )
            
            if (mainInterface && mainInterface.inetAddresses[0]) {
              const ipAddress = mainInterface.inetAddresses[0].address.replace('/', '')
              const ipParts = ipAddress.split('.')
              if (ipParts.length === 4 && !ipAddress.startsWith('127.')) {
                applicationForm.value.name = `MediaHub-${ipParts[2]}-${ipParts[3]}`
                console.log('✅ Wizard: Using network-based name:', applicationForm.value.name)
              } else {
                throw new Error('No suitable IP found')
              }
            } else {
              throw new Error('No suitable network interface found')
            }
          } else {
            throw new Error('No network interfaces data')
          }
          
        } catch (instancesError) {
          console.error('⚠️ Wizard: Instances API also failed:', instancesError)
          
          // Final fallback: try to get hostname from browser if available
          try {
            const hostname = window.location.hostname
            console.log('🌐 Wizard: Browser hostname:', hostname)
            
            // Check if hostname is an IP address
            const isIPAddress = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)
            
            if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1' && !isIPAddress) {
              // Use hostname if it's a proper domain name
              applicationForm.value.name = hostname.split('.')[0] // Take first part of FQDN
              console.log('✅ Wizard: Using hostname from browser:', applicationForm.value.name)
            } else if (isIPAddress) {
              // If it's an IP, try to create a meaningful name
              const ipParts = hostname.split('.')
              applicationForm.value.name = `MediaHub-${ipParts[2]}-${ipParts[3]}`
              console.log('✅ Wizard: Using IP-based name:', applicationForm.value.name)
            } else {
              // Try to get the real hostname using different methods
              let machineName = await tryGetRealHostname()
              
              if (!machineName) {
                // Final fallback based on platform
                const platform = navigator.platform
                
                if (platform.includes('Linux')) {
                  machineName = 'dev-01' // Default Linux hostname pattern
                } else if (platform.includes('Win')) {
                  machineName = 'MediaHub-Windows'
                } else if (platform.includes('Mac')) {
                  machineName = 'MediaHub-Mac'
                } else {
                  machineName = 'MediaHub'
                }
              }
              
              applicationForm.value.name = machineName
              console.log('⚠️ Wizard: Using hostname-based fallback name:', applicationForm.value.name)
            }
          } catch (hostnameError) {
            // Final fallback - use the known hostname pattern
            applicationForm.value.name = 'dev-01'
            console.log('⚠️ Wizard: All methods failed, using default hostname:', applicationForm.value.name)
          }
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Wizard: Failed to load machine name:', error)
    applicationError.value = `Failed to load machine name: ${error.message}`
    // Use fallback hostname
    applicationForm.value.name = 'dev-01'
  } finally {
    loadingMachineName.value = false
  }
}

const validateApplicationNameInput = () => {
  const name = applicationForm.value.name.trim()
  
  // Clear previous errors
  applicationNameError.value = null
  
  if (!name) {
    return // Don't show error for empty field during typing
  }
  
  // Validate name format (alphanumeric, hyphens, underscores allowed)
  const nameRegex = /^[a-zA-Z0-9_-]+$/
  if (!nameRegex.test(name)) {
    applicationNameError.value = 'Only letters, numbers, hyphens, and underscores allowed'
    return
  }
  
  // Check minimum length
  if (name.length < 2) {
    applicationNameError.value = 'Must be at least 2 characters long'
    return
  }
  
  // Check maximum length
  if (name.length > 50) {
    applicationNameError.value = 'Must be less than 50 characters'
    return
  }
}

const validateApplicationForm = () => {
  // Basic validation - name is required
  if (!applicationForm.value.name || applicationForm.value.name.trim() === '') {
    applicationError.value = 'Application name is required'
    return false
  }
  
  // Validate name format (alphanumeric, hyphens, underscores allowed)
  const nameRegex = /^[a-zA-Z0-9_-]+$/
  if (!nameRegex.test(applicationForm.value.name.trim())) {
    applicationError.value = 'Application name can only contain letters, numbers, hyphens, and underscores'
    return false
  }
  
  // Check minimum length
  if (applicationForm.value.name.trim().length < 2) {
    applicationError.value = 'Application name must be at least 2 characters long'
    return false
  }
  
  // Check maximum length
  if (applicationForm.value.name.trim().length > 50) {
    applicationError.value = 'Application name must be less than 50 characters'
    return false
  }
  
  applicationError.value = null
  return true
}

// ================================
// STEP 3 METHODS: ADMIN INSTANCE CONFIGURATION
// ================================
const loadNetworkInterfaces = async () => {
  try {
    loadingNetworkInterfaces.value = true
    networkInterfacesError.value = null
    
    console.log('🔍 Admin: Loading network interfaces from API...')
    
    const response = await apiGet('/utils/instances/getAllNetworkInterfaces', true)
    console.log('✅ Admin: Network interfaces loaded:', response)
    
    // Transform API response to our format
    if (response && response.interfaces) {
      availableNetworkInterfaces.value = response.interfaces.map(iface => ({
        index: iface.index,
        name: iface.name,
        displayName: iface.display_name,
        mtu: iface.mtu,
        addresses: iface.inetAddresses.map(addr => addr.address).filter(addr => {
          // Filter out IPv6 and loopback addresses, keep only IPv4
          return !addr.includes(':') && !addr.startsWith('/127.') && !addr.includes('%')
        })
      })).filter(iface => 
        // Only keep interfaces with IPv4 addresses and exclude loopback
        iface.addresses.length > 0 && iface.name !== 'lo'
      )
      
      console.log('📋 Admin: Processed network interfaces:', availableNetworkInterfaces.value)
    }
    
  } catch (error) {
    console.error('❌ Admin: Failed to load network interfaces:', error)
    networkInterfacesError.value = `Failed to load network interfaces: ${error.message}`
  } finally {
    loadingNetworkInterfaces.value = false
  }
}


const validateAdminForm = () => {
  // Basic validation
  if (!adminForm.value.name || adminForm.value.name.trim() === '') {
    adminError.value = 'Instance name is required'
    return false
  }
  
  if (!adminForm.value.startIP || !adminForm.value.endIP) {
    adminError.value = 'IP range is required'
    return false
  }
  
  if (!adminForm.value.startMCPort || !adminForm.value.endMCPort) {
    adminError.value = 'Port range is required'
    return false
  }
  
  // Note: Interface validation removed - admin instance has automatic access to all interfaces
  
  adminError.value = null
  return true
}

// ================================
// STEP 4 METHODS: DEFAULT INSTANCE CONFIGURATION
// ================================
const addDefaultInterface = () => {
  defaultForm.value.interfaces.push({
    ifName: '',
    ifStreamDirection: 'BOTH',
    ifAddresses: ['192.168.1.1/24']
  })
  console.log('➕ Default: Added new interface')
}

const removeDefaultInterface = (index) => {
  if (defaultForm.value.interfaces.length > 0) {
    defaultForm.value.interfaces.splice(index, 1)
    console.log(`🗑️ Default: Removed interface at index ${index}`)
  }
}

const selectDefaultNetworkInterface = (defaultInterfaceIndex, selectedInterfaceName) => {
  console.log(`🔗 Default: Selecting interface ${selectedInterfaceName} for interface ${defaultInterfaceIndex}`)
  
  // Find the selected interface from all network interfaces
  const selectedInterface = networkInterfaces.value.find(iface => iface.ifName === selectedInterfaceName)
  
  if (selectedInterface && defaultForm.value.interfaces[defaultInterfaceIndex]) {
    // Update the default interface with selected network interface data
    defaultForm.value.interfaces[defaultInterfaceIndex].ifName = selectedInterface.ifName
    
    // Auto-set the stream direction from the network configuration
    defaultForm.value.interfaces[defaultInterfaceIndex].ifStreamDirection = selectedInterface.ifStreamDirection
    
    // Set the IP address from the network configuration
    const ipv4Address = getIPv4Address(selectedInterface)
    if (ipv4Address && ipv4Address !== 'N/A') {
      // Add /24 subnet if not already present
      const formattedIP = ipv4Address.includes('/') ? ipv4Address : `${ipv4Address}/24`
      defaultForm.value.interfaces[defaultInterfaceIndex].ifAddresses = [formattedIP]
    }
    
    console.log('✅ Default: Interface selected with auto-configured direction:', defaultForm.value.interfaces[defaultInterfaceIndex])
  }
}


const validateDefaultForm = () => {
  // Basic validation
  if (!defaultForm.value.name || defaultForm.value.name.trim() === '') {
    defaultError.value = 'Instance name is required'
    return false
  }
  
  if (!defaultForm.value.startIP || !defaultForm.value.endIP) {
    defaultError.value = 'IP range is required'
    return false
  }
  
  if (!defaultForm.value.startMCPort || !defaultForm.value.endMCPort) {
    defaultError.value = 'Port range is required'
    return false
  }
  
  // Validate interfaces - only validate configured interfaces (with names)
  for (let i = 0; i < defaultForm.value.interfaces.length; i++) {
    const iface = defaultForm.value.interfaces[i]
    // Skip validation for empty interfaces (not yet configured)
    if (iface.ifName && iface.ifName.trim() !== '') {
      // If interface has a name, validate other required fields
      if (!iface.ifStreamDirection) {
        defaultError.value = `Interface ${i + 1}: Stream direction is required`
        return false
      }
      if (!iface.ifAddresses || iface.ifAddresses.length === 0 || !iface.ifAddresses[0]) {
        defaultError.value = `Interface ${i + 1}: IP address is required`
        return false
      }
    }
  }
  
  defaultError.value = null
  return true
}

const handleDefaultInstanceNext = () => {
  console.log('🔍 Wizard: Handling Default Instance Next button click')
  
  // Clean up empty interfaces before validation
  cleanupEmptyInterfaces()
  
  // Validate the form first
  if (validateDefaultForm()) {
    console.log('✅ Wizard: Default Instance validation passed, proceeding to next step')
    nextStep()
  } else {
    console.log('❌ Wizard: Default Instance validation failed:', defaultError.value)
  }
}

const cleanupEmptyInterfaces = () => {
  // Remove interfaces that have no name (not configured)
  const originalLength = defaultForm.value.interfaces.length
  defaultForm.value.interfaces = defaultForm.value.interfaces.filter(iface => 
    iface.ifName && iface.ifName.trim() !== ''
  )
  
  const removedCount = originalLength - defaultForm.value.interfaces.length
  if (removedCount > 0) {
    console.log(`🧹 Wizard: Cleaned up ${removedCount} empty interface(s)`)
  }
}

// ================================
// STEP 3 METHODS: ADMIN INSTANCE CONFIGURATION
// ================================
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

// ================================
// STEP 4 METHODS: DEFAULT INSTANCE CONFIGURATION
// ================================
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

// ================================
// STEP 2 METHODS: NETWORK CONFIGURATION
// ================================
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
    
    // Filter only interfaces with status "UP" and exclude loopback interfaces
    const filteredInterfaces = interfaces.filter(iface => 
      iface.ifStatus === 'UP' && 
      iface.ifName !== 'lo' && 
      !iface.ifName.startsWith('lo')
    )
    console.log(`📋 Wizard: Filtered ${filteredInterfaces.length} UP interfaces (excluding loopback) from ${interfaces.length} total interfaces`)
    
    networkInterfaces.value = filteredInterfaces
    
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
  if (currentStep.value < 5) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}


// Watch for step changes to load data when entering specific steps
watch(currentStep, async (newStep) => {
  if (newStep === 2) {
    // Load network interfaces when entering network configuration
    await refreshNetworkInterfaces()
  } else if (newStep === 3 || newStep === 4) {
    // Load network interfaces when entering admin or default instance configuration
    await loadNetworkInterfaces()
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
onMounted(async () => {
  console.log('🧙‍♂️ Wizard: Component mounted')
  
  // Load machine name automatically on mount
  loadMachineName()
  
  // If we're on step 2 (Network Configuration), load network interfaces automatically
  if (currentStep.value === 2) {
    await refreshNetworkInterfaces()
  }
})
</script>

<style scoped>
/* Scroll container */
.h-screen {
  scroll-behavior: smooth;
  max-height: 100vh;
}

/* Ensure the container can scroll */
.min-h-screen {
  max-height: none;
}

/* Wizard card adjustments for better scrolling */
.card {
  max-height: none;
}
</style>