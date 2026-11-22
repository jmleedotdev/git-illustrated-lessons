import type { Locator } from '@playwright/test'

export function documentBounds(element: Locator) {
  return element.evaluate((node) => {
    const { x, y, width, height } = node.getBoundingClientRect()
    return { x: x + window.scrollX, y: y + window.scrollY, width, height }
  })
}
