<script setup lang="ts">
defineProps<{ selectedId: string; message: string }>()
const emit = defineEmits<{ open: [id: string]; create: [content: string] }>()
const rootId = defineModel<string>('rootId', { default: '' })
const content = defineModel<string>('content', { default: '' })

function create() {
  if (content.value.trim()) emit('create', content.value.trim())
}
</script>

<template>
  <aside class="sidebar">
    <span class="eyebrow">YOUR WORKSPACE</span>
    <h1>Find the<br><em>next idea.</em></h1>
    <p class="muted">Every node is a thought. Every line is a direction worth exploring.</p>
    <div class="divider"></div>
    <label class="field-label">Start with a node ID<input v-model="rootId" placeholder="Paste UUID"><button class="secondary wide" @click="rootId && emit('open', rootId)">Open node <span>→</span></button></label>
    <div class="divider"></div>
    <label class="field-label">{{ selectedId ? 'Add a connected node' : 'Create your first node' }}<textarea v-model="content" rows="3" placeholder="Write an idea in one sentence…"></textarea><button class="primary wide" @click="create">{{ selectedId ? 'Add direction' : 'Create node' }} <span>＋</span></button></label>
    <p v-if="message" class="notice">{{ message }}</p>
  </aside>
</template>
