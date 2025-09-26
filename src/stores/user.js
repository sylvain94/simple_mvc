import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)

  // Getters
  const userProfile = computed(() => user.value)
  const userName = computed(() => user.value?.firstName + ' ' + user.value?.lastName || 'User')

  // Actions
  async function login(email, password) {
    loading.value = true
    try {
      // Simulation d'une API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data
      user.value = {
        id: 1,
        firstName: 'Sylvain',
        lastName: 'Renard',
        email: email,
        avatar: 'https://ui-avatars.com/api/?name=Sylvain+Renard&background=0D9488&color=fff'
      }
      
      isAuthenticated.value = true
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    isAuthenticated.value = false
  }

  function updateProfile(profileData) {
    if (user.value) {
      user.value = { ...user.value, ...profileData }
    }
  }

  return {
    // State
    user,
    isAuthenticated,
    loading,
    // Getters
    userProfile,
    userName,
    // Actions
    login,
    logout,
    updateProfile
  }
})
