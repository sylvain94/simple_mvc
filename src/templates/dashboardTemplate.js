/**
 * Template for the dashboard page - Vue.js version
 * @description Displays system overview with statistics and active gateways
 * 
 * Adaptation de l'ancien template AlpineJS vers Vue.js
 * Compatible avec votre architecture MVC actuelle
 */

/**
 * Template HTML adapté pour Vue.js
 * Utilise la syntaxe Vue au lieu d'AlpineJS
 */
export const dashboardTemplate = `
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
              <div class="stat-title">Actives</div>
              <div class="stat-value text-success">{{ dashboardStats.srtGateways.active }}</div>
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
              <div class="stat-title">Actifs</div>
              <div class="stat-value text-success">{{ dashboardStats.files.active }}</div>
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
          </div>
        </div>
      </div>
    </div>

    <!-- Latest active gateways -->
    <div class="card bg-base-200 shadow-xl mb-6">
      <div class="card-body">
        <h3 class="card-title">Active SRT Gateways</h3>
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Service</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="activeGateways.length === 0">
                <td colspan="4" class="text-center py-4">
                  No active SRT gateway
                </td>
              </tr>
              <tr v-for="gateway in activeGateways" :key="gateway.id" class="hover">
                <td>{{ gateway.name || '-' }}</td>
                <td>{{ gateway.gatewayType || '-' }}</td>
                <td>{{ gateway.technicalServiceName || '-' }}</td>
                <td>
                  <div class="flex items-center gap-2">
                    <span class="badge badge-success">In progress</span>
                    <span 
                      class="badge" 
                      :class="gateway.enabled ? 'badge-success' : 'badge-warning'"
                    >
                      {{ gateway.enabled ? 'Activated' : 'Deactivated' }}
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
`;

/**
 * Configuration du composant Vue correspondant
 */
export const dashboardComponentConfig = {
  template: dashboardTemplate,
  
  setup() {
    const { ref, reactive, onMounted } = Vue
    
    const isRefreshing = ref(false)
    
    // Dashboard statistics
    const dashboardStats = reactive({
      srtGateways: {
        total: 0,
        active: 0
      },
      files: {
        total: 0,
        active: 0
      },
      networkInterfaces: {
        total: 0
      }
    })
    
    // Active gateways list
    const activeGateways = ref([])
    
    // Sample data (in real app, this would come from your store/API)
    const sampleData = {
      srtGateways: [
        {
          id: 1,
          name: 'Gateway-Production-01',
          gatewayType: 'SRT-Encoder',
          technicalServiceName: 'encoder-service-01',
          running: true,
          enabled: true
        },
        {
          id: 2,
          name: 'Gateway-Backup-01',
          gatewayType: 'SRT-Decoder',
          technicalServiceName: 'decoder-service-01',
          running: true,
          enabled: false
        }
      ],
      inputFiles: [
        { id: 1, name: 'input-stream-01.ts', running: true },
        { id: 2, name: 'input-stream-02.ts', running: true },
        { id: 3, name: 'backup-stream.ts', running: false }
      ],
      networkInterfaces: [
        { id: 1, name: 'eth0', ip: '192.168.1.100' },
        { id: 2, name: 'eth1', ip: '192.168.2.100' }
      ]
    }
    
    function loadDashboardData() {
      // Update statistics
      dashboardStats.srtGateways.total = sampleData.srtGateways.length
      dashboardStats.srtGateways.active = sampleData.srtGateways.filter(g => g.running).length
      
      dashboardStats.files.total = sampleData.inputFiles.length
      dashboardStats.files.active = sampleData.inputFiles.filter(f => f.running).length
      
      dashboardStats.networkInterfaces.total = sampleData.networkInterfaces.length
      
      // Update active gateways list
      activeGateways.value = sampleData.srtGateways.filter(g => g.running)
    }
    
    async function refreshDashboard() {
      isRefreshing.value = true
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // In a real application, you would call your API/store here
        // Example: await store.refreshDashboard()
        
        loadDashboardData()
        console.log('Dashboard refreshed successfully')
      } catch (error) {
        console.error('Error refreshing dashboard:', error)
      } finally {
        isRefreshing.value = false
      }
    }
    
    // Initialize on mount
    onMounted(() => {
      loadDashboardData()
    })
    
    return {
      isRefreshing,
      dashboardStats,
      activeGateways,
      refreshDashboard
    }
  }
}

/**
 * Fonction pour créer le composant dashboard
 * Compatible avec l'ancien pattern d'utilisation
 */
export function createDashboardComponent() {
  return dashboardComponentConfig
}

export default {
  dashboardTemplate,
  dashboardComponentConfig,
  createDashboardComponent
}
