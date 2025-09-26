<template>
  <div class="container mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6">Network Configuration</h2>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">Network Interfaces</h3>
          <div class="overflow-x-auto">
            <table class="table w-full">
              <thead>
                <tr>
                  <th>Interface</th>
                  <th>IP Address</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>eth0</td>
                  <td>192.168.1.116</td>
                  <td><span class="badge badge-success">Active</span></td>
                </tr>
                <tr>
                  <td>lo</td>
                  <td>127.0.0.1</td>
                  <td><span class="badge badge-success">Active</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">Network Settings</h3>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Hostname</span>
            </label>
            <input type="text" placeholder="Enter hostname" class="input input-bordered" />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">DNS Servers</span>
            </label>
            <input type="text" placeholder="8.8.8.8, 8.8.4.4" class="input input-bordered" />
          </div>
          <div class="card-actions justify-end mt-4">
            <button class="btn btn-primary">Save Settings</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log('Network view mounted')
})
</script>
