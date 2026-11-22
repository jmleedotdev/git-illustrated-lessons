import { expect, test } from '@playwright/test'

const push = '/push-the-work/'

test('opens each push step independently and shows the hosted snapshot without publishing ideas as a branch', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  const figure = page.getByRole('figure', { name: 'Local and GitHub repositories' })
  const diagram = figure.getByRole('img')
  for (const step of [1, 2, 3]) {
    await page.goto(push + step)
    await page.reload()
    await expect(page).toHaveURL(push + step)
    await expect(figure).toHaveAttribute('aria-busy', 'false')
    await expect(diagram.getByText('HEAD → main → c5', { exact: true })).toBeVisible()
    await expect(diagram.getByText('* main', { exact: true })).toBeVisible()
    await expect(diagram.getByText('ideas', { exact: true })).toHaveCount(1)
    await expect(diagram.getByText('origin', { exact: true })).toBeVisible()
    await expect(diagram.getByText('push', { exact: true })).toHaveCount(step === 1 ? 0 : 1)
    await expect(diagram.getByText('main', { exact: true })).toHaveCount(step === 1 ? 0 : 1)
    for (const id of ['c1', 'c2', 'c3', 'c4', 'c5']) {
      await expect(diagram.getByText(id, { exact: true })).toHaveCount(step === 1 ? 1 : 2)
    }
    await expect(diagram).toHaveAccessibleDescription(
      step === 1 ? /No upstream is configured/ : /no hosted ideas branch.*origin\/main/,
    )
    await expect(page.getByLabel('Git command')).toHaveText(
      step === 2 ? ['git push -u origin main'] : [],
    )
  }
  await expect(page.getByText(/Bob sees notes\.txt and ideas\.txt as recorded in c5/)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeDisabled()
  await expect(page.getByRole('link', { name: /^Next:/ })).toHaveCount(0)
})

test('push moves hosted copies while local history stays put, and Replay can be interrupted', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/connect-local-and-remote/2')
  await page.getByRole('link', { name: 'Next: Push the work' }).press('Enter')
  await expect(page.getByRole('heading', { name: 'Push the work' })).toBeFocused()
  await expect(page.getByRole('button', { name: 'Back', exact: true })).toBeDisabled()
  const figure = page.getByRole('figure', { name: 'Local and GitHub repositories' })
  const c5 = figure.getByRole('img').getByText('c5', { exact: true })
  await page.evaluate(() => document.fonts.ready.then(() => undefined))
  const openingPosition = await c5.boundingBox()
  await page.getByRole('button', { name: 'Next', exact: true }).press('Enter')
  await expect(page).toHaveURL(push + '2')
  await expect(page.getByRole('status')).toContainText('2 / 3')
  await expect(figure).toHaveAttribute('aria-busy', 'true')
  expect(await c5.first().boundingBox()).toEqual(openingPosition)
  await expect(figure).toHaveAttribute('aria-busy', 'false')
  // Restore the same step without animation, then replay it independently.
  await page.reload()
  await expect(figure).toHaveAttribute('aria-busy', 'false')
  await page.evaluate(() => document.fonts.ready.then(() => undefined))
  const localPosition = await c5.first().boundingBox()
  const hostedPosition = await c5.last().boundingBox()
  expect(hostedPosition!.x).toBeGreaterThan(localPosition!.x)
  const replay = figure.getByRole('button', { name: 'Replay' })
  await replay.press('Enter')
  await expect(figure).toHaveAttribute('aria-busy', 'true')
  expect(await c5.first().boundingBox()).toEqual(localPosition)
  expect((await c5.last().boundingBox())!.x).toBeLessThan(hostedPosition!.x)
  await expect(replay).toBeFocused()
  await expect(replay).toHaveCSS('outline-style', 'solid')
  await expect(figure).toHaveAttribute('aria-busy', 'false')
  await expect(page).toHaveURL(push + '2')

  await replay.press('Enter')
  await expect(figure).toHaveAttribute('aria-busy', 'true')
  await page.getByRole('button', { name: 'Step 1: Ready to push' }).press('Enter')
  await expect(figure).toHaveAttribute('aria-busy', 'false')
  await expect(c5).toHaveCount(1)
  await page.goBack()
  await expect(page).toHaveURL(push + '2')
  await expect(figure).toHaveAttribute('aria-busy', 'false')
  await expect(c5).toHaveCount(2)
  await page.goForward()
  await expect(page).toHaveURL(push + '1')
  await page.goBack()

  await replay.press('Enter')
  await expect(figure).toHaveAttribute('aria-busy', 'true')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(replay).toBeDisabled()
  await expect(replay).toHaveAccessibleDescription('Unavailable with reduced motion.')
  await expect(figure).toHaveAttribute('aria-busy', 'false')
  await expect(c5.last()).toBeVisible()
  expect((await c5.last().boundingBox())!.x).toBeGreaterThan((await c5.first().boundingBox())!.x)
  expect(await figure.evaluate((el) => el.getAnimations({ subtree: true }).length)).toBe(0)
  await expect(page).toHaveURL(push + '2')
})

test('the phone text scene communicates the push and the guide clears the fixed bar', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(push + '2')
  const figure = page.getByRole('figure', { name: 'Local and GitHub repositories' })
  await expect(figure.getByRole('img')).toBeHidden()
  await expect(figure.getByText(/Push sent main’s history/)).toBeVisible()
  await expect(figure.getByText(/main → c5 · c1–c5/)).toHaveCSS('font-size', '16px')
  await expect(figure.getByRole('button', { name: 'Replay' })).toBeDisabled()
  await page.getByRole('button', { name: 'Next', exact: true }).press('Enter')
  await expect(page).toHaveURL(push + '3')
  const words = page.getByText('Diagram in words', { exact: true })
  await words.press('Enter')
  await expect(words).toBeFocused()
  const bar = (await page.getByRole('navigation', { name: 'Walkthrough' }).boundingBox())!
  await expect
    .poll(async () => {
      const box = (await words.boundingBox())!
      return box.height >= 44 && box.width >= 44 && box.y + box.height < bar.y
    })
    .toBe(true)
  const description = page.getByText(/The arrows point to parents/)
  await expect(description).toHaveCSS('font-size', '16px')
  await description.scrollIntoViewIfNeeded()
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320)
  const textBox = (await description.boundingBox())!
  expect(textBox.y + textBox.height).toBeLessThan(bar.y)
})
