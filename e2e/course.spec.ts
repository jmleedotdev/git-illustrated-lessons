import { expect, test } from '@playwright/test'

// The approved curriculum is the oracle, not the application's lesson registry.
const curriculum = [
  ['start-a-repository', 'Start a repository', 3],
  ['edit-and-inspect', 'Edit and inspect', 2],
  ['choose-what-to-stage', 'Choose what to stage', 3],
  ['record-a-commit', 'Record a commit', 2],
  ['read-the-history', 'Read the history', 4],
  ['create-and-switch-branches', 'Create and switch branches', 6],
  ['bring-work-together', 'Bring work together', 5],
  ['create-a-remote-repository', 'Create a remote repository', 2],
  ['connect-local-and-remote', 'Connect local and remote', 2],
  ['push-the-work', 'Push the work', 3],
] as const

const lessonUrl = (slug: string, step = 1) => `/${slug}/${step}`

test('walks the approved course in order using only the reader’s navigation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const lessons = page.getByRole('button', { name: 'Lessons', exact: true })
  const list = page.getByRole('navigation', { name: 'Lessons' })
  const timeline = page.getByRole('navigation', { name: 'Explanation steps' })
  const back = page.getByRole('button', { name: 'Back', exact: true })
  const next = page.getByRole('button', { name: 'Next', exact: true })

  await lessons.press('Enter')
  await expect(list.getByRole('link')).toHaveText(
    curriculum.map(([, title], index) => `${String(index + 1).padStart(2, '0')} ${title}`),
  )
  await page.keyboard.press('Escape')
  await expect(lessons).toBeFocused()

  for (const [index, [slug, title, count]] of curriculum.entries()) {
    await expect(page).toHaveURL(lessonUrl(slug))
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title)
    await expect(timeline.getByRole('button')).toHaveCount(count)
    await expect(back).toBeDisabled()
    const expectCurrentStep = async (step: number) => {
      await expect(page).toHaveURL(lessonUrl(slug, step))
      await expect(page.getByRole('status')).toContainText(`Step ${step} of ${count}`)
      await expect(
        timeline.getByRole('button', { name: new RegExp(`^Step ${step}:`) }),
      ).toHaveAttribute('aria-current', 'step')
    }
    await expectCurrentStep(1)
    for (let step = 2; step <= count; step++) {
      await next.click()
      await expectCurrentStep(step)
    }
    await expect(next).toBeDisabled()
    const adjacent = page.getByRole('link', { name: /^Next:/ })
    const following = curriculum.slice(index + 1, index + 2)
    await expect(adjacent).toHaveText(following.map(([, title]) => `Next: ${title}`))
    for (const link of await adjacent.all()) await link.press('Enter')
  }

  await lessons.press('Enter')
  await list.getByRole('link', { name: '10 Push the work' }).press('Enter')
  await expect(page).toHaveURL(lessonUrl('push-the-work'))
  await expect(list).toBeHidden()
  await expect(lessons).toBeFocused()
  await page.goBack()
  await expect(page).toHaveURL(lessonUrl('push-the-work', 3))
  await page.goForward()
  await expect(page).toHaveURL(lessonUrl('push-the-work'))
})

test('leaving Lessons with Tab uncovers the focused phone control', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(lessonUrl('choose-what-to-stage', 2))
  await page.getByRole('button', { name: 'Lessons', exact: true }).press('Enter')
  const list = page.getByRole('navigation', { name: 'Lessons' })
  await list.getByRole('link', { name: '10 Push the work' }).press('Tab')
  const replay = page.getByRole('button', { name: 'Replay' })
  await expect(replay).toBeFocused()
  await expect(list).toBeHidden()
  await expect(replay).toHaveCSS('outline-style', 'solid')
})

