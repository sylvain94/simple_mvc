/**
 * Index des Controllers - Point d'entrée centralisé
 * 
 * Permet d'importer tous les contrôleurs depuis un seul endroit :
 * import { UserController, ProjectController } from '@/controllers'
 */

export { UserController } from './UserController.js'
export { ProjectController } from './ProjectController.js'

// Réexportation par défaut
export { default as UserCtrl } from './UserController.js'
export { default as ProjectCtrl } from './ProjectController.js'
