# 04: Make the approved lesson design easy to find and verify

**What to build:** A fresh agent working on a lesson can find the approved visual references before editing, compare its work with the prototype during review, and catch hard-coded palette colors through the existing project checks.

**Blocked by:** None (can start immediately).

**Status:** resolved

- [x] Add a short pointer in `AGENTS.md` for lesson UI work. From a clean checkout of `main`, a fresh agent can use it to find the approved revised A on `prototype/git-visual-guide`, the approved SVG sources, and the shared design tokens. Use the [variant A approval](../../git-visual-guide/issues/02-representative-lesson.md#answer) and [shared design token approval](02-establish-and-review-shared-design-tokens.md) as references.
- [x] Add a review step for lesson UI changes. Compare the approved prototype and proposed build side by side at the same viewport size. Check the layout, controls, and SVG geometry. Record differences needed for lesson content or accessibility.
- [x] Add a focused check to `pnpm check` that catches hard-coded palette colors in lesson CSS and SVG. Verify that the check reports a literal palette color at its source and passes when the lesson uses the shared token.

## Comments

Compared revised A from `prototype/git-visual-guide` with the built Start a
repository lesson in Chromium at 1440×900 and 390×844, at 100% zoom. Both use
the same 960×500 viewBox, grid path, and three isometric platform paths.
The desktop scene, guide, timeline, and Lessons control follow revised A.
The opening lesson uses the approved folded page, three lesson-specific steps,
and empty staging and history platforms. Larger controls and story text,
scrolling guide content, phone labels outside the SVG, fixed phone navigation,
and disabled Replay under reduced motion support accessibility. The grid uses
an opacity mask with the original bounds and fade stops.

A temporary CSS rule made `pnpm check` stop at its file, line, and column.
The regression test also checks scoped CSS, SVG paint, and Vue bindings.
Replacing the literals with the shared token passed. Standards and spec
reviews led to narrower Tailwind matching, coverage for style object bindings,
and updated check documentation. `pnpm verify` passed all eight unit tests,
the production artifact check, and eight Chromium tests each on dev and preview.
