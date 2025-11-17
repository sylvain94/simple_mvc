<template>
  <div class="container mx-auto p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-base-content mb-2">Transcoding</h1>
      <p class="text-base-content/70">Manage transcoding functions, profiles and presets</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-6 gap-6">
      <!-- Navigation menu -->
      <div class="lg:col-span-1">
        <div class="card bg-base-100 shadow-lg h-full">
          <div class="card-body p-4 flex flex-col">
            <h2 class="card-title text-lg mb-4">Categories</h2>
            <ul class="menu flex-1">
              <li v-for="category in categories" :key="category.id">
                <a 
                  @click="activeCategory = category.id"
                  :class="{ 'active': activeCategory === category.id }"
                  class="flex items-center gap-3"
                >
                  <svg v-if="category.id === 'profiles'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <svg v-else-if="category.id === 'presets'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  {{ category.name }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Content area -->
      <div class="lg:col-span-5">
        <!-- Profiles -->
        <div v-if="activeCategory === 'profiles'" class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <h2 class="card-title mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Transcoding Profiles
            </h2>
            <div class="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Transcoding profiles management will be available here.</span>
            </div>
          </div>
        </div>

        <!-- Presets -->
        <div v-else-if="activeCategory === 'presets'" class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <h2 class="card-title mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              Transcoding Presets
            </h2>
            <div class="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Transcoding presets management will be available here.</span>
            </div>
          </div>
        </div>

        <!-- Jobs -->
        <div v-else-if="activeCategory === 'jobs'" class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <h2 class="card-title mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Transcoding Jobs
            </h2>
            <div class="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Transcoding jobs management will be available here.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Reactive data
const activeCategory = ref('profiles')

// Categories for transcoding navigation (removed selections)
const categories = ref([
  { id: 'profiles', name: 'Profiles', icon: 'profiles' },
  { id: 'presets', name: 'Presets', icon: 'presets' },
  { id: 'jobs', name: 'Jobs', icon: 'jobs' }
])

onMounted(() => {
  console.log('📺 Transcoding view mounted')
})
</script>

<style scoped>
/* Transcoding layout styles */
.grid {
  align-items: stretch;
}

.grid > div {
  display: flex;
  flex-direction: column;
}

.card {
  flex: 1;
}

.card-body.flex.flex-col {
  height: 100%;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid {
    align-items: normal;
  }
}
</style>
