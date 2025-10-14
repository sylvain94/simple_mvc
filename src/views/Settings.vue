<template>
  <div class="container mx-auto p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-base-content mb-2">Settings</h1>
      <p class="text-base-content/70">Configure your application according to your preferences</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Navigation menu -->
      <div class="lg:col-span-1">
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body p-4">
            <h2 class="card-title text-lg mb-4">Categories</h2>
            <ul class="menu">
              <li v-for="category in categories" :key="category.id">
                <a 
                  @click="activeCategory = category.id"
                  :class="{ 'active': activeCategory === category.id }"
                  class="flex items-center gap-3"
                >
                  <svg v-if="category.id === 'application'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <svg v-else-if="category.id === 'profile'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <svg v-else-if="category.id === 'appearance'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                  <svg v-else-if="category.id === 'notifications'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <svg v-else-if="category.id === 'security'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {{ category.name }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Parameter content -->
      <div class="lg:col-span-3">
        <!-- Application Properties -->
        <div v-if="activeCategory === 'application'" class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <h2 class="card-title mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Application Properties
            </h2>
            
            <!-- Loading State -->
            <div v-if="applicationLoading" class="text-center py-8">
              <div class="loading loading-spinner loading-lg"></div>
              <p class="mt-4">Loading application properties...</p>
            </div>
            
            <!-- Error State -->
            <div v-else-if="applicationError" class="alert alert-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ applicationError }}</span>
              <button @click="loadApplicationProperties" class="btn btn-sm">Retry</button>
            </div>
            
            <!-- Application Properties Display -->
            <div v-else-if="applicationProperties" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Application ID</span>
                  </label>
                  <input 
                    :value="applicationProperties.id" 
                    type="text" 
                    class="input input-bordered" 
                    readonly
                  />
                </div>
                
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Serial Number</span>
                  </label>
                  <input 
                    :value="applicationProperties.serialNumber" 
                    type="text" 
                    class="input input-bordered" 
                    readonly
                  />
                </div>
                
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Name</span>
                  </label>
                  <input 
                    :value="applicationProperties.name" 
                    type="text" 
                    class="input input-bordered" 
                    readonly
                  />
                </div>
                
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Version</span>
                  </label>
                  <input 
                    :value="applicationProperties.version" 
                    type="text" 
                    class="input input-bordered" 
                    readonly
                  />
                </div>
                
                <div class="form-control md:col-span-2">
                  <label class="label">
                    <span class="label-text font-medium">Description</span>
                  </label>
                  <input 
                    :value="applicationProperties.description || 'No description available'" 
                    type="text" 
                    class="input input-bordered" 
                    readonly
                  />
                </div>
                
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Configuration Status</span>
                  </label>
                  <div class="flex items-center gap-2">
                    <span 
                      class="badge" 
                      :class="applicationProperties.configured ? 'badge-success' : 'badge-warning'"
                    >
                      {{ applicationProperties.configured ? 'Configured' : 'Not Configured' }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="card-actions justify-end mt-6">
                <button @click="loadApplicationProperties" class="btn btn-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- User Profile -->
        <div v-if="activeCategory === 'profile'" class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <h2 class="card-title mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              User Profile
              <button 
                v-if="!profileLoading" 
                @click="loadUserProfile" 
                class="btn btn-ghost btn-sm ml-auto"
                title="Refresh profile"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </h2>

            <!-- Loading State -->
            <div v-if="profileLoading" class="flex justify-center items-center py-8">
              <span class="loading loading-spinner loading-lg"></span>
              <span class="ml-3">Loading profile...</span>
            </div>

            <!-- Error State -->
            <div v-else-if="profileError" class="alert alert-error mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 class="font-bold">Error loading profile</h3>
                <div class="text-xs">{{ profileError }}</div>
              </div>
            </div>

            <!-- Profile Form -->
            <div v-else>
              <!-- User ID (Read-only) -->
              <div class="alert alert-info mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <h3 class="font-bold">User ID: {{ userProfile.userID }}</h3>
                  <div class="text-xs">User ID cannot be changed</div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">First Name</span>
                  </label>
                  <input 
                    v-model="userProfile.firstName" 
                    type="text" 
                    class="input input-bordered" 
                    :class="{ 'input-error': profileErrors.firstName }"
                    placeholder="Enter your first name"
                  />
                  <label v-if="profileErrors.firstName" class="label">
                    <span class="label-text-alt text-error">{{ profileErrors.firstName }}</span>
                  </label>
                </div>
                
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Last Name</span>
                  </label>
                  <input 
                    v-model="userProfile.lastName" 
                    type="text" 
                    class="input input-bordered" 
                    :class="{ 'input-error': profileErrors.lastName }"
                    placeholder="Enter your last name"
                  />
                  <label v-if="profileErrors.lastName" class="label">
                    <span class="label-text-alt text-error">{{ profileErrors.lastName }}</span>
                  </label>
                </div>
                
                <div class="form-control md:col-span-2">
                  <label class="label">
                    <span class="label-text">Email Address</span>
                  </label>
                  <input 
                    v-model="userProfile.email" 
                    type="email" 
                    class="input input-bordered" 
                    :class="{ 'input-error': profileErrors.email }"
                    placeholder="Enter your email address"
                  />
                  <label v-if="profileErrors.email" class="label">
                    <span class="label-text-alt text-error">{{ profileErrors.email }}</span>
                  </label>
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Phone Number</span>
                  </label>
                  <input 
                    v-model="userProfile.phone" 
                    type="tel" 
                    class="input input-bordered" 
                    :class="{ 'input-error': profileErrors.phone }"
                    placeholder="Enter your phone number"
                  />
                  <label v-if="profileErrors.phone" class="label">
                    <span class="label-text-alt text-error">{{ profileErrors.phone }}</span>
                  </label>
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Language</span>
                  </label>
                  <select 
                    v-model="userProfile.language" 
                    class="select select-bordered"
                  >
                    <option value="">Select language</option>
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                    <option value="de">Deutsch</option>
                    <option value="it">Italiano</option>
                  </select>
                </div>
              </div>

              <!-- Account Status -->
              <div class="divider mt-8">Account Status</div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="form-control">
                  <label class="label cursor-pointer">
                    <span class="label-text">Account Enabled</span>
                    <input 
                      v-model="userProfile.enabled" 
                      type="checkbox" 
                      class="toggle toggle-primary" 
                      disabled
                    />
                  </label>
                  <div class="text-xs text-base-content/60 mt-1">Contact administrator to change</div>
                </div>

                <div class="form-control">
                  <label class="label cursor-pointer">
                    <span class="label-text">Account Active</span>
                    <input 
                      v-model="userProfile.active" 
                      type="checkbox" 
                      class="toggle toggle-primary" 
                      disabled
                    />
                  </label>
                  <div class="text-xs text-base-content/60 mt-1">Contact administrator to change</div>
                </div>

                <div class="form-control">
                  <label class="label cursor-pointer">
                    <span class="label-text">Must Change Password</span>
                    <input 
                      v-model="userProfile.mustChangePassword" 
                      type="checkbox" 
                      class="toggle toggle-warning" 
                      disabled
                    />
                  </label>
                  <div class="text-xs text-base-content/60 mt-1">System managed</div>
                </div>
              </div>
              
              <div class="card-actions justify-end mt-8">
                <button 
                  @click="saveProfile" 
                  class="btn btn-primary"
                  :class="{ 'loading': profileSaving }"
                  :disabled="profileSaving"
                >
                  <span v-if="!profileSaving">Save Profile</span>
                  <span v-else>Saving...</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Theme and Appearance -->
        <div v-else-if="activeCategory === 'appearance'" class="card bg-base-100 shadow-elevated">
          <div class="card-body">
            <h2 class="card-title mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v6a2 2 0 002 2h4a2 2 0 002-2V5z" />
              </svg>
              Theme and Appearance
            </h2>
            
            <!-- Theme Selection Cards -->
            <div class="form-control mb-8">
              <label class="label">
                <span class="label-text font-semibold">Theme selection</span>
                <span class="label-text-alt text-sm opacity-70">Thème actuel: {{ appStore.theme }}</span>
              </label>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <!-- Light Theme Card -->
                <div 
                  @click="appStore.setTheme('light')"
                  :class="{ 'ring-2 ring-primary ring-offset-2': appStore.theme === 'light' }"
                  class="card bg-base-100 border cursor-pointer hover:shadow-lg transition-all duration-300"
                >
                  <div class="card-body p-4">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 class="font-semibold text-sm">Light mode</h3>
                        <p class="text-xs opacity-70">Light mode</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Dark Theme Card -->
                <div 
                  @click="appStore.setTheme('dark')"
                  :class="{ 'ring-2 ring-primary ring-offset-2': appStore.theme === 'dark' }"
                  class="card bg-base-100 border cursor-pointer hover:shadow-lg transition-all duration-300"
                >
                  <div class="card-body p-4">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      </div>
                      <div>
                        <h3 class="font-semibold text-sm">Dark mode</h3>
                        <p class="text-xs opacity-70">Dark mode</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Auto Theme Card -->
                <div 
                  @click="appStore.setTheme('auto')"
                  :class="{ 'ring-2 ring-primary ring-offset-2': appStore.theme === 'auto' }"
                  class="card bg-base-100 border cursor-pointer hover:shadow-lg transition-all duration-300"
                >
                  <div class="card-body p-4">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-blue-500 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 class="font-semibold text-sm">Automatic</h3>
                        <p class="text-xs opacity-70">Automatic</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Theme Preview -->
            <div class="form-control mb-6">
              <label class="label">
                <span class="label-text font-semibold">Aperçu</span>
              </label>
              <div class="p-4 border rounded-lg bg-base-200">
                <div class="flex items-center gap-4">
                  <div class="w-3 h-3 rounded-full bg-primary"></div>
                  <div class="w-3 h-3 rounded-full bg-secondary"></div>
                  <div class="w-3 h-3 rounded-full bg-accent"></div>
                  <span class="text-sm">Current theme colors</span>
                </div>
              </div>
            </div>
            
            <!-- Additional Options -->
            <div class="divider">Advanced options</div>
            
            <div class="form-control mb-4">
              <label class="label cursor-pointer">
                <span class="label-text">Reduced animations</span>
                <input v-model="reducedMotion" type="checkbox" class="toggle toggle-primary" />
              </label>
              <label class="label">
                <span class="label-text-alt">Reduces animations to improve performance</span>
              </label>
            </div>
            
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Smooth transitions</span>
                <input v-model="smoothTransitions" type="checkbox" class="toggle toggle-primary" />
              </label>
              <label class="label">
                <span class="label-text-alt">Active smooth transitions between themes</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Notifications -->
        <div v-else-if="activeCategory === 'notifications'" class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <h2 class="card-title mb-6">Notifications</h2>
            
            <div class="space-y-4">
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Notifications by email</span>
                  <input v-model="notifications.email" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>
              
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Notifications push</span>
                  <input v-model="notifications.push" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>
              
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Projects notifications</span>
                  <input v-model="notifications.projects" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>
              
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Weekly summary</span>
                  <input v-model="notifications.weekly" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Security -->
        <div v-else-if="activeCategory === 'security'" class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <h2 class="card-title mb-6">Security</h2>
            
            <div class="space-y-6">
              <div class="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Last login: {{ lastLogin }}</span>
              </div>
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text">New password</span>
                </label>
                <input v-model="security.newPassword" type="password" class="input input-bordered" />
              </div>
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Confirm password</span>
                </label>
                <input v-model="security.confirmPassword" type="password" class="input input-bordered" />
              </div>
              
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Two-factor authentication</span>
                  <input v-model="security.twoFactor" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>
              
              <div class="card-actions">
                <button class="btn btn-primary">Change password</button>
                <button class="btn btn-outline btn-error">Disconnect all devices</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAppStore } from '../stores/app.js'
