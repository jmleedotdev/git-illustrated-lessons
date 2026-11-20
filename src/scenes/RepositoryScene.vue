<script setup lang="ts">
import { computed, nextTick, shallowRef, ref, watch } from 'vue'
import {
  checkoutTip,
  type FileContents,
  type LessonStep,
  type RepositoryState,
} from '../lessons/lesson'
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
const captionEnterDuration = sceneDuration - captionExitDuration
const statusFadeDuration = 1600
const zoneGap = 310
const pagePosition = (zone: number) => `translate(${27 + zone * zoneGap},93)`
const busy = ref(false)
const inspectionPaused = ref(false)
const inspecting = computed(() => props.presentation.kind === 'inspect')
const state = computed(() => before.value ?? props.presentation.state)
const currentTip = computed(() => checkoutTip(state.value))
const file = computed(() => state.value.working[0])
const stagedFile = computed(() => state.value.staged[0])
const zones = computed(() => describeZones(state.value))
// Reserve the history footer during root creation so the diagram does not resize mid-transition.
const historySummary = computed(() =>
  state.value.commits.length ? state.value : props.presentation.state,
)
const branchHistory = computed(
  () => Object.keys(props.presentation.state.branches ?? {}).length > 1,
)
const sphereRadius = 42
const branchBounds = { x: -20, y: -54, width: 650, height: 447 }
const branchViewBox = Object.values(branchBounds).join(' ')
// Revised A's shared path and raised ideas commit, without the unused merge space.
const branchPositions = [
  { x: 115, y: 260 },
  { x: 305, y: 260 },
  { x: 485, y: 50 },
]
function spherePosition(index: number) {
  return (branchHistory.value && branchPositions[index]) || { x: 724 + index * 166, y: 238 }
}
function branchesAt(repository: RepositoryState, commit: string) {
  return Object.entries(repository.branches ?? {})
    .filter(([, tip]) => tip === commit)
    .map(([name]) => name)
}
const branchMarkers = computed(() =>
  Object.entries(state.value.branches ?? {}).map(([name, tip], index) => {
    const { x, y } = spherePosition(state.value.commits.findIndex(({ id }) => id === tip))
    const offset = index === 0 ? -86 : 3
    return { name, x: x + offset, y: y - 96, offset, width: index === 0 ? 80 : 86 }
  }),
)
function parentPath(fromIndex: number, toIndex: number) {
  const from = spherePosition(fromIndex)
  const to = spherePosition(toIndex)
  const length = Math.hypot(to.x - from.x, to.y - from.y)
  const dx = ((to.x - from.x) / length) * sphereRadius
  const dy = ((to.y - from.y) / length) * sphereRadius
  return `M${from.x + dx} ${from.y + dy}L${to.x - dx} ${to.y - dy}`
}
const historyLinks = computed(() =>
  state.value.commits.flatMap((commit, index, commits) =>
    commit.parents.flatMap((parent) => {
      const target = commits.findIndex(({ id }) => id === parent)
      return target < 0 ? [] : [{ key: `${commit.id}:${parent}`, path: parentPath(index, target) }]
    }),
  ),
)

function checkoutFiles(repository: RepositoryState) {
  const snapshot = repository.commits.find(({ id }) => id === checkoutTip(repository))?.snapshot
  return [
    {
      key: 'working',
      label: 'Working directory',
      files: repository.working.map((file) => ({
        ...file,
        caption: file.status === 'untracked' ? 'Untracked' : 'Tracked',
      })),
    },
    {
      key: 'staged',
      label: 'Staging area',
      files: repository.staged.map((file) => ({
        ...file,
        caption: snapshot?.some(
          (recorded) => recorded.name === file.name && recorded.contents === file.contents,
        )
          ? `Matches ${checkoutTip(repository)}`
          : 'Staged',
      })),
    },
  ]
}
const checkout = computed(() => checkoutFiles(state.value))
const branchDescription = computed(() =>
  state.value.commits
    .map((commit) => {
      const refs = branchesAt(state.value, commit.id).map(
        (name) => `${name}${name === state.value.head ? ' (current branch)' : ''}`,
      )
      const parent = commit.parents.length ? 'parent ' + commit.parents.join(', ') : 'no parent'
      return `${commit.id}: ${parent}; records ${commit.snapshot.map(({ name }) => name).join(', ')}${refs.length ? '; referenced by ' + refs.join(' and ') : ''}.`
    })
    .join(' '),
)

