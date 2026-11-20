import { expect, it } from 'vitest'
import { lessons } from '../lessons/catalog'
import { createPlayer } from '../player/createPlayer'
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

it('records only the staged contents in the root commit without clearing staging', () => {
  const player = createPlayer(lessons)
  player.restore('#/record-a-commit/1')
  const opening = player.presentation.value.state
  expect(opening.commits).toEqual([])
  expect(opening.working[0]?.version).toBe('C')
  expect(opening.staged[0]?.version).toBe('B')

  player.next()
  const recorded = player.presentation.value.state
  expect(recorded.commits).toEqual([
    {
      id: 'c1',
      parents: [],
      snapshot: [
        {
          name: 'notes.txt',
          version: 'B',
          contents: 'A little less magic.\nGit keeps a history.\n',
        },
      ],
    },
  ])
  expect(recorded.branchTip).toBe('c1')
  expect(recorded.staged).toEqual(opening.staged)
  expect(recorded.working).toEqual(opening.working)
})

it('opens history independently at c1 and ends clean after recording and reading c2', () => {
  const player = createPlayer(lessons)
  player.restore('#/read-the-history/1')
  expect(player.location.value.slug).toBe('read-the-history')
  const opening = player.presentation.value.state
  expect(opening.commits.map(({ id }) => id)).toEqual(['c1'])
  expect(opening.working[0]?.version).toBe('C')
  expect(opening.staged[0]?.version).toBe('B')

  player.next()
  expect(player.presentation.value.state).toMatchObject({
    branchTip: 'c1',
    staged: [{ version: 'C' }],
  })
  player.next()
  const recorded = player.presentation.value.state
  expect(recorded.branchTip).toBe('c2')
  expect(recorded.commits[1]).toEqual({
    id: 'c2',
    parents: ['c1'],
    snapshot: [
      {
        name: 'notes.txt',
        version: 'C',
        contents: 'A little less magic.\nGit keeps a history.\nOnly selected contents go in.\n',
      },
    ],
  })
  expect(recorded.staged).toEqual(recorded.commits[1]?.snapshot)
  expect(recorded.working).toEqual([{ ...recorded.staged[0], status: 'tracked' }])
  player.next()
  expect(player.step.value.action.text).toBe('git log')
  expect(player.presentation.value.state).toEqual(recorded)

  player.openLesson('read-the-history')
  expect(player.presentation.value.state).toEqual(opening)
  player.openLesson('record-a-commit')
  expect(player.presentation.value.state.commits).toEqual([])
})
