<template>
  <div v-if="isVisible" class="modal modal-open">
    <div class="modal-box max-w-6xl w-full">
      <!-- Modal Header -->
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-lg">
          <span class="mr-2">🔍</span>
          Analyse - {{ inputFile?.fileName || 'Fichier' }}
        </h3>
        <button 
          class="btn btn-sm btn-circle btn-ghost" 
          @click="closeModal"
          :disabled="isAnalyzing"
        >
          ✕
        </button>
      </div>

      <!-- Analysis Status -->
      <div class="mb-6">
        <div class="flex items-center gap-3 mb-2">
          <div class="badge" :class="getStatusBadgeClass()">
            {{ getStatusText() }}
          </div>
          <div v-if="analysisResult?.timestamp" class="text-sm text-gray-500">
            {{ formatTimestamp(analysisResult.timestamp) }}
          </div>
        </div>

        <!-- Progress Bar (when analyzing) -->
        <div v-if="isAnalyzing" class="w-full">
          <div class="flex justify-between text-sm mb-1">
            <span>Analyse en cours...</span>
            <span>{{ analysisProgress }}%</span>
          </div>
          <progress 
            class="progress progress-primary w-full" 
            :value="analysisProgress" 
            max="100"
          ></progress>
        </div>
      </div>

      <!-- Error Display -->
      <div v-if="error" class="alert alert-error mb-4">
        <span>❌ {{ error }}</span>
      </div>

      <!-- Analysis Results -->
      <div v-if="analysisResult && !isAnalyzing" class="space-y-6">
        
        <!-- Summary Statistics -->
        <div class="stats shadow w-full">
          <div class="stat">
            <div class="stat-figure text-primary">
              📊
            </div>
            <div class="stat-title">Services</div>
            <div class="stat-value text-primary">{{ summary?.totalServices || 0 }}</div>
          </div>
          
          <div class="stat">
            <div class="stat-figure text-secondary">
              📡
            </div>
            <div class="stat-title">PIDs</div>
            <div class="stat-value text-secondary">{{ summary?.totalPids || 0 }}</div>
          </div>
          
          <div class="stat">
            <div class="stat-figure text-accent">
              📋
            </div>
            <div class="stat-title">Tables</div>
            <div class="stat-value text-accent">{{ summary?.totalTables || 0 }}</div>
          </div>

          <div class="stat">
            <div class="stat-figure" :class="summary?.hasErrors ? 'text-error' : 'text-success'">
              {{ summary?.hasErrors ? '❌' : '✅' }}
            </div>
            <div class="stat-title">Status</div>
            <div class="stat-value" :class="summary?.hasErrors ? 'text-error' : 'text-success'">
              {{ summary?.hasErrors ? 'Erreurs' : 'OK' }}
            </div>
          </div>
        </div>

        <!-- Analysis Tree -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h4 class="card-title mb-4">
              <span class="mr-2">🌳</span>
              Arbre d'analyse
            </h4>
            
            <div v-if="analysisTree" class="analysis-tree">
              <AnalysisTreeNode 
                :node="analysisTree" 
                :level="0"
                @node-click="onNodeClick"
              />
            </div>
            
            <div v-else class="text-center text-gray-500 py-8">
              Aucune donnée d'analyse disponible
            </div>
          </div>
        </div>

        <!-- Detailed Information Panel -->
        <div v-if="selectedNode" class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h4 class="card-title mb-4">
              <span class="mr-2">ℹ️</span>
              Détails - {{ selectedNode.label }}
            </h4>
            
            <div class="overflow-x-auto">
              <table class="table table-zebra w-full">
                <tbody>
                  <tr v-for="(value, key) in getNodeDetails(selectedNode)" :key="key">
                    <td class="font-medium">{{ formatKey(key) }}</td>
                    <td>{{ formatValue(value) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Export Options -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h4 class="card-title mb-4">
              <span class="mr-2">💾</span>
              Export
            </h4>
            
            <div class="flex gap-2 flex-wrap">
              <button 
                class="btn btn-outline btn-sm" 
                @click="exportAsJson"
                :disabled="!analysisResult"
              >
                📄 JSON
              </button>
              <button 
                class="btn btn-outline btn-sm" 
                @click="exportAsCsv"
                :disabled="!analysisResult"
              >
                📊 CSV
              </button>
              <button 
                class="btn btn-outline btn-sm" 
                @click="exportAsText"
                :disabled="!analysisResult"
              >
                📝 Texte
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Actions -->
      <div class="modal-action">
        <button 
          v-if="!analysisResult && !isAnalyzing" 
          class="btn btn-primary" 
          @click="startAnalysis"
          :disabled="!inputFile"
        >
          <span class="mr-2">🚀</span>
          Démarrer l'analyse
        </button>
        
        <button 
          v-if="isAnalyzing" 
          class="btn btn-warning" 
          @click="cancelAnalysis"
        >
          <span class="mr-2">🛑</span>
          Annuler
        </button>
        
        <button 
          v-if="analysisResult && !isAnalyzing" 
          class="btn btn-secondary" 
          @click="refreshAnalysis"
        >
          <span class="mr-2">🔄</span>
          Actualiser
        </button>
        
        <button class="btn btn-ghost" @click="closeModal">
          Fermer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { AnalyzeController } from '../controllers/AnalyzeController.js'
import AnalysisTreeNode from './AnalysisTreeNode.vue'

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  inputFile: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['close', 'analysis-complete'])

// Reactive state
const analysisResult = ref(null)
const isAnalyzing = ref(false)
const error = ref(null)
const analysisProgress = ref(0)
const selectedNode = ref(null)
const progressInterval = ref(null)

// Computed properties
const summary = computed(() => {
  return analysisResult.value ? analysisResult.value.getSummary() : null
})

const analysisTree = computed(() => {
  return analysisResult.value ? analysisResult.value.getAnalysisTree() : null
})

// Methods
const closeModal = () => {
  if (isAnalyzing.value) {
    cancelAnalysis()
  }
  resetState()
  emit('close')
}

const resetState = () => {
  analysisResult.value = null
  isAnalyzing.value = false
  error.value = null
  analysisProgress.value = 0
  selectedNode.value = null
  clearProgressInterval()
}

const startAnalysis = async () => {
  if (!props.inputFile?.id) {
    error.value = 'Aucun fichier sélectionné pour l\'analyse'
    return
  }

  try {
    error.value = null
    isAnalyzing.value = true
    analysisProgress.value = 0
    
    // Start progress simulation
    startProgressSimulation()
    
    console.log('🚀 Starting analysis for file:', props.inputFile.id)
    
    // Start analysis and wait for completion
    const result = await AnalyzeController.analyzeAndWait(props.inputFile.id, {
      maxAttempts: 60, // 2 minutes max
      intervalMs: 2000  // Check every 2 seconds
    })
    
    analysisResult.value = result
    analysisProgress.value = 100
    
    console.log('✅ Analysis completed:', result)
    emit('analysis-complete', result)
    
  } catch (err) {
    console.error('❌ Analysis failed:', err)
    error.value = err.message || 'Erreur lors de l\'analyse'
  } finally {
    isAnalyzing.value = false
    clearProgressInterval()
  }
}

const cancelAnalysis = async () => {
  if (!props.inputFile?.id) return
  
  try {
    console.log('🛑 Cancelling analysis for file:', props.inputFile.id)
    await AnalyzeController.cancelAnalysis(props.inputFile.id)
    
  } catch (err) {
    console.error('❌ Error cancelling analysis:', err)
  } finally {
    isAnalyzing.value = false
    clearProgressInterval()
  }
}

const refreshAnalysis = async () => {
  if (!props.inputFile?.id) return
  
  try {
    error.value = null
    console.log('🔄 Refreshing analysis results for file:', props.inputFile.id)
    
    const result = await AnalyzeController.getAnalysisResults(props.inputFile.id)
    analysisResult.value = result
    
  } catch (err) {
    console.error('❌ Error refreshing analysis:', err)
    error.value = err.message || 'Erreur lors de l\'actualisation'
  }
}

const startProgressSimulation = () => {
  analysisProgress.value = 0
  progressInterval.value = setInterval(() => {
    if (analysisProgress.value < 90) {
      analysisProgress.value += Math.random() * 10
    }
  }, 1000)
}

const clearProgressInterval = () => {
  if (progressInterval.value) {
    clearInterval(progressInterval.value)
    progressInterval.value = null
  }
}

const getStatusBadgeClass = () => {
  if (isAnalyzing.value) return 'badge-warning'
  if (error.value) return 'badge-error'
  if (analysisResult.value?.isComplete()) return 'badge-success'
  return 'badge-info'
}

const getStatusText = () => {
  if (isAnalyzing.value) return 'En cours'
  if (error.value) return 'Erreur'
  if (analysisResult.value?.isComplete()) return 'Terminé'
  return 'En attente'
}

const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString('fr-FR')
}

