# 09: Edit, inspect, and stage selected contents

**What to build:** Complete Edit and inspect and Choose what to stage lessons. Readers watch Alice edit notes.txt, inspect its status, select contents for staging, and edit again while the staging area retains its earlier selection.

**Parent:** [Git visual learning website — implementation spec](../spec.md)

**Blocked by:** [Foundation 03 — Build and play “Start a repository” with approved tokens](../../git-visual-guide-foundation/issues/03-build-and-play-start-a-repository.md).

**Status:** resolved

Extend the production experience established by foundation ticket 03 (the completed first-lesson slice of 08) and preserve the parent spec's visual, player, responsive, accessibility, and safety contracts. Each lesson is independently authored; earlier playback is never a prerequisite for opening it.

- [x] Edit and inspect begins with the initialized repository, untracked notes.txt, and no commits. Editing and inspecting git status leave the file untracked and create no history automatically.
- [x] Choose what to stage begins with edited, untracked notes.txt and no commits. Staging selected contents starts tracking the file while leaving the working file present.
- [x] A subsequent editor change produces newer working-directory contents while the staging area retains the selected earlier contents. Show both explicitly, with no hidden baseline commit and no implication that staging moves a file.
- [x] Author short Alice-and-Bob steps with real commands only in standalone command blocks, plain actions under “In Alice's editor,” ordinary inline-code references, meaningful Key idea callouts, and sentence-based descriptions of content changes.
- [x] Preserve the approved isometric staging treatment, Git palette, compact heading, and scene-left/guide-right composition. Provide equivalent state/change text and readable scene-first phone presentation without removing essential distinctions.
- [x] Next and Replay explain selected contents being copied into staging without removing the working file. Later editing must visibly leave staged contents unchanged. Whole-scene fades alone are insufficient.
- [x] Both lessons and every step open directly into completed authored states. Lessons selects step one and closes; Back/Next stay within the lesson; a separate Next lesson action opens the following available lesson at step one.
- [x] Replay works after direct entry without altering location. Navigating or changing to reduced motion during staging settles correctly and cannot be overwritten by stale animation work; no auto-advance occurs.
- [x] Vitest checks untracked-to-staged behavior, version separation, and independent starting states through content/player interfaces. Playwright reaches every new step and verifies lesson switching, deep links, Next lesson, Replay, interruption, and reduced motion.
- [x] Verify keyboard/focus behavior, named scenes and equivalent text, 16px story text, 44×44px targets, phone fixed-bar clearance, short-desktop scrolling/reflow, and no horizontal page overflow. Build/type checks and existing tests remain green; record actual outcomes.

## Comments

- Implemented two independent lessons with five directly addressable steps. The staging transition sends a second folded page from the working directory to the staging area. The later edit changes only the working copy. Lesson navigation or live reduced motion cancels in-flight playback.
- `pnpm verify` passed: palette, lint, format, types, 10 Vitest tests, production build and artifact checks, and 13 Chromium tests each against dev and production preview. Targeted Firefox and Playwright WebKit smoke checks passed on production preview (direct entry, Replay, live reduced motion, and the next edit).
- Compared revised A and the implemented staging scene side by side in Chromium at 1440×900 and 390×844, both at 100% zoom. They share the 960×500 viewBox, grid and platform paths, and zone placement. Production uses the approved folded-page glyphs, an empty history zone instead of the study’s baseline, and readable phone labels outside the SVG. The production copy animation replaces the study’s static transfer arrow. Larger keyboard targets and story text, a fixed phone navigation bar, and internal guide scrolling preserve accessibility.
- On Chromium production preview, 1672×920, 1440×900, 1280×720, and 1200×560 fit the scene and timeline; the guide scrolls independently. The Key idea fits without scrolling at the two larger sizes. At 390×844 and 320×700 the page scrolls with a fixed bottom bar, and keyboard focus and the Next lesson link clear it. All six sizes had no horizontal overflow, 16 CSS px story text, and controls at least 44×44 CSS px. Chromium at real 200% browser zoom reflowed from 1440 to 720 CSS px at DPR 2, with no horizontal overflow.
- Independent Standards and Spec reviews led to a native Next lesson link, shared SVG version typography, one animation-settlement path, shorter guide copy, and version/state assertions at every new URL. Desktop and phone screenshots and normal-motion recordings were checked for this slice; human staging/commit acceptance, manual Safari, and screen-reader review are not claimed here. The staging/commit checkpoint remains in [ticket 10](10-record-commits-and-read-history.md).
- Follow-up: the course opener and Next lesson now animate step one. Finite repository transitions use the existing 1.03-second caption timing; the pauseable inspection loop is unchanged. At 1440×900 and 390×844 (100% zoom), settled staging captures were identical to the implementation compared with revised A above, and the status pulse measured 1.03 seconds in both. `pnpm verify` passed with 10 unit tests and 15 Chromium tests each on dev and preview.
