<template>
  <div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">SRT Gateways</h2>
      <button 
        class="btn btn-primary gap-2 hover:scale-105 transition-transform"
        @click="refreshGateways"
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
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">Total Gateways</h3>
          <div class="stat">
            <div class="stat-value">{{ gateways.length }}</div>
          </div>
        </div>
      </div>

      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">Active Gateways</h3>
          <div class="stat">
            <div class="stat-value text-success">{{ activeGateways }}</div>
          </div>
        </div>
      </div>

      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">Enabled Gateways</h3>
          <div class="stat">
            <div class="stat-value text-primary">{{ enabledGateways }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Gateways table -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h3 class="card-title">SRT Gateways List</h3>
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Address</th>
                <th>Port</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="gateways.length === 0">
                <td colspan="6" class="text-center py-4">
                  No SRT gateways found
                </td>
              </tr>
              <tr v-for="gateway in gateways" :key="gateway.id" class="hover">
                <td>{{ gateway.name || '-' }}</td>
                <td>{{ gateway.gatewayType || '-' }}</td>
                <td>
                  <span 
                    class="badge" 
                    :class="gateway.running ? 'badge-success' : 'badge-error'"
                  >
                    {{ gateway.running ? 'Running' : 'Stopped' }}
                  </span>
                </td>
                <td>{{ gateway.foreignSRTAddress || '-' }}</td>
                <td>{{ gateway.foreignSRTPort || '-' }}</td>
                <td>
                  <div class="btn-group">
                    <button 
                      v-if="!gateway.running"
                      class="btn btn-sm btn-success"
                      @click="startGateway(gateway.id)"
                    >
                      Start
                    </button>
                    <button 
                      v-else
                      class="btn btn-sm btn-error"
                      @click="stopGateway(gateway.id)"
                    >
                      Stop
                    </button>
                    <button class="btn btn-sm btn-info">
                      Edit
                    </button>
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
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '../stores/app.js'

const appStore = useAppStore()
const isRefreshing = ref(false)

// Sample data for demonstration
const gateways = ref([
  {
    id: 1,
    name: 'Gateway-Production-01',
    gatewayType: 'SRT-Encoder',
    running: true,
    enabled: true,
    foreignSRTAddress: '192.168.1.100',
    foreignSRTPort: 9998
  },
  {
    id: 2,
    name: 'Gateway-Backup-01',
    gatewayType: 'SRT-Decoder',
    running: false,
    enabled: true,
    foreignSRTAddress: '192.168.1.101',
    foreignSRTPort: 9999
  }
])

const activeGateways = computed(() => 
  gateways.value.filter(g => g.running).length
)

const enabledGateways = computed(() => 
  gateways.value.filter(g => g.enabled).length
)

onMounted(() => {
  loadGateways()
})

async function loadGateways() {
  // In a real app, this would load from the API via app store
  console.log('Loading SRT gateways...')
}

async function refreshGateways() {
  isRefreshing.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    await loadGateways()
  } finally {
    isRefreshing.value = false
  }
}

async function startGateway(id) {
  const gateway = gateways.value.find(g => g.id === id)
  if (gateway && confirm(`Start gateway ${gateway.name}?`)) {
    gateway.running = true
    console.log(`Started gateway ${id}`)
  }
}

async function stopGateway(id) {
  const gateway = gateways.value.find(g => g.id === id)
  if (gateway && confirm(`Stop gateway ${gateway.name}?`)) {
    gateway.running = false
    console.log(`Stopped gateway ${id}`)
  }
}
</script>
