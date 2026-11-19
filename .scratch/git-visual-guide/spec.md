# Git visual learning website — implementation spec

Status: ready-for-agent

Parent: [A Designed to Scale-style Git learning website](map.md)

## Problem Statement

People who edit code but lack a Git mental model struggle to connect commands with what happens to their files, staged contents, commits, branches, and remote history. Command lists alone do not explain why an edit is not recorded automatically, why a commit can omit a newer edit, how branches share history, or why configuring a remote does not publish anything.

The reader needs a visually coherent, explanation-led introduction that makes those distinctions concrete without requiring a terminal, a live repository, or an exercise platform. Presentation is the primary goal: the experience should capture the illustrated technical-notebook character of Designed to Scale while using original Git explanations and graphics.

## Solution

Build a light-themed learning website with **Vue, TypeScript, SVG, Vite, and Tailwind CSS**. Ten short, reader-stepped lessons follow Alice from initializing a local repository through a first push to an empty GitHub repository. Bob observes, suggests changes, and asks questions; he is not a second repository user.

On desktop, a large illustrated scene sits on the left and the story-led guide on the right. A hidden lesson list, selectable numbered steps, Back/Next, and Replay let readers navigate at their own pace. Every lesson and step can be opened independently through a stable URL. Phones retain the same lesson meaning in a readable scene-first layout, and reduced-motion readers receive completed states with equivalent explanations.

This document contains the implementation requirements and acceptance gates. The linked decision records and disposable prototypes supply provenance and visual comparison evidence, not additional behavior that must be reconstructed before building.

## User Stories

