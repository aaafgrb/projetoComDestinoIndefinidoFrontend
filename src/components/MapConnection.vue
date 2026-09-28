<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ startX: number; startY: number; endX: number; endY: number }>()

const style = computed(() => {
  const x = props.endX - props.startX
  const y = props.endY - props.startY
  return {
    left: `${props.startX}%`,
    top: `${props.startY}%`,
    width: `${Math.sqrt(x * x + y * y)}%`,
    transform: `rotate(${Math.atan2(y, x) * 180 / Math.PI}deg)`,
  }
})
</script>

<template><div class="map-connection" :style="style" aria-hidden="true"></div></template>
