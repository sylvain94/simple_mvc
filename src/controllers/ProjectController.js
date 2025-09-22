/**
 * Controller Project - Gère la logique métier liée aux projets
 */

import { Project } from '../models/Project.js'

export class ProjectController {
  
  /**
   * Récupère les projets récents pour le dashboard
   * @returns {Promise<Project[]>} - Liste des projets récents
   */
  static async getRecentProjects() {
    try {
      console.log('📋 Récupération des projets récents')
      
      // Données d'exemple (à remplacer par un vrai service API)
      const mockData = [
        {
          id: 1,
          name: 'Site E-commerce',
          description: 'Boutique en ligne moderne',
          status: 'En cours',
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

      // Transformation en modèles Project
      const projects = mockData.map(data => Project.fromApiResponse(data))
      
      // Validation et filtrage
      const validProjects = projects.filter(project => {
        const validation = project.validate()
        if (!validation.isValid) {
          console.warn(`⚠️ Projet invalide ignoré: ${project.name}`, validation.errors)
          return false
        }
        return true
      })

      // Tri par date de création (plus récent en premier)
      validProjects.sort((a, b) => b.createdAt - a.createdAt)

      console.log(`✅ ${validProjects.length} projets récents récupérés`)
      return validProjects
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des projets récents:', error)
      throw new Error(`Impossible de récupérer les projets: ${error.message}`)
    }
  }

  /**
   * Génère des statistiques sur les projets
   * @returns {Promise<Object>} - Statistiques des projets
   */
  static async getProjectStats() {
    try {
      console.log('📊 Génération des statistiques projets')
      
      // Données d'exemple
      const stats = {
        total: 25,
        inProgress: 8,
        completed: 12,
        planning: 3,
        review: 2,
        avgProgress: 67
      }

      console.log('✅ Statistiques projets générées:', stats)
      return stats
      
    } catch (error) {
      console.error('❌ Erreur lors de la génération des statistiques projets:', error)
      throw new Error(`Impossible de générer les statistiques: ${error.message}`)
    }
  }

  /**
   * Crée un nouveau projet
   * @param {Object} projectData - Données du projet
   * @returns {Promise<Project>} - Projet créé
   */
  static async createProject(projectData) {
    try {
      console.log('➕ Création d\'un nouveau projet')
      
      // Création du modèle pour validation
      const project = new Project(projectData)
      
      // Validation
      const validation = project.validate()
      if (!validation.isValid) {
        throw new Error(`Données invalides: ${validation.errors.join(', ')}`)
      }

      // Règles métier
      if (project.progress > 0 && project.status === Project.STATUS.PLANNING) {
        project.status = Project.STATUS.IN_PROGRESS
      }

      console.log(`✅ Projet créé: ${project.name}`)
      return project
      
    } catch (error) {
      console.error('❌ Erreur lors de la création du projet:', error)
      throw new Error(`Impossible de créer le projet: ${error.message}`)
    }
  }
}

export default ProjectController
