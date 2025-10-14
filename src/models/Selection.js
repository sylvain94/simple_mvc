/**
 * Selection Model
 * Represents a selection function entity
 */
class Selection {
  constructor(data = {}) {
    this.id = data.id || null
    this.functionType = data.functionType || 'SelectionEntity'
    this.name = data.name || ''
    this.description = data.description || ''
    this.instanceID = data.instanceID || null
    this.command = data.command || ''
    this.inputType = data.inputType || 'UDP'
    this.outputType = data.outputType || 'UDP'
    this.outputFilePath = data.outputFilePath || ''
    this.outputFileName = data.outputFileName || ''
    this.inputOptions = data.inputOptions || []
    this.inputParameters = data.inputParameters || []
    this.inputProtocol = data.inputProtocol || 'udp'
    this.outputOptions = data.outputOptions || []
    this.outputParameters = data.outputParameters || []
    this.outputProtocol = data.outputProtocol || 'udp'
    this.matchingLinePattern = data.matchingLinePattern || ''
    this.maxMatchingLines = data.maxMatchingLines || 0
    this.maxTestDelay = data.maxTestDelay || 30000
    this.runTempoAfterLaunch = data.runTempoAfterLaunch || 1
    this.inputAnalyzeCommand = data.inputAnalyzeCommand || ''
    this.inputAnalyseMethod = data.inputAnalyseMethod || ''
    this.inputAnalyzeFormat = data.inputAnalyzeFormat || 'JSON'
    this.inputInputAnalyzeOptions = data.inputInputAnalyzeOptions || []
    this.outputInputAnalyzeOptions = data.outputInputAnalyzeOptions || []
    this.outputAnalyzeCommand = data.outputAnalyzeCommand || ''
    this.outputAnalyseMethod = data.outputAnalyseMethod || ''
    this.outputAnalyzeFormat = data.outputAnalyzeFormat || 'JSON'
    this.inputOutputAnalyzeOptions = data.inputOutputAnalyzeOptions || []
    this.outputOutputAnalyzeOptions = data.outputOutputAnalyzeOptions || []
    this.active = data.active !== false
    this.enabled = data.enabled !== false
    this.running = data.running || false
    this.auto_run = data.auto_run || false
    this.persistent = data.persistent !== false
    this.externalID = data.externalID || ''
    this.consumedResourceId = data.consumedResourceId || ''
    this.consumedResourceName = data.consumedResourceName || ''
    this.technicalServiceID = data.technicalServiceID || ''
    this.technicalServiceName = data.technicalServiceName || ''
    this.topologyID = data.topologyID || ''
    this.procPID = data.procPID || -1
    this.packetSize = data.packetSize || 1316
    this.currentOutputSignalNumber = data.currentOutputSignalNumber || 0
    this.maxOutputSignals = data.maxOutputSignals || 1
    this.currentInputSignalNumber = data.currentInputSignalNumber || 0
    this.maxInputSignals = data.maxInputSignals || 1
    this.controlIPAddress = data.controlIPAddress || ''
    this.controlPort = data.controlPort || 2221
    
    // Selection-specific properties
    this.multicastAddress = data.multicastAddress || ''
    this.multicastPort = data.multicastPort || 1234
    this.sourceAddress = data.sourceAddress || ''
    this.fullCommand = data.fullCommand || ''
    this.statuses = data.statuses || ''
    this.autoRun = data.autoRun || false
    this.inputSignals = data.inputSignals || {}
    this.outputSignal = data.outputSignal || {}
    
    // Timestamps
    this.createdAt = data.createdAt || new Date().toISOString()
    this.updatedAt = data.updatedAt || new Date().toISOString()
  }

