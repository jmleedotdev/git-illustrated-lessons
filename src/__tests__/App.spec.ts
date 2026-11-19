import { expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

it('opens the first lesson from the application root', () => {
  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }))
  history.replaceState(null, '', '/')
  const wrapper = mount(App)
  expect(wrapper.get('h1').text()).toBe('Start a repository')
  expect(location.hash).toBe('#/start-a-repository/1')
  wrapper.unmount()
  vi.unstubAllGlobals()
})
