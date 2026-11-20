<script setup lang="ts">
import { computed, ref, watchPostEffect } from 'vue'
import { checkoutTip } from '../lessons/lesson'
import type { Presentation } from '../player/createPlayer'
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
const positions = [
  { x: 50, y: 170 },
  { x: 120, y: 170 },
  { x: 190, y: 85 },
  { x: 240, y: 230 },
  { x: 315, y: 170 },
]
const sphereRadius = 23
const nodes = computed(() =>
  state.value.commits.map((commit, index) => ({
    commit,
    ...positions[index]!,
  })),
)
const links = computed(() =>
  nodes.value.flatMap((child) =>
    child.commit.parents.map((id) => {
      const parent = nodes.value.find(({ commit }) => commit.id === id)!
      const dx = parent.x - child.x
      const dy = parent.y - child.y
      const length = Math.hypot(dx, dy)
      return {
        key: `${child.commit.id}:${id}`,
        path: `M ${child.x + (dx / length) * 25} ${child.y + (dy / length) * 25} L ${parent.x - (dx / length) * 26} ${parent.y - (dy / length) * 26}`,
      }
    }),
  ),
)
const branches = computed(() =>
  Object.entries(state.value.branches ?? {}).map(([name, id]) => {
    const { x, y } = nodes.value.find(({ commit }) => commit.id === id)!
    const current = name === state.value.head
    return {
      name,
      x,
      y: y - (current ? 61 : 52),
      stem: current ? 11 : 3,
      width: current ? 90 : 94,
      current,
    }
  }),
)

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
  const target = transition.kind === 'add-origin' ? 'origin' : 'hosted-name'
  const frames = [{ opacity: 0 }, { opacity: 1 }]
  // Reveal only the changed identifier or connection, never animate the commits.
  const animations = Array.from(figure.querySelectorAll(`[data-remote-part="${target}"]`))
    .filter((element) => typeof element.animate === 'function')
    .map((element) => element.animate(frames, { duration: 1030, easing: 'ease-in-out' }))
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
        class="stage-animation-control ml-auto"
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
      </defs>
      <g
        v-for="panel in ['local', 'github']"
        :key="panel"
        :transform="`translate(${panel === 'local' ? 25 : 495},30)`"
      >
        <rect
          width="380"
          height="330"
          rx="18"
          :class="panel === 'local' ? 'fill-peach' : 'fill-slate'"
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
          {{ panel === 'local' ? 'ALICE’S COMPUTER' : 'GITHUB · HOSTED REPOSITORY' }}
        </text>
        <template v-if="panel === 'local'">
          <text x="18" y="54" font-size="13">{{ head }}</text>
          <g transform="translate(10,40)">
            <path
              v-for="link in links"
              :key="link.key"
              :d="link.path"
              fill="none"
              class="stroke-muted"
              stroke-width="2"
              marker-end="url(#remote-parent)"
            />
            <CommitSphere
              v-for="{ commit, x, y } in nodes"
              :key="commit.id"
              :commit="commit"
              :current="commit.id === tip"
              compact
              :transform="`translate(${x},${y}) scale(${sphereRadius / 42})`"
            />
            <g
              v-for="branch in branches"
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
        </template>
        <text v-else-if="hosted" data-remote-part="hosted-name" x="18" y="54" font-size="13">
          {{ hosted.owner }} / {{ hosted.name }}
        </text>
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
    </svg>
    <div class="remote-compact story-text">
      <p>
        <strong>Alice’s computer</strong><br />{{ head }}<br />* {{ state.head }} is current · ideas
        →
        {{ state.branches?.ideas }}
      </p>
      <p v-if="origin" data-remote-part="origin" class="remote-compact-link">
        <InlineText text="`origin` names the GitHub address." />
      </p>
      <p>
        <strong>GitHub</strong
        ><span v-if="hosted" data-remote-part="hosted-name"> / {{ hosted.name }}</span>
      </p>
    </div>
    <figcaption id="remote-scene-note" class="scene-note">
      <span aria-hidden="true" class="scene-status-dot"></span>
      <InlineText :text="description" />
    </figcaption>
  </figure>
</template>

<style scoped>
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
