<script setup lang="ts">
import { lessons } from './lessons/catalog'
import RepositoryScene from './scenes/RepositoryScene.vue'
import LessonShell from './ui/LessonShell.vue'
</script>

<template>
  <LessonShell :lessons="lessons">
    <template #scene="{ finalCommitCount, presentation, description, replay, reducedMotion }">
      <RepositoryScene
        :presentation="presentation"
        :final-commit-count="finalCommitCount"
        :description="description"
        :reduced-motion="reducedMotion"
        @replay="replay"
      />
    </template>
  </LessonShell>
</template>
