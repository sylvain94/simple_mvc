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
      
      // Call the API to check the configuration
      const properties = await this.getAllProperties()
      console.log('📋 ApplicationController: Properties received (Status 200):', properties)
      
      // If we arrive here, it means that the API has returned a status 200
      // This means that the application is configured
      console.log('✅ ApplicationController: Application is configured (Status 200)')
      return true
      
    } catch (error) {
      console.log('🔍 ApplicationController: Error caught, analyzing status code...')
      
      // Check if it's a 404 error (application not configured)
      if (error.status === 404 || (error.message && error.message.includes('404'))) {
        console.log('📋 ApplicationController: Application not configured (Status 404)')
        return false
      }
      
      // For any other error (network, authentication, etc.)
      console.error('❌ ApplicationController: Unexpected error checking configuration:', error)
      console.error('❌ ApplicationController: Error details:', {
        status: error.status,
        message: error.message,
        stack: error.stack
      })
      
      // In case of unexpected error, we consider the application as not configured
      // to force the user to go to the wizard
      console.warn('⚠️ ApplicationController: Assuming not configured due to unexpected error')
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
      
      // Note: This method will be adapted according to the available API endpoints
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

  /**
   * Test method to verify the configuration check logic
   * @returns {Promise<void>}
   */
  static async testConfigurationCheck() {
    console.log('🧪 ApplicationController: Testing configuration check logic...')
    
    try {
      const isConfigured = await this.isConfigured()
      console.log(`🎯 ApplicationController: Configuration test result: ${isConfigured}`)
      
      if (isConfigured) {
        console.log('✅ Application is configured (Status 200 received)')
      } else {
        console.log('⚠️ Application is not configured (Status 404 received)')
      }
      
      return isConfigured
    } catch (error) {
      console.error('❌ ApplicationController: Configuration test failed:', error)
      throw error
    }
  }
}

export default ApplicationController