import { useAuthStore } from '../stores/auth.js'
import { ApplicationController, UserProfileController } from '../controllers/index.js'

// Store imports
const appStore = useAppStore()
const authStore = useAuthStore()

// Reactive data
const activeCategory = ref('application')
const reducedMotion = ref(false)
const smoothTransitions = ref(true)
const lastLogin = ref('26 septembre 2025, 11:06')

// Application properties
const applicationProperties = ref(null)
const applicationLoading = ref(false)
const applicationError = ref(null)

// Categories for settings navigation
const categories = ref([
  { id: 'application', name: 'Application', icon: 'application' },
  { id: 'profile', name: 'Profile', icon: 'user' },
  { id: 'appearance', name: 'Appearance', icon: 'palette' },
  { id: 'notifications', name: 'Notifications', icon: 'bell' },
  { id: 'security', name: 'Security', icon: 'shield' }
])

// User profile data
const userProfile = reactive({
  id: '',
  userID: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  language: '',
  enabled: true,
  active: true,
  mustChangePassword: false
})

// Profile management state
const profileLoading = ref(false)
const profileError = ref(null)
const profileSaving = ref(false)
const profileErrors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

// Notification preferences
const notifications = reactive({
  email: true,
  push: false,
  projects: true,
  weekly: true
})

