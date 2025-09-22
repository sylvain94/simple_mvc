/**
 * Index des Models - Point d'entrée centralisé
 * 
 * Permet d'importer tous les modèles depuis un seul endroit :
 * import { User, Project } from '@/models'
 */

export { User, UserRole } from './User.js'
export { Project } from './Project.js'

// Réexportation par défaut pour faciliter les imports
export { default as UserModel } from './User.js'
export { default as ProjectModel } from './Project.js'
