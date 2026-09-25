<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ busy: boolean; error: string }>()
const emit = defineEmits<{ submit: [payload: { mode: 'login' | 'register'; id: string; name: string; password: string }] }>()
const mode = ref<'login' | 'register'>('login')
const id = ref('')
const name = ref('')
const password = ref('')

function submit() {
  emit('submit', { mode: mode.value, id: id.value.trim(), name: name.value.trim(), password: password.value })
}
</script>

<template>
  <section class="auth-screen">
    <div class="auth-art">
      <span class="eyebrow">NODE ATLAS</span>
      <h1>Think in<br><em>directions.</em></h1>
      <p>Build a living map of ideas, decisions, and the conversations that connect them.</p>
      <div class="art-nodes"><i></i><i></i><i></i><b></b><b></b></div>
    </div>
    <form class="auth-card" @submit.prevent="submit">
      <span class="eyebrow">WELCOME</span>
      <h2>{{ mode === 'login' ? 'Return to your map' : 'Create your atlas' }}</h2>
      <p class="muted">{{ mode === 'login' ? 'Sign in to continue exploring.' : 'Start capturing ideas in connected form.' }}</p>
      <label v-if="mode === 'login'">User ID<input v-model="id" placeholder="Your UUID" required></label>
      <label v-else>Your name<input v-model="name" placeholder="Ada Lovelace" required></label>
      <label>Password<input v-model="password" type="password" placeholder="••••••••" required minlength="4"></label>
      <p v-if="error" class="error">{{ error }}</p>
      <button class="primary wide" :disabled="busy">{{ busy ? 'Please wait…' : mode === 'login' ? 'Enter workspace' : 'Create account' }} <span>↗</span></button>
      <button type="button" class="text-button" @click="mode = mode === 'login' ? 'register' : 'login'">{{ mode === 'login' ? 'New here? Create an account' : 'Already have an account? Sign in' }}</button>
    </form>
  </section>
</template>
