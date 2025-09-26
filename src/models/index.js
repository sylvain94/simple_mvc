/**
 * Index des Models - input entry centralized
 * 
 * Allows you to import all models from one place:
 * import { User, Project } from '@/models'
 */

export { User, UserRole } from './User.js'
export { Project } from './Project.js'
export { default as Gateway } from './Gateway.js'

// Default reexport to facilitate imports
export { default as UserModel } from './User.js'
export { default as ProjectModel } from './Project.js'
export { default as GatewayModel } from './Gateway.js'
