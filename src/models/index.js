/**
 * Index des Models - input entry centralisé
 * 
 * Allows you to import all models from one place:
 * import { User, Project } from '@/models'
 */

export { User, UserRole } from './User.js'
export { Project } from './Project.js'

// Réexportation par défaut pour faciliter les imports imports
export { default as UserModel } from './User.js'
export { default as ProjectModel } from './Project.js'
