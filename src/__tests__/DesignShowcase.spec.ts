import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import DesignShowcase from '../dev/DesignShowcase.vue'

it('presents the visual foundations with readable code and accessible examples', () => {
  const wrapper = mount(DesignShowcase)

  expect(wrapper.get('h1').text()).toBe('Paper, ink & Git.')
  expect(wrapper.get('pre code').text()).toBe('git init -b main')
  expect(wrapper.get('aside[aria-labelledby="key-idea"]').text()).toContain('Key idea')
  expect(wrapper.get('svg[role="img"] title').text()).toBe('Paper and ink illustration sample')
  expect(wrapper.get('button:disabled').text()).toBe('Disabled')
  expect(wrapper.get('button:disabled').attributes('disabled')).toBeDefined()
  expect(wrapper.get('.story-text code').text()).toBe('notes.txt')
})
