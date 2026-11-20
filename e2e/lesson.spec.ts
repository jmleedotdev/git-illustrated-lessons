import { expect, test } from '@playwright/test'

const titles = [
  'Alice starts with a file.',
  'Alice initializes Git.',
  'Alice checks the repository.',
]

test('every step is independently readable and navigable', async ({ page }) => {
  for (let index = 0; index < titles.length; index++) {
    await page.goto(`/#/start-a-repository/${index + 1}`)
    await expect(page.getByRole('heading', { name: titles[index], exact: true })).toBeVisible()
    await expect(page.getByRole('img', { name: /Repository scene/ })).toBeVisible()
    await expect(
      page.getByRole('button', { name: new RegExp(`^Step ${index + 1}:`) }),
    ).toHaveAttribute('aria-current', 'step')
    await expect(page.getByRole('status')).toContainText(`Step ${index + 1} of 3`)
    await expect(page.getByRole('button', { name: 'Back', exact: true })).toBeEnabled({
      enabled: index !== 0,
    })
    await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeEnabled({
      enabled: index !== 2,
    })
  }
  await expect(page.getByRole('link', { name: 'Next: Edit and inspect' })).toBeVisible()
  await page.getByRole('button', { name: 'Lessons', exact: true }).click()
  const list = page.getByRole('navigation', { name: 'Lessons' })
  await expect(list.getByText('A little less magic.')).toHaveCount(0)
  await list.getByRole('link', { name: '01 Start a repository', exact: true }).click()
  await expect(page).toHaveURL(/#\/start-a-repository\/1$/)
  await expect(page.getByRole('navigation', { name: 'Lessons' })).toBeHidden()
  await expect(page.getByRole('button', { name: 'Lessons', exact: true })).toBeFocused()
  await expect(page.getByText('In Alice’s editor', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Next', exact: true }).click()
  await expect(page.getByLabel('Git command')).toHaveText('git init -b main')
  await expect(page.locator('pre')).toHaveCSS('background-color', 'rgb(48, 41, 35)')
})

test('normalizes hashes and restores completed steps through history and refresh', async ({
  page,
}) => {
  for (const hash of [
    '',
    '#/unknown/2',
    '#/start-a-repository/99',
    '#/start-a-repository/0',
    '#/start-a-repository/2/extra',
  ]) {
    await page.goto('/' + hash)
    await expect(page).toHaveURL(/#\/start-a-repository\/1$/)
  }

  await page.getByRole('button', { name: /^Step 3:/ }).click()
  const scene = page.getByRole('figure', { name: 'Repository illustration' })
  await expect(scene).toHaveAttribute('aria-busy', 'false')
  await page.reload()
  await expect(page.getByRole('status')).toContainText('Step 3 of 3')
  await page.goBack()
  await expect(page.getByRole('status')).toContainText('Step 1 of 3')
  await page.goForward()
  await expect(page.getByRole('status')).toContainText('Step 3 of 3')
  await expect(scene).toHaveAttribute('aria-busy', 'false')
})

test('initialization replays its before and after states and allows interruption', async ({
  page,
}) => {
  await page.goto('/#/start-a-repository/2')
  const scene = page.getByRole('figure', { name: 'Repository illustration' })
  const diagram = scene.getByRole('img', { name: /Repository scene/ })
  const replay = page.getByRole('button', { name: 'Replay' })
  const originalUrl = page.url()
  await expect(scene).toHaveAttribute('aria-busy', 'false')
  await expect(diagram.getByText('HEAD → main')).toBeVisible()
  await replay.click()
  await expect(diagram.getByText('Git not initialized')).toBeVisible()
  await expect(diagram.getByText('Existing file', { exact: true })).toBeVisible()
  await expect(diagram.getByText('Not set up yet', { exact: true })).toBeVisible()
  await expect(scene).toHaveAttribute('aria-busy', 'true')
  const changedLabels = ['HEAD → main', 'Untracked', 'Empty'].map((name) =>
    diagram.getByText(name, { exact: true }),
  )
  await expect
    .poll(() =>
      Promise.all(
        changedLabels.map((label) => label.evaluate((node) => node.getAnimations().length)),
      ),
    )
    .toEqual([1, 1, 1])
  expect(
    await diagram
      .getByText('No commits', { exact: true })
      .evaluate((node) => node.getAnimations().length),
  ).toBe(0)
  await expect(scene).toHaveAttribute('aria-busy', 'false')
  await expect(scene.getByText('HEAD → main')).toBeVisible()
  await expect(page).toHaveURL(originalUrl)

  await page.clock.install()
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await expect(scene).toHaveAttribute('aria-busy', 'true')
  await page.getByRole('button', { name: 'Next', exact: true }).click()
  await expect(scene).toHaveAttribute('aria-busy', 'true')
  await page.getByRole('button', { name: /^Step 1:/ }).click()
  await expect(scene).toHaveAttribute('aria-busy', 'false')
  await page.clock.runFor(1500)
  expect(await scene.evaluate((figure) => figure.getAnimations({ subtree: true }).length)).toBe(0)
  await expect(scene.getByText('Git not initialized')).toBeVisible()
  await expect(page).toHaveURL(/#\/start-a-repository\/1$/)
})

test('supports keyboard focus and applies reduced motion at load and during playback', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#/start-a-repository/2')
  const scene = page.getByRole('figure', { name: 'Repository illustration' })
  const replay = page.getByRole('button', { name: 'Replay' })
  await expect(replay).toBeDisabled()
  await expect(replay).toHaveAccessibleDescription('Unavailable with reduced motion.')
  await expect(page.getByRole('img', { name: /Repository scene/ })).toHaveAccessibleDescription(
    /no commits/,
  )
  await expect(scene).toHaveAttribute('aria-busy', 'false')

  await page.keyboard.press('Tab')
  const lessons = page.getByRole('button', { name: 'Lessons', exact: true })
  await expect(lessons).toBeFocused()
  await expect(lessons).toHaveCSS('outline-style', 'solid')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('link', { name: '01 Start a repository' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(lessons).toBeFocused()
  await page.keyboard.press('ArrowLeft')
  await expect(page.getByRole('status')).toContainText('Step 1 of 3')

  await page.clock.install()
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(replay).toBeEnabled()
  await page.keyboard.press('ArrowRight')
  await expect(scene).toHaveAttribute('aria-busy', 'true')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(scene).toHaveAttribute('aria-busy', 'false')
  await page.clock.runFor(1500)
  expect(await scene.evaluate((figure) => figure.getAnimations({ subtree: true }).length)).toBe(0)
  await expect(scene.getByText('HEAD → main')).toBeVisible()
  await expect(page.getByRole('status')).toContainText('Step 2 of 3')
  await expect(replay).toBeDisabled()
})

test('loops the folded-page highlight only while inspecting with motion enabled', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/#/start-a-repository/3')
  const scene = page.getByRole('figure', { name: 'Repository illustration' })
  const loopState = () =>
    scene.evaluate(
      (figure) =>
        figure
          .getAnimations({ subtree: true })
          .find((animation) => animation.effect?.getTiming().iterations === Infinity)?.playState,
    )

  await expect.poll(loopState).toBe('running')
  const replay = scene.getByRole('button', { name: 'Replay' })
  await expect(replay).toHaveCount(0)
  await expect(scene).toHaveAttribute('aria-busy', 'false')
  await scene.getByRole('button', { name: 'Pause animation' }).click()
  await expect.poll(loopState).toBe('paused')
  await expect(replay).toHaveCount(0)
  await scene.getByRole('button', { name: 'Resume animation' }).click()
  await expect.poll(loopState).toBe('running')
  await expect(page).toHaveURL(/#\/start-a-repository\/3$/)

  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await expect.poll(loopState).toBeUndefined()
  await expect(replay).toBeEnabled()
  await expect(scene).toHaveAttribute('aria-busy', 'true')
  await expect(scene.getByText('Git not initialized')).toBeVisible()
  await expect(scene).toHaveAttribute('aria-busy', 'false')
  await expect(scene.getByText('HEAD → main')).toBeVisible()
  await page.getByRole('button', { name: 'Next', exact: true }).click()
  await expect.poll(loopState).toBe('running')
  await expect(replay).toHaveCount(0)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect.poll(loopState).toBeUndefined()
  await expect(replay).toBeDisabled()
})

test('keeps phone content and keyboard focus clear of fixed navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/#/start-a-repository/3')
  const bar = page.getByRole('navigation', { name: 'Walkthrough' })
  const story = page.getByText(/^Alice checks git status/)
  const scene = page.getByRole('figure', { name: 'Repository illustration' })
  const details = page.getByText('Before you begin')
  await expect(bar).toHaveCSS('position', 'fixed')
  await expect(story).toHaveCSS('font-size', '16px')
  expect((await scene.boundingBox())!.y).toBeLessThan((await story.boundingBox())!.y)
  expect(
    (await bar.getByRole('button', { name: 'Back' }).boundingBox())!.height,
  ).toBeGreaterThanOrEqual(44)
  await page.getByRole('button', { name: /^Step 3:/ }).press('Tab')
  await expect(details).toBeFocused()
  await expect
    .poll(async () => {
      const bounds = (await details.boundingBox())!
      return bounds.y + bounds.height
    })
    .toBeLessThan((await bar.boundingBox())!.y)
  await page.keyboard.press('Enter')
  const prerequisites = page
    .getByRole('paragraph')
    .filter({ hasText: 'install Git and configure your commit identity' })
  await expect(prerequisites).toBeVisible()
  await page.keyboard.press('End')
  await expect
    .poll(async () => {
      const bounds = (await prerequisites.boundingBox())!
      return bounds.y + bounds.height
    })
    .toBeLessThan((await bar.boundingBox())!.y)
  await page.setViewportSize({ width: 320, height: 700 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320)
  await expect(page.getByRole('button', { name: 'Pause animation' })).toHaveCSS(
    'min-height',
    '44px',
  )
  await bar.getByRole('button', { name: 'Back' }).click()
  await bar.getByRole('button', { name: 'Back' }).click()
  await expect(scene.getByText('Git not initialized')).toBeVisible()
  await bar.getByRole('button', { name: 'Next' }).click()
  const stagingCaption = scene.getByText('Empty', { exact: true }).filter({ visible: true })
  await expect.poll(() => stagingCaption.evaluate((node) => node.getAnimations().length)).toBe(1)
  await expect(scene).toHaveAttribute('aria-busy', 'false')
})

test('fits the approved scene and guide layout on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/#/start-a-repository/2')
  const scene = page.getByRole('figure', { name: 'Repository illustration' })
  const guide = page.getByRole('region', { name: 'Alice initializes Git.' })
  const timeline = page.getByRole('navigation', { name: 'Explanation steps' })
  await expect(scene.getByRole('img', { name: /Repository scene/ })).toHaveAttribute(
    'viewBox',
    '0 0 960 500',
  )
  await expect(scene.getByRole('button', { name: 'Replay' })).toBeInViewport()
  await expect(timeline).toBeInViewport({ ratio: 1 })
  await expect(page.getByRole('complementary', { name: 'The mental model' })).toBeInViewport()
  const sceneBox = (await scene.boundingBox())!
  expect(sceneBox.x + sceneBox.width).toBeLessThan((await guide.boundingBox())!.x)
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(900)
})
