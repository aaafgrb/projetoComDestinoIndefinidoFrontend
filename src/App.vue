<script setup lang="ts">
import { ref } from 'vue';
import UserViewer from './components/UserViewer.vue';
import UserController from './components/UserController.vue';

const loadedUserId = ref("")
const loadedUserName = ref("")

function setLoadedUser(e: any) {
  console.log(e)
  loadedUserId.value = e?.id ?? ""
  loadedUserName.value = e?.name ?? ""
}

</script>

<template>
  <h4>projetoComDestinoIndefinidoFrontend</h4>
  <UserController @change="setLoadedUser"></UserController>
  <UserViewer @change="setLoadedUser" :userId="loadedUserId" :userName="loadedUserName" />
</template>

<style scoped>
</style>
