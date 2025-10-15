/**
 * NetworkInterface Model
 * Represents a network interface entity
 */

class NetworkInterface {
  constructor(data = {}) {
    this.id = data.id || null
    this.type = data.type || 'IFEntity'
    this.ifName = data.ifName || ''
    this.ifIndex = data.ifIndex || 0
    this.ifMtu = data.ifMtu || 1500
    this.ifMac = data.ifMac || ''
    this.ifStatus = data.ifStatus || 'DOWN'
    this.ifStreamDirection = data.ifStreamDirection || 'BOTH'
    this.ifAddresses = data.ifAddresses || []
    this.inUse = data.inUse !== undefined ? data.inUse : false
    this.available = data.available !== undefined ? data.available : false
    this.multicast = data.multicast !== undefined ? data.multicast : false
    this.virtual = data.virtual !== undefined ? data.virtual : false
    this.loopback = data.loopback !== undefined ? data.loopback : false
    this.supportsMulticast = data.supportsMulticast !== undefined ? data.supportsMulticast : false
    this.instanceId = data.instanceId || null
    this.vlanName = data.vlanName || null
    this.vlanId = data.vlanId || -1
    this.up = data.up !== undefined ? data.up : false
  }

  /**
   * Create NetworkInterface from API response
   * @param {Object} apiData - Raw API response data
   * @returns {NetworkInterface} - New NetworkInterface instance
   */
  static fromApiResponse(apiData) {
    return new NetworkInterface({
      id: apiData.id,
      type: apiData.type,
      ifName: apiData.ifName,
      ifIndex: apiData.ifIndex,
      ifMtu: apiData.ifMtu,
      ifMac: apiData.ifMac,
      ifStatus: apiData.ifStatus,
      ifStreamDirection: apiData.ifStreamDirection,
      ifAddresses: apiData.ifAddresses || [],
      inUse: apiData.inUse,
      available: apiData.available,
      multicast: apiData.multicast,
      virtual: apiData.virtual,
      loopback: apiData.loopback,
      supportsMulticast: apiData.supportsMulticast,
      instanceId: apiData.instanceId,
      vlanName: apiData.vlanName,
      vlanId: apiData.vlanId,
      up: apiData.up
    })
  }

  /**
   * Get interface status
   * @returns {string} - Interface status
   */
  getStatus() {
    return this.ifStatus
  }

  /**
   * Get status badge class for UI
   * @returns {string} - CSS class for status badge
   */
  getStatusBadgeClass() {
    switch (this.ifStatus) {
      case 'UP': return 'badge-success'
      case 'DOWN': return 'badge-error'
      case 'UNKNOWN': return 'badge-warning'
      default: return 'badge-ghost'
    }
  }

  /**
   * Get interface type badge class
   * @returns {string} - CSS class for type badge
   */
  getTypeBadgeClass() {
    if (this.loopback) return 'badge-info'
    if (this.virtual) return 'badge-secondary'
    return 'badge-primary'
  }

  /**
   * Get interface type display name
   * @returns {string} - Human readable type
   */
  getTypeDisplay() {
    if (this.loopback) return 'Loopback'
    if (this.virtual) return 'Virtual'
    return 'Physical'
  }

  /**
   * Get primary IPv4 address
   * @returns {string} - Primary IPv4 address or '-'
   */
  get primaryIPv4() {
    const ipv4Addresses = this.ifAddresses.filter(addr => 
      addr.includes('.') && !addr.includes('%') && !addr.startsWith('127.')
    )
    return ipv4Addresses.length > 0 ? ipv4Addresses[0] : '-'
  }

  /**
   * Get primary IPv6 address
   * @returns {string} - Primary IPv6 address or '-'
   */
  get primaryIPv6() {
    const ipv6Addresses = this.ifAddresses.filter(addr => 
      addr.includes(':') && !addr.startsWith('127.') && !addr.startsWith('::1')
    )
    return ipv6Addresses.length > 0 ? ipv6Addresses[0].split('%')[0] : '-'
  }

  /**
   * Get formatted MAC address
   * @returns {string} - Formatted MAC address
   */
  get formattedMac() {
    if (!this.ifMac || this.ifMac === 'none') return '-'
    return this.ifMac.toUpperCase()
  }

  /**
   * Get formatted MTU
   * @returns {string} - Formatted MTU with unit
   */
  get formattedMtu() {
    return `${this.ifMtu} bytes`
  }

  /**
   * Check if interface is operational
   * @returns {boolean} - True if interface is up and operational
   */
  get isOperational() {
    return this.up && this.ifStatus === 'UP'
  }

  /**
   * Get capabilities as array
   * @returns {Array} - Array of capability strings
   */
  get capabilities() {
    const caps = []
    if (this.supportsMulticast) caps.push('Multicast')
    if (this.multicast) caps.push('Multicast Active')
    if (this.virtual) caps.push('Virtual')
    if (this.loopback) caps.push('Loopback')
    return caps
  }

  /**
   * Validate network interface data
   * @returns {Object} - Validation result with isValid boolean and errors array
   */
  validate() {
    const errors = []
    
    if (!this.ifName || this.ifName.trim() === '') {
      errors.push('Interface name is required')
    }
    
    if (this.ifIndex < 0) {
      errors.push('Interface index must be non-negative')
    }
    
    if (this.ifMtu <= 0) {
      errors.push('MTU must be positive')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Clone the network interface
   * @returns {NetworkInterface} - Cloned instance
   */
  clone() {
    return new NetworkInterface(JSON.parse(JSON.stringify(this)))
  }
}

export default NetworkInterface
