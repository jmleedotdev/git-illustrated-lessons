<script setup lang="ts">
import { lessons } from './lessons/startRepository'
import RepositoryScene from './scenes/RepositoryScene.vue'
import LessonShell from './ui/LessonShell.vue'
</script>

<template>
  <LessonShell :lessons="lessons">
    <template #scene="{ presentation, description, replay, reducedMotion }">
      <RepositoryScene
        :presentation="presentation"
        :description="description"
        :reduced-motion="reducedMotion"
        @replay="replay"
      />
    </template>
    <template #mental-model>
      <ul>
        <li><span aria-hidden="true">✓</span> Working files stay in place.</li>
        <li><span aria-hidden="true">✓</span> The staging area starts empty.</li>
        <li><span aria-hidden="true">✓</span> History starts with zero commits.</li>
      </ul>
    </template>
  </LessonShell>
</template>
