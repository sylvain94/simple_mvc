/**
 * Model User - Représente la structure et les données d'un utilisateur
 * 
 * Les Models dans MVC sont responsables de :
 * - Définir la structure des données
 * - Valider les données
 * - Transformer/normaliser les données
 * - Définir les règles métier sur les données
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

  // Getters pour des propriétés calculées
  get fullName() {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`
    }
    return this.userid || 'Utilisateur inconnu'
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

  // Méthodes de validation
  validate() {
    const errors = []

    if (!this.userid || this.userid.trim() === '') {
      errors.push('Le nom d\'utilisateur est requis')
    }

    if (this.email && !this.isValidEmail(this.email)) {
      errors.push('L\'email n\'est pas valide')
    }

    if (this.phone && !this.isValidPhone(this.phone)) {
      errors.push('Le numéro de téléphone n\'est pas valide')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Méthodes utilitaires privées
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  isValidPhone(phone) {
    // Regex simple pour numéros français
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/
    return phoneRegex.test(phone)
  }

  // Méthodes de transformation
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

  // Méthode pour créer un utilisateur à partir des données API
  static fromApiResponse(apiData) {
    return new User({
      id: apiData.id,
      usertype: apiData.usertype,
      userid: apiData.userid,
      first_name: apiData.firstName,
      last_name: apiData.lastName,
      email: apiData.email,
      phone: apiData.phone,
      enabled: apiData.enabled,
      active: apiData.active,
      admin: apiData.admin,
      must_change_password: apiData.mustChangePassword
    })
  }

  // Méthode pour cloner l'utilisateur
  clone() {
    return new User(this.toJSON())
  }

  // Méthode pour mettre à jour les données
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

// Modèle pour les permissions/rôles
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
