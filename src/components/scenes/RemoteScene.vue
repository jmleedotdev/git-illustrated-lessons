<script setup lang="ts">
import { computed, ref, watchPostEffect } from 'vue'
import type { Commit } from '@/types/lesson'
import { checkoutTip } from '@/utils/checkoutTip'
import type { Presentation } from '@/composables/createPlayer'
import InlineText from '../ui/InlineText.vue'
import CommitSphere from './CommitSphere.vue'

const props = defineProps<{
  presentation: Presentation
  description: string
  reducedMotion: boolean
}>()
defineEmits<{ replay: [] }>()

const state = computed(() => props.presentation.state)
const hosted = computed(() => state.value.remoteSetup?.hosted)
const origin = computed(() => state.value.remoteSetup?.origin)
const tip = computed(() => checkoutTip(state.value))
const head = computed(() => `HEAD → ${state.value.head} → ${tip.value}`)

// Centers and panel geometry from the revised A remote study.
const localPanelX = 25
const githubPanelX = 495
const positions = [
  { x: 50, y: 170 },
  { x: 120, y: 170 },
  { x: 190, y: 85 },
  { x: 240, y: 230 },
  { x: 315, y: 170 },
]
const sphereRadius = 23

function diagramHistory(
  commits: readonly Commit[],
  branchTips: Readonly<Record<string, string>>,
  currentBranch: string | null,
) {
  const nodes = commits.map((commit, index) => ({ commit, ...positions[index]! }))
  const links = nodes.flatMap((child) =>
    child.commit.parents.map((id) => {
      const parent = nodes.find(({ commit }) => commit.id === id)!
      const dx = parent.x - child.x
      const dy = parent.y - child.y
      const length = Math.hypot(dx, dy)
      return {
        key: `${child.commit.id}:${id}`,
        path: `M ${child.x + (dx / length) * 25} ${child.y + (dy / length) * 25} L ${parent.x - (dx / length) * 26} ${parent.y - (dy / length) * 26}`,
      }
    }),
  )
  const branches = Object.entries(branchTips).map(([name, id]) => {
    const { x, y } = nodes.find(({ commit }) => commit.id === id)!
    const current = name === currentBranch
    const main = name === 'main'
    return {
      name,
      x,
      y: y - (main ? 61 : 52),
      stem: main ? 11 : 3,
      width: main ? 90 : 94,
      current,
    }
  })
  return { nodes, links, branches }
}

const hostedMain = computed(() => hosted.value?.branches.main)
const hostedRange = computed(() => {
  const commits = hosted.value?.commits ?? []
  if (commits.length < 2) return commits[0]?.id
  return `${commits[0]!.id}–${commits[commits.length - 1]!.id}`
})
const panels = computed(() => [
  {
    title: 'ALICE’S COMPUTER',
    x: localPanelX,
    local: true,
    tip: tip.value,
    ...diagramHistory(state.value.commits, state.value.branches ?? {}, state.value.head),
  },
  {
    title: 'GITHUB · HOSTED REPOSITORY',
    x: githubPanelX,
    local: false,
    tip: hostedMain.value,
    ...diagramHistory(hosted.value?.commits ?? [], hosted.value?.branches ?? {}, null),
  },
])

