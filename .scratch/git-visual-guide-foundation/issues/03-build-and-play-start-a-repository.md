# 03: Build and play “Start a repository” with approved tokens

**What to build:** A complete runnable Start a repository lesson using the reviewed shared design tokens. Readers watch Alice initialize main in a folder containing notes.txt and understand that initialization leaves the file untracked with no staged contents or recorded history.

**Parent:** [08 — Open and play “Start a repository”](../../git-visual-guide/issues/08-open-and-play-start-a-repository.md)

**Blocked by:** [02 — Establish and review shared design tokens](02-establish-and-review-shared-design-tokens.md), including explicit human approval of the visual foundations.

**Status:** resolved

The original ticket and implementation spec govern all lesson behavior and presentation. Scaffolding, Tailwind integration, and licensed font setup are delivered by the preceding tickets; consume those foundations rather than duplicating setup or introducing a parallel theme. Keep the token showcase development-only, with no production lesson destination or shipped showcase code.

- [x] Present an original, short Alice-and-Bob explanation using immutable authored states and defined before-to-after transitions. Alice acts; Bob observes and asks questions. No commands execute, no accounts are accessed, and no Git/network mutations occur.
- [x] The lesson ends with HEAD referring to main before its first commit, notes.txt untracked, an empty staging area, and no commits. Do not introduce a hidden baseline commit or automatically track the file.
- [x] Compose small lesson-content, player, and scene-presentation interfaces through a reusable shell. The player exposes location and actions without interpreting commands; renderers own geometry and motion. Do not introduce a simulation engine, backend, speculative plugin system, or per-step renderer.
- [x] Preserve final revised A: scene left and guide right on desktop; no permanent sidebar; text-only Lessons / Close at the far-right header; compact breadcrumb/metadata row and title; warm paper, dark outlines, offset shadows, Git-orange/charcoal accents, and approved diagram zones.
- [x] Preserve command/editor-action distinctions, safe text-based inline-code formatting, the outlined light-bulb Key idea callout, numbered steps, Back/Next, and Replay. Omit comparison controls, debug displays, unapproved site destinations, and redundant scene-introduction copy.
- [x] Stable hash locations use a lesson slug and one-based step number. Direct entry, refresh, browser Back/Forward, and invalid-location normalization work. Opening the lesson from Lessons selects step one and closes the list.
- [x] Back/Next remain within the lesson and disable at boundaries. Numbered steps select directly. The player supports a separate Next lesson action only when a following implemented lesson exists, without placeholder or invented destinations.
- [x] Next plays the destination transition; initial load, Back, direct selection, and browser-history navigation show final states immediately. Replay independently repeats the current step's before-to-after transition without changing location. Navigation cancels superseded work, and no callback can restore a stale scene. No auto-advance occurs.
- [x] Honor reduced motion at load and on live changes: cancel motion, show the final state immediately, retain the explanation, and keep Replay visible but disabled with “Unavailable with reduced motion.” Remove travel and decorative motion rather than shortening it.
- [x] Provide named scenes, equivalent per-step state/change text, announced step changes, keyboard controls, visible focus, and sensible focus return from Lessons. Preserve at least 16px story text and 44×44px targets without relying on color alone.
- [x] Phones use compact scene-before-story ordering and normal document scrolling, with fixed safe-area-aware Back/Next and enough padding to protect content/focus. Keep numbered steps and Replay near the scene. Short desktops scroll the guide or reflow rather than shrinking the whole page; zoom enlarges content.
- [x] Vitest verifies authored state and public player behavior; Playwright in Chromium reaches every lesson step and verifies independent entry, location/history/refresh, malformed locations, boundaries, Replay, interruption, keyboard behavior, live reduced motion, and phone clearance without private-renderer test APIs.
- [x] Type checking and the production build pass. Verify compiled Tailwind utilities and no reset regressions in controls, focus, command blocks, or SVG. Record actual desktop/phone checks and any failures; do not claim production acceptance from prototype evidence.

## Verification — 20 November 2026

- `pnpm verify` passed lint, formatting, type checking, 7 Vitest tests, the production build and artifact check, and 6 Chromium tests each on the development server and production preview. The preview served the lesson at the showcase URL. The production artifact check confirmed that showcase code was absent and that shared styles, fonts, and the font license shipped.
- Chromium production preview kept two columns at 1672×920, 1440×900, 1280×720, and 1200×560. At the shorter heights the scene and numbered controls fit, and the guide scrolled within its column. At 390×844 and 320×700 it used document scrolling with the scene above the story and a fixed bottom bar. Tests checked that keyboard focus and the expanded prerequisites clear the bar. Story text measured 16 CSS px, numbered controls measured 44×44 CSS px, and all six sizes had no horizontal overflow. At real 200% Chromium zoom a 1440px browser window reflowed to 720 CSS px at DPR 2.
- Inspected the compiled command background, focus outline, SVG fills, and button states. Firefox and Playwright WebKit smoke checks passed direct entry, Replay, and Next on production preview. Desktop and phone normal-motion recordings covered initialization and Replay. Manual Safari and screen-reader checks and the human visual verdict belong to the wider production acceptance checkpoint.
- Initial checks caught a Replay that skipped the authored starting state, incorrect pre-Git file status, and two phone-test selectors that failed to find the intended text. These checks passed after the fixes. The first sandboxed Chromium run could not bind a local port. Browser checks passed with local server access.
- `pnpm audit --prod` reported no known vulnerabilities. The full audit still reported two moderate advisories in development test dependencies, for `glob` and `minimatch`. [Scaffolding audit details](01-scaffold-vue-with-human-controlled-setup.md#verification)
- Standards and Spec reviews led to updated README commands, shared platform geometry and border tokens, an explicit pre-Git file state, a focused opening animation, and stronger interruption checks. The scaffold retains its selected Vue Router dependency. The player owns hash locations through the browser History API.

[Desktop preview](../screenshots/start-repository-desktop.png) · [Phone scene](../screenshots/start-repository-phone.png) · [Phone guide](../screenshots/start-repository-phone-guide.png)
