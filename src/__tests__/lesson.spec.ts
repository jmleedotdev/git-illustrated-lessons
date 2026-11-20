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
  expect(recorded.branches).toEqual({ main: 'c1' })
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
    branches: { main: 'c1' },
    staged: [{ version: 'C' }],
  })
  player.next()
  const recorded = player.presentation.value.state
  expect(recorded.branches).toEqual({ main: 'c2' })
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

it('opens Bring work together independently with a clean main and the ideas snapshot intact', () => {
  const player = createPlayer(lessons)
  player.restore('#/bring-work-together/1')
  expect(player.location.value.slug).toBe('bring-work-together')
  expect(player.presentation.value.transition).toBeNull()
  const opening = player.presentation.value.state
  const earlier = {
    name: 'notes.txt',
    version: 'B',
    contents: 'A little less magic.\nGit keeps a history.\n',
  }
  const note = {
    ...earlier,
    version: 'C',
    contents: earlier.contents + 'Only selected contents go in.\n',
  }
  expect(opening).toEqual({
    initialized: true,
    head: 'main',
    branches: { main: 'c2', ideas: 'c3' },
    working: [{ ...note, status: 'tracked' }],
    staged: [note],
    commits: [
      { id: 'c1', parents: [], snapshot: [earlier] },
      { id: 'c2', parents: ['c1'], snapshot: [note] },
      {
        id: 'c3',
        parents: ['c2'],
        snapshot: [note, { name: 'ideas.txt', contents: 'Draw the history as a map.\n' }],
      },
    ],
  })
})

it('edits, stages, then records diverging notes on main without moving ideas', () => {
  const player = createPlayer(lessons)
  player.restore('#/bring-work-together/1')
  const opening = player.presentation.value.state
  const revised = {
    name: 'notes.txt',
    version: 'D',
    contents:
      'A little less magic.\nGit keeps a history.\nOnly staged contents go into a commit.\n',
  }
  player.next()
  const edited = player.presentation.value.state
  expect(edited).toEqual({ ...opening, working: [{ ...revised, status: 'tracked' }] })
  player.next()
  const staged = player.presentation.value.state
  expect(staged).toEqual({ ...edited, staged: [revised] })
  player.next()
  expect(player.presentation.value.state).toEqual({
    ...staged,
    branches: { main: 'c4', ideas: 'c3' },
    commits: [...opening.commits, { id: 'c4', parents: ['c2'], snapshot: [revised] }],
  })
})

it('joins both histories in order and ends with a clean main without deleting ideas', () => {
  const player = createPlayer(lessons)
  player.restore('#/bring-work-together/4')
  const diverged = player.presentation.value.state
  player.next()
  expect(player.step.value.action.text).toBe('git merge ideas')
  const merged = player.presentation.value.state
  const combined = [diverged.commits[3]!.snapshot[0]!, diverged.commits[2]!.snapshot[1]!]
  expect(merged).toEqual({
    ...diverged,
    branches: { main: 'c5', ideas: 'c3' },
    commits: [...diverged.commits, { id: 'c5', parents: ['c4', 'c3'], snapshot: combined }],
    working: combined.map((file) => ({ ...file, status: 'tracked' })),
    staged: combined,
  })

  const direct = createPlayer(lessons)
  direct.restore('#/bring-work-together/5')
  expect(direct.presentation.value).toMatchObject({ state: merged, transition: null })
  direct.replay()
  expect(direct.presentation.value.transition).toMatchObject({ before: diverged, after: merged })
})

it('creates a second reference to c2 without switching or copying the checkout', () => {
  const player = createPlayer(lessons)
  player.restore('#/create-and-switch-branches/1')
  expect(player.location.value.slug).toBe('create-and-switch-branches')
  const { before, after } = player.step.value.transition
  expect(before).toMatchObject({ head: 'main', branches: { main: 'c2' } })
  expect(before.branches).toEqual({ main: 'c2' })
  expect(before.commits.map(({ id, parents }) => [id, parents])).toEqual([
    ['c1', []],
    ['c2', ['c1']],
  ])
  expect(before.staged).toEqual(before.commits[1]?.snapshot)
  expect(before.working).toEqual([{ ...before.staged[0], status: 'tracked' }])
  expect(after).toEqual({ ...before, branches: { main: 'c2', ideas: 'c2' } })
  expect(Object.isFrozen(before.branches)).toBe(true)
  expect(Object.isFrozen(before.commits[1]?.snapshot[0])).toBe(true)
})

it('advances only ideas and restores the clean main checkout without losing c3', () => {
  const player = createPlayer(lessons)
  player.restore('#/create-and-switch-branches/1')
  const created = player.presentation.value.state
  player.next()
  const switched = player.presentation.value.state
  expect(switched).toEqual({ ...created, head: 'ideas' })

  player.next()
  const edited = player.presentation.value.state
  const idea = { name: 'ideas.txt', contents: 'Draw the history as a map.\n' }
  expect(edited.working).toEqual([...switched.working, { ...idea, status: 'untracked' }])
  expect(edited.staged).toEqual(switched.staged)
  player.next()
  const staged = player.presentation.value.state
  expect(staged.staged).toEqual([...switched.staged, idea])
  expect(staged.commits).toEqual(switched.commits)

  player.next()
  const recorded = player.presentation.value.state
  expect(recorded.head).toBe('ideas')
  expect(recorded.branches).toEqual({ main: 'c2', ideas: 'c3' })
  expect(recorded.commits).toEqual([
    ...switched.commits,
    { id: 'c3', parents: ['c2'], snapshot: [...switched.staged, idea] },
  ])
  player.next()
  const restored = player.presentation.value.state
  expect(restored).toEqual({
    ...recorded,
    head: 'main',
    working: created.working,
    staged: created.staged,
  })
  player.openLesson('create-and-switch-branches')
  expect(player.presentation.value.state).toEqual(created)
  expect(player.presentation.value.state.branches).toEqual({ main: 'c2', ideas: 'c2' })
})
