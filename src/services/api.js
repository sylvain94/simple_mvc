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
      console.log('🔐 Adding Authorization header for POST request')
    } else {
      console.warn('⚠️ useAuth=true but no session found')
    }
  }

  console.log('📡 POST request headers:', headers)
  
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
   * Récupère tous les utilisateurs
   */
  async getAllUsers() {
    try {
      console.log('👥 Fetching all users')
      return await apiGet('/utils/users/getAll', true)
    } catch (error) {
      console.error('❌ Error getting all users:', error)
      throw error
    }
  },

  /**
   * Récupère un utilisateur par son UserID
   */
  async getUserByUserid(userid) {
    try {
      console.log(`👤 Fetching user by ID: ${userid}`)
      return await apiGet(`/utils/users/getByUserID/${userid}`, true)
    } catch (error) {
      console.error(`❌ Error getting user by userid ${userid}:`, error)
      throw error
    }
  },

  /**
   * Récupère un utilisateur par son nom et prénom
   */
  async getUserByName(firstName, lastName) {
    try {
      console.log(`👤 Fetching user by name: ${firstName} ${lastName}`)
      return await apiGet(`/utils/users/getByName/firstname/${firstName}/lastname/${lastName}`, true)
    } catch (error) {
      console.error(`❌ Error getting user by name ${firstName} ${lastName}:`, error)
      throw error
    }
  },

  /**
   * Crée un nouvel utilisateur
   */
  async createUser(userData) {
    try {
      console.log('👥 Creating new user:', userData)
      return await apiPost('/utils/users/create', userData, true)
    } catch (error) {
      console.error('❌ Error creating user:', error)
      throw error
    }
  },

  /**
   * Supprime un utilisateur par son ID
   */
  async deleteUserById(userId) {
    try {
      console.log(`🗑️ Deleting user by ID: ${userId}`)
      return await apiDelete(`/utils/users/deleteByID/${userId}`, true)
    } catch (error) {
      console.error(`❌ Error deleting user ${userId}:`, error)
      throw error
    }
  },

  /**
   * Réinitialise le mot de passe d'un utilisateur
   */
  async resetPasswordByUserID(userId, newPassword) {
    try {
      console.log(`🔑 Resetting password for user: ${userId}`)
      return await apiPut(`/utils/users/resetPasswordByUserID/${userId}/passwd/${newPassword}`, null, true)
    } catch (error) {
      console.error(`❌ Error resetting password for user ${userId}:`, error)
      throw error
    }
  },

  /**
   * Active un utilisateur
   */
  async enableUserByID(userId) {
    try {
      console.log(`✅ Enabling user: ${userId}`)
      return await apiPut(`/utils/users/enableByUserID/${userId}`, null, true)
    } catch (error) {
      console.error(`❌ Error enabling user ${userId}:`, error)
      throw error
    }
  },

  /**
   * Désactive un utilisateur
   */
  async disableUserByID(userId) {
    try {
      console.log(`❌ Disabling user: ${userId}`)
      return await apiPut(`/utils/users/disableByUserID/${userId}`, null, true)
    } catch (error) {
      console.error(`❌ Error disabling user ${userId}:`, error)
      throw error
    }
  },

  /**
   * Active un utilisateur (statut actif)
   */
  async activateUserByID(userId) {
    try {
      console.log(`🟢 Activating user: ${userId}`)
      return await apiPut(`/utils/users/activateByUserID/${userId}`, null, true)
    } catch (error) {
      console.error(`❌ Error activating user ${userId}:`, error)
      throw error
    }
  },

  /**
   * Désactive un utilisateur (statut actif)
   */
  async deactivateUserByID(userId) {
    try {
      console.log(`🔴 Deactivating user: ${userId}`)
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
   * Récupère tous les rôles
   */
  async getAllRoles() {
    try {
      console.log('🎭 Fetching all roles')
      return await apiGet('/utils/roles/getAll', true)
    } catch (error) {
      console.error('❌ Error getting all roles:', error)
      throw error
    }
  },

  /**
   * Crée un nouveau rôle
   */
  async createRole(roleData) {
    try {
      console.log('🎭 Creating new role:', roleData)
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
   * Récupère toutes les relations utilisateur-rôle
   */
  async getAllUserRoles() {
    try {
      console.log('🔗 Fetching all user-role relationships')
      return await apiGet('/rel/users/roles/getAll', true)
    } catch (error) {
      console.error('❌ Error getting all user-role relationships:', error)
      throw error
    }
  },

  /**
   * Récupère les rôles d'un utilisateur
   */
  async getRolesForUserID(userId) {
    try {
      console.log(`🔗 Fetching roles for user: ${userId}`)
      return await apiGet(`/rel/users/roles/getRolesForUserID/${userId}`, true)
    } catch (error) {
      console.error(`❌ Error getting roles for user ${userId}:`, error)
      throw error
    }
  },

  /**
   * Récupère toutes les relations par utilisateur
   */
  async getAllByUserID(userId) {
    try {
      console.log(`🔗 Fetching all relationships for user: ${userId}`)
      return await apiGet(`/rel/users/roles/getAllByUserID/${userId}`, true)
    } catch (error) {
      console.error(`❌ Error getting relationships for user ${userId}:`, error)
      throw error
    }
  },

  /**
   * Récupère toutes les relations par rôle
   */
  async getAllByRoleID(roleId) {
    try {
      console.log(`🔗 Fetching all relationships for role: ${roleId}`)
      return await apiGet(`/rel/users/roles/getAllByRoleID/${roleId}`, true)
    } catch (error) {
      console.error(`❌ Error getting relationships for role ${roleId}:`, error)
      throw error
    }
  },

  /**
   * Crée une relation utilisateur-rôle
   */
  async createUserRoleRelation(userId, roleId) {
    try {
      console.log(`🔗 Creating user-role relationship: ${userId} -> ${roleId}`)
      return await apiPost(`/rel/users/roles/createByUserIDAndRoleID/user_id/${userId}/role_id/${roleId}`, null, true)
    } catch (error) {
      console.error(`❌ Error creating user-role relationship ${userId} -> ${roleId}:`, error)
      throw error
    }
  },

  /**
   * Supprime une relation utilisateur-rôle
   */
  async deleteUserRoleRelation(relationId) {
    try {
      console.log(`🗑️ Deleting user-role relationship: ${relationId}`)
      return await apiDelete(`/rel/users/roles/deleteByID/${relationId}`, true)
    } catch (error) {
      console.error(`❌ Error deleting user-role relationship ${relationId}:`, error)
      throw error
    }
  }
}
