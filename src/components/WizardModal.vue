<template>
    <div v-if="show" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 overflow-y-auto">
      <div class="bg-base-100 p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto my-8">
        <h2 class="text-2xl font-bold mb-4">Manage your MediaHub Instances</h2>
        <!-- Ici tu mets ton stepper ou ton formulaire -->
        <button class="btn btn-primary mt-4" @click="close">Close</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const props = defineProps({
    show: Boolean,
  })
  const emit = defineEmits(['close'])
  
  function close() {
    emit('close')
  }
  </script>
  