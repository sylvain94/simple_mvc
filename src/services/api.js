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
      console.log('🔐 Using auth token for POST request')
    } else {
      console.warn('⚠️ useAuth=true but no session found')
    }
  }

  const url = `${API_BASE}${endpoint}`
  console.log('📤 POST Request:', {
    url,
    headers,
    body: JSON.stringify(body, null, 2)
  })
  
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  
  console.log('📥 POST Response:', {
    status: res.status,
    statusText: res.statusText,
    url: res.url
  })
  
  if (!res.ok) {
    const errorText = await res.text()
    console.error('❌ POST Error details:', errorText)
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

// Service for users
export const userService = {
  /**
   * Retrieves all users
   */
  async getAllUsers() {
    try {
      return await apiGet('/utils/users/getAll', true)
    } catch (error) {
      console.error('❌ Error getting all users:', error)
      throw error
    }
  },

  /**
   * Retrieves a user by their UserID
   */
  async getUserByUserid(userid) {
    try {
      console.log(`🔍 API: Getting user by userid: "${userid}"`)
      const result = await apiGet(`/utils/users/getByUserID/${userid}`, true)
      console.log(`✅ API: Retrieved user:`, {
        id: result.id,
        userid: result.userid,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email
      })
      return result
    } catch (error) {
      console.error(`❌ Error getting user by userid ${userid}:`, error)
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
      console.error(`❌ Error getting user by name ${firstName} ${lastName}:`, error)
      throw error
    }
  },

  /**
   * Creates a new user
   */
  async createUser(userData) {
    try {
      console.log('📤 Sending user creation request with data:', JSON.stringify(userData, null, 2))
      const result = await apiPost('/utils/users/create', userData, true)
      console.log('✅ User creation API response:', result)
      return result
    } catch (error) {
      console.error('❌ Error creating user:', error)
      throw error
    }
  },

  /**
   * Deletes a user by their ID
   */
  async deleteUserById(userId) {
    try {
      console.log(`🗑️ API: Deleting user by ID: "${userId}"`)
      const result = await apiDelete(`/utils/users/deleteByID/${userId}`, true)
      console.log(`✅ API: User deleted successfully: ${userId}`)
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
export const roleService = {
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
export const userRoleService = {
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
      console.log(`🎭 API: Getting roles for user ID: "${userId}"`)
      const result = await apiGet(`/rel/users/roles/getRolesForUserID/${userId}`, true)
      console.log(`✅ API: Retrieved roles for user ${userId}:`, result)
      return result
    } catch (error) {
      console.error(`❌ Error getting roles for user ${userId}:`, error)
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
export const analyzeService = {
  /**
   * Start analysis for an input file
   * @param {string} inputFileId - The ID of the input file to analyze
   * @returns {Promise<Object>} Analysis result
   */
  async startAnalysis(inputFileId) {
    try {
      console.log(`🔍 Starting analysis for input file: ${inputFileId}`)
      
      const result = await apiPut(`/functions/input_files/analyzeByID/${inputFileId}`, null, true)
      
      console.log('✅ Analysis started successfully:', result)
      return result
    } catch (error) {
      console.error(`❌ Error starting analysis for file ${inputFileId}:`, error)
      throw error
    }
  },

  /**
   * Get analysis results for an input file
   * @param {string} inputFileId - The ID of the input file
   * @returns {Promise<Object>} Analysis results
   */
  async getAnalysisResults(inputFileId) {
    try {
      console.log(`📊 Getting analysis results for input file: ${inputFileId}`)
      
      const result = await apiGet(`/functions/input_files/analysis/${inputFileId}`, true)
      
      console.log('✅ Analysis results retrieved:', result)
      return result
    } catch (error) {
      console.error(`❌ Error getting analysis results for file ${inputFileId}:`, error)
      throw error
    }
  },

  /**
   * Get analysis status for an input file
   * @param {string} inputFileId - The ID of the input file
   * @returns {Promise<Object>} Analysis status
   */
  async getAnalysisStatus(inputFileId) {
    try {
      console.log(`⏳ Getting analysis status for input file: ${inputFileId}`)
      
      const result = await apiGet(`/functions/input_files/analysis/status/${inputFileId}`, true)
      
      console.log('✅ Analysis status retrieved:', result)
      return result
    } catch (error) {
      console.error(`❌ Error getting analysis status for file ${inputFileId}:`, error)
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
      console.log(`🛑 Cancelling analysis for input file: ${inputFileId}`)
      
      const result = await apiDelete(`/functions/input_files/analysis/${inputFileId}`, true)
      
      console.log('✅ Analysis cancelled successfully:', result)
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
      console.log('📋 Getting all analysis history')
      
      const result = await apiGet('/functions/input_files/analysis/history', true)
      
      console.log('✅ Analysis history retrieved:', result)
      return result
    } catch (error) {
      console.error('❌ Error getting analysis history:', error)
      throw error
    }
  }
}
