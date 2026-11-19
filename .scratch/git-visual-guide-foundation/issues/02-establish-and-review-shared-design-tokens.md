# 02: Establish and review shared design tokens

**What to build:** Shared visual foundations for the website, inspectable through a browser-viewable development-only showcase so the user can approve the tokens before lesson features begin.

**Parent:** [08 — Open and play “Start a repository”](../../git-visual-guide/issues/08-open-and-play-start-a-repository.md)

**Blocked by:** [01 — Scaffold Vue with human-controlled setup](01-scaffold-vue-with-human-controlled-setup.md).

**Status:** ready-for-agent

Preserve the existing approved final revised A presentation, not a new design direction. The shared tokens belong to the production application; the showcase is development tooling only. Do not build a full component library, lesson player, or new public site destination.

- [x] Integrate tailwindcss and @tailwindcss/vite alongside Vue, import Tailwind through the main stylesheet, and compile utilities at build time without a browser CDN.
- [x] Define reusable semantic tokens for warm-paper surfaces, dark ink/outlines, Git-orange/charcoal accents, typography, spacing, borders, offset shadows, and visible focus treatment. Avoid parallel showcase-only theme values.
- [x] Self-host a suitably licensed monospaced font, retain its license, and provide a monospace fallback. Do not depend on an external font host.
- [x] Provide a browser-viewable showcase available only during development, using the same tokens and styles that the production website will consume.
- [x] Demonstrate palette, type hierarchy, spacing, outlines, shadows, inline code, command blocks, an outlined light-bulb Key idea callout, representative SVG styling, and default/hover/focus/disabled control states. These are representative examples, not lesson features or a speculative component framework.
- [x] Keep the showcase out of production navigation, routes, generated pages, JavaScript bundles, and showcase-only assets. A production request to its development location must not render the showcase; do not rely only on hiding a link.
- [x] Add a repeatable verification that development can display the showcase and a production build/preview cannot expose it. Shared tokens and font assets remain available in production.
- [x] Verify compiled Tailwind utilities and no reset regressions in controls, focus, command blocks, or SVG. Check contrast, keyboard focus, at least 16px story-text samples, and 44×44px interactive targets.
- [x] Review representative desktop and phone layouts, 320 CSS px, and 200% zoom for readability and overflow. Record screenshots, commands, actual outcomes, and any failures; passing a build is not visual approval.
- [ ] Document how to launch the development showcase and present it to the user. Record explicit human approval or requested adjustments; leave this ticket incomplete until the user approves the visual foundations. First-lesson implementation remains blocked until then.

## Comments

Implemented shared foundations and `/__design/` (launch with `pnpm dev`; instructions in root README). Human approval is **pending**; this ticket remains incomplete and first-lesson work stays blocked. No separate validation report was created.

Checks: focused Vitest, typecheck, build/artifact check, and one Chromium smoke per dev/preview passed. Reviewed [desktop](../screenshots/tokens-desktop.png), [phone](../screenshots/tokens-phone.png), [320px](../screenshots/tokens-narrow.png), [200% zoom](../screenshots/tokens-zoom-200.png), and [control states](../screenshots/tokens-control-states.png): no horizontal overflow, 16px story samples, buttons ≥44×44px. Active text contrast ≥4.60:1; command text 13.01:1; focus/panel 5.95:1 (disabled text 4.12:1, inactive-control exemption). Real Chromium zoom confirmed 1440px window →720 CSS px, DPR 2. Initial failures were a missing showcase (expected red test), absent styles in the old build (expected artifact-check failure), an overbroad URL check matching Tailwind’s license comment, missing DOM test types, and headless-shell zoom/capture limitations; all corrected. Final `pnpm verify` passed (lint, format, types, 2 unit tests, build, artifact check, 2 dev + 2 preview tests including starter smoke). Independent Standards and Spec reviews found no issues. Commit hook initially rejected trailing whitespace in the upstream OFL text; removed that whitespace without changing the license wording. Human visual approval is still pending.
