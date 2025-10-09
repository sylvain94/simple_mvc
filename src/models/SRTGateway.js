/**
 * SRTGateway Model - Specialized Gateway for SRT protocol
 * 
 * Extends the base Gateway model with SRT-specific functionality
 */

import Gateway from './Gateway.js'

class SRTGateway extends Gateway {
  constructor(data = {}) {
    super(data)
    
    // SRT-specific properties
    this.srtMode = data.srtMode || 'listener' // listener, caller, rendezvous
    this.foreignSRTAddress = data.foreignSRTAddress || ''
    this.foreignSRTPort = data.foreignSRTPort || 9998
    this.localSRTListenAddress = data.localSRTListenAddress || '0.0.0.0'
    this.localMCAddress = data.localMCAddress || ''
    this.localMCPort = data.localMCPort || 1234
    this.localSRCAddress = data.localSRCAddress || ''
    this.srtPassPhrase = data.srtPassPhrase || ''
    this.srtParameters = data.srtParameters || []
    this.mcParameters = data.mcParameters || []
    
    // Override default gateway type - preserve API type for proper display
    this.gatewayType = data.gatewayType || 'SRT_MC'
  }

  // SRT-specific constants
  static SRT_MODES = {
    LISTENER: 'listener',
    CALLER: 'caller',
    RENDEZVOUS: 'rendezvous'
  }

  static SRT_GATEWAY_TYPES = {
    SRT_TO_MC: 'SRT_MC',
    MC_TO_SRT: 'MC_SRT',
    SRT_TO_MBTS: 'SRT_MBTS',
    MBTS_TO_SRT: 'MBTS_SRT'
  }

  // Getters for computed properties
  get srtConnectionString() {
    return `srt://${this.foreignSRTAddress}:${this.foreignSRTPort}?mode=${this.srtMode}&latency=${this.latency}`
  }

  get multicastConnectionString() {
    const source = this.localSRCAddress ? `@${this.localSRCAddress}` : ''
    return `udp://${this.localMCAddress}:${this.localMCPort}${source}`
  }

  get isIncoming() {
    return this.gatewayType === 'SRT_MC' || this.gatewayType === 'SRT_MBTS'
  }

  get isOutgoing() {
    return this.gatewayType === 'MC_SRT' || this.gatewayType === 'MBTS_SRT'
  }

  get direction() {
    return this.isIncoming ? 'Incoming' : 'Outgoing'
  }

