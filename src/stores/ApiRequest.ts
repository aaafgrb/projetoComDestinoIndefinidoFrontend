import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// const apiUrl = import.meta.env.VITE_API_URL || 'https://projetocomdestinoindefinido.onrender.com'
const apiUrl = "http://localhost:7080"
export type ApiUser = { id: string; name: string }
export type ApiComment = { id: string; parentCommentId: string | null; creatorUser: ApiUser; content: string }
export type ApiNode = { id: string; comment: ApiComment; creatorUserId: string }
export type ApiConnection = { startNodeId: string; endNodeId: string; creatorUserId: string }

export const useApiRequestStore = defineStore('apiRequest', () => {
  const token = ref(localStorage.getItem('node-map-token') || '')
  const user = ref<ApiUser | null>(JSON.parse(localStorage.getItem('node-map-user') || 'null'))
  const isAuthenticated = computed(() => Boolean(token.value))

  async function request(path: string, options: RequestInit = {}): Promise<string> {
    const headers = new Headers(options.headers); headers.set('Content-Type', 'application/json')
    // console.log(token.value)
    if (token.value != null && token.value != '') headers.set('Authorization', `Bearer ${token.value}`)
    const response = await fetch(`${apiUrl}${path}`, { ...options, headers })
    if (!response.ok) throw new Error((await response.text()) || `Request failed (${response.status})`)
    if (response.status === 204) return undefined as unknown as string
    return response.text() as Promise<string>
  }
  async function login(userId: string, password: string) {
    const newToken = await request('/auth/generateToken', { method: 'POST', body: JSON.stringify({ userId, password }) })
    token.value = newToken.replace(/^"|"$/g, ''); localStorage.setItem('node-map-token', token.value)
    user.value = JSON.parse(await request(`/user/${userId}`));
    localStorage.setItem('node-map-user', JSON.stringify(user.value))
  }
  async function register(name: string, password: string) {
    const created = JSON.parse(await request('/user/', { method: 'POST', body: JSON.stringify({ name, password }) }));
    await login(created.id, password)
  }
  function logout() {
    token.value = '';
    user.value = null;
    localStorage.removeItem('node-map-token');
    localStorage.removeItem('node-map-user')
  }
  async function getNode(id: string) {
    const node: ApiNode = JSON.parse(await request(`/node/${id}`))
    return node
  }

  async function getConnections(id: string) {
    const connections: ApiConnection[] = JSON.parse(await request(`/connection/${id}`))
    return connections
  }

  async function createNode(content: string) {
    const node: ApiNode = JSON.parse(await request('/node/', { method: 'POST', body: JSON.stringify({ content }) }))
    return node
  }

  async function createConnection(startNodeId: string, endNodeId: string) {
    const connection: ApiConnection = JSON.parse(await request('/connection/', { method: 'POST', body: JSON.stringify({ startNodeId, endNodeId }) }))
    return connection
  }

  async function getReplies(commentId: string) {
    const comments: ApiComment[] = JSON.parse(await request(`/comment/${commentId}`))
    return comments
  }

  async function createComment(content: string, parentCommentId: string) {
    const comment: ApiComment = JSON.parse(await request('/comment/', { method: 'POST', body: JSON.stringify({ content, parentCommentId }) }))
    return comment
  }

  return { token, user, isAuthenticated, login, register, logout, getNode, getConnections, createNode, createConnection, getReplies, createComment }
})
