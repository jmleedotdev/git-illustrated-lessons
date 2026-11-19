# Choose the visual language for history, branches, HEAD, and merging

Labels: wayfinder:prototype
Type: prototype
Status: resolved
Assignee: jmlee
Parent: [A Designed to Scale-style Git learning website](../map.md)
Blocked by: 02, 03

Prerequisites: [Choose the visual treatment for a representative Git lesson](02-representative-lesson.md) and [Choose ten short Git explanations and their scenario behavior](03-five-lessons.md).

## Question

How should the approved scene-left/story-right design depict commit snapshots and parent links, branch labels, HEAD, changing checked-out contents, and a two-parent merge without implying that branches are independent copies of the repository? Compare a disposable visual treatment against the approved local-history scenario and obtain live human feedback.

## Context

- Preserve the approved Git palette, isometric scene language, typography, hidden lesson navigation, and distinction between real command blocks and editor actions.
- Show the two-commit history, ideas diverging from main, switching branches with a clean working directory, and the non-conflicting merge of ideas.txt and notes.txt changes.
- Include the root-commit state: no invented baseline commit before Alice's first commit.
- Labels and parent relationships must remain legible without depending solely on color; responsive policy is decided separately.
- Prototype representative states, not all ten lessons or a general Git simulator. Production implementation is out of scope.
- Consult prototype, domain-modeling, and codebase-design. Keep artifacts disposable and link them here. Resolve only after live human feedback.

## Comments

### Disposable comparison ready; human verdict pending

Claimed by jmlee. Built three treatments inside the existing prototype’s approved scene-left/story-right host layout. No production implementation or architecture decision is implied.

