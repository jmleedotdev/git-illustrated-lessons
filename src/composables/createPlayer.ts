import { computed, readonly, shallowRef } from 'vue'
import type { Lesson, LessonStep, RepositoryState } from '@/types/lesson'

export interface PlayerLocation {
  readonly slug: string
  readonly step: number
}
export interface Presentation {
  readonly state: RepositoryState
  readonly kind: LessonStep['transition']['kind']
  readonly transition: LessonStep['transition'] | null
}

type Navigate = (location: PlayerLocation, animate: boolean) => void | Promise<void>

/** Owns presentation and reader intent, not browser history or animation timing. */
export function createPlayer(catalog: readonly Lesson[], navigate?: Navigate) {
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
  const lessonIndex = computed(() => catalog.indexOf(lesson.value))
  const previousLesson = computed(() => catalog[lessonIndex.value - 1] ?? null)
  const nextLesson = computed(() => catalog[lessonIndex.value + 1] ?? null)

  function present(animate: boolean) {
    presentation.value = {
      state: step.value.transition.after,
      kind: step.value.transition.kind,
      transition: animate && !reducedMotion.value ? step.value.transition : null,
    }
  }
  function show(destination: PlayerLocation, animate = false) {
    location.value = destination
    present(animate)
  }
  function go(slug: string, number: number, animate = false) {
    const known = catalog.find((item) => item.slug === slug)
    const destination = known ?? defaultLesson
    const valid =
      !!known && Number.isInteger(number) && number >= 1 && number <= destination.steps.length
    const target = { slug: destination.slug, step: valid ? number : 1 }
    return (navigate ?? show)(target, animate)
  }
  return {
    location: readonly(location),
    show,
    lesson,
    step,
    presentation: readonly(presentation),
    reducedMotion: readonly(reducedMotion),
    canBack,
    canNext,
    previousLesson,
    nextLesson,
    select: (number: number) => go(lesson.value.slug, number),
    openLesson: (slug: string) => go(slug, 1),
    back: () => {
      if (canBack.value) return go(lesson.value.slug, location.value.step - 1, true)
    },
    next: () => {
      if (canNext.value) return go(lesson.value.slug, location.value.step + 1, true)
    },
    openPreviousLesson: () => {
      const destination = previousLesson.value
      if (!canBack.value && destination) return go(destination.slug, 1, true)
    },
    openNextLesson: () => {
      if (!canNext.value && nextLesson.value) return go(nextLesson.value.slug, 1, true)
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
