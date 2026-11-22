import { expect, test } from '@playwright/test'

const sceneName = /Repository scene/
const editSteps = [
  ['Alice adds a line.', 'Version B · Untracked', 'Empty'],
  ['Bob checks what Git sees.', 'Version B · Untracked', 'Empty'],
] as const
const stagingSteps = [
  ['Alice reviews the note.', 'Version B · Untracked', 'Empty'],
  ['Alice selects version B.', 'Version B · Tracked', 'Version B · Staged'],
  ['Alice makes another edit.', 'Version C · Unstaged edit', 'Version B · Staged'],
] as const

test('plays the opening step at launch and when choosing Next lesson', async ({ page }) => {
  const scene = page.getByRole('figure', { name: 'Repository illustration' })
  await page.goto('/')
  await expect(scene).toHaveAttribute('aria-busy', 'true')
  await expect(page).toHaveURL(/\/start-a-repository\/1$/)
  await page.reload()
  await expect(scene).toHaveAttribute('aria-busy', 'true')
  await page.goto('/start-a-repository/3')
  await page.getByRole('link', { name: 'Next: Edit and inspect' }).click()
  await expect(page).toHaveURL(/\/edit-and-inspect\/1$/)
  await expect(scene).toHaveAttribute('aria-busy', 'true')
  await page.goBack()
  await page.goForward()
  await expect(scene).toHaveAttribute('aria-busy', 'false')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(scene).toHaveAttribute('aria-busy', 'false')
})

test('fully fades out the Edit and inspect status caption before restoring it', async ({
  page,
}) => {
  const scene = page.getByRole('figure', { name: 'Repository illustration' })
  const caption = scene.getByRole('img', { name: sceneName }).getByText('Version B · Untracked')
  await page.goto('/edit-and-inspect/1')
  await page.getByRole('button', { name: 'Next', exact: true }).click()
  await expect(scene).toHaveAttribute('aria-busy', 'true')
  await expect
    .poll(() =>
      caption.evaluate((label) => label.getAnimations()[0]?.effect?.getComputedTiming().duration),
    )
    .toBe(1600)
  await expect(caption).toHaveCSS('opacity', '0')
  await expect(scene).toHaveAttribute('aria-busy', 'false')
  await expect(caption).toHaveCSS('opacity', '1')
  await expect(page).toHaveURL(/\/edit-and-inspect\/2$/)

  const replay = scene.getByRole('button', { name: 'Replay' })
  await replay.click()
  await expect(caption).toHaveCSS('opacity', '0')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(replay).toBeDisabled()
  await expect(scene).toHaveAttribute('aria-busy', 'false')
  await expect(caption).toHaveCSS('opacity', '1')
})

test('opens every editing and staging step in its completed state', async ({ page }) => {
  const illustration = page.getByRole('figure', { name: 'Repository illustration' })
  const scene = page.getByRole('img', { name: sceneName })
  for (const [slug, steps] of [
    ['edit-and-inspect', editSteps],
    ['choose-what-to-stage', stagingSteps],
  ] as const) {
    for (const [index, [title, working, staging]] of steps.entries()) {
      await page.goto(`/${slug}/${index + 1}`)
      await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible()
      await expect(page.getByRole('status')).toContainText(`Step ${index + 1} of ${steps.length}`)
      await expect(page.getByText('Before you begin', { exact: true })).toHaveCount(0)
      await expect(scene).toHaveAccessibleDescription(/no commits/i)
      for (const label of [working, staging, 'No commits']) {
        await expect(scene.getByText(label, { exact: true })).toBeVisible()
      }
      await expect(illustration).toHaveAttribute('aria-busy', 'false')
    }
  }
  await expect(scene).toHaveAccessibleDescription(
    /working directory.*version C.*staging area.*version B/i,
  )
  await expect(page.getByRole('link', { name: 'Next: Record a commit' })).toBeVisible()
})

