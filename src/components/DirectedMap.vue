<script setup lang="ts">
import type { ApiConnection, ApiNode } from '@/stores/ApiRequest'
import MapConnection from '@/components/MapConnection.vue'

const props = defineProps<{
  previousNodes: ApiNode[]
  currentNode?: ApiNode
  nextNodes: ApiNode[]
  connections: ApiConnection[]
  currentId: string
}>()
const emit = defineEmits<{ preview: [id: string] }>()

const position = (layer: 'previous' | 'current' | 'next', index: number) => {
  if (layer === 'current') return { x: 50, y: 47 }
  return { x: layer === 'previous' ? 17 : 83, y: 20 + index * 27 }
}
const nodePosition = (nodeId: string) => {
  if (props.currentNode?.id === nodeId) return position('current', 0)
  const previousIndex = props.previousNodes.findIndex(node => node.id === nodeId)
  if (previousIndex >= 0) return position('previous', previousIndex)
  return position('next', Math.max(0, props.nextNodes.findIndex(node => node.id === nodeId)))
}
const layerConnections = () => props.connections
  .filter(connection => connection.startNodeId === props.currentId || connection.endNodeId === props.currentId)
  .filter(connection => props.previousNodes.some(node => node.id === connection.startNodeId) || props.nextNodes.some(node => node.id === connection.endNodeId))
  .map(connection => ({ ...connection, start: nodePosition(connection.startNodeId), end: nodePosition(connection.endNodeId) }))
</script>

<template>
  <section class="map-workspace">
    <div class="map-head"><div><span class="eyebrow">DIRECTED MAP</span><h2>{{ currentNode ? 'Explore the surrounding nodes' : 'Your map is waiting' }}</h2></div><span class="node-count">3 layers</span></div>
    <div v-if="!currentNode" class="empty-map"><div class="empty-orbit">✳</div><h3>Nothing is fixed yet.</h3><p>Create a first node, then follow the connections as your thinking grows.</p></div>
    <div v-else class="map-area">
      <div class="layer-label previous-label">PREVIOUS</div><div class="layer-label current-label">CURRENT</div><div class="layer-label next-label">NEXT</div>
      <MapConnection v-for="edge in layerConnections()" :key="`${edge.startNodeId}-${edge.endNodeId}`" :start-x="edge.start.x" :start-y="edge.start.y" :end-x="edge.end.x" :end-y="edge.end.y" />
      <button v-for="(node, index) in previousNodes" :key="node.id" class="map-node previous-node" :style="{ left: '5%', top: `${18 + index * 27}%` }" @click="emit('preview', node.id)"><span class="node-index">P{{ index + 1 }}</span><strong>{{ node.comment.content }}</strong><small>{{ node.comment.creatorUser?.name || 'Unknown author' }}</small><span class="node-arrow">↗</span></button>
      <button v-if="currentNode" class="map-node current-node" :style="{ left: '38%', top: '37%' }"><span class="node-index">CURRENT</span><strong>{{ currentNode.comment.content }}</strong><small>{{ currentNode.comment.creatorUser?.name || 'Unknown author' }}</small><span class="node-arrow">✳</span></button>
      <button v-for="(node, index) in nextNodes" :key="node.id" class="map-node next-node" :style="{ left: '70%', top: `${18 + index * 27}%` }" @click="emit('preview', node.id)"><span class="node-index">N{{ index + 1 }}</span><strong>{{ node.comment.content }}</strong><small>{{ node.comment.creatorUser?.name || 'Unknown author' }}</small><span class="node-arrow">↗</span></button>
    </div>
  </section>
</template>
