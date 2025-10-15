import Instance from '../models/Instance.js'
import { instanceService } from '../services/api.js'

/**
 * Controller for managing instances
 */
export class InstanceController {
  /**
   * Get all instances
   * @returns {Promise<Instance[]>} Array of Instance instances
   */
  static async getAllInstances() {
    try {
      const response = await instanceService.getAllInstances()
      
      // Transform API response to Instance instances
      const instances = []
      if (response && Array.isArray(response)) {
        for (const instanceData of response) {
          instances.push(Instance.fromApiResponse(instanceData))
        }
      }
      
      return instances
    } catch (error) {
      throw new Error(`Failed to get instances: ${error.message}`)
    }
  }

  /**
   * Get instance by ID
   * @param {string} id - Instance ID
   * @returns {Promise<Instance>} Instance instance
   */
  static async getInstanceById(id) {
    try {
      const response = await instanceService.getInstanceById(id)
      
      const instance = Instance.fromApiResponse(response)
      return instance
    } catch (error) {
      throw new Error(`Failed to get instance: ${error.message}`)
    }
  }

  /**
   * Get default instance
   * @returns {Promise<Instance>} Default Instance instance
   */
  static async getDefaultInstance() {
    try {
      const response = await instanceService.getDefaultInstance()
      
      const instance = Instance.fromApiResponse(response)
      return instance
    } catch (error) {
      console.error('❌ InstanceController: Error getting default instance:', error)
      throw new Error(`Failed to get default instance: ${error.message}`)
    }
  }

  /**
   * Get admin instance
   * @returns {Promise<Instance>} Admin Instance instance
   */
  static async getAdminInstance() {
    try {
      const response = await instanceService.getAdminInstance()
      
      const instance = Instance.fromApiResponse(response)
      return instance
    } catch (error) {
      console.error('❌ InstanceController: Error getting admin instance:', error)
      throw new Error(`Failed to get admin instance: ${error.message}`)
    }
  }

  /**
   * Transform instance data from API to frontend format
   * @param {Object} apiData - Raw API data
   * @returns {Instance} Instance instance
   */
  static transformInstanceFromAPI(apiData) {
    return Instance.fromApiResponse(apiData)
  }

  /**
   * Transform instance data from frontend to API format
   * @param {Instance|Object} instanceData - Instance instance or data
   * @returns {Object} API-compatible data
   */
  static transformInstanceToAPI(instanceData) {
    if (instanceData instanceof Instance) {
      return instanceData.toApiFormat()
    }
    
    const instance = new Instance(instanceData)
    return instance.toApiFormat()
  }

  /**
   * Validate instance data
   * @param {Object} instanceData - Instance data to validate
   * @returns {Object} Validation result with errors array
   */
  static validateInstanceData(instanceData) {
    const instance = new Instance(instanceData)
    return instance.validate()
  }

  /**
   * Get instance statistics
   * @param {Instance[]} instances - Array of instances
   * @returns {Object} Statistics object
   */
  static getInstanceStatistics(instances) {
    const stats = {
      total: instances.length,
      active: 0,
      inactive: 0,
      configured: 0,
      admin: 0,
      default: 0,
      custom: 0
    }

    instances.forEach(instance => {
      if (instance.status === 'ACTIVE') stats.active++
      if (instance.status === 'INACTIVE') stats.inactive++
      if (instance.configured) stats.configured++
      if (instance.type === 'ADMIN') stats.admin++
      if (instance.type === 'DEFAULT') stats.default++
      if (instance.type === 'CUST_SPECIFIC') stats.custom++
    })

    return stats
  }
}

export default InstanceController
