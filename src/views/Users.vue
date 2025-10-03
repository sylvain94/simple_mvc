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
          v-if="selectedUsers.length > 0"
          class="btn btn-error gap-2"
          @click="showBulkDeleteModal = true"
          :disabled="isLoading || isProcessing"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete Selected ({{ selectedUsers.length }})
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
                <th>
                  <label>
                    <input 
                      type="checkbox" 
                      class="checkbox" 
                      @change="toggleSelectAll"
                      :checked="selectedUsers.length === appStore.users.length && appStore.users.length > 0"
                    />
                  </label>
                </th>
                <th>User name</th>
                <th>Full name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Enabled</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="appStore.users.length === 0 && !isLoading">
                <td colspan="9" class="text-center py-8">
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
                  <label>
                    <input 
                      type="checkbox" 
                      class="checkbox" 
                      :value="user.id"
                      v-model="selectedUsers"
                      :disabled="isCurrentUser(user) || user.isAdmin"
                      :title="isCurrentUser(user) ? 'Cannot select your own account' : user.isAdmin ? 'Cannot select administrator account' : ''"
                    />
                  </label>
                </td>
                <td>
                  <div class="font-medium flex items-center gap-2">
                    {{ user.userid || '-' }}
                    <span v-if="isCurrentUser(user)" class="badge badge-info badge-xs">You</span>
                    <span v-if="user.isAdmin" class="badge badge-warning badge-xs">Admin</span>
                  </div>
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
                    :class="getRoleBadgeClass(user.primaryRole)"
                  >
                    {{ user.primaryRole || 'guest' }}
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
                        <button 
                          @click="deleteUser(user)" 
                          :disabled="isProcessing || isCurrentUser(user) || user.isAdmin" 
                          class="text-error"
                          :class="{ 'opacity-50 cursor-not-allowed': isCurrentUser(user) || user.isAdmin }"
                          :title="isCurrentUser(user) ? 'Cannot delete your own account' : user.isAdmin ? 'Cannot delete administrator account' : 'Delete user'"
                        >
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
      <div class="modal-box max-w-4xl">
        <h3 class="font-bold text-lg mb-4">Create a new user</h3>
        
        <form @submit.prevent="handleCreateUser" class="space-y-6">
          <!-- Two Column Layout -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- Left Column -->
            <div class="space-y-4">
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

              <!-- User enabled -->
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
            </div>

            <!-- Right Column -->
            <div class="space-y-4">
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

              <!-- Account active -->
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
            </div>
          </div>

          <!-- Full Width Fields -->
          <div class="space-y-4">
            <!-- Role Selection -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Role *</span>
              </label>
              <select 
                v-model="newUser.selectedRole" 
                class="select select-bordered"
                required
              >
                <option value="">Select a role</option>
                <option 
                  v-for="role in availableRoles" 
                  :key="role.id || role.name" 
                  :value="role.id || role.name"
                >
                  {{ role.name || role }}
                </option>
              </select>
              <div v-if="isLoadingRoles" class="label">
                <span class="label-text-alt">Loading roles...</span>
              </div>
            </div>

            <!-- Must change password -->
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
          <p><strong>Role:</strong> {{ appStore.currentUserProfile.primaryRole || 'guest' }}</p>
          <p><strong>All Roles:</strong> {{ appStore.currentUserProfile.roleNames || 'None' }}</p>
        </div>
        <div class="modal-action">
          <button class="btn" @click="appStore.showUserProfileModal = false">Close</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg text-error">⚠️ Confirm Deletion</h3>
        <div class="py-4">
          <p class="mb-4">Are you sure you want to delete the user <strong>"{{ userToDelete?.userid }}"</strong>?</p>
          <div class="bg-warning/10 border border-warning rounded-lg p-3 mb-4">
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span class="text-sm font-medium">This action cannot be undone!</span>
            </div>
          </div>
          <div class="text-sm text-gray-600">
            <p><strong>User:</strong> {{ userToDelete?.userid }}</p>
            <p><strong>Name:</strong> {{ getFullName(userToDelete) }}</p>
            <p><strong>Email:</strong> {{ userToDelete?.email || 'N/A' }}</p>
            <p><strong>Role:</strong> {{ userToDelete?.primaryRole || 'guest' }}</p>
          </div>
        </div>
        <div class="modal-action">
          <button 
            class="btn btn-error" 
            @click="confirmDeleteUser"
            :disabled="isProcessing"
          >
            <svg v-if="isProcessing" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {{ isProcessing ? 'Deleting...' : 'Delete User' }}
          </button>
          <button 
            class="btn btn-ghost" 
            @click="cancelDeleteUser"
            :disabled="isProcessing"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Bulk Delete Confirmation Modal -->
    <div v-if="showBulkDeleteModal" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg text-error">⚠️ Confirm Bulk Deletion</h3>
        <div class="py-4">
          <p class="mb-4">Are you sure you want to delete <strong>{{ selectedUsers.length }}</strong> selected user(s)?</p>
          <div class="bg-error/10 border border-error rounded-lg p-3 mb-4">
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span class="text-sm font-medium">This action cannot be undone!</span>
            </div>
          </div>
          <div class="text-sm text-gray-600 max-h-32 overflow-y-auto">
            <p class="font-medium mb-2">Users to be deleted:</p>
            <ul class="space-y-1">
              <li v-for="userId in selectedUsers" :key="userId" class="flex items-center gap-2">
                <span class="w-2 h-2 bg-error rounded-full"></span>
                {{ appStore.users.find(u => u.id === userId)?.userid || 'Unknown' }}
                ({{ appStore.users.find(u => u.id === userId)?.primaryRole || 'guest' }})
              </li>
            </ul>
          </div>
        </div>
        <div class="modal-action">
          <button 
            class="btn btn-error" 
            @click="confirmBulkDelete"
            :disabled="isProcessing"
          >
            <svg v-if="isProcessing" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {{ isProcessing ? 'Deleting...' : `Delete ${selectedUsers.length} User(s)` }}
          </button>
          <button 
            class="btn btn-ghost" 
            @click="cancelBulkDelete"
            :disabled="isProcessing"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '../stores/app.js'
