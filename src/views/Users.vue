<template>
  <div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Users Management</h2>
      <div class="flex gap-2">
        <button 
          class="btn btn-secondary gap-2"
          @click="appStore.openUserCreateModal()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add User
        </button>
        <button 
          class="btn btn-primary gap-2"
          @click="refreshUsers"
          :disabled="isRefreshing"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="{ 'animate-spin': isRefreshing }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
    </div>
    
    <!-- Users table -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h3 class="card-title">Users List</h3>
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Admin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="appStore.users.length === 0">
                <td colspan="6" class="text-center py-4">
                  No users found
                </td>
              </tr>
              <tr v-for="user in appStore.users" :key="user.id" class="hover">
                <td>{{ user.userid }}</td>
                <td>{{ `${user.firstName || ''} ${user.lastName || ''}`.trim() || '-' }}</td>
                <td>{{ user.email || '-' }}</td>
                <td>
                  <span 
                    class="badge" 
                    :class="user.active ? 'badge-success' : 'badge-error'"
                  >
                    {{ user.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <span 
                    class="badge" 
                    :class="user.admin ? 'badge-primary' : 'badge-ghost'"
                  >
                    {{ user.admin ? 'Admin' : 'User' }}
                  </span>
                </td>
                <td>
                  <div class="btn-group">
                    <button 
                      class="btn btn-sm btn-info"
                      @click="appStore.openUserProfileModal(user)"
                    >
                      View
                    </button>
                    <button class="btn btn-sm btn-warning">
                      Edit
                    </button>
                    <button 
                      class="btn btn-sm btn-error"
                      @click="deleteUser(user.id)"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- User Create Modal (placeholder for now) -->
    <div v-if="appStore.showUserCreateModal" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Create New User</h3>
        <p class="py-4">User creation form would go here</p>
        <div class="modal-action">
          <button class="btn" @click="appStore.showUserCreateModal = false">Close</button>
        </div>
      </div>
    </div>

    <!-- User Profile Modal (placeholder for now) -->
    <div v-if="appStore.showUserProfileModal" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg">User Profile</h3>
        <div v-if="appStore.currentUserProfile" class="py-4">
          <p><strong>Username:</strong> {{ appStore.currentUserProfile.userid }}</p>
          <p><strong>Name:</strong> {{ `${appStore.currentUserProfile.firstName || ''} ${appStore.currentUserProfile.lastName || ''}`.trim() }}</p>
          <p><strong>Email:</strong> {{ appStore.currentUserProfile.email }}</p>
          <p><strong>Admin:</strong> {{ appStore.currentUserProfile.admin ? 'Yes' : 'No' }}</p>
        </div>
        <div class="modal-action">
          <button class="btn" @click="appStore.showUserProfileModal = false">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '../stores/app.js'

const appStore = useAppStore()
const isRefreshing = ref(false)

onMounted(() => {
  loadUsers()
})

async function loadUsers() {
  try {
    await appStore.loadUsers()
  } catch (error) {
    console.error('Error loading users:', error)
  }
}

async function refreshUsers() {
  isRefreshing.value = true
  try {
    await loadUsers()
  } finally {
    isRefreshing.value = false
  }
}

async function deleteUser(userId) {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      // Implementation would go here
      console.log(`Delete user ${userId}`)
      await loadUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }
}
</script>
