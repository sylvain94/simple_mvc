/**
 * Controller Index - Centralized Entry Point
 * 
 * Allows to import all controllers from a single place:
 * import { UserController, ProjectController } from '@/controllers'
 */

export { UserController } from './UserController.js'
export { ProjectController } from './ProjectController.js'
export { default as DashboardController } from './DashboardController.js'
export { InputFileController } from './InputFileController.js'
export { AnalyzeController } from './AnalyzeController.js'
export { SRTGatewayController } from './SRTGatewayController.js'
export { default as ApplicationController } from './ApplicationController.js'
export { UserProfileController } from './UserProfileController.js'

// Default reexport
export { default as UserCtrll } from './UserController.js'
export { default as ProjectCtrl } from './ProjectController.js'
export { default as DashboardCtrl } from './DashboardController.js'
export { default as InputFileCtrl } from './InputFileController.js'
export { default as AnalyzeCtrl } from './AnalyzeController.js'
export { default as SRTGatewayCtrl } from './SRTGatewayController.js'
export { default as ApplicationCtrl } from './ApplicationController.js'
export { default as UserProfileCtrl } from './UserProfileController.js'
