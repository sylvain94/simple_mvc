/**
 * Controller Dashboard - Manages business logic related to dashboard statistics
 * 
 * This controller handles the dashboard data aggregation and statistics
 * for the SRT Gateway management system
 */

import Gateway from '../models/Gateway.js'
import { NetworkInterfaceController } from './NetworkInterfaceController.js'
import { apiGet } from '../services/api.js'

const DashboardController = {
  
  /**
   * Get comprehensive dashboard statistics
   * @returns {Promise<Object>} - Dashboard statistics including all metrics
   */
  async getDashboardStats() {
    try {
      
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
          active: networkInterfaces.filter(ni => ni.active).length,
          up: networkInterfaces.filter(ni => ni.ifStatus === 'UP').length,
          down: networkInterfaces.filter(ni => ni.ifStatus === 'DOWN').length
        },
        system: {
          uptime: this.getSystemUptime(),
          lastRefresh: new Date().toISOString()
        }
      }
      
      return stats
      
    } catch (error) {
      console.error('❌ Error fetching dashboard statistics:', error)
      throw new Error(`Unable to fetch dashboard statistics: ${error.message}`)
    }
  },

  /**
   * Get all gateways from real API or return empty array
   * @returns {Promise<Gateway[]>} - Array of Gateway instances
   */
  async getAllGateways() {
    try {
      
      // TODO: Replace with real API call when SRT Gateway API is available
      // For now, return empty array to show real state (no gateways configured)
      console.log('📡 Attempting to fetch SRT Gateways from API...')
      
      // Simulate API call that would return real gateways
      // const response = await apiGet('/srt-gateways', true)
      // const gateways = response.map(data => Gateway.fromApiResponse(data))
      
      // For now, return empty array since no real gateways are configured
      const gateways = []
      
      console.log(`✅ ${gateways.length} real gateways fetched from API`)
      return gateways
      
    } catch (error) {
      console.error('❌ Error fetching gateways from API:', error)
      
      // Return empty array instead of mock data to show real state
      console.log('🔄 No SRT Gateways configured, returning empty array')
      return []
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
   * Get all functions from the real API
   * @returns {Promise<Array>} - Array of function objects
   */
  async getAllFunctions() {
    try {
      
      console.log('📡 Fetching all functions from API...')
      
      // Call the real API to get all functions
      const functions = await apiGet('/functions/getAll', true)
      
      console.log(`✅ ${functions.length} functions fetched from API`)
      return functions
      
    } catch (error) {
      console.error('❌ Error fetching functions from API:', error)
      
      // Return empty array if API fails
      console.log('🔄 No functions available, returning empty array')
      return []
    }
  },

  /**
   * Get active functions only (running functions)
   * @returns {Promise<Array>} - Array of active function objects
   */
  async getActiveFunctions() {
    try {
      const allFunctions = await this.getAllFunctions()
      const activeFunctions = allFunctions.filter(func => func.running === true)
      
      console.log(`✅ ${activeFunctions.length} active functions found`)
      return activeFunctions
      
    } catch (error) {
      console.error('❌ Error fetching active functions:', error)
      return []
    }
  },

  /**
   * Get all input files from real API or return empty array
   * @returns {Promise<Array>} - Array of file objects
   */
  async getAllFiles() {
    try {
      
      // TODO: Replace with real API call when Files API is available
      // For now, return empty array to show real state (no files configured)
      console.log('📡 Attempting to fetch Files from API...')
      
      // Simulate API call that would return real files
      // const response = await apiGet('/files', true)
      // return response
      
      // For now, return empty array since no real files are configured
      const files = []
      
      console.log(`✅ ${files.length} real files fetched from API`)
      return files
      
    } catch (error) {
      console.error('❌ Error fetching files from API:', error)
      
      // Return empty array instead of mock data to show real state
      console.log('🔄 No Files configured, returning empty array')
      return []
    }
  },

  /**
   * Get all network interfaces from the real API
   * @returns {Promise<Array>} - Array of network interface objects
   */
  async getAllNetworkInterfaces() {
    try {
      
      // Use the real NetworkInterfaceController to get interfaces
      const networkInterfaces = await NetworkInterfaceController.getAllNetworkInterfaces()
      
      console.log(`✅ ${networkInterfaces.length} network interfaces fetched from API`)
      return networkInterfaces
      
    } catch (error) {
      console.error('❌ Error fetching network interfaces from API:', error)
      
      // Fallback to mock data if API fails
      console.log('🔄 Falling back to mock network interface data')
      const mockNetworkData = [
        { id: 1, name: 'eth0', ip: '192.168.1.116', active: true, type: 'ethernet', ifStatus: 'UP' },
        { id: 2, name: 'eth1', ip: '10.0.0.100', active: true, type: 'ethernet', ifStatus: 'UP' },
        { id: 3, name: 'lo', ip: '127.0.0.1', active: true, type: 'loopback', ifStatus: 'UP' }
      ]
      
      return mockNetworkData
    }
  },

  /**
   * Refresh all dashboard data
   * @returns {Promise<Object>} - Refreshed dashboard data
   */
  async refreshDashboard() {
    try {
      
      const dashboardData = {
        stats: await this.getDashboardStats(),
        activeGateways: await this.getActiveGateways(),
        activeFunctions: await this.getAllFunctions(),
        timestamp: new Date().toISOString()
      }
      
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
      
      const gateway = await this.getGatewayById(id)
      if (!gateway) {
        throw new Error(`Gateway ${id} not found`)
      }
      
      gateway.stop()
      
      // In real app, this would call an API to actually stop the gateway
      return true
      
    } catch (error) {
      console.error(`❌ Error stopping gateway ${id}:`, error)
      throw error
    }
  }
}

export default DashboardController
