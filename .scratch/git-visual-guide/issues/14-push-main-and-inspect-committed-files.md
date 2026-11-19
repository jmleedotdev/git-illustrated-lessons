# 14: Push main and inspect committed files

**What to build:** The complete Push the work lesson. Readers see main's reachable committed history published to GitHub, understand the upstream association, and inspect the named files from the hosted c5 snapshot without mistaking it for Alice's live working directory.

**Parent:** [Git visual learning website — implementation spec](../spec.md)

**Blocked by:** [13 — Create and connect an empty GitHub repository](13-create-and-connect-empty-github-repository.md).

**Status:** ready-for-agent

Extend the separate repository presentation and independently authored post-merge states from 13. Preserve the parent spec's visual, motion, responsive, accessibility, and safety contracts.

- [ ] Begin independently with clean local main at c5, ideas at c3, HEAD on main, origin configured, no upstream, and an empty hosted repository. Use the exact c1–c5 snapshots and ordered parent relationships from the parent spec.
- [ ] Illustrate git push -u origin main publishing the needed history reachable from main: c1–c5, including merged ideas commits. Hosted main ends at c5, while local main and ideas remain in place.
- [ ] Do not separately publish an ideas branch name or uncommitted working-directory/staged contents. Teach the exclusion without inventing a dirty remote-lesson starting state.
- [ ] Explain that -u establishes local main's upstream as origin/main, the default destination for later pushes, not automatic synchronization.
- [ ] The final guide explicitly names notes.txt and ideas.txt as files recorded in c5 and distinguishes the latest committed snapshot from Alice's live working directory. Explain that later edits or staging alone cannot update GitHub.
- [ ] Preserve plain command text with no special -u highlight. Use ordinary inline-code styling for -u and filenames in prose, with no custom amber/underline treatment.
- [ ] Retain approved separate dotted/grid panels, comic spheres, repository headings, local HEAD/branch identifiers, and origin/push connection labels. Explain through the scene note and guide, not added panel captions, legends, status strips, bottom explanations, or the unselected hosted file-list design.
- [ ] Use an explicit push relationship and explanatory history-transfer motion while retaining local history. Origin-only states must still show no transfer. Replay works independently, leaves location unchanged, and never auto-advances; interruption and live reduced motion settle safely.
- [ ] The final lesson has disabled Next at its last step and no Next lesson leading to an invented eleventh lesson. Every step remains directly reachable and refresh/history-safe.
- [ ] Vitest validates included reachable history, hosted main, retained local references, excluded ideas branch name/uncommitted contents, and upstream. Playwright reaches every new step and verifies independent entry, final navigation boundaries, Replay, interruption, keyboard behavior, and reduced motion.
- [ ] Verify readable desktop/phone layouts, equivalent textual repository relationships, named scenes, step announcements, focus behavior, target/text minima, and fixed-bar clearance without horizontal overflow. Build/type checks and regression tests remain green; record actual outcomes.
- [ ] Present desktop and phone screenshots plus normal-motion recordings for the remote/push checkpoint, covering empty GitHub, origin without transfer, push, local reference retention, upstream, ordinary command styling, and final committed-file inspection.
- [ ] Record the human verdict, address requested corrections, and obtain remote/push approval before treating this ticket's visual acceptance as complete. No real push, account access, or network mutation occurs.