import { UserController } from '../controllers/UserController.js'
import { roleService, userRoleService } from '../services/api.js'

const appStore = useAppStore()
const isRefreshing = ref(false)
const isCreatingUser = ref(false)

// Available roles for dropdown
const availableRoles = ref([])
const isLoadingRoles = ref(false)

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
  mustChangePassword: false,
  selectedRole: '' // Role selected from dropdown
})
const isLoading = ref(false)
const isProcessing = ref(false)
const error = ref(null)
const successMessage = ref(null)

// Delete confirmation modal
const showDeleteModal = ref(false)
const userToDelete = ref(null)

// Multiple selection for bulk operations
const selectedUsers = ref([])
const showBulkDeleteModal = ref(false)

onMounted(() => {
  loadUsers()
  loadAvailableRoles()
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

function isCurrentUser(user) {
  const currentSession = localStorage.getItem('session')
  if (!currentSession) return false
  
  try {
    const sessionData = JSON.parse(currentSession)
    return user.userid === sessionData.username
  } catch {
    return false
  }
}

// Get badge class based on role
function getRoleBadgeClass(role) {
  switch (role?.toLowerCase()) {
    case 'admin':
      return 'badge-error'
    case 'user':
      return 'badge-primary'
    case 'guest':
      return 'badge-ghost'
    default:
      return 'badge-neutral'
  }
}

// Load available roles for dropdown
async function loadAvailableRoles() {
  isLoadingRoles.value = true
  try {
    console.log('🎭 Loading available roles...')
    const roles = await roleService.getAllRoles()
    
    // Handle different response formats
    if (Array.isArray(roles)) {
      availableRoles.value = roles
    } else if (roles && typeof roles === 'object') {
      // If it's an object, try to extract the array
      availableRoles.value = Object.values(roles)
    } else {
      availableRoles.value = []
    }
    
    console.log(`✅ Loaded ${availableRoles.value.length} roles:`, availableRoles.value)
    
    // Debug: Show role structure
    availableRoles.value.forEach((role, index) => {
      console.log(`🎭 Role ${index + 1}:`, {
        id: role.id,
        name: role.name,
        roletype: role.roletype
      })
    })
  } catch (err) {
    console.error('❌ Error loading roles:', err)
    // Set default roles if API fails - use known ADMIN role ID from your example
    availableRoles.value = [
      { id: '75666666-646e-6047-3146-6f7566666664', name: 'ADMIN' },
      { id: 'user-role-id', name: 'USER' },
      { id: 'guest-role-id', name: 'GUEST' }
    ]
    console.log('🔄 Using fallback roles:', availableRoles.value)
  } finally {
    isLoadingRoles.value = false
  }
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
      !newUser.value.lastName || !newUser.value.email || !newUser.value.selectedRole) {
    error.value = 'Please fill in all required fields including role'
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
    console.log('🎭 Selected role ID:', newUser.value.selectedRole)
    console.log('🎭 Available roles for reference:', availableRoles.value)
    
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
      mustChangePassword: newUser.value.mustChangePassword
    }

    // ✅ MVC: Vue → Controller → Service
    const createdUser = await UserController.createUser(userData)
    
    // Assign the selected role to the user
    try {
      console.log(`🎭 Assigning role "${newUser.value.selectedRole}" to user "${createdUser.id}" (${createdUser.userid})`)
      await userRoleService.createUserRoleRelation(createdUser.id, newUser.value.selectedRole)
      console.log('✅ Role assigned successfully')
    } catch (roleError) {
      console.error('❌ User created but role assignment failed:', roleError)
      // Don't fail the entire operation, but show error to user
      error.value = `User created but role assignment failed: ${roleError.message}`
    }
    
    // Reload users list after creation
    await loadUsers()
    successMessage.value = `User "${userData.userid}" created successfully with role "${newUser.value.selectedRole}"`
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
    mustChangePassword: false,
    selectedRole: ''
  }
  error.value = null
}

