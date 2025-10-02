<template>
  <div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Users management</h2>
      <div class="flex gap-2">
        <button 
          class="btn btn-secondary gap-2"
          @click="appStore.openUserCreateModal()"
          :disabled="isLoading"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add a User
        </button>
        <button 
          class="btn btn-primary gap-2"
          @click="refreshUsers"
          :disabled="isRefreshing || isLoading"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="{ 'animate-spin': isRefreshing }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="alert alert-error mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ error }}</span>
      <button @click="error = null" class="btn btn-sm btn-ghost">✕</button>
    </div>

    <!-- Success Alert -->
    <div v-if="successMessage" class="alert alert-success mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ successMessage }}</span>
      <button @click="successMessage = null" class="btn btn-sm btn-ghost">✕</button>
    </div>
    
    <!-- Users table -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h3 class="card-title">List of Users</h3>
        
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-8">
          <span class="loading loading-spinner loading-lg"></span>
          <span class="ml-2">Loading users...</span>
        </div>
        
        <!-- Users Table -->
        <div v-else class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>User name</th>
                <th>Full name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Enabled</th>
                <th>Admin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="appStore.users.length === 0 && !isLoading">
                <td colspan="8" class="text-center py-8">
                  <div class="flex flex-col items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <span class="text-base-content/70">No users found</span>
                  </div>
                </td>
              </tr>
              <tr v-for="user in appStore.users" :key="user.id" class="hover">
                <td>
                  <div class="font-medium">{{ user.userid || '-' }}</div>
                </td>
                <td>
                  <div class="flex items-center gap-3">
                    <div class="avatar placeholder">
                      <div class="bg-neutral text-neutral-content rounded-full w-8">
                        <span class="text-xs">{{ getInitials(user) }}</span>
                      </div>
                    </div>
                    <div>
                      <div class="font-medium">{{ getFullName(user) }}</div>
                      <div class="text-sm opacity-50">{{ user.usertype || 'User' }}</div>
                    </div>
                  </div>
                </td>
                <td>{{ user.email || '-' }}</td>
                <td>{{ user.phone || '-' }}</td>
                <td>
                  <span 
                    class="badge badge-sm" 
                    :class="user.active ? 'badge-success' : 'badge-error'"
                  >
                    {{ user.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <span 
                    class="badge badge-sm" 
                    :class="user.enabled ? 'badge-info' : 'badge-warning'"
                  >
                    {{ user.enabled ? 'Enabled' : 'Disabled' }}
                  </span>
                </td>
                <td>
                  <span 
                    class="badge badge-sm" 
                    :class="user.admin ? 'badge-primary' : 'badge-ghost'"
                  >
                    {{ user.admin ? 'Admin' : 'User' }}
                  </span>
                </td>
                <td>
                  <div class="dropdown dropdown-end">
                    <button tabindex="0" class="btn btn-sm btn-ghost">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                    <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                      <li>
                        <button @click="appStore.openUserProfileModal(user)">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View profile
                        </button>
                      </li>
                      <li>
                        <button @click="toggleUserStatus(user)" :disabled="isProcessing">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                          </svg>
                          {{ user.enabled ? 'Disable' : 'Enable' }}
                        </button>
                      </li>
                      <li>
                        <button @click="resetPassword(user)" :disabled="isProcessing">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                          Reset password
                        </button>
                      </li>
                      <li>
                        <button @click="deleteUser(user)" :disabled="isProcessing" class="text-error">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- User Create Modal -->
    <div v-if="appStore.showUserCreateModal" class="modal modal-open">
      <div class="modal-box max-w-2xl">
        <h3 class="font-bold text-lg mb-4">Create a new user</h3>
        
        <form @submit.prevent="handleCreateUser" class="space-y-4">
          <!-- User ID -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">User ID *</span>
            </label>
            <input 
              type="text" 
              v-model="newUser.userid" 
              class="input input-bordered" 
              placeholder="Ex: sylvain"
              required 
            />
          </div>

          <!-- Password -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Password *</span>
            </label>
            <input 
              type="password" 
              v-model="newUser.password" 
              class="input input-bordered" 
              placeholder="Password"
              required 
            />
          </div>

          <!-- First Name -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">First Name *</span>
            </label>
            <input 
              type="text" 
              v-model="newUser.firstName" 
              class="input input-bordered" 
              placeholder="Ex: John"
              required 
            />
          </div>

          <!-- Last Name -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Last Name *</span>
            </label>
            <input 
              type="text" 
              v-model="newUser.lastName" 
              class="input input-bordered" 
              placeholder="Ex: Doe"
              required 
            />
          </div>

          <!-- Email -->
          <div class="form-control">
            <label class="label">
            <span class="label-text">Email *</span>
            </label>
            <input 
              type="email" 
              v-model="newUser.email" 
              class="input input-bordered" 
              placeholder="Ex: john.doe@gmail.com"
              required 
            />
          </div>

          <!-- Phone -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Phone</span>
            </label>
            <input 
              type="tel" 
              v-model="newUser.phone" 
              class="input input-bordered" 
              placeholder="Ex: +336 12 78 94 36"
            />
          </div>

          <!-- Checkboxes for boolean fields -->
          <div class="grid grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">User enabled</span>
                <input 
                  type="checkbox" 
                  v-model="newUser.enabled" 
                  class="checkbox checkbox-primary" 
                />
              </label>
            </div>

            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Account active</span>
                <input 
                  type="checkbox" 
                  v-model="newUser.active" 
                  class="checkbox checkbox-primary" 
                />
              </label>
            </div>

            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Administrator</span>
                <input 
                  type="checkbox" 
                  v-model="newUser.admin" 
                  class="checkbox checkbox-primary" 
                />
              </label>
            </div>

            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Must change password</span>
                <input 
                  type="checkbox" 
                  v-model="newUser.mustChangePassword" 
                  class="checkbox checkbox-primary" 
                />
              </label>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="modal-action">
            <button 
              type="button" 
              class="btn btn-ghost" 
              @click="closeCreateModal"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="isCreatingUser"
            >
              <span v-if="isCreatingUser" class="loading loading-spinner loading-sm"></span>
              {{ isCreatingUser ? 'Creation...' : 'Create the user' }}
            </button>
          </div>
        </form>
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
import { UserController } from '../controllers/UserController.js'

const appStore = useAppStore()
const isRefreshing = ref(false)
const isCreatingUser = ref(false)

// Data for the new user
const newUser = ref({
  userid: '',
  password: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  enabled: true,
  active: true,
  admin: false,
  mustChangePassword: false
})
const isLoading = ref(false)
const isProcessing = ref(false)
const error = ref(null)
const successMessage = ref(null)

onMounted(() => {
  loadUsers()
})

// Utility functions
function getFullName(user) {
  const firstName = user.firstName || ''
  const lastName = user.lastName || ''
  const fullName = `${firstName} ${lastName}`.trim()
  return fullName || user.userid || 'Utilisateur'
}

function getInitials(user) {
  const firstName = user.firstName || ''
  const lastName = user.lastName || ''
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  } else if (user.userid) {
    return user.userid.substring(0, 2).toUpperCase()
  }
  return 'U'
}

// Data loading methods
async function loadUsers() {
  isLoading.value = true
  error.value = null
  
  try {
    console.log('🔄 Loading users...')
    // ✅ MVC: Vue → Controller → Service
    const users = await UserController.getAllUsers()
    appStore.users = users // Store only for state management
    console.log(`✅ Successfully loaded ${users.length} users`)
  } catch (err) {
    console.error('❌ Error loading users:', err)
    error.value = `Error loading users: ${err.message}`
  } finally {
    isLoading.value = false
  }
}

async function refreshUsers() {
  isRefreshing.value = true
  error.value = null
  successMessage.value = null
  
  try {
    console.log('🔄 Refreshing users...')
    // ✅ MVC: Vue → Controller → Service
    const users = await UserController.getAllUsers()
    appStore.users = users // Store only for state management
    successMessage.value = `List of users refreshed (${users.length} users)`
    console.log('✅ Users refreshed successfully')
  } catch (err) {
    console.error('❌ Error refreshing users:', err)
    error.value = `Error refreshing users: ${err.message}`
  } finally {
    isRefreshing.value = false
  }
}

// User actions
// Methods for the creation of a user
async function handleCreateUser() {
  // Validation basique
  if (!newUser.value.userid || !newUser.value.password || !newUser.value.firstName || 
      !newUser.value.lastName || !newUser.value.email) {
    error.value = 'Please fill in all required fields'
    return
  }

  if (newUser.value.password.length < 6) {
    error.value = 'The password must contain at least 6 characters'
    return
  }

  isCreatingUser.value = true
  error.value = null

  try {
    console.log('👥 Creating new user with data:', newUser.value)
    
    // Create the user with the exact structure required by the API
    const userData = {
      userid: newUser.value.userid,
      password: newUser.value.password,
      firstName: newUser.value.firstName,
      lastName: newUser.value.lastName,
      email: newUser.value.email,
      phone: newUser.value.phone || '',
      enabled: newUser.value.enabled,
      active: newUser.value.active,
      admin: newUser.value.admin,
      mustChangePassword: newUser.value.mustChangePassword
    }

    // ✅ MVC: Vue → Controller → Service
    await UserController.createUser(userData)
    // Reload users list after creation
    await loadUsers()
    successMessage.value = `User "${userData.userid}" created successfully`
    console.log('✅ User created successfully')
    
    // Close the modal and reset the form
    closeCreateModal()
  } catch (err) {
    console.error('❌ Error creating user:', err)
    error.value = `Error creating user: ${err.message}`
  } finally {
    isCreatingUser.value = false
  }
}

function closeCreateModal() {
  appStore.showUserCreateModal = false
  // Reset the form
  newUser.value = {
    userid: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    enabled: true,
    active: true,
    admin: false,
    mustChangePassword: false
  }
  error.value = null
}

async function deleteUser(user) {
  if (!confirm(`Are you sure you want to delete the user "${user.userid}" ?`)) {
    return
  }
  
  isProcessing.value = true
  error.value = null
  
  try {
    console.log(`🗑️ Deleting user: ${user.userid}`)
    // ✅ MVC: Vue → Controller → Service
    await UserController.deleteUser(user.userid)
    // Reload users list after deletion
    await loadUsers()
    successMessage.value = `User "${user.userid}" deleted successfully`
    console.log('✅ User deleted successfully')
  } catch (err) {
    console.error('❌ Error deleting user:', err)
    error.value = `Error deleting user: ${err.message}`
  } finally {
    isProcessing.value = false
  }
}

async function toggleUserStatus(user) {
  const action = user.enabled ? 'disable' : 'enable'
  
  if (!confirm(`Are you sure you want to ${action} the user "${user.userid}" ?`)) {
    return
  }
  
  isProcessing.value = true
  error.value = null
  
  try {
    console.log(`${user.enabled ? '❌' : '✅'} ${action} user: ${user.userid}`)
    // ✅ MVC: Vue → Controller → Service
    await UserController.toggleUserStatus(user.userid, !user.enabled)
    // Reload users list after status change
    await loadUsers()
    successMessage.value = `User "${user.userid}" ${user.enabled ? 'disabled' : 'enabled'} successfully`
    console.log('✅ User status toggled successfully')
  } catch (err) {
    console.error('❌ Error toggling user status:', err)
    error.value = `Error toggling user status: ${err.message}`
  } finally {
    isProcessing.value = false
  }
}

async function resetPassword(user) {
  const newPassword = prompt(`Enter the new password for "${user.userid}":`)
  
  if (!newPassword) {
    return
  }
  
  if (newPassword.length < 6) {
    error.value = 'The password must contain at least 6 characters'
    return
  }
  
  isProcessing.value = true
  error.value = null
  
  try {
    console.log(`🔑 Resetting password for user: ${user.userid}`)
    // ✅ MVC: Vue → Controller → Service
    await UserController.resetPassword(user.userid, newPassword)
    // Reload users list after password reset
    await loadUsers()
    successMessage.value = `Password of "${user.userid}" reset successfully`
    console.log('✅ Password reset successfully')
  } catch (err) {
    console.error('❌ Error resetting password:', err)
    error.value = `Error resetting password: ${err.message}`
  } finally {
    isProcessing.value = false
  }
}
</script>
