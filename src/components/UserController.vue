<script setup lang="ts">
import { useApiRequestStore } from '@/stores/ApiRequest';
import { useTemplateRef } from 'vue';

const emit = defineEmits(['change'])

const idInput = useTemplateRef("idInput");
const nameInput = useTemplateRef("nameInput");

const apiRequestStore = useApiRequestStore()
const userApiPath = "/user/"

const getBtnClick = (_e: Event) => {
  if (!idInput.value?.value) return;
  apiRequestStore.getRequest(`${userApiPath}${idInput.value.value}`).then(e => emit('change', e))
}

const createBtnClick = (_e: Event) => {
  if (!nameInput.value?.value) return;
  apiRequestStore.postRequest(`${userApiPath}`, { name: nameInput.value.value }).then(e => emit('change', e))
}
</script>

<template>
  <div class="user-viewer">
    id: <input type="text" ref="idInput"></input>
    <button @click="getBtnClick">get</button>

    <hr>
    name: <input type="text" ref="nameInput"></input>
    <button @click="createBtnClick">create</button>
    <hr>
  </div>
</template>

<style scoped></style>