1. As a reader who edits code, I want a visual explanation of Git state, so that commands make sense beyond memorized syntax.
2. As a reader, I want ten short lessons from local setup through a first push, so that I can follow a bounded introduction rather than a full Git course.
3. As a reader, I want one continuous Alice-and-Bob story, so that each new concept builds on a familiar example.
4. As a reader, I want Alice's actions distinguished from Bob's questions, so that I do not mistake the story for a collaboration workflow.
5. As a reader, I want diagrams and prose to describe the same step, so that I can connect a command with its result.
6. As a reader, I want real commands separated from editor actions, so that I know what belongs in a terminal.
7. As a reader, I want commands and filenames clearly styled in prose, so that I can identify them without confusing them with standalone commands.
8. As a reader, I want file changes explained in sentences, so that unexplained version labels do not carry the lesson alone.
9. As a reader, I want a concise Key idea callout, so that I can retain the main distinction in each step.
10. As a reader, I want to understand the prerequisites, so that installation and authentication are not hidden steps in the story.
11. As a reader, I want initialization to begin with an untracked file and no commits, so that I understand what creating a repository does and does not do.
12. As a reader, I want the initial branch named main, so that the branch used throughout the story is consistent.
13. As a reader, I want to edit a file and inspect its status before staging, so that I understand that edits are not recorded automatically.
14. As a reader, I want to see staging preserve a selected version while the working file remains present, so that I do not mistake staging for moving a file.
15. As a reader, I want to see another edit after staging, so that I understand why working and staged contents can differ.
16. As a reader, I want the first commit to record staged contents rather than every current edit, so that I understand the source of a commit's snapshot.
17. As a reader, I want the first commit to have no parent, so that I am not taught an invented baseline history.
18. As a reader, I want the newer unstaged edit to remain after committing, so that I understand why committing does not necessarily leave a clean working directory.
19. As a reader, I want the staging area to match the new commit afterward, so that I do not believe it becomes an empty queue.
20. As a reader, I want to stage and commit the remaining edit, so that I can connect a clean checkout with the recorded snapshot.
21. As a reader, I want to follow the second commit's parent back to the first, so that I understand history as linked snapshots rather than saved diffs.
22. As a reader, I want a new branch to share an existing commit with main, so that I understand a branch as a movable reference rather than a copied folder.
23. As a reader, I want branch creation separated from switching, so that I understand that creating a name does not move HEAD.
24. As a reader, I want an explicit HEAD-to-branch-to-commit relationship, so that I know which branch and snapshot are current.
25. As a reader, I want a commit on ideas to advance only ideas, so that I understand branch movement.
26. As a reader, I want switching back to main to restore its files without deleting ideas history, so that checkout changes are not mistaken for data loss.
27. As a reader, I want to inspect recorded snapshots without switching branches, so that I can examine history without changing the walkthrough.
28. As a reader, I want non-conflicting changes on divergent branches, so that a merge can be explained without introducing conflict resolution.
29. As a reader, I want a merge commit with two clearly identified parents, so that I understand how histories are joined.
30. As a reader, I want main to advance after merging while ideas stays in place, so that I can distinguish the merge result from its source branch.
31. As a reader, I want the local and hosted repositories shown as separate places, so that I do not mistake GitHub for my working directory.
32. As a reader, I want an empty GitHub repository with no starter files, so that the first push does not require unexplained remote history reconciliation.
33. As a reader, I want an illustrative remote address rather than a credential workflow, so that I can focus on the connection concept.
34. As a reader, I want origin explained as a local name for an address, so that I do not mistake it for a special GitHub service.
35. As a reader, I want GitHub to stay empty after origin is configured, so that I understand that adding a remote sends no history.
36. As a reader, I want the first push to publish main's reachable committed history, so that I understand what Git sends.
37. As a reader, I want merged ideas commits included without publishing the ideas branch name, so that I can distinguish commits from branch references.
38. As a reader, I want uncommitted working and staged contents excluded from push, so that I do not assume all local file contents are uploaded.
39. As a reader, I want a brief explanation of upstream after the first push, so that I understand the default destination for later pushes without assuming automatic synchronization.
40. As a reader, I want the final guide to identify notes.txt and ideas.txt on GitHub, so that I can connect the hosted files with the latest committed snapshot.
41. As a reader, I want to open any lesson independently, so that I am not required to play earlier lessons first.
42. As a reader, I want a lesson opened from Lessons to start at its first step, so that its explanation has a predictable beginning.
43. As a reader, I want direct links to individual steps, so that I can revisit or share a specific explanation.
44. As a reader, I want refresh and browser Back/Forward to preserve or restore my location, so that navigation behaves like a normal website.
45. As a reader, I want invalid lesson locations to recover to a valid starting state, so that I never encounter an undefined scene.
46. As a reader, I want Back/Next to stay within the lesson, so that step navigation does not unexpectedly change topics.
47. As a reader, I want a separate Next lesson action at a lesson's end, so that moving to a new topic is deliberate.
48. As a reader, I want numbered step selection, so that I can jump to a state without playing every transition.
49. As a reader, I want Replay to repeat the current step's change without changing my location, so that I can study the transition again.
50. As a reader arriving through a direct link, I want Replay to work independently, so that it does not require a previous playback session.
51. As a reader, I want navigation to interrupt animation safely, so that rapid actions do not leave the wrong scene on screen.
52. As a reader, I want steps to advance only when I choose, so that animation never forces the reading pace.
53. As a desktop reader, I want a large scene beside the guide and no permanent sidebar, so that the explanation has room to breathe.
54. As a reader, I want Lessons available through a clear header toggle, so that the course remains discoverable without occupying the page permanently.
55. As a reader in a short window, I want scrolling or reflow instead of clipped or shrunken text, so that the lesson remains readable.
56. As a phone reader, I want the scene before the story, so that I can see the state before reading its explanation.
57. As a phone reader, I want fixed Back/Next controls with safe-area spacing, so that I can navigate without losing or covering content.
58. As a phone reader, I want numbered steps and Replay near the scene, so that the fixed bar remains simple.
59. As a reader using browser zoom, I want content to enlarge rather than shrink to compensate, so that zoom improves readability.
60. As a reader of a narrow layout, I want essential relationships preserved in readable diagrams or equivalent text, so that screen width does not remove lesson meaning.
61. As a reader using reduced motion, I want completed states immediately with an explanation of what changed, so that movement is not required to learn.
62. As a reader changing my motion preference during use, I want running motion to stop and settle correctly, so that the preference takes effect immediately.
63. As a reader using reduced motion, I want Replay visibly disabled with a reason, so that its unavailability is understandable.
64. As a keyboard user, I want operable controls and visible focus, so that I can navigate without a pointer.
65. As a keyboard user, I want sensible focus return when Lessons closes and unobscured focus on phones, so that I do not lose my place.
66. As a screen-reader user, I want named scenes, equivalent state/change explanations, and announced step changes, so that SVG interpretation is unnecessary.
67. As a reader who cannot rely on color, I want explicit branch markers and labels, so that important relationships remain distinguishable.
68. As a reader, I want original Git illustrations in a consistent paper-and-ink style, so that presentation supports rather than distracts from understanding.
69. As a reader, I want the site to explain without executing Git or changing an account, so that exploration is safe.
70. As a reviewer, I want representative visual and motion evidence on desktop and phone, so that presentation quality is verified rather than asserted.

## Implementation Decisions

### 1. Product boundary and prerequisites

