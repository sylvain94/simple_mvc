/**
 * Model Gateway - Represents an SRT Gateway in the system
 * 
 * The Models in MVC are responsible for :
 * - Define the structure of the data
 * - Validate the data
 * - Transform/normalize the data
 * - Define the business rules on the data
 */

class Gateway {
  constructor(data = {}) {
    this.id = data.id || null
    this.name = data.name || ''
    this.gatewayType = data.gatewayType || 'SRT-Gateway'
    this.technicalServiceName = data.technicalServiceName || ''
    this.running = data.running !== undefined ? data.running : false
    this.enabled = data.enabled !== undefined ? data.enabled : true
    this.host = data.host || 'localhost'
    this.port = data.port || 9998
    this.mode = data.mode || 'listener' // listener, caller, rendezvous
    this.latency = data.latency || 120
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date()
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date()
  }

  // Constants for gateway types
  static TYPES = {
    ENCODER: 'SRT-Encoder',
    DECODER: 'SRT-Decoder',
    RELAY: 'SRT-Relay',
    GATEWAY: 'SRT-Gateway'
  }

  // Constants for modes
  static MODES = {
    LISTENER: 'listener',
    CALLER: 'caller',
    RENDEZVOUS: 'rendezvous'
  }

  // Getters for computed properties
  get isActive() {
    return this.running && this.enabled
  }

  get status() {
    if (this.running && this.enabled) return 'Active'
    if (this.running && !this.enabled) return 'Running but disabled'
    if (!this.running && this.enabled) return 'Stopped'
    return 'Inactive'
  }

  get connectionString() {
    return `srt://${this.host}:${this.port}?mode=${this.mode}&latency=${this.latency}`
  }

  get badgeClass() {
    if (this.isActive) return 'badge-success'
    if (this.running) return 'badge-warning'
    return 'badge-error'
  }

  // Validation methods
  validate() {
    const errors = []

    if (!this.name || this.name.trim() === '') {
      errors.push('Gateway name is required')
    }

    if (!Object.values(Gateway.TYPES).includes(this.gatewayType)) {
      errors.push('Invalid gateway type')
    }

    if (!Object.values(Gateway.MODES).includes(this.mode)) {
      errors.push('Invalid gateway mode')
    }

    if (!this.host || this.host.trim() === '') {
      errors.push('Host is required')
    }

    if (!this.port || this.port < 1 || this.port > 65535) {
      errors.push('Port must be between 1 and 65535')
    }

    if (this.latency < 20 || this.latency > 8000) {
      errors.push('Latency must be between 20 and 8000 milliseconds')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Private utility methods
  isValidHost(host) {
    // Simple host validation (IP or hostname)
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    const hostnameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/
    return ipRegex.test(host) || hostnameRegex.test(host) || host === 'localhost'
  }

  // Transformation methods
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      gatewayType: this.gatewayType,
      technicalServiceName: this.technicalServiceName,
      running: this.running,
      enabled: this.enabled,
      host: this.host,
      port: this.port,
      mode: this.mode,
      latency: this.latency,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    }
  }

  // Method to create a gateway from API data
  static fromApiResponse(apiData) {
    return new Gateway({
      id: apiData.id,
      name: apiData.name,
      gatewayType: apiData.gatewayType || apiData.type,
      technicalServiceName: apiData.technicalServiceName || apiData.serviceName,
      running: apiData.running || apiData.isRunning || false,
      enabled: apiData.enabled || apiData.isEnabled !== false,
      host: apiData.host || apiData.hostname || 'localhost',
      port: apiData.port || 9998,
      mode: apiData.mode || 'listener',
      latency: apiData.latency || 120,
      createdAt: apiData.createdAt || apiData.created_at,
      updatedAt: apiData.updatedAt || apiData.updated_at
    })
  }

  // Method to clone the gateway
  clone() {
    return new Gateway(this.toJSON())
  }

  // Method to update the data
  update(newData) {
    Object.keys(newData).forEach(key => {
      if (key !== 'id' && this.hasOwnProperty(key)) {
        this[key] = newData[key]
      }
    })
    this.updatedAt = new Date()
  }

  // Method to start the gateway
  start() {
    this.running = true
    this.updatedAt = new Date()
  }

  // Method to stop the gateway
  stop() {
    this.running = false
    this.updatedAt = new Date()
  }

  // Method to enable the gateway
  enable() {
    this.enabled = true
    this.updatedAt = new Date()
  }

  // Method to disable the gateway
  disable() {
    this.enabled = false
    this.updatedAt = new Date()
  }
}

export default Gateway
