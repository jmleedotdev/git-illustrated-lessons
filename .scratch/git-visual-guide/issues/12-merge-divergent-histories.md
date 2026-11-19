# 12: Merge divergent histories

**What to build:** The complete Bring work together lesson. Readers see Alice commit a non-conflicting notes.txt change on main, then merge ideas into a two-parent commit without erasing either history.

**Parent:** [Git visual learning website — implementation spec](../spec.md)

**Blocked by:** [11 — Create and switch branches](11-create-and-switch-branches.md).

**Status:** ready-for-agent

Extend the branch/history presentation from 11. Do not add conflict resolution, branch deletion, or a simulation engine.

- [ ] Independently begin clean on main at c2, with ideas at c3. c3 has parent c2 and records c2's notes.txt plus ideas.txt; HEAD is on main.
- [ ] Alice changes notes.txt in her editor, stages it, and commits as c4 with parent c2. main advances to c4 while ideas stays at c3, creating divergent, non-conflicting histories.
- [ ] Merging ideas into main creates c5 with ordered parents c4 first and c3 second. The snapshot combines revised notes.txt from c4 and ideas.txt from c3.
- [ ] End clean with working directory and staging matching c5, main at c5, ideas still at c3, and HEAD still on main. Neither branch history is deleted or represented as a separate repository.
- [ ] Preserve open framing and separation between branch paths, approved comic spheres and snapshot labels, explicit HEAD/current-branch cues, and arrows meeting circular silhouettes and pointing toward parents.
- [ ] Keep parent 1 and parent 2 labels close to their actual merge-arrow segments and rotated with those segments. Both parents and ancestry paths must remain understandable in equivalent narrow-screen text.
- [ ] Explanatory motion shows the new commit and reference changes rather than only fading the scene. Replay works independently after direct entry; interruption and live reduced-motion changes settle correctly without stale updates or auto-advance.
- [ ] Vitest verifies all snapshots, ordered parents, branch/HEAD positions, clean final state, and independent entry. Playwright reaches every new step and verifies navigation, Replay, interruption, keyboard behavior, reduced motion, and no horizontal overflow.
- [ ] Preserve distinct working/staged/inspected snapshots, readable story/labels, target/text minima, phone safe-area clearance, accessible state/change explanations, and short-height scrolling or reflow. Type checking, build, and regression tests pass; record actual results.
- [ ] Present desktop and phone screenshots plus normal-motion recordings for the history/merge checkpoint, including shared ancestry, branch/HEAD markers, checkout changes, inspection independence, open framing, arrows, and both ordered merge parents.
- [ ] Record the human verdict, address requested corrections, and obtain history/merge approval before treating this ticket's visual acceptance as complete. Prototype motion and automated tests do not establish that approval.
