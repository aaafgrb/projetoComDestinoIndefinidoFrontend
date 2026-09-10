<script setup lang="ts">
import { ref } from 'vue';
import UserViewer from './components/UserViewer.vue';
import UserController from './components/UserController.vue';

const loadedUserId = ref("")
const loadedUserName = ref("")

</script>

<template>
  <h4>projetoComDestinoIndefinidoFrontend</h4>
  <UserController></UserController>
  <UserViewer :userId="loadedUserId" :userName="loadedUserName" />
</template>

<style scoped>
</style>