- Asset: [History comparison, run instructions, and limits](../prototype/README.md#history--branch--merge-comparison-approved).
- Preview: http://127.0.0.1:5187/?study=history&variant=A . Switch A/B/C with the bottom bar or Left/Right, retaining the selected step.
- A: isometric-backed snapshot cards. B: compact pointer graph with a snapshot inspector. C: explicit history ledger with parent IDs.
- Eight fixed representative states cover first/root commit, second commit, branch creation, switch to ideas, commit on ideas, clean switch to main, divergent main commit, and two-parent merge. These span the approved lessons rather than replacing their grouping.
- HEAD → branch → commit is explicit; graph arrows point to parents. Branches are labels on shared history, not copied repositories. Working directory, staging area, and inspected recorded snapshot are separate. c5 has parents c4 (first) and c3 (second); ideas remains at c3 after main advances to c5.
- Small screens show equivalent textual history rather than shrinking graph labels. Story text is 16px, controls have 44px minimum targets, and phone Back/Next is fixed with safe-area padding. Reduced motion shows final states immediately and disables Replay with an explanation; normal Replay is only a fade, not a final motion proposal.
- Vue/TypeScript build passed. Browser smoke checks covered all eight states in A/B/C at 1440×900, 1280×720, and 390×844: no horizontal overflow; desktop page fits; short-desktop guide may scroll; phone document scrolls. Checked commit counts, two merge parents, retained step while switching variants, live reduced-motion behavior, and unchanged original study. No browser page errors. This is not an exhaustive accessibility or visual-acceptance certification.
- Artifact remains local: no Git repository/remote, so no branch, commit, push, or PR was created. No new domain terms or decisions were resolved. Map Decisions so far is unchanged; this ticket remains claimed until live feedback.

### Human-selected A; notepad and branch-marker revision

The human agreed with A and the Git distinctions, requesting three visual refinements: a notepad-style commit glyph matching the text-file story, removal of “1 recorded file,” and a bold asterisk for the current branch. They also requested parent labels closer to their arrows and rotated to follow them.

Revised A now uses ruled, bound notepad snapshot glyphs with commit IDs and recorded filenames; no redundant file-count line. The notepad represents the entire commit snapshot, including both files where applicable, not a single-file commit model. Current-branch labels display bold `* main` or `* ideas` with Git-orange fill; inactive labels are neutral. A legend explains the asterisk, and textual/mobile histories preserve it. Merge parent labels use the actual arrow endpoints for positioning and rotation, just above the line.

Build/type-check passes. Browser checks verified exactly one correctly starred SVG branch through all eight states, removal of the old count label, parent-label orientation, no page errors, and no horizontal overflow at 1280×720 and 390×844. Desktop merge/switch screenshots were captured for inspection. The ticket remains claimed while the human reviews the revised appearance; no Answer or map resolution has been recorded.

### Human requested simpler document icon and a less packed scene

The human found the bound/ruled notepad too fancy and supplied a plain folded-corner document icon as the reference. They requested pulling the scene’s perspective back slightly.

Revised A replaces the notepad with a plain portrait document outline and a folded corner: commit ID inside, filenames below; no binding, ruled lines, or stacked-paper detail. The scene uses a wider view with additional surrounding space and greater separation between the upper ideas history and the lower main history. Edge endpoints follow the narrower document silhouette; rotated parent labels and starred active branches are retained. Only scene framing changes; the guide and controls are not scaled down. Essential SVG label font sizes are increased to compensate for the wider framing.

Build/type-check and browser checks pass: all eight authored states retain one active SVG branch, the merge has five document glyphs, no horizontal overflow at 1440×900, 1280×720, or 390×844, and no page errors. Desktop layouts retain viewport fit; phone document scrolling is unchanged. Still awaiting human review; this visual iteration does not resolve the ticket.

### Isometric treatment of the simple document

The human likes the folded-corner document and asked whether it can feel more isometric. Revised A projects the same simple sheet onto an isometric vertical plane, with a thin edge and lightly shaded corner fold. The commit ID follows the sheet’s perspective; filenames, branch labels, and parent labels retain their readable orientation. No notebook ornament or page stack was reintroduced. Label clearance and scene framing accommodate the angled sheet while preserving the more open composition.

Build/type-check passes. Browser checks cover all eight states retaining exactly one active SVG branch; the merge displays five isometric document glyphs. No page errors or horizontal overflow at 1440×900, 1280×720, and 390×844; desktop viewport fit and phone document scrolling remain. Awaiting live visual feedback; ticket remains claimed, map unchanged.

### Isometric documents rejected; sphere comparison requested

The human rejected the isometric document appearance and requested spherical commit nodes instead. Revised A removes the paper glyphs entirely. Each commit is now a simple SVG sphere (radial shading and a faint ground shadow), with a centered, upright ID and recorded filenames below. The checked-out commit has a peach fill; the active branch still has its distinct bold asterisk/orange label. Parent arrows terminate around the circular silhouettes, with parent labels following their arrow segments. Open framing and existing story/controls are retained. This is SVG shading, not a 3D implementation or scope change.

Build/type-check passes. Browser checks verified the correct starred branch through all eight states, five spheres in the merged state, no page errors, and no horizontal overflow at 1440×900, 1280×720, and 390×844. Desktop viewport fit and phone scrolling remain. Sphere appearance awaits live human feedback; this ticket remains claimed and the map is not resolved.

### Comic sphere refinement

The human found the gradient sphere treatment too realistic and requested a comic style. Revised A retains spherical commit nodes but replaces gradient lighting with flat two-tone cel shading, bold dark outlines, a small drawn highlight, and solid offset shadows. Commit IDs, filenames, current-branch asterisks, parent links, and open framing are unchanged. No radial gradients remain in the history scene.

Build/type-check passes. Browser checks cover all eight states retaining one active branch, five spheres and zero radial gradients in the merged state, no page errors, and no horizontal overflow at 1440×900, 1280×720, and 390×844. The comic appearance awaits human feedback; the ticket stays claimed and map resolution is unchanged.

## Answer

The human approved the final revised A, **Comic snapshot spheres**, with “ok i'm satisfy with this.” This resolution supersedes the earlier platform, notepad, document, isometric-document, and gradient-sphere proposals in Comments. B/C remain comparison evidence, not selected designs.

### Approved visual language

- Preserve the approved scene-left/story-right host layout, Git palette, hidden Lessons navigation, and command-versus-editor-action distinction.
- Represent each commit as a comic-style sphere drawn in SVG: bold dark outline, flat two-tone cel shading, a small drawn highlight, and a solid offset ground shadow. No realistic gradients, soft lighting, paper glyphs, or 3D stack.
- Put the illustrative commit ID upright in the sphere and its recorded filenames/content-version labels underneath. A sphere represents a repository snapshot, not a single file or a saved diff. Omit the redundant “1 recorded file” line.
- Keep the more open scene framing and separation between branch paths. Pull back the diagram, not the story or controls; preserve label readability and avoid the earlier packed composition.
- Show branch names as labels pointing into one shared history. Mark the current branch with a bold **`* main`** or **`* ideas`** and Git-orange fill; inactive labels use a neutral fill. Explain the asterisk in the legend, retain the explicit **HEAD → branch → commit** readout, and carry the marker into equivalent textual views. Color is not the only current-branch cue.
- The currently checked-out commit uses peach coloring; this supplements, rather than replaces, the explicit HEAD/current-branch indicators.
- Parent arrows point toward older parent commits and meet the circular silhouettes. For the merge, keep **parent 1** and **parent 2** close to their respective arrow segments and rotated with the arrows so the relationship remains clear.
- Keep the working directory, staging area, and recorded-snapshot inspector distinct. Inspecting a snapshot does not switch branches or mutate the walkthrough.

### Git states explained

The prototype preserves the approved root commit with no invented baseline; a second commit linked to the first; two branch labels initially pointing at the same commit; HEAD moving when Alice switches; only the current branch advancing on commit; and a clean switch back to main changing checked-out files without deleting recorded history. The divergent histories merge into c5 with c4 as first parent and c3 as second parent. main advances to c5, ideas remains at c3, and HEAD remains on main. These are shared histories, not separate repository copies.

The eight prototype states are representative selections across the approved lessons, not a replacement lesson sequence. The canonical story/playback contract remains in [Choose ten short Git explanations and their scenario behavior](03-five-lessons.md).

### Evidence and handoff

- Asset: [Disposable history comparison and run instructions](../prototype/README.md#history--branch--merge-comparison-approved), `?study=history&variant=A`.
- Latest build/type-check passes. Browser smoke checks covered all eight states, one active branch, five spheres and zero gradients in the merged state, no page errors, and no horizontal overflow at 1440×900, 1280×720, and 390×844. Desktop viewport fit and phone scrolling were retained.
- Human approval settles the visual language, not exhaustive accessibility, cross-browser certification, or final animation choreography. The prototype uses a simple fade-in. [Choose fidelity exceptions for responsive layout and reduced motion](05-fidelity-exceptions.md) remains the canonical accessibility/responsive policy; [Set the Vue implementation boundaries and visual acceptance criteria](04-implementation-contract.md) will incorporate observable acceptance checks.
- Prototype remains disposable and local; no Git repository/remote exists, so no branch, commit, push, or PR was created. No production implementation was authorized.
- No new decision questions or fog emerged. [Choose the visual explanation of remote setup and first push](07-remote-visuals.md) remains the next frontier; implementation boundaries remain blocked on that decision.
