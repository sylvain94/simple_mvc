/**
 * Controller User - Gère la logique métier liée aux utilisateurs
 * 
 * Les Controllers dans MVC sont responsables de :
 * - Orchestrer les interactions entre Models et Views
 * - Gérer la logique métier complexe
 * - Valider les données avant envoi aux services
 * - Transformer les données pour l'affichage
 * - Gérer les erreurs et les cas d'usage
 */

import { User } from '../models/User.js'
import { userService } from '../services/api.js'

export class UserController {
  
  /**
   * Récupère un utilisateur par son ID utilisateur
   * @param {string} userid - ID de l'utilisateur
   * @returns {Promise<User>} - Instance User ou null
   */
  static async getUserByUserid(userid) {
    try {
      if (!userid || userid.trim() === '') {
        throw new Error('userid is required')
      }

      console.log(`🔍 Getting user by userid: ${userid}`)
      
      // Appel au service API
      const apiResponse = await userService.getUserByUserid(userid)
      
      // Transformation en modèle User
      const user = User.fromApiResponse(apiResponse)
      
      // Validation des données reçues
      const validation = user.validate()
      if (!validation.isValid) {
        console.warn('⚠️ User data is invalid:', validation.errors)
      }

      console.log(`✅ User retrieved: ${user.displayName}`)
      return user
      
    } catch (error) {
      console.error('❌ Error retrieving user:', error)
      throw new Error(`Impossible de récupérer l'utilisateur: ${error.message}`)
    }
  }

  /**
   * Récupère tous les utilisateurs
   * @returns {Promise<User[]>} - Liste des utilisateurs
   */
  static async getAllUsers() {
    try {
      console.log('📋 Getting all users')
      
      const apiResponse = await userService.getAllUsers()
      
      // Transformation en modèles User
      const users = apiResponse.map(userData => User.fromApiResponse(userData))
      
      // Filtrage et tri
      const validUsers = users.filter(user => {
        const validation = user.validate()
        if (!validation.isValid) {
          console.warn(`⚠️ Invalid user ignored: ${user.userid}`, validation.errors)
          return false
        }
        return true
      })

      // Tri par nom d'affichage
      validUsers.sort((a, b) => a.displayName.localeCompare(b.displayName))

      console.log(`✅ ${validUsers.length} users retrieved`)
      return validUsers
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des utilisateurs:', error)
      throw new Error(`Impossible de récupérer les utilisateurs: ${error.message}`)
    }
  }

  /**
   * Crée un nouvel utilisateur
   * @param {Object} userData - Données de l'utilisateur
   * @returns {Promise<User>} - Utilisateur créé
   */
  static async createUser(userData) {
    try {
      console.log('➕ Création d\'un nouvel utilisateur')
      
      // Création du modèle User pour validation
      const user = new User(userData)
      
      // Validation des données
      const validation = user.validate()
      if (!validation.isValid) {
        throw new Error(`Données invalides: ${validation.errors.join(', ')}`)
      }

      // Règles métier spécifiques
      if (await this.isUseridTaken(user.userid)) {
        throw new Error('Ce nom d\'utilisateur est déjà pris')
      }

      // Appel au service API (à implémenter selon votre backend)
      // const apiResponse = await userService.createUser(user.toJSON())
      // const createdUser = User.fromApiResponse(apiResponse)

      console.log(`✅ Utilisateur créé: ${user.displayName}`)
      return user
      
    } catch (error) {
      console.error('❌ Erreur lors de la création de l\'utilisateur:', error)
      throw new Error(`Impossible de créer l'utilisateur: ${error.message}`)
    }
  }

