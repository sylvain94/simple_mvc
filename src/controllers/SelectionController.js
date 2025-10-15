import Selection from '../models/Selection.js'
import { selectionService } from '../services/api.js'

/**
 * Controller for managing selections
 */
export class SelectionController {
  /**
   * Get all selections
   * @returns {Promise<Selection[]>} Array of Selection instances
   */
  static async getAllSelections() {
    try {
      const response = await selectionService.getAllSelections()
      
      // Transform API response to Selection instances
      const selections = []
      if (response && typeof response === 'object') {
        // Handle different response formats
        const dataArray = Array.isArray(response) ? response : 
                         response.data ? response.data : 
                         response.selections ? response.selections : []
        
        for (const selectionData of dataArray) {
          selections.push(Selection.fromApiResponse(selectionData))
        }
      }
      
      return selections
    } catch (error) {
      console.error('❌ SelectionController: Error getting selections:', error)
      throw new Error(`Failed to get selections: ${error.message}`)
    }
  }

  /**
   * Get selection by ID
   * @param {string} id - Selection ID
   * @returns {Promise<Selection>} Selection instance
   */
  static async getSelectionById(id) {
    try {
      const response = await selectionService.getSelectionById(id)
      
      const selection = Selection.fromApiResponse(response)
      return selection
    } catch (error) {
      console.error('❌ SelectionController: Error getting selection:', error)
      throw new Error(`Failed to get selection: ${error.message}`)
    }
  }

  /**
   * Create new selection
   * @param {Object} selectionData - Selection data
   * @returns {Promise<Selection>} Created Selection instance
   */
  static async createSelection(selectionData) {
    try {
      
      // Validate selection data
      const selection = new Selection(selectionData)
      const validation = selection.validate()
      
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
      }
      
      // Transform to API format
      const apiData = selection.toApiFormat()
      const response = await selectionService.createSelection(apiData)
      
      const createdSelection = Selection.fromApiResponse(response)
      return createdSelection
    } catch (error) {
      console.error('❌ SelectionController: Error creating selection:', error)
      throw new Error(`Failed to create selection: ${error.message}`)
    }
  }

  /**
   * Update selection
   * @param {string} id - Selection ID
   * @param {Object} selectionData - Updated selection data
   * @returns {Promise<Selection>} Updated Selection instance
   */
  static async updateSelection(id, selectionData) {
    try {
      
      // Validate selection data
      const selection = new Selection(selectionData)
      const validation = selection.validate()
      
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
      }
      
      // Transform to API format
      const apiData = selection.toApiFormat()
      const response = await selectionService.updateSelection(id, apiData)
      
      const updatedSelection = Selection.fromApiResponse(response)
      return updatedSelection
    } catch (error) {
      console.error('❌ SelectionController: Error updating selection:', error)
      throw new Error(`Failed to update selection: ${error.message}`)
    }
  }

  /**
   * Start selection
   * @param {string} id - Selection ID
   * @returns {Promise<boolean>} Success status
   */
  static async startSelection(id) {
    try {
      await selectionService.startSelection(id)
      
      return true
    } catch (error) {
      console.error('❌ SelectionController: Error starting selection:', error)
      throw new Error(`Failed to start selection: ${error.message}`)
    }
  }

  /**
   * Stop selection
   * @param {string} id - Selection ID
   * @returns {Promise<boolean>} Success status
   */
  static async stopSelection(id) {
    try {
      await selectionService.stopSelection(id)
      
      return true
    } catch (error) {
      console.error('❌ SelectionController: Error stopping selection:', error)
      throw new Error(`Failed to stop selection: ${error.message}`)
    }
  }

  /**
   * Delete selection
   * @param {string} id - Selection ID
   * @returns {Promise<boolean>} Success status
   */
  static async deleteSelection(id) {
    try {
      await selectionService.deleteSelection(id)
      
      return true
    } catch (error) {
      console.error('❌ SelectionController: Error deleting selection:', error)
      throw new Error(`Failed to delete selection: ${error.message}`)
    }
  }

  /**
   * Transform selection data from API to frontend format
   * @param {Object} apiData - Raw API data
   * @returns {Selection} Selection instance
   */
  static transformSelectionFromAPI(apiData) {
    return Selection.fromApiResponse(apiData)
  }

  /**
   * Transform selection data from frontend to API format
   * @param {Selection|Object} selectionData - Selection instance or data
   * @returns {Object} API-compatible data
   */
  static transformSelectionToAPI(selectionData) {
    if (selectionData instanceof Selection) {
      return selectionData.toApiFormat()
    }
    
    const selection = new Selection(selectionData)
    return selection.toApiFormat()
  }

  /**
   * Validate selection data
   * @param {Object} selectionData - Selection data to validate
   * @returns {Object} Validation result with errors array
   */
  static validateSelectionData(selectionData) {
    const selection = new Selection(selectionData)
    return selection.validate()
  }

  /**
   * Get selection statistics
   * @param {Selection[]} selections - Array of selections
   * @returns {Object} Statistics object
   */
  static getSelectionStatistics(selections) {
    const stats = {
      total: selections.length,
      running: 0,
      enabled: 0,
      active: 0,
      disabled: 0,
      inactive: 0
    }

    selections.forEach(selection => {
      if (selection.running) stats.running++
      if (selection.enabled) stats.enabled++
      if (selection.active) stats.active++
      if (!selection.enabled) stats.disabled++
      if (!selection.active) stats.inactive++
    })

    return stats
  }
}

export default SelectionController
