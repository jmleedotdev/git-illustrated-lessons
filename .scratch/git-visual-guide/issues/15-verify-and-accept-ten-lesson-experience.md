# 15: Verify and accept the complete ten-lesson experience

**What to build:** A verified integrated ten-lesson experience whose behavior, presentation, accessibility, and browser results are recorded against the implementation spec. Readers can reach every authored step independently and navigate the complete course without regressions.

**Parent:** [Git visual learning website — implementation spec](../spec.md)

**Blocked by:** [12 — Merge divergent histories](12-merge-divergent-histories.md); [14 — Push main and inspect committed files](14-push-main-and-inspect-committed-files.md).

**Status:** ready-for-human

This is an integration and acceptance slice, not permission to defer feature tests, accessibility, responsive behavior, or explanatory motion from earlier tickets. The two blockers transitively cover all implementation slices. Do not modify the parent spec or map as part of closing this ticket.

- [x] All ten approved lessons, in the specified order, contain final short Alice-and-Bob explanations and consistent authored states. Generally use three to five steps without padding lighter setup lessons. No obsolete baseline commit, prototype placeholder lesson list, debug switches, or out-of-scope features ship.
- [x] Chromium Playwright coverage reaches every authored step independently, without earlier playback. Verify Lessons selection/reset/closure, direct links, numbered selection, disabled boundaries, separate Next lesson actions, and no eleventh lesson.
- [x] Verify static-host-friendly hash URLs, refresh, browser Back/Forward, malformed-location normalization, and immediate final states on initial/back/direct/history navigation. Replay preserves location and works after direct entry.
- [x] Verify Next's explanatory transitions, rapid navigation interruption, cancellation of superseded work, and absence of stale callback updates or auto-advance across staging, history, branches, merge, and remote scenes.
- [x] Run Vitest coverage for authored state and public-player behavior, including working/staged separation; c1 without parents; c2–c4 parents; c5's ordered parents; branch/HEAD positions; clean switching; snapshot inspection without checkout; origin without transfer; and push inclusion/exclusion/upstream. Test observable behavior, not private renderer details.
- [x] Test reduced motion on load and changing live during active transitions. Final states appear immediately; Replay remains visible and disabled with “Unavailable with reduced motion”; explanations remain available and object/camera travel, bounce, animated link drawing, and decorative loops are absent.
- [ ] Verify 1672×920, 1440×900, 1280×720, 1200×560, and 390×844, plus 320 CSS px narrow width and 200% browser zoom. Preserve at least 16px story text, 44×44px targets, readable essential labels, visible focus, and no horizontal page overflow.
- [ ] Confirm practical compact desktop scene/timeline fit, internal guide scrolling on short windows or vertical reflow when necessary, normal phone scene-first document scrolling, and fixed safe-area-aware phone controls that never obscure content or focus. Never shrink the whole page to counteract viewport size or zoom.
- [ ] Perform Firefox and Safari smoke checks in addition to automated Chromium coverage. Manually verify keyboard and screen-reader usability, scene names, per-step equivalent explanations, announced step changes, sensible Lessons focus return, and non-color branch cues.
- [x] Compare the final approved A treatments, not unselected variants or literal reference pixels. Responsive/accessibility requirements and the approved curriculum override historical prototype assumptions.
- [x] Confirm recorded human approval for staging/commit, history/merge, and remote/push checkpoints, each supported by desktop/phone screenshots and normal-motion recordings. If integrated changes affect an approved treatment, present updated evidence and obtain approval for the affected checkpoint.
- [x] Type checking, production build, Vitest, and Playwright pass. Verify compiled Tailwind utilities, no reset regressions in controls/focus/commands/SVG, licensed self-hosted font/fallback, and no unintended prototype dependency or external-font carryover.
- [ ] Record actual toolchain/test outcomes, browser and viewport coverage, manual accessibility/motion findings, failures and their resolution, and human checkpoint verdicts. Do not represent unavailable or unperformed checks as passing, and do not treat automated accessibility checks as certification.
- [ ] Resolve acceptance failures and rerun affected checks before claiming completion. No repository initialization, remote creation, push, PR, site publication, or deployment is implied by acceptance.

## Comments

Integrated verification is complete for the checks below. **Final acceptance is open:** the three visual checkpoints are approved, but native Safari, manual accessibility and motion, phone safe-area, and remaining label/focus checks are not complete. The parent spec and map are unchanged.

### Automated verification

