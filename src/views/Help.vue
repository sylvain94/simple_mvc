<template>
  <div class="container mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6">Help & Documentation</h2>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Quick Actions Section -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">Quick Actions</h3>
          <p>Common actions you can perform in the application.</p>
          <div class="space-y-2 mt-4">
            <div class="flex items-center gap-2 text-sm">
              <div class="badge badge-primary badge-sm">F</div>
              <span>Go to Files to manage input streams</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <div class="badge badge-secondary badge-sm">D</div>
              <span>Check Dashboard for system overview</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <div class="badge badge-accent badge-sm">S</div>
              <span>Access Settings for theme and preferences</span>
            </div>
          </div>
        </div>
      </div>
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">Getting Started</h3>
          <p>Welcome to the Mediahub application. This help section will guide you through the main features.</p>
          <ul class="list-disc list-inside mt-4 space-y-2">
            <li>Dashboard: Overview of system status</li>
            <li>Gateways: Manage SRT, RIST, and MBTS gateways</li>
            <li>Files: Manage input files and streams</li>
            <li>Users: User management and permissions</li>
          </ul>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">API Documentation</h3>
          <p>Access the API documentation for integration purposes.</p>
          <div class="flex items-center gap-2 mt-4 text-sm text-base-content/70">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span>https://192.168.1.141:8443/swagger-ui/</span>
          </div>
          <div class="card-actions justify-end mt-4">
            <button 
              @click="openSwaggerDocs" 
              class="btn btn-primary gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View API Docs
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Support Information Section -->
    <div class="mt-8">
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">Need More Help?</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div class="text-center">
              <div class="text-2xl mb-2">📚</div>
              <h4 class="font-semibold">Documentation</h4>
              <p class="text-sm text-base-content/70">Complete API reference and guides</p>
            </div>
            <div class="text-center">
              <div class="text-2xl mb-2">🛠️</div>
              <h4 class="font-semibold">Technical Support</h4>
              <p class="text-sm text-base-content/70">Get help with configuration and setup</p>
            </div>
            <div class="text-center">
              <div class="text-2xl mb-2">💬</div>
              <h4 class="font-semibold">Community</h4>
              <p class="text-sm text-base-content/70">Connect with other users and developers</p>
            </div>
          </div>
          <div class="divider"></div>
          <div class="text-center text-sm text-base-content/70">
            <p>MediaHub Application - Built with Vue.js & DaisyUI</p>
            <p class="mt-1">Version 1.0.0 - © 2025</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

// Function to open Swagger documentation
function openSwaggerDocs() {
  const swaggerUrl = 'https://192.168.1.141:8443/swagger-ui/index.html#'
  
  // Open in new tab/window
  window.open(swaggerUrl, '_blank', 'noopener,noreferrer')
}

onMounted(() => {
  console.log('Help view mounted')
})
</script>
