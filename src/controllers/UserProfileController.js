import { userProfileService } from '../services/api.js'

/**
 * Controller for managing user profiles
 */
export class UserProfileController {
  /**
   * Get user profile by user ID
   * @param {string} userID - User ID to fetch profile for
   * @returns {Promise<Object>} User profile data
   */
  static async getUserProfile(userID) {
    try {
      console.log(`🔍 UserProfileController: Getting profile for user ${userID}`)
      const response = await userProfileService.getUserByID(userID)
      
      // Transform API response to frontend format
      const userProfile = {
        id: response.id,
        userID: response.userid,
        firstName: response.firstName || '',
        lastName: response.lastName || '',
        email: response.email || '',
        phone: response.phone || '',
        language: response.language || '',
        enabled: response.enabled !== false,
        active: response.active !== false,
        mustChangePassword: response.mustChangePassword || false
      }
      
      console.log('✅ UserProfileController: Profile retrieved successfully')
      return userProfile
    } catch (error) {
      console.error('❌ UserProfileController: Error getting user profile:', error)
      throw new Error(`Failed to get user profile: ${error.message}`)
    }
  }

  /**
   * Update user profile
   * @param {string} userID - User ID to update
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Updated user profile
   */
  static async updateUserProfile(userID, profileData) {
    try {
      console.log(`🔄 UserProfileController: Updating profile for user ${userID}`, profileData)
      
      // Transform frontend data to API format
      const apiData = {
        userid: profileData.userID || userID,
        firstName: profileData.firstName || null,
        lastName: profileData.lastName || null,
        email: profileData.email || null,
        phone: profileData.phone || null,
        language: profileData.language || null,
        enabled: profileData.enabled !== false,
        active: profileData.active !== false
      }
      
      const response = await userProfileService.updateUserProfile(userID, apiData)
      
      console.log('✅ UserProfileController: Profile updated successfully')
      return response
    } catch (error) {
      console.error('❌ UserProfileController: Error updating user profile:', error)
      throw new Error(`Failed to update user profile: ${error.message}`)
    }
  }

  /**
   * Validate profile data
   * @param {Object} profileData - Profile data to validate
   * @returns {Object} Validation result with errors array
   */
  static validateProfileData(profileData) {
    const errors = []

    // Required fields validation
    if (!profileData.userID || profileData.userID.trim() === '') {
      errors.push('User ID is required')
    }

    // Email validation
    if (profileData.email && profileData.email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(profileData.email)) {
        errors.push('Please enter a valid email address')
      }
    }

    // Phone validation (if provided)
    if (profileData.phone && profileData.phone.trim() !== '') {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/
      if (!phoneRegex.test(profileData.phone)) {
        errors.push('Please enter a valid phone number')
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

export default UserProfileController
