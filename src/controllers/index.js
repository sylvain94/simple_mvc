/**
 * Controller Index - Centralized Entry Point
 * 
 * Allows to import all controllers from a single place:
 * import { UserController, ProjectController } from '@/controllers'
 */

export { UserController } from './UserController.js'
export { ProjectController } from './ProjectController.js'
export { default as DashboardController } from './DashboardController.js'

// Default reexport
export { default as UserCtrl } from './UserController.js'
export { default as ProjectCtrl } from './ProjectController.js'
export { default as DashboardCtrl } from './DashboardController.js'
