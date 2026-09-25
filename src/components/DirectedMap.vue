<script setup lang="ts">
import type { ApiConnection, ApiNode } from '@/stores/ApiRequest'
import MapConnection from '@/components/MapConnection.vue'

defineProps<{ nodes: ApiNode[]; nodeIds: string[]; connections: ApiConnection[]; selectedId: string }>()
const emit = defineEmits<{ select: [id: string] }>()
</script>

<template>
  <section class="map-workspace">
    <div class="canvas-head"><div><span class="eyebrow">DIRECTED MAP</span><h2>{{ nodes.length ? 'Choose where to go next' : 'Your map is waiting' }}</h2></div><span class="node-count">{{ nodes.length }} {{ nodes.length === 1 ? 'node' : 'nodes' }}</span></div>
    <div v-if="!nodes.length" class="empty-map"><div class="empty-orbit">✳</div><h3>Nothing is fixed yet.</h3><p>Create a first node, then follow the connections as your thinking grows.</p></div>
    <div v-else class="map-area">
      <MapConnection v-for="edge in connections" :key="`${edge.startNodeId}-${edge.endNodeId}`" :start-index="nodeIds.indexOf(edge.startNodeId)" :end-index="nodeIds.indexOf(edge.endNodeId)" />
      <button v-for="(node, index) in nodes" :key="node.id" class="map-node" :class="{ selected: selectedId === node.id }" :style="{ left: `${8 + (index % 3) * 31}%`, top: `${12 + Math.floor(index / 3) * 42}%` }" @click="emit('select', node.id)"><span class="node-index">0{{ index + 1 }}</span><strong>{{ node.comment.content }}</strong><small>{{ node.comment.creatorUser?.name || 'Unknown author' }}</small><span class="node-arrow">↗</span></button>
    </div>
  </section>
</template>
