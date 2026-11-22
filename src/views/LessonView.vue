<script setup lang="ts">
import { lessons } from '@/data/lessons/catalog'
import RemoteScene from '@/components/scenes/RemoteScene.vue'
import RepositoryScene from '@/components/scenes/RepositoryScene.vue'
import LessonShell from '@/components/lesson/LessonShell.vue'

defineProps<{ playOpeningStep: boolean }>()
</script>

<template>
  <LessonShell :lessons="lessons" :play-opening-step="playOpeningStep">
    <template #scene="{ finalCommitCount, presentation, description, replay, reducedMotion }">
      <RemoteScene
        v-if="presentation.state.remoteSetup"
        :presentation="presentation"
        :description="description"
        :reduced-motion="reducedMotion"
        @replay="replay"
      />
      <RepositoryScene
        v-else
        :presentation="presentation"
        :final-commit-count="finalCommitCount"
        :description="description"
        :reduced-motion="reducedMotion"
        @replay="replay"
      />
    </template>
  </LessonShell>
</template>
