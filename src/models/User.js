/**
 * Model User - Represents the structure and data of a user
 * 
 * The Models in MVC are responsible for :
 * - Define the structure of the data
 * - Validate the data
 * - Transform/normalize the data
 * - Define the business rules on the data
 */

export class User {
  constructor(data = {}) {
    this.id = data.id || null
    this.usertype = data.usertype || 'UserEntity'
    this.userid = data.userid || ''
    this.firstName = data.firstName || data.first_name || null
    this.lastName = data.lastName || data.last_name || null
    this.email = data.email || null
    this.phone = data.phone || null
    this.enabled = Boolean(data.enabled)
    this.active = Boolean(data.active)
    this.admin = Boolean(data.admin)
    this.mustChangePassword = Boolean(data.mustChangePassword || data.must_change_password)
    this.createdAt = data.createdAt ? new Date(data.createdAt) : null
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null
  }

  // Getters for computed properties
  get fullName() {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`
    }
    return this.userid || 'Unknown user'
  }

  get initials() {
    if (this.firstName && this.lastName) {
      return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase()
    }
    return this.userid.substring(0, 2).toUpperCase()
  }

  get isValidUser() {
    return this.enabled && this.active
  }

  get displayName() {
    return this.fullName !== this.userid ? this.fullName : this.userid
  }

  // Validation methods
  validate() {
    const errors = []

    if (!this.userid || this.userid.trim() === '') {
      errors.push('The user id is required')
    }

    if (this.email && !this.isValidEmail(this.email)) {
      errors.push('The email is not valid')
    }

    if (this.phone && !this.isValidPhone(this.phone)) {
      errors.push('The phone number is not valid')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Private utility methods
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  isValidPhone(phone) {
    // Simple regex for French phone numbers
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/
    return phoneRegex.test(phone)
  }

  // Transformation methods
  toJSON() {
    return {
      id: this.id,
      usertype: this.usertype,
      userid: this.userid,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      enabled: this.enabled,
      active: this.active,
      admin: this.admin,
      mustChangePassword: this.mustChangePassword,
      createdAt: this.createdAt?.toISOString(),
      updatedAt: this.updatedAt?.toISOString()
    }
  }

  // Method to create a user from API data
  static fromApiResponse(apiData) {
    return new User({
      id: apiData.id,
      usertype: apiData.usertype,
      userid: apiData.userid,
      firstName: apiData.firstName,
      lastName: apiData.lastName,
      email: apiData.email,
      phone: apiData.phone,
      enabled: apiData.enabled,
      active: apiData.active,
      admin: apiData.admin,
      mustChangePassword: apiData.mustChangePassword
    })
  }

  // Method to clone the user
  clone() {
    return new User(this.toJSON())
  }

  // Method to update the data
  update(newData) {
    Object.keys(newData).forEach(key => {
      if (this.hasOwnProperty(key)) {
        this[key] = newData[key]
      }
    })
    this.updatedAt = new Date()
    return this
  }
}

// Model for permissions/roles
export class UserRole {
  constructor(data = {}) {
    this.id = data.id || null
    this.name = data.name || ''
    this.description = data.description || ''
    this.permissions = data.permissions || []
  }

  hasPermission(permission) {
    return this.permissions.includes(permission)
  }

  static ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    MODERATOR: 'moderator'
  }
}

export default User
