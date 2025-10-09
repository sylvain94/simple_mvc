/**
 * SRTGatewayController - Handles SRT Gateway business logic
 * 
 * The Controllers in MVC are responsible for:
 * - Orchestrating between Models and Services
 * - Handling business logic
 * - Data transformation and validation
 * - Error handling and logging
 * - Coordinating complex operations
 */

import Gateway from '../models/Gateway.js'
import { srtGatewayService } from '../services/api.js'

export class SRTGatewayController {
  /**
   * Get all SRT gateways
   * @returns {Promise<Array<Gateway>>} Array of Gateway instances
   */
  static async getAllSRTGateways() {
    try {
      console.log('🎮 SRTGatewayController: Getting all SRT gateways')
      
      const response = await srtGatewayService.getAllSRTGateways()
      
      // Handle different response formats
      let gatewaysData = []
      if (response && typeof response === 'object') {
        if (Array.isArray(response)) {
          gatewaysData = response
        } else if (response.data && Array.isArray(response.data)) {
          gatewaysData = response.data
        } else if (response.content && Array.isArray(response.content)) {
          gatewaysData = response.content
        } else {
          // If response is an object with gateway IDs as keys
          gatewaysData = Object.values(response).filter(item => 
            item && typeof item === 'object' && item.id
          )
        }
      }
      
      console.log(`✅ SRTGatewayController: Processing ${gatewaysData.length} SRT gateways`)
      
      // Transform API data to Gateway model instances
      const gateways = gatewaysData.map(gatewayData => {
        try {
          console.log('🔄 About to transform gateway:', gatewayData.name, 'with gatewayType:', gatewayData.gatewayType)
          return this.transformSRTGatewayFromAPI(gatewayData)
        } catch (error) {
          console.error('❌ Error transforming SRT gateway:', gatewayData, error)
          return null
        }
      }).filter(gateway => gateway !== null)
      
      console.log(`✅ SRTGatewayController: Successfully processed ${gateways.length} SRT gateways`)
      return gateways
      
    } catch (error) {
      console.error('❌ SRTGatewayController: Error getting all SRT gateways:', error)
      throw new Error(`Failed to retrieve SRT gateways: ${error.message}`)
    }
  }

  /**
   * Get SRT gateway by ID
   * @param {string} id - Gateway ID
   * @returns {Promise<Gateway>} Gateway instance
   */
  static async getSRTGatewayById(id) {
    try {
      console.log(`🎮 SRTGatewayController: Getting SRT gateway by ID: ${id}`)
      
      if (!id) {
        throw new Error('Gateway ID is required')
      }
      
      const response = await srtGatewayService.getSRTGatewayById(id)
      const gateway = this.transformSRTGatewayFromAPI(response)
      
      console.log(`✅ SRTGatewayController: Successfully retrieved SRT gateway: ${gateway.name}`)
      return gateway
      
    } catch (error) {
      console.error(`❌ SRTGatewayController: Error getting SRT gateway ${id}:`, error)
      throw new Error(`Failed to retrieve SRT gateway: ${error.message}`)
    }
  }

  /**
   * Create incoming SRT gateway
   * @param {Object} gatewayData - Gateway configuration
   * @returns {Promise<Gateway>} Created gateway instance
   */
  static async createIncomingSRTGateway(gatewayData) {
    try {
      console.log('🎮 SRTGatewayController: Creating incoming SRT gateway:', gatewayData)
      
      // Validate required fields for incoming SRT gateway
      this.validateSRTGatewayData(gatewayData, 'incoming')
      
      // Transform to API format
      const apiData = this.transformSRTGatewayToAPI(gatewayData)
      
      const response = await srtGatewayService.createIncomingSRTGateway(apiData)
      const gateway = this.transformSRTGatewayFromAPI(response)
      
      console.log(`✅ SRTGatewayController: Successfully created incoming SRT gateway: ${gateway.name}`)
      return gateway
      
    } catch (error) {
      console.error('❌ SRTGatewayController: Error creating incoming SRT gateway:', error)
      throw new Error(`Failed to create incoming SRT gateway: ${error.message}`)
    }
  }

  /**
   * Create outgoing SRT gateway
   * @param {Object} gatewayData - Gateway configuration
   * @returns {Promise<Gateway>} Created gateway instance
   */
  static async createOutgoingSRTGateway(gatewayData) {
    try {
      console.log('🎮 SRTGatewayController: Creating outgoing SRT gateway:', gatewayData)
      
      // Validate required fields for outgoing SRT gateway
      this.validateSRTGatewayData(gatewayData, 'outgoing')
      
      // Transform to API format
      const apiData = this.transformSRTGatewayToAPI(gatewayData)
      
      const response = await srtGatewayService.createOutgoingSRTGateway(apiData)
      const gateway = this.transformSRTGatewayFromAPI(response)
      
      console.log(`✅ SRTGatewayController: Successfully created outgoing SRT gateway: ${gateway.name}`)
      return gateway
      
    } catch (error) {
      console.error('❌ SRTGatewayController: Error creating outgoing SRT gateway:', error)
      throw new Error(`Failed to create outgoing SRT gateway: ${error.message}`)
    }
  }