function deleteUser(user) {
  // SECURITY: Prevent deletion of current user
  const currentSession = localStorage.getItem('session')
  if (currentSession) {
    const sessionData = JSON.parse(currentSession)
    if (user.userid === sessionData.username) {
      error.value = `Cannot delete your own account "${user.userid}". You are currently logged in with this account.`
      return
    }
  }
  
  // SECURITY: Prevent deletion of administrators
  if (user.isAdmin) {
    error.value = `Cannot delete administrator "${user.userid}". Administrator accounts are protected.`
    return
  }
  
  console.log(`🗑️ Preparing to delete user: "${user.userid}" (ID: ${user.id})`)
  userToDelete.value = user
  showDeleteModal.value = true
}

async function confirmDeleteUser() {
  if (!userToDelete.value) return
  
  isProcessing.value = true
  error.value = null
  
  try {
    console.log(`🗑️ Deleting user: ${userToDelete.value.userid}`)
    // ✅ MVC: Vue → Controller → Service
    await UserController.deleteUser(userToDelete.value.userid)
    // Reload users list after deletion
    await loadUsers()
    successMessage.value = `User "${userToDelete.value.userid}" deleted successfully`
    console.log('✅ User deleted successfully')
    
    // Close modal
    showDeleteModal.value = false
    userToDelete.value = null
  } catch (err) {
    console.error('❌ Error deleting user:', err)
    error.value = `Error deleting user: ${err.message}`
  } finally {
    isProcessing.value = false
  }
}

function cancelDeleteUser() {
  showDeleteModal.value = false
  userToDelete.value = null
}

// Multiple selection functions
function toggleSelectAll() {
  if (selectedUsers.value.length === appStore.users.length) {
    selectedUsers.value = []
  } else {
    selectedUsers.value = appStore.users.map(user => user.id)
  }
}

async function confirmBulkDelete() {
  if (selectedUsers.value.length === 0) return
  
  isProcessing.value = true
  error.value = null
  
  try {
    console.log(`🗑️ Bulk deleting ${selectedUsers.value.length} users`)
    
    // SECURITY: Check for current user and administrators in selection
    const currentSession = localStorage.getItem('session')
    const currentUsername = currentSession ? JSON.parse(currentSession).username : null
    
    let successCount = 0
    let errorCount = 0
    let skippedCount = 0
    const errors = []
    
    // Delete users one by one
    for (const userId of selectedUsers.value) {
      try {
        const user = appStore.users.find(u => u.id === userId)
        if (user) {
          // SECURITY: Skip current user
          if (user.userid === currentUsername) {
            console.warn(`⚠️ Skipping deletion of current user: ${user.userid}`)
            errors.push(`Skipped: Cannot delete your own account "${user.userid}"`)
            skippedCount++
            continue
          }
          
          // SECURITY: Skip administrators
          if (user.isAdmin) {
            console.warn(`⚠️ Skipping deletion of administrator: ${user.userid}`)
            errors.push(`Skipped: Cannot delete administrator "${user.userid}"`)
            skippedCount++
            continue
          }
          
          console.log(`🗑️ Deleting user: "${user.userid}" (ID: ${user.id})`)
          await UserController.deleteUser(user.userid)
          successCount++
        }
      } catch (err) {
        errorCount++
        errors.push(`Error deleting ${appStore.users.find(u => u.id === userId)?.userid || userId}: ${err.message}`)
        console.error(`❌ Error deleting user ${userId}:`, err)
      }
    }
    
    // Show results
    let resultMessage = ''
    if (successCount > 0) {
      resultMessage += `${successCount} user(s) deleted successfully`
    }
    if (skippedCount > 0) {
      if (resultMessage) resultMessage += '. '
      resultMessage += `${skippedCount} user(s) skipped for security reasons`
    }
    if (resultMessage) {
      successMessage.value = resultMessage
    }
    
    if (errorCount > 0) {
      error.value = `${errorCount} user(s) could not be deleted: ${errors.join(', ')}`
    }
    
    // Reload users list and clear selection
    await loadUsers()
    selectedUsers.value = []
    showBulkDeleteModal.value = false
    
    console.log(`✅ Bulk delete completed: ${successCount} success, ${errorCount} errors, ${skippedCount} skipped`)
  } catch (err) {
    console.error('❌ Error during bulk delete:', err)
    error.value = `Error during bulk delete: ${err.message}`
  } finally {
    isProcessing.value = false
  }
}

function cancelBulkDelete() {
  showBulkDeleteModal.value = false
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
