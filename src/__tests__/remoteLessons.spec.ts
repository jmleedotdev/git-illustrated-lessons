import { expect, it } from 'vitest'
import { lessons } from '../lessons/catalog'
import type { RepositoryState } from '../lessons/lesson'
import { createPlayer } from '../player/createPlayer'

const notesB = {
  name: 'notes.txt',
  version: 'B',
  contents: 'A little less magic.\nGit keeps a history.\n',
}
const notesC = {
  ...notesB,
  version: 'C',
  contents: 'A little less magic.\nGit keeps a history.\nOnly selected contents go in.\n',
}
const notesD = {
  ...notesB,
  version: 'D',
  contents: 'A little less magic.\nGit keeps a history.\nOnly staged contents go into a commit.\n',
}
const ideas = { name: 'ideas.txt', contents: 'Draw the history as a map.\n' }
const emptyHosted = { name: 'git-notes', commits: [], files: [], branches: {} }

function expectCleanLocalHistory(state: RepositoryState) {
  expect(state.initialized).toBe(true)
  expect(state.head).toBe('main')
  expect(state.branches).toEqual({ main: 'c5', ideas: 'c3' })
  expect(state.commits).toEqual([
    { id: 'c1', parents: [], snapshot: [notesB] },
    { id: 'c2', parents: ['c1'], snapshot: [notesC] },
    { id: 'c3', parents: ['c2'], snapshot: [notesC, ideas] },
    { id: 'c4', parents: ['c2'], snapshot: [notesD] },
    { id: 'c5', parents: ['c4', 'c3'], snapshot: [notesD, ideas] },
  ])
  expect(state.staged).toEqual([notesD, ideas])
  expect(state.working).toEqual([
    { ...notesD, status: 'tracked' },
    { ...ideas, status: 'tracked' },
  ])
}

it('creates an empty GitHub repository without changing local history or configuring a remote', () => {
  const player = createPlayer(lessons)
  player.restore('#/create-a-remote-repository/1')
  expect(player.lesson.value.title).toBe('Create a remote repository')
  const opening = player.presentation.value.state
  expectCleanLocalHistory(opening)
  expect(opening.remoteSetup).toEqual({ hosted: null, origin: null, upstream: null })

  player.next()
  const creation = player.presentation.value
  expect(creation.transition?.before).toEqual(opening)
  expectCleanLocalHistory(creation.state)
  expect(creation.state.remoteSetup).toEqual({ hosted: emptyHosted, origin: null, upstream: null })
  expect(player.canNext.value).toBe(false)
})

it('opens the empty hosted repository independently and stores only the origin address', () => {
  const player = createPlayer(lessons)
  player.restore('#/connect-local-and-remote/1')
  expect(player.lesson.value.title).toBe('Connect local and remote')
  const opening = player.presentation.value.state
  expectCleanLocalHistory(opening)
  expect(opening.remoteSetup).toEqual({ hosted: emptyHosted, origin: null, upstream: null })

  player.restore('#/connect-local-and-remote/2')
  expect(player.presentation.value.transition).toBeNull()
  const configured = player.presentation.value.state
  expectCleanLocalHistory(configured)
  expect(configured.remoteSetup).toEqual({
    hosted: emptyHosted,
    origin: 'https://github.com/alice-example/git-notes.git',
    upstream: null,
  })
  expect(player.step.value.action?.text).toBe(
    'git remote add origin https://github.com/alice-example/git-notes.git',
  )
  player.replay()
  expect(player.presentation.value.transition?.before).toEqual(opening)
  player.setReducedMotion(true)
  expect(player.presentation.value.transition).toBeNull()
  expect(player.presentation.value.state).toEqual(configured)
})
