# 11: Create and switch branches

**What to build:** The complete Create and switch branches lesson. Readers see Alice create ideas without switching, switch to it, record ideas.txt, and return cleanly to main while both branches retain their shared history.

**Parent:** [Git visual learning website — implementation spec](../spec.md)

**Blocked by:** [10 — Record commits and read their history](10-record-commits-and-read-history.md).

**Status:** ready-for-agent

Extend the history presentation from 10, preserving the parent's approved visual, playback, accessibility, and responsive contracts.

- [x] Start independently with a clean checkout on main at c2 and c1 as c2's parent. Creating ideas puts both names at c2 without copying commits or files and leaves HEAD on main.
- [x] Switching to ideas moves HEAD to that branch. Because both names still point to c2, checked-out contents initially remain unchanged.
- [x] Alice creates ideas.txt in her editor, stages it, and commits as c3. Its sole parent is c2; its snapshot includes notes.txt unchanged from c2 plus ideas.txt. Only ideas advances to c3; main stays at c2.
- [x] Switching cleanly back to main restores c2's working-directory and staged contents. ideas.txt is absent from that checkout but remains recorded in c3; no history is deleted.
- [x] Preserve comic spheres, open shared-history framing, readable recorded-file labels, bold starred current-branch labels, neutral inactive labels, peach checkout coloring, parent arrows, and an explicit HEAD → branch → commit readout. Explain branch labels as references, not repository copies.
- [x] Recorded-snapshot inspection remains separate from checkout and does not move HEAD or branches. Carry current-branch markers and equivalent history relationships into readable narrow-screen views.
- [x] Use authored marker/checkout transitions to explain changes, with independently replayable before-to-after states, immediate direct/back/history selection, safe navigation interruption, live reduced motion, and no auto-advance.
- [x] Vitest verifies branch creation without switching, only-current-branch advancement, c3's snapshot/parent, clean checkout restoration, and immutable starting states. Playwright reaches every step and verifies visible/textual relationships and inspection without branch switching.
- [x] Preserve command/editor-action hierarchy, named scenes and state/change explanations, keyboard/focus behavior, step announcements, 16px story text, 44×44px targets, and phone safe-area/content clearance. Verify desktop/phone layouts without horizontal overflow, with build/type checks and regression tests passing.

## Comments

Implementation is complete. **Human visual verdict: pending.** The parent spec's history/merge gate remains open; this ticket does not yet include the two-parent merge.

| Production evidence | Desktop (1440×900) | Phone (390×844) |
| --- | --- | --- |
| Commit on ideas: only ideas advances | [Screenshot](../screenshots/11/desktop-commit.png) | [Screenshot](../screenshots/11/phone-commit.png) |
| Return to main: ideas.txt stays in c3 | [Screenshot](../screenshots/11/desktop-return.png) | [Screenshot](../screenshots/11/phone-return.png) |
| Normal motion: create, switch, edit, stage, commit, and switch back | [Recording](../screenshots/11/desktop-normal-motion.webm) | [Recording](../screenshots/11/phone-normal-motion.webm) |

Compared the create and return states side by side with the revised A history study from `prototype/git-visual-guide` in Chromium at 1440×900 and 390×844, DPR 1, 100% zoom. The desktop retains scene-left/guide-right, the approved sphere paths, the c1–c3 placements and marker offsets, and arrows that point to the parent outlines. Its tighter `-20 -54 650 447` viewBox omits space reserved for divergence and merge. The parent arrows end at the 42-unit outlines instead of the study’s 46-unit clearance. The plain-text HEAD chain sits above the graph without a badge, and the legend sits below the checkout lists. The lists show both working contents and staging status; the inspector is a disclosure. Phones replace the graph with a readable history list including both branch markers and parent IDs, and wrap the six numbered controls into two rows. The fixed bar can appear mid-image in full-page phone screenshots; the recordings show actual scrolling.

All six states fit horizontally at 1672×920, 1440×900, 1280×720, 1200×560, 390×844, and 320×700 in Chromium. The two largest desktops fit the walkthrough in the viewport; short desktops show the compact history and scroll instead of shrinking the graph. Verified the compact fallback at 1440×761. Real Chromium 200% browser zoom at 1440×900 reflowed to 720 CSS px, preserved 16 CSS px story text, and had no horizontal overflow. Playwright Firefox and WebKit passed a phone history and inspection smoke check. Native Safari WebDriver could not start because “Allow remote automation” is disabled. Native Safari and screen-reader acceptance checks remain open.

`pnpm verify` passed palette, lint, format, type and build checks, the production artifact check, 14 Vitest tests, and 26 Playwright tests each against development and production preview.

**Standards review:** Preserved Safari list semantics, kept the revised A commit-label proportions, moved checkout layout utilities to the template, and documented the deviations. Separated branch choreography from the shared cancellation watcher and switched animation targets to stable checkout-zone keys.

**Spec review:** Fixed cramped graph labels with the compact history fallback, tested fresh loads of every deep link, and added a Back-during-Next interruption check. The visual gate still needs human approval.
