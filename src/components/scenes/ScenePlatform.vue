<script setup lang="ts">
defineProps<{ fill: string }>()
</script>

<template>
  <g>
    <ellipse cx="130" cy="250" rx="125" ry="28" class="fill-rule" opacity=".4" />
    <path d="M10 201L130 143 250 201 130 259Z" :fill="fill" class="stroke-outline" />
    <path d="M10 201V220L130 278V259Z" class="fill-platform-side stroke-outline" />
    <path d="M130 259L250 201V220L130 278Z" class="fill-platform-edge stroke-outline" />
  </g>
</template>
