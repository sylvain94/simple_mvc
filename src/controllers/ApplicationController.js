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
      
      const response = await apiGet('/utils/application/getAllProperties', true) // useAuth = true
      
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
      console.log('🔍 ApplicationController: Checking if application is configured...')
      const properties = await this.getAllProperties()
      console.log('📋 ApplicationController: Properties received:', properties)
      
      const isConfigured = properties && properties.configured === true
      console.log(`✅ ApplicationController: Application configured status: ${isConfigured}`)
      
      return isConfigured
    } catch (error) {
      console.error('❌ ApplicationController: Error checking configuration status:', error)
      console.error('❌ ApplicationController: Full error details:', error.message, error.stack)
      
      // En cas d'erreur, on considère que l'application n'est pas configurée
      // TEMPORAIRE: Pour déboguer, retournons true si l'erreur est liée à l'API
      if (error.message && error.message.includes('404')) {
        console.warn('⚠️ ApplicationController: API endpoint not found, assuming configured for now')
        return true // TEMPORAIRE - à supprimer une fois l'API implémentée
      }
      
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
   * Test method to simulate a configured application (for debugging)
   * @returns {Promise<Object>} Simulated configured application properties
   */
  static async getSimulatedConfiguredProperties() {
    return {
      id: "204d0d4b-4231-44ee-95be-961c08aa5a37",
      serialNumber: "30e8e73d-ab0e-41b1-95d7-26f2d29aa92a",
      name: "dev-01",
      description: "Mediahub-ws from dev-01",
      version: "V1.0.0.1a",
      configured: true
    }
  }

  /**
   * Test method to check the real API endpoint
   * @returns {Promise<void>}
   */
  static async testApiEndpoint() {
    try {
      console.log('🧪 ApplicationController: Testing API endpoint...')
      const response = await this.getAllProperties()
      console.log('✅ ApplicationController: API test successful:', response)
      return response
    } catch (error) {
      console.error('❌ ApplicationController: API test failed:', error)
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