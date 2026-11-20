import { expect, test } from '@playwright/test'

const url = (step: number) => `/#/bring-work-together/${step}`
const orderedParents = 'Parent 1: c4 · Parent 2: c3'

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 1440, height: 899 },
  { width: 1200, height: 560 },
  { width: 320, height: 700 },
]) {
  const historyView =
    viewport.width > 1100
      ? ({ role: 'img', name: /Repository scene/ } as const)
      : ({ role: 'list', name: 'Commit history' } as const)

  test(`shows each merge step at ${viewport.width}×${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    const figure = page.getByRole('figure', { name: 'Repository illustration' })
    const guide = page.getByRole('button', { name: 'Next', exact: true })
    const working = figure.getByRole('list', { name: 'Working directory' })
    const staging = figure.getByRole('list', { name: 'Staging area' })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(url(1))
    await expect(working).toContainText('C · Clean')
    await expect(staging).toContainText('C · Matches c2')
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width)
    for (const [step, tip, workingCaption, stagingCaption] of [
      [2, 'c2', 'D · Unstaged edit', 'C · Matches c2'],
      [3, 'c2', 'D · Matches staging', 'D · Staged'],
      [4, 'c4', 'D · Clean', 'D · Matches c4'],
      [5, 'c5', 'D · Clean', 'D · Matches c5'],
    ] as const) {
      await guide.press('Enter')
      await expect(page).toHaveURL(url(step))
      await expect(page.getByRole('status')).toContainText(`Step ${step} of 5`)
      await expect(figure.getByText(`HEAD → main → ${tip}`, { exact: true })).toBeVisible()
      await expect(working).toContainText(workingCaption)
      await expect(staging).toContainText(stagingCaption)
      await expect(page.getByRole('heading', { name: 'In Alice’s editor' })).toHaveCount(
        Number(step === 2),
      )
      await expect(figure.getByRole(historyView.role, { name: historyView.name })).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width)
    }
    await expect(working.getByText('ideas.txt', { exact: true })).toBeVisible()
    await expect(staging.getByText('ideas.txt', { exact: true })).toBeVisible()
  })
}

test('keeps ordered ancestry and keyboard snapshot inspection accessible on a narrow phone', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.goto(url(5))
  const figure = page.getByRole('figure', { name: 'Repository illustration' })
  const history = figure.getByRole('list', { name: 'Commit history' })
  await expect(history.getByRole('listitem').filter({ hasText: '* main' })).toContainText(
    orderedParents,
  )
  await expect(history.getByRole('listitem').filter({ hasText: /^c[34]/ })).toHaveText([
    /c4.*Parent: c2/,
    /c3.*Parent: c2/,
  ])
  await figure.getByText('Inspect recorded snapshots').press('Enter')
  const inspector = figure.getByRole('region', { name: 'Recorded snapshot inspector' })
  await expect(inspector).toContainText(orderedParents)
  const inspectC3 = inspector.getByRole('button', { name: 'Inspect c3' })
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await expect(inspectC3).toBeFocused()
  await expect(inspectC3).toHaveCSS('outline-style', 'solid')
  const target = (await inspectC3.boundingBox())!
  expect(target.width).toBeGreaterThanOrEqual(44)
  expect(target.height).toBeGreaterThanOrEqual(44)
  const bar = (await page.getByRole('navigation', { name: 'Walkthrough' }).boundingBox())!
  await expect
    .poll(async () => {
      const box = (await inspectC3.boundingBox())!
      return box.y + box.height
    })
    .toBeLessThan(bar.y)
  await inspectC3.press('Enter')
  await expect(inspector).toContainText('Only selected contents go in.')
  await expect(figure.getByText('HEAD → main → c5', { exact: true })).toBeVisible()
  await expect(page).toHaveURL(url(5))
})

test('opens each intermediate step directly without playing earlier steps', async ({ page }) => {
  const figure = page.getByRole('figure', { name: 'Repository illustration' })
  for (const [step, head, change] of [
    [2, 'c2', 'Unstaged edit'],
    [3, 'c2', 'Matches staging'],
    [4, 'c4', 'Clean'],
  ] as const) {
    await page.goto(url(step))
    await page.reload()
    await expect(page.getByRole('status')).toContainText(`Step ${step} of 5`)
    await expect(figure).toHaveAttribute('aria-busy', 'false')
    await expect(figure.getByText(`HEAD → main → ${head}`, { exact: true })).toBeVisible()
    await expect(figure.getByRole('list', { name: 'Working directory' })).toContainText(change)
  }
})

test('replays the merge from a fresh link and settles on interruption or a motion preference change', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(url(5))
  const figure = page.getByRole('figure', { name: 'Repository illustration' })
  const diagram = figure.getByRole('img', { name: /Repository scene/ })
  const replay = figure.getByRole('button', { name: 'Replay' })
  const parent = diagram.getByText('parent 2', { exact: true })
  await expect(figure).toHaveAttribute('aria-busy', 'false')
  await expect(parent).toBeVisible()
  await expect(diagram.getByText('parent 1', { exact: true })).toBeVisible()
  await expect(diagram).toHaveAccessibleDescription(/Parent 1: c4 · Parent 2: c3/)
  await replay.press('Enter')
  await expect(figure).toHaveAttribute('aria-busy', 'true')
  await expect(figure.getByText('HEAD → main → c4', { exact: true })).toBeVisible()
  await expect(parent).toBeHidden()
  await expect(parent).toBeVisible()
  await expect(figure).toHaveAttribute('aria-busy', 'false')
  await expect(page).toHaveURL(url(5))

  await replay.click()
  await expect(figure).toHaveAttribute('aria-busy', 'true')
  await page.getByRole('button', { name: 'Step 2: Edit' }).click()
  await expect(figure).toHaveAttribute('aria-busy', 'false')
  await expect(figure.getByText('HEAD → main → c2', { exact: true })).toBeVisible()
  await expect(parent).toBeHidden()
  await page.goBack()
  await expect(parent).toBeVisible()
  await expect(figure).toHaveAttribute('aria-busy', 'false')

  await replay.click()
  await expect(parent).toBeHidden()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(replay).toBeDisabled()
  await expect(replay).toHaveAccessibleDescription('Unavailable with reduced motion.')
  await expect(figure).toHaveAttribute('aria-busy', 'false')
  await expect(parent).toBeVisible()
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(replay).toBeEnabled()
  await expect(figure).toHaveAttribute('aria-busy', 'false')
  await expect(page).toHaveURL(url(5))

  await page.keyboard.press('ArrowLeft')
  await expect(page).toHaveURL(url(4))
  await expect(figure).toHaveAttribute('aria-busy', 'false')
  await expect(figure.getByText('HEAD → main → c4', { exact: true })).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(url(5))
  await expect(figure).toHaveAttribute('aria-busy', 'true')
  await expect(parent).toBeVisible()
  await expect(figure).toHaveAttribute('aria-busy', 'false')
  await expect(page).toHaveURL(url(5))
})
