import { computed, readonly, shallowRef } from 'vue'
import type { Lesson, LessonStep, RepositoryState } from '../lessons/lesson'

export interface PlayerLocation {
  readonly slug: string
  readonly step: number
}
export interface Presentation {
  readonly state: RepositoryState
  readonly kind: LessonStep['transition']['kind']
  readonly transition: LessonStep['transition'] | null
}

/** Owns reader intent, never commands, drawing geometry, or animation timing. */
export function createPlayer(catalog: readonly Lesson[]) {
  const [first] = catalog
  if (!first || !catalog.every((lesson) => lesson.steps.length > 0)) {
    throw new Error('A player requires implemented lessons with at least one step.')
  }
  const defaultLesson = first
  const location = shallowRef<PlayerLocation>({ slug: first.slug, step: 1 })
  const lesson = computed(() => catalog.find((item) => item.slug === location.value.slug)!)
  const step = computed(() => lesson.value.steps[location.value.step - 1]!)
  const reducedMotion = shallowRef(false)
  const presentation = shallowRef<Presentation>({
    state: step.value.transition.after,
    kind: step.value.transition.kind,
    transition: null,
  })
  const canBack = computed(() => location.value.step > 1)
  const canNext = computed(() => location.value.step < lesson.value.steps.length)
  const nextLesson = computed(() => catalog[catalog.indexOf(lesson.value) + 1] ?? null)

  function present(animate: boolean) {
    presentation.value = {
      state: step.value.transition.after,
      kind: step.value.transition.kind,
      transition: animate && !reducedMotion.value ? step.value.transition : null,
    }
  }
  function go(slug: string, number: number, animate = false) {
    const known = catalog.find((item) => item.slug === slug)
    const destination = known ?? defaultLesson
    const valid =
      !!known && Number.isInteger(number) && number >= 1 && number <= destination.steps.length
    location.value = { slug: destination.slug, step: valid ? number : 1 }
    present(animate)
  }
  return {
    location: readonly(location),
    hash: computed(() => `#/${location.value.slug}/${location.value.step}`),
    restore: (hash: string) => {
      const match = /^#\/([a-z0-9-]+)\/([1-9]\d*)$/.exec(hash)
      go(match?.[1] ?? defaultLesson.slug, match ? Number(match[2]) : 1)
    },
    lesson,
    step,
    presentation: readonly(presentation),
    reducedMotion: readonly(reducedMotion),
    canBack,
    canNext,
    nextLesson,
    select: (number: number) => go(lesson.value.slug, number),
    openLesson: (slug: string) => go(slug, 1),
    back: () => {
      if (canBack.value) go(lesson.value.slug, location.value.step - 1, true)
    },
    next: () => {
      if (canNext.value) go(lesson.value.slug, location.value.step + 1, true)
    },
    openNextLesson: () => {
      if (!canNext.value && nextLesson.value) go(nextLesson.value.slug, 1)
    },
    replay: () => {
      if (!reducedMotion.value) present(true)
    },
    setReducedMotion: (value: boolean) => {
      reducedMotion.value = value
      if (value) present(false)
    },
  }
}
