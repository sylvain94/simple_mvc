/**
 * InputFile Model
 * Represents an input file in the MediaHub system
 * Adapted to match the actual API response structure
 */
class InputFile {
  constructor(data = {}) {
    // Core identification
    this.id = data.id || null;
    this.functionType = data.functionType || 'InputFileToTSEntity';
    this.name = data.name || '';
    this.description = data.description || null;
    
    // File properties
    this.filePath = data.filePath || '';
    this.fileName = data.fileName || '';
    this.inputType = data.inputType || 'FILE';
    this.outputType = data.outputType || 'UNDEF';
    
    // Command and options
    this.command = data.command || 'ffmpeg';
    this.inputOptions = data.inputOptions || [];
    this.outputOptions = data.outputOptions || [];
    this.fullCommand = data.fullCommand || '';
    
    // Network configuration
    this.multicastAddress = data.multicastAddress || '';
    this.multicastPort = data.multicastPort || null;
    this.sourceAddress = data.sourceAddress || '';
    this.packetSize = data.packetSize || 1316;
    this.outputProtocol = data.outputProtocol || 'udp';
    this.inputProtocol = data.inputProtocol || 'udp';
    
    // Status and control
    this.active = data.active !== undefined ? data.active : true;
    this.enabled = data.enabled !== undefined ? data.enabled : true;
    this.running = data.running !== undefined ? data.running : false;
    this.auto_run = data.auto_run !== undefined ? data.auto_run : false;
    this.autoRun = data.autoRun !== undefined ? data.autoRun : false; // Alternative property name
    this.persistent = data.persistent !== undefined ? data.persistent : true;
    
    // Process information
    this.procPID = data.procPID || -1;
    this.instanceID = data.instanceID || null;
    
    // Analysis configuration
    this.maxTestDelay = data.maxTestDelay || 30000;
    this.runTempoAfterLaunch = data.runTempoAfterLaunch || 1;
    this.inputAnalyzeCommand = data.inputAnalyzeCommand || null;
    this.outputAnalyzeCommand = data.outputAnalyzeCommand || 'tsp';
    this.inputAnalyzeFormat = data.inputAnalyzeFormat || 'JSON';
    this.outputAnalyzeFormat = data.outputAnalyzeFormat || 'JSON';
    
    // Signal management
    this.currentOutputSignalNumber = data.currentOutputSignalNumber || 0;
    this.maxOutputSignals = data.maxOutputSignals || 1;
    this.currentInputSignalNumber = data.currentInputSignalNumber || 0;
    this.maxInputSignals = data.maxInputSignals || 0;
    
    // Control interface
    this.controlIPAddress = data.controlIPAddress || null;
    this.controlPort = data.controlPort || -1;
    
    // External references
    this.externalID = data.externalID || null;
    this.consumedResourceId = data.consumedResourceId || null;
    this.consumedResourceName = data.consumedResourceName || null;
    this.technicalServiceID = data.technicalServiceID || null;
    this.technicalServiceName = data.technicalServiceName || null;
    this.topologyID = data.topologyID || null;
    
    // Additional properties
    this.statuses = data.statuses || null;
    this.inputSignal = data.inputSignal || null;
    this.outputSignal = data.outputSignal || null;
  }

  /**
   * Status computed property
   */
  get status() {
    if (this.running && this.enabled) return 'Active';
    if (this.running && !this.enabled) return 'Running (Disabled)';
    if (!this.running && this.enabled) return 'Stopped';
    return 'Disabled';
  }

  /**
   * Get CSS class for status badge
   */
  getStatusBadgeClass() {
    if (this.running && this.enabled) return 'badge-success';
    if (this.running && !this.enabled) return 'badge-warning';
    if (!this.running && this.enabled) return 'badge-error';
    return 'badge-neutral';
  }

  /**
   * Check if file is active
   */
  get isActive() {
    return this.running && this.enabled;
  }

  /**
   * Get multicast address formatted
   */
  get multicastAddressFormatted() {
    if (this.multicastAddress && this.multicastPort) {
      return `${this.multicastAddress}:${this.multicastPort}`;
    }
    return 'Not configured';
  }

  /**
   * Get full file path
   */
  get fullPath() {
    // Handle null values and concatenate path + filename
    const path = this.filePath || '';
    const name = this.fileName || '';
    
    if (path && name) {
      // Make sure path ends with / if not empty
      const normalizedPath = path.endsWith('/') ? path : path + '/';
      return `${normalizedPath}${name}`;
    }
    
    if (path || name) {
      return path || name;
    }
    
    return 'No path specified';
  }

  /**
   * Format file size if available
   */
  get formattedSize() {
    if (!this.size) return 'Unknown';
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = this.size;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  /**
   * Validate the input file data
   */
  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim() === '') {
      errors.push('File name is required');
    }
    
    if (!this.filePath && !this.fileName) {
      errors.push('File path or file name is required');
    }
    
    if (this.multicastAddress && !this.isValidIP(this.multicastAddress)) {
      errors.push('Invalid multicast IP address');
    }
    
    if (this.multicastPort && (this.multicastPort < 1 || this.multicastPort > 65535)) {
      errors.push('Multicast port must be between 1 and 65535');
    }
    