  /**
   * Update SRT gateway
   * @param {string} id - Gateway ID
   * @param {Object} gatewayData - Updated gateway data
   * @returns {Promise<Gateway>} Updated gateway instance
   */
  static async updateSRTGateway(id, gatewayData) {
    try {
      console.log(`🎮 SRTGatewayController: Updating SRT gateway ${id}:`, gatewayData)
      
      if (!id) {
        throw new Error('Gateway ID is required')
      }
      
      // Validate updated data
      this.validateSRTGatewayData(gatewayData, 'update')
      
      // Transform to API format
      const apiData = this.transformSRTGatewayToAPI(gatewayData)
      
      const response = await srtGatewayService.updateSRTGateway(id, apiData)
      const gateway = this.transformSRTGatewayFromAPI(response)
      
      console.log(`✅ SRTGatewayController: Successfully updated SRT gateway: ${gateway.name}`)
      return gateway
      
    } catch (error) {
      console.error(`❌ SRTGatewayController: Error updating SRT gateway ${id}:`, error)
      throw new Error(`Failed to update SRT gateway: ${error.message}`)
    }
  }

  /**
   * Start SRT gateway
   * @param {string} id - Gateway ID
   * @returns {Promise<Object>} Start result
   */
  static async startSRTGateway(id) {
    try {
      console.log(`🎮 SRTGatewayController: Starting SRT gateway: ${id}`)
      
      if (!id) {
        throw new Error('Gateway ID is required')
      }
      
      const result = await srtGatewayService.startSRTGateway(id)
      
      console.log(`✅ SRTGatewayController: Successfully started SRT gateway: ${id}`)
      return result
      
    } catch (error) {
      console.error(`❌ SRTGatewayController: Error starting SRT gateway ${id}:`, error)
      throw new Error(`Failed to start SRT gateway: ${error.message}`)
    }
  }

  /**
   * Stop SRT gateway
   * @param {string} id - Gateway ID
   * @returns {Promise<Object>} Stop result
   */
  static async stopSRTGateway(id) {
    try {
      console.log(`🎮 SRTGatewayController: Stopping SRT gateway: ${id}`)
      
      if (!id) {
        throw new Error('Gateway ID is required')
      }
      
      const result = await srtGatewayService.stopSRTGateway(id)
      
      console.log(`✅ SRTGatewayController: Successfully stopped SRT gateway: ${id}`)
      return result
      
    } catch (error) {
      console.error(`❌ SRTGatewayController: Error stopping SRT gateway ${id}:`, error)
      throw new Error(`Failed to stop SRT gateway: ${error.message}`)
    }
  }

  /**
   * Delete SRT gateway
   * @param {string} id - Gateway ID
   * @returns {Promise<Object>} Delete result
   */
  static async deleteSRTGateway(id) {
    try {
      console.log(`🎮 SRTGatewayController: Deleting SRT gateway: ${id}`)
      
      if (!id) {
        throw new Error('Gateway ID is required')
      }
      
      const result = await srtGatewayService.deleteSRTGateway(id)
      
      console.log(`✅ SRTGatewayController: Successfully deleted SRT gateway: ${id}`)
      return result
      
    } catch (error) {
      console.error(`❌ SRTGatewayController: Error deleting SRT gateway ${id}:`, error)
      throw new Error(`Failed to delete SRT gateway: ${error.message}`)
    }
  }