// Security settings
const security = reactive({
  newPassword: '',
  confirmPassword: '',
  twoFactor: false
})

// Theme management
const currentTheme = computed(() => appStore.theme)
const effectiveTheme = computed(() => appStore.getEffectiveTheme())

// Initialize component
onMounted(() => {
  console.log('🔧 Settings component mounted');
  // Load user preferences from localStorage or API
  loadUserPreferences();
  // Load application properties
  loadApplicationProperties();
  // Load user profile
  loadUserProfile();
})

function loadUserPreferences() {
  // Load saved preferences
  const savedReducedMotion = localStorage.getItem('reducedMotion');
  const savedSmoothTransitions = localStorage.getItem('smoothTransitions');
  
  if (savedReducedMotion !== null) {
    reducedMotion.value = JSON.parse(savedReducedMotion);
  }
  
  if (savedSmoothTransitions !== null) {
    smoothTransitions.value = JSON.parse(savedSmoothTransitions);
  }
}

function saveUserPreferences() {
  localStorage.setItem('reducedMotion', JSON.stringify(reducedMotion.value));
  localStorage.setItem('smoothTransitions', JSON.stringify(smoothTransitions.value));
  
  // Apply reduced motion preference
  if (reducedMotion.value) {
    document.documentElement.style.setProperty('--transition-duration', '0s');
  } else {
    document.documentElement.style.removeProperty('--transition-duration');
  }
  
  console.log('💾 User preferences saved');
}