- This is an explanation-led website, not a terminal, editor, exercise platform, or Git simulator. All commands, files, repositories, and hosted results are illustrative. Do not execute Git commands, access accounts, or perform network mutations.
- Use one continuous Alice-and-Bob story in a small repository. Alice performs edits and Git actions. Bob observes, suggests, and asks questions, including looking at the hosted result; he does not contribute through a second repository.
- Assume installed Git, configured commit identity, a GitHub account, and working HTTPS authentication. State these prerequisites without turning them into setup tutorials.
- Use GitHub as the concrete host and git-notes as the hosted repository name. Illustrate creation and the remote address without reproducing the dashboard or implementing account access.
- Generally author three to five short steps per lesson; do not pad lighter setup lessons. Final short prose, command wording, and detailed step scripts are implementation work within this contract, not a new course-planning exercise.

### 2. Required stack and styling

- Use Vue, TypeScript, SVG, Vite, and Tailwind CSS. Do not substitute React, Next.js, Three.js, or React Three Fiber.
- Integrate the tailwindcss and @tailwindcss/vite packages through the Tailwind Vite plugin alongside the Vue Vite plugin. Import Tailwind in the application's main stylesheet and compile it at build time; do not use a browser CDN.
- Use Tailwind utilities for layout, spacing, typography, responsive behavior, and interaction states. Define shared semantic theme tokens for the approved palette, monospaced typography, spacing, borders, offset shadows, and visible focus treatment. Tailwind defaults must not replace the approved visual treatment.
- Provide a browser-viewable design-token showcase for development usage only, consuming the same shared tokens and styles as the website. Demonstrate representative typography, surfaces, command/inline-code treatments, Key idea callouts, SVG styling, and control states without building lesson features or a speculative component library.
- Shared tokens and licensed font assets are production foundations. The showcase must not appear in production navigation or ship as production routes, generated pages, JavaScript bundles, or showcase-only assets. Hiding a link is insufficient.
- Focused custom CSS and SVG attributes remain appropriate for isometric geometry and authored motion. Tailwind does not replace scene renderers, player logic, or accessibility behavior.
- Ship the light presentation only. Self-host the chosen monospaced font with an appropriate license and a monospace fallback; do not carry forward the prototype's externally hosted font dependency.

#### Foundation-first implementation sequence

1. Scaffold the production application using the official interactive create-vue command after agreeing on the package manager and destination. The user answers the installation questions; do not silently choose flags or defaults on their behalf. Preserve the required Vue, TypeScript, and Vite stack and provide Vitest/Playwright support. Keep the disposable prototype separate.
2. Establish shared design tokens and the development-only showcase before lesson features. Review the approved visual treatment on desktop and phone, including readability, contrast, keyboard focus, narrow layouts, and zoom. Record explicit human approval; feature implementation remains blocked until that approval is given.
3. Implement Start a repository using the approved tokens, then proceed through the feature tickets' blocking edges. Token approval does not replace the production lesson visual acceptance gates below.

The [foundation breakdown index](../git-visual-guide-foundation/spec.md) links the executable child tickets for this sequence. Installation details and blocking edges belong in those tickets; this document remains the authoritative implementation spec.

### 3. Authored-state architecture and public interfaces

Use three small modules, composed by a reusable page shell:

| Module | Responsibility and boundary |
| --- | --- |
| Lesson content | Typed immutable lesson and step definitions: story, real command or editor action, explicit Git state, defined before-to-after transition, and equivalent textual explanation. Each lesson has its own predefined starting state. |
| Lesson player | Owns location, selected lesson/step, navigation, Replay, reduced-motion handling, and cancellation. Exposes selected content and player actions without interpreting command strings or performing Git operations. |
| Scene presentation | Staging, history, and remote SVG renderers consume authored states and transitions. Owns drawing coordinates and animation details and shares visual elements where useful. |

- The page shell composes the header, hidden lesson list, scene, guide, and controls without embedding scenario-specific Git rules.
- Render explicit authored states rather than computing Git operations. Do not build a generalized engine, speculative adapters, a plugin system, or a renderer for each individual step.
- Reuse immutable story facts and visual elements where useful. Never share mutable Git playback state between lessons. A later lesson must not depend on the reader completing an earlier one.
- Keep presentation geometry out of lesson prose. Private organization and exact internal types are implementation choices; no backend, external API, or database schema is required.

### 4. Git terminology and state invariants

