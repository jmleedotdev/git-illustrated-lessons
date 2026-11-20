import { expect, test } from '@playwright/test'

test('opens every commit and history step independently and inspects without checking out', async ({
  page,
}) => {
  const figure = page.getByRole('figure', { name: 'Repository illustration' })
  const scene = figure.getByRole('img', { name: /Repository scene/ })
  for (const [slug, steps] of [
    ['record-a-commit', ['No commits', 'HEAD → main → c1']],
    [
      'read-the-history',
      ['HEAD → main → c1', 'HEAD → main → c1', 'HEAD → main → c2', 'HEAD → main → c2'],
    ],
  ] as const) {
    for (const [index, label] of steps.entries()) {
      await page.goto(`/#/${slug}/${index + 1}`)
      await expect(page.getByRole('status')).toContainText(`Step ${index + 1} of ${steps.length}`)
      await expect(scene.getByText(label, { exact: true })).toBeVisible()
      await expect(figure).toHaveAttribute('aria-busy', 'false')
    }
  }

  await figure.getByText('Inspect recorded snapshots', { exact: true }).click()
  const inspector = figure.getByRole('region', { name: 'Recorded snapshot inspector' })
  const first = inspector.getByRole('button', { name: 'Inspect c1' })
  const second = inspector.getByRole('button', { name: 'Inspect c2' })
  await expect(first).toHaveText('c1')
  await expect(second).toHaveText('c2')
  await first.click()
  await expect(first).toHaveAttribute('aria-pressed', 'true')
  await expect(inspector).toContainText('Git keeps a history.')
  await expect(inspector).not.toContainText('Only selected contents go in.')
  await expect(scene.getByText('HEAD → main → c2', { exact: true })).toBeVisible()
  await expect(page).toHaveURL(/#\/read-the-history\/4$/)
  await expect(page.getByLabel('Git command')).toHaveText('git log')
  await second.click()
  await expect(second).toHaveAttribute('aria-pressed', 'true')
  await expect(inspector).toContainText('Only selected contents go in.')
})

test('replays commit creation and settles when navigation or reduced motion interrupts', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/#/record-a-commit/2')
  const figure = page.getByRole('figure', { name: 'Repository illustration' })
  const scene = figure.getByRole('img', { name: /Repository scene/ })
  const replay = figure.getByRole('button', { name: 'Replay' })
  const root = scene.getByText('Root · no parent', { exact: true })
  await expect(root).toBeVisible()
  await replay.click()
  await expect(figure).toHaveAttribute('aria-busy', 'true')
  await expect(root).toBeHidden()
  await expect(scene.getByText('Version B · Staged', { exact: true })).toBeVisible()
  await expect(root).toBeVisible()
  const sphere = scene.locator('[data-new-commit]')
  expect(
    await sphere.evaluate(
      (element) => element.getAnimations()[0]?.effect?.getComputedTiming().duration,
    ),
  ).toBe(600)
  await expect(figure).toHaveAttribute('aria-busy', 'false')
  await expect(root).toBeVisible()
  await expect(scene.getByText('Version B · Matches c1', { exact: true })).toBeVisible()
  await expect(scene.getByText('Version C · Unstaged edit', { exact: true })).toBeVisible()
  await expect(page).toHaveURL(/#\/record-a-commit\/2$/)

  await replay.click()
  await expect(figure).toHaveAttribute('aria-busy', 'true')
  await page.getByRole('button', { name: 'Step 1: Review' }).click()
  await expect(figure).toHaveAttribute('aria-busy', 'false')
  await expect(root).toBeHidden()
  await expect(page).toHaveURL(/#\/record-a-commit\/1$/)

  await page.getByRole('button', { name: 'Next', exact: true }).click()
  await expect(figure).toHaveAttribute('aria-busy', 'true')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(replay).toBeDisabled()
  await expect(replay).toHaveAccessibleDescription('Unavailable with reduced motion.')
  await expect(figure).toHaveAttribute('aria-busy', 'false')
  await expect(root).toBeVisible()
  await expect(page).toHaveURL(/#\/record-a-commit\/2$/)
})

test('keeps history and keyboard inspection reachable on a narrow phone and short desktop', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.goto('/#/read-the-history/4')
  const figure = page.getByRole('figure', { name: 'Repository illustration' })
  const history = figure.getByRole('list', { name: 'Commit history' })
  const scene = figure.getByRole('img', { name: /Repository scene/ })
  await expect(scene).toHaveAccessibleDescription(/c2.*parent.*c1.*no parent.*HEAD.*main/i)
  await expect(history).toContainText('* main')
  await expect(history).toContainText('Parent: c1')
  await expect(history).toContainText('Root · no parent')
  await expect(
    figure.getByText('Version C · Clean', { exact: true }).filter({ visible: true }),
  ).toBeVisible()
  await expect(page.getByText(/^Alice runs git log/)).toHaveCSS('font-size', '16px')
  const bar = page.getByRole('navigation', { name: 'Walkthrough' })
  const summary = figure.getByText('Inspect recorded snapshots', { exact: true })
  await summary.press('Enter')
  await summary.press('Tab')
  await page.keyboard.press('Tab')
  const first = figure.getByRole('button', { name: 'Inspect c1' })
  await expect(first).toBeFocused()
  await expect(first).toHaveCSS('outline-style', 'solid')
  const target = (await first.boundingBox())!
  expect(target.width).toBeGreaterThanOrEqual(44)
  expect(target.height).toBeGreaterThanOrEqual(44)
  await expect
    .poll(async () => {
      const target = (await first.boundingBox())!
      return target.y + target.height
    })
    .toBeLessThan((await bar.boundingBox())!.y)
  await first.press('Enter')
  await expect(first).toHaveAttribute('aria-pressed', 'true')
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320)

  await page.setViewportSize({ width: 1200, height: 560 })
  await expect(history).toBeVisible()
  await first.click()
  const timeline = page.getByRole('navigation', { name: 'Explanation steps' })
  await timeline.scrollIntoViewIfNeeded()
  await expect(timeline).toBeInViewport({ ratio: 1 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1200)
})

test('reads history newest first with the standard sphere fade duration', async ({ page }) => {
  await page.goto('/#/read-the-history/4')
  const figure = page.getByRole('figure', { name: 'Repository illustration' })
  const graph = figure.getByRole('img', { name: /Repository scene/ })
  const pulseDuration = (id: string) =>
    graph.getByText(id, { exact: true }).evaluate((label) => {
      const sphere = label.closest('[data-history-node]')
      return sphere?.getAnimations()[0]?.effect?.getComputedTiming().duration
    })

  await figure.getByRole('button', { name: 'Replay' }).click()
  await expect.poll(() => pulseDuration('c2')).toBe(600)
  expect(await pulseDuration('c1')).toBeUndefined()
  await expect.poll(() => pulseDuration('c1')).toBe(600)
  await expect(figure).toHaveAttribute('aria-busy', 'false')
  await expect(page).toHaveURL(/#\/read-the-history\/4$/)
})
