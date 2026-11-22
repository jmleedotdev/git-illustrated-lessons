import { expect, test } from '@playwright/test'

const url = (step: number) => `/create-and-switch-branches/${step}`

for (const viewport of [
  { width: 1440, height: 900, compact: false },
  { width: 1440, height: 761, compact: true },
  { width: 320, height: 700, compact: true },
]) {
  const historyView = viewport.compact
    ? ({ role: 'list', name: 'Commit history' } as const)
    : ({ role: 'img', name: /Repository scene/ } as const)

  test(`shows every branch step and checkout at ${viewport.width}×${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport)
    const figure = page.getByRole('figure', { name: 'Repository illustration' })
    const diagram = figure.getByRole(historyView.role, { name: historyView.name })
    const checkout = figure.getByRole('region', { name: 'Checked-out contents' })
    const working = checkout.getByRole('list', { name: 'Working directory' })
    const staging = checkout.getByRole('list', { name: 'Staging area' })
    const steps = [
      { head: 'main', tip: 'c2', inactive: 'ideas', workingCount: 0, stagedCount: 0 },
      { head: 'ideas', tip: 'c2', inactive: 'main', workingCount: 0, stagedCount: 0 },
      { head: 'ideas', tip: 'c2', inactive: 'main', workingCount: 1, stagedCount: 0 },
      { head: 'ideas', tip: 'c2', inactive: 'main', workingCount: 1, stagedCount: 1 },
      { head: 'ideas', tip: 'c3', inactive: 'main', workingCount: 1, stagedCount: 1 },
      { head: 'main', tip: 'c2', inactive: 'ideas', workingCount: 0, stagedCount: 0 },
    ]
    for (const [index, { head, tip, inactive, workingCount, stagedCount }] of steps.entries()) {
      await page.goto(url(index + 1))
      await page.reload()
      await expect(page.getByRole('status')).toContainText(`Step ${index + 1} of 6`)
      await expect(figure).toHaveAttribute('aria-busy', 'false')
      await expect(figure.getByText(`HEAD → ${head} → ${tip}`, { exact: true })).toBeVisible()
      await expect(diagram.getByText(`* ${head}`, { exact: true })).toBeVisible()
      await expect(diagram.getByText(inactive, { exact: true })).toBeVisible()
      await expect(working.getByText('ideas.txt', { exact: true })).toHaveCount(workingCount)
      await expect(staging.getByText('ideas.txt', { exact: true })).toHaveCount(stagedCount)
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width)
    }
    await page.goto(url(3))
    await expect(page.getByRole('heading', { name: 'In Alice’s editor' })).toBeVisible()
    await expect(page.getByLabel('Git command')).toHaveCount(0)
    await expect(working).toContainText('Untracked')
  })
}

test('inspects the ideas commit by keyboard without leaving the main checkout on a phone', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.goto(url(6))
  const figure = page.getByRole('figure', { name: 'Repository illustration' })
  const history = figure.getByRole('list', { name: 'Commit history' })
  await expect(history.getByRole('listitem').filter({ hasText: '* main' })).toContainText(
    'Parent: c1',
  )
  await expect(history.getByRole('listitem').filter({ hasText: 'ideas.txt' })).toContainText(
    'Parent: c2',
  )
  await expect(page.getByText(/^With no uncommitted changes/)).toHaveCSS('font-size', '16px')

  await figure.getByText('Inspect recorded snapshots').press('Enter')
  const inspector = figure.getByRole('region', { name: 'Recorded snapshot inspector' })
  const inspect = inspector.getByRole('button', { name: 'Inspect c3' })
  await page.keyboard.press('Tab')
  await expect(inspect).toBeFocused()
  await expect(inspect).toHaveCSS('outline-style', 'solid')
  const target = (await inspect.boundingBox())!
  expect(target.width).toBeGreaterThanOrEqual(44)
  expect(target.height).toBeGreaterThanOrEqual(44)
  const bar = (await page.getByRole('navigation', { name: 'Walkthrough' }).boundingBox())!
  await expect
    .poll(async () => {
      const box = (await inspect.boundingBox())!
      return box.y + box.height
    })
    .toBeLessThan(bar.y)
  await inspect.press('Enter')
  await expect(inspector).toContainText('Parent: c2')
  await expect(inspector).toContainText('Draw the history as a map.')
  await expect(inspector).toContainText('Only selected contents go in.')
  await expect(figure.getByText('HEAD → main → c2', { exact: true })).toBeVisible()
  await expect(
    figure.getByRole('list', { name: 'Working directory' }).getByText('ideas.txt'),
  ).toHaveCount(0)
  await expect(page).toHaveURL(/\/create-and-switch-branches\/6$/)
})

test('replays branch changes from direct entry and cancels on selection and live reduced motion', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(url(1))
  const figure = page.getByRole('figure', { name: 'Repository illustration' })
  const replay = figure.getByRole('button', { name: 'Replay' })
  const diagram = figure
    .getByRole('img', { name: /Repository scene/ })
    .or(figure.getByRole('list', { name: 'Commit history' }))
  const ideas = diagram.getByText('ideas', { exact: true })
  await expect(ideas).toBeVisible()
  await replay.click()
  await expect(figure).toHaveAttribute('aria-busy', 'true')
  await expect(ideas).toBeHidden()
  await expect(ideas).toBeVisible()
  await expect(figure).toHaveAttribute('aria-busy', 'false')
  await expect(page).toHaveURL(/\/1$/)

  await page.getByRole('button', { name: 'Step 5: Commit' }).click()
  await expect(figure.getByText('HEAD → ideas → c3', { exact: true })).toBeVisible()
  await replay.click()
  await expect(figure.getByText('HEAD → ideas → c2', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Step 6: Return' }).click()
  await expect(figure).toHaveAttribute('aria-busy', 'false')
  await expect(figure.getByText('HEAD → main → c2', { exact: true })).toBeVisible()

  await replay.click()
  await expect(figure.getByText('HEAD → ideas → c3', { exact: true })).toBeVisible()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(replay).toBeDisabled()
  await expect(replay).toHaveAccessibleDescription('Unavailable with reduced motion.')
  await expect(figure).toHaveAttribute('aria-busy', 'false')
  await expect(figure.getByText('HEAD → main → c2', { exact: true })).toBeVisible()
  await page.goBack()
  await expect(figure.getByText('HEAD → ideas → c3', { exact: true })).toBeVisible()
  await expect(figure).toHaveAttribute('aria-busy', 'false')
})

test('lesson Back interrupts Next and plays the destination step without advancing', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(url(4))
  const figure = page.getByRole('figure', { name: 'Repository illustration' })
  const staging = figure.getByRole('list', { name: 'Staging area' })
  const ideas = staging.getByText('ideas.txt', { exact: true })
  const next = page.getByRole('button', { name: 'Next', exact: true })
  const back = page.getByRole('button', { name: 'Back', exact: true })
  await expect(ideas).toBeVisible()
  await next.click()
  await expect(figure).toHaveAttribute('aria-busy', 'true')
  await expect(page).toHaveURL(/\/5$/)
  await back.click()
  await expect(figure).toHaveAttribute('aria-busy', 'true')
  await expect(ideas).toBeHidden()
  await expect(ideas).toBeVisible()
  await expect(figure).toHaveAttribute('aria-busy', 'false')
  await expect(figure.getByText('HEAD → ideas → c2', { exact: true })).toBeVisible()
  await expect(page).toHaveURL(/\/4$/)
})
