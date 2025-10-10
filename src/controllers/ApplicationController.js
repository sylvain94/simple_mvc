import { applicationService } from '../services/api.js'

/**
 * Controller for managing application properties
 */
class ApplicationController {
  /**
   * Get all application properties
   * @returns {Promise<Object>} Application properties
   */
  static async getAllProperties() {
    try {
      console.log('🏢 ApplicationController: Getting all application properties')
      const properties = await applicationService.getAllProperties()
      console.log('✅ ApplicationController: Successfully retrieved application properties')
      return properties
    } catch (error) {
      console.error('❌ ApplicationController: Error getting application properties:', error)
      throw new Error(`Failed to get application properties: ${error.message}`)
    }
  }
}

export default ApplicationController
