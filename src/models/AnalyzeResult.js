/**
 * AnalyzeResult Model
 * Represents the structure of analysis results for DVB streams
 */
export class AnalyzeResult {
  constructor(data = {}) {
    this.id = data.id || null;
    this.inputFileId = data.inputFileId || null;
    this.timestamp = data.timestamp || new Date().toISOString();
    this.status = data.status || 'pending'; // pending, running, completed, error
    this.transportStream = data.transportStream || null;
    this.services = data.services || [];
    this.tables = data.tables || [];
    this.errors = data.errors || [];
    this.metadata = data.metadata || {};
  }

  /**
   * Create AnalyzeResult from API response
   * @param {Object} apiData - Raw API response data
   * @returns {AnalyzeResult}
   */
  static fromApiResponse(apiData) {
    if (!apiData) return new AnalyzeResult();

    return new AnalyzeResult({
      id: apiData.id,
      inputFileId: apiData.inputFileId || apiData.input_file_id,
      timestamp: apiData.timestamp || apiData.created_at,
      status: apiData.status,
      transportStream: apiData.transportStream ? TransportStream.fromApiResponse(apiData.transportStream) : null,
      services: Array.isArray(apiData.services) ? apiData.services.map(s => Service.fromApiResponse(s)) : [],
      tables: Array.isArray(apiData.tables) ? apiData.tables.map(t => Table.fromApiResponse(t)) : [],
      errors: apiData.errors || [],
      metadata: apiData.metadata || {}
    });
  }

  /**
   * Convert to API format for requests
   * @returns {Object}
   */
  toApiFormat() {
    return {
      inputFileId: this.inputFileId,
      status: this.status,
      transportStream: this.transportStream ? this.transportStream.toApiFormat() : null,
      services: this.services.map(s => s.toApiFormat()),
      tables: this.tables.map(t => t.toApiFormat()),
      errors: this.errors,
      metadata: this.metadata
    };
  }

  /**
   * Get analysis tree structure for display
   * @returns {Object}
   */
  getAnalysisTree() {
    const tree = {
      type: 'root',
      label: 'Analysis Results',
      children: []
    };

    // Add transport stream
    if (this.transportStream) {
      tree.children.push({
        type: 'transport-stream',
        label: `Transport Stream ${this.transportStream.id}`,
        data: this.transportStream,
        children: []
      });
    }

    // Add services
    if (this.services.length > 0) {
      const servicesNode = {
        type: 'services',
        label: `Services (${this.services.length})`,
        children: this.services.map(service => ({
          type: 'service',
          label: `${service.isScrambled ? '🔒' : '🔓'} ${service.name} ${service.id} ${service.bitrate}`,
          data: service,
          children: service.pids.map(pid => ({
            type: 'pid',
            label: `${pid.type} ${pid.id} ${pid.bitrate}`,
            data: pid,
            children: []
          }))
        }))
      };
      tree.children.push(servicesNode);
    }

    // Add tables
    if (this.tables.length > 0) {
      tree.children.push({
        type: 'tables',
        label: 'Tables',
        children: this.tables.map(table => ({
          type: 'table',
          label: `${table.type} - ${table.name}`,
          data: table,
          children: []
        }))
      });
    }

    return tree;
  }

  /**
   * Check if analysis is complete
   * @returns {boolean}
   */
  isComplete() {
    return this.status === 'completed';
  }

  /**
   * Check if analysis has errors
   * @returns {boolean}
   */
  hasErrors() {
    return this.errors.length > 0 || this.status === 'error';
  }

  /**
   * Get summary statistics
   * @returns {Object}
   */
  getSummary() {
    return {
      totalServices: this.services.length,
      totalPids: this.services.reduce((total, service) => total + (service.pids ? service.pids.length : 0), 0),
      totalTables: this.tables.length,
      hasErrors: this.hasErrors(),
      errorCount: this.errors.length,
      status: this.status,
      timestamp: this.timestamp
    };
  }
}

/**
 * TransportStream Model
 */
export class TransportStream {
  constructor(data = {}) {
    this.id = data.id || null;
    this.bitrate = data.bitrate || 0;
    this.packetCount = data.packetCount || 0;
    this.duration = data.duration || 0;
  }

  static fromApiResponse(apiData) {
    return new TransportStream({
      id: apiData.id,
      bitrate: apiData.bitrate,
      packetCount: apiData.packet_count || apiData.packetCount,
      duration: apiData.duration
    });
  }

  toApiFormat() {
    return {
      id: this.id,
      bitrate: this.bitrate,
      packetCount: this.packetCount,
      duration: this.duration
    };
  }
}

/**
 * Service Model
 */
export class Service {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.isScrambled = data.isScrambled || false;
    this.bitrate = data.bitrate || 0;
    this.pids = data.pids || [];
  }

  static fromApiResponse(apiData) {
    return new Service({
      id: apiData.id,
      name: apiData.name,
      isScrambled: apiData['is-scrambled'] || apiData.isScrambled,
      bitrate: apiData.bitrate,
      pids: Array.isArray(apiData.pids) ? apiData.pids.map(p => Pid.fromApiResponse(p)) : []
    });
  }

  toApiFormat() {
    return {
      id: this.id,
      name: this.name,
      'is-scrambled': this.isScrambled,
      bitrate: this.bitrate,
      pids: this.pids.map(p => p.toApiFormat())
    };
  }
}

/**
 * PID Model
 */
export class Pid {
  constructor(data = {}) {
    this.id = data.id || null;
    this.type = data.type || '';
    this.bitrate = data.bitrate || 0;
  }

  static fromApiResponse(apiData) {
    return new Pid({
      id: apiData.id,
      type: apiData.type,
      bitrate: apiData.bitrate
    });
  }

  toApiFormat() {
    return {
      id: this.id,
      type: this.type,
      bitrate: this.bitrate
    };
  }
}

/**
 * Table Model
 */
export class Table {
  constructor(data = {}) {
    this.id = data.id || null;
    this.type = data.type || '';
    this.name = data.name || '';
    this.data = data.data || {};
  }

  static fromApiResponse(apiData) {
    return new Table({
      id: apiData.id,
      type: apiData.type,
      name: apiData.name,
      data: apiData.data || {}
    });
  }

  toApiFormat() {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      data: this.data
    };
  }
}

export default AnalyzeResult;