test('shows Previous lesson only at step one and opens the preceding lesson’s first step', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.goto('/choose-what-to-stage/2')
  const previous = page.getByRole('link', { name: /^Previous:/ })
  const bar = page.getByRole('navigation', { name: 'Walkthrough' })
  const back = bar.getByRole('button', { name: 'Back' })
  await expect(previous).toHaveCount(0)
  await back.click()
  await expect(back).toBeDisabled()
  await expect(previous).toHaveText('Previous: Edit and inspect')
  await expect(previous).toHaveAttribute('href', '/edit-and-inspect/1')
  await bar.getByRole('button', { name: 'Next' }).press('Tab')
  await expect(previous).toBeFocused()
  await expect
    .poll(async () => {
      const bounds = (await previous.boundingBox())!
      return bounds.y + bounds.height
    })
    .toBeLessThan((await bar.boundingBox())!.y)
  await previous.press('Enter')
  await expect(page).toHaveURL(/\/edit-and-inspect\/1$/)
  await expect(page.getByRole('heading', { name: 'Edit and inspect', exact: true })).toBeFocused()
  await expect(previous).toHaveText('Previous: Start a repository')
  await page.goBack()
  await expect(previous).toHaveText('Previous: Edit and inspect')
  await page.goto('/start-a-repository/1')
  await expect(previous).toHaveCount(0)
})

test('switches lessons by keyboard and by a separate Next lesson action', async ({ page }) => {
  await page.goto('/choose-what-to-stage/3')
  await page.keyboard.press('Tab')
  const lessons = page.getByRole('button', { name: 'Lessons', exact: true })
  await expect(lessons).toBeFocused()
  await expect(lessons).toHaveCSS('outline-style', 'solid')
  await page.keyboard.press('Enter')
  const list = page.getByRole('navigation', { name: 'Lessons' })
  const edit = list.getByRole('link', { name: '02 Edit and inspect' })
  await page.keyboard.press('Tab')
  await expect(edit).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(list).toBeHidden()
  await expect(lessons).toBeFocused()
  await expect(page).toHaveURL(/\/edit-and-inspect\/1$/)
  await expect(page.getByRole('button', { name: 'Back', exact: true })).toBeDisabled()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByLabel('Git command')).toHaveText('git status')
  await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeDisabled()
  const nextLesson = page.getByRole('link', { name: 'Next: Choose what to stage' })
  await expect(nextLesson).toHaveAttribute('href', '/choose-what-to-stage/1')
  await nextLesson.press('Enter')
  await expect(page).toHaveURL(/\/choose-what-to-stage\/1$/)
  await expect(
    page.getByRole('heading', { name: 'Choose what to stage', exact: true }),
  ).toBeFocused()
  await expect(page.getByRole('status')).toContainText('Step 1 of 3')
  await page.goBack()
  await expect(page).toHaveURL(/\/edit-and-inspect\/2$/)
  await page.goForward()
  await page.reload()
  await expect(page).toHaveURL(/\/choose-what-to-stage\/1$/)
})

test('Next and Replay send a copy to staging while the working file stays visible', async ({
  page,
}) => {
  await page.goto('/choose-what-to-stage/1')
  const illustration = page.getByRole('figure', { name: 'Repository illustration' })
  const scene = page.getByRole('img', { name: sceneName })
  const next = page.getByRole('button', { name: 'Next', exact: true })
  const replay = page.getByRole('button', { name: 'Replay' })
  const workingBefore = scene.getByText('Version B · Untracked', { exact: true })
  const workingAfter = scene.getByText('Version B · Tracked', { exact: true })
  const staged = scene.getByText('Version B · Staged', { exact: true })

  for (const action of [next, replay]) {
    await action.click()
    await expect(illustration).toHaveAttribute('aria-busy', 'true')
    await expect(workingBefore).toBeVisible()
    await expect(staged).toHaveCount(0)
    // Check that an object actually travels horizontally, rather than only fading labels.
    expect(
      await scene.evaluate(async (diagram) => {
        const targets = diagram
          .getAnimations({ subtree: true })
          .flatMap(({ effect }) =>
            effect instanceof KeyframeEffect && effect.target instanceof Element
              ? [effect.target]
              : [],
          )
        const leftEdges = targets.map((target) => target.getBoundingClientRect().left)
        await new Promise((resolve) => setTimeout(resolve, 280))
        return targets.some(
          (target, index) =>
            Math.abs(target.getBoundingClientRect().left - leftEdges[index]!) >
            diagram.getBoundingClientRect().width * 0.02,
        )
      }),
    ).toBe(true)
    await expect(illustration).toHaveAttribute('aria-busy', 'false')
    await expect(workingAfter).toBeVisible()
    await expect(staged).toBeVisible()
    await expect(page).toHaveURL(/\/choose-what-to-stage\/2$/)
  }
  await next.click()
  await expect(illustration).toHaveAttribute('aria-busy', 'true')
  await expect(staged).toBeVisible()
  await expect(illustration).toHaveAttribute('aria-busy', 'false')
  await expect(scene.getByText('Version C · Unstaged edit', { exact: true })).toBeVisible()
  await expect(staged).toBeVisible()
})

