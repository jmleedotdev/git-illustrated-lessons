# 02: Establish and review shared design tokens

**What to build:** Shared visual foundations for the website, inspectable through a browser-viewable development-only showcase so the user can approve the tokens before lesson features begin.

**Parent:** [08 — Open and play “Start a repository”](../../git-visual-guide/issues/08-open-and-play-start-a-repository.md)

**Blocked by:** [01 — Scaffold Vue with human-controlled setup](01-scaffold-vue-with-human-controlled-setup.md).

**Status:** ready-for-agent

Preserve the existing approved final revised A presentation, not a new design direction. The shared tokens belong to the production application; the showcase is development tooling only. Do not build a full component library, lesson player, or new public site destination.

- [ ] Integrate tailwindcss and @tailwindcss/vite alongside Vue, import Tailwind through the main stylesheet, and compile utilities at build time without a browser CDN.
- [ ] Define reusable semantic tokens for warm-paper surfaces, dark ink/outlines, Git-orange/charcoal accents, typography, spacing, borders, offset shadows, and visible focus treatment. Avoid parallel showcase-only theme values.
- [ ] Self-host a suitably licensed monospaced font, retain its license, and provide a monospace fallback. Do not depend on an external font host.
- [ ] Provide a browser-viewable showcase available only during development, using the same tokens and styles that the production website will consume.
- [ ] Demonstrate palette, type hierarchy, spacing, outlines, shadows, inline code, command blocks, an outlined light-bulb Key idea callout, representative SVG styling, and default/hover/focus/disabled control states. These are representative examples, not lesson features or a speculative component framework.
- [ ] Keep the showcase out of production navigation, routes, generated pages, JavaScript bundles, and showcase-only assets. A production request to its development location must not render the showcase; do not rely only on hiding a link.
- [ ] Add a repeatable verification that development can display the showcase and a production build/preview cannot expose it. Shared tokens and font assets remain available in production.
- [ ] Verify compiled Tailwind utilities and no reset regressions in controls, focus, command blocks, or SVG. Check contrast, keyboard focus, at least 16px story-text samples, and 44×44px interactive targets.
- [ ] Review representative desktop and phone layouts, 320 CSS px, and 200% zoom for readability and overflow. Record screenshots, commands, actual outcomes, and any failures; passing a build is not visual approval.
- [ ] Document how to launch the development showcase and present it to the user. Record explicit human approval or requested adjustments; leave this ticket incomplete until the user approves the visual foundations. First-lesson implementation remains blocked until then.
