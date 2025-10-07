<template>
  <div v-if="isVisible" class="modal modal-open">
    <div class="modal-box max-w-6xl w-full">
      <!-- Modal Header -->
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-lg">
          <span class="mr-2">🔍</span>
          Analysis - {{ inputFile?.fileName || 'File' }}
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
            <span>Analysis in progress...</span>
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
              {{ summary?.hasErrors ? 'Errors' : 'OK' }}
            </div>
          </div>
        </div>

        <!-- Analysis Tabs -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <!-- Tab Navigation -->
            <div class="tabs tabs-bordered mb-4">
              <button 
                class="tab tab-lg"
                :class="{ 'tab-active': activeTab === 'tree' }"
                @click="activeTab = 'tree'"
              >
                <span class="mr-2">🌳</span>
                Analysis Tree
              </button>
              <button 
                class="tab tab-lg"
                :class="{ 'tab-active': activeTab === 'charts' }"
                @click="activeTab = 'charts'"
              >
                <span class="mr-2">📊</span>
                Charts
              </button>
            </div>

            <!-- Analysis Tree Tab -->
            <div v-show="activeTab === 'tree'">
              <div v-if="analysisTree" class="analysis-tree">
                <AnalysisTreeNode 
                  :node="analysisTree" 
                  :level="0"
                  @node-click="onNodeClick"
                />
              </div>
              
              <div v-else class="text-center text-gray-500 py-8">
                No analysis data available
              </div>
            </div>

            <!-- Charts Tab -->
            <div v-show="activeTab === 'charts'">
              <div v-if="analysisResult" class="chart-container">
                <canvas ref="bitrateChart" id="bitrateChart"></canvas>
              </div>
              
              <div v-else class="text-center text-gray-500 py-8">
                No analysis data available for charts
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Information Panel -->
        <div v-if="selectedNode" class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h4 class="card-title mb-4">
              <span class="mr-2">ℹ️</span>
              Details - {{ selectedNode.label }}
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
                📝 Text
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Actions -->
      <div class="modal-action">
        <button 
          v-if="isAnalyzing" 
          class="btn btn-warning" 
          @click="cancelAnalysis"
        >
          <span class="mr-2">🛑</span>
          Cancel
        </button>
        
        <button 
          v-if="analysisResult && !isAnalyzing" 
          class="btn btn-primary" 
          @click="startAnalysis"
        >
          <span class="mr-2">🔄</span>
          Restart analysis
        </button>
        
        <button class="btn btn-ghost" @click="closeModal">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  height: 400px;
  padding: 20px;
  border-radius: 8px;
  background-color: var(--fallback-b1, oklch(var(--b1)));
}

.analysis-tree {
  max-height: 400px;
  overflow-y: auto;
}

.tabs {
  border-bottom: 1px solid var(--fallback-bc, oklch(var(--bc) / 0.2));
}

.tab {
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.tab:hover {
  background-color: var(--fallback-b2, oklch(var(--b2)));
}

.tab-active {
  border-bottom-color: var(--fallback-p, oklch(var(--p)));
  background-color: var(--fallback-b1, oklch(var(--b1)));
}
</style>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
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
const activeTab = ref('tree')
const bitrateChart = ref(null)
let chartInstance = null

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
  activeTab.value = 'tree'
  clearProgressInterval()
  destroyChart()
}