- The working directory contains editable checked-out and untracked files. Staging selected contents does not remove a file from it.
- The staging area is the proposed snapshot for the next commit, not an upload queue. Later working-directory edits do not update it automatically. After committing, it matches the new committed snapshot rather than becoming empty.
- A commit records a repository snapshot formed from staged contents, with metadata and parent relationships; it is not merely a saved diff or a backup of all current edits.
- A branch is a named, movable reference in shared history, not a copied project or separate repository. Only the current branch advances when committing in this scenario.
- HEAD identifies the current checkout through the current branch. Before the first commit, HEAD refers to main, which has no commit yet; do not invent a commit to make the graph nonempty.
- A remote repository is distinct from both the local repository and the working directory. A remote such as origin is a locally configured name for its address, not an automatic synchronization service.
- Push sends needed recorded history and requests reference updates. It does not publish uncommitted working-directory or staged contents.
- Upstream is the configured remote-tracking branch associated with a local branch. Here, origin/main becomes main's default destination for later pushes; it is not automatic synchronization.

### 5. Ten-lesson scenario contract

Every row describes an independently authored lesson with its own starting state. The continuous story does not imply mutable state carried between lessons.

| # | Lesson | Required starting state, actions, and outcome |
| --- | --- | --- |
| 1 | Start a repository | Begin with an existing project folder containing notes.txt. Illustrate initializing Git with main as the initial branch. End with notes.txt untracked, no staged contents, and no commits. Initialization does not automatically stage or record files. There is no hidden baseline commit. |
| 2 | Edit and inspect | Begin in the newly initialized repository with untracked notes.txt and no history. Alice edits notes.txt and inspects git status. The file remains untracked, and edits are not recorded automatically. |
| 3 | Choose what to stage | Begin with the untracked edited notes.txt and no commits. Alice uses git add notes.txt to stage its selected contents, then edits the working file again. Staging starts tracking the file; the selected staged contents remain distinct from the newer working contents, and the working file remains present. |
| 4 | Record a commit | Begin with selected notes.txt contents staged and a newer unstaged working edit. Alice commits the staged version as c1, the root commit with no parent. The newer edit remains unstaged. The staging area matches c1 afterward. |
| 5 | Read the history | Begin after c1 with the newer working edit still unstaged. Alice stages and commits it as c2, whose parent is c1, then inspects git log. End clean: working directory and staging area match c2. |
| 6 | Create and switch branches | Begin clean on main at c2. Create ideas at c2 without switching; both names initially point to the same commit and HEAD stays on main. Switch to ideas, add ideas.txt in the editor, stage and commit it as c3, then switch cleanly back to main at c2. Only ideas advances to c3. The checked-out main snapshot lacks ideas.txt, but c3 still records it. |
| 7 | Bring work together | Begin clean on main at c2, with ideas at c3. Alice changes notes.txt and commits on main as c4, diverging from ideas. Merge ideas into main with non-conflicting changes, producing c5 with c4 as first parent and c3 as second parent. End clean with main at c5, ideas still at c3, and HEAD on main. The result contains revised notes.txt and ideas.txt. |
| 8 | Create a remote repository | Begin with the clean post-merge local state, no configured origin or upstream, and no published history. Illustrate creating an empty GitHub repository named git-notes, leaving README, .gitignore, and license initialization unselected. The hosted repository has no commits, files, or main reference yet. Local history remains unchanged. |
| 9 | Connect local and remote | Begin with the clean post-merge local state and the empty hosted repository. Illustrate git remote add origin with a clearly illustrative GitHub HTTPS address. This stores the address locally but transfers no commits or files, creates no upstream association, and leaves GitHub empty. |
| 10 | Push the work | Begin with clean local main at c5, ideas at c3, origin configured, and GitHub empty. Run the illustrated git push -u origin main. Publish all history reachable from main, including merged ideas commits, and place hosted main at c5. Establish local main's upstream as origin/main. Keep local main and ideas in place; do not separately publish the ideas branch name. Inspect the hosted c5 snapshot and explicitly name notes.txt and ideas.txt in the guide. Distinguish those committed files from Alice's live working directory and explain that uncommitted contents are not pushed. |

Use illustrative IDs c1–c5, not realistic hashes. Preserve this concrete snapshot and parent contract, carried forward from the approved history prototype:

| Commit | Ordered parents | Recorded snapshot |
| --- | --- | --- |
| c1 | None | Selected earlier contents of notes.txt; no ideas.txt. |
| c2 | c1 | Newer notes.txt contents incorporating the remaining edit; no ideas.txt. |
| c3 | c2 | The same notes.txt contents as c2, plus ideas.txt. |
| c4 | c2 | Revised notes.txt contents from main; no ideas.txt. |
| c5 | c4, c3 | Revised notes.txt from c4, plus ideas.txt from c3. |

