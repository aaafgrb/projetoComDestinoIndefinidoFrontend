<script setup lang="ts">
import { computed, ref } from 'vue'
import AuthScreen from '@/components/AuthScreen.vue'
import DirectedMap from '@/components/DirectedMap.vue'
import NodeDetailPanel from '@/components/NodeDetailPanel.vue'
import WorkspaceSidebar from '@/components/WorkspaceSidebar.vue'
import { useApiRequestStore, type ApiComment, type ApiConnection, type ApiNode } from '@/stores/ApiRequest'

const api = useApiRequestStore()
const authError = ref('')
const busy = ref(false)
const rootId = ref('')
const newNodeContent = ref('')
const newReply = ref('')
const replyTarget = ref<ApiComment | null>(null)
const message = ref('')
const nodeIds = ref<string[]>([])
const nodes = ref<Record<string, ApiNode>>({})
const connections = ref<ApiConnection[]>([])
const selectedId = ref('')
const replies = ref<ApiComment[]>([])

const selectedNode = computed(() => nodes.value[selectedId.value])
const visibleNodes = computed(() => nodeIds.value.map(id => nodes.value[id]).filter((node): node is ApiNode => Boolean(node)))
const outgoing = computed(() => connections.value.filter(connection => connection.startNodeId === selectedId.value))

async function submitAuth(payload: { mode: 'login' | 'register'; id: string; name: string; password: string }) {
  busy.value = true
  authError.value = ''
  try {
    if (payload.mode === 'login') await api.login(payload.id, payload.password)
    else await api.register(payload.name, payload.password)
  } catch (error) {
    authError.value = error instanceof Error ? error.message : 'Unable to continue.'
    console.error(error)
    console.trace()
  } finally { busy.value = false }
}

async function loadNode(id: string, expand = true) {
  try {
    if (!nodes.value[id]) nodes.value[id] = await api.getNode(id)
    if (!nodeIds.value.includes(id)) nodeIds.value.push(id)
    selectedId.value = id
    replies.value = await api.getReplies(nodes.value[id].comment.id)
    const next = await api.getConnections(id)
    connections.value = [...connections.value.filter(connection => connection.startNodeId !== id), ...next]
    if (expand) {
      for (const connection of next) if (!nodes.value[connection.endNodeId]) await loadNode(connection.endNodeId, false)
      selectedId.value = id
      replies.value = await api.getReplies(nodes.value[id].comment.id)
    }
  } catch (error) { message.value = error instanceof Error ? error.message : 'Could not load this node.' }
}

async function createNode(content: string) {
  if (!content) return
  try {
    const node = await api.createNode(content)
    newNodeContent.value = ''
    if (selectedId.value) await api.createConnection(selectedId.value, node.id)
    rootId.value = node.id
    await loadNode(selectedId.value || node.id)
    await loadNode(node.id, false)
  } catch (error) { message.value = error instanceof Error ? error.message : 'Could not create node.' }
}

async function submitReply(content: string) {
  if (!content.trim() || !selectedNode.value) return
  try {
    await api.createComment(content.trim(), (replyTarget.value || selectedNode.value.comment).id)
    newReply.value = ''
    replyTarget.value = null
    replies.value = await api.getReplies(selectedNode.value.comment.id)
  } catch (error) { message.value = error instanceof Error ? error.message : 'Could not add comment.' }
}

function resetWorkspace() {
  api.logout(); nodes.value = {}; nodeIds.value = []; connections.value = []; selectedId.value = ''; replies.value = []
}
</script>

<template>
  <main class="app-shell">
    <AuthScreen v-if="!api.isAuthenticated" :busy="busy" :error="authError" @submit="submitAuth" />
    <template v-else>
      <header class="topbar"><div class="brand"><span class="brand-mark">✳</span><span>node atlas</span></div><div class="top-actions"><span class="status-dot"></span><span>{{ api.user?.name }}</span><button class="icon-button" title="Sign out" @click="resetWorkspace">↪</button></div></header>
      <div class="workspace">
        <WorkspaceSidebar v-model:root-id="rootId" v-model:content="newNodeContent" :selected-id="selectedId" :message="message" @open="loadNode" @create="createNode" />
        <DirectedMap :nodes="visibleNodes" :node-ids="nodeIds" :connections="connections" :selected-id="selectedId" @select="loadNode" />
        <NodeDetailPanel v-model:content="newReply" :node="selectedNode" :node-ids="nodeIds" :selected-id="selectedId" :replies="replies" :outgoing="outgoing" :nodes="nodes" :reply-target="replyTarget" @select="loadNode" @reply="replyTarget = $event" @submit="submitReply" @cancel="replyTarget = null" />
      </div>
    </template>
  </main>
</template>
