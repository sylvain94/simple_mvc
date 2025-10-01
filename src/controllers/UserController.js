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
import { userService } from '../services/api.js'

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

      console.log(`🔍 Getting user by User ID: ${userid}`)
      
      // API service call
      const apiResponse = await userService.getUserByUserid(userid)
      
      // Transformation into User model
      const user = User.fromApiResponse(apiResponse)
      
      // Validation of received data
      const validation = user.validate()
      if (!validation.isValid) {
        console.warn('⚠️ User data is invalid:', validation.errors)
      }

      console.log(`✅ User retrieved: ${user.displayname}`)
      return user
      
    } catch (error) {
      console.error('❌ Error retrieving user:', error)
      throw new Error(`Impossible to retrieve the user: ${error.message}`)
    }
  }

  /**
   * Retrieves all users
   * @returns {Promise<User[]>} - List of users
   */
  static async getAllUsers() {
    try {
      console.log('📋 Getting all users')
      
      const apiResponse = await userService.getAllUsers()
      
      // Transformation into User models
      const users = apiResponse.map(userData => User.fromApiResponse(userData))
      
      // Filtering and sorting
      const validUsers = users.filter(user => {
        const validation = user.validate()
        if (!validation.isValid) {
          console.warn(`⚠️ Invalid user ignored: ${user.displayname}`, validation.errors)
          return false
        }
        return true
      })

      // Sorting by display name
      validUsers.sort((a, b) => a.displayname.localeCompare(b.displayname))

      console.log(`✅ ${validUsers.length} users retrieved`)
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
      console.log('➕ Creation of a new user')
      
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

      // API service call (to be implemented according to your backend)
      // const apiResponse = await userService.createUser(user.toJSON())
      // const createdUser = User.fromApiResponse(apiResponse)

      console.log(`✅ User created: ${user.displayname}`)
      return user
      
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
      console.log(`📝 Update of the user: ${userid}`)
      
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

      console.log(`✅ User updated: ${updatedUser.displayname}`)
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
      console.log(`🗑️ Deletion of the user: ${userid}`)
      
      // Business logic checks
      const user = await this.getUserByUserid(userid)
      
      if (user.admin) {
        throw new Error('Impossible to delete an administrator')
      }

      // API service call (to be implemented)
      // await userService.deleteUser(userid)

      console.log(`✅ User deleted: ${userid}`)
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
      console.log('📊 Generation of user statistics')
      
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

      console.log('✅ User statistics generated:', stats)
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
      console.log('🔍 Search for users with criteria:', criteria)
      
      const allUsers = await this.getAllUsers()
      
      let filteredUsers = allUsers
      
      // Filtering by search term
      if (criteria.searchTerm) {
        const term = criteria.searchTerm.toLowerCase()
        filteredUsers = filteredUsers.filter(user => 
          user.userid.toLowerCase().includes(term) ||
          user.displayname.toLowerCase().includes(term) ||
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

      console.log(`✅ ${filteredUsers.length} users found`)
      return filteredUsers
      
    } catch (error) {
      console.error('❌ Error searching for users:', error)
      throw new Error(`Impossible to search for users: ${error.message}`)
    }
  }
}

export default UserController
