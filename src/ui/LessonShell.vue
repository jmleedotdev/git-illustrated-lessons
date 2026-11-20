<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import type { Lesson } from '../lessons/lesson'
import { createPlayer, type Presentation } from '../player/createPlayer'
import InlineText from './InlineText.vue'

const props = defineProps<{ lessons: readonly Lesson[] }>()
defineSlots<{
  scene(props: {
    presentation: Presentation
    description: string
    replay: () => void
    reducedMotion: boolean
  }): unknown
}>()
const player = createPlayer(props.lessons)
const { lesson, step, location, presentation, canBack, canNext, nextLesson, reducedMotion } = player
const listOpen = ref(false)
const toggle = ref<HTMLButtonElement>()
const lessonList = ref<HTMLElement>()
const guideContent = ref<HTMLElement>()
const lessonHeading = ref<HTMLHeadingElement>()
const navigation = ref<HTMLElement>()
let restoring = false
function formatLessonNumber(index: number) {
  return String(index + 1).padStart(2, '0')
}
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
function modifiedClick(event: MouseEvent) {
  return event.altKey || event.ctrlKey || event.metaKey || event.shiftKey
}
function openLesson(event: MouseEvent, slug: string) {
  if (modifiedClick(event)) return
  event.preventDefault()
  player.openLesson(slug)
  closeLessons()
}
async function openNextLesson(event: MouseEvent) {
  if (modifiedClick(event)) return
  event.preventDefault()
  player.openNextLesson()
  await nextTick()
  lessonHeading.value?.focus()
}
async function toggleLessons() {
  if (listOpen.value) return closeLessons()
  listOpen.value = true
  await nextTick()
  lessonList.value?.querySelector('a')?.focus()
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
function revealFocusedControl(event: FocusEvent) {
  const target = event.target
  const bar = navigation.value
  if (!(target instanceof HTMLElement) || !bar || bar.contains(target)) return
  if (getComputedStyle(bar).position !== 'fixed') return

  requestAnimationFrame(() => {
    if (target !== document.activeElement) return
    if (target.getBoundingClientRect().bottom + 8 >= bar.getBoundingClientRect().top) {
      target.scrollIntoView({ block: 'center' })
    }
  })
}
restore()
watch(
  player.hash,
  (hash) => {
    if (guideContent.value && !guideContent.value.contains(document.activeElement)) {
      guideContent.value.scrollTop = 0
    }
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
  <div class="lesson-app">
    <header class="lesson-header flex items-center">
      <span class="lesson-brand font-bold"><span aria-hidden="true">⌘</span> Git, illustrated</span>
      <span class="lesson-section">Learn / {{ lesson.topic }}</span>
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
      class="lesson-list space-y-inset"
    >
      <p class="eyebrow">The local repository</p>
      <ul>
        <li v-for="(item, index) in lessons" :key="item.slug">
          <a
            :href="`#/${item.slug}/1`"
            :aria-current="item.slug === lesson.slug ? 'page' : undefined"
            @click="openLesson($event, item.slug)"
          >
            {{ formatLessonNumber(index) }} {{ item.title }}
          </a>
        </li>
      </ul>
    </nav>
    <main class="lesson-layout" @focusin="revealFocusedControl">
      <section class="lesson-canvas paper-sheet" aria-labelledby="lesson-title">
        <div class="lesson-heading">
          <div class="lesson-topline flex flex-wrap items-center justify-between">
            <span class="eyebrow"
              >{{ lesson.topic }} / {{ formatLessonNumber(lessons.indexOf(lesson)) }}</span
            >
            <ul class="lesson-metadata flex flex-wrap" aria-label="Lesson details">
              <li class="lesson-pill">{{ lesson.duration }}</li>
              <li class="lesson-pill">{{ lesson.difficulty }}</li>
              <li class="lesson-pill">{{ lesson.steps.length }} steps</li>
            </ul>
          </div>
          <h1 id="lesson-title" ref="lessonHeading" tabindex="-1">{{ lesson.title }}</h1>
        </div>
        <slot
          name="scene"
          :presentation="presentation"
          :description="step.change"
          :replay="player.replay"
          :reduced-motion="reducedMotion"
        />
        <nav aria-label="Explanation steps" class="lesson-timeline">
          <button
            v-for="(item, index) in lesson.steps"
            :key="item.label"
            type="button"
            :aria-label="`Step ${index + 1}: ${item.label}`"
            :aria-current="location.step === index + 1 ? 'step' : undefined"
            @click="player.select(index + 1)"
          >
            <span class="timeline-number">{{ index + 1 }}</span>
            <span>{{ item.label }}</span>
          </button>
        </nav>
      </section>

      <div class="lesson-rail">
        <section class="lesson-guide" aria-labelledby="step-title">
          <div class="guide-meta" role="status" aria-live="polite" aria-atomic="true">
            <span class="guide-tag">{{ step.label }}</span>
            <span
              ><span class="sr-only">Step {{ location.step }} of {{ lesson.steps.length }}</span
              ><span aria-hidden="true">{{ location.step }} / {{ lesson.steps.length }}</span></span
            >
          </div>
          <div ref="guideContent" class="guide-content">
            <h2 id="step-title">{{ step.title }}</h2>
            <pre
              v-if="step.action.kind === 'command'"
              class="command-block"
              aria-label="Git command"
            ><code>{{ step.action.text }}</code></pre>
            <div v-else class="editor-action">
              <h3 class="eyebrow">In Alice’s editor</h3>
              <p class="story-text"><InlineText :text="step.action.text" /></p>
            </div>
            <p class="story-text"><InlineText :text="step.story" /></p>
            <aside class="key-idea guide-idea">
              <h3>
                <svg
                  width="15"
                  height="15"
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
            <div class="guide-change">
              <h3 class="eyebrow">What changed</h3>
              <p class="story-text"><InlineText :text="step.change" /></p>
            </div>
            <details class="text-label">
              <summary class="prerequisite-toggle">Before you begin</summary>
              <p class="mt-2">
                To follow along on your own, install Git and configure your commit identity. Later
                lessons also assume a GitHub account with working HTTPS authentication.
              </p>
            </details>
          </div>
          <nav ref="navigation" class="step-navigation" aria-label="Walkthrough">
            <button
              type="button"
              class="control"
              aria-label="Back"
              :disabled="!canBack"
              @click="player.back"
            >
              <span aria-hidden="true">←</span> Back
            </button>
            <button
              type="button"
              class="control control-primary"
              aria-label="Next"
              :disabled="!canNext"
              @click="player.next"
            >
              Next <span aria-hidden="true">→</span>
            </button>
          </nav>
          <a
            v-if="!canNext && nextLesson"
            :href="`#/${nextLesson.slug}/1`"
            class="control mt-2"
            @click="openNextLesson"
          >
            Next lesson: {{ nextLesson.title }}
          </a>
          <small class="keyboard-hint">Select a step to jump · ← → to navigate</small>
        </section>
        <aside class="mental-model" aria-labelledby="mental-model-title">
          <h2 id="mental-model-title" class="eyebrow">The mental model</h2>
          <ul>
            <li v-for="idea in lesson.mentalModel" :key="idea">
              <span aria-hidden="true">✓</span> <InlineText :text="idea" />
            </li>
          </ul>
        </aside>
      </div>
    </main>
  </div>
</template>