    if (this.sourceAddress && !this.isValidIP(this.sourceAddress)) {
      errors.push('Invalid source IP address');
    }
    
    if (this.packetSize && (this.packetSize < 188 || this.packetSize > 65507)) {
      errors.push('Packet size must be between 188 and 65507');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if IP address is valid
   */
  isValidIP(ip) {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) return false;
    
    return ip.split('.').every(octet => {
      const num = parseInt(octet, 10);
      return num >= 0 && num <= 255;
    });
  }

  /**
   * Create InputFile from API response
   */
  static fromApiResponse(apiData) {
    return new InputFile({
      // Core identification
      id: apiData.id,
      functionType: apiData.functionType,
      name: apiData.name,
      description: apiData.description,
      
      // File properties
      filePath: apiData.filePath,
      fileName: apiData.fileName,
      inputType: apiData.inputType,
      outputType: apiData.outputType,
      
      // Command and options
      command: apiData.command,
      inputOptions: apiData.inputOptions,
      outputOptions: apiData.outputOptions,
      fullCommand: apiData.fullCommand,
      
      // Network configuration
      multicastAddress: apiData.multicastAddress,
      multicastPort: apiData.multicastPort,
      sourceAddress: apiData.sourceAddress,
      packetSize: apiData.packetSize,
      outputProtocol: apiData.outputProtocol,
      inputProtocol: apiData.inputProtocol,
      
      // Status and control
      active: apiData.active,
      enabled: apiData.enabled,
      running: apiData.running,
      auto_run: apiData.auto_run,
      autoRun: apiData.autoRun,
      persistent: apiData.persistent,
      
      // Process information
      procPID: apiData.procPID,
      instanceID: apiData.instanceID,
      
      // Analysis configuration
      maxTestDelay: apiData.maxTestDelay,
      runTempoAfterLaunch: apiData.runTempoAfterLaunch,
      inputAnalyzeCommand: apiData.inputAnalyzeCommand,
      outputAnalyzeCommand: apiData.outputAnalyzeCommand,
      inputAnalyzeFormat: apiData.inputAnalyzeFormat,
      outputAnalyzeFormat: apiData.outputAnalyzeFormat,
      
      // Signal management
      currentOutputSignalNumber: apiData.currentOutputSignalNumber,
      maxOutputSignals: apiData.maxOutputSignals,
      currentInputSignalNumber: apiData.currentInputSignalNumber,
      maxInputSignals: apiData.maxInputSignals,
      
      // Control interface
      controlIPAddress: apiData.controlIPAddress,
      controlPort: apiData.controlPort,
      
      // External references
      externalID: apiData.externalID,
      consumedResourceId: apiData.consumedResourceId,
      consumedResourceName: apiData.consumedResourceName,
      technicalServiceID: apiData.technicalServiceID,
      technicalServiceName: apiData.technicalServiceName,
      topologyID: apiData.topologyID,
      
      // Additional properties
      statuses: apiData.statuses,
      inputSignal: apiData.inputSignal,
      outputSignal: apiData.outputSignal
    });
  }

  /**
   * Convert to API format
   */
  toApiFormat() {
    return {
      // Identification
      id: this.id,
      name: this.name,
      description: this.description,
      
      // Mandatory fields according to the API
      filePath: this.filePath || "",                    // mandatory*
      fileName: this.fileName || "",                    // mandatory*
      multicastAddress: this.multicastAddress || "",    // mandatory*
      multicastPort: this.multicastPort || 0,           // mandatory*
      sourceAddress: this.sourceAddress || "",          // mandatory*
      
      // Network configuration and protocol
      inputType: this.inputType || "FILE",
      outputType: this.outputType || "UNDEF",
      outputProtocol: this.outputProtocol || "udp",
      inputProtocol: this.inputProtocol || "udp",
      packetSize: this.packetSize || 1316,
      
      // Commands and options
      command: this.command || "ffmpeg",
      inputOptions: Array.isArray(this.inputOptions) ? this.inputOptions : [],
      outputOptions: Array.isArray(this.outputOptions) ? this.outputOptions : [],
      fullCommand: this.fullCommand || "",
      
      // Status and control
      statuses: this.statuses || JSON.stringify({
        running: this.running !== undefined ? this.running : false,
        active: this.active !== undefined ? this.active : true,
        enabled: this.enabled !== undefined ? this.enabled : true
      }),
      autoRun: this.autoRun !== undefined ? this.autoRun : (this.auto_run !== undefined ? this.auto_run : false),
      persistent: this.persistent !== undefined ? this.persistent : true,
      
      // Process information
      procPID: this.procPID || -1,
      instanceID: this.instanceID || null,
      
      // Analysis configuration
      maxTestDelay: this.maxTestDelay || 30000,
      runTempoAfterLaunch: this.runTempoAfterLaunch || 1,
      inputAnalyzeCommand: this.inputAnalyzeCommand || null,
      outputAnalyzeCommand: this.outputAnalyzeCommand || "tsp",
      
      // Consumed resources
      externalID: this.externalID || null,
      consumedResourceId: this.consumedResourceId || null,
      consumedResourceName: this.consumedResourceName || null,
    };
  }

  /**
   * Clone the input file
   */
  clone() {
    return new InputFile(this.toApiFormat());
  }
}

export default InputFile;
