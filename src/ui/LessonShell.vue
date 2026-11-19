<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import type { Lesson } from '../lessons/lesson'
import { createPlayer, type Presentation } from '../player/createPlayer'
import InlineText from './InlineText.vue'

const props = defineProps<{ lessons: readonly Lesson[] }>()
defineSlots<{ scene(props: { presentation: Presentation; description: string }): unknown }>()
const player = createPlayer(props.lessons)
const { lesson, step, location, presentation, canBack, canNext, nextLesson, reducedMotion } = player
const listOpen = ref(false)
const toggle = ref<HTMLButtonElement>()
const lessonList = ref<HTMLElement>()
const guide = ref<HTMLElement>()
let restoring = false
function restore() {
  restoring = true
  player.restore(window.location.hash)
  if (window.location.hash !== player.hash.value) history.replaceState(null, '', player.hash.value)
  restoring = false
}
function closeLessons() {
  listOpen.value = false
  void nextTick(() => toggle.value?.focus())
}
function openLesson(slug: string) {
  player.openLesson(slug)
  closeLessons()
}
async function toggleLessons() {
  if (listOpen.value) return closeLessons()
  listOpen.value = true
  await nextTick()
  lessonList.value?.querySelector('button')?.focus()
}
function keyboard(event: KeyboardEvent) {
  if (event.key === 'Escape' && listOpen.value) {
    event.preventDefault()
    closeLessons()
    return
  }
  if (listOpen.value || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
  if (
    event.target instanceof HTMLElement &&
    event.target.closest('input, textarea, select, [contenteditable]')
  )
    return
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    player.next()
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    player.back()
  }
}
restore()
watch(
  player.hash,
  (hash) => {
    if (guide.value && !guide.value.contains(document.activeElement)) guide.value.scrollTop = 0
    if (!restoring && window.location.hash !== hash) history.pushState(null, '', hash)
  },
  { flush: 'sync' },
)
let media: MediaQueryList | undefined
function motionChanged() {
  player.setReducedMotion(media?.matches ?? false)
}
onMounted(() => {
  media = window.matchMedia('(prefers-reduced-motion: reduce)')
  motionChanged()
  window.addEventListener('hashchange', restore)
  window.addEventListener('popstate', restore)
  window.addEventListener('keydown', keyboard)
  media.addEventListener('change', motionChanged)
})
onUnmounted(() => {
  window.removeEventListener('hashchange', restore)
  window.removeEventListener('popstate', restore)
  window.removeEventListener('keydown', keyboard)
  media?.removeEventListener('change', motionChanged)
})
</script>

<template>
  <div class="lesson-app mx-auto max-w-[1672px] px-inset md:px-section">
    <header class="lesson-header flex items-center gap-inset border-b border-rule py-3">
      <span class="font-bold">Git, illustrated</span>
      <button
        ref="toggle"
        type="button"
        class="lessons-toggle ml-auto"
        aria-controls="lesson-list"
        :aria-expanded="listOpen"
        @click="toggleLessons"
      >
        {{ listOpen ? 'Close' : 'Lessons' }}
      </button>
    </header>
    <nav
      v-show="listOpen"
      id="lesson-list"
      ref="lessonList"
      aria-label="Lessons"
      class="paper-sheet my-inset space-y-inset"
    >
      <h2>Lessons</h2>
      <button
        v-for="item in lessons"
        :key="item.slug"
        type="button"
        class="control"
        @click="openLesson(item.slug)"
      >
        {{ item.title }}
      </button>
    </nav>
    <main class="lesson-layout">
      <section class="lesson-canvas paper-sheet" aria-labelledby="lesson-title">
        <div class="flex flex-wrap items-center justify-between gap-2 text-label text-muted">
          <span>Lessons / {{ lesson.topic }}</span>
          <ul class="flex flex-wrap gap-2" aria-label="Lesson details">
            <li class="lesson-detail">{{ lesson.duration }}</li>
            <li class="lesson-detail">{{ lesson.difficulty }}</li>
            <li class="lesson-detail">{{ lesson.steps.length }} steps</li>
          </ul>
        </div>
        <h1 id="lesson-title" class="lesson-title mt-3">{{ lesson.title }}</h1>
        <slot name="scene" :presentation="presentation" :description="step.change" />
        <div class="scene-controls flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="Explanation steps" class="flex flex-wrap gap-2">
            <button
              v-for="(item, index) in lesson.steps"
              :key="item.label"
              type="button"
              :aria-label="`Step ${index + 1}: ${item.label}`"
              :aria-current="location.step === index + 1 ? 'step' : undefined"
              :class="['control', { 'control-primary': location.step === index + 1 }]"
              @click="player.select(index + 1)"
            >
              {{ index + 1 }}
            </button>
          </nav>
          <div>
            <button
              type="button"
              class="control"
              :disabled="reducedMotion"
              :aria-describedby="reducedMotion ? 'motion-reason' : undefined"
              @click="player.replay"
            >
              Replay
            </button>
            <p v-if="reducedMotion" id="motion-reason" class="text-label mt-2">
              Unavailable with reduced motion.
            </p>
          </div>
        </div>
      </section>
      <section ref="guide" class="lesson-guide" aria-labelledby="step-title">
        <p role="status" aria-live="polite" aria-atomic="true" class="eyebrow">
          Step {{ location.step }} of {{ lesson.steps.length }} · {{ step.label }}
        </p>
        <h2 id="step-title" class="mt-3">{{ step.title }}</h2>
        <div class="my-layout">
          <pre
            v-if="step.action.kind === 'command'"
            class="command-block"
            aria-label="Git command"
          ><code>{{ step.action.text }}</code></pre>
          <div v-else class="border-l-2 border-git pl-inset">
            <h3 class="eyebrow">In Alice’s editor</h3>
            <p class="story-text mt-2"><InlineText :text="step.action.text" /></p>
          </div>
        </div>
        <p class="story-text"><InlineText :text="step.story" /></p>
        <aside class="key-idea my-layout">
          <h3>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              class="shrink-0"
            >
              <path d="M9 18h6M10 21h4M9 15c0-2-3-3-3-7a6 6 0 0 1 12 0c0 4-3 5-3 7v1H9z" />
            </svg>
            Key idea
          </h3>
          <p class="story-text"><InlineText :text="step.idea" /></p>
        </aside>
        <nav
          class="step-navigation mt-layout flex justify-between gap-inset"
          aria-label="Walkthrough"
        >
          <button type="button" class="control" :disabled="!canBack" @click="player.back">
            Back
          </button>
          <button
            type="button"
            class="control control-primary"
            :disabled="!canNext"
            @click="player.next"
          >
            Next
          </button>
        </nav>
        <button
          v-if="!canNext && nextLesson"
          type="button"
          class="control mt-layout"
          @click="player.openNextLesson"
        >
          Next lesson: {{ nextLesson.title }}
        </button>
        <p class="mt-inset text-label text-muted">Use ← or → to change steps.</p>
        <details class="mt-layout text-label">
          <summary class="prerequisite-toggle">Before you begin</summary>
          <p class="mt-2">
            To follow along on your own, install Git and configure your commit identity. Later
            lessons also assume a GitHub account with working HTTPS authentication.
          </p>
        </details>
      </section>
    </main>
  </div>
</template>
