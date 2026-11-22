# 12: Merge divergent histories

**What to build:** The complete Bring work together lesson. Readers see Alice commit a non-conflicting notes.txt change on main, then merge ideas into a two-parent commit without erasing either history.

**Parent:** [Git visual learning website — implementation spec](../spec.md)

**Blocked by:** [11 — Create and switch branches](11-create-and-switch-branches.md).

**Status:** resolved

Extend the branch/history presentation from 11. Do not add conflict resolution, branch deletion, or a simulation engine.

- [x] Independently begin clean on main at c2, with ideas at c3. c3 has parent c2 and records c2's notes.txt plus ideas.txt; HEAD is on main.
- [x] Alice changes notes.txt in her editor, stages it, and commits as c4 with parent c2. main advances to c4 while ideas stays at c3, creating divergent, non-conflicting histories.
- [x] Merging ideas into main creates c5 with ordered parents c4 first and c3 second. The snapshot combines revised notes.txt from c4 and ideas.txt from c3.
- [x] End clean with working directory and staging matching c5, main at c5, ideas still at c3, and HEAD still on main. Neither branch history is deleted or represented as a separate repository.
- [x] Preserve open framing and separation between branch paths, approved comic spheres and snapshot labels, explicit HEAD/current-branch cues, and arrows meeting circular silhouettes and pointing toward parents.
- [x] Keep parent 1 and parent 2 labels close to their actual merge-arrow segments and rotated with those segments. Both parents and ancestry paths must remain understandable in equivalent narrow-screen text.
- [x] Explanatory motion shows the new commit and reference changes rather than only fading the scene. Replay works independently after direct entry; interruption and live reduced-motion changes settle correctly without stale updates or auto-advance.
- [x] Vitest verifies all snapshots, ordered parents, branch/HEAD positions, clean final state, and independent entry. Playwright reaches every new step and verifies navigation, Replay, interruption, keyboard behavior, reduced motion, and no horizontal overflow.
- [x] Preserve distinct working/staged/inspected snapshots, readable story/labels, target/text minima, phone safe-area clearance, accessible state/change explanations, and short-height scrolling or reflow. Type checking, build, and regression tests pass; record actual results.
- [x] Present desktop and phone screenshots plus normal-motion recordings for the history/merge checkpoint, including shared ancestry, branch/HEAD markers, checkout changes, inspection independence, open framing, arrows, and both ordered merge parents.
- [x] Record the human verdict, address requested corrections, and obtain history/merge approval before treating this ticket's visual acceptance as complete. Prototype motion and automated tests do not establish that approval.

## Comments

Implemented the five-step **Bring work together** lesson. **Human visual verdict: approved** in the [integrated review](15-verify-and-accept-ten-lesson-experience.md#revised-a-and-checkpoint-verdicts). Open `/#/bring-work-together/5` on the development or production preview server to inspect the merge directly, then choose Replay to see the transition from divergence.

On desktop and phone, returning to `main` restored the checkout and left `ideas` at `c3`. `c3` and `c4` shared `c2`; the merge produced `c5` with `c4` first and `c3` second. Inspecting `c3` did not leave `c5`. Normal-motion recordings covered checkout, inspection, divergence, merge, and Replay.

Compared return, divergence, and merge with the matching revised A history study from `prototype/git-visual-guide` in Chromium, at the same 1440×900 and 390×844 viewports, DPR 1 and 100% zoom. Desktop merge retains the `-50 -65 1060 475` viewBox, the five commit centers, and the comic sphere paths. Parent arrows touch the 42-unit silhouettes rather than using the study's 46-unit clearance. Both numbered labels sit 6 units above their actual arrow segments and rotate with them. Production enlarges the graph labels and offsets the raised c3 file labels to clear the diagonal. It keeps the checkout columns, turns the inspector into a disclosure, and separates editor, stage, and commit into distinct steps. On phone, ordered history rows replace the SVG, and numbered controls wrap into two rows without splitting labels. The phone recording was used to check the fixed Back/Next bar during scrolling. At 1200×560, the graph remains visible and the document reflows rather than shrinking labels.

`pnpm verify` passed palette, lint, format, type and build checks, production artifact checks, 17 Vitest tests, and 33 Playwright tests each against development and production preview. New browser coverage visits every step, including fresh loads; checks 1440×900, 1440×899, 1200×560, and 320×700; and verifies phone keyboard focus above fixed navigation, merge Replay, interruption, and live reduced motion. Native Safari and screen-reader checks were not performed for this ticket.

**Standards review:** No hard violations reported. Shared checkout-caption calculation between graph and staging scenes, and exposed a named final commit count to keep the graph framing stable.

**Spec review:** Kept the graph on short, wide screens instead of hiding it, added fresh loads for intermediate steps, and recorded verification results.