  /**
   * Transform SRT gateway data from API response to Gateway model
   * @param {Object} apiData - Raw API data
   * @returns {Gateway} Gateway model instance
   */
  static transformSRTGatewayFromAPI(apiData) {
    try {
      // Debug: Log raw API data to see what we receive
      console.log('🔍 Raw API data for gateway:', apiData.name, 'gatewayType:', apiData.gatewayType)
      
      // Map SRT-specific fields to Gateway model
      const gatewayData = {
        id: apiData.id,
        name: apiData.name || `SRT Gateway ${apiData.id?.substring(0, 8)}`,
        gatewayType: this.mapSRTGatewayType(apiData.gatewayType),
        technicalServiceName: apiData.technicalServiceName,
        running: apiData.running || false,
        enabled: apiData.enabled !== false,
        host: apiData.foreignSRTAddress || apiData.localSRTListenAddress || 'localhost',
        port: apiData.foreignSRTPort || apiData.localMCPort || 9998,
        mode: this.mapSRTMode(apiData.srtMode),
        latency: 120, // Default SRT latency
        createdAt: apiData.createdAt,
        updatedAt: apiData.updatedAt,
        // Store SRT-specific data in a custom field
        srtConfig: {
          srtMode: apiData.srtMode,
          foreignSRTAddress: apiData.foreignSRTAddress,
          foreignSRTPort: apiData.foreignSRTPort,
          localSRTListenAddress: apiData.localSRTListenAddress,
          localMCAddress: apiData.localMCAddress,
          localMCPort: apiData.localMCPort,
          localSRCAddress: apiData.localSRCAddress,
          srtPassPhrase: apiData.srtPassPhrase,
          srtParameters: apiData.srtParameters || [],
          mcParameters: apiData.mcParameters || []
        }
      }
      
      return Gateway.fromApiResponse(gatewayData)
      
    } catch (error) {
      console.error('❌ Error transforming SRT gateway from API:', error)
      throw error
    }
  }

  /**
   * Transform Gateway model to API format for SRT gateways
   * @param {Object} gatewayData - Gateway data
   * @returns {Object} API-formatted data
   */
  static transformSRTGatewayToAPI(gatewayData) {
    try {
      return {
        name: gatewayData.name,
        description: gatewayData.description || '',
        gatewayType: gatewayData.gatewayType || 'SRT_MC',
        srtMode: gatewayData.srtMode || 'LISTENER',
        foreignSRTAddress: gatewayData.foreignSRTAddress || '',
        foreignSRTPort: gatewayData.foreignSRTPort || 9998,
        localSRTListenAddress: gatewayData.localSRTListenAddress || '0.0.0.0',
        localMCAddress: gatewayData.localMCAddress || '',
        localMCPort: gatewayData.localMCPort || 1234,
        localSRCAddress: gatewayData.localSRCAddress || '',
        srtPassPhrase: gatewayData.srtPassPhrase || '',
        srtParameters: gatewayData.srtParameters || [],
        mcParameters: gatewayData.mcParameters || [],
        enabled: gatewayData.enabled !== false,
        active: gatewayData.active !== false
      }
    } catch (error) {
      console.error('❌ Error transforming SRT gateway to API:', error)
      throw error
    }
  }

  /**
   * Map SRT gateway type from API to Gateway model
   * @param {string} apiType - API gateway type
   * @returns {string} Gateway model type
   */
  static mapSRTGatewayType(apiType) {
    // Preserve the original API type so formatType() can display it correctly
    return apiType || 'SRT_MC'
  }

  /**
   * Map SRT mode from API to Gateway model
   * @param {string} apiMode - API SRT mode
   * @returns {string} Gateway model mode
   */
  static mapSRTMode(apiMode) {
    const modeMap = {
      'LISTENER': 'listener',
      'CALLER': 'caller',
      'RENDEZ_VOUS': 'rendezvous'
    }
    return modeMap[apiMode] || 'listener'
  }

  /**
   * Validate SRT gateway data
   * @param {Object} gatewayData - Gateway data to validate
   * @param {string} operation - Operation type (incoming, outgoing, update)
   */
  static validateSRTGatewayData(gatewayData, operation) {
    const errors = []

    // Common validations
    if (!gatewayData.name || gatewayData.name.trim() === '') {
      errors.push('Gateway name is required')
    }

    if (operation === 'incoming' || operation === 'outgoing') {
      // Required fields for creation
      if (!gatewayData.gatewayType) {
        errors.push('Gateway type is required')
      }
      
      if (!gatewayData.srtMode) {
        errors.push('SRT mode is required')
      }
      
      if (!gatewayData.foreignSRTAddress) {
        errors.push('Foreign SRT address is required')
      }
      
      if (!gatewayData.foreignSRTPort || gatewayData.foreignSRTPort < 1 || gatewayData.foreignSRTPort > 65535) {
        errors.push('Valid foreign SRT port is required (1-65535)')
      }
      
      if (!gatewayData.localMCAddress) {
        errors.push('Local multicast address is required')
      }
      
      if (!gatewayData.localMCPort || gatewayData.localMCPort < 1 || gatewayData.localMCPort > 65535) {
        errors.push('Valid local multicast port is required (1-65535)')
      }
      
      if (!gatewayData.localSRTListenAddress) {
        errors.push('Local SRT listen address is required')
      }
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`)
    }
  }
}

export default SRTGatewayController