  /**
   * Met à jour un utilisateur
   * @param {string} userid - ID de l'utilisateur
   * @param {Object} updateData - Données à mettre à jour
   * @returns {Promise<User>} - Utilisateur mis à jour
   */
  static async updateUser(userid, updateData) {
    try {
      console.log(`📝 Mise à jour de l'utilisateur: ${userid}`)
      
      // Récupération de l'utilisateur existant
      const existingUser = await this.getUserByUserid(userid)
      
      // Mise à jour des données
      const updatedUser = existingUser.update(updateData)
      
      // Validation
      const validation = updatedUser.validate()
      if (!validation.isValid) {
        throw new Error(`Données invalides: ${validation.errors.join(', ')}`)
      }

      // Appel au service API (à implémenter)
      // const apiResponse = await userService.updateUser(userid, updatedUser.toJSON())
      // const finalUser = User.fromApiResponse(apiResponse)

      console.log(`✅ Utilisateur mis à jour: ${updatedUser.displayName}`)
      return updatedUser
      
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de l\'utilisateur:', error)
      throw new Error(`Impossible de mettre à jour l'utilisateur: ${error.message}`)
    }
  }

  /**
   * Supprime un utilisateur
   * @param {string} userid - ID de l'utilisateur
   * @returns {Promise<boolean>} - Succès de la suppression
   */
  static async deleteUser(userid) {
    try {
      console.log(`🗑️ Suppression de l'utilisateur: ${userid}`)
      
      // Vérifications métier
      const user = await this.getUserByUserid(userid)
      
      if (user.admin) {
        throw new Error('Impossible de supprimer un administrateur')
      }

      // Appel au service API (à implémenter)
      // await userService.deleteUser(userid)

      console.log(`✅ Utilisateur supprimé: ${userid}`)
      return true
      
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de l\'utilisateur:', error)
      throw new Error(`Impossible de supprimer l'utilisateur: ${error.message}`)
    }
  }

  /**
   * Génère des statistiques sur les utilisateurs
   * @returns {Promise<Object>} - Statistiques
   */
  static async getUserStats() {
    try {
      console.log('📊 Génération des statistiques utilisateurs')
      
      const users = await this.getAllUsers()
      
      const stats = {
        total: users.length,
        active: users.filter(u => u.active).length,
        inactive: users.filter(u => !u.active).length,
        enabled: users.filter(u => u.enabled).length,
        disabled: users.filter(u => !u.enabled).length,
        admins: users.filter(u => u.admin).length,
        mustChangePassword: users.filter(u => u.mustChangePassword).length
      }

      console.log('✅ Statistiques générées:', stats)
      return stats
      
    } catch (error) {
      console.error('❌ Erreur lors de la génération des statistiques:', error)
      throw new Error(`Impossible de générer les statistiques: ${error.message}`)
    }
  }

  /**
   * Vérifie si un nom d'utilisateur est déjà pris
   * @param {string} userid - Nom d'utilisateur à vérifier
   * @returns {Promise<boolean>} - True si pris
   */
  static async isUseridTaken(userid) {
    try {
      await this.getUserByUserid(userid)
      return true // Si on trouve l'utilisateur, le nom est pris
    } catch (error) {
      return false // Si erreur, le nom n'est pas pris
    }
  }

  /**
   * Recherche des utilisateurs par critères
   * @param {Object} criteria - Critères de recherche
   * @returns {Promise<User[]>} - Utilisateurs trouvés
   */
  static async searchUsers(criteria) {
    try {
      console.log('🔍 Recherche d\'utilisateurs avec critères:', criteria)
      
      const allUsers = await this.getAllUsers()
      
      let filteredUsers = allUsers
      
      // Filtrage par terme de recherche
      if (criteria.searchTerm) {
        const term = criteria.searchTerm.toLowerCase()
        filteredUsers = filteredUsers.filter(user => 
          user.userid.toLowerCase().includes(term) ||
          user.displayName.toLowerCase().includes(term) ||
          (user.email && user.email.toLowerCase().includes(term))
        )
      }

      // Filtrage par statut
      if (criteria.status) {
        switch (criteria.status) {
          case 'active':
            filteredUsers = filteredUsers.filter(u => u.active)
            break
          case 'inactive':
            filteredUsers = filteredUsers.filter(u => !u.active)
            break
          case 'admin':
            filteredUsers = filteredUsers.filter(u => u.admin)
            break
        }
      }

      console.log(`✅ ${filteredUsers.length} utilisateurs trouvés`)
      return filteredUsers
      
    } catch (error) {
      console.error('❌ Erreur lors de la recherche:', error)
      throw new Error(`Impossible de rechercher les utilisateurs: ${error.message}`)
    }
  }
}

export default UserController