function gitStatus(state: RepositoryState) {
  if (!state.initialized) return 'Git not initialized'
  const tip = checkoutTip(state)
  return `HEAD → ${state.head}${tip ? ' → ' + tip : ''}`
}

function describeZones(state: RepositoryState) {
  const [working] = state.working
  const [staged] = state.staged
  const status = { existing: 'Existing file', untracked: 'Untracked', tracked: 'Tracked' }
  const tip = state.commits.find(({ id }) => id === checkoutTip(state))
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

async function playBranchChange(
  transition: LessonStep['transition'],
  play: (targets: Element[], frames: Keyframe[], duration: number) => Promise<void>,
  revealAfter: () => Promise<boolean>,
) {
  const { before: from, after: to } = transition
  const readoutChanged = gitStatus(from) !== gitStatus(to)
  const nextCheckout = checkoutFiles(to)
  const changedFiles = checkoutFiles(from).flatMap(({ key, files }, index) => {
    const next = nextCheckout[index]?.files ?? []
    return Array.from(
      new Set([...files.map((file) => file.name), ...next.map((file) => file.name)]),
    )
      .filter(
        (name) =>
          files.find((file) => file.name === name)?.caption !==
          next.find((file) => file.name === name)?.caption,
      )
      .map((name) => `${key}:${name}`)
  })
  const markers = Object.entries(to.branches ?? {}).filter(
    ([name, tip]) => from.branches?.[name] !== tip || (from.head === name) !== (to.head === name),
  )
  const affected = () =>
    Array.from(
      stage.value?.querySelectorAll(
        '[data-checkout-file], [data-branch-name], [data-head-readout]',
      ) ?? [],
    ).filter(
      (element) =>
        (readoutChanged && element.hasAttribute('data-head-readout')) ||
        changedFiles.includes(element.getAttribute('data-checkout-file') ?? '') ||
        markers.some(([name]) => name === element.getAttribute('data-branch-name')),
    )
  const checkoutHighlights = () =>
    Array.from(stage.value?.querySelectorAll('[data-current-snapshot]') ?? [])
  const tipChanged = checkoutTip(from) !== checkoutTip(to)
  const leaving = affected()
  if (transition.kind === 'create-branch' || tipChanged) leaving.push(...checkoutHighlights())
  if (transition.kind === 'edit') {
    const working = stage.value?.querySelector('[data-checkout-zone="working"]')
    if (working) leaving.push(working)
  }
  await play(leaving, [{ opacity: 1 }, { opacity: 0.35 }], captionExitDuration)
  if (!(await revealAfter())) return

  // Move only a reference that actually changed targets; a HEAD switch changes emphasis instead.
  const moved = markers.find(([name, tip]) => from.branches?.[name] && from.branches[name] !== tip)
  const marker = moved && stage.value?.querySelector(`[data-branch-marker="${moved[0]}"]`)
  const entering = affected().filter((element) => element !== marker)
  if (tipChanged) entering.push(...checkoutHighlights())
  const fades = play(entering, [{ opacity: 0.25 }, { opacity: 1 }], captionEnterDuration)
  if (!marker || !moved) return fades

  const [name, tip] = moved
  const origin = spherePosition(from.commits.findIndex(({ id }) => id === from.branches?.[name]))
  const destination = spherePosition(to.commits.findIndex(({ id }) => id === tip))
  await Promise.all([
    fades,
    play(
      [marker],
      [
        { transform: `translate(${origin.x - destination.x}px, ${origin.y - destination.y}px)` },
        { transform: 'translate(0, 0)' },
      ],
      captionEnterDuration,
    ),
  ])
}

watch(
  () => props.presentation,
  async ({ transition }, _, onCleanup) => {
    before.value = undefined
    copy.value = undefined
    busy.value = false
    inspectionPaused.value = false
    if (!transition || inspecting.value) return

    const animations = new Set<Animation>()
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
      const running = targets
        .filter((target) => typeof target.animate === 'function')
        .map((target) => target.animate(frames, { duration, easing: 'ease-in-out' }))
      running.forEach((animation) => animations.add(animation))
      await Promise.allSettled(running.map((animation) => animation.finished))
      running.forEach((animation) => animations.delete(animation))
    }

    busy.value = true
    before.value = transition.before
    if (branchHistory.value) {
      await nextTick()
      if (cancelled) return
      await playBranchChange(transition, play, async () => {
        if (cancelled) return false
        before.value = undefined
        await nextTick()
        return !cancelled
      })
      settle()
      return
    }
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
      const destination = spherePosition(transition.after.commits.length - 1)
      const dx = destination.x - (27 + zoneGap + 142)
      const dy = destination.y - (93 + 140)
      await play(
        [copyGraphic.value],
        [
          { opacity: 0, transform: 'translate(0, 0)' },
          { opacity: 1, transform: 'translate(40px, -42px)', offset: 0.25 },
          { opacity: 1, transform: `translate(${dx * 0.8}px, -40px) scale(.75)`, offset: 0.75 },
          { opacity: 0, transform: `translate(${dx}px, ${dy}px) scale(.35)` },
        ],
        sceneDuration - captionEnterDuration,
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
          captionEnterDuration,
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
          captionEnterDuration,
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
        captionEnterDuration,
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
      <span v-if="branchHistory" class="lesson-pill">ALICE’S LOCAL REPOSITORY</span>
      <span v-else-if="file" class="lesson-pill">1 FILE · {{ file.name }}</span>
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
    <p v-if="branchHistory" class="branch-head font-bold" data-head-readout>
      {{ gitStatus(state) }}
    </p>
    <svg
      :viewBox="branchHistory ? branchViewBox : '0 0 960 500'"
      role="img"
      aria-labelledby="scene-title"
      :aria-describedby="
        branchHistory ? 'scene-description branch-relationships' : 'scene-description'
      "
      class="repository-diagram"
      :class="{ 'has-history': presentation.state.commits.length, 'branch-graph': branchHistory }"
    >
      <title id="scene-title">
        Repository scene:
        {{ state.initialized ? 'initialized on ' + state.head : 'existing folder' }}
      </title>
      <desc v-if="branchHistory" id="branch-relationships">{{ branchDescription }}</desc>
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
      <rect v-if="branchHistory" v-bind="branchBounds" fill="url(#repository-grid)" opacity=".45" />
      <rect
        v-else
        width="960"
        height="500"
        fill="url(#repository-grid)"
        mask="url(#repository-grid-mask)"
      />
      <text v-if="!branchHistory" x="86" y="55" class="scene-git-status" data-scene-caption="git">
        {{ gitStatus(state) }}
      </text>
      <template v-if="!branchHistory">
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
      </template>
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
          :transform="`translate(${spherePosition(index).x},${spherePosition(index).y})`"
        >
          <g
            :data-new-commit="commit.id === currentTip ? '' : undefined"
            :data-current-snapshot="branchHistory && commit.id === currentTip ? '' : undefined"
          >
            <CommitSphere :commit="commit" :current="commit.id === currentTip" />
            <g
              v-if="!branchHistory && commit.id === currentTip"
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
      <g
        v-for="marker in branchHistory ? branchMarkers : []"
        :key="marker.name"
        :transform="`translate(${marker.x},${marker.y})`"
      >
        <g :data-branch-marker="marker.name" :data-branch-name="marker.name">
          <rect
            :width="marker.width"
            height="30"
            rx="4"
            class="stroke-charcoal"
            :class="marker.name === state.head ? 'fill-git' : 'fill-slate'"
          />
          <text
            :x="marker.width / 2"
            y="20"
            text-anchor="middle"
            class="fill-ink"
            :class="{ 'font-bold': marker.name === state.head }"
          >
            {{ marker.name === state.head ? '* ' : '' }}{{ marker.name }}
          </text>
          <path
            :d="`M${marker.width / 2} 30L${-marker.offset} 50`"
            class="stroke-charcoal"
            fill="none"
          />
        </g>
      </g>
      <g v-if="!branchHistory && file" :transform="pagePosition(0)">
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
      <FoldedPage
        v-if="!branchHistory && stagedFile"
        :version="stagedFile.version"
        :transform="pagePosition(1)"
      />
      <g v-if="copy" :transform="pagePosition(copy.from)" aria-hidden="true">
        <g ref="copyGraphic" class="moving-page">
          <FoldedPage :version="copy.file.version" />
        </g>
      </g>
    </svg>
    <dl
      v-if="!branchHistory"
      class="zone-summary"
      :class="{ 'with-history': state.commits.length }"
    >
      <div v-for="zone in state.commits.length ? zones.slice(0, 2) : zones" :key="zone.name">
        <dt>{{ zone.name }}</dt>
        <dd :data-scene-caption="zone.name">{{ zone.caption }}</dd>
      </div>
    </dl>
    <div
      v-if="historySummary.commits.length"
      class="history-summary"
      :class="{ invisible: !state.commits.length, 'branch-summary': branchHistory }"
    >
      <section
        v-if="branchHistory"
        aria-label="Checked-out contents"
        class="branch-checkout grid grid-cols-2 gap-1 pt-1 text-label [overflow-wrap:anywhere]"
      >
        <div v-for="zone in checkout" :key="zone.key" :data-checkout-zone="zone.key">
          <h3 class="font-bold">{{ zone.label }}</h3>
          <ul :aria-label="zone.label" role="list">
            <li
              v-for="item in zone.files"
              :key="item.name"
              :data-checkout-file="`${zone.key}:${item.name}`"
            >
              <code>{{ item.name }}</code
              >{{ item.version ? ' · ' + item.version : '' }} · {{ item.caption }}
            </li>
          </ul>
        </div>
      </section>
      <ul class="compact-history" role="list" aria-label="Commit history">
        <li
          v-for="commit in [...historySummary.commits].reverse()"
          :key="commit.id"
          :data-current-snapshot="branchHistory && commit.id === currentTip ? '' : undefined"
        >
          <p class="flex flex-wrap items-center gap-x-2">
            <strong>{{ commit.id }}</strong>
            <span v-for="file in commit.snapshot" :key="file.name">
              {{ file.name }}{{ file.version ? ' · ' + file.version : '' }}
            </span>
            <span
              v-for="name in branchesAt(historySummary, commit.id)"
              :key="name"
              :class="name === state.head ? 'current-branch' : 'inactive-branch'"
              :data-branch-name="name"
            >
              {{ name === state.head ? '* ' : '' }}{{ name }}
            </span>
          </p>
          {{ commit.parents.length ? 'Parent: ' + commit.parents.join(', ') : 'Root · no parent' }}
        </li>
      </ul>
      <p class="history-legend">
        <strong>*</strong> current branch · Arrows point to parents · Spheres represent snapshots.
      </p>
      <SnapshotInspector
        :commits="historySummary.commits"
        :branch-tip="checkoutTip(historySummary)"
      />
    </div>
    <figcaption id="scene-description" class="scene-note">
      <span aria-hidden="true" class="scene-status-dot"></span>
      <InlineText :text="description" />
    </figcaption>
  </figure>
</template>