test('superseded motion cannot update or advance the selected step across scenes', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.clock.install()
  const scene = page.getByRole('figure')
  const next = page.getByRole('button', { name: 'Next', exact: true })

  for (const [slug, step] of [
    ['choose-what-to-stage', 1],
    ['read-the-history', 2],
    ['create-and-switch-branches', 1],
    ['bring-work-together', 4],
    ['connect-local-and-remote', 1],
    ['push-the-work', 1],
  ] as const) {
    const startingUrl = lessonUrl(slug, step)

    await test.step(startingUrl, async () => {
      await page.goto(startingUrl)
      await expect(scene).toHaveAttribute('aria-busy', 'false')
      const startingScene = await scene.ariaSnapshot()
      await next.click()
      await expect(page).toHaveURL(lessonUrl(slug, step + 1))
      await expect(scene).toHaveAttribute('aria-busy', 'true')
      await expect
        .poll(() => scene.evaluate((figure) => figure.getAnimations({ subtree: true }).length))
        .toBeGreaterThan(0)
      const interrupted = await scene.evaluateHandle((figure) => {
        const animations = figure.getAnimations({ subtree: true })
        return { finished: Promise.allSettled(animations.map((animation) => animation.finished)) }
      })
      await page.getByRole('button', { name: new RegExp(`^Step ${step}:`) }).click()
      await expect(scene).toHaveAttribute('aria-busy', 'false')
      const outcomes = await interrupted.evaluate(async ({ finished }) =>
        (await finished).map(({ status }) => status),
      )
      expect(outcomes).toContain('rejected')
      await interrupted.dispose()
      // Flush JS timers separately; the browser settles native animation promises above.
      await page.clock.fastForward(2000)
      await expect(page).toHaveURL(startingUrl)
      await expect(scene).toHaveAttribute('aria-busy', 'false')
      expect(await scene.ariaSnapshot()).toBe(startingScene)
      expect(await scene.evaluate((figure) => figure.getAnimations({ subtree: true }).length)).toBe(
        0,
      )
    })
  }
})

for (const [width, height] of [
  [1672, 920],
  [1440, 900],
  [1280, 720],
  [1200, 560],
  [390, 844],
  [320, 700],
] as const) {
  test(`every scene fits the ${width}×${height} CSS viewport with reduced motion`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const [slug, title, count] of curriculum) {
      for (let step = 1; step <= count; step++) {
        const url = lessonUrl(slug, step)

        await test.step(url, async () => {
          await page.goto(url)
          // Hash-only navigation can reuse the document. Reload to exercise independent entry.
          await page.reload()

          await expect(page.getByRole('heading', { level: 1 })).toHaveText(title)
          await expect(page.getByRole('status')).toContainText(`Step ${step} of ${count}`)
          const scene = page.getByRole('figure')
          await expect(scene).toHaveAccessibleName(
            /^(Repository illustration|Local and GitHub repositories)$/,
          )
          await expect(scene).toHaveAttribute('aria-busy', 'false')
          const guide = page
            .getByRole('region')
            .filter({ has: page.getByRole('heading', { name: 'What changed' }) })
          const story = guide.getByRole('paragraph').filter({ visible: true })
          await expect(story.first()).toBeVisible()
          const explanation = await scene.locator('figcaption').innerText()
          expect(explanation.trim()).not.toBe('')
          await expect(guide.getByText(explanation, { exact: true })).toBeVisible()
          const layout = await story.evaluateAll(async (paragraphs) => {
            await document.fonts.ready
            return {
              viewport: document.documentElement.clientWidth,
              pageWidth: document.documentElement.scrollWidth,
              smallestText: Math.min(
                ...paragraphs.map((p) => parseFloat(getComputedStyle(p).fontSize)),
              ),
            }
          })
          expect(layout.pageWidth).toBe(layout.viewport)
          expect(layout.smallestText).toBeGreaterThanOrEqual(16)
          const controls = page
            .getByRole('button')
            .or(page.getByRole('link'))
            .or(page.getByText('Diagram in words', { exact: true }))
            .or(page.getByText('Before you begin', { exact: true }))
          const targets = await controls.evaluateAll((elements) =>
            elements.map((control) => {
              const { width, height } = control.getBoundingClientRect()
              return {
                label: control.getAttribute('aria-label') ?? control.textContent?.trim(),
                size: Math.min(width, height),
              }
            }),
          )
          for (const { label, size } of targets) expect(size, label).toBeGreaterThanOrEqual(44)
          const replay = scene.getByRole('button', { name: 'Replay' })
          await expect(replay).toBeDisabled()
          await expect(replay).toHaveAccessibleDescription('Unavailable with reduced motion.')
          expect(
            await scene.evaluate((figure) => figure.getAnimations({ subtree: true }).length),
          ).toBe(0)
        })
      }
    }
  })
}
