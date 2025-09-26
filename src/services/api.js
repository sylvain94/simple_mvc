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

export async function apiPost(endpoint, body) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`POST ${endpoint} failed: ${res.status}`)
  return res.json()
}

export async function apiPut(endpoint, body) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`PUT ${endpoint} failed: ${res.status}`)
  return res.text() // For challengeUseridPassword which returns text in case of error
}

export async function apiDelete(endpoint) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`DELETE ${endpoint} failed: ${res.status}`)
  return res.json()
}

// Service for users
export const userService = {
  async getAllUsers() {
    try {
      // Use the appropriate endpoint to get all users
      // Assume there is an endpoint /users which returns all users
      return apiGet('/users', true) // Use authentication
    } catch (error) {
      console.error('Error getting all users:', error)
      throw error
    }
  },

  async getUserByUserid(userid) {
    try {
      return apiGet(`/api/v1/utils/users/getByUserID/${userid}`, true) // Use authentication
    } catch (error) {
      console.error('Error getting user by userid:', error)
      throw error
    }
  }
}
