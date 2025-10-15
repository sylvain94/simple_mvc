<template>
  <div class="container mx-auto p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-base-content mb-2">Network Interfaces</h1>
      <p class="text-base-content/70">Monitor and manage network interface configurations</p>
    </div>


    <!-- Controls -->
    <div class="card bg-base-100 shadow-lg mb-6">
      <div class="card-body">
        <div class="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <!-- Search -->
          <div class="form-control w-full lg:w-auto">
            <div class="input-group">
              <input 
                type="text" 
                placeholder="Search interfaces..." 
                class="input input-bordered w-full lg:w-80"
                v-model="searchTerm"
                @input="onSearchInput"
              />
              <button class="btn btn-square">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Filters -->
          <div class="flex gap-2">
            <select class="select select-bordered" v-model="statusFilter" @change="applyFilters">
              <option value="ALL">All Status</option>
              <option value="UP">UP</option>
              <option value="DOWN">DOWN</option>
            </select>
            
            <select class="select select-bordered" v-model="typeFilter" @change="applyFilters">
              <option value="ALL">All Types</option>
              <option value="PHYSICAL">Physical</option>
              <option value="VIRTUAL">Virtual</option>
              <option value="LOOPBACK">Loopback</option>
            </select>

            <button class="btn btn-primary" @click="refreshInterfaces" :disabled="refreshing">
              <span v-if="refreshing" class="loading loading-spinner loading-sm mr-2"></span>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {{ refreshing ? 'Refreshing...' : 'Refresh' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-error mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ error }}</span>
    </div>

    <!-- Network Interfaces Table -->
    <div v-else class="card bg-base-100 shadow-lg">
      <div class="card-body">
        <h2 class="card-title mb-4">Network Interfaces</h2>
        
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>Index</th>
                <th>Interface</th>
                <th>Type</th>
                <th>Status</th>
                <th>Direction</th>
                <th>IPv4 Address</th>
                <th>MAC Address</th>
                <th>MTU</th>
                <th>Capabilities</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="iface in filteredInterfaces" :key="iface.id" class="hover">
                <td>
                  <span class="font-mono text-sm">{{ iface.ifIndex }}</span>
                </td>
                <td>
                  <div class="flex items-center gap-3">
                    <div class="font-bold">{{ iface.ifName }}</div>
                    <div v-if="iface.vlanName" class="badge badge-outline badge-sm">
                      VLAN: {{ iface.vlanName }}
                    </div>
                  </div>
                </td>
                <td>
                  <div class="badge" :class="iface.getTypeBadgeClass()">
                    {{ iface.getTypeDisplay() }}
                  </div>
                </td>
                <td>
                  <div class="badge" :class="iface.getStatusBadgeClass()">
                    {{ iface.ifStatus }}
                  </div>
                </td>
                <td>
                  <div class="badge badge-outline">
                    {{ iface.ifStreamDirection }}
                  </div>
                </td>
                <td>
                  <code class="text-sm">{{ iface.primaryIPv4 }}</code>
                </td>
                <td>
                  <code class="text-sm">{{ iface.formattedMac }}</code>
                </td>
                <td>
                  <span class="text-sm">{{ iface.formattedMtu }}</span>
                </td>
                <td>
                  <div class="flex flex-wrap gap-1">
                    <div 
                      v-for="capability in iface.capabilities" 
                      :key="capability"
                      class="badge badge-ghost badge-sm"
                    >
                      {{ capability }}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- No interfaces found -->
          <div v-if="filteredInterfaces.length === 0" class="text-center py-8">
            <div class="text-base-content/60">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.881-6.08 2.33l-.147.083A7.994 7.994 0 0112 21.001z" />
              </svg>
              <p class="text-lg font-medium mb-2">No network interfaces found</p>
              <p class="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { NetworkInterfaceController } from '../controllers/NetworkInterfaceController.js'

// Reactive data
const loading = ref(false)
const refreshing = ref(false)
const error = ref(null)
const interfaces = ref([])
const searchTerm = ref('')
const statusFilter = ref('ALL')
const typeFilter = ref('ALL')

// Computed properties
const interfaceStats = computed(() => {
  return NetworkInterfaceController.getNetworkInterfaceStatistics(interfaces.value)
})

const filteredInterfaces = computed(() => {
  let result = interfaces.value

  // Apply search filter
  if (searchTerm.value.trim()) {
    result = NetworkInterfaceController.searchInterfaces(result, searchTerm.value)
  }

  // Apply status filter
  result = NetworkInterfaceController.filterByStatus(result, statusFilter.value)

  // Apply type filter
  result = NetworkInterfaceController.filterByType(result, typeFilter.value)

  // Sort by ifIndex (ascending order)
  result = result.sort((a, b) => a.ifIndex - b.ifIndex)

  return result
})

// Methods
const loadInterfaces = async () => {
  try {
    loading.value = true
    error.value = null
    
    const interfacesData = await NetworkInterfaceController.getAllNetworkInterfaces()
    interfaces.value = interfacesData
  } catch (err) {
    console.error('❌ Error loading network interfaces:', err)
    error.value = `Failed to load network interfaces: ${err.message}`
  } finally {
    loading.value = false
  }
}

const refreshInterfaces = async () => {
  try {
    refreshing.value = true
    error.value = null
    
    // Call the refresh API first
    const refreshSuccess = await NetworkInterfaceController.refreshAllNetworkInterfaces()
    
    if (refreshSuccess) {
      // If refresh was successful, reload the interfaces
      await loadInterfaces()
    } else {
      error.value = 'Failed to refresh network interfaces: API returned false'
    }
  } catch (err) {
    console.error('❌ Error refreshing network interfaces:', err)
    error.value = `Failed to refresh network interfaces: ${err.message}`
  } finally {
    refreshing.value = false
  }
}

const onSearchInput = () => {
  // The computed property will automatically update the filtered results
}

const applyFilters = () => {
  // The computed property will automatically update the filtered results
}

// Lifecycle
onMounted(() => {
  loadInterfaces()
})
</script>

<style scoped>
.stat {
  padding: 1rem;
}

.table th {
  background-color: var(--fallback-b2, oklch(var(--b2)/1));
}

code {
  background-color: var(--fallback-b2, oklch(var(--b2)/1));
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}
</style>