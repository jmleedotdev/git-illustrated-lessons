import process from 'node:process'
import { expect, test } from '@playwright/test'

if (process.env.CI) {
  test('production cannot render the development showcase', async ({ page }) => {
    // SPA fallback is acceptable; returning the development entry is not.
    await page.goto('/__design/')
    await expect(page.getByRole('heading', { name: 'Start a repository' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Paper, ink & Git.' })).toHaveCount(0)
    await expect(page.locator('script[src*="/src/dev/"]')).toHaveCount(0)
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(244, 235, 224)')
    const font = await page.evaluate(async () => {
      await document.fonts.ready
      return document.fonts.check('16px "JetBrains Mono"')
    })
    expect(font).toBe(true)
  })
} else {
  test('development displays compiled tokens and usable control states', async ({ page }) => {
    await page.goto('/__design/')
    await expect(page.getByRole('heading', { name: 'Paper, ink & Git.' })).toBeVisible()
    // These computed values exercise the compiled utilities and reset overrides.
    await expect(page.locator('main')).toHaveCSS('padding-top', '32px')
    await expect(page.locator('.story-text').first()).toHaveCSS('font-size', '16px')
    await expect(page.locator('pre')).toHaveCSS('background-color', 'rgb(48, 41, 35)')
    await expect(page.locator('svg[role="img"]')).toHaveCSS('display', 'block')
    const button = page.getByRole('button', { name: 'Default', exact: true })
    await page.keyboard.press('Tab')
    await expect(button).toBeFocused()
    await expect(button).toHaveCSS('outline-color', 'rgb(163, 55, 35)')
    await expect(button).toHaveCSS('outline-width', '3px')
    const primary = page.getByRole('button', { name: 'Hover me' })
    await expect(primary).toHaveCSS('background-color', 'rgb(240, 80, 50)')
    await primary.hover()
    await expect(primary).toHaveCSS('background-color', 'rgb(245, 181, 162)')
    await expect(page.getByRole('button', { name: 'Disabled', exact: true })).toBeDisabled()
  })
}
