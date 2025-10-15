/**
 * NetworkInterfaceController
 * Handles business logic for network interfaces
 */

import NetworkInterface from '../models/NetworkInterface.js'
import { networkInterfaceService } from '../services/api.js'

export class NetworkInterfaceController {
  /**
   * Get all network interfaces
   * @returns {Promise<Array<NetworkInterface>>} - Array of network interfaces
   */
  static async getAllNetworkInterfaces() {
    try {
      const response = await networkInterfaceService.getAllNetworkInterfaces()
      
      const interfaces = []
      if (response && Array.isArray(response)) {
        for (const interfaceData of response) {
          interfaces.push(NetworkInterface.fromApiResponse(interfaceData))
        }
      } else if (response && typeof response === 'object') {
        // Handle case where response might be wrapped in an object
        const dataArray = response.data || response.content || []
        for (const interfaceData of dataArray) {
          interfaces.push(NetworkInterface.fromApiResponse(interfaceData))
        }
      }
      
      return interfaces
    } catch (error) {
      console.error('❌ NetworkInterfaceController: Error getting network interfaces:', error)
      throw new Error(`Failed to get network interfaces: ${error.message}`)
    }
  }

  /**
   * Refresh all network interfaces
   * @returns {Promise<boolean>} - True if refresh was successful
   */
  static async refreshAllNetworkInterfaces() {
    try {
      const response = await networkInterfaceService.refreshAllNetworkInterfaces()
      
      // The API returns "true" or "false" as text
      const success = response === 'true' || response === true
      
      if (success) {
      } else {
      }
      
      return success
    } catch (error) {
      console.error('❌ NetworkInterfaceController: Error refreshing network interfaces:', error)
      throw new Error(`Failed to refresh network interfaces: ${error.message}`)
    }
  }

  /**
   * Get network interface statistics
   * @param {Array<NetworkInterface>} interfaces - Array of network interfaces
   * @returns {Object} - Statistics object
   */
  static getNetworkInterfaceStatistics(interfaces) {
    const stats = {
      total: interfaces.length,
      up: 0,
      down: 0,
      physical: 0,
      virtual: 0,
      loopback: 0,
      multicastCapable: 0,
      inUse: 0,
      available: 0
    }

    interfaces.forEach(iface => {
      // Status statistics
      if (iface.ifStatus === 'UP') stats.up++
      else stats.down++

      // Type statistics
      if (iface.loopback) stats.loopback++
      else if (iface.virtual) stats.virtual++
      else stats.physical++

      // Capability statistics
      if (iface.supportsMulticast) stats.multicastCapable++
      if (iface.inUse) stats.inUse++
      if (iface.available) stats.available++
    })

    return stats
  }

  /**
   * Filter interfaces by status
   * @param {Array<NetworkInterface>} interfaces - Array of network interfaces
   * @param {string} status - Status to filter by ('UP', 'DOWN', 'ALL')
   * @returns {Array<NetworkInterface>} - Filtered interfaces
   */
  static filterByStatus(interfaces, status) {
    if (status === 'ALL') return interfaces
    return interfaces.filter(iface => iface.ifStatus === status)
  }

  /**
   * Filter interfaces by type
   * @param {Array<NetworkInterface>} interfaces - Array of network interfaces
   * @param {string} type - Type to filter by ('PHYSICAL', 'VIRTUAL', 'LOOPBACK', 'ALL')
   * @returns {Array<NetworkInterface>} - Filtered interfaces
   */
  static filterByType(interfaces, type) {
    if (type === 'ALL') return interfaces
    
    switch (type) {
      case 'PHYSICAL':
        return interfaces.filter(iface => !iface.virtual && !iface.loopback)
      case 'VIRTUAL':
        return interfaces.filter(iface => iface.virtual)
      case 'LOOPBACK':
        return interfaces.filter(iface => iface.loopback)
      default:
        return interfaces
    }
  }

  /**
   * Search interfaces by name or address
   * @param {Array<NetworkInterface>} interfaces - Array of network interfaces
   * @param {string} searchTerm - Search term
   * @returns {Array<NetworkInterface>} - Filtered interfaces
   */
  static searchInterfaces(interfaces, searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') return interfaces
    
    const term = searchTerm.toLowerCase().trim()
    
    return interfaces.filter(iface => 
      iface.ifName.toLowerCase().includes(term) ||
      iface.ifMac.toLowerCase().includes(term) ||
      iface.ifAddresses.some(addr => addr.toLowerCase().includes(term)) ||
      (iface.vlanName && iface.vlanName.toLowerCase().includes(term))
    )
  }

  /**
   * Get interface by name
   * @param {Array<NetworkInterface>} interfaces - Array of network interfaces
   * @param {string} name - Interface name
   * @returns {NetworkInterface|null} - Found interface or null
   */
  static getInterfaceByName(interfaces, name) {
    return interfaces.find(iface => iface.ifName === name) || null
  }

  /**
   * Get interfaces with IPv4 addresses
   * @param {Array<NetworkInterface>} interfaces - Array of network interfaces
   * @returns {Array<NetworkInterface>} - Interfaces with IPv4 addresses
   */
  static getInterfacesWithIPv4(interfaces) {
    return interfaces.filter(iface => 
      iface.ifAddresses.some(addr => addr.includes('.') && !addr.includes('%'))
    )
  }

  /**
   * Get interfaces with IPv6 addresses
   * @param {Array<NetworkInterface>} interfaces - Array of network interfaces
   * @returns {Array<NetworkInterface>} - Interfaces with IPv6 addresses
   */
  static getInterfacesWithIPv6(interfaces) {
    return interfaces.filter(iface => 
      iface.ifAddresses.some(addr => addr.includes(':') && !addr.startsWith('127.'))
    )
  }

  /**
   * Get multicast capable interfaces
   * @param {Array<NetworkInterface>} interfaces - Array of network interfaces
   * @returns {Array<NetworkInterface>} - Multicast capable interfaces
   */
  static getMulticastCapableInterfaces(interfaces) {
    return interfaces.filter(iface => iface.supportsMulticast)
  }
}

export default NetworkInterfaceController
