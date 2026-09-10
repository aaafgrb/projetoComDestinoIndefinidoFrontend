<script setup lang="ts">
import { useTemplateRef } from 'vue';

const props = defineProps<{
  userId: string
  userName: string
}>()

const idInput = useTemplateRef("idInput")
const nameInput = useTemplateRef("nameInput")

const deleteBtnClick = (_e: Event) => {

}

const updateBtnClick = (_e: Event) => {
  console.log(idInput.value?.value ?? "", nameInput.value?.value ?? "")
}
</script>

<template>
  <div class="user-viewer">
    id: <input ref="idInput" type="text" readonly>{{ props.userId ?? '' }}</input>
    <br>
    name: <input ref="nameInput" type="text" >{{ props.userName ?? '' }}</input>

    <button @click="deleteBtnClick">delete</button>
    <button @click="updateBtnClick">update</button>
  </div>
</template>

<style scoped>
</style>
