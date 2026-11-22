import { expect, it } from 'vitest'
import { lessons } from '@/data/lessons/catalog'
import type { RepositoryState } from '@/types/lesson'
import { createPlayer } from '@/composables/createPlayer'

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
const emptyHosted = {
  owner: 'alice-example',
  name: 'git-notes',
  commits: [],
  files: [],
  branches: {},
}

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
  player.show({ slug: 'create-a-remote-repository', step: 1 })
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
  player.show({ slug: 'connect-local-and-remote', step: 1 })
  expect(player.lesson.value.title).toBe('Connect local and remote')
  const opening = player.presentation.value.state
  expectCleanLocalHistory(opening)
  expect(opening.remoteSetup).toEqual({ hosted: emptyHosted, origin: null, upstream: null })

  player.show({ slug: 'connect-local-and-remote', step: 2 })
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

it('publishes main’s committed ancestry and sets its upstream without publishing a separate ideas branch', () => {
  const player = createPlayer(lessons)
  player.show({ slug: 'push-the-work', step: 1 })
  expect(player.lesson.value.title).toBe('Push the work')
  const opening = player.presentation.value.state
  expectCleanLocalHistory(opening)
  expect(opening.remoteSetup).toEqual({
    hosted: emptyHosted,
    origin: 'https://github.com/alice-example/git-notes.git',
    upstream: null,
  })

  player.next()
  const publication = player.presentation.value
  expect(publication.transition?.before).toEqual(opening)
  expectCleanLocalHistory(publication.state)
  expect(publication.state.remoteSetup).toEqual({
    hosted: {
      ...emptyHosted,
      branches: { main: 'c5' },
      commits: opening.commits,
      files: [notesD, ideas],
    },
    origin: opening.remoteSetup?.origin,
    upstream: 'origin/main',
  })
  expect(player.step.value.action?.text).toBe('git push -u origin main')
  expect(player.step.value.idea).toMatch(/not uncommitted working-directory or staged contents/)

  player.show({ slug: 'push-the-work', step: 3 })
  expect(player.presentation.value.state).toEqual(publication.state)
  expect(player.step.value.story).toMatch(/`notes\.txt` and `ideas\.txt`.*`c5`/)
  expect(player.canNext.value).toBe(false)
  expect(player.nextLesson.value).toBeNull()
})
