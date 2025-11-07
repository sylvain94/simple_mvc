import { apiGet, apiPut } from '../services/api.js'

/**
 * Application Controller
 * Manage the operations related to the application properties
 */
export class ApplicationController {
  
  /**
   * Get all the application properties
   * @returns {Promise<Object>} The application properties
   */
  static async getAllProperties() {
    try {
      console.log('🔍 ApplicationController: Getting all application properties...')
      
      const response = await apiGet('/utils/application/getAllProperties')
      
      console.log('✅ ApplicationController: Application properties retrieved:', response)
      
      return response
    } catch (error) {
      console.error('❌ ApplicationController: Error getting application properties:', error)
      throw error
    }
  }

  /**
   * Check if the application is configured
   * @returns {Promise<boolean>} true if the application is configured, false otherwise
   */
  static async isConfigured() {
    try {
      const properties = await this.getAllProperties()
      return properties.configured === true
    } catch (error) {
      console.error('❌ ApplicationController: Error checking configuration status:', error)
      // In case of error, we consider that the application is not configured
      return false
    }
  }

  /**
   * Mark the application as configured
   * @returns {Promise<Object>} The API response
   */
  static async markAsConfigured() {
    try {
      console.log('🔧 ApplicationController: Marking application as configured...')
      
      // Note: This method will be adapted according to the available API
      // For now, we simulate the request
      const response = await apiPut('/utils/application/setConfigured', { configured: true })
      
      console.log('✅ ApplicationController: Application marked as configured:', response)
      
      return response
    } catch (error) {
      console.error('❌ ApplicationController: Error marking application as configured:', error)
      throw error
    }
  }

  /**
   * Get the basic information of the application
   * @returns {Promise<Object>} The basic information
   */
  static async getApplicationInfo() {
    try {
      const properties = await this.getAllProperties()
      
      return {
        id: properties.id,
        name: properties.name,
        description: properties.description,
        version: properties.version,
        serialNumber: properties.serialNumber,
        configured: properties.configured
      }
    } catch (error) {
      console.error('❌ ApplicationController: Error getting application info:', error)
      throw error
    }
  }
}

export default ApplicationController