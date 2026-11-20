import { afterEach, beforeEach, expect, it, onTestFinished, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

beforeEach(() => {
  vi.stubGlobal('matchMedia', () => ({
    matches: true,
    addEventListener() {},
    removeEventListener() {},
  }))
})

afterEach(() => {
  vi.unstubAllGlobals()
  history.replaceState(null, '', '/')
})

it('opens the first lesson from the application root', () => {
  history.replaceState(null, '', '/')
  const wrapper = mount(App)
  onTestFinished(() => wrapper.unmount())
  expect(wrapper.get('h1').text()).toBe('Start a repository')
  expect(location.hash).toBe('#/start-a-repository/1')
})

it('reads a recorded ideas snapshot without changing the main checkout or location', async () => {
  const hash = '#/create-and-switch-branches/6'
  history.replaceState(null, '', hash)
  const wrapper = mount(App)
  onTestFinished(() => wrapper.unmount())
  const scene = wrapper.get('figure[aria-label="Repository illustration"]')
  const checkout = scene.get('[aria-label="Checked-out contents"]')
  const checkoutBefore = checkout.text()
  const inspector = scene.get('[aria-label="Recorded snapshot inspector"]')
  inspector.element.closest('details')!.open = true

  await inspector.get('button[aria-label="Inspect c3"]').trigger('click')

  expect(inspector.text()).toContain('Draw the history as a map.')
  expect(scene.text()).toContain('HEAD → main → c2')
  expect(checkout.text()).toBe(checkoutBefore)
  expect(location.hash).toBe(hash)
})