const onNodeClick = (node) => {
  selectedNode.value = node
  console.log('🎯 Node selected:', node)
}

const getNodeDetails = (node) => {
  if (!node?.data) return {}
  
  const details = { ...node.data }
  delete details.children // Remove children from details view
  return details
}

const formatKey = (key) => {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
}

const formatValue = (value) => {
  if (typeof value === 'boolean') return value ? 'Oui' : 'Non'
  if (typeof value === 'number') return value.toLocaleString('fr-FR')
  if (Array.isArray(value)) return `${value.length} éléments`
  if (typeof value === 'object') return '[Objet]'
  return String(value)
}

const exportAsJson = () => {
  if (!analysisResult.value) return
  
  const dataStr = JSON.stringify(analysisResult.value, null, 2)
  downloadFile(dataStr, `analysis-${props.inputFile?.fileName || 'result'}.json`, 'application/json')
}

const exportAsCsv = () => {
  if (!analysisResult.value) return
  
  // Simple CSV export of services and PIDs
  let csv = 'Type,ID,Name,Bitrate,Scrambled\n'
  
  analysisResult.value.services.forEach(service => {
    csv += `Service,${service.id},"${service.name}",${service.bitrate},${service.isScrambled}\n`
    
    service.pids.forEach(pid => {
      csv += `PID,${pid.id},"${pid.type}",${pid.bitrate},\n`
    })
  })
  
  downloadFile(csv, `analysis-${props.inputFile?.fileName || 'result'}.csv`, 'text/csv')
}

