<script setup lang="ts">
import { useTemplateRef } from 'vue';


const idInput = useTemplateRef("idInput");
const nameInput = useTemplateRef("nameInput");


const getBtnClick = (_e: Event) => {

}

const createBtnClick = (_e: Event) => {

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

<style scoped>
</style>