  /**
   * Factory method to create Selection from API response
   * @param {Object} apiData - Raw API response data
   * @returns {Selection} New Selection instance
   */
  static fromApiResponse(apiData) {
    return new Selection({
      id: apiData.id,
      functionType: apiData.functionType,
      name: apiData.name,
      description: apiData.description,
      instanceID: apiData.instanceID,
      command: apiData.command,
      inputType: apiData.inputType,
      outputType: apiData.outputType,
      outputFilePath: apiData.outputFilePath,
      outputFileName: apiData.outputFileName,
      inputOptions: apiData.inputOptions,
      inputParameters: apiData.inputParameters,
      inputProtocol: apiData.inputProtocol,
      outputOptions: apiData.outputOptions,
      outputParameters: apiData.outputParameters,
      outputProtocol: apiData.outputProtocol,
      matchingLinePattern: apiData.matchingLinePattern,
      maxMatchingLines: apiData.maxMatchingLines,
      maxTestDelay: apiData.maxTestDelay,
      runTempoAfterLaunch: apiData.runTempoAfterLaunch,
      inputAnalyzeCommand: apiData.inputAnalyzeCommand,
      inputAnalyseMethod: apiData.inputAnalyseMethod,
      inputAnalyzeFormat: apiData.inputAnalyzeFormat,
      inputInputAnalyzeOptions: apiData.inputInputAnalyzeOptions,
      outputInputAnalyzeOptions: apiData.outputInputAnalyzeOptions,
      outputAnalyzeCommand: apiData.outputAnalyzeCommand,
      outputAnalyseMethod: apiData.outputAnalyseMethod,
      outputAnalyzeFormat: apiData.outputAnalyzeFormat,
      inputOutputAnalyzeOptions: apiData.inputOutputAnalyzeOptions,
      outputOutputAnalyzeOptions: apiData.outputOutputAnalyzeOptions,
      active: apiData.active,
      enabled: apiData.enabled,
      running: apiData.running,
      auto_run: apiData.auto_run,
      persistent: apiData.persistent,
      externalID: apiData.externalID,
      consumedResourceId: apiData.consumedResourceId,
      consumedResourceName: apiData.consumedResourceName,
      technicalServiceID: apiData.technicalServiceID,
      technicalServiceName: apiData.technicalServiceName,
      topologyID: apiData.topologyID,
      procPID: apiData.procPID,
      packetSize: apiData.packetSize,
      currentOutputSignalNumber: apiData.currentOutputSignalNumber,
      maxOutputSignals: apiData.maxOutputSignals,
      currentInputSignalNumber: apiData.currentInputSignalNumber,
      maxInputSignals: apiData.maxInputSignals,
      controlIPAddress: apiData.controlIPAddress,
      controlPort: apiData.controlPort,
      multicastAddress: apiData.multicastAddress,
      multicastPort: apiData.multicastPort,
      sourceAddress: apiData.sourceAddress,
      fullCommand: apiData.fullCommand,
      statuses: apiData.statuses,
      autoRun: apiData.autoRun,
      inputSignals: apiData.inputSignals,
      outputSignal: apiData.outputSignal,
      createdAt: apiData.createdAt,
      updatedAt: apiData.updatedAt
    })
  }

