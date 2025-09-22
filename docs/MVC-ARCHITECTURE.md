# 🏗️ Architecture MVC - Guide Complet

## 📋 Vue d'ensemble

L'architecture **MVC (Model-View-Controller)** est un pattern de conception qui sépare une application en trois composants interconnectés :

- **🏛️ Model (Modèle)** : Gère les données et la logique métier
- **🎨 View (Vue)** : Gère l'interface utilisateur et l'affichage
- **🎮 Controller (Contrôleur)** : Orchestre les interactions entre Model et View

---

## 🗂️ Structure du Projet

```
src/
├── 🏛️ models/              # MODELS - Structure et validation des données
│   ├── User.js            # Modèle utilisateur avec validation
│   ├── Project.js         # Modèle projet
│   └── ...                # Autres entités métier
│
├── 🎮 controllers/         # CONTROLLERS - Logique métier et orchestration
│   ├── UserController.js  # Logique utilisateur (CRUD, recherche, stats)
│   ├── ProjectController.js # Logique projet
│   └── ...                # Autres contrôleurs métier
│
├── 🎨 views/               # VIEWS - Interface utilisateur (Pages)
│   ├── Dashboard.vue      # Page tableau de bord
│   ├── Login.vue          # Page de connexion
│   ├── Settings.vue       # Page paramètres
│   └── ...                # Autres pages
│
├── 🧩 components/          # VIEWS - Composants réutilisables
│   ├── ui/                # Composants d'interface
│   └── ...                # Composants métier
│
├── 🔗 services/            # SERVICES - Communication avec APIs externes
│   ├── api.js             # Client API REST
│   ├── authService.js     # Service d'authentification
│   └── ...                # Autres services
│
├── 🗄️ stores/              # STATE MANAGEMENT - État global (Pinia)
│   ├── auth.js            # Store authentification
│   ├── user.js            # Store utilisateur
│   └── ...                # Autres stores
│
└── 🛤️ router/              # ROUTING - Navigation
    └── index.js           # Configuration des routes
```

---

## 🏛️ MODELS (Modèles)

### 🎯 Responsabilités

Les **Models** sont responsables de :

- ✅ **Structure des données** : Définir les propriétés et types
- ✅ **Validation** : Vérifier la cohérence des données
- ✅ **Transformation** : Normaliser les données entre API et application
- ✅ **Règles métier** : Logique de domaine sur les données
- ✅ **Calculs** : Propriétés calculées et dérivées

### 📝 Exemple : User.js

```javascript
export class User {
  constructor(data = {}) {
    this.id = data.id || null
    this.userid = data.userid || ''
    this.firstName = data.firstName || null
    this.lastName = data.lastName || null
    this.email = data.email || null
    this.enabled = Boolean(data.enabled)
    this.active = Boolean(data.active)
    this.admin = Boolean(data.admin)
  }

  // 🧮 Propriétés calculées
  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim()
  }

  get isValidUser() {
    return this.enabled && this.active
  }

  // ✅ Validation
  validate() {
    const errors = []
    if (!this.userid) errors.push('UserID requis')
    if (this.email && !this.isValidEmail(this.email)) {
      errors.push('Email invalide')
    }
    return { isValid: errors.length === 0, errors }
  }

  // 🔄 Transformation
  static fromApiResponse(apiData) {
    return new User({
      id: apiData.id,
      userid: apiData.userid,
      firstName: apiData.firstName,
      lastName: apiData.lastName,
      email: apiData.email,
      enabled: apiData.enabled,
      active: apiData.active,
      admin: apiData.admin
    })
  }
}
```

### 🎯 Avantages

- **🔒 Validation centralisée** : Toutes les règles au même endroit
- **🔄 Réutilisabilité** : Même modèle partout dans l'app
- **🧪 Testabilité** : Logique métier isolée et testable
- **📏 Consistance** : Structure uniforme des données

---

## 🎮 CONTROLLERS (Contrôleurs)

### 🎯 Responsabilités

Les **Controllers** orchestrent et gèrent :

