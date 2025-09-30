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
      console.log('📁 Fetching all input files...');
      
      const response = await apiGet('/functions/input_files/getAll', true);
      console.log('📁 Raw API response:', response);
      
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
      
      console.log(`✅ Successfully loaded ${inputFiles.length} input files`);
      return inputFiles;
      
    } catch (error) {
      console.error('❌ Error fetching input files:', error);
      throw new Error(`Failed to fetch input files: ${error.message}`);
    }
  },

  /**
   * Get an input file by ID
   */
  async getInputFileById(id) {
    try {
      console.log(`📁 Fetching input file with ID: ${id}`);
      
      const response = await apiGet(`/functions/input_files/getById/${id}`, true);
      
      if (!response) {
        throw new Error('Input file not found');
      }
      
      const inputFile = InputFile.fromApiResponse(response);
      console.log(`✅ Input file loaded:`, inputFile);
      
      return inputFile;
      
    } catch (error) {
      console.error(`❌ Error fetching input file ${id}:`, error);
      throw new Error(`Failed to fetch input file: ${error.message}`);
    }
  },

  /**
   * Create a new input file
   */
  async createInputFile(inputFileData) {
    try {
      console.log('📁 Creating new input file:', inputFileData);
      
      const inputFile = new InputFile(inputFileData);
      const validation = inputFile.validate();
      
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      
      const response = await apiPost('/functions/input_files/create', inputFile.toApiFormat(), true);
      
      const createdFile = InputFile.fromApiResponse(response);
      console.log('✅ Input file created successfully:', createdFile);
      
      return createdFile;
      
    } catch (error) {
      console.error('❌ Error creating input file:', error);
      throw new Error(`Failed to create input file: ${error.message}`);
    }
  },

  /**
   * Update an input file
   */
  async updateInputFile(id, inputFileData) {
    try {
      console.log(`📁 Updating input file ${id}:`, inputFileData);
      
      const inputFile = new InputFile({ ...inputFileData, id });
      const validation = inputFile.validate();
      
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      
      const response = await apiPut(`/functions/input_files/updateByID/${id}`, inputFile.toApiFormat(), true);
      
      const updatedFile = InputFile.fromApiResponse(response);
      console.log('✅ Input file updated successfully:', updatedFile);
      
      return updatedFile;
      
    } catch (error) {
      console.error(`❌ Error updating input file ${id}:`, error);
      throw new Error(`Failed to update input file: ${error.message}`);
    }
  },

  /**
   * Delete an input file
   */
  async deleteInputFile(id) {
    try {
      console.log(`📁 Deleting input file ${id}`);
      
      await apiDelete(`/functions/input_files/deleteByID/${id}`, true);
      
      console.log(`✅ Input file ${id} deleted successfully`);
      return true;
      
    } catch (error) {
      console.error(`❌ Error deleting input file ${id}:`, error);
      throw new Error(`Failed to delete input file: ${error.message}`);
    }
  },

  /**
   * Start an input file
   */
  async startInputFile(id) {
    try {
      console.log(`▶️ Starting input file ${id}`);
      
      const response = await apiPut(`/functions/input_files/startByID/${id}`, {}, true);
      
      console.log(`✅ Input file ${id} started successfully:`, response);
      return response;
      
    } catch (error) {
      console.error(`❌ Error starting input file ${id}:`, error);
      throw new Error(`Failed to start input file: ${error.message}`);
    }
  },

  /**
   * Stop an input file
   */
  async stopInputFile(id) {
    try {
      console.log(`⏹️ Stopping input file ${id}`);
      
      const response = await apiPut(`/functions/input_files/stopByID/{id}?id=${id}`, {}, true);
      
      console.log(`✅ Input file ${id} stopped successfully:`, response);
      return response;
      
    } catch (error) {
      console.error(`❌ Error stopping input file ${id}:`, error);
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
      console.error(`❌ Error toggling input file ${id}:`, error);
      throw error;
    }
  },

  /**
   * Analyze an input file
   */
  async analyzeInputFile(id) {
    try {
      console.log(`🔍 Analyzing input file ${id}`);
      
      const response = await apiGet(`/functions/input_files/analyze/${id}`, true);
      
      console.log(`✅ Input file ${id} analysis completed:`, response);
      return response;
      
    } catch (error) {
      console.error(`❌ Error analyzing input file ${id}:`, error);
      throw new Error(`Failed to analyze input file: ${error.message}`);
    }
  },

  /**
   * Refresh the list of input files
   */
  async refreshInputFiles() {
    console.log('🔄 Refreshing input files list...');
    return await this.getAllInputFiles();
  },

  /**
   * Search for input files
   */
  async searchInputFiles(query) {
    try {
      console.log(`🔍 Searching input files with query: "${query}"`);
      
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
      
      console.log(`✅ Found ${filteredFiles.length} input files matching "${query}"`);
      return filteredFiles;
      
    } catch (error) {
      console.error('❌ Error searching input files:', error);
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
      
      console.log('📊 Input files statistics:', stats);
      return stats;
      
    } catch (error) {
      console.error('❌ Error getting input file stats:', error);
      throw new Error(`Failed to get input file statistics: ${error.message}`);
    }
  }
};

export default InputFileController;
