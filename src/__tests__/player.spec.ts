import { expect, it } from 'vitest'
import { createPlayer } from '../player/createPlayer'
import { lessons } from '../lessons/startRepository'

it('restores and normalizes hash locations without requesting motion', () => {
  const player = createPlayer(lessons)
  player.restore('#/start-a-repository/2')
  expect(player.location.value.step).toBe(2)
  expect(player.presentation.value.transition).toBeNull()
  player.replay()
  expect(player.presentation.value.transition?.kind).toBe('initialize')
  for (const hash of [
    '',
    '#/unknown/2',
    '#/start-a-repository/0',
    '#/start-a-repository/2.5',
    '#/start-a-repository/2/extra',
    '#/%/1',
    '#/start-a-repository/99',
  ]) {
    player.restore(hash)
    expect(player.hash.value).toBe('#/start-a-repository/1')
    expect(player.presentation.value.transition).toBeNull()
  }
})

it('selects steps within a lesson and requests motion only for Next and Replay', () => {
  const player = createPlayer(lessons)
  expect(player.location.value).toEqual({ slug: 'start-a-repository', step: 1 })
  expect(player.canBack.value).toBe(false)
  player.back()
  expect(player.location.value.step).toBe(1)
  player.next()
  expect(player.location.value.step).toBe(2)
  expect(player.presentation.value.transition?.kind).toBe('initialize')
  player.select(3)
  expect(player.canNext.value).toBe(false)
  expect(player.presentation.value.transition).toBeNull()
  player.next()
  expect(player.location.value.step).toBe(3)
  player.replay()
  expect(player.location.value.step).toBe(3)
  expect(player.presentation.value.transition?.kind).toBe('inspect')
  player.back()
  expect(player.presentation.value.transition).toBeNull()
  expect(player.nextLesson.value).toBeNull()
})

it('settles active playback when reduced motion changes and does not animate Replay', () => {
  const player = createPlayer(lessons)
  player.next()
  expect(player.presentation.value.transition?.kind).toBe('initialize')
  player.setReducedMotion(true)
  expect(player.presentation.value.transition).toBeNull()
  player.replay()
  expect(player.presentation.value.transition).toBeNull()
  expect(player.location.value.step).toBe(2)
  player.next()
  expect(player.presentation.value.transition).toBeNull()
  expect(player.location.value.step).toBe(3)
  player.setReducedMotion(false)
  expect(player.presentation.value.transition).toBeNull()
  player.replay()
  expect(player.presentation.value.transition?.kind).toBe('inspect')
})

it('offers a deliberate move to the next implemented lesson at the boundary', () => {
  const [first] = lessons
  const second = { ...first!, slug: 'second-lesson' }
  const player = createPlayer([first!, second])
  player.openNextLesson()
  expect(player.location.value.slug).toBe(first!.slug)
  player.select(first!.steps.length)
  player.next()
  expect(player.location.value.slug).toBe(first!.slug)
  player.openNextLesson()
  expect(player.location.value).toEqual({ slug: second.slug, step: 1 })
  expect(player.presentation.value.transition).toBeNull()
})