const replayUnavailable = computed(() => {
  if (props.reducedMotion) return 'Unavailable with reduced motion.'
  return props.presentation.kind === 'inspect-remote' ? 'Nothing changes in this step.' : undefined
})
const stage = ref<HTMLElement>()
const busy = ref(false)
watchPostEffect((onCleanup) => {
  const transition = props.presentation.transition
  const figure = stage.value
  busy.value = false
  if (!transition || !figure || replayUnavailable.value) return
  const sceneDuration = 1030
  const travelDuration = 820
  const reveal = [{ opacity: 0 }, { opacity: 1 }]
  const animate = (part: string, frames: Keyframe[], duration = sceneDuration, delay = 0) =>
    Array.from(figure.querySelectorAll(`[data-remote-part="${part}"]`))
      .filter((element) => typeof element.animate === 'function')
      .map((element) =>
        element.animate(frames, { duration, delay, fill: 'backwards', easing: 'ease-in-out' }),
      )
  // The local graph stays still. Hosted copies travel first; their links and main appear on arrival.
  const animations =
    transition.kind === 'push'
      ? [
          ...animate('push', reveal, 250),
          ...animate(
            'published-commits',
            [
              { opacity: 0, transform: `translateX(${localPanelX - githubPanelX}px)` },
              { opacity: 1, offset: 0.23 },
              { opacity: 1, transform: 'translateX(0)' },
            ],
            travelDuration,
          ),
          ...animate('published-refs', reveal, sceneDuration - travelDuration, travelDuration),
          ...animate(
            'published-summary',
            [
              { opacity: 0, transform: 'translateY(-12px)' },
              { opacity: 1, transform: 'none' },
            ],
            330,
            700,
          ),
        ]
      : animate(transition.kind === 'add-origin' ? 'origin' : 'hosted-name', reveal)
  if (!animations.length) return
  busy.value = true
  let cancelled = false
  onCleanup(() => {
    cancelled = true
    animations.forEach((animation) => animation.cancel())
  })
  void Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
    if (!cancelled) busy.value = false
  })
})
</script>

