import { expect, it } from 'vitest'
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
