<script setup lang="ts">
import { computed, nextTick, shallowRef, ref, watch } from 'vue'
import type { FileContents, RepositoryState } from '../lessons/lesson'
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
const copyGraphic = ref<SVGGElement>()
const copy = shallowRef<FileContents>()
const before = shallowRef<RepositoryState>()
const sceneDuration = 1030
const captionExitDuration = 430
const zoneGap = 310
const pagePosition = (zone: number) => `translate(${27 + zone * zoneGap},93)`
const busy = ref(false)
const inspectionPaused = ref(false)
const inspecting = computed(() => props.presentation.kind === 'inspect')
const state = computed(() => before.value ?? props.presentation.state)
const file = computed(() => state.value.working[0])
const stagedFile = computed(() => state.value.staged[0])
const zones = computed(() => describeZones(state.value))

function gitStatus(state: RepositoryState) {
  return state.initialized ? `HEAD → ${state.head}` : 'Git not initialized'
}

function describeZones(state: RepositoryState) {
  const [working] = state.working
  const [staged] = state.staged
  const status = { existing: 'Existing file', untracked: 'Untracked', tracked: 'Tracked' }
  return [
    {
      name: 'Working directory',
      fill: 'var(--color-peach)',
      file: working,
      caption: working ? versionCaption(working.version, status[working.status]) : 'Empty',
    },
    {
      name: 'Staging area',
      fill: 'var(--color-slate)',
      file: staged,
      caption: staged
        ? versionCaption(staged.version, 'Staged')
        : state.initialized
          ? 'Empty'
          : 'Not set up yet',
    },
    { name: 'Recorded history', fill: 'var(--color-terracotta)', caption: 'No commits' },
  ]
}

function versionCaption(version: string | undefined, status: string) {
  return version ? `Version ${version} · ${status}` : status
}

watch(
  () => props.presentation,
  async ({ transition }, _, onCleanup) => {
    before.value = undefined
    copy.value = undefined
    busy.value = false
    inspectionPaused.value = false
    if (!transition || inspecting.value) return

    let animations: Animation[] = []
    let cancelled = false
    onCleanup(() => {
      cancelled = true
      animations.forEach((animation) => animation.cancel())
    })

    function settle() {
      if (cancelled) return
      copy.value = undefined
      before.value = undefined
      busy.value = false
    }

    async function play(targets: Element[], frames: Keyframe[], duration = sceneDuration) {
      animations = targets
        .filter((target) => typeof target.animate === 'function')
        .map((target) => target.animate(frames, { duration, easing: 'ease-in-out' }))
      await Promise.allSettled(animations.map((animation) => animation.finished))
    }

    busy.value = true
    before.value = transition.before
    if (transition.kind === 'stage') copy.value = transition.after.staged[0]
    await nextTick()
    if (cancelled) return

    if (copyGraphic.value) {
      await play(
        [copyGraphic.value],
        [
          { opacity: 0, transform: 'translate(0, 0)' },
          { opacity: 1, transform: `translate(${zoneGap * 0.25}px, -46px)`, offset: 0.25 },
          { opacity: 1, transform: `translate(${zoneGap * 0.75}px, -46px)`, offset: 0.75 },
          { opacity: 1, transform: `translate(${zoneGap}px, 0)` },
        ],
      )
      settle()
      return
    }

    const afterZones = describeZones(transition.after)
    const changedCaptions = zones.value
      .filter((zone, index) => zone.caption !== afterZones[index]?.caption)
      .map((zone) => zone.name)
    if (gitStatus(transition.before) !== gitStatus(transition.after)) changedCaptions.push('git')
    const changingLabels = Array.from(
      stage.value?.querySelectorAll('[data-scene-caption]') ?? [],
    ).filter((label) => changedCaptions.includes(label.getAttribute('data-scene-caption') ?? ''))

    if (transition.kind === 'edit' && fileGraphic.value) changingLabels.push(fileGraphic.value)
    if (transition.kind === 'status') {
      const statusLabels = Array.from(stage.value?.querySelectorAll('[data-scene-caption]') ?? [])
      await play(statusLabels, [{ opacity: 1 }, { opacity: 0.45 }, { opacity: 1 }])
    } else if (changingLabels.length) {
      await play(changingLabels, [{ opacity: 1 }, { opacity: 0.15 }], captionExitDuration)
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
        sceneDuration - captionExitDuration,
      )
    } else if (fileGraphic.value) {
      await play(
        [fileGraphic.value],
        [
          { opacity: 0.25, transform: 'translateY(18px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
      )
    }

    settle()
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
        :transform="`translate(${40 + index * zoneGap},115)`"
      >
        <text x="130" y="0" class="zone-label" text-anchor="middle">
          {{ zone.name.toUpperCase() }}
        </text>
        <ScenePlatform :fill="zone.fill" />
        <text v-if="zone.file" x="132" y="315" class="zone-file" text-anchor="middle">
          {{ zone.file.name }}
        </text>
        <text
          x="132"
          :y="zone.file ? 339 : 315"
          class="zone-caption"
          :data-scene-caption="zone.name"
          text-anchor="middle"
        >
          {{ zone.caption }}
        </text>
      </g>
      <g v-if="file" :transform="pagePosition(0)">
        <g
          ref="fileGraphic"
          :class="{
            'inspection-loop': inspecting && !reducedMotion,
            'inspection-paused': inspectionPaused,
          }"
        >
          <FoldedPage :version="file.version" />
        </g>
      </g>
      <FoldedPage v-if="stagedFile" :version="stagedFile.version" :transform="pagePosition(1)" />
      <g v-if="copy" :transform="pagePosition(0)" aria-hidden="true">
        <g ref="copyGraphic">
          <FoldedPage :version="copy.version" />
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
