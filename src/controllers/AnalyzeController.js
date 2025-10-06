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
   * Start analysis and wait for completion
   * @param {string} inputFileId - The ID of the input file
   * @param {Object} options - Polling options
   * @returns {Promise<AnalyzeResult>} Complete analysis result
   */
  static async analyzeAndWait(inputFileId, options = {}) {
    try {
      console.log(`🚀 AnalyzeController: Starting analysis for file ${inputFileId}`)
      
      // For now, just start analysis and return the result directly
      // The API might return results immediately instead of requiring polling
      const result = await this.startAnalysis(inputFileId)
      
      console.log('🎉 AnalyzeController: Analysis completed:', result)
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

    if (!inputFile.running) {
      console.warn(`⚠️ Input file must be running to be analyzed. Current status: '${inputFile.status}', running: ${inputFile.running}`)
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
