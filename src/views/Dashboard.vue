<template>
  <div class="container mx-auto p-6">
    <!-- Header avec stats -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-base-content mb-2">Tableau de Bord</h1>
      <p class="text-base-content/70">Bienvenue dans votre application Simple MVC</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="stat bg-base-200 rounded-lg shadow">
        <div class="stat-figure text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="stat-title">Total Projets</div>
        <div class="stat-value text-primary">{{ stats.projects }}</div>
        <div class="stat-desc">+12% depuis le mois dernier</div>
      </div>

      <div class="stat bg-base-200 rounded-lg shadow">
        <div class="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
          </svg>
        </div>
        <div class="stat-title">Utilisateurs</div>
        <div class="stat-value text-secondary">{{ stats.users }}</div>
        <div class="stat-desc">+5% depuis la semaine dernière</div>
      </div>

      <div class="stat bg-base-200 rounded-lg shadow">
        <div class="stat-figure text-accent">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
          </svg>
        </div>
        <div class="stat-title">Tâches</div>
        <div class="stat-value text-accent">{{ stats.tasks }}</div>
        <div class="stat-desc">{{ stats.completedTasks }} terminées</div>
      </div>

      <div class="stat bg-base-200 rounded-lg shadow">
        <div class="stat-figure text-warning">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
        <div class="stat-title">Performance</div>
        <div class="stat-value text-warning">{{ stats.performance }}%</div>
        <div class="stat-desc">Objectifs atteints</div>
      </div>
    </div>

    <!-- Actions rapides et contenu principal -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Actions rapides -->
      <div class="lg:col-span-1">
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <h2 class="card-title mb-4">Actions Rapides</h2>
            <div class="space-y-3">
              <button class="btn btn-primary btn-block" @click="openWizard">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nouveau Projet
              </button>
              <button class="btn btn-secondary btn-block">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Ajouter Utilisateur
              </button>
              <button class="btn btn-accent btn-block">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Générer Rapport
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Projets récents -->
      <div class="lg:col-span-2">
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <h2 class="card-title mb-4">Projets Récents</h2>
            <div class="overflow-x-auto">
              <table class="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Statut</th>
                    <th>Progress</th>
                    <th>Équipe</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="project in recentProjects" :key="project.id">
                    <td>
                      <div class="font-bold">{{ project.name }}</div>
                      <div class="text-sm opacity-50">{{ project.description }}</div>
                    </td>
                    <td>
                      <div class="badge" :class="getStatusClass(project.status)">{{ project.status }}</div>
                    </td>
                    <td>
                      <div class="w-full bg-base-300 rounded-full h-2">
                        <div class="bg-primary h-2 rounded-full" :style="`width: ${project.progress}%`"></div>
                      </div>
                      <span class="text-xs">{{ project.progress }}%</span>
                    </td>
                    <td>{{ project.team }}</td>
                    <td>
                      <button class="btn btn-ghost btn-xs">Voir</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Wizard -->
    <WizardModal :show="showWizard" @close="closeWizard" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import WizardModal from '../components/WizardModal.vue'

const showWizard = ref(false)

const stats = reactive({
  projects: 25,
  users: 142,
  tasks: 38,
  completedTasks: 24,
  performance: 87
})

const recentProjects = ref([
  {
    id: 1,
    name: 'Site E-commerce',
    description: 'Boutique en ligne moderne',
    status: 'En cours',
    progress: 75,
    team: 'Frontend'
  },
  {
    id: 2,
    name: 'API REST',
    description: 'Service backend scalable',
    status: 'Review',
    progress: 90,
    team: 'Backend'
  },
  {
    id: 3,
    name: 'App Mobile',
    description: 'Application iOS/Android',
    status: 'Planning',
    progress: 15,
    team: 'Mobile'
  }
])

function openWizard() {
  showWizard.value = true
}

function closeWizard() {
  showWizard.value = false
}

function getStatusClass(status) {
  const classes = {
    'En cours': 'badge-primary',
    'Review': 'badge-warning',
    'Planning': 'badge-secondary',
    'Terminé': 'badge-success'
  }
  return classes[status] || 'badge-ghost'
}
</script>
