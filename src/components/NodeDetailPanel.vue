<script setup lang="ts">
import type { ApiComment, ApiConnection, ApiNode } from '@/stores/ApiRequest'

type DisplayComment = ApiComment & { depth: number }
const props = defineProps<{ node?: ApiNode; isPreview: boolean; nodeIds: string[]; selectedId: string; replies: DisplayComment[]; outgoing: ApiConnection[]; nodes: Record<string, ApiNode>; replyTarget?: ApiComment | null }>()
const emit = defineEmits<{ move: []; reply: [comment: ApiComment]; submit: [content: string]; cancel: [] }>()
const content = defineModel<string>('content', { default: '' })
</script>

<template>
  <aside class="detail-panel">
    <div v-if="props.node">
      <span class="eyebrow">{{ isPreview ? 'NODE PREVIEW' : 'CURRENT NODE' }}</span>
      <div class="detail-title"><span class="node-index">0{{ nodeIds.indexOf(selectedId) + 1 }}</span><h2>Conversation</h2></div>
      <p class="node-id">{{ selectedId }}</p>
      <div class="root-comment"><p>{{ props.node.comment.content }}</p><small>{{ props.node.comment.creatorUser?.name || 'Unknown author' }}</small></div>
      <button v-if="isPreview" class="primary wide preview-action" @click="emit('move')">Move here <span>→</span></button>
      <div class="reply-head"><span>Replies</span><span class="reply-count">{{ replies.length }}</span></div>
      <div v-if="!replies.length" class="muted small-copy">No replies yet. Add the first layer.</div>
      <div v-for="reply in replies" :key="reply.id" class="reply" :style="{ marginLeft: `${reply.depth * 14}px` }"><strong>{{ reply.creatorUser?.name || 'Unknown' }}</strong><p>{{ reply.content }}</p><button v-if="!isPreview" @click="emit('reply', reply)">Reply</button></div>
      <div v-if="!isPreview" class="reply-box"><textarea v-model="content" :placeholder="replyTarget ? `Reply to ${replyTarget.creatorUser?.name}…` : 'Add a comment…'" rows="3"></textarea><div><button v-if="replyTarget" class="text-button" @click="emit('cancel')">Cancel</button><button class="primary" :disabled="!content.trim()" @click="emit('submit', content)">Post reply ↗</button></div></div>
      <div v-if="outgoing.length" class="outgoing"><span class="eyebrow">NEXT DIRECTIONS</span><button v-for="edge in outgoing" :key="edge.endNodeId">{{ nodes[edge.endNodeId]?.comment.content || edge.endNodeId }} <span>→</span></button></div>
    </div>
    <div v-else class="detail-empty"><span>◌</span><p>Select a node to inspect its conversation.</p></div>
  </aside>
</template>
