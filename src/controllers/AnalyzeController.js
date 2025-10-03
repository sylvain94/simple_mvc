/**
 * AnalyzeController
 * Handles analysis business logic and coordinates between services and views
 */

import { analyzeService } from '../services/api.js'
import { AnalyzeResult } from '../models/AnalyzeResult.js'

export class AnalyzeController {
  /**
   * Start analysis for an input file
   * @param {string} inputFileId - The ID of the input file to analyze
   * @returns {Promise<AnalyzeResult>} Analysis result
   */
  static async startAnalysis(inputFileId) {
    try {
      console.log(`🎬 AnalyzeController: Starting analysis for file ${inputFileId}`)
      
      if (!inputFileId) {
        throw new Error('Input file ID is required')
      }

      // Start the analysis via API
      const apiResponse = await analyzeService.startAnalysis(inputFileId)
      
      // Convert API response to AnalyzeResult model
      const analyzeResult = AnalyzeResult.fromApiResponse(apiResponse)
      
      console.log('✅ AnalyzeController: Analysis started successfully:', analyzeResult)
      return analyzeResult
      
    } catch (error) {
      console.error(`❌ AnalyzeController: Error starting analysis for file ${inputFileId}:`, error)
      throw new Error(`Failed to start analysis: ${error.message}`)
    }
  }

  /**
   * Get analysis results for an input file
   * @param {string} inputFileId - The ID of the input file
   * @returns {Promise<AnalyzeResult>} Analysis results
   */
  static async getAnalysisResults(inputFileId) {
    try {
      console.log(`📊 AnalyzeController: Getting analysis results for file ${inputFileId}`)
      
      if (!inputFileId) {
        throw new Error('Input file ID is required')
      }

      // Get analysis results via API
      const apiResponse = await analyzeService.getAnalysisResults(inputFileId)
      
      // Convert API response to AnalyzeResult model
      const analyzeResult = AnalyzeResult.fromApiResponse(apiResponse)
      
      console.log('✅ AnalyzeController: Analysis results retrieved:', analyzeResult)
      return analyzeResult
      
    } catch (error) {
      console.error(`❌ AnalyzeController: Error getting analysis results for file ${inputFileId}:`, error)
      throw new Error(`Failed to get analysis results: ${error.message}`)
    }
  }

  /**
   * Get analysis status for an input file
   * @param {string} inputFileId - The ID of the input file
   * @returns {Promise<Object>} Analysis status
   */
  static async getAnalysisStatus(inputFileId) {
    try {
      console.log(`⏳ AnalyzeController: Getting analysis status for file ${inputFileId}`)
      
      if (!inputFileId) {
        throw new Error('Input file ID is required')
      }

      // Get analysis status via API
      const statusResponse = await analyzeService.getAnalysisStatus(inputFileId)
      
      console.log('✅ AnalyzeController: Analysis status retrieved:', statusResponse)
      return statusResponse
      
    } catch (error) {
      console.error(`❌ AnalyzeController: Error getting analysis status for file ${inputFileId}:`, error)
      throw new Error(`Failed to get analysis status: ${error.message}`)
    }
  }

  /**
   * Cancel analysis for an input file
   * @param {string} inputFileId - The ID of the input file
   * @returns {Promise<Object>} Cancellation result
   */
  static async cancelAnalysis(inputFileId) {
    try {
      console.log(`🛑 AnalyzeController: Cancelling analysis for file ${inputFileId}`)
      
      if (!inputFileId) {
        throw new Error('Input file ID is required')
      }

      // Cancel analysis via API
      const cancelResponse = await analyzeService.cancelAnalysis(inputFileId)
      
      console.log('✅ AnalyzeController: Analysis cancelled successfully:', cancelResponse)
      return cancelResponse
      
    } catch (error) {
      console.error(`❌ AnalyzeController: Error cancelling analysis for file ${inputFileId}:`, error)
      throw new Error(`Failed to cancel analysis: ${error.message}`)
    }
  }

