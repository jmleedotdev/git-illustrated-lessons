# Set the Vue implementation boundaries and visual acceptance criteria

Labels: wayfinder:grilling
Type: grilling
Status: resolved
Assignee: jmlee
Parent: [A Designed to Scale-style Git learning website](../map.md)
Blocked by: 02, 03, 05, 06, 07

Prerequisites: [Choose the visual treatment for a representative Git lesson](02-representative-lesson.md), [Choose ten short Git explanations and their scenario behavior](03-five-lessons.md), [Choose fidelity exceptions for responsive layout and reduced motion](05-fidelity-exceptions.md), [Choose the visual language for history, branches, HEAD, and merging](06-history-branch-merge-visuals.md), and [Choose the visual explanation of remote setup and first push](07-remote-visuals.md).

## Question

Given the selected representative design and ten-lesson behavior, what is the smallest maintainable Vue/TypeScript/SVG/Vite architecture, and what observable acceptance criteria make the brief ready for an implementation session? Decide the lesson/scenario data boundary, reusable page and SVG responsibilities, animation approach, navigation, responsive/accessibility expectations, and reference-comparison checkpoints without building the application.

## Context

- Fixed stack is a user preference, not a decision to reopen.
- Avoid a generalized simulation engine, unnecessary backend, and speculative abstractions.
- Consult grilling, domain-modeling, and codebase-design.
- If a choice remains impossible to specify, create a focused decision ticket rather than quietly guessing.
- The resulting brief belongs at ../spec.md once decisions are complete; it is a planning artifact, not production code.

## Answer

The human approved all six recommendations with “1-6 yes.” Consulted grilling, domain-modeling, and codebase-design. This resolution completes the remaining architecture and acceptance decisions; it does not authorize production implementation.

### Authored content and module interfaces

Use Vue, TypeScript, SVG, Vite, and Tailwind CSS with three main modules:

- **Lesson content:** typed, immutable definitions containing each lesson's predefined steps, story, real command or editor action, explicit Git state, and equivalent diagram explanation. Each lesson has a self-contained starting state. Definitions may reuse immutable story facts but never depend on mutable playback state from another lesson.
- **Lesson player:** owns current lesson/step, navigation, replay, and reduced-motion behavior. Its interface exposes the selected lesson/step and player actions; it does not interpret command strings or perform Git operations.
- **Scene presentation:** staging, history, and remote SVG renderers consume authored states and transitions, sharing visual elements where useful. Drawing coordinates and animation details belong here, not in lesson prose. The reusable page shell composes the scene, guide, header, lesson list, and controls without embedding scenario-specific Git rules.

Render explicit authored states rather than calculating Git operations. Do not build a simulation engine, backend, command interpreter, speculative plugin system, or a renderer per individual step. Keep interfaces small and test observable behavior through them. Concrete file names and private composition are implementation details, not further planning decisions.

### Styling with Tailwind CSS

After approving the six choices, the human requested “i wish to add tailwind css to the project.” Tailwind CSS is now part of the required production stack; the module, visual, and accessibility contracts remain unchanged.

- Integrate `tailwindcss` and `@tailwindcss/vite` through the Vite plugin alongside Vue, and import Tailwind in the application's main stylesheet with `@import "tailwindcss";`. Use the [official Vite installation guide](https://tailwindcss.com/docs/installation/using-vite) when scaffolding. Compile styles at build time; do not use the browser CDN.
- Use Tailwind utilities for page layout, spacing, typography, responsive behavior, and interaction states. Define shared theme tokens for the approved paper/Git palette, monospaced font, borders, and offset shadows; Tailwind defaults must not replace the selected visual treatment.
- Retain focused custom CSS and SVG attributes where needed for isometric graphics, scene geometry, or authored motion. Tailwind is a styling tool, not a replacement for the scene renderers or animation/player logic.
- Verify utilities survive the production build and that reset styles do not regress controls, focus indicators, command blocks, or SVG presentation. All existing visual, responsive, and reduced-motion checks still apply.
- This amendment updates the planning contract only. Do not retrofit the disposable prototype or install dependencies before the separate production build is authorized.

### URL and navigation contract