- `pnpm verify` passed on macOS 26.7.1 with Node 24.22.2 and pnpm 12.14.0: palette, lint, formatting, typecheck, 21 Vitest tests, Vite production build, artifact checks, and 52 Playwright tests each against development and production preview. Playwright 1.65.1 used Chromium 159.0.8154.6. The built CSS retains Tailwind utilities (e.g. `.ml-auto`), command styling, shared tokens, and local JetBrains Mono Regular/Bold with the SIL OFL and monospace fallback. No showcase, external font/CDN stylesheet, prototype switcher, or extra lesson ships. The browser checks exercise command styling, focus, and SVG alongside the build checks.
- The [course suite](../../../e2e/course.spec.ts) verifies the ten-lesson order and all 32 steps. Every URL is loaded in a fresh document at each of the six CSS viewport sizes. It checks current-step live-region text, named scene, caption/guide text agreement, visible targets of at least 44×44px, story text of at least 16px, and no horizontal overflow. It checks boundary actions, Lessons reset/closure, history, and reduced motion at entry. Six representative Next transitions (staging, history, branching, merge, origin, and push) are interrupted with numbered selection; the test observes cancellation and settlement of the native animation promises, advances JS timers separately, then checks that the selected URL and accessible scene are unchanged and no animation remains. The existing scene suites verify visible Git outcomes, explanatory motion, Replay, live reduced motion, and focus/scroll behavior.
- Vitest verifies working/staged separation, root and ordered parents, branch/HEAD and clean checkout state, origin without transfer, and push inclusion/exclusion/upstream. A new App test confirms reading c3 leaves the main checkout at c2, the checkout contents unchanged, and the hash untouched.
- **Failure and resolution:** On a 390px phone viewport, Tab from the final Lessons link focused Replay but left the overlay open over it. The new Playwright test failed on the visible overlay. The overlay now closes when focus enters the lesson, without moving focus back; the regression test and full suites pass. Escape and selecting a lesson still return focus to the toggle. An initial matrix assertion also misidentified the plural remote scene name; the check now uses the two actual scene names.

### Browser, layout, and accessibility evidence

| Check | Result |
| --- | --- |
| Chromium 1672×920, 1440×900 | All 32 steps pass the matrix. Sampled staging, root commit, merge, origin, and push keep scene and timeline in the viewport; the guide scrolls internally when needed. |
| Chromium 1280×720, 1200×560 | All 32 steps pass the matrix. Sampled staging and remote scenes keep the timeline inside the viewport with internal guide scrolling. Root-commit and merge scenes allow vertical document reflow rather than shrinking essential labels. |
| Chromium 390×844, 320×700 | All 32 steps pass the matrix. Scene-first document scrolling; existing browser tests exercise focus and guide clearance above fixed navigation. The CSS includes safe-area insets; physical device inset behavior was not manually checked. |
| Chromium real browser zoom 200% | A 1440px browser window produced 720×406 CSS px at DPR 2. Sampled staging, root commit, merge, origin, and push: document reflow, no horizontal overflow, 16px story text, targets at least 44×44px, and visible focused step control above fixed navigation. |
| Firefox 159.0 and Playwright WebKit 27.2 | Production smoke at 1440×900 and 390×844: the same five states open directly, Replay responds to keyboard input and settles on live reduced motion, and no page errors or horizontal overflow were observed. Firefox reached Lessons by Tab; the WebKit harness needed programmatic initial focus before testing Enter/Escape and focus return. |
| Native Safari 27.0 | Blocked: Safari WebDriver refused session creation because **Allow remote automation** is disabled. Playwright WebKit is supporting evidence, not a substitute. |
| Manual keyboard, screen reader, and motion | Browser-driven keyboard checks and accessibility-tree checks passed for the tested flows, including step-status updates, caption/guide text agreement, and the current-branch `*` cue. No human keyboard/VoiceOver walkthrough, spoken announcement check, or manual live motion-preference change was performed. These results are not accessibility certification. |

The matrix is partial: the exhaustive run measures text and control sizes and overflow, not essential-label clipping/readability or focus at every size. The 200% smoke covers five representative states, not every lesson step. The screenshots support the visual comparison only at their two recorded viewports.

### Revised A and checkpoint verdicts

Compared revised A from `prototype/git-visual-guide` with production preview, side by side at 100% zoom and DPR 1: [1440×900](../screenshots/15/revised-a-1440.jpg) and [390×844](../screenshots/15/revised-a-390.jpg). The staging `0 0 960 500` viewBox retains the grid and isometric platform paths; approved folded pages replace the prototype glyphs and the history platform is empty until c1. The root commit stays alongside working/staged contents; the merge uses the open `-50 -65 1060 475` graph, the five approved sphere centers, parent paths to the outlines, and ordered labels on the actual arrow segments. Remote preserves the `0 0 900 420` viewBox, two dotted grid panels, local refs, the dashed origin path, and the separate push arrow. Phones carry readable text equivalents rather than shrinking the wide graphs. Production uses its lesson-specific timeline, separate adjacent-lesson links, and larger native targets. The Lessons fix changes focus behavior, not scene geometry or choreography.

The human confirmed “reviewed and approved” in response to the integrated visual review. No visual corrections were requested. This records the three checkpoint verdicts, not results for the outstanding manual checks.

| Checkpoint | Production screenshots and normal-motion recordings | Human verdict |
| --- | --- | --- |
| Staging/commit | [Ticket 10 evidence](10-record-commits-and-read-history.md#comments) | Approved. |
| History/merge | [Ticket 12 evidence](12-merge-divergent-histories.md#comments) | Approved. |
| Remote/push | [Ticket 14 evidence](14-push-main-and-inspect-committed-files.md#comments) plus the current comparison above | Approved. The recordings predate removal of repeated prerequisites from remote opening steps; the scene treatment and choreography did not change. |

**Independent review:** Standards and Spec both flagged the original fake-clock-only interruption check, which could not establish native animation settlement. The revised test awaits the browser’s animation promises and checks cancellation before advancing JS timers. The review also led to clearer target names and narrower claims about the layout matrix and spoken announcements.

To close: run native Safari and a human keyboard/VoiceOver walkthrough (including list dismissal, announced steps, equivalent scene text, non-color branch cues, and phone fixed-bar/safe-area clearance); finish visual label/focus checks across the matrix; and manually check normal motion, reduced motion, and a live preference change. Address any findings and rerun the affected checks before marking acceptance complete.
