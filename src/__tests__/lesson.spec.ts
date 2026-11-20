import { expect, it } from 'vitest'
import { chooseWhatToStage } from '../lessons/chooseWhatToStage'
import { editAndInspect } from '../lessons/editAndInspect'
import { startRepository } from '../lessons/startRepository'

it('initializes main without tracking the existing file or inventing history', () => {
  const [folder, initialize, inspect] = startRepository.steps
  expect(folder!.transition.before.initialized).toBe(false)
  expect(folder!.transition.after.initialized).toBe(false)
  expect(folder!.transition.after.working[0]?.status).toBe('existing')
  expect(initialize!.transition.before).toEqual(folder!.transition.after)
  expect(initialize!.transition.after).toEqual({
    initialized: true,
    head: 'main',
    working: [{ name: 'notes.txt', contents: 'A little less magic.\n', status: 'untracked' }],
    staged: [],
    commits: [],
  })
  expect(inspect!.transition.before).toEqual(initialize!.transition.after)
  expect(inspect!.transition.after).toEqual(initialize!.transition.after)
  expect(Object.isFrozen(initialize!.transition.after.working[0])).toBe(true)
})

it('starts Edit and inspect in an initialized repository and leaves the edited note untracked', () => {
  const [edit, inspect] = editAndInspect.steps.map((step) => step.transition)
  expect(edit!.before).toEqual({
    initialized: true,
    head: 'main',
    working: [
      { name: 'notes.txt', contents: 'A little less magic.\n', status: 'untracked', version: 'A' },
    ],
    staged: [],
    commits: [],
  })
  expect(edit!.after.working[0]).toMatchObject({
    contents: 'A little less magic.\nGit keeps a history.\n',
    status: 'untracked',
  })
  expect(edit!.after.staged).toEqual([])
  expect(edit!.after.commits).toEqual([])
  expect(inspect!.before).toEqual(edit!.after)
  expect(inspect!.after).toEqual(edit!.after)
})

it('stages a copy of the edited note and keeps that version after another edit', () => {
  const [review, stage, editAgain] = chooseWhatToStage.steps.map((step) => step.transition)
  const untracked = review!.after
  const staged = stage!.after
  expect(untracked).toMatchObject({ initialized: true, head: 'main', staged: [], commits: [] })
  expect(untracked.working[0]).toMatchObject({ status: 'untracked', version: 'B' })
  expect(stage!.before).toEqual(untracked)
  expect(staged.working[0]).toEqual({ ...untracked.working[0], status: 'tracked' })
  expect(staged.staged).toEqual([
    { name: 'notes.txt', contents: 'A little less magic.\nGit keeps a history.\n', version: 'B' },
  ])
  expect(editAgain!.before).toEqual(staged)
  expect(editAgain!.after.working[0]).toEqual({
    name: 'notes.txt',
    contents: 'A little less magic.\nGit keeps a history.\nOnly selected contents go in.\n',
    status: 'tracked',
    version: 'C',
  })
  expect(editAgain!.after.staged).toEqual(staged.staged)
  expect(staged.commits).toEqual([])
  expect(editAgain!.after.commits).toEqual([])
})
