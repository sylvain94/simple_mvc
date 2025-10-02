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
    } else {
      console.warn('⚠️ useAuth=true but no session found')
    }
  }

  
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`POST ${endpoint} failed: ${res.status}`)
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
      return await apiGet(`/utils/users/getByUserID/${userid}`, true)
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
      return await apiPost('/utils/users/create', userData, true)
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
      return await apiDelete(`/utils/users/deleteByID/${userId}`, true)
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
      return await apiGet(`/rel/users/roles/getRolesForUserID/${userId}`, true)
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