  // Validation methods
  validate() {
    const baseValidation = super.validate()
    const errors = [...baseValidation.errors]

    // SRT-specific validations
    if (!Object.values(SRTGateway.SRT_MODES).includes(this.srtMode)) {
      errors.push('Invalid SRT mode')
    }

    if (!this.foreignSRTAddress || this.foreignSRTAddress.trim() === '') {
      errors.push('Foreign SRT address is required')
    }

    if (!this.foreignSRTPort || this.foreignSRTPort < 1 || this.foreignSRTPort > 65535) {
      errors.push('Foreign SRT port must be between 1 and 65535')
    }

    if (!this.localMCAddress || this.localMCAddress.trim() === '') {
      errors.push('Local multicast address is required')
    }

    if (!this.localMCPort || this.localMCPort < 1 || this.localMCPort > 65535) {
      errors.push('Local multicast port must be between 1 and 65535')
    }

    if (!this.localSRTListenAddress || this.localSRTListenAddress.trim() === '') {
      errors.push('Local SRT listen address is required')
    }

    // Validate multicast address format
    if (this.localMCAddress && !this.isValidMulticastAddress(this.localMCAddress)) {
      errors.push('Invalid multicast address format')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Utility methods
  isValidMulticastAddress(address) {
    // Simple multicast address validation (224.0.0.0 to 239.255.255.255)
    const parts = address.split('.')
    if (parts.length !== 4) return false
    
    const firstOctet = parseInt(parts[0])
    return firstOctet >= 224 && firstOctet <= 239
  }

  // Transformation methods
  toJSON() {
    return {
      ...super.toJSON(),
      srtMode: this.srtMode,
      foreignSRTAddress: this.foreignSRTAddress,
      foreignSRTPort: this.foreignSRTPort,
      localSRTListenAddress: this.localSRTListenAddress,
      localMCAddress: this.localMCAddress,
      localMCPort: this.localMCPort,
      localSRCAddress: this.localSRCAddress,
      srtPassPhrase: this.srtPassPhrase,
      srtParameters: this.srtParameters,
      mcParameters: this.mcParameters
    }
  }

  toApiFormat() {
    return {
      id: this.id,
      name: this.name,
      description: this.description || '',
      gatewayType: this.gatewayType,
      srtMode: this.srtMode.toUpperCase(), // API expects uppercase
      foreignSRTAddress: this.foreignSRTAddress,
      foreignSRTPort: this.foreignSRTPort,
      localSRTListenAddress: this.localSRTListenAddress,
      localMCAddress: this.localMCAddress,
      localMCPort: this.localMCPort,
      localSRCAddress: this.localSRCAddress,
      srtPassPhrase: this.srtPassPhrase,
      srtParameters: this.srtParameters,
      mcParameters: this.mcParameters,
      enabled: this.enabled,
      active: this.isActive
    }
  }

  // Factory method to create from API response
  static fromApiResponse(apiData) {
    return new SRTGateway({
      id: apiData.id,
      name: apiData.name,
      gatewayType: apiData.gatewayType,
      technicalServiceName: apiData.technicalServiceName,
      running: apiData.running || false,
      enabled: apiData.enabled !== false,
      host: apiData.foreignSRTAddress || apiData.localSRTListenAddress || 'localhost',
      port: apiData.foreignSRTPort || apiData.localMCPort || 9998,
      mode: apiData.srtMode?.toLowerCase() || 'listener',
      latency: 120, // Default SRT latency
      createdAt: apiData.createdAt,
      updatedAt: apiData.updatedAt,
      // SRT-specific fields
      srtMode: apiData.srtMode?.toLowerCase() || 'listener',
      foreignSRTAddress: apiData.foreignSRTAddress || '',
      foreignSRTPort: apiData.foreignSRTPort || 9998,
      localSRTListenAddress: apiData.localSRTListenAddress || '0.0.0.0',
      localMCAddress: apiData.localMCAddress || '',
      localMCPort: apiData.localMCPort || 1234,
      localSRCAddress: apiData.localSRCAddress || '',
      srtPassPhrase: apiData.srtPassPhrase || '',
      srtParameters: apiData.srtParameters || [],
      mcParameters: apiData.mcParameters || []
    })
  }

  // Method to clone the SRT gateway
  clone() {
    return new SRTGateway(this.toJSON())
  }

  // Method to update SRT-specific data
  updateSRTConfig(srtConfig) {
    Object.keys(srtConfig).forEach(key => {
      if (this.hasOwnProperty(key)) {
        this[key] = srtConfig[key]
      }
    })
    this.updatedAt = new Date()
  }

  // Method to get SRT configuration summary
  getSRTConfigSummary() {
    return {
      mode: this.srtMode,
      direction: this.direction,
      srtEndpoint: `${this.foreignSRTAddress}:${this.foreignSRTPort}`,
      multicastEndpoint: `${this.localMCAddress}:${this.localMCPort}`,
      listenAddress: this.localSRTListenAddress,
      hasPassPhrase: !!this.srtPassPhrase,
      parametersCount: this.srtParameters.length + this.mcParameters.length
    }
  }

  // Method to test SRT connection (placeholder)
  async testSRTConnection() {
    // This would implement actual SRT connection testing
    // For now, return a mock result
    return {
      success: true,
      message: 'SRT connection test not implemented',
      latency: this.latency,
      endpoint: this.srtConnectionString
    }
  }
}

export default SRTGateway
