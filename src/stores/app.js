import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // State
  const theme = ref('light')
  const sidebarOpen = ref(false)
  const notifications = ref([])
  const loading = ref(false)

  // Actions
  function setTheme(newTheme) {
    theme.value = newTheme
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('app-theme', newTheme)
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function addNotification(notification) {
    const id = Date.now()
    notifications.value.push({
      id,
      type: 'info',
      title: 'Notification',
      message: '',
      timestamp: new Date(),
      ...notification
    })

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(id)
    }, 5000)
  }

  function removeNotification(id) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  function setLoading(state) {
    loading.value = state
  }

  // Initialize theme from localStorage
  function initializeTheme() {
    const savedTheme = localStorage.getItem('app-theme')
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }

  return {
    // State
    theme,
    sidebarOpen,
    notifications,
    loading,
    // Actions
    setTheme,
    toggleSidebar,
    addNotification,
    removeNotification,
    setLoading,
    initializeTheme
  }
})
