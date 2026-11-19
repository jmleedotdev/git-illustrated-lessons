# 10: Record commits and read their history

**What to build:** Complete Record a commit and Read the history lessons. Readers see the first commit record the staged selection while retaining the newer unstaged edit, then see Alice stage and commit that remaining edit and inspect the two-commit history.

**Parent:** [Git visual learning website — implementation spec](../spec.md)

**Blocked by:** [09 — Edit, inspect, and stage selected contents](09-edit-inspect-and-stage-selected-contents.md).

**Status:** ready-for-agent

Reuse the working/staged presentation from 09 and introduce the approved shared history treatment. Both lessons must open independently from their predefined states, not from mutable playback history.

- [ ] Record a commit starts with earlier notes.txt contents staged and newer working contents unstaged. The root commit c1 records only the staged contents, has no parent, and leaves the newer edit unstaged.
- [ ] After committing, the staging area matches c1; it does not become empty. The working directory still contains the newer edit, clearly distinguished from staged and recorded contents.
- [ ] Read the history starts after c1 with the remaining unstaged edit. Alice stages and commits that edit as c2, whose sole parent is c1, and inspects git log. End clean, with working directory and staging area matching c2.
- [ ] Use comic SVG spheres: bold dark outlines, flat two-tone cel shading, small drawn highlights, and solid offset ground shadows. No realistic gradients, soft lighting, paper/document commit glyphs, or 3D stack.
- [ ] Keep commit IDs upright within spheres and recorded filenames/content-version labels beneath them, explaining that each sphere represents a repository snapshot. Omit “1 recorded file”; illustrative content labels must not replace sentence-based explanations.
- [ ] Show main and HEAD relationships explicitly, mark the current branch with a bold asterisk and Git-orange fill, explain that marker in the history legend, and use peach only as a supplementary checked-out-commit cue. Parent arrows point toward older commits and meet sphere silhouettes.
- [ ] Keep working-directory contents, staging, and recorded-snapshot inspection distinct. Inspecting c1 or c2 changes only the inspected snapshot, not HEAD, the branch, the URL step, or the authored walkthrough.
- [ ] Use explanatory commit-creation motion with correct independent Replay, cancellation, direct-entry final states, and live reduced-motion behavior. Preserve the approved guide hierarchy and all shared navigation/accessibility contracts.
- [ ] Vitest checks c1/c2 snapshots, parent relationships, retained unstaged contents, staging after commit, clean completion, and independent starting states. Playwright reaches all new steps and verifies recorded-snapshot inspection without checkout changes.
- [ ] Verify readable desktop and phone states, short-height scrolling/reflow, equivalent textual relationships, named scenes, visible keyboard focus, target/text minima, and unobscured phone content. Type checking, build, and existing tests remain green; record results.
- [ ] Present desktop and phone screenshots plus normal-motion recordings for the staging/commit checkpoint: page composition, command/editor-action hierarchy, working versus staged contents, root commit, and staging after commit. Record the human verdict and any requested corrections.
- [ ] Obtain human approval of the staging/commit checkpoint before treating this ticket's visual acceptance as complete. Automated tests and prototype screenshots are not substitutes.
