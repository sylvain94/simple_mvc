/**
 * Model Project - Represents a project in the system
 * 
 * Example of another model to illustrate reusability
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

  // Constants for the statuses
  static STATUS = {
    PLANNING: 'Planning',
    IN_PROGRESS: 'In progress',
    REVIEW: 'Review',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled'
  }

  // Getters computed
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
      errors.push('The project name is required')
    }

    if (this.progress < 0 || this.progress > 100) {
      errors.push('The progress must be between 0 and 100')
    }

    if (!Object.values(Project.STATUS).includes(this.status)) {
      errors.push('Invalid status')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Transformation methods
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
