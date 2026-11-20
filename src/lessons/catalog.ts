import { chooseWhatToStage } from './chooseWhatToStage'
import { editAndInspect } from './editAndInspect'
import type { Lesson } from './lesson'
import { startRepository } from './startRepository'

export const lessons: readonly Lesson[] = Object.freeze([
  startRepository,
  editAndInspect,
  chooseWhatToStage,
])
