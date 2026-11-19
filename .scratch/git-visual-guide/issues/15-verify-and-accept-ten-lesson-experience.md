# 15: Verify and accept the complete ten-lesson experience

**What to build:** A verified integrated ten-lesson experience whose behavior, presentation, accessibility, and browser results are recorded against the implementation spec. Readers can reach every authored step independently and navigate the complete course without regressions.

**Parent:** [Git visual learning website — implementation spec](../spec.md)

**Blocked by:** [12 — Merge divergent histories](12-merge-divergent-histories.md); [14 — Push main and inspect committed files](14-push-main-and-inspect-committed-files.md).

**Status:** ready-for-agent

This is an integration and acceptance slice, not permission to defer feature tests, accessibility, responsive behavior, or explanatory motion from earlier tickets. The two blockers transitively cover all implementation slices. Do not modify the parent spec or map as part of closing this ticket.

- [ ] All ten approved lessons, in the specified order, contain final short Alice-and-Bob explanations and consistent authored states. Generally use three to five steps without padding lighter setup lessons. No obsolete baseline commit, prototype placeholder lesson list, debug switches, or out-of-scope features ship.
- [ ] Chromium Playwright coverage reaches every authored step independently, without earlier playback. Verify Lessons selection/reset/closure, direct links, numbered selection, disabled boundaries, separate Next lesson actions, and no eleventh lesson.
- [ ] Verify static-host-friendly hash URLs, refresh, browser Back/Forward, malformed-location normalization, and immediate final states on initial/back/direct/history navigation. Replay preserves location and works after direct entry.
- [ ] Verify Next's explanatory transitions, rapid navigation interruption, cancellation of superseded work, and absence of stale callback updates or auto-advance across staging, history, branches, merge, and remote scenes.
- [ ] Run Vitest coverage for authored state and public-player behavior, including working/staged separation; c1 without parents; c2–c4 parents; c5's ordered parents; branch/HEAD positions; clean switching; snapshot inspection without checkout; origin without transfer; and push inclusion/exclusion/upstream. Test observable behavior, not private renderer details.
- [ ] Test reduced motion on load and changing live during active transitions. Final states appear immediately; Replay remains visible and disabled with “Unavailable with reduced motion”; explanations remain available and object/camera travel, bounce, animated link drawing, and decorative loops are absent.
- [ ] Verify 1672×920, 1440×900, 1280×720, 1200×560, and 390×844, plus 320 CSS px narrow width and 200% browser zoom. Preserve at least 16px story text, 44×44px targets, readable essential labels, visible focus, and no horizontal page overflow.
- [ ] Confirm practical compact desktop scene/timeline fit, internal guide scrolling on short windows or vertical reflow when necessary, normal phone scene-first document scrolling, and fixed safe-area-aware phone controls that never obscure content or focus. Never shrink the whole page to counteract viewport size or zoom.
- [ ] Perform Firefox and Safari smoke checks in addition to automated Chromium coverage. Manually verify keyboard and screen-reader usability, scene names, per-step equivalent explanations, announced step changes, sensible Lessons focus return, and non-color branch cues.
- [ ] Compare the final approved A treatments, not unselected variants or literal reference pixels. Responsive/accessibility requirements and the approved curriculum override historical prototype assumptions.
- [ ] Confirm recorded human approval for staging/commit, history/merge, and remote/push checkpoints, each supported by desktop/phone screenshots and normal-motion recordings. If integrated changes affect an approved treatment, present updated evidence and obtain approval for the affected checkpoint.
- [ ] Type checking, production build, Vitest, and Playwright pass. Verify compiled Tailwind utilities, no reset regressions in controls/focus/commands/SVG, licensed self-hosted font/fallback, and no unintended prototype dependency or external-font carryover.
- [ ] Record actual toolchain/test outcomes, browser and viewport coverage, manual accessibility/motion findings, failures and their resolution, and human checkpoint verdicts. Do not represent unavailable or unperformed checks as passing, and do not treat automated accessibility checks as certification.
- [ ] Resolve acceptance failures and rerun affected checks before claiming completion. No repository initialization, remote creation, push, PR, site publication, or deployment is implied by acceptance.
