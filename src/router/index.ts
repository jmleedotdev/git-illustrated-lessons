import { createRouter, createWebHistory, type RouterHistory } from 'vue-router'
import { lessons } from '@/data/lessons/catalog'
import LessonView from '@/views/LessonView.vue'

const firstLesson = lessons[0]!

export function createCourseRouter(
  history: RouterHistory = createWebHistory(import.meta.env.BASE_URL),
) {
  const router = createRouter({
    history,
    routes: [
      {
        path: '/:slug/:step',
        name: 'lesson',
        component: LessonView,
        props: (route) => {
          const entry = route.redirectedFrom ?? route
          return {
            playOpeningStep: entry.path === '/' || entry.path === `/${firstLesson.slug}/1`,
          }
        },
      },
      { path: '/:pathMatch(.*)*', component: LessonView },
    ],
  })

  router.beforeEach((to) => {
    const match = /^\/([a-z0-9-]+)\/([1-9]\d*)$/.exec(to.path)
    const lesson = lessons.find(({ slug }) => slug === match?.[1])
    const step = Number(match?.[2])
    if (lesson && step <= lesson.steps.length) return

    return {
      name: 'lesson',
      params: { slug: (lesson ?? firstLesson).slug, step: 1 },
      query: to.query,
      replace: true,
    }
  })

  return router
}
