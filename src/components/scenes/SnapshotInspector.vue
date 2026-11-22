<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Commit } from '@/types/lesson'
import { describeParents } from './describeParents'

const props = defineProps<{ commits: readonly Commit[]; branchTip?: string }>()
const selectedId = ref<string>()
const inspected = computed(
  () =>
    props.commits.find(({ id }) => id === selectedId.value) ??
    props.commits.find(({ id }) => id === props.branchTip),
)
</script>

<template>
  <details class="snapshot-details">
    <summary class="prerequisite-toggle">Inspect recorded snapshots</summary>
    <section aria-label="Recorded snapshot inspector">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="commit in [...commits].reverse()"
          :key="commit.id"
          type="button"
          class="control snapshot-control"
          :aria-label="`Inspect ${commit.id}`"
          :aria-pressed="commit.id === inspected?.id"
          @click="selectedId = commit.id"
        >
          {{ commit.id }}
        </button>
      </div>
      <div v-if="inspected" class="snapshot-contents" aria-live="polite">
        <p>
          <strong>{{ inspected.id }}</strong
          >:
          {{ describeParents(inspected.parents) }}
        </p>
        <div v-for="file in inspected.snapshot" :key="file.name">
          <p>
            <code>{{ file.name }}</code
            ><template v-if="file.version"> · Version {{ file.version }}</template>
          </p>
          <pre><code>{{ file.contents }}</code></pre>
        </div>
      </div>
    </section>
  </details>
</template>