test('direct-entry Replay stops cleanly on navigation and live reduced motion', async ({
  page,
}) => {
  await page.goto('/choose-what-to-stage/2')
  const illustration = page.getByRole('figure', { name: 'Repository illustration' })
  const scene = page.getByRole('img', { name: sceneName })
  const replay = page.getByRole('button', { name: 'Replay' })
  const staged = scene.getByText('Version B · Staged', { exact: true })
  const animationCount = () =>
    illustration.evaluate((figure) => figure.getAnimations({ subtree: true }).length)
  await expect(staged).toBeVisible()
  await replay.click()
  await expect(illustration).toHaveAttribute('aria-busy', 'true')
  await page.getByRole('button', { name: /^Step 3:/ }).click()
  await expect(illustration).toHaveAttribute('aria-busy', 'false')
  await expect.poll(animationCount).toBe(0)
  await expect(scene.getByText('Version C · Unstaged edit', { exact: true })).toBeVisible()
  await expect(staged).toBeVisible()
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await expect(illustration).toHaveAttribute('aria-busy', 'true')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(replay).toBeDisabled()
  await expect(replay).toHaveAccessibleDescription('Unavailable with reduced motion.')
  await expect(illustration).toHaveAttribute('aria-busy', 'false')
  await expect.poll(animationCount).toBe(0)
  await expect(staged).toBeVisible()
  await expect(page).toHaveURL(/\/choose-what-to-stage\/2$/)
})

test('keeps distinct versions readable on phones and the guide reachable on short desktops', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/choose-what-to-stage/3')
  const figure = page.getByRole('figure', { name: 'Repository illustration' })
  const working = figure
    .getByText('Version C · Unstaged edit', { exact: true })
    .filter({ visible: true })
  const staged = figure.getByText('Version B · Staged', { exact: true }).filter({ visible: true })
  const story = page.getByText(/^Bob asks what Alice would commit/)
  await expect(working).toBeVisible()
  await expect(staged).toBeVisible()
  await expect(story).toHaveCSS('font-size', '16px')
  expect((await figure.boundingBox())!.y).toBeLessThan((await story.boundingBox())!.y)

  await page.setViewportSize({ width: 320, height: 700 })
  await page.goto('/edit-and-inspect/2')
  const nextLesson = page.getByRole('link', { name: 'Next: Choose what to stage' })
  const bar = page.getByRole('navigation', { name: 'Walkthrough' })
  await expect(bar).toHaveCSS('position', 'fixed')
  await page.getByRole('button', { name: /^Step 2:/ }).press('Tab')
  await expect(bar.getByRole('button', { name: 'Back' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(nextLesson).toBeFocused()
  await expect
    .poll(async () => {
      const bounds = (await nextLesson.boundingBox())!
      return bounds.y + bounds.height
    })
    .toBeLessThan((await bar.boundingBox())!.y)
  await expect(nextLesson).toHaveCSS('min-height', '44px')
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320)

  await page.setViewportSize({ width: 1200, height: 560 })
  await page.goto('/choose-what-to-stage/3')
  const guide = page.getByRole('region', { name: 'Alice makes another edit.' })
  const sceneBounds = (await figure.boundingBox())!
  expect(sceneBounds.x + sceneBounds.width).toBeLessThan((await guide.boundingBox())!.x)
  const change = guide.getByRole('heading', { name: 'What changed' })
  await change.scrollIntoViewIfNeeded()
  await expect(change).toBeInViewport()
  await expect(page.getByRole('navigation', { name: 'Explanation steps' })).toBeInViewport({
    ratio: 1,
  })
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1200)
})
