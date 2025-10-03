/**
 * Controller User - Manages the business logic related to users
 * 
 * The Controllers in MVC are responsible for:
 * - Orchestrate the interactions between Models and Views
 * - Manage complex business logic
 * - Validate data before sending to services
 * - Transform data for display
 * - Manage errors and use cases
 */

import { User } from '../models/User.js'
import { userService, userRoleService } from '../services/api.js'

export class UserController {
  
  /**
   * Retrieves a user by their user ID
   * @param {string} userid - User ID
   * @returns {Promise<User>} - Instance User or null
   */
  static async getUserByUserid(userid) {
    try {
      if (!userid || userid.trim() === '') {
        throw new Error('User ID is required')
      }

      // API service call
      const apiResponse = await userService.getUserByUserid(userid)
      
      // Transformation into User model
      const user = User.fromApiResponse(apiResponse)
      
      // Validation of received data
      const validation = user.validate()
      if (!validation.isValid) {
        console.warn('⚠️ User data is invalid:', validation.errors)
      }

      return user
      
    } catch (error) {
      console.error('❌ Error retrieving user:', error)
      throw new Error(`Impossible to retrieve the user: ${error.message}`)
    }
  }

  /**
   * Retrieves all users with their roles
   * @returns {Promise<User[]>} - List of users with roles
   */
  static async getAllUsers() {
    try {
      
      const apiResponse = await userService.getAllUsers()
      
      // Transformation into User models
      const users = apiResponse.map(userData => User.fromApiResponse(userData))
      
      // Enrich users with their roles
      const usersWithRoles = await Promise.all(
        users.map(async (user) => {
          try {
            console.log(`🎭 Fetching roles for user: "${user.userid}" (ID: ${user.id})`)
            const userRoles = await userRoleService.getRolesForUserID(user.id) // Use UUID instead of userid
            console.log(`✅ Retrieved ${Array.isArray(userRoles) ? userRoles.length : 0} roles for user "${user.userid}":`, userRoles)
            user.roles = Array.isArray(userRoles) ? userRoles : []
            return user
          } catch (error) {
            console.warn(`⚠️ Could not fetch roles for user ${user.userid} (ID: ${user.id}):`, error)
            user.roles = []
            return user
          }
        })
      )
      
      // Filtering and sorting
      const validUsers = usersWithRoles.filter(user => {
        const validation = user.validate()
        if (!validation.isValid) {
          console.warn(`⚠️ Invalid user ignored: ${user.displayName}`, validation.errors)
          return false
        }
        return true
      })

      // Sorting by display name (with null safety)
      validUsers.sort((a, b) => {
        const nameA = a.displayName || a.userid || ''
        const nameB = b.displayName || b.userid || ''
        return nameA.localeCompare(nameB)
      })

      return validUsers
      
    } catch (error) {
      console.error('❌ Error retrieving users:', error)
      throw new Error(`Impossible to retrieve the users: ${error.message}`)
    }
  }

  /**
   * Creates a new user
   * @param {Object} userData - User data
   * @returns {Promise<User>} - Created user
   */
  static async createUser(userData) {
    try {
      // Creation of the User model for validation
      const user = new User(userData)
      
      // Validation of data
      const validation = user.validate()
      if (!validation.isValid) {
        throw new Error(`Invalid data: ${validation.errors.join(', ')}`)
      }

      // Business logic specific rules
      if (await this.isUseridTaken(user.userid)) {
        throw new Error('This user ID is already taken')
      }

      // API service call
      const apiResponse = await userService.createUser(user.toJSON())
      const createdUser = User.fromApiResponse(apiResponse)

      return createdUser
      
    } catch (error) {
      console.error('❌ Error creating user:', error)
      throw new Error(`Impossible to create the user: ${error.message}`)
    }
  }

  /**
   * Updates a user
   * @param {string} userid - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<User>} - Updated user
   */
  static async updateUser(userid, updateData) {
    try {
      // Retrieving the existing user
      const existingUser = await this.getUserByUserid(userid)
      
      // Updating the data
      const updatedUser = existingUser.update(updateData)
      
      // Validation
      const validation = updatedUser.validate()
      if (!validation.isValid) {
        throw new Error(`Invalid data: ${validation.errors.join(', ')}`)
      }

      // API service call (to be implemented)
      // const apiResponse = await userService.updateUser(userid, updatedUser.toJSON())
      // const finalUser = User.fromApiResponse(apiResponse)

      return updatedUser
      
    } catch (error) {
      console.error('❌ Error updating user:', error)
      throw new Error(`Impossible to update the user: ${error.message}`)
    }
  }