const startAnalysis = async () => {
  if (!props.inputFile?.id) {
    error.value = 'No file selected for analysis'
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
    error.value = err.message || 'Error during analysis'
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


const startProgressSimulation = () => {
  analysisProgress.value = 0
  progressInterval.value = setInterval(() => {
    if (analysisProgress.value < 90) {
      analysisProgress.value += Math.floor(Math.random() * 10) + 1 // Between 1 and 10, integers
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
  if (isAnalyzing.value) return 'In progress'
  if (error.value) return 'Error'
  if (analysisResult.value?.isComplete()) return 'Completed'
  return 'Pending'
}

const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString('en-US')
}

const onNodeClick = (node) => {
  selectedNode.value = node
  console.log('🎯 Node selected:', node)
}

const getNodeDetails = (node) => {
  if (!node?.data) return {}
  
  const details = { ...node.data }
  delete details.children // Remove children from details view
  
  // For All PIDs, remove irrelevant fields
  if (node.type === 'pid') {
    delete details.video    // Always "No" for all pids
    delete details.audio    // Always "No" for all pids
    delete details.pmt      // Always "No" for all pids
    
    // Replace packets object with discontinuities value
    if (details.packets && typeof details.packets === 'object') {
      details.discontinuities = details.packets.discontinuities || 0
      delete details.packets
    }
  }
  // For audio PIDs, keep relevant fields
  if (node.type === 'pid' && node.data.audio === false) {
    delete details.language // Not relevant for audio
  }

  // For All Tables, remove irrelevant fields
  if (node.type === 'table') {
    delete details.tid         // Remove TID field
    delete details.tidExt      // Remove TID extension field
  }
  
  return details
}

const formatKey = (key) => {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
}

const formatValue = (value) => {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'number') return value.toLocaleString('en-US')
  if (Array.isArray(value)) return `${value.length} items`
  if (typeof value === 'object') return '[Objet]'
  return String(value)
}

// Chart methods
const createBitrateChart = () => {
  if (!analysisResult.value || !bitrateChart.value) return
  
  destroyChart() // Destroy existing chart
  
  const ctx = bitrateChart.value.getContext('2d')
  const data = analysisResult.value
  
  // Prepare datasets
  const datasets = []
  
  // Add Transport Stream bitrate
  if (data.transportStream?.bitrate) {
    datasets.push({
      label: 'TS Bitrate',
      data: [data.transportStream.bitrate, data.transportStream.bitrate],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1
    })
  }
  
  // Add Service bitrates
  data.services.forEach((service, index) => {
    const serviceColor = `hsl(${index * 60}, 70%, 50%)`
    datasets.push({
      label: `Service ${service.name}`,
      data: [service.bitrate, service.bitrate],
      borderColor: serviceColor,
      backgroundColor: serviceColor.replace('50%', '20%'),
      tension: 0.1
    })
  })
  
  // Add PID bitrates
  data.services.forEach(service => {
    const servicePids = data.pids.filter(pid => service.pids.includes(pid.id))
    servicePids.forEach(pid => {
      let color
      let label = `PID ${pid.id}`
      
      if (pid.video) {
        color = 'rgb(255, 99, 132)'
        label = `🎥 Video PID ${pid.id}`
      } else if (pid.audio) {
        color = 'rgb(54, 162, 235)'
        label = `🔊 Audio PID ${pid.id}`
      } else if (pid.pmt) {
        color = 'rgb(255, 206, 86)'
        label = `📋 PMT PID ${pid.id}`
      } else {
        color = 'rgb(153, 102, 255)'
        label = `Data PID ${pid.id}`
      }
      
      datasets.push({
        label: label,
        data: [pid.bitrate, pid.bitrate],
        borderColor: color,
        backgroundColor: color.replace('rgb', 'rgba').replace(')', ', 0.2)'),
        tension: 0.1
      })
    })
  })
  
  // Create chart
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['t=0s', 't=2s'],
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Bitrate evolution'
        },
        legend: {
          position: 'right'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Bitrate (bps)'
          },
          ticks: {
            callback: function(value) {
              if (value >= 1000000) {
                return (value / 1000000).toFixed(1) + 'M'
              } else if (value >= 1000) {
                return (value / 1000).toFixed(1) + 'k'
              }
              return value
            }
          }
        },
        x: {
          title: {
            display: true,
            text: 'Time (seconds)'
          }
        }
      }
    }
  })
}

const destroyChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
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
  
  let text = `Analysis - ${props.inputFile?.fileName || 'File'}\n`
  text += `Date: ${formatTimestamp(analysisResult.value.timestamp)}\n\n`
  
  const summary = analysisResult.value.getSummary()
  text += `Summary:\n`
  text += `- Services: ${summary.totalServices}\n`
  text += `- PIDs: ${summary.totalPids}\n`
  text += `- Tables: ${summary.totalTables}\n`
  text += `- Errors: ${summary.hasErrors ? 'Yes' : 'No'}\n\n`
  
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
    // Auto-start analysis when modal opens
    console.log('🔍 Analysis modal opened for file:', props.inputFile?.fileName)
    if (props.inputFile?.id) {
      startAnalysis()
    }
  }
})

// Watch for analysis result changes to create chart
watch(analysisResult, (newResult) => {
  if (newResult && activeTab.value === 'charts') {
    // Use nextTick to ensure DOM is updated
    nextTick(() => {
      createBitrateChart()
    })
  }
})

// Watch for tab changes to create chart when switching to charts tab
watch(activeTab, (newTab) => {
  if (newTab === 'charts' && analysisResult.value) {
    nextTick(() => {
      createBitrateChart()
    })
  }
})

// Cleanup on unmount
onUnmounted(() => {
  clearProgressInterval()
  destroyChart()
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