  /**
   * Convert Selection to API format
   * @returns {Object} API-compatible object
   */
  toApiFormat() {
    return {
      id: this.id,
      functionType: this.functionType,
      name: this.name,
      description: this.description,
      instanceID: this.instanceID,
      command: this.command,
      inputType: this.inputType,
      outputType: this.outputType,
      outputFilePath: this.outputFilePath,
      outputFileName: this.outputFileName,
      inputOptions: this.inputOptions,
      inputParameters: this.inputParameters,
      inputProtocol: this.inputProtocol,
      outputOptions: this.outputOptions,
      outputParameters: this.outputParameters,
      outputProtocol: this.outputProtocol,
      matchingLinePattern: this.matchingLinePattern,
      maxMatchingLines: this.maxMatchingLines,
      maxTestDelay: this.maxTestDelay,
      runTempoAfterLaunch: this.runTempoAfterLaunch,
      inputAnalyzeCommand: this.inputAnalyzeCommand,
      inputAnalyseMethod: this.inputAnalyseMethod,
      inputAnalyzeFormat: this.inputAnalyzeFormat,
      inputInputAnalyzeOptions: this.inputInputAnalyzeOptions,
      outputInputAnalyzeOptions: this.outputInputAnalyzeOptions,
      outputAnalyzeCommand: this.outputAnalyzeCommand,
      outputAnalyseMethod: this.outputAnalyseMethod,
      outputAnalyzeFormat: this.outputAnalyzeFormat,
      inputOutputAnalyzeOptions: this.inputOutputAnalyzeOptions,
      outputOutputAnalyzeOptions: this.outputOutputAnalyzeOptions,
      active: this.active,
      enabled: this.enabled,
      running: this.running,
      auto_run: this.auto_run,
      persistent: this.persistent,
      externalID: this.externalID,
      consumedResourceId: this.consumedResourceId,
      consumedResourceName: this.consumedResourceName,
      technicalServiceID: this.technicalServiceID,
      technicalServiceName: this.technicalServiceName,
      topologyID: this.topologyID,
      procPID: this.procPID,
      packetSize: this.packetSize,
      currentOutputSignalNumber: this.currentOutputSignalNumber,
      maxOutputSignals: this.maxOutputSignals,
      currentInputSignalNumber: this.currentInputSignalNumber,
      maxInputSignals: this.maxInputSignals,
      controlIPAddress: this.controlIPAddress,
      controlPort: this.controlPort,
      multicastAddress: this.multicastAddress,
      multicastPort: this.multicastPort,
      sourceAddress: this.sourceAddress,
      fullCommand: this.fullCommand,
      statuses: this.statuses,
      autoRun: this.autoRun,
      inputSignals: this.inputSignals,
      outputSignal: this.outputSignal
    }
  }

  /**
   * Validate Selection data
   * @returns {Object} Validation result
   */
  validate() {
    const errors = []

    if (!this.name || this.name.trim() === '') {
      errors.push('Selection name is required')
    }

    if (!this.multicastAddress || this.multicastAddress.trim() === '') {
      errors.push('Multicast address is required')
    }

    if (!this.multicastPort || this.multicastPort < 1 || this.multicastPort > 65535) {
      errors.push('Valid multicast port is required (1-65535)')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Get display status
   * @returns {string} Human-readable status
   */
  getStatus() {
    if (this.running) return 'Running'
    if (this.enabled && this.active) return 'Ready'
    if (!this.enabled) return 'Disabled'
    if (!this.active) return 'Inactive'
    return 'Unknown'
  }

  /**
   * Get status badge class
   * @returns {string} CSS class for status badge
   */
  getStatusBadgeClass() {
    const status = this.getStatus()
    switch (status) {
      case 'Running': return 'badge-success'
      case 'Ready': return 'badge-info'
      case 'Disabled': return 'badge-warning'
      case 'Inactive': return 'badge-error'
      default: return 'badge-ghost'
    }
  }

  /**
   * Get formatted multicast address with port
   * @returns {string} Formatted multicast address
   */
  get multicastAddressFormatted() {
    if (this.multicastAddress && this.multicastPort) {
      return `${this.multicastAddress}:${this.multicastPort}`
    }
    return this.multicastAddress || '-'
  }

  /**
   * Get full path (for compatibility with Files interface)
   * @returns {string} Full path representation
   */
  get fullPath() {
    return this.multicastAddressFormatted
  }

  /**
   * Get status for display (alias for getStatus for compatibility)
   * @returns {string} Status string
   */
  get status() {
    return this.getStatus()
  }

  /**
   * Clone the Selection
   * @returns {Selection} New Selection instance
   */
  clone() {
    return new Selection(this.toApiFormat())
  }
}

export default Selection
