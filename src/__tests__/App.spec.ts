import { afterEach, beforeEach, expect, it, onTestFinished, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'
import { createMemoryHistory, createWebHistory } from 'vue-router'
import { createCourseRouter } from '@/router'

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

it('renders a settled step when Vue Router navigates to a lesson URL', async () => {
  const router = createCourseRouter(createMemoryHistory())
  await router.push('/')
  const wrapper = mount(App, { global: { plugins: [router] } })
  onTestFinished(() => wrapper.unmount())
  await router.push('/start-a-repository/2')
  expect(wrapper.get('[role="status"]').text()).toContain('Step 2 of 3')
  expect(wrapper.get('figure').attributes('aria-busy')).toBe('false')
})

async function mountAtBrowserLocation() {
  const browserHistory = createWebHistory('/')
  const router = createCourseRouter(browserHistory)
  const wrapper = mount(App, { global: { plugins: [router] } })
  onTestFinished(() => {
    wrapper.unmount()
    browserHistory.destroy()
  })
  await router.isReady()
  return wrapper
}

it('opens the first lesson from the application root', async () => {
  history.replaceState(null, '', '/')
  const wrapper = await mountAtBrowserLocation()
  expect(wrapper.get('h1').text()).toBe('Start a repository')
  expect(location.pathname).toBe('/start-a-repository/1')
})

it('reads a recorded ideas snapshot without changing the main checkout or location', async () => {
  const path = '/create-and-switch-branches/6'
  history.replaceState(null, '', path)
  const wrapper = await mountAtBrowserLocation()
  const scene = wrapper.get('figure[aria-label="Repository illustration"]')
  const checkout = scene.get('[aria-label="Checked-out contents"]')
  const checkoutBefore = checkout.text()
  const inspector = scene.get('[aria-label="Recorded snapshot inspector"]')
  inspector.element.closest('details')!.open = true

  await inspector.get('button[aria-label="Inspect c3"]').trigger('click')

  expect(inspector.text()).toContain('Draw the history as a map.')
  expect(scene.text()).toContain('HEAD → main → c2')
  expect(checkout.text()).toBe(checkoutBefore)
  expect(location.pathname).toBe(path)
})
