<script setup lang="ts">
import { computed, nextTick, shallowRef, ref, watch } from 'vue'
import type { RepositoryState } from '../lessons/lesson'
import type { Presentation } from '../player/createPlayer'
import InlineText from '../ui/InlineText.vue'
import ScenePlatform from './ScenePlatform.vue'

const props = defineProps<{ presentation: Presentation; description: string }>()
const references = ref<HTMLElement>()
const fileGraphic = ref<SVGGElement>()
const workingZone = ref<HTMLElement>()
const before = shallowRef<RepositoryState>()
const busy = ref(false)
const state = computed(() => before.value ?? props.presentation.state)
const file = computed(() => state.value.working[0])

watch(
  () => props.presentation,
  async ({ transition }, _, onCleanup) => {
    before.value = undefined
    busy.value = false
    if (!transition) return

    let animation: Animation | undefined
    let cancelled = false
    onCleanup(() => {
      cancelled = true
      animation?.cancel()
    })

    async function play(target: Element | undefined, frames: Keyframe[], duration: number) {
      if (!target?.animate) return
      animation = target.animate(frames, { duration, easing: 'ease-in-out' })
      await animation.finished.catch(() => undefined)
    }

    busy.value = true
    before.value = transition.before
    await nextTick()
    if (cancelled) return

    if (transition.kind === 'initialize') {
      await play(references.value, [{ opacity: 1 }, { opacity: 0.15 }], 430)
      if (cancelled) return
      before.value = undefined
      await nextTick()
      if (cancelled) return
      await play(
        references.value,
        [
          { opacity: 0, transform: 'translateY(-12px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        600,
      )
    } else if (transition.kind === 'inspect') {
      await play(
        workingZone.value,
        [{ outlineColor: 'var(--color-focus)', offset: 0.2 }, { outlineColor: 'transparent' }],
        950,
      )
    } else {
      await play(
        fileGraphic.value,
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
  <figure :aria-busy="busy" aria-label="Repository illustration">
    <div
      role="img"
      :aria-label="
        'Repository scene: ' +
        (state.initialized ? 'initialized on ' + state.head : 'existing folder')
      "
      aria-describedby="scene-description"
      class="scene-diagram"
    >
      <div class="scene-references" ref="references">
        <b>{{ state.initialized ? `HEAD → ${state.head}` : 'Project folder' }}</b>
        <span class="text-label">{{
          state.initialized ? 'No commit yet' : 'Git not initialized'
        }}</span>
      </div>
      <div class="diagram-zones">
        <div class="diagram-zone working-zone" ref="workingZone">
          <h3>Working directory</h3>
          <svg viewBox="0 0 240 240" class="ink-illustration" aria-hidden="true">
            <ScenePlatform />
            <g v-if="file" ref="fileGraphic">
              <ellipse cx="120" cy="173" rx="36" ry="6" class="fill-ground-shadow" />
              <path d="M76 18h64l24 24v111H76Z" transform="translate(3 4)" class="fill-outline" />
              <path d="M76 18h64l24 24v111H76Z" class="fill-sheet stroke-outline" />
              <path
                d="M140 18v24h24M93 67h52m-52 14h42m-42 14h47"
                class="fill-none stroke-outline"
              />
            </g>
          </svg>
          <div v-if="file">
            <p>
              <code>{{ file.name }}</code>
            </p>
            <p class="text-label">
              {{ file.status === 'untracked' ? 'Untracked' : 'Existing file' }}
            </p>
          </div>
        </div>
        <div class="diagram-zone staging-zone">
          <h3>Staging area</h3>
          <svg viewBox="0 0 240 240" class="ink-illustration empty-zone" aria-hidden="true">
            <ScenePlatform />
            <path d="M95 151h50m-25-10v20" class="fill-none stroke-muted" stroke-dasharray="3 5" />
          </svg>
          <p>{{ state.initialized ? 'Empty' : 'Not set up yet' }}</p>
        </div>
        <div class="diagram-zone history-zone">
          <h3>Recorded history</h3>
          <svg viewBox="0 0 240 240" class="ink-illustration empty-zone" aria-hidden="true">
            <ScenePlatform />
            <path d="M95 151h50" class="fill-none stroke-muted" stroke-dasharray="3 5" />
          </svg>
          <p>No commits</p>
        </div>
      </div>
    </div>
    <figcaption id="scene-description" class="scene-note">
      <InlineText :text="description" />
    </figcaption>
  </figure>
</template>
