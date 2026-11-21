# 10: Record commits and read their history

**What to build:** Complete Record a commit and Read the history lessons. Readers see the first commit record the staged selection while retaining the newer unstaged edit, then see Alice stage and commit that remaining edit and inspect the two-commit history.

**Parent:** [Git visual learning website — implementation spec](../spec.md)

**Blocked by:** [09 — Edit, inspect, and stage selected contents](09-edit-inspect-and-stage-selected-contents.md).

**Status:** resolved

Reuse the working/staged presentation from 09 and introduce the approved shared history treatment. Both lessons must open independently from their predefined states, not from mutable playback history.

- [x] Record a commit starts with earlier notes.txt contents staged and newer working contents unstaged. The root commit c1 records only the staged contents, has no parent, and leaves the newer edit unstaged.
- [x] After committing, the staging area matches c1; it does not become empty. The working directory still contains the newer edit, clearly distinguished from staged and recorded contents.
- [x] Read the history starts after c1 with the remaining unstaged edit. Alice stages and commits that edit as c2, whose sole parent is c1, and inspects git log. End clean, with working directory and staging area matching c2.
- [x] Use comic SVG spheres: bold dark outlines, flat two-tone cel shading, small drawn highlights, and solid offset ground shadows. No realistic gradients, soft lighting, paper/document commit glyphs, or 3D stack.
- [x] Keep commit IDs upright within spheres and recorded filenames/content-version labels beneath them, explaining that each sphere represents a repository snapshot. Omit “1 recorded file”; illustrative content labels must not replace sentence-based explanations.
- [x] Show main and HEAD relationships explicitly, mark the current branch with a bold asterisk and Git-orange fill, explain that marker in the history legend, and use peach only as a supplementary checked-out-commit cue. Parent arrows point toward older commits and meet sphere silhouettes.
- [x] Keep working-directory contents, staging, and recorded-snapshot inspection distinct. Inspecting c1 or c2 changes only the inspected snapshot, not HEAD, the branch, the URL step, or the authored walkthrough.
- [x] Use explanatory commit-creation motion with correct independent Replay, cancellation, direct-entry final states, and live reduced-motion behavior. Preserve the approved guide hierarchy and all shared navigation/accessibility contracts.
- [x] Vitest checks c1/c2 snapshots, parent relationships, retained unstaged contents, staging after commit, clean completion, and independent starting states. Playwright reaches all new steps and verifies recorded-snapshot inspection without checkout changes.
- [x] Verify readable desktop and phone states, short-height scrolling/reflow, equivalent textual relationships, named scenes, visible keyboard focus, target/text minima, and unobscured phone content. Type checking, build, and existing tests remain green; record results.
- [x] Present desktop and phone screenshots plus normal-motion recordings for the staging/commit checkpoint: page composition, command/editor-action hierarchy, working versus staged contents, root commit, and staging after commit. Record the human verdict and any requested corrections.
- [x] Obtain human approval of the staging/commit checkpoint before treating this ticket's visual acceptance as complete. Automated tests and prototype screenshots are not substitutes.

## Comments

Implementation is complete. **Human visual verdict: approved** in the [integrated review](15-verify-and-accept-ten-lesson-experience.md#revised-a-and-checkpoint-verdicts). No corrections were requested.

| Production check | Desktop (1440×900) | Phone (390×844) |
| --- | --- | --- |
| Before the commit: editor action, staged B, unstaged C | [Screenshot](../screenshots/10/desktop-review.png) | [Screenshot](../screenshots/10/phone-review.png) |
| After the commit: real command, root c1, staging still matches c1 | [Screenshot](../screenshots/10/desktop-root.png) | [Screenshot](../screenshots/10/phone-root.png) |
| Read the history: c2 points back to c1; clean checkout | [Screenshot](../screenshots/10/desktop-log.png) | [Screenshot](../screenshots/10/phone-log.png) |
| Normal motion: stage, commit, and inspect | [WebM recording](../screenshots/10/desktop-normal-motion.webm) | [WebM recording](../screenshots/10/phone-normal-motion.webm) |

Compared production and both matching revised-A studies (staging and history) in Chromium at these same viewports and 100% zoom. The desktop retains the scene-left/guide-right layout and uses the production staging `0 0 960 500` viewBox instead of the history study's `-50 -65 1060 475` to keep working and staged pages beside the history. The outline, clip, shade, highlight, and shadow use the approved sphere geometry. The branch label points at the tip and the parent arrow meets both sphere silhouettes. Phone and compact desktop layouts use readable equivalent labels; the phone keeps the small diagram so readers can see the copy move. The snapshot inspector is a disclosure so it doesn't compete with the scene. The Key idea fits at 1440×900; short desktops can scroll or reflow. The fixed bar appears mid-image in full-page phone captures; the recordings show actual scrolling and bar behavior.

Validation: `pnpm verify` passed (palette, lint, format, types, 12 Vitest tests, build, production boundary, and 19 Playwright tests each on dev and preview). Chromium checks at 320×700 and 1200×560 covered no horizontal overflow, reachable timeline, and unclipped keyboard focus under the fixed phone navigation. Checked 16px story text, 44px targets, keyboard selection, hover/pressed feedback, and named scenes and inspector contents in Chromium's accessibility tree; no separate screen-reader session. Replay was checked from direct entry, through interruption, and during live reduced-motion changes.

Independent Standards review flagged selected-button hover feedback, spacing tokens, desktop guide fit, and duplicated opening fixtures. Addressed all four. Independent Spec review flagged desktop label readability and the missing explicit unstaged caption before c1. Enlarged the desktop labels, activated equivalent text sooner on compact viewports, and made the unstaged edit explicit in the scene and narration.
