import type { Lesson } from '@/types/lesson'

export function freezeLesson(lesson: Lesson): Lesson {
  function freeze(value: unknown) {
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      Object.values(value).forEach(freeze)
      Object.freeze(value)
    }
  }
  freeze(lesson)
  return lesson
}
