<template>
  <div class="tree-node" :class="{ 'tree-node-expanded': isExpanded }">
    <!-- Node Content -->
    <div 
      class="tree-node-content" 
      :class="getNodeClass()"
      @click="toggleNode"
      :style="{ paddingLeft: `${level * 20}px` }"
    >
      <!-- Expand/Collapse Icon -->
      <span 
        v-if="hasChildren" 
        class="tree-icon"
        :class="{ 'tree-icon-expanded': isExpanded }"
      >
        ▶
      </span>
      <span v-else class="tree-icon-placeholder"></span>
      
      <!-- Node Type Icon -->
      <span class="tree-type-icon mr-2">
        {{ getTypeIcon() }}
      </span>
      
      <!-- Node Label -->
      <span class="tree-label" @click.stop="selectNode">
        {{ node.label }}
      </span>
      
      <!-- Node Badge (if applicable) -->
      <span v-if="getBadgeText()" class="badge badge-xs ml-2" :class="getBadgeClass()">
        {{ getBadgeText() }}
      </span>
    </div>
    
    <!-- Children Nodes -->
    <div v-if="hasChildren && isExpanded" class="tree-children">
      <AnalysisTreeNode
        v-for="(child, index) in node.children"
        :key="`${child.type}-${child.label}-${index}`"
        :node="child"
        :level="level + 1"
        @node-click="$emit('node-click', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  node: {
    type: Object,
    required: true
  },
  level: {
    type: Number,
    default: 0
  }
})

// Emits
const emit = defineEmits(['node-click'])

// Reactive state
const isExpanded = ref(props.level < 2) // Auto-expand first 2 levels

// Computed properties
const hasChildren = computed(() => {
  return props.node.children && props.node.children.length > 0
})

// Methods
const toggleNode = () => {
  if (hasChildren.value) {
    isExpanded.value = !isExpanded.value
  }
}

const selectNode = () => {
  emit('node-click', props.node)
}

const getNodeClass = () => {
  const classes = ['cursor-pointer', 'hover:bg-base-200', 'rounded', 'p-1', 'transition-colors']
  
  switch (props.node.type) {
    case 'root':
      classes.push('font-bold', 'text-primary')
      break
    case 'transport-stream':
      classes.push('font-semibold', 'text-secondary')
      break
    case 'services':
      classes.push('font-medium', 'text-accent')
      break
    case 'service':
      classes.push('text-info')
      break
    case 'pid':
      classes.push('text-sm')
      break
    case 'tables':
      classes.push('font-medium', 'text-warning')
      break
    case 'table':
      classes.push('text-sm', 'text-warning')
      break
    default:
      classes.push('text-base-content')
  }
  
  return classes
}

const getTypeIcon = () => {
  switch (props.node.type) {
    case 'root':
      return '📊'
    case 'transport-stream':
      return '📡'
    case 'services':
      return '📺'
    case 'service':
      return props.node.data?.isScrambled ? '🔒' : '🔓'
    case 'pid':
      return '📌'
    case 'tables':
      return '📋'
    case 'table':
      return '📄'
    default:
      return '📁'
  }
}

const getBadgeText = () => {
  const data = props.node.data
  if (!data) return null
  
  switch (props.node.type) {
    case 'service':
      return data.bitrate ? `${Math.round(data.bitrate / 1000)}k` : null
    case 'pid':
      return data.bitrate ? `${Math.round(data.bitrate / 1000)}k` : null
    case 'transport-stream':
      return data.bitrate ? `${Math.round(data.bitrate / 1000000)}M` : null
    default:
      return null
  }
}

const getBadgeClass = () => {
  switch (props.node.type) {
    case 'service':
      return props.node.data?.isScrambled ? 'badge-warning' : 'badge-success'
    case 'pid':
      return 'badge-info'
    case 'transport-stream':
      return 'badge-primary'
    default:
      return 'badge-ghost'
  }
}
</script>

<style scoped>
.tree-node {
  user-select: none;
}

.tree-node-content {
  display: flex;
  align-items: center;
  min-height: 2rem;
}

.tree-icon {
  display: inline-block;
  width: 1rem;
  text-align: center;
  transition: transform 0.2s ease;
  font-size: 0.75rem;
  margin-right: 0.5rem;
}

.tree-icon-expanded {
  transform: rotate(90deg);
}

.tree-icon-placeholder {
  display: inline-block;
  width: 1rem;
  margin-right: 0.5rem;
}

.tree-type-icon {
  font-size: 1rem;
}

.tree-label {
  flex: 1;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tree-label:hover {
  text-decoration: underline;
}

.tree-children {
  border-left: 1px dashed rgba(0, 0, 0, 0.1);
  margin-left: 0.5rem;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .tree-children {
    border-left-color: rgba(255, 255, 255, 0.1);
  }
}

/* Animation for expand/collapse */
.tree-children {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 1000px;
  }
}
</style>
