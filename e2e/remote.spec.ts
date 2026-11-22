import { expect, test } from '@playwright/test'

const create = '/create-a-remote-repository/'
const connect = '/connect-local-and-remote/'
const noTransfer = /No commits or files are sent/

test('opens every remote step directly with the correct final state', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  const figure = page.getByRole('figure', { name: 'Local and GitHub repositories' })
  const diagram = figure.getByRole('img', { name: 'Local and GitHub repository diagram' })
  for (const [location, hosted, origin] of [
    [create + '1', false, false],
    [create + '2', true, false],
    [connect + '1', true, false],
    [connect + '2', true, true],
  ] as const) {
    await page.goto(location)
    await page.reload()
    await expect(figure).toHaveAttribute('aria-busy', 'false')
    await expect(diagram.getByText('HEAD → main → c5', { exact: true })).toBeVisible()
    for (const id of ['c1', 'c2', 'c3', 'c4', 'c5']) {
      await expect(diagram.getByText(id, { exact: true })).toHaveCount(1)
    }
    await expect(diagram.getByText('alice-example / git-notes')).toHaveCount(Number(hosted))
    await expect(diagram.getByText('origin', { exact: true })).toHaveCount(Number(origin))
    await expect(diagram).toHaveAccessibleDescription(
      hosted ? /no commits, files, or main reference/ : /no hosted repository yet/,
    )
    await expect(page.getByLabel('Git command')).toHaveCount(Number(origin))
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1440)
  }
})

test('navigates both lessons and cancels only the configuration reveal on interruption', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(create + '1')
  const figure = page.getByRole('figure', { name: 'Local and GitHub repositories' })
  const diagram = figure.getByRole('img')
  const next = page.getByRole('button', { name: 'Next', exact: true })
  const back = page.getByRole('button', { name: 'Back', exact: true })
  const replay = figure.getByRole('button', { name: 'Replay' })
  const hostedName = diagram.getByText('alice-example / git-notes')
  const originLabel = diagram.getByText('origin', { exact: true })

  await expect(back).toBeDisabled()
  await expect(replay).toBeDisabled()
  await expect(replay).toHaveAccessibleDescription('Nothing changes in this step.')
  await next.press('Enter')
  await expect(page).toHaveURL(create + '2')
  await expect(figure).toHaveAttribute('aria-busy', 'true')
  await expect(hostedName).toBeVisible()
  await expect(figure).toHaveAttribute('aria-busy', 'false')
  await expect(next).toBeDisabled()
  await expect(page.getByRole('heading', { name: 'On GitHub · Illustrated' })).toBeVisible()
  await expect(page.getByText(/Leave README/)).toHaveText(
    /README.*\.gitignore.*license.*unselected/,
  )
  await expect(originLabel).toHaveCount(0)
  await page.getByRole('link', { name: 'Next: Connect local and remote' }).press('Enter')
  await expect(page).toHaveURL(connect + '1')
  await expect(page.getByRole('heading', { name: 'Connect local and remote' })).toBeFocused()
  await expect(back).toBeDisabled()

  await next.press('Enter')
  await expect(page).toHaveURL(connect + '2')
  await expect(figure).toHaveAttribute('aria-busy', 'true')
  await expect(originLabel).toBeVisible()
  await expect(diagram).toHaveAccessibleDescription(/dashed line.*not a transfer/)
  await expect(figure.getByText(noTransfer)).toBeVisible()
  await expect(figure).toHaveAttribute('aria-busy', 'false')
  await expect(next).toBeDisabled()

  const c5 = diagram.getByText('c5', { exact: true })
  const position = await c5.boundingBox()
  await replay.press('Enter')
  await expect(figure).toHaveAttribute('aria-busy', 'true')
  await expect(c5).toBeVisible()
  expect(await c5.boundingBox()).toEqual(position)
  await page.getByRole('button', { name: 'Step 1: Two repositories' }).press('Enter')
  await expect(figure).toHaveAttribute('aria-busy', 'false')
  await expect(originLabel).toHaveCount(0)
  await page.goBack()
  await expect(diagram.getByText('origin', { exact: true })).toBeVisible()
  await expect(figure).toHaveAttribute('aria-busy', 'false')

  await replay.press('Enter')
  await expect(figure).toHaveAttribute('aria-busy', 'true')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(replay).toBeDisabled()
  await expect(replay).toHaveAccessibleDescription('Unavailable with reduced motion.')
  await expect(figure).toHaveAttribute('aria-busy', 'false')
  await expect(diagram.getByText('origin', { exact: true })).toBeVisible()
  await expect(figure.getByText(noTransfer)).toBeVisible()
  expect(await figure.evaluate((el) => el.getAnimations({ subtree: true }).length)).toBe(0)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(replay).toBeEnabled()
  await expect(page).toHaveURL(connect + '2')

  await page.getByRole('button', { name: 'Lessons', exact: true }).press('Enter')
  await page.getByRole('link', { name: '08 Create a remote repository' }).press('Enter')
  await expect(page).toHaveURL(create + '1')
  await expect(page.getByRole('button', { name: 'Lessons', exact: true })).toBeFocused()
  await expect(hostedName).toHaveCount(0)
})

for (const [width, height] of [
  [1200, 560],
  [1280, 720],
] as const) {
  test(`keeps the scene readable and the timeline in view at ${width}×${height}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height })
    await page.goto(connect + '2')
    const figure = page.getByRole('figure', { name: 'Local and GitHub repositories' })
    await expect(figure.getByRole('img')).toBeVisible()
    await expect(figure.getByText(/Alice’s computer.*HEAD → main → c5/)).toHaveCSS(
      'font-size',
      '16px',
    )
    await expect(page.getByRole('button', { name: 'Step 2: Add origin' })).toBeInViewport({
      ratio: 1,
    })
    const caption = figure.getByText(noTransfer)
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    await expect(caption).toBeInViewport({ ratio: 1 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
  })
}

for (const width of [320, 390, 720]) {
  test(`keeps diagram text and focus clear of the bottom bar at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 700 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(connect + '2')
    const figure = page.getByRole('figure', { name: 'Local and GitHub repositories' })
    await expect(figure.getByText(/Alice’s computer.*HEAD → main → c5/)).toBeVisible()
    await expect(figure.getByText(/\* main is current/)).toBeVisible()
    await expect(figure.getByText(/names the GitHub address/)).toBeVisible()
    await expect(figure).toHaveAccessibleDescription(/first parent c4 and second parent c3/)
    await expect(figure.getByRole('img')).toBeVisible()
    const words = page.getByText('Diagram in words', { exact: true })
    await words.press('Enter')
    await expect(words).toBeFocused()
    await expect(words).toHaveCSS('outline-style', 'solid')
    const text = page.getByText(/The arrows point to parents/)
    await expect(text).toBeVisible()
    await expect(text).toHaveCSS('font-size', '16px')
    const box = (await words.boundingBox())!
    expect(box.width).toBeGreaterThanOrEqual(44)
    expect(box.height).toBeGreaterThanOrEqual(44)
    const bar = (await page.getByRole('navigation', { name: 'Walkthrough' }).boundingBox())!
    await expect
      .poll(async () => {
        const bounds = (await words.boundingBox())!
        return bounds.y + bounds.height
      })
      .toBeLessThan(bar.y)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
  })
}
