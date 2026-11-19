# 11: Create and switch branches

**What to build:** The complete Create and switch branches lesson. Readers see Alice create ideas without switching, switch to it, record ideas.txt, and return cleanly to main while both branches retain their shared history.

**Parent:** [Git visual learning website — implementation spec](../spec.md)

**Blocked by:** [10 — Record commits and read their history](10-record-commits-and-read-history.md).

**Status:** ready-for-agent

Extend the history presentation from 10, preserving the parent's approved visual, playback, accessibility, and responsive contracts.

- [ ] Start independently with a clean checkout on main at c2 and c1 as c2's parent. Creating ideas puts both names at c2 without copying commits or files and leaves HEAD on main.
- [ ] Switching to ideas moves HEAD to that branch. Because both names still point to c2, checked-out contents initially remain unchanged.
- [ ] Alice creates ideas.txt in her editor, stages it, and commits as c3. Its sole parent is c2; its snapshot includes notes.txt unchanged from c2 plus ideas.txt. Only ideas advances to c3; main stays at c2.
- [ ] Switching cleanly back to main restores c2's working-directory and staged contents. ideas.txt is absent from that checkout but remains recorded in c3; no history is deleted.
- [ ] Preserve comic spheres, open shared-history framing, readable recorded-file labels, bold starred current-branch labels, neutral inactive labels, peach checkout coloring, parent arrows, and an explicit HEAD → branch → commit readout. Explain branch labels as references, not repository copies.
- [ ] Recorded-snapshot inspection remains separate from checkout and does not move HEAD or branches. Carry current-branch markers and equivalent history relationships into readable narrow-screen views.
- [ ] Use authored marker/checkout transitions to explain changes, with independently replayable before-to-after states, immediate direct/back/history selection, safe navigation interruption, live reduced motion, and no auto-advance.
- [ ] Vitest verifies branch creation without switching, only-current-branch advancement, c3's snapshot/parent, clean checkout restoration, and immutable starting states. Playwright reaches every step and verifies visible/textual relationships and inspection without branch switching.
- [ ] Preserve command/editor-action hierarchy, named scenes and state/change explanations, keyboard/focus behavior, step announcements, 16px story text, 44×44px targets, and phone safe-area/content clearance. Verify desktop/phone layouts without horizontal overflow, with build/type checks and regression tests passing.
