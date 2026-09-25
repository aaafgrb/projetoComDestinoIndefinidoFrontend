<script setup lang="ts">
import type { ApiComment, ApiConnection, ApiNode } from '@/stores/ApiRequest'

const props = defineProps<{ node?: ApiNode; nodeIds: string[]; selectedId: string; replies: ApiComment[]; outgoing: ApiConnection[]; nodes: Record<string, ApiNode>; replyTarget?: ApiComment | null }>()
const emit = defineEmits<{ select: [id: string]; reply: [comment: ApiComment]; submit: [content: string]; cancel: [] }>()
const content = defineModel<string>('content', { default: '' })
</script>

<template>
  <aside class="detail-panel"><div v-if="props.node"><span class="eyebrow">SELECTED NODE</span><div class="detail-title"><span class="node-index">0{{ nodeIds.indexOf(selectedId) + 1 }}</span><h2>Conversation</h2></div><p class="node-id">{{ selectedId }}</p><div class="root-comment"><p>{{ props.node.comment.content }}</p><small>{{ props.node.comment.creatorUser?.name || 'Unknown author' }}</small></div><div class="reply-head"><span>Replies</span><span class="reply-count">{{ replies.length }}</span></div><div v-if="!replies.length" class="muted small-copy">No replies yet. Add the first layer.</div><div v-for="reply in replies" :key="reply.id" class="reply"><strong>{{ reply.creatorUser?.name || 'Unknown' }}</strong><p>{{ reply.content }}</p><button @click="emit('reply', reply)">Reply</button></div><div class="reply-box"><textarea v-model="content" :placeholder="replyTarget ? `Reply to ${replyTarget.creatorUser?.name}…` : 'Add a comment…'" rows="3"></textarea><div><button v-if="replyTarget" class="text-button" @click="emit('cancel')">Cancel</button><button class="primary" :disabled="!content.trim()" @click="emit('submit', content)">Post reply ↗</button></div></div><div v-if="outgoing.length" class="outgoing"><span class="eyebrow">NEXT DIRECTIONS</span><button v-for="edge in outgoing" :key="edge.endNodeId" @click="emit('select', edge.endNodeId)">{{ nodes[edge.endNodeId]?.comment.content || edge.endNodeId }} <span>→</span></button></div></div><div v-else class="detail-empty"><span>◌</span><p>Select a node to inspect its conversation.</p></div></aside>
</template>
