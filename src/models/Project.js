/**
 * Model Project - Représente un projet dans le système
 * 
 * Exemple d'un autre modèle pour illustrer la réutilisabilité
 */

export class Project {
  constructor(data = {}) {
    this.id = data.id || null
    this.name = data.name || ''
    this.description = data.description || ''
    this.status = data.status || Project.STATUS.PLANNING
    this.progress = data.progress || 0
    this.team = data.team || ''
    this.startDate = data.startDate ? new Date(data.startDate) : null
    this.endDate = data.endDate ? new Date(data.endDate) : null
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date()
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date()
  }

  // Constantes pour les statuts
  static STATUS = {
    PLANNING: 'Planning',
    IN_PROGRESS: 'En cours',
    REVIEW: 'Review',
    COMPLETED: 'Terminé',
    CANCELLED: 'Annulé'
  }

  // Getters calculés
  get isActive() {
    return this.status === Project.STATUS.IN_PROGRESS
  }

  get isCompleted() {
    return this.status === Project.STATUS.COMPLETED
  }

  get progressPercentage() {
    return Math.min(100, Math.max(0, this.progress))
  }

  get statusBadgeClass() {
    const statusClasses = {
      [Project.STATUS.PLANNING]: 'badge-secondary',
      [Project.STATUS.IN_PROGRESS]: 'badge-primary',
      [Project.STATUS.REVIEW]: 'badge-warning',
      [Project.STATUS.COMPLETED]: 'badge-success',
      [Project.STATUS.CANCELLED]: 'badge-error'
    }
    return statusClasses[this.status] || 'badge-ghost'
  }

  // Validation
  validate() {
    const errors = []

    if (!this.name || this.name.trim() === '') {
      errors.push('Le nom du projet est requis')
    }

    if (this.progress < 0 || this.progress > 100) {
      errors.push('Le progrès doit être entre 0 et 100')
    }

    if (!Object.values(Project.STATUS).includes(this.status)) {
      errors.push('Statut invalide')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Méthodes de transformation
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      status: this.status,
      progress: this.progress,
      team: this.team,
      startDate: this.startDate?.toISOString(),
      endDate: this.endDate?.toISOString(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    }
  }

  static fromApiResponse(apiData) {
    return new Project(apiData)
  }
}

export default Project