The prototype calls those successive notes.txt contents B, C, and D. Such diagram labels are illustrative content versions, not commit IDs or unexplained narrative shorthand. Final prose must explain the actual content changes in sentences. After push, GitHub has c1–c5 and main at c5, but no separately published ideas branch. The remote lessons start clean; teach the exclusion of uncommitted contents without inventing a contradictory dirty starting state.

### 6. Approved page composition, palette, and copy treatment

- Preserve final revised A: large isometric SVG scene left, third-person story-led guide right on desktop, no permanent course sidebar, and a text-only Lessons / Close toggle at the far right of the header. The toggle has no icon.
- Keep a compact scene heading: breadcrumb on the left and duration/difficulty/step pills on the far right of the same row, with the lesson title underneath. Do not restore the redundant story-introduction subtitle in the scene. Allow responsive wrapping when necessary.
- Preserve warm paper surfaces, monospaced typography, dark outlines, small offset shadows, Git-orange (#f05032) and charcoal accents, and peach/slate/terracotta diagram zones. Retain the illustrated notebook character rather than adopting a default component-library appearance.
- Keep standalone command blocks for actual commands only. Present editing instructions as ordinary text under “In Alice's editor,” without a “Not a command” disclaimer. Non-command GitHub setup actions are likewise explanatory text, not shell commands.
- Style filenames, commands, and options within prose as inline code, visually distinct from standalone command blocks. Render inline references as text rather than injected HTML. Explain content changes in sentences, not unexplained version-arrow shorthand.
- Preserve the Key idea callout with an outlined light-bulb icon, the Replay label, Back/Next, and selectable numbered steps. Remove all prototype comparison switches, debug displays, state inspectors intended only for debugging, and comparison-key hints.
- Aim for a compact viewport-height desktop scene and visible timeline without page scrolling where practical. Readability, text/target minima, and zoom behavior override literal reproduction of the prototype's compact sizes. A supplementary mental-model card may be omitted at short heights only when its concepts remain in the step explanations; essential explanations may not disappear.

### 7. Approved history, branch, HEAD, and merge treatment

- Draw commits as comic-style SVG spheres with bold dark outlines, flat two-tone cel shading, a small drawn highlight, and solid offset ground shadows. Do not use realistic gradients, soft lighting, document/paper glyphs, or a 3D stack.
- Put each illustrative commit ID upright inside its sphere and recorded filenames/content-version labels underneath. A sphere represents a repository snapshot, not one file. Omit the redundant “1 recorded file” line.
- Preserve open framing and space between branch paths instead of the earlier packed graph. Pull back the diagram without shrinking story text, controls, or essential labels below readability.
- Show branch names pointing into one shared history. Mark the current branch explicitly as * main or * ideas with a bold asterisk and Git-orange fill. Inactive labels use a neutral fill. Explain the asterisk in the history legend and carry it into equivalent textual views; color alone is insufficient.
- Retain the explicit HEAD → branch → commit readout. Peach coloring identifies the checked-out commit only as a supplement to those textual indicators.
- Parent arrows point toward older parents and meet the circular silhouettes. Place parent 1 and parent 2 close to their actual merge-arrow segments and rotate the labels with those segments. Preserve c5's ordered parents and both ancestry paths.
- Keep working-directory contents, staged contents, and a recorded-snapshot inspector distinct. Snapshot inspection does not switch branches, move HEAD, or mutate the authored walkthrough. Switching to main restores its snapshot without deleting recorded ideas history.

### 8. Approved remote and push treatment

- Preserve final revised A, “Two places, one history,” using the same host layout, Git palette, and comic spheres. Use separate local and GitHub repository panels with rounded dotted borders and an isometric square grid confined inside each panel behind its spheres. Do not replace these with a shared background grid.
- Retain repository headings, local HEAD → main → c5, the current-branch asterisk, branch labels, and origin/push connection labels as identifiers.
- In these remote scenes, omit per-panel explanatory captions, the current-branch/parent-arrow legend, the bottom diagram explanation, and the redundant origin/upstream status strip. This is a remote-specific simplification, not removal of the history lesson's legend. Explanations belong in the scene note and guide, with equivalent diagram text available there.
- Show origin configuration as a dashed connection without moving history or populating GitHub. It must not suggest automatic synchronization. Show an explicit push relationship when history is published, keeping local history and references in place.
- After push, hosted main points to c5 and includes the merged ancestry; local ideas remains at c3 and no hosted ideas branch is created.
- Keep git push -u origin main as ordinary command text without special highlighting of -u. In prose, use ordinary inline-code styling for -u, notes.txt, and ideas.txt; do not restore custom amber or underlined emphasis.
- The final guide explicitly identifies notes.txt and ideas.txt as files recorded in c5 and distinguishes that snapshot from the live working directory. Do not add the unselected hosted file-list panel to compensate for removed captions.
- The prototype's four remote states and eight history states are representative samples, not replacement lesson sequences or mandatory production step counts.

### 9. Location and navigation behavior

- Use static-host-friendly hash URLs with stable lesson slugs and one-based step numbers, such as #/choose-what-to-stage/2. Refresh preserves the location; browser Back/Forward restores it. Direct entry must work independently of earlier playback.
- Opening a lesson through Lessons selects its first step and closes the list. Numbered steps select directly. No separate progress persistence is required.
- Back/Next never cross lesson boundaries. Disable Back at the first step and Next at the last. Provide a separate Next lesson action at the end when another lesson exists; it opens the following lesson at its first step. Do not invent an eleventh lesson after Push the work.
- Invalid locations normalize to valid starting locations, never undefined scenes. A valid lesson with an invalid step may normalize to that lesson's first step; an unknown or missing lesson may normalize to the first lesson's first step.
- Replay never changes the selected lesson, step, or URL location. Snapshot inspection is not lesson navigation or checkout.
- All navigation controls are keyboard-operable, have visible focus, and expose the current step accessibly. Closing Lessons returns focus sensibly.

### 10. Authored motion, Replay, and interruption

- Begin with Vue and small CSS/SVG transitions; add no animation library without demonstrated need. Motion must explain a specific state change rather than rely solely on whole-scene fades.
- Suitable explanatory movements include copying selected contents into staging without removing the working file, creating a commit, moving branch/HEAD markers, and transferring needed committed history during push. Configuring origin must not animate a history transfer.
- Next plays the authored transition into the destination step. Back, initial load, direct numbered-step selection, direct lesson entry, and browser-history navigation show the completed destination state immediately.
- Replay repeats the current step's defined before-to-after transition without navigating or advancing afterward. It works even when the step was reached directly and no previous animation ran.
- Navigation can interrupt motion without waiting. Cancel superseded transitions and settle correctly at the new destination; delayed callbacks from old transitions must not overwrite the current selection or scene.
- Neither normal nor reduced-motion playback auto-advances. Detailed timing and choreography are tuned during implementation and reviewed at the visual gates; prototype fades are not final animation approval.

### 11. Responsive layout, zoom, and accessibility

- Preserve at least 16px story text and 44×44px interactive targets. Never scale down the entire page composition to force a fit or counteract browser zoom.
- Preserve compact desktop scene/timeline fit where practical. Internal guide scrolling is allowed on short desktops; the scene itself should not require vertical scrolling. Reflow vertically with document scrolling when two columns cannot remain readable. Browser zoom must enlarge content.
- On phones, keep the current scene compact and place it before the story, using normal document scrolling. Remove decorative space before shrinking meaningful content; do not author a separate mobile lesson.
- Keep phone Back/Next in a fixed bottom bar with safe-area spacing and sufficient content padding. It must never obscure text or keyboard focus. Keep numbered steps and Replay near the scene rather than crowding this bar; Lessons remains available from the header.
- Preserve essential labels and Git relationships. A readable equivalent textual history may replace a wide graph on narrow screens without changing lesson meaning.
- Give every scene an accessible name and a per-step textual explanation of its relevant state and changes. Reuse the story when it already supplies equivalent information; understanding must not depend on interpreting SVG or color alone.
- Require keyboard-operable controls, visible focus, announced current-step changes, and sensible focus return when Lessons closes.

### 12. Reduced-motion behavior

- Honor the system preference both at initial load and when it changes during use. Immediately display completed states and cancel running motion on a live change to reduced motion.
- Remove object travel, camera movement, bouncing, animated link drawing, and decorative loops rather than merely shortening animation duration.
- Retain the explanation of what changed. Keep Replay visible but disabled, with the exact explanation “Unavailable with reduced motion.”
- Reduced motion changes presentation, not the selected lesson/step, authored Git outcome, or reader-controlled pacing.

## Testing Decisions

### Confirmed seams and test quality

The user confirmed these seams before publication: the rendered website is the primary acceptance seam, with focused checks through authored lesson content and the public lesson-player interface. Do not add test-only renderer APIs or a separate testing seam for every SVG component.

A good test verifies externally meaningful behavior: authored Git facts, selected location, visible and accessible state, navigation results, or cancellation outcomes. Avoid coupling tests to private component structure, CSS class names, drawing coordinates, timers, or internal helper calls. Visual evidence complements behavioral tests; neither replaces the other.

There is no production application or automated test suite to extend. Prior art is the disposable prototype's build/type checks and scripted browser smoke checks for staging, eight history samples, and four remote samples at desktop and phone sizes. Reuse the observable cases, not its obsolete baseline scenario, variant-switching checks, dependency tree, or debug implementation. Those checks are evidence about a prototype, not production acceptance.

### Automated checks

1. **Toolchain:** TypeScript checking and the Vite production build pass. Confirm Tailwind utilities are compiled and retained and reset styles do not regress controls, focus indicators, command blocks, or SVG presentation. Add a repeatable check that the token showcase is browser-viewable during development but absent from production routes, generated pages, JavaScript bundles, and showcase-only assets. Verify production preview cannot render the showcase even when its development location is requested directly; shared tokens and licensed font assets must remain available to the production website.
2. **Vitest — lesson content:** Validate every authored lesson's independent starting state and state/change consistency, including no hidden initial commit; untracked-to-staged behavior; different working/staged contents; the first commit recording staged contents while retaining the unstaged edit; staging matching the commit afterward; c1 without parents; c2–c4 parent links; c5's ordered parents; branch/HEAD positions; and clean branch switches.
3. **Vitest — remote content:** Validate an empty hosted repository; origin without transfer or upstream; push publishing c1–c5 and hosted main at c5; local main/ideas retained; no separately published ideas branch; exclusion of uncommitted working/staged contents; and the origin/main upstream association. Check the stated exclusion even though the approved remote starting state is clean.
4. **Vitest — public player interface:** Check location normalization, lesson/step selection, boundary controls, separate Next lesson, Replay without location changes, independent Replay after direct entry, immediate versus animated navigation, interrupted transitions, and reduced-motion behavior. Superseded work must not overwrite the destination.
5. **Playwright in Chromium — exhaustive reachability:** Reach every authored step of all ten lessons, including independent direct entry without earlier playback. Verify correct story/state presentation, lesson switching from Lessons, list closure, numbered selection, boundaries, Next lesson, and no invented final lesson.
6. **Playwright — browser navigation and playback:** Check hash URLs, refresh, browser Back/Forward, malformed locations, Replay's unchanged location and no auto-advance, immediate direct/back/history states, Next transitions, and navigation during running motion.
7. **Playwright — accessibility and layout behavior:** Check keyboard operation, visible focus, announced current-step changes, named scenes and equivalent explanations, sensible focus return from Lessons, phone fixed-bar behavior, safe-area/content clearance, readable narrow layouts, and no horizontal page overflow.
8. **Playwright — reduced motion:** Test preference at load and changing live during an active transition. Completed state must appear immediately, Replay must remain visible and disabled with its explanation, and no stale callback or automatic step advance may occur.

Automated accessibility checks, if used, are supporting evidence, not certification. Do not claim that passing build or browser tests establishes presentation quality, cross-browser compatibility, or screen-reader usability.

### Human visual acceptance gates

Human approval of all three checkpoints is mandatory before calling presentation complete:

| Checkpoint | Required review subjects |
| --- | --- |
| Staging/commit | Working versus staged contents, first/root commit, staging after commit, command/editor-action hierarchy, scene-left/guide-right composition, palette, heading, and controls. |
| History/merge | Comic spheres, upright IDs and snapshot labels, open shared ancestry, starred branch/HEAD markers, clean checkout changes, distinct snapshot inspection, parent arrows, and both ordered merge parents. |
| Remote/push | Separate dotted/grid panels, empty GitHub state, origin without transfer, explicit push, retained local references, no separately published ideas branch, plain -u command styling, upstream explanation, and final committed-file inspection in the guide. |

At every checkpoint present **desktop and phone screenshots plus normal-motion recordings**. Compare against the final approved A treatments, not unselected B/C designs or superseded iterations. Responsive/accessibility exceptions and the approved curriculum take precedence over literal reference pixel matching. Prototype fade animations do not establish approval of final choreography. Review gates verify implementation; they do not reopen settled planning choices unless the user explicitly changes them.

### Layout and manual verification matrix

- Verify **1672×920, 1440×900, 1280×720, 1200×560, and 390×844**, plus a narrow-width check at **320 CSS px** and **200% browser zoom**.
- Confirm readable essential labels, at least 16px story text, 44×44px targets, visible focus, no horizontal page overflow, and no content or focus hidden behind the phone bar.
- Check compact desktop scene/timeline fit, internal guide scrolling on short windows where appropriate, readable vertical reflow where necessary, and normal phone document scrolling. No whole-page shrink-to-fit or zoom compensation is allowed.
- Perform Firefox and Safari smoke checks before acceptance, in addition to automated Chromium coverage.
- Manually check keyboard and screen-reader usability, equivalent diagram explanations, normal and reduced motion, and live motion-preference changes.
- Record actual build/test outcomes, browser/viewport and manual review results, failures, and the human verdict for each checkpoint. Do not substitute prototype results or an assertion of resemblance for production evidence.

## Out of Scope

- Arbitrary terminal input, editable repository files, simulation choices, real repository execution, exercises, quizzes, scoring, or a general Git simulator.
- Cloning, pulling, team collaboration, pull requests, conflict resolution, branch deletion, rebase, cherry-pick, advanced recovery, or a complete Git course.
- Git installation, identity configuration, account provisioning, credential setup tutorials, full GitHub dashboard replication, or real Git/GitHub mutations.
- Application accounts, a backend, database, payments, analytics, localization, or a CMS.
- React, Next.js, Three.js, React Three Fiber, realistic 3D rendering, and speculative plugin/adapter infrastructure.
- Search, theme switching, Practice/Design Lab/Cheatsheets destinations, language controls, and other unapproved reference-site features.
- Prototype comparison controls, debug displays, placeholder course navigation, unselected design treatments, externally hosted prototype fonts, and promotion of the disposable prototype as production scaffolding.
- Building the application during this spec-consolidation task. Publishing this local spec does not authorize initializing Git, creating a remote, pushing, opening a PR, publishing a site, or deploying. No deployment target is implied. Implementation is sequenced through the published tickets, including the foundation breakdown linked above; publication alone does not authorize starting them.

## Further Notes

### Status and authority

This is the self-contained implementation entry point, published in the local Markdown issue tracker with Status: ready-for-agent. All planning-map decision tickets are resolved, and the testing seams were explicitly confirmed by the user. Readiness means the work is specified; it does not claim that the website has been built or accepted, or authorize execution beyond the current documentation request.

The ten-lesson curriculum supersedes the old staging prototype's implicit baseline commit and placeholder lesson list. Final revised A treatments supersede earlier layout, sphere, grid, caption, and command-emphasis experiments. Readability/accessibility exceptions override literal reference fidelity. The remaining choices—private organization, final short copy, precise transition timing, and collection of acceptance evidence—are implementation work, not unresolved product decisions.

Use the [domain glossary](../../GLOSSARY.md) for canonical Git terminology. Its required distinctions are carried into this spec; do not substitute “upload queue,” “copied folder,” “saved diff,” or “automatic sync” for the concepts being taught. No relevant ADR currently exists.

### Provenance and visual evidence

These links retain decision history and visual examples; the requirements themselves are consolidated above:

| Area | Source |
| --- | --- |
| Original presentation character | [Designed to Scale](https://designed-to-scale.vercel.app/) and [local reference audit](research/reference-audit.md) |
| Page composition, palette, copy, controls | [Choose the visual treatment for a representative Git lesson](issues/02-representative-lesson.md#answer) |
| Curriculum and independent playback | [Choose ten short Git explanations and their scenario behavior](issues/03-five-lessons.md#answer) |
| Architecture, navigation, motion, Tailwind, acceptance | [Set the Vue implementation boundaries and visual acceptance criteria](issues/04-implementation-contract.md#answer) |
| Responsive layout and accessibility | [Choose fidelity exceptions for responsive layout and reduced motion](issues/05-fidelity-exceptions.md#answer) |
| Comic spheres and shared history | [Choose the visual language for history, branches, HEAD, and merging](issues/06-history-branch-merge-visuals.md#answer) |
| Separate repositories and first push | [Choose the visual explanation of remote setup and first push](issues/07-remote-visuals.md#answer) |
| Disposable visual comparison evidence | Prototype run instructions and limitations: `.scratch/git-visual-guide/prototype/README.md` on branch `prototype/git-visual-guide` (baseline `fc6ad28`); final A for staging, history, and remote studies. Inspect with `git show prototype/git-visual-guide:.scratch/git-visual-guide/prototype/README.md`, or check out that branch in a separate worktree. |
| Tailwind setup reference for implementation | [Official Vite integration](https://tailwindcss.com/docs/installation/using-vite) |

Keep the prototype disposable. Its old scenario, Google Fonts dependency, debug tools, simple fades, and historical tooling audit findings are not a production starting contract. Recheck current dependencies and security status when production tooling is separately authorized; do not copy its dependency tree or present old audit results as current facts.

This consolidation changes planning documents only. No new production build, automated browser test, visual/motion approval, cross-browser check, or accessibility verification is claimed.