- Use static-host-friendly hash URLs with a stable lesson slug and one-based step number, for example `#/choose-what-to-stage/2`. Browser Back/Forward restores the location; refresh preserves it.
- Opening a lesson from Lessons starts at its first step and closes the list. Direct step links open that step independently.
- Back/Next stay within the current lesson and are disabled at its first/last step respectively. A separate **Next lesson** action appears at the end when a following lesson exists; the final lesson does not lead to an invented eleventh lesson.
- Numbered steps select directly. Replay never changes the selected step. No separate progress persistence is required.
- Invalid locations normalize to a valid starting location. Implementation may use a valid named lesson's first step for an invalid step and the first lesson's first step for an unknown/missing lesson; never render a broken or undefined scene.
- Retain keyboard-operable controls, visible focus, announced current-step changes, and sensible focus return when Lessons closes, as required by [Choose fidelity exceptions for responsive layout and reduced motion](05-fidelity-exceptions.md#answer).

### Motion and interruption contract

Use small authored SVG/CSS transitions to explain the change, not only whole-scene fades. Examples include selected contents copied into staging without removing the working file, a new commit appearing, branch/HEAD markers moving, and needed committed history traveling during push. Origin configuration must not imply history transfer.

- **Next:** plays the authored transition into the destination step.
- **Back, directly selected steps, and initial load:** display the completed destination state immediately. Browser-history navigation follows this direct-selection rule.
- **Replay:** repeats the selected step's defined before-to-after transition without changing its location or advancing afterward. A step's transition must be independently replayable, including when reached through a direct link.
- **Interruption:** new navigation cancels the running animation and settles correctly at the new destination; callbacks from a superseded transition must not overwrite it. Controls need not wait for an animation to finish.
- **Reduced motion:** show completed states immediately on load and live preference changes; cancel running motion. Remove object/camera travel, bouncing, animated link drawing, and decorative loops. Keep Replay visible but disabled with “Unavailable with reduced motion,” and retain the explanation of what changed.
- No normal or reduced-motion animation advances steps automatically.

Begin with Vue and CSS/SVG animation. Add no animation library without a demonstrated need. Exact timings and detailed choreography can be tuned during implementation and reviewed at the visual checkpoints; the prototypes' simple fades are not final motion approval.

### Surrounding website scope

Ship the approved light palette, course header, hidden Lessons list, scene, guide, and playback controls. Do not reproduce unapproved reference-site features: search, theme switcher, Practice/Design Lab/Cheatsheets destinations, language controls, or prototype/debug switches.

Self-host the chosen monospaced font with an appropriate license and fallback. Author final short explanations during implementation against the approved ten-lesson scenario; a separate full curriculum-writing decision is not required. Original explanations and Git-specific graphics remain required.

### Automated and manual acceptance

Use **Vitest** for lesson/state consistency and player behavior and **Playwright** for browser checks. Verify:

- Every authored step of all ten lessons is reachable, including direct entry independent of earlier playback.
- Lesson switching, URLs, refresh, browser history, numbered steps, boundary controls, Replay, and animation cancellation follow the contract above.
- Git state consistency: working versus staged versions; root commit without a parent; correct branch movements and merge parents; origin configured without transfer; push includes main's reachable history without separately publishing the ideas branch or uncommitted contents.
- Phone navigation, keyboard operation, live reduced-motion changes, and no horizontal page overflow.

Tests cross module interfaces and observable UI behavior, not private implementation details. Require TypeScript checking and a Vite production build as implementation checks. These are future acceptance requirements, not tests run during planning.

Use Chromium for automated coverage and Firefox and Safari smoke checks before acceptance. Manually check keyboard and screen-reader usability; automated checks alone do not establish accessibility.

### Visual baseline and review checkpoints

The original reference supplies the overall character. The human-approved prototype A treatments and recorded fidelity exceptions take precedence over literal pixel matching; historical prototype copy/state assumptions do not override the approved curriculum.

Review three representative checkpoints with the human:

1. Staging/commit: working-directory versus staged contents and first commit.
2. History/merge: comic spheres, shared ancestry, branch/HEAD markers, and two merge parents.
3. Remote/push: separate dotted/grid panels, origin without transfer, and first push.

For each, review desktop and phone screenshots plus normal-motion recordings. Human approval is required before calling the presentation complete. Implementation review does not reopen settled planning choices unless the human explicitly changes them.

Verify layout at **1672×920, 1440×900, 1280×720, 1200×560, and 390×844**, plus a narrow-width check (320 CSS px is a suitable concrete check) and 200% browser zoom. Preserve at least 16px story text, 44×44px interactive targets, readable essential labels, visible focus, and unobscured phone content. Keep compact desktop scene/timeline fit where practical; use internal guide scrolling on short desktops or vertical reflow when readability requires it. Never shrink the whole workspace to compensate for zoom or viewport size.

### Handoff

- Build-ready brief: [Git visual learning website — implementation brief](../spec.md). This ticket is the canonical record of the choices above; the brief indexes the approved decisions and their implementation checks.
- All other map tickets are resolved; no further decision ticket or in-scope fog emerged. The destination is reached once the brief is assembled.
- No new Git-domain terms or hard-to-reverse architectural trade-offs required a glossary change or ADR.
- No production or prototype code was changed. No new build, browser, screen-reader, visual, or motion verification is claimed. No Git repository, branch, push, PR, or deployment was created.
