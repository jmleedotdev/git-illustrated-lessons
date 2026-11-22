import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Lesson } from '@/types/lesson'
import { createPlayer, type PlayerLocation } from './createPlayer'

function lessonRoute(location: PlayerLocation) {
  return { name: 'lesson', params: { ...location } }
}

export function useRoutedPlayer(lessons: readonly Lesson[]) {
  const route = useRoute()
  const router = useRouter()
  let pending: { path: string; animate: boolean } | undefined
  const player = createPlayer(lessons, async (location, animate) => {
    const target = lessonRoute(location)
    const path = router.resolve(target).fullPath
    if (path === route.fullPath && !pending) {
      player.show(location, animate)
      return
    }

    const intent = { path, animate }
    pending = intent
    try {
      await router.push(target)
    } finally {
      if (pending === intent) pending = undefined
    }
  })

  watch(
    () => route.fullPath,
    (path) => {
      if (route.name !== 'lesson') return
      // Only the lesson control that requested this navigation can animate it.
      const animate = pending?.path === path && pending.animate
      pending = undefined
      player.show({ slug: String(route.params.slug), step: Number(route.params.step) }, animate)
    },
    { immediate: true, flush: 'sync' },
  )

  return {
    player,
    lessonHref: (slug: string) => router.resolve(lessonRoute({ slug, step: 1 })).href,
  }
}