// Watch for changes and save preferences
import { watch } from 'vue'

watch([reducedMotion, smoothTransitions], () => {
  saveUserPreferences();
}, { deep: true })

// Load user profile from API
async function loadUserProfile() {
  if (!authStore.user?.userid) {
    profileError.value = 'No authenticated user found'
    return
  }

  try {
    profileLoading.value = true
    profileError.value = null
    
    console.log('🔍 Loading profile for user:', authStore.user.userid)
    const profile = await UserProfileController.getUserProfile(authStore.user.userid)
    
    // Update reactive profile data
    Object.assign(userProfile, profile)
    
    console.log('✅ Profile loaded successfully:', profile)
  } catch (error) {
    console.error('❌ Error loading user profile:', error)
    profileError.value = error.message
  } finally {
    profileLoading.value = false
  }
}

// Save user profile to API
async function saveProfile() {
  if (!authStore.user?.userid) {
    profileError.value = 'No authenticated user found'
    return
  }

  try {
    profileSaving.value = true
    profileError.value = null
    
    // Clear previous errors
    Object.keys(profileErrors).forEach(key => {
      profileErrors[key] = ''
    })
    
    // Validate profile data
    const validation = UserProfileController.validateProfileData(userProfile)
    if (!validation.isValid) {
      validation.errors.forEach(error => {
        if (error.includes('email')) {
          profileErrors.email = error
        } else if (error.includes('phone')) {
          profileErrors.phone = error
        }
      })
      return
    }
    
    console.log('💾 Saving profile for user:', authStore.user.userid)
    await UserProfileController.updateUserProfile(authStore.user.userid, userProfile)
    
    console.log('✅ Profile saved successfully')
    
    // Show success message (you could add a toast notification here)
    // For now, just log it
    console.log('🎉 Profile updated successfully!')
    
  } catch (error) {
    console.error('❌ Error saving user profile:', error)
    profileError.value = error.message
  } finally {
    profileSaving.value = false
  }
}

function saveNotifications() {
  console.log('🔔 Saving notifications:', notifications);
  // You would call a notifications API here
}

async function loadApplicationProperties() {
  try {
    applicationLoading.value = true
    applicationError.value = null
    console.log('🏢 Loading application properties...')
    
    const properties = await ApplicationController.getAllProperties()
    applicationProperties.value = properties
    
    console.log('✅ Application properties loaded:', properties)
  } catch (error) {
    console.error('❌ Error loading application properties:', error)
    applicationError.value = error.message || 'Failed to load application properties'
  } finally {
    applicationLoading.value = false
  }
}

function changePassword() {
  if (security.newPassword !== security.confirmPassword) {
    alert('The passwords do not match');
    return;
  }
  
  if (security.newPassword.length < 8) {
    alert('The password must contain at least 8 characters');
    return;
  }
  
  console.log('🔐 Changing password...');
  // You would call AuthController.changePassword() here
  
  // Clear fields after successful change
  security.newPassword = '';
  security.confirmPassword = '';
}
</script>
