import { chooseWhatToStage } from './chooseWhatToStage'
import { editAndInspect } from './editAndInspect'
import type { Lesson } from './lesson'
import { readHistory } from './readHistory'
import { recordCommit } from './recordCommit'
import { startRepository } from './startRepository'

export const lessons: readonly Lesson[] = Object.freeze([
  startRepository,
  editAndInspect,
  chooseWhatToStage,
  recordCommit,
  readHistory,
])
