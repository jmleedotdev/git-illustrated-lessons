# 14: Push main and inspect committed files

**What to build:** The complete Push the work lesson. Readers see main's reachable committed history published to GitHub, understand the upstream association, and inspect the named files from the hosted c5 snapshot without mistaking it for Alice's live working directory.

**Parent:** [Git visual learning website — implementation spec](../spec.md)

**Blocked by:** [13 — Create and connect an empty GitHub repository](13-create-and-connect-empty-github-repository.md).

**Status:** ready-for-agent

Extend the separate repository presentation and independently authored post-merge states from 13. Preserve the parent spec's visual, motion, responsive, accessibility, and safety contracts.

- [x] Begin independently with clean local main at c5, ideas at c3, HEAD on main, origin configured, no upstream, and an empty hosted repository. Use the exact c1–c5 snapshots and ordered parent relationships from the parent spec.
- [x] Illustrate git push -u origin main publishing the needed history reachable from main: c1–c5, including merged ideas commits. Hosted main ends at c5, while local main and ideas remain in place.
- [x] Do not separately publish an ideas branch name or uncommitted working-directory/staged contents. Teach the exclusion without inventing a dirty remote-lesson starting state.
- [x] Explain that -u establishes local main's upstream as origin/main, the default destination for later pushes, not automatic synchronization.
- [x] The final guide explicitly names notes.txt and ideas.txt as files recorded in c5 and distinguishes the latest committed snapshot from Alice's live working directory. Explain that later edits or staging alone cannot update GitHub.
- [x] Preserve plain command text with no special -u highlight. Use ordinary inline-code styling for -u and filenames in prose, with no custom amber/underline treatment.
- [x] Retain approved separate dotted/grid panels, comic spheres, repository headings, local HEAD/branch identifiers, and origin/push connection labels. Explain through the scene note and guide, not added panel captions, legends, status strips, bottom explanations, or the unselected hosted file-list design.
- [x] Use an explicit push relationship and explanatory history-transfer motion while retaining local history. Origin-only states must still show no transfer. Replay works independently, leaves location unchanged, and never auto-advances; interruption and live reduced motion settle safely.
- [x] The final lesson has disabled Next at its last step and no Next lesson leading to an invented eleventh lesson. Every step remains directly reachable and refresh/history-safe.
- [x] Vitest validates included reachable history, hosted main, retained local references, excluded ideas branch name/uncommitted contents, and upstream. Playwright reaches every new step and verifies independent entry, final navigation boundaries, Replay, interruption, keyboard behavior, and reduced motion.
- [x] Verify readable desktop/phone layouts, equivalent textual repository relationships, named scenes, step announcements, focus behavior, target/text minima, and fixed-bar clearance without horizontal overflow. Build/type checks and regression tests remain green; record actual outcomes.
- [x] Present desktop and phone screenshots plus normal-motion recordings for the remote/push checkpoint, covering empty GitHub, origin without transfer, push, local reference retention, upstream, ordinary command styling, and final committed-file inspection.
- [x] Record the human verdict, address requested corrections, and obtain remote/push approval before treating this ticket's visual acceptance as complete. No real push, account access, or network mutation occurs.

## Comments

Implemented lesson 10 as three independently reachable steps: [ready to push](/#/push-the-work/1), [push main](/#/push-the-work/2), and [inspect files](/#/push-the-work/3). No actual GitHub access or push occurs. **Human remote/push verdict: approved** in the [integrated review](15-verify-and-accept-ten-lesson-experience.md#revised-a-and-checkpoint-verdicts).

**Checkpoint evidence** (Chromium production preview, 100% zoom, DPR 1):

| State | Desktop · 1440×900 | Phone · 390×844 |
| --- | --- | --- |
| Empty GitHub | [Screenshot](../screenshots/14/desktop-empty.png) | [Screenshot](../screenshots/14/phone-empty.png) |
| Configured origin, no transfer | [Screenshot](../screenshots/14/desktop-origin.png) | [Screenshot](../screenshots/14/phone-origin.png) |
| Push and upstream association | [Screenshot](../screenshots/14/desktop-push.png) | [Screenshot](../screenshots/14/phone-push.png) |
| Committed-file inspection | [Screenshot](../screenshots/14/desktop-inspect.png) | [Scene](../screenshots/14/phone-inspect.png) · [Guide](../screenshots/14/phone-inspect-guide.png) |
| Normal-motion walkthrough | [Recording](../screenshots/14/desktop-normal-motion.webm) | [Recording](../screenshots/14/phone-normal-motion.webm) |

**Visual comparison:** Opened the matching revised A states and production preview side by side at both sizes. The SVG `0 0 900 420` viewBox, separate dotted panels and diamond grids, sphere centers, branch placement, parent paths, dashed origin path, and solid push path match the study geometry. Production uses the approved shared `CommitSphere`, palette, typography and native controls instead of the prototype-specific styling. The production timeline is lesson-specific, with separate lesson links and no next lesson at the end. The empty-panel placeholder and debug controls in the archived study are omitted per the canonical approval. On phones and short desktop windows, production replaces the SVG with readable relationships, with full ancestry and upstream text under Diagram in words. During push, the hosted copies travel together while local history stays in place; on the text layout only the push indication and hosted summary reveal. No transfer runs for `origin` alone.

**Verification:** `pnpm verify` passed: palette, lint, format, types, build and production artifact checks, 20 Vitest tests, and 43 Playwright tests each in dev and production preview. Focused unit and browser tests first failed on the absent lesson and missing push arrow respectively; both passed after implementation. A browser assertion comparing exact bounding boxes across different layouts was corrected to check stationary local history within the same layout and settled placement after reduced motion. Chromium checks cover direct links and reload, independent Replay, interruption, history, keyboard focus and step status, reduced motion, and the final boundary. Phone tests measured 16px text and at least 44×44px on the focused control, with clear fixed-bar clearance at 320px. The matched 1440px and 390px screenshot states had no horizontal overflow. The final build also passed Chromium layout checks at 1672×920, 1440×900, 1280×720, 1200×560, 390×844, and 320×700, and real 200% Chromium browser zoom (720×406 CSS px, DPR 2). Firefox 159 and Playwright WebKit 27.2 passed push, live reduced-motion, final-boundary, and keyboard smoke checks at 1440×900. Native Safari 27 WebDriver could not open a session because Allow remote automation is disabled; WebKit is not a substitute for that acceptance check. Named scenes and equivalent text were checked in the accessibility tree, but a manual screen-reader pass is still pending.

**Review:** Standards found no hard breaches and two maintainability notes: the compact history range now comes from hosted commits, and branch/parent reveal derives its timing from the end of travel. Spec found a local graph jump on entering push and an incomplete manual matrix. The Replay explanation now fits beside Replay in the wide SVG layout, preserving local position when the push starts; a regression test confirms the stationary local graph from the ready step. The added matrix results are above. Native Safari and a manual screen-reader pass remain open for integrated acceptance.
