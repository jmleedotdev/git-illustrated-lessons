## Agent skills

### Issue tracker

Issues and specs live in `.scratch/`. Before creating, claiming, or resolving
tickets, read `.agent-docs/agents/issue-tracker.md`.

### Triage labels

Use the five default triage labels for implementation issues.
Before triaging, read `.agent-docs/agents/triage-labels.md`.

### Domain docs

Single-context: root `GLOSSARY.md` and `.agent-docs/adr/`.
Before exploring domain behavior or proposing changes, read
`.agent-docs/agents/domain.md`.

## Coding standards

Before implementing or reviewing changes, read [CODING_STANDARDS.md](CODING_STANDARDS.md).

## Lesson UI

Before editing, read the [revised A approval](.scratch/git-visual-guide/issues/02-representative-lesson.md#answer)
and [shared token approval](.scratch/git-visual-guide-foundation/issues/02-establish-and-review-shared-design-tokens.md#comments).
From `main`, run `git show prototype/git-visual-guide:.scratch/git-visual-guide/prototype/README.md`
for preview steps. Use `origin/prototype/git-visual-guide` if the branch is only
available as a remote-tracking ref. In the prototype directory, the SVG sources
are `src/App.vue` (staging), `src/HistoryPrototype.vue` (history, branches, and
merges), and `src/RemotePrototype.vue` (remote). The approved folded page is
in [FoldedPage.vue](src/components/scenes/FoldedPage.vue). Use the shared tokens in
[src/assets/css/main.css](src/assets/css/main.css).

When reviewing a lesson UI change, open the matching revised A study and the
proposed lesson side by side at the same viewport size and zoom. Check the
layout, controls, and SVG geometry, including viewBox, paths, and placement.
Record the viewport and any differences needed for lesson content or
accessibility in the review.
