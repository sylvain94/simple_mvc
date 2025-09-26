<template>
  <div class="container mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6">Help & Documentation</h2>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          <div class="card-actions justify-end">
            <button class="btn btn-primary">View API Docs</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log('Help view mounted')
})
</script>
