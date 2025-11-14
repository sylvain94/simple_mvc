<template>
  <div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Dashboard</h2>
      <button 
        class="btn btn-secondary btn-outline gap-2 hover:scale-105 transition-transform"
        @click="refreshDashboard"
        :disabled="isRefreshing"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="{ 'animate-spin': isRefreshing }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Refresh
      </button>
    </div>
    
    <!-- Statistics cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <!-- SRT Gateways -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">SRT Gateways</h3>
          <div class="stats">
            <div class="stat">
              <div class="stat-title">Total</div>
              <div class="stat-value">{{ dashboardStats.srtGateways.total }}</div>
            </div>
            <div class="stat">
              <div class="stat-title">Running</div>
              <div class="stat-value text-success">{{ dashboardStats.srtGateways.running }}</div>
            </div>
            <div class="stat">
              <div class="stat-title">Enabled</div>
              <div class="stat-value text-info">{{ dashboardStats.srtGateways.enabled }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Files -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">Files</h3>
          <div class="stats">
            <div class="stat">
              <div class="stat-title">Total</div>
              <div class="stat-value">{{ dashboardStats.files.total }}</div>
            </div>
            <div class="stat">
              <div class="stat-title">Active</div>
              <div class="stat-value text-success">{{ dashboardStats.files.active }}</div>
            </div>
            <div class="stat">
              <div class="stat-title">Inactive</div>
              <div class="stat-value text-warning">{{ dashboardStats.files.inactive }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Network Interfaces -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">Network Interfaces</h3>
          <div class="stats">
            <div class="stat">
              <div class="stat-title">Total</div>
              <div class="stat-value">{{ dashboardStats.networkInterfaces.total }}</div>
            </div>
            <div class="stat">
              <div class="stat-title">UP</div>
              <div class="stat-value text-success">{{ dashboardStats.networkInterfaces.up }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Latest functions -->
    <div class="card bg-base-200 shadow-xl mb-6">
      <div class="card-body">
        <h3 class="card-title">Functions</h3>
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Service</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="activeFunctions.length === 0">
                <td colspan="4" class="text-center py-4">
                  No functions available
                </td>
              </tr>
              <tr v-for="func in activeFunctions" :key="func.id" class="hover">
                <td>
                  <div class="font-bold">{{ func.name || '-' }}</div>
                  <div class="text-sm opacity-70">{{ func.description || 'No description' }}</div>
                </td>
                <td>
                  <div class="badge badge-outline">{{ func.functionType || '-' }}</div>
                </td>
                <td>{{ func.technicalServiceName || '-' }}</td>
                <td>
                  <div class="flex items-center gap-2">
                    <span 
                      class="badge" 
                      :class="func.running ? 'badge-success' : 'badge-error'"
                    >
                      {{ func.running ? 'Running' : 'Stopped' }}
                    </span>
                    <span 
                      class="badge badge-sm" 
                      :class="func.enabled ? 'badge-info' : 'badge-warning'"
                    >
                      {{ func.enabled ? 'Enabled' : 'Disabled' }}
                    </span>
                    <span 
                      class="badge badge-sm" 
                      :class="func.active ? 'badge-primary' : 'badge-ghost'"
                    >
                      {{ func.active ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import DashboardController from '../controllers/DashboardController.js'

const isRefreshing = ref(false)
const lastUpdated = ref(null)

// Dashboard statistics
const dashboardStats = reactive({
  srtGateways: {
    total: 0,
    active: 0,
    running: 0,
    enabled: 0
  },
  files: {
    total: 0,
    active: 0,
    inactive: 0
  },
  networkInterfaces: {
    total: 0,
    active: 0,
    up: 0,
    down: 0
  }
})

// Active gateways and functions lists
const activeGateways = ref([])
const activeFunctions = ref([])

// Initialize dashboard on mount
onMounted(() => {
  loadDashboardData()
})

async function loadDashboardData() {
  try {
    
    // Use the Dashboard Controller to get statistics
    const stats = await DashboardController.getDashboardStats()
    
    // Update reactive data
    Object.assign(dashboardStats, stats)
    
    // Get active gateways and functions
    const gateways = await DashboardController.getActiveGateways()
    activeGateways.value = gateways
    
    const functions = await DashboardController.getAllFunctions()
    activeFunctions.value = functions
    
    lastUpdated.value = new Date().toLocaleTimeString()
    
    
  } catch (error) {
    console.error('❌ Error loading dashboard data:', error)
    // You could show a notification to the user here
  }
}

async function refreshDashboard() {
  isRefreshing.value = true
  
  try {
    
    // Use the Dashboard Controller to refresh all data
    const refreshedData = await DashboardController.refreshDashboard()
    
    // Update reactive data with refreshed information
    Object.assign(dashboardStats, refreshedData.stats)
    activeGateways.value = refreshedData.activeGateways
    activeFunctions.value = refreshedData.activeFunctions
    
    lastUpdated.value = new Date().toLocaleTimeString()
    
    // You could show a success notification here
    
  } catch (error) {
    console.error('❌ Error refreshing dashboard:', error)
    // You could show an error notification here
  } finally {
    isRefreshing.value = false
  }
}

// Function to start a gateway (for future use)
async function startGateway(gatewayId) {
  try {
    await DashboardController.startGateway(gatewayId)
    await loadDashboardData() // Refresh data after starting
  } catch (error) {
    console.error('Error starting gateway:', error)
  }
}

// Function to stop a gateway (for future use)
async function stopGateway(gatewayId) {
  try {
    await DashboardController.stopGateway(gatewayId)
    await loadDashboardData() // Refresh data after stopping
  } catch (error) {
    console.error('Error stopping gateway:', error)
  }
}
</script>
