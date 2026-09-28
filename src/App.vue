<script setup lang="ts">
import { computed, ref } from 'vue'
import AuthScreen from '@/components/AuthScreen.vue'
import DirectedMap from '@/components/DirectedMap.vue'
import NodeDetailPanel from '@/components/NodeDetailPanel.vue'
import WorkspaceSidebar from '@/components/WorkspaceSidebar.vue'
import { useApiRequestStore, type ApiComment, type ApiConnection, type ApiNode } from '@/stores/ApiRequest'

type VisibleComment = ApiComment & { depth: number }

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
const currentId = ref('')
const previewId = ref('')
const replies = ref<VisibleComment[]>([])
const previewReplies = ref<VisibleComment[]>([])

const currentNode = computed(() => nodes.value[currentId.value])
const previewNode = computed(() => nodes.value[previewId.value])
const displayedNode = computed(() => previewNode.value || currentNode.value)
const displayedReplies = computed(() => previewNode.value ? previewReplies.value : replies.value)
const previousNodes = computed(() => nodeIds.value
  .filter(id => id !== currentId.value && connections.value.some(connection => connection.endNodeId === currentId.value && connection.startNodeId === id))
  .map(id => nodes.value[id])
  .filter((node): node is ApiNode => Boolean(node)))
const nextNodes = computed(() => connections.value
  .filter(connection => connection.startNodeId === currentId.value)
  .map(connection => nodes.value[connection.endNodeId])
  .filter((node): node is ApiNode => Boolean(node)))
const displayedOutgoing = computed(() => connections.value.filter(connection => connection.startNodeId === (previewId.value || currentId.value)))

async function submitAuth(payload: { mode: 'login' | 'register'; id: string; name: string; password: string }) {
  busy.value = true
  authError.value = ''
  try {
    if (payload.mode === 'login') await api.login(payload.id, payload.password)
    else await api.register(payload.name, payload.password)
  } catch (error) {
    authError.value = error instanceof Error ? error.message : 'Unable to continue.'
  } finally {
    busy.value = false
  }
}

async function loadCommentTree(parentId: string, depth = 0): Promise<VisibleComment[]> {
  const children = await api.getReplies(parentId)
  const result: VisibleComment[] = []
  for (const child of children) {
    result.push({ ...child, depth })
    result.push(...await loadCommentTree(child.id, depth + 1))
  }
  return result
}

async function refreshReplies() {
  if (currentNode.value) replies.value = await loadCommentTree(currentNode.value.comment.id)
}

async function refreshCurrent() {
  if (!currentId.value) return
  const next = await api.getConnections(currentId.value)
  connections.value = [...connections.value.filter(connection => connection.startNodeId !== currentId.value), ...next]
  for (const connection of next) {
    if (!nodes.value[connection.endNodeId]) nodes.value[connection.endNodeId] = await api.getNode(connection.endNodeId)
    if (!nodeIds.value.includes(connection.endNodeId)) nodeIds.value.push(connection.endNodeId)
  }
  await refreshReplies()
}

async function moveToNode(id: string) {
  if (!id) return
  try {
    if (!nodes.value[id]) nodes.value[id] = await api.getNode(id)
    if (!nodeIds.value.includes(id)) nodeIds.value.push(id)
    currentId.value = id
    previewId.value = ''
    previewReplies.value = []
    replyTarget.value = null
    await refreshCurrent()
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'Could not load this node.'
  }
}

async function previewNodeDetails(id: string) {
  if (id === currentId.value) return
  previewId.value = id
  try {
    const node = nodes.value[id]
    if (!node) return
    previewReplies.value = await loadCommentTree(node.comment.id)
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'Could not load this conversation.'
  }
}

async function createNode(content: string) {
  try {
    const node = await api.createNode(content)
    nodes.value[node.id] = node
    nodeIds.value.push(node.id)
    if (currentId.value) {
      await api.createConnection(currentId.value, node.id)
      await refreshCurrent()
    } else {
      await moveToNode(node.id)
    }
    rootId.value = node.id
    newNodeContent.value = ''
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'Could not create node.'
  }
}

async function connectToNode(id: string) {
  if (!currentId.value || !id.trim()) return
  try {
    await api.createConnection(currentId.value, id.trim())
    await refreshCurrent()
    message.value = 'Connection added.'
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'Could not create connection.'
  }
}

async function submitReply(content: string) {
  if (!content.trim() || !currentNode.value) return
  try {
    await api.createComment(content.trim(), (replyTarget.value || currentNode.value.comment).id)
    newReply.value = ''
    replyTarget.value = null
    await refreshReplies()
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'Could not add comment.'
  }
}

function resetWorkspace() {
  api.logout()
  nodes.value = {}
  nodeIds.value = []
  connections.value = []
  currentId.value = ''
  previewId.value = ''
  replies.value = []
  previewReplies.value = []
}
</script>

<template>
  <main class="app-shell">
    <AuthScreen v-if="!api.isAuthenticated" :busy="busy" :error="authError" @submit="submitAuth" />
    <template v-else>
      <header class="topbar">
        <div class="brand"><span class="brand-mark">✳</span><span>node atlas</span></div>
        <div class="top-actions"><span class="status-dot"></span><span>{{ api.user?.name }}</span><button class="icon-button" title="Sign out" @click="resetWorkspace">↪</button></div>
      </header>
      <div class="workspace">
        <WorkspaceSidebar v-model:root-id="rootId" v-model:content="newNodeContent" :selected-id="currentId" :message="message" @open="moveToNode" @create="createNode" @connect="connectToNode" />
        <DirectedMap :previous-nodes="previousNodes" :current-node="currentNode" :next-nodes="nextNodes" :connections="connections" :current-id="currentId" @preview="previewNodeDetails" />
        <NodeDetailPanel v-model:content="newReply" :node="displayedNode" :is-preview="Boolean(previewNode)" :node-ids="nodeIds" :selected-id="previewId || currentId" :replies="displayedReplies" :outgoing="displayedOutgoing" :nodes="nodes" :reply-target="replyTarget" @move="moveToNode(previewId)" @reply="replyTarget = $event" @submit="submitReply" @cancel="replyTarget = null" />
      </div>
    </template>
  </main>
</template>
