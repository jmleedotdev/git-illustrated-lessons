import { bringWorkTogether } from './bringWorkTogether'
import { chooseWhatToStage } from './chooseWhatToStage'
import { createAndSwitchBranches } from './createAndSwitchBranches'
import { editAndInspect } from './editAndInspect'
import type { Lesson } from './lesson'
import { readHistory } from './readHistory'
import { recordCommit } from './recordCommit'
import { connectLocalAndRemote, createRemoteRepository } from './remoteSetup'
import { startRepository } from './startRepository'

export const lessons: readonly Lesson[] = Object.freeze([
  startRepository,
  editAndInspect,
  chooseWhatToStage,
  recordCommit,
  readHistory,
  createAndSwitchBranches,
  bringWorkTogether,
  createRemoteRepository,
  connectLocalAndRemote,
])
