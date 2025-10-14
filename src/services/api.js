const API_BASE = import.meta.env.VITE_API_BASE || '/api/v1'

export async function apiGet(endpoint, useAuth = false) {
  const headers = { 'Content-Type': 'application/json' }
  
  if (useAuth) {
    const sessionData = localStorage.getItem('session')
    if (sessionData) {
      const { token } = JSON.parse(sessionData)
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  const res = await fetch(`${API_BASE}${endpoint}`, { headers })
  if (!res.ok) throw new Error(`GET ${endpoint} failed: ${res.status}`)
  return res.json()
}

export async function apiPost(endpoint, body, useAuth = false) {
  const headers = { 'Content-Type': 'application/json' }
  
  if (useAuth) {
    const sessionData = localStorage.getItem('session')
    if (sessionData) {
      const { token } = JSON.parse(sessionData)
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  const url = `${API_BASE}${endpoint}`
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  
  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`POST ${endpoint} failed: ${res.status} - ${errorText}`)
  }
  return res.json()
}

export async function apiPut(endpoint, body, useAuth = false) {
  const headers = { 'Content-Type': 'application/json' }
  
  if (useAuth) {
    const sessionData = localStorage.getItem('session')
    if (sessionData) {
      const { token } = JSON.parse(sessionData)
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`PUT ${endpoint} failed: ${res.status}`)
  return res.text() // For challengeUseridPassword which returns text in case of error
}

export async function apiDelete(endpoint, useAuth = false) {
  const headers = { 'Content-Type': 'application/json' }
  
  if (useAuth) {
    const sessionData = localStorage.getItem('session')
    if (sessionData) {
      const { token } = JSON.parse(sessionData)
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'DELETE',
    headers,
  })
  if (!res.ok) throw new Error(`DELETE ${endpoint} failed: ${res.status}`)
  return res.json()
}

/**
 * Specialized API function for analysis endpoints that expect text/plain
 */
export async function apiPutAnalyze(endpoint, useAuth = true) {
  const headers = { 
    'accept': 'text/plain',
    'Content-Type': 'application/json'
  }
  
  if (useAuth) {
    const sessionData = localStorage.getItem('session')
    if (sessionData) {
      const { token } = JSON.parse(sessionData)
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'PUT',
    headers
  })
  
  if (!res.ok) throw new Error(`PUT ${endpoint} failed: ${res.status}`)
  
  const responseText = await res.text()
  try {
    return JSON.parse(responseText)
  } catch {
    return { result: responseText, status: 'completed' }
  }
}

// Service for users
const userService = {
  /**
   * Retrieves all users
   */
  async getAllUsers() {
    try {
      return await apiGet('/utils/users/getAll', true)
    } catch (error) {
      throw error
    }
  },

  /**
   * Retrieves a user by their UserID
   */
  async getUserByUserid(userid) {
    try {
      const result = await apiGet(`/utils/users/getByUserID/${userid}`, true)
      return result
    } catch (error) {
      throw error
    }
  },

  /**
   * Retrieves a user by their name and first name
   */
  async getUserByName(firstName, lastName) {
    try {
      return await apiGet(`/utils/users/getByName/firstname/${firstName}/lastname/${lastName}`, true)
    } catch (error) {
      throw error
    }
  },

  /**
   * Creates a new user
   */
  async createUser(userData) {
    try {
      const result = await apiPost('/utils/users/create', userData, true)
      return result
    } catch (error) {
      throw error
    }
  },

  /**
   * Deletes a user by their ID
   */
  async deleteUserById(userId) {
    try {
      const result = await apiDelete(`/utils/users/deleteByID/${userId}`, true)
      return result
    } catch (error) {
      console.error(`❌ Error deleting user ${userId}:`, error)
      throw error
    }
  },

  /**
   * Resets the password of a user
   */
  async resetPasswordByUserID(userId, newPassword) {
    try {
      return await apiPut(`/utils/users/resetPasswordByUserID/${userId}/passwd/${newPassword}`, null, true)
    } catch (error) {
      console.error(`❌ Error resetting password for user ${userId}:`, error)
      throw error
    }
  },

  /**
   * Activates a user
   */
  async enableUserByID(userId) {
    try {
      return await apiPut(`/utils/users/enableByUserID/${userId}`, null, true)
    } catch (error) {
      console.error(`❌ Error enabling user ${userId}:`, error)
      throw error
    }
  },

  /**
   * Disables a user
   */
  async disableUserByID(userId) {
    try {
      return await apiPut(`/utils/users/disableByUserID/${userId}`, null, true)
    } catch (error) {
      console.error(`❌ Error disabling user ${userId}:`, error)
      throw error
    }
  },

  /**
   * Activates a user (active status)
   */
  async activateUserByID(userId) {
    try {
      return await apiPut(`/utils/users/activateByUserID/${userId}`, null, true)
    } catch (error) {
      console.error(`❌ Error activating user ${userId}:`, error)
      throw error
    }
  },

  /**
   * Deactivates a user (active status)
   */
  async deactivateUserByID(userId) {
    try {
      return await apiPut(`/utils/users/deactivateByUserID/${userId}`, null, true)
    } catch (error) {
      console.error(`❌ Error deactivating user ${userId}:`, error)
      throw error
    }
  }
}

// Service for roles
const roleService = {
  /**
   * Retrieves all roles
   */
  async getAllRoles() {
    try {
      return await apiGet('/utils/roles/getAll', true)
    } catch (error) {
      console.error('❌ Error getting all roles:', error)
      throw error
    }
  },

  /**
   * Creates a new role
   */
  async createRole(roleData) {
    try {
      return await apiPost('/utils/roles/create', roleData, true)
    } catch (error) {
      console.error('❌ Error creating role:', error)
      throw error
    }
  }
}

// Service for user-role relationships
const userRoleService = {
  /**
   * Retrieves all user-role relationships
   */
  async getAllUserRoles() {
    try {
      return await apiGet('/rel/users/roles/getAll', true)
    } catch (error) {
      console.error('❌ Error getting all user-role relationships:', error)
      throw error
    }
  },

  /**
   * Retrieves the roles of a user
   */
  async getRolesForUserID(userId) {
    try {
      const result = await apiGet(`/rel/users/roles/getRolesForUserID/${userId}`, true)
      return result
    } catch (error) {
      throw error
    }
  },

  /**
   * Retrieves all relationships by user
   */
  async getAllByUserID(userId) {
    try {
      return await apiGet(`/rel/users/roles/getAllByUserID/${userId}`, true)
    } catch (error) {
      console.error(`❌ Error getting relationships for user ${userId}:`, error)
      throw error
    }
  },

  /**
   * Retrieves all relationships by role
   */
  async getAllByRoleID(roleId) {
    try {
      return await apiGet(`/rel/users/roles/getAllByRoleID/${roleId}`, true)
    } catch (error) {
      console.error(`❌ Error getting relationships for role ${roleId}:`, error)
      throw error
    }
  },

  /**
   * Creates a user-role relationship
   */
  async createUserRoleRelation(userId, roleId) {
    try {
      return await apiPost(`/rel/users/roles/createByUserIDAndRoleID/user_id/${userId}/role_id/${roleId}`, null, true)
    } catch (error) {
      console.error(`❌ Error creating user-role relationship ${userId} -> ${roleId}:`, error)
      throw error
    }
  },

  /**
   * Deletes a user-role relationship
   */
  async deleteUserRoleRelation(relationId) {
    try {
      return await apiDelete(`/rel/users/roles/deleteByID/${relationId}`, true)
    } catch (error) {
      console.error(`❌ Error deleting user-role relationship ${relationId}:`, error)
      throw error
    }
  }
}

/**
 * Analyze Service
 * Handles analysis-related API operations
 */
const analyzeService = {
  /**
   * Start analysis for an input file
   * @param {string} inputFileId - The ID of the input file to analyze
   * @returns {Promise<Object>} Analysis result
   */
  async startAnalysis(inputFileId) {
    try {
      const result = await apiPutAnalyze(`/functions/input_files/analyzeByID/${inputFileId}`, true)
      return result
    } catch (error) {
      console.error(`❌ Error starting analysis for file ${inputFileId}:`, error)
      throw error
    }
  },


  /**
   * Cancel analysis for an input file
   * @param {string} inputFileId - The ID of the input file
   * @returns {Promise<Object>} Cancellation result
   */
  async cancelAnalysis(inputFileId) {
    try {
      const result = await apiDelete(`/functions/input_files/analysis/${inputFileId}`, true)
      return result
    } catch (error) {
      console.error(`❌ Error cancelling analysis for file ${inputFileId}:`, error)
      throw error
    }
  },

  /**
   * Get all analysis history
   * @returns {Promise<Array>} List of analysis results
   */
  async getAllAnalysisHistory() {
    try {      
      const result = await apiGet('/functions/input_files/analysis/history', true)      
      return result
    } catch (error) {
      console.error('❌ Error getting analysis history:', error)
      throw error
    }
  }
}

/**
 * SRT Gateway Service
 * Handles SRT Gateway-related API operations
 */
const srtGatewayService = {
  /**
   * Get all SRT gateways
   * @returns {Promise<Object>} List of SRT gateways
   */
  async getAllSRTGateways() {
    try {
      const result = await apiGet('/functions/gateways/srt/getAll', true)
      return result
    } catch (error) {
      console.error('❌ Error getting all SRT gateways:', error)
      throw error
    }
  },

  /**
   * Get SRT gateway by ID
   * @param {string} id - Gateway ID
   * @returns {Promise<Object>} SRT gateway data
   */
  async getSRTGatewayById(id) {
    try {
      const result = await apiGet(`/functions/gateways/srt/getByID/${id}`, true)
      return result
    } catch (error) {
      console.error(`❌ Error getting SRT gateway ${id}:`, error)
      throw error
    }
  },

  /**
   * Create incoming SRT gateway
   * @param {Object} gatewayData - Gateway configuration
   * @returns {Promise<Object>} Created gateway
   */
  async createIncomingSRTGateway(gatewayData) {
    try {
      const result = await apiPost('/functions/gateways/srt/createIncoming', gatewayData, true)
      return result
    } catch (error) {
      console.error('❌ Error creating incoming SRT gateway:', error)
      throw error
    }
  },

  /**
   * Create outgoing SRT gateway
   * @param {Object} gatewayData - Gateway configuration
   * @returns {Promise<Object>} Created gateway
   */
  async createOutgoingSRTGateway(gatewayData) {
    try {
      const result = await apiPost('/functions/gateways/srt/createOutgoing', gatewayData, true)
      return result
    } catch (error) {
      console.error('❌ Error creating outgoing SRT gateway:', error)
      throw error
    }
  },

  /**
   * Create incoming SRT gateway for specific instance
   * @param {string} instanceId - Instance ID
   * @param {Object} gatewayData - Gateway configuration
   * @returns {Promise<Object>} Created gateway
   */
  async createIncomingSRTGatewayForInstance(instanceId, gatewayData) {
    try {
      const result = await apiPost(`/functions/gateways/srt/createIncomingForInstanceID/instanceID/${instanceId}`, gatewayData, true)
      return result
    } catch (error) {
      console.error(`❌ Error creating incoming SRT gateway for instance ${instanceId}:`, error)
      throw error
    }
  },

  /**
   * Create outgoing SRT gateway for specific instance
   * @param {string} instanceId - Instance ID
   * @param {Object} gatewayData - Gateway configuration
   * @returns {Promise<Object>} Created gateway
   */
  async createOutgoingSRTGatewayForInstance(instanceId, gatewayData) {
    try {
      const result = await apiPost(`/functions/gateways/srt/createOutgoingForInstanceID/instanceID/${instanceId}`, gatewayData, true)
      return result
    } catch (error) {
      console.error(`❌ Error creating outgoing SRT gateway for instance ${instanceId}:`, error)
      throw error
    }
  },

  /**
   * Update SRT gateway
   * @param {string} id - Gateway ID
   * @param {Object} gatewayData - Updated gateway data
   * @returns {Promise<Object>} Updated gateway
   */
  async updateSRTGateway(id, gatewayData) {
    try {
      const result = await apiPut(`/functions/gateways/srt/updateByID/${id}`, gatewayData, true)
      return result
    } catch (error) {
      console.error(`❌ Error updating SRT gateway ${id}:`, error)
      throw error
    }
  },

  /**
   * Start SRT gateway
   * @param {string} id - Gateway ID
   * @returns {Promise<Object>} Start result
   */
  async startSRTGateway(id) {
    try {
      const result = await apiPut(`/functions/gateways/srt/startByID/${id}`, null, true)
      return result
    } catch (error) {
      console.error(`❌ Error starting SRT gateway ${id}:`, error)
      throw error
    }
  },

  /**
   * Stop SRT gateway
   * @param {string} id - Gateway ID
   * @returns {Promise<Object>} Stop result
   */
  async stopSRTGateway(id) {
    try {
      const result = await apiPut(`/functions/gateways/srt/stopByID/${id}`, null, true)
      return result
    } catch (error) {
      console.error(`❌ Error stopping SRT gateway ${id}:`, error)
      throw error
    }
  },

  /**
   * Delete SRT gateway
   * @param {string} id - Gateway ID
   * @returns {Promise<Object>} Delete result
   */
  async deleteSRTGateway(id) {
    try {
      const result = await apiDelete(`/functions/gateways/srt/deleteByID/${id}`, true)
      return result
    } catch (error) {
      console.error(`❌ Error deleting SRT gateway ${id}:`, error)
      throw error
    }
  },

  /**
   * Get SRT gateways by listen IP address
   * @param {string} listenIp - Listen IP address
   * @returns {Promise<Object>} List of SRT gateways
   */
  async getAllSRTGatewaysByListenIP(listenIp) {
    try {
      const result = await apiGet(`/functions/gateways/srt/getAllByListenIPAddress/${listenIp}`, true)
      return result
    } catch (error) {
      console.error(`❌ Error getting SRT gateways by listen IP ${listenIp}:`, error)
      throw error
    }
  },

  /**
   * Get SRT gateways by input multicast address
   * @param {string} inputMulticast - Input multicast address
   * @returns {Promise<Object>} List of SRT gateways
   */
  async getAllSRTGatewaysByInputMCAddress(inputMulticast) {
    try {
      const result = await apiGet(`/functions/gateways/srt/getAllByInputMCAddress/${inputMulticast}`, true)
      return result
    } catch (error) {
      console.error(`❌ Error getting SRT gateways by input MC address ${inputMulticast}:`, error)
      throw error
    }
  },

  /**
   * Get SRT gateways by foreign IP address
   * @param {string} foreignIp - Foreign IP address
   * @returns {Promise<Object>} List of SRT gateways
   */
  async getAllSRTGatewaysByForeignIP(foreignIp) {
    try {
      const result = await apiGet(`/functions/gateways/srt/getAllByForeignIPAddress/${foreignIp}`, true)
      return result
    } catch (error) {
      console.error(`❌ Error getting SRT gateways by foreign IP ${foreignIp}:`, error)
      throw error
    }
  }
}

// Application service
const applicationService = {
  async getAllProperties() {
    const response = await apiGet('/utils/application/getAllProperties', true)
    return response
  }
}

// User profile service
const userProfileService = {
  async getUserByID(userID) {
    const response = await apiGet(`/utils/users/getByUserID/${userID}`, true)
    return response
  },
  
  async updateUserProfile(userID, userData) {
    const response = await apiPut(`/utils/users/updateByUserID/${userID}`, userData, true)
    return response
  }
}

// Export all services
export {
  userService,
  roleService,
  userRoleService,
  analyzeService,
  srtGatewayService,
  applicationService,
  userProfileService
}