- ✅ **Logique métier complexe** : Algorithmes et processus
- ✅ **Orchestration** : Coordination entre Models et Services
- ✅ **Validation avancée** : Règles métier transversales
- ✅ **Transformation** : Adaptation des données pour les Views
- ✅ **Gestion d'erreurs** : Traitement des cas d'exception
- ✅ **Cache et optimisation** : Performance applicative

### 📝 Exemple : UserController.js

```javascript
export class UserController {
  
  // 🔍 Récupération avec logique métier
  static async getUserByUserid(userid) {
    try {
      // Validation d'entrée
      if (!userid || userid.trim() === '') {
        throw new Error('L\'ID utilisateur est requis')
      }

      // Appel au service
      const apiResponse = await userService.getUserByUserid(userid)
      
      // Transformation en modèle
      const user = User.fromApiResponse(apiResponse)
      
      // Validation des données reçues
      const validation = user.validate()
      if (!validation.isValid) {
        console.warn('Données invalides:', validation.errors)
      }

      return user
      
    } catch (error) {
      console.error('Erreur récupération utilisateur:', error)
      throw new Error(`Impossible de récupérer l'utilisateur: ${error.message}`)
    }
  }

  // 📊 Logique métier complexe
  static async getUserStats() {
    const users = await this.getAllUsers()
    
    return {
      total: users.length,
      active: users.filter(u => u.active).length,
      inactive: users.filter(u => !u.active).length,
      admins: users.filter(u => u.admin).length
    }
  }

  // 🔍 Recherche avec filtres
  static async searchUsers(criteria) {
    const allUsers = await this.getAllUsers()
    
    let filtered = allUsers
    
    if (criteria.searchTerm) {
      const term = criteria.searchTerm.toLowerCase()
      filtered = filtered.filter(user => 
        user.userid.toLowerCase().includes(term) ||
        user.fullName.toLowerCase().includes(term)
      )
    }

    if (criteria.status === 'active') {
      filtered = filtered.filter(u => u.active)
    }

    return filtered.sort((a, b) => a.fullName.localeCompare(b.fullName))
  }
}
```

### 🎯 Avantages

- **🧠 Logique centralisée** : Règles métier regroupées
- **🔄 Réutilisabilité** : Méthodes réutilisables entre composants
- **🧪 Testabilité** : Logique isolée et testable
- **🔧 Maintenabilité** : Séparation claire des responsabilités

---

## 🎨 VIEWS (Vues)

### 🎯 Responsabilités

Les **Views** gèrent :

- ✅ **Interface utilisateur** : Composants et pages
- ✅ **Interaction utilisateur** : Événements et formulaires
- ✅ **Affichage des données** : Présentation des informations
- ✅ **Navigation** : Routing et transitions
- ✅ **État local** : Données d'interface (modales, formulaires)

### 📝 Exemple : Vue utilisant Controllers

```vue
<template>
  <div class="users-page">
    <!-- 🔍 Interface de recherche -->
    <div class="search-bar">
      <input 
        v-model="searchTerm" 
        @input="performSearch"
        placeholder="Rechercher un utilisateur..."
      />
      <select v-model="statusFilter" @change="performSearch">
        <option value="">Tous</option>
        <option value="active">Actifs</option>
        <option value="inactive">Inactifs</option>
      </select>
    </div>

    <!-- 📊 Statistiques -->
    <div class="stats">
      <div>Total: {{ stats.total }}</div>
      <div>Actifs: {{ stats.active }}</div>
      <div>Admins: {{ stats.admins }}</div>
    </div>

    <!-- 👥 Liste des utilisateurs -->
    <div class="users-list">
      <div v-for="user in users" :key="user.id" class="user-card">
        <h3>{{ user.fullName }}</h3>
        <p>{{ user.userid }}</p>
        <span :class="user.isValidUser ? 'active' : 'inactive'">
          {{ user.isValidUser ? 'Actif' : 'Inactif' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { UserController } from '../controllers/UserController.js'

// 📊 État local de la vue
const users = ref([])
const stats = ref({})
const searchTerm = ref('')
const statusFilter = ref('')
const isLoading = ref(false)

// 🔄 Chargement initial
onMounted(async () => {
  await loadUsers()
  await loadStats()
})

// 👥 Chargement des utilisateurs via Controller
async function loadUsers() {
  try {
    isLoading.value = true
    users.value = await UserController.getAllUsers()
  } catch (error) {
    console.error('Erreur chargement utilisateurs:', error)
  } finally {
    isLoading.value = false
  }
}

// 📊 Chargement des stats via Controller
async function loadStats() {
  try {
    stats.value = await UserController.getUserStats()
  } catch (error) {
    console.error('Erreur chargement stats:', error)
  }
}

// 🔍 Recherche via Controller
async function performSearch() {
  try {
    isLoading.value = true
    users.value = await UserController.searchUsers({
      searchTerm: searchTerm.value,
      status: statusFilter.value
    })
  } catch (error) {
    console.error('Erreur recherche:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
```

---

## 🔗 FLUX DE DONNÉES MVC

```
🎨 VIEW (Dashboard.vue)
    ↓ Appel méthode
🎮 CONTROLLER (UserController.js)
    ↓ Appel service
🔗 SERVICE (userService.js)
    ↓ Requête HTTP
🌐 API BACKEND
    ↓ Réponse JSON
🔗 SERVICE (userService.js)
    ↓ Données brutes
🎮 CONTROLLER (UserController.js)
    ↓ Transformation
🏛️ MODEL (User.js)
    ↓ Validation + Calculs
🎮 CONTROLLER (UserController.js)
    ↓ Données validées
🎨 VIEW (Dashboard.vue)
    ↓ Affichage
👤 UTILISATEUR
```

---

## 📋 BONNES PRATIQUES

### 🏛️ Models

- ✅ **Une classe par entité métier**
- ✅ **Validation dans le constructeur**
- ✅ **Getters pour propriétés calculées**
- ✅ **Méthodes statiques pour création**
- ✅ **Immutabilité quand possible**

### 🎮 Controllers

- ✅ **Méthodes statiques pour logique sans état**
- ✅ **Une responsabilité par méthode**
- ✅ **Gestion d'erreurs systématique**
- ✅ **Logging pour debugging**
- ✅ **Validation d'entrée**

### 🎨 Views

- ✅ **Composants spécialisés et réutilisables**
- ✅ **État local minimal**
- ✅ **Pas de logique métier**
- ✅ **Appel aux Controllers pour les données**
- ✅ **Gestion d'erreurs utilisateur**

---

## 🎯 EXEMPLES D'UTILISATION

### 📊 Dashboard avec statistiques

```javascript
// Dans Dashboard.vue
const stats = await UserController.getUserStats()
const recentProjects = await ProjectController.getRecentProjects()
```

### 🔍 Page de recherche

```javascript
// Dans UsersPage.vue
const users = await UserController.searchUsers({
  searchTerm: 'admin',
  status: 'active'
})
```

### ➕ Création d'entité

```javascript
// Dans CreateUserModal.vue
const newUser = await UserController.createUser({
  userid: 'newuser',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com'
})
```

---

## 🧪 TESTS

### Models
```javascript
// Test de validation
test('User validation', () => {
  const user = new User({ userid: '', email: 'invalid' })
  const result = user.validate()
  expect(result.isValid).toBe(false)
  expect(result.errors).toContain('UserID requis')
})
```

### Controllers
```javascript
// Test de logique métier
test('UserController stats', async () => {
  const stats = await UserController.getUserStats()
  expect(stats.total).toBeGreaterThan(0)
  expect(stats.active + stats.inactive).toBe(stats.total)
})
```

---

## 🚀 MIGRATION PROGRESSIVE

Si vous avez déjà du code, vous pouvez migrer progressivement :

1. **Étape 1** : Créer les Models pour vos entités principales
2. **Étape 2** : Extraire la logique métier dans des Controllers
3. **Étape 3** : Refactoriser les Views pour utiliser les Controllers
4. **Étape 4** : Ajouter la validation et les tests

Cette architecture MVC vous donne une base solide, maintenable et évolutive pour votre application Vue.js ! 🎉
