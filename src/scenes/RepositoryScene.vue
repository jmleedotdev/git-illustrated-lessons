<script setup lang="ts">
import { computed, nextTick, shallowRef, ref, watch } from 'vue'
import type { FileContents, RepositoryState } from '../lessons/lesson'
import type { Presentation } from '../player/createPlayer'
import InlineText from '../ui/InlineText.vue'
import CommitSphere from './CommitSphere.vue'
import SnapshotInspector from './SnapshotInspector.vue'
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
const copy = shallowRef<{ file: FileContents; from: number }>()
const before = shallowRef<RepositoryState>()
const sceneDuration = 1030
const captionExitDuration = 430
const statusFadeDuration = 1600
const zoneGap = 310
const pagePosition = (zone: number) => `translate(${27 + zone * zoneGap},93)`
const busy = ref(false)
const inspectionPaused = ref(false)
const inspecting = computed(() => props.presentation.kind === 'inspect')
const state = computed(() => before.value ?? props.presentation.state)
const file = computed(() => state.value.working[0])
const stagedFile = computed(() => state.value.staged[0])
const zones = computed(() => describeZones(state.value))
// Reserve the history footer during root creation so the diagram does not resize mid-transition.
const historySummary = computed(() =>
  state.value.commits.length ? state.value : props.presentation.state,
)
const sphereY = 238
const sphereRadius = 42
const sphereX = (index: number) => 724 + index * 166
const historyLinks = computed(() =>
  state.value.commits.flatMap((commit, index, commits) =>
    commit.parents.flatMap((parent) => {
      const target = commits.findIndex(({ id }) => id === parent)
      return target < 0
        ? []
        : [
            {
              key: commit.id + ':' + parent,
              path: `M${sphereX(index) - sphereRadius} ${sphereY}H${sphereX(target) + sphereRadius}`,
            },
          ]
    }),
  ),
)

function gitStatus(state: RepositoryState) {
  if (!state.initialized) return 'Git not initialized'
  return `HEAD → ${state.head}${state.branchTip ? ' → ' + state.branchTip : ''}`
}

