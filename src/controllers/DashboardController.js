/**
 * Controller Dashboard - Manages business logic related to dashboard statistics
 * 
 * This controller handles the dashboard data aggregation and statistics
 * for the SRT Gateway management system
 */

import Gateway from '../models/Gateway.js'

const DashboardController = {
  
  /**
   * Get comprehensive dashboard statistics
   * @returns {Promise<Object>} - Dashboard statistics including all metrics
   */
  async getDashboardStats() {
    try {
      console.log('📊 Fetching dashboard statistics')
      
      // In a real application, these would be API calls
      // For now, we'll use sample data
      const gateways = await this.getAllGateways()
      const files = await this.getAllFiles()
      const networkInterfaces = await this.getAllNetworkInterfaces()
      
      const stats = {
        srtGateways: {
          total: gateways.length,
          active: gateways.filter(g => g.isActive).length,
          running: gateways.filter(g => g.running).length,
          enabled: gateways.filter(g => g.enabled).length
        },
        files: {
          total: files.length,
          active: files.filter(f => f.running).length,
          inactive: files.filter(f => !f.running).length
        },
        networkInterfaces: {
          total: networkInterfaces.length,
          active: networkInterfaces.filter(ni => ni.active).length
        },
        system: {
          uptime: this.getSystemUptime(),
          lastRefresh: new Date().toISOString()
        }
      }
      
      console.log('✅ Dashboard statistics generated:', stats)
      return stats
      
    } catch (error) {
      console.error('❌ Error fetching dashboard statistics:', error)
      throw new Error(`Unable to fetch dashboard statistics: ${error.message}`)
    }
  },

  /**
   * Get all gateways with full Gateway model instances
   * @returns {Promise<Gateway[]>} - Array of Gateway instances
   */
  async getAllGateways() {
    try {
      console.log('🚪 Fetching all gateways')
      
      // Sample data - in real app, this would be an API call
      const mockGatewayData = [
        {
          id: 1,
          name: 'Gateway-Production-01',
          gatewayType: Gateway.TYPES.ENCODER,
          technicalServiceName: 'encoder-service-01',
          running: true,
          enabled: true,
          host: '192.168.1.100',
          port: 9998,
          mode: Gateway.MODES.LISTENER,
          latency: 120
        },
        {
          id: 2,
          name: 'Gateway-Backup-01',
          gatewayType: Gateway.TYPES.DECODER,
          technicalServiceName: 'decoder-service-01',
          running: true,
          enabled: false,
          host: '192.168.1.101',
          port: 9999,
          mode: Gateway.MODES.CALLER,
          latency: 150
        },
        {
          id: 3,
          name: 'Gateway-Test-01',
          gatewayType: Gateway.TYPES.RELAY,
          technicalServiceName: 'relay-service-01',
          running: false,
          enabled: true,
          host: '192.168.1.102',
          port: 10000,
          mode: Gateway.MODES.RENDEZVOUS,
          latency: 100
        }
      ]
      
      // Transform to Gateway model instances
      const gateways = mockGatewayData.map(data => Gateway.fromApiResponse(data))
      
      // Validate all gateways
      const validGateways = gateways.filter(gateway => {
        const validation = gateway.validate()
        if (!validation.isValid) {
          console.warn(`⚠️ Invalid gateway ignored: ${gateway.name}`, validation.errors)
          return false
        }
        return true
      })
      
      console.log(`✅ ${validGateways.length} gateways fetched`)
      return validGateways
      
    } catch (error) {
      console.error('❌ Error fetching gateways:', error)
      throw new Error(`Unable to fetch gateways: ${error.message}`)
    }
  },

  /**
   * Get active gateways only
   * @returns {Promise<Gateway[]>} - Array of active Gateway instances
   */
  async getActiveGateways() {
    try {
      const allGateways = await this.getAllGateways()
      const activeGateways = allGateways.filter(gateway => gateway.running)
      
      console.log(`✅ ${activeGateways.length} active gateways found`)
      return activeGateways
      
    } catch (error) {
      console.error('❌ Error fetching active gateways:', error)
      throw error
    }
  },

  /**
   * Get all input files
   * @returns {Promise<Array>} - Array of file objects
   */
  async getAllFiles() {
    try {
      console.log('📁 Fetching all files')
      
      // Sample data - in real app, this would be an API call
      const mockFileData = [
        { id: 1, name: 'input-stream-01.ts', running: true, size: '2.5GB', type: 'transport-stream' },
        { id: 2, name: 'input-stream-02.ts', running: true, size: '1.8GB', type: 'transport-stream' },
        { id: 3, name: 'backup-stream.ts', running: false, size: '3.2GB', type: 'transport-stream' },
        { id: 4, name: 'test-stream.mp4', running: false, size: '890MB', type: 'mp4' }
      ]
      
      console.log(`✅ ${mockFileData.length} files fetched`)
      return mockFileData
      
    } catch (error) {
      console.error('❌ Error fetching files:', error)
      throw new Error(`Unable to fetch files: ${error.message}`)
    }
  },

  /**
   * Get all network interfaces
   * @returns {Promise<Array>} - Array of network interface objects
   */
  async getAllNetworkInterfaces() {
    try {
      console.log('🌐 Fetching network interfaces')
      
      // Sample data - in real app, this would be an API call
      const mockNetworkData = [
        { id: 1, name: 'eth0', ip: '192.168.1.116', active: true, type: 'ethernet' },
        { id: 2, name: 'eth1', ip: '10.0.0.100', active: true, type: 'ethernet' },
        { id: 3, name: 'lo', ip: '127.0.0.1', active: true, type: 'loopback' }
      ]
      
      console.log(`✅ ${mockNetworkData.length} network interfaces fetched`)
      return mockNetworkData
      
    } catch (error) {
      console.error('❌ Error fetching network interfaces:', error)
      throw new Error(`Unable to fetch network interfaces: ${error.message}`)
    }
  },

  /**
   * Refresh all dashboard data
   * @returns {Promise<Object>} - Refreshed dashboard data
   */
  async refreshDashboard() {
    try {
      console.log('🔄 Refreshing dashboard data')
      
      const dashboardData = {
        stats: await this.getDashboardStats(),
        activeGateways: await this.getActiveGateways(),
        timestamp: new Date().toISOString()
      }
      
      console.log('✅ Dashboard data refreshed successfully')
      return dashboardData
      
    } catch (error) {
      console.error('❌ Error refreshing dashboard:', error)
      throw new Error(`Unable to refresh dashboard: ${error.message}`)
    }
  },

  /**
   * Get system uptime (mock implementation)
   * @returns {string} - System uptime string
   */
  getSystemUptime() {
    // In a real app, this would get actual system uptime
    const startTime = new Date()
    startTime.setHours(startTime.getHours() - 24) // Simulate 24h uptime
    const uptime = Date.now() - startTime.getTime()
    const hours = Math.floor(uptime / (1000 * 60 * 60))
    const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${hours}h ${minutes}m`
  },

  /**
   * Get gateway by ID
   * @param {number|string} id - Gateway ID
   * @returns {Promise<Gateway|null>} - Gateway instance or null
   */
  async getGatewayById(id) {
    try {
      const gateways = await this.getAllGateways()
      const gateway = gateways.find(g => g.id == id)
      
      if (!gateway) {
        console.warn(`⚠️ Gateway with ID ${id} not found`)
        return null
      }
      
      console.log(`✅ Gateway found: ${gateway.name}`)
      return gateway
      
    } catch (error) {
      console.error(`❌ Error fetching gateway ${id}:`, error)
      throw error
    }
  },

  /**
   * Start a gateway
   * @param {number|string} id - Gateway ID
   * @returns {Promise<boolean>} - Success status
   */
  async startGateway(id) {
    try {
      console.log(`▶️ Starting gateway ${id}`)
      
      const gateway = await this.getGatewayById(id)
      if (!gateway) {
        throw new Error(`Gateway ${id} not found`)
      }
      
      gateway.start()
      
      // In real app, this would call an API to actually start the gateway
      console.log(`✅ Gateway ${gateway.name} started successfully`)
      return true
      
    } catch (error) {
      console.error(`❌ Error starting gateway ${id}:`, error)
      throw error
    }
  },

  /**
   * Stop a gateway
   * @param {number|string} id - Gateway ID
   * @returns {Promise<boolean>} - Success status
   */
  async stopGateway(id) {
    try {
      console.log(`⏹️ Stopping gateway ${id}`)
      
      const gateway = await this.getGatewayById(id)
      if (!gateway) {
        throw new Error(`Gateway ${id} not found`)
      }
      
      gateway.stop()
      
      // In real app, this would call an API to actually stop the gateway
      console.log(`✅ Gateway ${gateway.name} stopped successfully`)
      return true
      
    } catch (error) {
      console.error(`❌ Error stopping gateway ${id}:`, error)
      throw error
    }
  }
}

export default DashboardController
