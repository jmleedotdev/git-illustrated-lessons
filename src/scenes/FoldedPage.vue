<script setup lang="ts">
defineProps<{ version?: string }>()
</script>

<template>
  <g stroke-width="2">
    <ellipse cx="145" cy="229" rx="36" ry="6" class="fill-ground-shadow" />
    <path d="M98 72h64l24 24v111H98Z" transform="translate(3 4)" class="fill-outline" />
    <path d="M98 72h64l24 24v111H98Z" class="fill-sheet stroke-outline" />
    <path d="M162 72v24h24M115 121h52m-52 14h42m-42 14h47" class="fill-none stroke-outline" />
    <text
      v-if="version"
      x="142"
      y="185"
      text-anchor="middle"
      class="fill-ink text-heading font-bold"
    >
      {{ version }}
    </text>
  </g>
</template>
