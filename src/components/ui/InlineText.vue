<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ text: string }>()
const parts = computed(() => props.text.split(/(`[^`]+`)/g))
</script>
<template>
  <template v-for="(part, index) in parts" :key="index">
    <code v-if="index % 2 === 1">{{ part.slice(1, -1) }}</code>
    <template v-else>{{ part }}</template>
  </template>
</template>
