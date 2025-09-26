/**
 * Controller Project - Manages business logic related to projects
 */

import { Project } from '../models/Project.js'

export class ProjectController {
  
  /**
   * Fetch recent projects for the dashboard
   * @returns {Promise<Project[]>} - Recent projects
   */
  static async getRecentProjects() {
    try {
      console.log('📋 Fetching recent projects')
      
      // Données d'exemple (à remplacer par un vrai service API)
      const mockData = [
        {
          id: 1,
          name: 'Site E-commerce',
          description: 'Boutique en ligne moderne',
          status: 'In progress',
          progress: 75,
          team: 'Frontend',
          startDate: '2025-01-15'
        },
        {
          id: 2,
          name: 'API REST',
          description: 'Service backend scalable',
          status: 'Review',
          progress: 90,
          team: 'Backend',
          startDate: '2025-01-10'
        },
        {
          id: 3,
          name: 'App Mobile',
          description: 'Application iOS/Android',
          status: 'Planning',
          progress: 15,
          team: 'Mobile',
          startDate: '2025-02-01'
        }
      ]

      // Transformation in models Project
      const projects = mockData.map(data => Project.fromApiResponse(data))
      
      // Validation and filtering
      const validProjects = projects.filter(project => {
        const validation = project.validate()
        if (!validation.isValid) {
          console.warn(`⚠️ Invalid project ignored: ${project.name}`, validation.errors)
          return false
        }
        return true
      })

      // Sort by creation date (most recent first)
      validProjects.sort((a, b) => b.createdAt - a.createdAt)

      console.log(`✅ ${validProjects.length} recent projects fetched`)
      return validProjects
      
    } catch (error) {
      console.error('❌ Error fetching recent projects:', error)
      throw new Error(`Impossible de récupérer les projets: ${error.message}`)
    }
  }

  /**
   * Generate statistics on projects
   * @returns {Promise<Object>} - Statistiques des projets
   */
  static async getProjectStats() {
    try {
      console.log('📊 Generating project statistics')
      
      // Données d'exemple
      const stats = {
        total: 25,
        inProgress: 8,
        completed: 12,
        planning: 3,
        review: 2,
        avgProgress: 67
      }

      console.log('✅ Project statistics generated:', stats)
      return stats
      
    } catch (error) {
      console.error('❌ Error generating project statistics:', error)
      throw new Error(`Impossible to generate project statistics: ${error.message}`)
    }
  }

  /**
   * Create a new project
   * @param {Object} projectData - Données du projet
   * @returns {Promise<Project>} - Projet créé
   */
  static async createProject(projectData) {
    try {
      console.log('➕ Creation of a new project')
      
      // Création du modèle pour validation
      const project = new Project(projectData)
      
      // Validation
      const validation = project.validate()
      if (!validation.isValid) {
        throw new Error(`Invalid data: ${validation.errors.join(', ')}`)
      }

      // Règles métier
      if (project.progress > 0 && project.status === Project.STATUS.PLANNING) {
        project.status = Project.STATUS.IN_PROGRESS
      }

      console.log(`✅ Project created: ${project.name}`)
      return project
      
    } catch (error) {
      console.error('❌ Error creating project:', error)
      throw new Error(`Impossible to create project: ${error.message}`)
    }
  }
}

export default ProjectController
