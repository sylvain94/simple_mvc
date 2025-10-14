/**
 * Instance Model
 * Represents an instance entity
 */
class Instance {
  constructor(data = {}) {
    this.id = data.id || null
    this.instanceClass = data.instanceClass || 'InstanceEntity'
    this.serial = data.serial || ''
    this.name = data.name || ''
    this.licence = data.licence || null
    this.description = data.description || ''
    this.type = data.type || 'DEFAULT' // ADMIN, CUST_SPECIFIC, DEFAULT
    this.status = data.status || 'INACTIVE' // ACTIVE, INACTIVE, MAINTENANCE, DECOMMISSIONED
    this.configured = data.configured !== false
    this.position = data.position || 'ANY' // EDGE_IN, EDGE_OUT, INTERNAL, REMOTE, ANY
    this.startIP = data.startIP || ''
    this.endIP = data.endIP || ''
    this.startMCPort = data.startMCPort || 4000
    this.endMCPort = data.endMCPort || 6535
    
    // Timestamps
    this.createdAt = data.createdAt || new Date().toISOString()
    this.updatedAt = data.updatedAt || new Date().toISOString()
  }

  /**
   * Factory method to create Instance from API response
   * @param {Object} apiData - Raw API response data
   * @returns {Instance} New Instance instance
   */
  static fromApiResponse(apiData) {
    return new Instance({
      id: apiData.id,
      instanceClass: apiData.instanceClass,
      serial: apiData.serial,
      name: apiData.name,
      licence: apiData.licence,
      description: apiData.description,
      type: apiData.type,
      status: apiData.status,
      configured: apiData.configured,
      position: apiData.position,
      startIP: apiData.startIP,
      endIP: apiData.endIP,
      startMCPort: apiData.startMCPort,
      endMCPort: apiData.endMCPort,
      createdAt: apiData.createdAt,
      updatedAt: apiData.updatedAt
    })
  }

  /**
   * Convert Instance to API format
   * @returns {Object} API-compatible object
   */
  toApiFormat() {
    return {
      id: this.id,
      instanceClass: this.instanceClass,
      serial: this.serial,
      name: this.name,
      licence: this.licence,
      description: this.description,
      type: this.type,
      status: this.status,
      configured: this.configured,
      position: this.position,
      startIP: this.startIP,
      endIP: this.endIP,
      startMCPort: this.startMCPort,
      endMCPort: this.endMCPort
    }
  }

  /**
   * Get display status
   * @returns {string} Human-readable status
   */
  getStatus() {
    return this.status || 'Unknown'
  }

  /**
   * Get status badge class
   * @returns {string} CSS class for status badge
   */
  getStatusBadgeClass() {
    switch (this.status) {
      case 'ACTIVE': return 'badge-success'
      case 'INACTIVE': return 'badge-warning'
      case 'MAINTENANCE': return 'badge-info'
      case 'DECOMMISSIONED': return 'badge-error'
      default: return 'badge-ghost'
    }
  }

  /**
   * Get type badge class
   * @returns {string} CSS class for type badge
   */
  getTypeBadgeClass() {
    switch (this.type) {
      case 'ADMIN': return 'badge-primary'
      case 'DEFAULT': return 'badge-secondary'
      case 'CUST_SPECIFIC': return 'badge-accent'
      default: return 'badge-ghost'
    }
  }

  /**
   * Get position display name
   * @returns {string} Human-readable position
   */
  getPositionDisplay() {
    switch (this.position) {
      case 'EDGE_IN': return 'Edge In'
      case 'EDGE_OUT': return 'Edge Out'
      case 'INTERNAL': return 'Internal'
      case 'REMOTE': return 'Remote'
      case 'ANY': return 'Any'
      default: return this.position || 'Unknown'
    }
  }

  /**
   * Get IP range formatted
   * @returns {string} Formatted IP range
   */
  get ipRange() {
    if (this.startIP && this.endIP) {
      return `${this.startIP} - ${this.endIP}`
    }
    return this.startIP || '-'
  }

  /**
   * Get port range formatted
   * @returns {string} Formatted port range
   */
  get portRange() {
    if (this.startMCPort && this.endMCPort) {
      return `${this.startMCPort} - ${this.endMCPort}`
    }
    return `${this.startMCPort || 0} - ${this.endMCPort || 0}`
  }

  /**
   * Validate Instance data
   * @returns {Object} Validation result
   */
  validate() {
    const errors = []

    if (!this.name || this.name.trim() === '') {
      errors.push('Instance name is required')
    }

    if (!this.startIP || this.startIP.trim() === '') {
      errors.push('Start IP is required')
    }

    if (!this.endIP || this.endIP.trim() === '') {
      errors.push('End IP is required')
    }

    if (this.startMCPort < 1 || this.startMCPort > 65535) {
      errors.push('Valid start port is required (1-65535)')
    }

    if (this.endMCPort < 1 || this.endMCPort > 65535) {
      errors.push('Valid end port is required (1-65535)')
    }

    if (this.startMCPort > this.endMCPort) {
      errors.push('Start port must be less than or equal to end port')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Clone the Instance
   * @returns {Instance} New Instance instance
   */
  clone() {
    return new Instance(this.toApiFormat())
  }
}

export default Instance
