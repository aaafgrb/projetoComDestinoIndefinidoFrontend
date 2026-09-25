<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ startIndex: number; endIndex: number }>()

function point(index: number) {
  return { x: 8 + (index % 3) * 31 + 10, y: 12 + Math.floor(index / 3) * 42 + 9 }
}

const style = computed(() => {
  const start = point(props.startIndex)
  const end = point(props.endIndex)
  const x = end.x - start.x
  const y = end.y - start.y
  return {
    left: `${start.x}%`,
    top: `${start.y}%`,
    width: `${Math.sqrt(x * x + y * y)}%`,
    transform: `rotate(${Math.atan2(y, x) * 180 / Math.PI}deg)`,
  }
})
</script>

<template><div class="map-connection" :style="style" aria-hidden="true"></div></template>
