<script setup lang="ts">
import { useApiRequestStore } from '@/stores/ApiRequest';
import { useTemplateRef } from 'vue';

const emit = defineEmits(['change'])

const props = defineProps<{
  userId: string
  userName: string
}>()

const idInput = useTemplateRef("idInput")
const nameInput = useTemplateRef("nameInput")

const apiRequestStore = useApiRequestStore()
const userApiPath = "/user/"

const deleteBtnClick = (_e: Event) => {
  if (!idInput.value?.value) return;
  apiRequestStore.deleteRequest(`${userApiPath}${idInput.value.value}`).then(e => emit('change', e))
}

const updateBtnClick = (_e: Event) => {
  if (!nameInput.value?.value || !idInput.value?.value) return;
  apiRequestStore.putRequest(`${userApiPath}${idInput.value.value}`, { name: nameInput.value.value }).then(e => emit('change', e))
}
</script>

<template>
  <div class="user-viewer">
    id: <input ref="idInput" type="text" :value="props.userId" readonly></input>
    <br>
    name: <input ref="nameInput" type="text" :value="props.userName"></input>

    <button @click="deleteBtnClick">delete</button>
    <button @click="updateBtnClick">update</button>
  </div>
</template>

<style scoped></style>