<template>
  <figure
    ref="stage"
    class="lesson-stage remote-stage"
    :aria-busy="busy"
    aria-label="Local and GitHub repositories"
    aria-describedby="remote-diagram-description remote-scene-note"
  >
    <div class="stage-top flex flex-wrap items-center">
      <span class="lesson-pill">TWO PLACES, ONE HISTORY</span>
      <button
        type="button"
        class="stage-animation-control remote-replay ml-auto"
        :disabled="!!replayUnavailable"
        :aria-describedby="replayUnavailable ? 'remote-motion-reason' : undefined"
        @click="$emit('replay')"
      >
        Replay
      </button>
      <p v-if="replayUnavailable" id="remote-motion-reason" class="motion-reason text-label">
        {{ replayUnavailable }}
      </p>
    </div>
    <svg
      class="repository-diagram remote-diagram fill-charcoal"
      viewBox="0 0 900 420"
      role="img"
      aria-label="Local and GitHub repository diagram"
      aria-describedby="remote-diagram-description"
    >
      <defs>
        <clipPath id="repository-commit-clip"><circle r="42" /></clipPath>
        <pattern id="remote-grid" width="56" height="28" patternUnits="userSpaceOnUse">
          <path
            d="M28 0L56 14 28 28 0 14Z"
            fill="none"
            class="stroke-grid-line"
            stroke-width=".65"
          />
        </pattern>
        <marker
          id="remote-parent"
          viewBox="0 0 10 10"
          refX="10"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <path d="M0 0L10 5 0 10" fill="none" class="stroke-muted" stroke-width="2" />
        </marker>
        <marker
          id="remote-transfer"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
        >
          <path d="M0 0L10 5 0 10" fill="none" class="stroke-focus" stroke-width="2" />
        </marker>
      </defs>
      <g v-for="panel in panels" :key="panel.title" :transform="`translate(${panel.x},30)`">
        <rect
          width="380"
          height="330"
          rx="18"
          :class="panel.local ? 'fill-peach' : 'fill-slate'"
          fill-opacity=".45"
        />
        <rect x="10" y="70" width="360" height="245" fill="url(#remote-grid)" />
        <rect
          width="380"
          height="330"
          rx="18"
          fill="none"
          class="stroke-muted"
          stroke-width="1.5"
          stroke-dasharray="1 6"
          stroke-linecap="round"
        />
        <text x="18" y="30" font-size="14" class="font-bold">
          {{ panel.title }}
        </text>
        <text v-if="panel.local" x="18" y="54" font-size="13">{{ head }}</text>
        <text v-else-if="hosted" data-remote-part="hosted-name" x="18" y="54" font-size="13">
          {{ hosted.owner }} / {{ hosted.name }}
        </text>
        <g v-if="panel.nodes.length" transform="translate(10,40)">
          <g :data-remote-part="panel.local ? undefined : 'published-refs'">
            <path
              v-for="link in panel.links"
              :key="link.key"
              :d="link.path"
              fill="none"
              class="stroke-muted"
              stroke-width="2"
              marker-end="url(#remote-parent)"
            />
          </g>
          <g :data-remote-part="panel.local ? undefined : 'published-commits'">
            <CommitSphere
              v-for="{ commit, x, y } in panel.nodes"
              :key="commit.id"
              :commit="commit"
              :current="commit.id === panel.tip"
              compact
              :transform="`translate(${x},${y}) scale(${sphereRadius / 42})`"
            />
          </g>
          <g :data-remote-part="panel.local ? undefined : 'published-refs'">
            <g
              v-for="branch in panel.branches"
              :key="branch.name"
              :transform="`translate(${branch.x},${branch.y})`"
            >
              <rect
                :x="-branch.width / 2"
                :width="branch.width"
                height="26"
                rx="5"
                class="stroke-charcoal"
                :class="branch.current ? 'fill-git' : 'fill-slate'"
              />
              <text y="18" font-size="15" text-anchor="middle" class="font-bold">
                {{ branch.current ? '* ' : '' }}{{ branch.name }}
              </text>
              <path :d="`M0 26v${branch.stem}`" class="stroke-charcoal" fill="none" />
            </g>
          </g>
        </g>
      </g>
      <g v-if="origin" data-remote-part="origin">
        <path
          d="M405 140H495"
          fill="none"
          class="stroke-muted"
          stroke-dasharray="5 5"
          stroke-width="2"
        />
        <text x="450" y="126" text-anchor="middle" font-size="13" class="fill-idea-ink font-bold">
          origin
        </text>
      </g>
      <g v-if="hostedMain" data-remote-part="push">
        <path
          d="M405 285H490"
          class="stroke-focus"
          stroke-width="3"
          marker-end="url(#remote-transfer)"
        />
        <text x="450" y="312" text-anchor="middle" font-size="13" class="fill-idea-ink font-bold">
          push
        </text>
      </g>
    </svg>
    <div class="remote-compact story-text">
      <p>
        <strong>Alice’s computer</strong><br />{{ head }}<br />* {{ state.head }} is current · ideas
        →
        {{ state.branches?.ideas }}
      </p>
      <p v-if="origin" class="remote-compact-link">
        <span data-remote-part="origin"
          ><InlineText text="`origin` names the GitHub address."
        /></span>
        <span v-if="hostedMain" data-remote-part="push"><br />Push sent main’s history.</span>
      </p>
      <p>
        <strong>GitHub</strong
        ><span v-if="hosted" data-remote-part="hosted-name"> / {{ hosted.name }}</span>
        <span v-if="hostedMain" class="block" data-remote-part="published-summary">
          main → {{ hostedMain }} · {{ hostedRange }}
        </span>
      </p>
    </div>
    <figcaption id="remote-scene-note" class="scene-note">
      <span aria-hidden="true" class="scene-status-dot"></span>
      <InlineText :text="description" />
    </figcaption>
  </figure>
</template>

<style scoped>
@media (width > 1100px) and (height > 760px) {
  /* Keep the SVG stationary when the Replay reason appears or disappears. */
  .motion-reason {
    flex-basis: auto;
    margin-inline-start: auto;
  }
  .stage-top:has(.motion-reason) .remote-replay {
    order: 1;
    margin-inline-start: 0;
  }
}
.remote-compact {
  display: none;
}
@media (max-width: 1100px), (max-height: 760px) {
  .repository-diagram.remote-diagram {
    display: none;
  }
  .remote-compact {
    display: grid;
    gap: var(--spacing-inset);
    padding: var(--spacing-inset);
  }
  .remote-compact-link {
    padding-inline-start: var(--spacing-inset);
    border-inline-start: var(--border-ink) dashed var(--color-focus);
  }
}
@media (width > 1100px) and (max-height: 760px) {
  .remote-compact {
    flex: 1;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
  }
  .remote-compact-link {
    max-width: 18ch;
  }
  .remote-compact > :last-child {
    grid-column: 3;
  }
}
@media (width > 760px) and (max-width: 1100px) {
  .remote-stage {
    flex-basis: auto;
  }
}
</style>