const exportAsText = () => {
  if (!analysisResult.value) return
  
  let text = `Analyse - ${props.inputFile?.fileName || 'Fichier'}\n`
  text += `Date: ${formatTimestamp(analysisResult.value.timestamp)}\n\n`
  
  const summary = analysisResult.value.getSummary()
  text += `Résumé:\n`
  text += `- Services: ${summary.totalServices}\n`
  text += `- PIDs: ${summary.totalPids}\n`
  text += `- Tables: ${summary.totalTables}\n`
  text += `- Erreurs: ${summary.hasErrors ? 'Oui' : 'Non'}\n\n`
  
  // Add tree structure
  text += generateTextTree(analysisTree.value, 0)
  
  downloadFile(text, `analysis-${props.inputFile?.fileName || 'result'}.txt`, 'text/plain')
}

const generateTextTree = (node, level) => {
  if (!node) return ''
  
  const indent = '  '.repeat(level)
  let text = `${indent}${node.label}\n`
  
  if (node.children) {
    node.children.forEach(child => {
      text += generateTextTree(child, level + 1)
    })
  }
  
  return text
}

const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Watch for modal visibility changes
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    resetState()
    // Auto-load existing analysis if available
    if (props.inputFile?.id) {
      refreshAnalysis()
    }
  }
})

// Cleanup on unmount
onUnmounted(() => {
  clearProgressInterval()
})
</script>

<style scoped>
.analysis-tree {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.4;
}

.modal-box {
  max-height: 90vh;
  overflow-y: auto;
}

.stats .stat {
  padding: 1rem;
}

.progress {
  height: 0.5rem;
}
</style>
