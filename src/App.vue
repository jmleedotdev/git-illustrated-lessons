<script setup lang="ts">
import { lessons } from './lessons/startRepository'
import RepositoryScene from './scenes/RepositoryScene.vue'
import LessonShell from './ui/LessonShell.vue'
</script>

<template>
  <LessonShell :lessons="lessons">
    <template #scene="{ presentation, description }">
      <RepositoryScene :presentation="presentation" :description="description" />
    </template>
  </LessonShell>
</template>