  /**
   * Deletes a user
   * @param {string} userid - User ID
   * @returns {Promise<boolean>} - Success of the deletion
   */
  static async deleteUser(userid) {
    try {
      // Business logic checks - get user details first
      const user = await this.getUserByUserid(userid)
      
      // Check if user has admin role (prevent deletion of administrators)
      if (user.isAdmin) {
        console.warn(`🛡️ Attempted to delete administrator: ${user.userid}`)
        throw new Error('Impossible to delete an administrator')
      }
      
      // API service call - use user.id (UUID) instead of userid (username)
      await userService.deleteUserById(user.id)

      return true
      
    } catch (error) {
      console.error('❌ Error deleting user:', error)
      throw new Error(`Impossible to delete the user: ${error.message}`)
    }
  }

  /**
   * Generates statistics on users
   * @returns {Promise<Object>} - Statistics
   */
  static async getUserStats() {
    try {
      const users = await this.getAllUsers()
      
      const stats = {
        total: users.length,
        active: users.filter(u => u.active).length,
        inactive: users.filter(u => !u.active).length,
        enabled: users.filter(u => u.enabled).length,
        disabled: users.filter(u => !u.enabled).length,
        admins: users.filter(u => u.admin).length,
        mustChangePassword: users.filter(u => u.mustChangePassword).length
      }

      return stats
      
    } catch (error) {
      console.error('❌ Error generating user statistics:', error)
      throw new Error(`Impossible to generate the user statistics: ${error.message}`)
    }
  }

  /**
   * Checks if a user ID is already taken
   * @param {string} userid - User ID to check
   * @returns {Promise<boolean>} - True if taken
   */
  static async isUseridTaken(userid) {
    try {
      await this.getUserByUserid(userid)
      return true // If the user is found, the ID is taken
    } catch (error) {
      return false // If error, the ID is not taken
    }
  }

  /**
   * Search for users by criteria
   * @param {Object} criteria - Search criteria
   * @returns {Promise<User[]>} - Found users
   */
  static async searchUsers(criteria) {
    try {
      const allUsers = await this.getAllUsers()
      
      let filteredUsers = allUsers
      
      // Filtering by search term
      if (criteria.searchTerm) {
        const term = criteria.searchTerm.toLowerCase()
        filteredUsers = filteredUsers.filter(user => 
          user.userid.toLowerCase().includes(term) ||
          user.displayName.toLowerCase().includes(term) ||
          (user.email && user.email.toLowerCase().includes(term))
        )
      }

      // Filtering by status
      if (criteria.status) {
        switch (criteria.status) {
          case 'active':
            filteredUsers = filteredUsers.filter(u => u.active)
            break
          case 'inactive':
            filteredUsers = filteredUsers.filter(u => !u.active)
            break
          case 'admin':
            filteredUsers = filteredUsers.filter(u => u.admin)
            break
        }
      }

      return filteredUsers
      
    } catch (error) {
      console.error('❌ Error searching for users:', error)
      throw new Error(`Impossible to search for users: ${error.message}`)
    }
  }

  /**
   * Toggles user status (enabled/disabled)
   * @param {string} userid - User ID
   * @param {boolean} enabled - New enabled status
   * @returns {Promise<User>} - Updated user
   */
  static async toggleUserStatus(userid, enabled) {
    try {
      if (enabled) {
        await userService.enableUserByID(userid)
      } else {
        await userService.disableUserByID(userid)
      }

      return true
      
    } catch (error) {
      console.error('❌ Error toggling user status:', error)
      throw new Error(`Impossible to ${enabled ? 'enable' : 'disable'} the user: ${error.message}`)
    }
  }

  /**
   * Resets user password
   * @param {string} userid - User ID
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} - Success of the operation
   */
  static async resetPassword(userid, newPassword) {
    try {
      // Validation of the password
      if (!newPassword || newPassword.length < 6) {
        throw new Error('The password must contain at least 6 characters')
      }

      await userService.resetPasswordByUserID(userid, newPassword)

      return true
      
    } catch (error) {
      console.error('❌ Error resetting password:', error)
      throw new Error(`Impossible to reset the password: ${error.message}`)
    }
  }
}

export default UserController