function describeZones(state: RepositoryState) {
  const [working] = state.working
  const [staged] = state.staged
  const status = { existing: 'Existing file', untracked: 'Untracked', tracked: 'Tracked' }
  const tip = state.commits.find(({ id }) => id === state.branchTip)
  const recorded = tip?.snapshot.find(({ name }) => name === staged?.name)
  const stagedMatchesTip = staged && recorded?.contents === staged.contents
  const workingStatus =
    working?.status === 'tracked' && staged && working.contents !== staged.contents
      ? 'Unstaged edit'
      : working?.status === 'tracked' && tip
        ? stagedMatchesTip
          ? 'Clean'
          : 'Matches staging'
        : working && status[working.status]
  return [
    {
      name: 'Working directory',
      fill: 'var(--color-peach)',
      file: working,
      caption: working ? versionCaption(working.version, workingStatus ?? '') : 'Empty',
    },
    {
      name: 'Staging area',
      fill: 'var(--color-slate)',
      file: staged,
      caption: staged
        ? versionCaption(staged.version, stagedMatchesTip ? `Matches ${tip?.id}` : 'Staged')
        : state.initialized
          ? 'Empty'
          : 'Not set up yet',
    },
    {
      name: 'Recorded history',
      fill: 'var(--color-terracotta)',
      caption: tip ? `On ${tip.id}` : 'No commits',
    },
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
    if (transition.kind === 'stage' && transition.after.staged[0]) {
      copy.value = { file: transition.after.staged[0], from: 0 }
    }
    if (transition.kind === 'commit' && transition.before.staged[0]) {
      copy.value = { file: transition.before.staged[0], from: 1 }
    }
    await nextTick()
    if (cancelled) return

    if (transition.kind === 'commit' && copyGraphic.value) {
      // Lift a copy from staging; the staged original and working file stay in place.
      const dx = sphereX(transition.after.commits.length - 1) - (27 + zoneGap + 142)
      const dy = sphereY - (93 + 140)
      await play(
        [copyGraphic.value],
        [
          { opacity: 0, transform: 'translate(0, 0)' },
          { opacity: 1, transform: 'translate(40px, -42px)', offset: 0.25 },
          { opacity: 1, transform: `translate(${dx * 0.8}px, -40px) scale(.75)`, offset: 0.75 },
          { opacity: 0, transform: `translate(${dx}px, ${dy}px) scale(.35)` },
        ],
        720,
      )
      if (cancelled) return
      copy.value = undefined
      before.value = undefined
      await nextTick()
      if (cancelled) return
      const created = stage.value?.querySelector('[data-new-commit]')
      if (created) {
        await play(
          [created],
          [
            { opacity: 0.35, transform: 'translateY(-14px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          sceneDuration - 720,
        )
      }
      settle()
      return
    }

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
      await play(
        statusLabels,
        [
          { opacity: 1 },
          { opacity: 0, offset: 0.35 },
          { opacity: 0, offset: 0.65 },
          { opacity: 1 },
        ],
        statusFadeDuration,
      )
    } else if (transition.kind === 'log') {
      // Read the newer snapshot first, then follow its parent back.
      const snapshots = [...(stage.value?.querySelectorAll('[data-history-node]') ?? [])].reverse()
      for (const snapshot of snapshots) {
        if (cancelled) return
        await play(
          [snapshot],
          [{ opacity: 1 }, { opacity: 0.55 }, { opacity: 1 }],
          sceneDuration / snapshots.length,
        )
      }
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
      :class="{ 'has-history': presentation.state.commits.length }"
    >
      <title id="scene-title">
        Repository scene:
        {{ state.initialized ? 'initialized on ' + state.head : 'existing folder' }}
      </title>
      <defs>
        <clipPath id="repository-commit-clip"><circle r="42" /></clipPath>
        <marker
          id="repository-parent-arrow"
          viewBox="0 0 10 10"
          refX="10"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
        >
          <path d="M0 0L10 5 0 10Z" class="fill-charcoal" />
        </marker>
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
        <ScenePlatform v-if="index !== 2 || !state.commits.length" :fill="zone.fill" />
        <text v-if="zone.file" x="132" y="315" class="zone-file" text-anchor="middle">
          {{ zone.file.name }}
        </text>
        <text
          v-if="index !== 2 || !state.commits.length"
          x="132"
          :y="zone.file ? 339 : 315"
          class="zone-caption"
          :data-scene-caption="zone.name"
          text-anchor="middle"
        >
          {{ zone.caption }}
        </text>
      </g>
      <g v-if="state.commits.length">
        <path
          v-for="link in historyLinks"
          :key="link.key"
          :d="link.path"
          fill="none"
          class="stroke-charcoal"
          stroke-width="2"
          marker-end="url(#repository-parent-arrow)"
        />
        <g
          v-for="(commit, index) in state.commits"
          :key="commit.id"
          data-history-node
          :transform="`translate(${sphereX(index)},${sphereY})`"
        >
          <g :data-new-commit="commit.id === state.branchTip ? '' : undefined">
            <CommitSphere :commit="commit" :current="commit.id === state.branchTip" />
            <g
              v-if="commit.id === state.branchTip"
              transform="translate(-60,-96)"
              class="diagram-branch"
            >
              <rect width="80" height="30" rx="4" class="fill-git stroke-charcoal" />
              <text x="40" y="20" text-anchor="middle" class="fill-ink font-bold">
                * {{ state.head }}
              </text>
              <path d="M40 30L60 54" class="stroke-charcoal" fill="none" />
            </g>
          </g>
        </g>
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
      <g v-if="copy" :transform="pagePosition(copy.from)" aria-hidden="true">
        <g ref="copyGraphic" class="moving-page">
          <FoldedPage :version="copy.file.version" />
        </g>
      </g>
    </svg>
    <dl class="zone-summary" :class="{ 'with-history': state.commits.length }">
      <div v-for="zone in state.commits.length ? zones.slice(0, 2) : zones" :key="zone.name">
        <dt>{{ zone.name }}</dt>
        <dd :data-scene-caption="zone.name">{{ zone.caption }}</dd>
      </div>
    </dl>
    <div
      v-if="historySummary.commits.length"
      class="history-summary"
      :class="{ invisible: !state.commits.length }"
    >
      <ul class="compact-history" aria-label="Commit history">
        <li v-for="commit in [...historySummary.commits].reverse()" :key="commit.id">
          <p class="flex flex-wrap items-center gap-x-2">
            <strong>{{ commit.id }}</strong>
            <span v-for="file in commit.snapshot" :key="file.name">
              {{ file.name }} · {{ file.version }}
            </span>
            <strong v-if="commit.id === historySummary.branchTip" class="current-branch"
              >* {{ state.head }}</strong
            >
          </p>
          {{ commit.parents.length ? 'Parent: ' + commit.parents.join(', ') : 'Root · no parent' }}
        </li>
      </ul>
      <p class="history-legend">
        <strong>*</strong> current branch · Arrows point to parents · Spheres represent snapshots.
      </p>
      <SnapshotInspector :commits="historySummary.commits" :branch-tip="historySummary.branchTip" />
    </div>
    <figcaption id="scene-description" class="scene-note">
      <span aria-hidden="true" class="scene-status-dot"></span>
      <InlineText :text="description" />
    </figcaption>
  </figure>
</template>
