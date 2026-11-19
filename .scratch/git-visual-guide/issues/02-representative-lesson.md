# Choose the visual treatment for a representative Git lesson

Labels: wayfinder:prototype
Type: prototype
Status: resolved
Assignee: jmlee
Parent: [A Designed to Scale-style Git learning website](../map.md)
Blocked by: 01

Reference prerequisite: [Audit Designed to Scale's visual and explanatory experience](01-reference-audit.md).

## Question

What should one representative staging-and-commit explanation look and feel like when translated into Designed to Scale's visual language? Use a disposable visual prototype and live human feedback to select the page structure, explanatory diagram style, and degree of visual fidelity before designing every lesson.

## Context

- Use Vue + TypeScript + SVG if a code prototype is useful; this is not production scaffolding.
- Focus on presentation quality, not lesson volume or an executable Git environment.
- Preserve selected reference characteristics while using original Git-specific wording and graphics.
- Load prototype and domain-modeling skills. Link any prototype assets from this ticket.

## Comments

### Prototype comparison approved; visual verdict pending

The human approved comparing three structurally different layouts using the same four-step scenario: edit A→B, stage B, edit working file to C while staging remains B, commit B while C remains unstaged. This approval authorizes the comparison, not a winning layout or the ticket's resolution.

- Asset: [Disposable Vue/TypeScript/SVG/Vite prototype and run instructions](../prototype/README.md).
- Local preview: http://127.0.0.1:5187/?variant=A ; variants A/B/C can be switched in place without resetting the step.
- A: reference-first workspace; B: reading-first notebook; C: scene-first canvas with collapsible navigation.
- Agreed Git terminology captured in [the project glossary](../../../GLOSSARY.md).
- Build/type-check passed; browser checks covered all variants at desktop and phone widths, scenario states, and state-preserving layout switching. Full reference motion fidelity and visual approval are not established.
- Tooling audit reports six high-severity findings through picomatch with no patched registry version currently available; preview stays localhost-only. Details and other limitations are in the prototype README.
- Prototype kept locally because no Git repository/remote exists; no branch/push/PR or production implementation.

### Human feedback and revised A

The human prefers A, with these explicit changes: hide the left lesson list behind a Lessons button at the far right of the header (replacing the disposable-study badge); guide on the left and scene on the right. They confirmed the staging/working-version distinction is clear. They requested that code blocks contain only actual commands, not instructions such as “edit notes.txt,” and asked for a more Git-themed palette.

Revised A implements the requested desktop geometry and hidden navigation. Editing steps use plain editor-action text; only git add/git commit appear in command blocks. Proposed palette: Git-orange (#f05032) and charcoal controls, warm paper surfaces, peach/slate/terracotta scene zones. Color choice is an agent proposal pending visual confirmation, not an approved exact palette. B/C remain comparison alternatives. Small screens retain scene-before-guide stacking pending the separate responsive decision.

Vue/TypeScript build passes. Revised A browser checks at 1672×920, 1440×900, 1024×768, and 390×844 cover geometry, no horizontal overflow, navigation toggle, and editor-action vs command rendering. A wide-screen CSS specificity collision found in those checks was corrected and rechecked.

### Latest human revision: scene left, story-led guide right

The human revised the desktop ordering to **scene left / guide right**, superseding the previous guide-left request. The far-right navigation toggle now uses plain **Lessons / Close**, with no icon. The guide is a third-person story: Alice edits and commits while Bob sits beside her, suggests an extra sentence, and asks which version is recorded. This stays within one local repository and adds no remote collaboration. Editor instructions remain distinct from actual command blocks. The Git-orange/charcoal palette is unchanged.

Implemented in the disposable prototype. Build/type-check passes; browser checks at widths 1672, 1440, 1024, and 390 confirm the revised ordering, no horizontal overflow, toggle labels, story text, command-only code blocks, and unchanged Git version states.

### Copy clarity revision

On human request, the replay button now reads **Replay** and the editor label no longer includes “Not a command.” Guide version-arrow shorthand has been replaced with explicit sentences naming the file and content versions. Filenames and Git commands in the narrative, editor actions, and change summaries use inline-code emphasis, visually distinct from standalone command blocks. Inline references are rendered as text, not injected HTML.

Build/type-check passes. Desktop (1440px) and phone (390px) browser checks across all four steps confirm the revised label, no arrow shorthand in guide content, inline-code display, command blocks only for actual Git commands, and no horizontal overflow.

### Compact desktop workspace revision

On human request, the duration/difficulty/step pills now share the breadcrumb row, aligned far right. The redundant “Alice edits. Bob asks questions…” scene subtitle was removed; the guide already introduces the story. The Key idea callout now uses an outlined light-bulb icon.

Revised A uses a viewport-height desktop layout with a flexible SVG stage, keeping the timeline in view without page scrolling. Debug state lives in a compact expandable footer overlay. At desktop heights of 800px or less, the supplementary mental-model card is hidden to prioritize the guide; those concepts remain in the step explanations. Very short windows allow the guide's story area to scroll internally rather than clipping text; the scene itself never requires vertical scrolling. Mobile retains normal document scrolling. These are prototype behaviors, not resolution of the separate responsive/fidelity ticket.

Build/type-check passes. All four steps verified with no page scrolling at 1672×920, 1440×900, 1366×768, 1280×720, and 1200×560. No guide scrolling at the first four sizes after the compact-height adjustment; 1200×560 retains internal guide scrolling. Mobile 390×844 has normal vertical scrolling and no horizontal overflow.

## Answer

The human approved the final revised A: “ok perfect, i'm ok with this now.” The selected treatment is preserved in the [disposable prototype](../prototype/README.md), variant A. Earlier conflicting layout requests in Comments are superseded by this resolution.

### Approved treatment

- **Desktop composition:** large isometric SVG scene on the left, story-led guide on the right. No permanent course sidebar. A text-only **Lessons / Close** toggle at the far right of the header reveals the lesson list.
- **Compact scene heading:** breadcrumb at the left and duration/difficulty/step pills at the far right of the same row, with the lesson title below. No redundant story-introduction paragraph in the scene.
- **Visual language:** warm paper surfaces, monospaced typography, dark outlines and small offset shadows retained from the reference; Git-orange (#f05032) and charcoal accents with peach/slate/terracotta diagram zones are the approved Git adaptation. This intentionally departs from literal reference colors and three-column navigation.
- **Narrative voice:** third-person Alice-and-Bob storytelling. Alice performs local edits and Git actions; Bob observes, suggests a change, and asks questions. This does not imply remote collaboration or shared repository execution.
- **Copy and command hierarchy:** standalone code blocks contain actual commands only. Editor actions are plain text under “In Alice’s editor,” without a “Not a command” disclaimer. Filenames and commands within prose use inline-code emphasis. Explain version changes in sentences, not unexplained A→B shorthand in the guide.
- **Callout and controls:** outlined light-bulb icon for Key idea; **Replay** label; Back/Next and numbered steps for the representative walkthrough. The variant switcher/debug state are prototype aids, not production UI.
- **Git clarity:** the human confirmed the diagram distinguishes working-directory and staged contents. The representative story shows editing to B, staging B, editing to C while B remains staged, then committing B while C remains unstaged. Staging never removes the working file, and the staging area matches the new commit afterward rather than becoming empty.
- **Desktop fit:** compact viewport-height workspace with the scene and timeline visible without page scrolling. All four steps were verified with no page or guide scrolling at 1672×920, 1440×900, 1366×768, and 1280×720. The prototype hides its supplementary mental-model card at short desktop heights; at 1200×560 it preserves text via internal guide scrolling. Mobile uses normal document scrolling. This approves the representative desktop fit, not a complete responsive/accessibility contract.

### Handoff and remaining scope

- Production implementation is still out of scope. The prototype is evidence of the chosen treatment, not production code to promote directly.
- Final five-lesson grouping, branch/HEAD/history/merge symbols, global playback semantics, responsive exceptions, reduced-motion/accessibility policy, architecture, and acceptance criteria remain for the other decision tickets and map fog.
- Current animations are simple fade/lift transitions; no pixel-perfect reference motion claim or exhaustive cross-browser/accessibility approval is implied.
- Artifact remains local because no Git repository/remote exists; no branch, commit, push, or PR was created. Tooling audit limitations remain documented in the prototype README.
