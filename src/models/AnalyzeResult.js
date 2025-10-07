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
    this.pids = data.pids || [];
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
      id: apiData.id || null,
      inputFileId: apiData.inputFileId || null,
      timestamp: new Date().toISOString(),
      status: 'completed',
      transportStream: apiData.ts ? TransportStream.fromApiResponse(apiData.ts) : null,
      services: Array.isArray(apiData.services) ? apiData.services.map(s => Service.fromApiResponse(s)) : [],
      tables: Array.isArray(apiData.tables) ? apiData.tables.map(t => Table.fromApiResponse(t)) : [],
      pids: Array.isArray(apiData.pids) ? apiData.pids.map(p => Pid.fromApiResponse(p)) : [],
      errors: [],
      metadata: {
        time: apiData.time || {},
        duration: apiData.ts?.duration || 0
      }
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
      type: 'transport-stream',
      label: this.transportStream ? `Transport stream ${this.transportStream.id}` : 'Transport stream',
      data: this.transportStream,
      children: []
    };

    // Add services
    if (this.services.length > 0) {
      const servicesNode = {
        type: 'services',
        label: `Services (${this.services.length})`,
        children: this.services.map(service => {
          // Get PIDs for this service
          const servicePids = this.pids.filter(pid => service.pids.includes(pid.id));
          
          return {
            type: 'service',
            label: `${service.name} ID: ${service.id} Bitrate: ${service.bitrate}`,
            data: service,
            children: servicePids.map(pid => {
              let type = 'Data';
              if (pid.video) type = '🎥 Video';
              if (pid.audio) type = '🔊 Audio';
              if (pid.pmt) type = '📋 PMT';
              
              return {
                type: 'pid',
                label: `${type} PID: ${pid.id} Bitrate: ${pid.bitrate}`,
                data: pid,
                children: []
              };
            })
          };
        })
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
          label: `${table.getTableName()} (PID: ${table.pid})`,
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
      totalPids: this.pids.length,
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
    this.duration = data.duration || 0;
    this.packets = data.packets || {};
  }

  static fromApiResponse(apiData) {
    return new TransportStream({
      id: apiData.id,
      bitrate: apiData.bitrate,
      duration: apiData.duration,
      packets: apiData.packets || {}
    });
  }

  toApiFormat() {
    return {
      id: this.id,
      bitrate: this.bitrate,
      duration: this.duration,
      packets: this.packets
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
    this.provider = data.provider || '';
    this.type = data.type || null;
    this.typeName = data.typeName || '';
  }

  static fromApiResponse(apiData) {
    return new Service({
      id: apiData.id,
      name: apiData.name,
      isScrambled: apiData['is-scrambled'] || apiData.isScrambled,
      bitrate: apiData.bitrate,
      pids: apiData.pids || [],
      provider: apiData.provider,
      type: apiData.type,
      typeName: apiData['type-name'] || apiData.typeName
    });
  }

  toApiFormat() {
    return {
      id: this.id,
      name: this.name,
      'is-scrambled': this.isScrambled,
      bitrate: this.bitrate,
      pids: this.pids,
      provider: this.provider,
      type: this.type,
      'type-name': this.typeName
    };
  }
}

/**
 * PID Model
 */
export class Pid {
  constructor(data = {}) {
    this.id = data.id || null;
    this.description = data.description || '';
    this.bitrate = data.bitrate || 0;
    this.video = data.video || false;
    this.audio = data.audio || false;
    this.pmt = data.pmt || false;
    this.isScrambled = data.isScrambled || false;
    this.packets = data.packets || {};
    this.language = data.language || null;
  }

  static fromApiResponse(apiData) {
    return new Pid({
      id: apiData.id,
      description: apiData.description,
      bitrate: apiData.bitrate,
      video: apiData.video,
      audio: apiData.audio,
      pmt: apiData.pmt,
      isScrambled: apiData['is-scrambled'] || apiData.isScrambled,
      packets: apiData.packets || {},
      language: apiData.language
    });
  }

  toApiFormat() {
    return {
      id: this.id,
      description: this.description,
      bitrate: this.bitrate,
      video: this.video,
      audio: this.audio,
      pmt: this.pmt,
      'is-scrambled': this.isScrambled,
      packets: this.packets,
      language: this.language
    };
  }
}

/**
 * Table Model
 */
export class Table {
  constructor(data = {}) {
    this.pid = data.pid || null;
    this.tid = data.tid || null;
    this.tidExt = data.tidExt || null;
    this.sections = data.sections || 0;
    this.tables = data.tables || 0;
    this.repetitionMs = data.repetitionMs || 0;
    this.repetitionPkt = data.repetitionPkt || 0;
  }

  /**
   * Get table name based on PID and TID
   * @returns {string}
   */
  getTableName() {
    const pidToName = {
      0: 'PAT',
      1: 'CAT', 
      16: 'NIT',
      17: 'SDT',
      18: 'BAT',
      19: 'EIT',
      20: 'TDT'
    };
    
    const tidToName = {
      0: 'PAT',    // TID 0 = PAT
      1: 'CAT',    // TID 1 = CAT
      2: 'PMT',    // TID 2 = PMT
      64: 'NIT',   // TID 64 = NIT
      66: 'SDT',   // TID 66 = SDT
      67: 'BAT',   // TID 67 = BAT
      78: 'EIT',   // TID 78 = EIT
      112: 'TDT'   // TID 112 = TDT
    };
    
    // Si on a un PID valide et reconnu, l'utiliser
    if (this.pid !== null && this.pid !== undefined && pidToName[this.pid]) {
      return pidToName[this.pid];
    }
    
    // Si le PID est null mais qu'on a un TID, utiliser le TID
    if (this.tid !== null && this.tid !== undefined) {
      const nameFromTid = tidToName[this.tid];
      if (nameFromTid) {
        return nameFromTid;
      }
    }
    
    // Cas spéciaux basés sur les patterns observés
    if (this.tid === null && this.tidExt === 1) {
      // Probablement PAT si TID est null et tidExt est 1
      return 'PAT';
    }
    
    // Fallback pour PID non reconnu
    if (this.pid !== null && this.pid !== undefined) {
      return `Table PID ${this.pid}`;
    }
    
    console.warn('⚠️ Table has null/undefined PID and unknown TID:', this);
    return `Table (TID: ${this.tid})`;
  }

  static fromApiResponse(apiData) {
    return new Table({
      pid: apiData.pid,
      tid: apiData.tid,
      tidExt: apiData['tid-ext'] || apiData.tidExt,
      sections: apiData.sections,
      tables: apiData.tables,
      repetitionMs: apiData['repetition-ms'] || apiData.repetitionMs,
      repetitionPkt: apiData['repetition-pkt'] || apiData.repetitionPkt
    });
  }

  toApiFormat() {
    return {
      pid: this.pid,
      tid: this.tid,
      'tid-ext': this.tidExt,
      sections: this.sections,
      tables: this.tables,
      'repetition-ms': this.repetitionMs,
      'repetition-pkt': this.repetitionPkt
    };
  }
}

export default AnalyzeResult;
