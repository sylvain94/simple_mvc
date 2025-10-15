import { apiGet, apiPost, apiPut, apiDelete } from '../services/api.js';
import InputFile from '../models/InputFile.js';

/**
 * InputFileController
 * Manage CRUD operations for input files
 */
export const InputFileController = {
  /**
   * Get all input files
   */
  async getAllInputFiles() {
    try {
      
      const response = await apiGet('/functions/input_files/getAll', true);
      
      if (!response || !Array.isArray(response)) {
        console.warn('⚠️ API response is not an array:', response);
        return [];
      }
      
      const inputFiles = response.map(fileData => {
        try {
          console.log(`🔍 Processing file data for "${fileData.name}":`, {
            filePath: fileData.filePath,
            fileName: fileData.fileName,
            multicastAddress: fileData.multicastAddress,
            multicastPort: fileData.multicastPort,
            running: fileData.running,
            enabled: fileData.enabled
          });
          
          const inputFile = InputFile.fromApiResponse(fileData);
          
          console.log(`✅ Created InputFile model:`, {
            name: inputFile.name,
            fullPath: inputFile.fullPath,
            multicastAddressFormatted: inputFile.multicastAddressFormatted,
            status: inputFile.status
          });
          
          const validation = inputFile.validate();
          
          if (!validation.isValid) {
            console.warn(`⚠️ Invalid input file data for ${fileData.name}:`, validation.errors);
          }
          
          return inputFile;
        } catch (error) {
          console.error(`❌ Error creating InputFile from data:`, fileData, error);
          return null;
        }
      }).filter(file => file !== null);
      
      return inputFiles;
      
    } catch (error) {
      throw new Error(`Failed to fetch input files: ${error.message}`);
    }
  },

  /**
   * Get an input file by ID
   */
  async getInputFileById(id) {
    try {
      
      const response = await apiGet(`/functions/input_files/getById/${id}`, true);
      
      if (!response) {
        throw new Error('Input file not found');
      }
      
      const inputFile = InputFile.fromApiResponse(response);
      
      return inputFile;
      
    } catch (error) {
      throw new Error(`Failed to fetch input file: ${error.message}`);
    }
  },

  /**
   * Create a new input file
   */
  async createInputFile(inputFileData) {
    try {
      
      const inputFile = new InputFile(inputFileData);
      const apiData = inputFile.toApiFormat();
      
      
      const validation = inputFile.validate();
      
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      
      const response = await apiPost('/functions/input_files/create', apiData, true);
      
      const createdFile = InputFile.fromApiResponse(response);
      
      return createdFile;
      
    } catch (error) {
      throw new Error(`Failed to create input file: ${error.message}`);
    }
  },

  /**
   * Update an input file
   */
  async updateInputFile(id, inputFileData) {
    try {
      
      const inputFile = new InputFile({ ...inputFileData, id });
      
      const apiData = inputFile.toApiFormat();
      
      const validation = inputFile.validate();
      
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      
      const response = await apiPut(`/functions/input_files/updateByID/${id}`, inputFile.toApiFormat(), true);
      
      const updatedFile = InputFile.fromApiResponse(response);
      
      return updatedFile;
      
    } catch (error) {
      throw new Error(`Failed to update input file: ${error.message}`);
    }
  },

  /**
   * Delete an input file
   */
  async deleteInputFile(id) {
    try {
      
      await apiDelete(`/functions/input_files/deleteByID/${id}`, true);
      
      return true;
      
    } catch (error) {
      throw new Error(`Failed to delete input file: ${error.message}`);
    }
  },

  /**
   * Start an input file
   */
  async startInputFile(id) {
    try {
      
      const response = await apiPut(`/functions/input_files/startByID/${id}`, {}, true);
      
      return response;
      
    } catch (error) {
      throw new Error(`Failed to start input file: ${error.message}`);
    }
  },

  /**
   * Stop an input file
   */
  async stopInputFile(id) {
    try {
      
      const response = await apiPut(`/functions/input_files/stopByID/${id}`, {}, true);
      
      return response;
      
    } catch (error) {
      throw new Error(`Failed to stop input file: ${error.message}`);
    }
  },

  /**
   * Toggle the state of an input file (start/stop)
   */
  async toggleInputFile(id, currentlyRunning) {
    try {
      if (currentlyRunning) {
        return await this.stopInputFile(id);
      } else {
        return await this.startInputFile(id);
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Refresh the list of input files
   */
  async refreshInputFiles() {
    return await this.getAllInputFiles();
  },

  /**
   * Search for input files
   */
  async searchInputFiles(query) {
    try {
      
      const allFiles = await this.getAllInputFiles();
      
      if (!query || query.trim() === '') {
        return allFiles;
      }
      
      const searchTerm = query.toLowerCase().trim();
      const filteredFiles = allFiles.filter(file => 
        file.name.toLowerCase().includes(searchTerm) ||
        file.path.toLowerCase().includes(searchTerm) ||
        file.description.toLowerCase().includes(searchTerm) ||
        file.multicast_ip.includes(searchTerm)
      );
      
      return filteredFiles;
      
    } catch (error) {
      throw new Error(`Failed to search input files: ${error.message}`);
    }
  },

  /**
   * Get the statistics of input files
   */
  async getInputFileStats() {
    try {
      const allFiles = await this.getAllInputFiles();
      
      const stats = {
        total: allFiles.length,
        active: allFiles.filter(f => f.isActive).length,
        enabled: allFiles.filter(f => f.enabled).length,
        running: allFiles.filter(f => f.running).length,
        autoRun: allFiles.filter(f => f.auto_run).length,
        persistent: allFiles.filter(f => f.persistent).length
      };
      
      return stats;
      
    } catch (error) {
      throw new Error(`Failed to get input file statistics: ${error.message}`);
    }
  }
};

export default InputFileController;
