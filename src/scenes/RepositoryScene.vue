<script setup lang="ts">
import { computed, nextTick, shallowRef, ref, watch } from 'vue'
import type { RepositoryState } from '../lessons/lesson'
import type { Presentation } from '../player/createPlayer'
import InlineText from '../ui/InlineText.vue'
import FoldedPage from './FoldedPage.vue'
import ScenePlatform from './ScenePlatform.vue'

const props = defineProps<{
  presentation: Presentation
  description: string
  reducedMotion: boolean
}>()
defineEmits<{ replay: [] }>()
const stage = ref<HTMLElement>()
const fileGraphic = ref<SVGGElement>()
const before = shallowRef<RepositoryState>()
const busy = ref(false)
const inspectionPaused = ref(false)
const inspecting = computed(() => props.presentation.kind === 'inspect')
const state = computed(() => before.value ?? props.presentation.state)
const file = computed(() => state.value.working[0])
const zones = computed(() => describeZones(state.value))

function gitStatus(state: RepositoryState) {
  return state.initialized ? `HEAD → ${state.head}` : 'Git not initialized'
}

function describeZones(state: RepositoryState) {
  const [file] = state.working
  return [
    {
      name: 'Working directory',
      fill: 'var(--color-peach)',
      fileName: file?.name,
      caption: file?.status === 'untracked' ? 'Untracked' : 'Existing file',
    },
    {
      name: 'Staging area',
      fill: 'var(--color-slate)',
      caption: state.initialized ? 'Empty' : 'Not set up yet',
    },
    { name: 'Recorded history', fill: 'var(--color-terracotta)', caption: 'No commits' },
  ]
}

watch(
  () => props.presentation,
  async ({ transition }, _, onCleanup) => {
    before.value = undefined
    busy.value = false
    inspectionPaused.value = false
    if (!transition || inspecting.value) return

    let animations: Animation[] = []
    let cancelled = false
    onCleanup(() => {
      cancelled = true
      animations.forEach((animation) => animation.cancel())
    })

    async function play(targets: Element[], frames: Keyframe[], duration: number) {
      animations = targets
        .filter((target) => typeof target.animate === 'function')
        .map((target) => target.animate(frames, { duration, easing: 'ease-in-out' }))
      await Promise.allSettled(animations.map((animation) => animation.finished))
    }

    busy.value = true
    before.value = transition.before
    await nextTick()
    if (cancelled) return

    const afterZones = describeZones(transition.after)
    const changedCaptions = zones.value
      .filter((zone, index) => zone.caption !== afterZones[index]?.caption)
      .map((zone) => zone.name)
    if (gitStatus(transition.before) !== gitStatus(transition.after)) changedCaptions.push('git')
    const changingLabels = Array.from(
      stage.value?.querySelectorAll('[data-scene-caption]') ?? [],
    ).filter((label) => changedCaptions.includes(label.getAttribute('data-scene-caption') ?? ''))

    if (changingLabels.length) {
      await play(changingLabels, [{ opacity: 1 }, { opacity: 0.15 }], 430)
      if (cancelled) return
      before.value = undefined
      await nextTick()
      if (cancelled) return
      await play(
        changingLabels,
        [
          { opacity: 0, transform: 'translateY(-12px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        600,
      )
    } else if (fileGraphic.value) {
      await play(
        [fileGraphic.value],
        [
          { opacity: 0.25, transform: 'translateY(18px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        650,
      )
    }

    if (!cancelled) {
      before.value = undefined
      busy.value = false
    }
  },
  { flush: 'post' },
)
</script>

<template>
  <figure ref="stage" class="lesson-stage" :aria-busy="busy" aria-label="Repository illustration">
    <div class="stage-top flex flex-wrap items-center">
      <span v-if="file" class="lesson-pill">1 FILE · {{ file.name }}</span>
      <div class="ml-auto flex flex-wrap gap-2">
        <button
          v-if="inspecting && !reducedMotion"
          type="button"
          class="stage-animation-control"
          :aria-label="inspectionPaused ? 'Resume animation' : 'Pause animation'"
          @click="inspectionPaused = !inspectionPaused"
        >
          {{ inspectionPaused ? 'Resume' : 'Pause' }}
        </button>
        <button
          v-if="!inspecting || reducedMotion"
          type="button"
          class="stage-animation-control"
          :disabled="reducedMotion"
          :aria-describedby="reducedMotion ? 'motion-reason' : undefined"
          @click="$emit('replay')"
        >
          Replay
        </button>
      </div>
      <p v-if="reducedMotion" id="motion-reason" class="motion-reason text-label">
        Unavailable with reduced motion.
      </p>
    </div>
    <svg
      viewBox="0 0 960 500"
      role="img"
      aria-labelledby="scene-title"
      aria-describedby="scene-description"
      class="repository-diagram"
    >
      <title id="scene-title">
        Repository scene:
        {{ state.initialized ? 'initialized on ' + state.head : 'existing folder' }}
      </title>
      <defs>
        <pattern id="repository-grid" width="56" height="28" patternUnits="userSpaceOnUse">
          <path
            d="M28 0L56 14 28 28 0 14Z"
            fill="none"
            class="stroke-grid-line"
            stroke-width=".7"
          />
        </pattern>
        <radialGradient id="repository-fade">
          <stop offset="0" />
          <stop offset="1" stop-opacity="0" />
        </radialGradient>
        <mask id="repository-grid-mask" mask-type="alpha">
          <rect width="960" height="500" fill="url(#repository-fade)" />
        </mask>
      </defs>
      <rect
        width="960"
        height="500"
        fill="url(#repository-grid)"
        mask="url(#repository-grid-mask)"
      />
      <text x="86" y="55" class="scene-git-status" data-scene-caption="git">
        {{ gitStatus(state) }}
      </text>
      <g
        v-for="(zone, index) in zones"
        :key="zone.name"
        :transform="`translate(${40 + index * 310},115)`"
      >
        <text x="130" y="0" class="zone-label" text-anchor="middle">
          {{ zone.name.toUpperCase() }}
        </text>
        <ScenePlatform :fill="zone.fill" />
        <text v-if="zone.fileName" x="132" y="315" class="zone-file" text-anchor="middle">
          {{ zone.fileName }}
        </text>
        <text
          x="132"
          :y="zone.fileName ? 339 : 315"
          class="zone-caption"
          :data-scene-caption="zone.name"
          text-anchor="middle"
        >
          {{ zone.caption }}
        </text>
      </g>
      <g v-if="file" transform="translate(27,93)">
        <g
          ref="fileGraphic"
          :class="{
            'inspection-loop': inspecting && !reducedMotion,
            'inspection-paused': inspectionPaused,
          }"
        >
          <FoldedPage />
        </g>
      </g>
    </svg>
    <dl class="zone-summary">
      <div v-for="zone in zones" :key="zone.name">
        <dt>{{ zone.name }}</dt>
        <dd :data-scene-caption="zone.name">{{ zone.caption }}</dd>
      </div>
    </dl>
    <figcaption id="scene-description" class="scene-note">
      <span aria-hidden="true" class="scene-status-dot"></span>
      <InlineText :text="description" />
    </figcaption>
  </figure>
</template>
