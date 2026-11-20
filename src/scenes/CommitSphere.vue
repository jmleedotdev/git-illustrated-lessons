<script setup lang="ts">
import type { Commit } from '../lessons/lesson'

defineProps<{ commit: Commit; current: boolean; labelOffset?: number }>()
</script>

<template>
  <!-- The clip is shared by all spheres in this scene. Geometry is from revised A. -->
  <g class="fill-charcoal" text-anchor="middle">
    <ellipse cx="5" cy="49" rx="31" ry="6" class="fill-ground-shadow" />
    <circle r="42" :class="current ? 'fill-commit-current' : 'fill-commit-past'" />
    <path
      d="M20-45C36-12 20 26-29 40L-29 60H60V-45Z"
      clip-path="url(#repository-commit-clip)"
      :class="current ? 'fill-commit-current-shade' : 'fill-commit-past-shade'"
    />
    <circle r="42" fill="none" class="stroke-charcoal" stroke-width="3" />
    <path
      d="M-28-12Q-25-27-11-30"
      fill="none"
      class="stroke-commit-highlight"
      stroke-width="5"
      stroke-linecap="round"
    />
    <text y="8" class="commit-id font-bold" font-size="22">{{ commit.id }}</text>
    <text
      v-for="(file, index) in commit.snapshot"
      :key="file.name"
      :x="labelOffset"
      :y="80 + index * 21"
      class="snapshot-label"
      font-size="17"
    >
      {{ file.name }}{{ file.version ? ' · ' + file.version : '' }}
    </text>
    <text v-if="!commit.parents.length" y="125" class="snapshot-label" font-size="17"
      >Root · no parent</text
    >
  </g>
</template>