  /**
   * Poll analysis status until completion or timeout
   * @param {string} inputFileId - The ID of the input file
   * @param {number} maxAttempts - Maximum polling attempts (default: 30)
   * @param {number} intervalMs - Polling interval in milliseconds (default: 2000)
   * @returns {Promise<AnalyzeResult>} Final analysis result
   */
  static async pollAnalysisUntilComplete(inputFileId, maxAttempts = 30, intervalMs = 2000) {
    try {
      console.log(`🔄 AnalyzeController: Polling analysis status for file ${inputFileId}`)
      
      let attempts = 0
      
      while (attempts < maxAttempts) {
        attempts++
        
        try {
          // Check status
          const status = await this.getAnalysisStatus(inputFileId)
          
          console.log(`🔄 Polling attempt ${attempts}/${maxAttempts}, status:`, status.status)
          
          // If completed, get full results
          if (status.status === 'completed') {
            console.log('✅ Analysis completed, fetching results...')
            return await this.getAnalysisResults(inputFileId)
          }
          
          // If error, throw
          if (status.status === 'error') {
            throw new Error(`Analysis failed: ${status.error || 'Unknown error'}`)
          }
          
          // If still running, wait and continue
          if (status.status === 'running' || status.status === 'pending') {
            await new Promise(resolve => setTimeout(resolve, intervalMs))
            continue
          }
          
        } catch (statusError) {
          console.warn(`⚠️ Status check failed on attempt ${attempts}:`, statusError.message)
          
          // If we can't get status, wait and try again
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, intervalMs))
            continue
          } else {
            throw statusError
          }
        }
      }
      
      // Timeout reached
      throw new Error(`Analysis polling timeout after ${maxAttempts} attempts`)
      
    } catch (error) {
      console.error(`❌ AnalyzeController: Error polling analysis for file ${inputFileId}:`, error)
      throw error
    }
  }

  /**
   * Start analysis and wait for completion
   * @param {string} inputFileId - The ID of the input file
   * @param {Object} options - Polling options
   * @returns {Promise<AnalyzeResult>} Complete analysis result
   */
  static async analyzeAndWait(inputFileId, options = {}) {
    try {
      console.log(`🚀 AnalyzeController: Starting analysis and waiting for completion for file ${inputFileId}`)
      
      // Start analysis
      await this.startAnalysis(inputFileId)
      
      // Poll until complete
      const result = await this.pollAnalysisUntilComplete(
        inputFileId, 
        options.maxAttempts || 30, 
        options.intervalMs || 2000
      )
      
      console.log('🎉 AnalyzeController: Analysis completed successfully:', result)
      return result
      
    } catch (error) {
      console.error(`❌ AnalyzeController: Error in analyzeAndWait for file ${inputFileId}:`, error)
      throw error
    }
  }

  /**
   * Get all analysis history
   * @returns {Promise<Array<AnalyzeResult>>} List of analysis results
   */
  static async getAllAnalysisHistory() {
    try {
      console.log('📋 AnalyzeController: Getting all analysis history')
      
      // Get analysis history via API
      const apiResponse = await analyzeService.getAllAnalysisHistory()
      
      // Convert API response to AnalyzeResult models
      const analysisHistory = Array.isArray(apiResponse) 
        ? apiResponse.map(item => AnalyzeResult.fromApiResponse(item))
        : []
      
      console.log('✅ AnalyzeController: Analysis history retrieved:', analysisHistory)
      return analysisHistory
      
    } catch (error) {
      console.error('❌ AnalyzeController: Error getting analysis history:', error)
      throw new Error(`Failed to get analysis history: ${error.message}`)
    }
  }

  /**
   * Validate input file for analysis
   * @param {Object} inputFile - Input file object
   * @returns {boolean} True if valid for analysis
   */
  static validateInputFileForAnalysis(inputFile) {
    if (!inputFile) {
      console.warn('⚠️ No input file provided for analysis validation')
      return false
    }

    if (!inputFile.id) {
      console.warn('⚠️ Input file missing ID for analysis')
      return false
    }

    if (inputFile.status !== 'active' && inputFile.status !== 'running') {
      console.warn(`⚠️ Input file status '${inputFile.status}' not suitable for analysis`)
      return false
    }

    console.log('✅ Input file is valid for analysis:', inputFile.id)
    return true
  }

  /**
   * Format analysis results for display
   * @param {AnalyzeResult} analyzeResult - Analysis result to format
   * @returns {Object} Formatted display data
   */
  static formatAnalysisForDisplay(analyzeResult) {
    if (!analyzeResult) {
      return {
        tree: null,
        summary: null,
        hasData: false
      }
    }

    return {
      tree: analyzeResult.getAnalysisTree(),
      summary: analyzeResult.getSummary(),
      hasData: true,
      isComplete: analyzeResult.isComplete(),
      hasErrors: analyzeResult.hasErrors(),
      timestamp: analyzeResult.timestamp,
      status: analyzeResult.status
    }
  }
}

export default AnalyzeController
