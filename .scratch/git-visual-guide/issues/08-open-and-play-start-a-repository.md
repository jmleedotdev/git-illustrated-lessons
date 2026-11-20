# 08: Open and play “Start a repository”

**What to build:** A runnable learning website where a reader can open and play the complete Start a repository lesson. Alice initializes main in a folder containing notes.txt, and the reader sees that initialization leaves the file untracked with no staged contents or recorded history.

**Parent:** [Git visual learning website — implementation spec](../spec.md)

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

The parent spec governs the approved presentation and all shared behavior. Build a narrow production lesson, not a promoted prototype or an empty shell. Publishing this ticket does not authorize starting implementation, initializing Git, creating a remote, or deploying.

- [ ] Use Vue, TypeScript, SVG, Vite, and Tailwind CSS. Integrate tailwindcss and @tailwindcss/vite alongside Vue, import Tailwind through the main stylesheet, and compile styles at build time rather than using a browser CDN.
- [ ] Recheck dependency/security status instead of copying the disposable prototype's dependency tree. Self-host a suitably licensed monospaced font with a monospace fallback.
- [ ] Present an original, short Alice-and-Bob explanation using immutable authored states and defined before-to-after transitions. Alice acts; Bob observes and asks questions. No commands execute, no accounts are accessed, and no Git/network mutations occur.
- [ ] The lesson ends with HEAD referring to main before its first commit, notes.txt untracked, an empty staging area, and no commits. Do not introduce a hidden baseline commit or automatically track the file.
- [ ] Compose small lesson-content, player, and scene-presentation interfaces through a reusable shell. The player exposes location and actions without interpreting commands; renderers own geometry and motion. Do not introduce a simulation engine, backend, speculative plugin system, or per-step renderer.
- [ ] Preserve final revised A: scene left and guide right on desktop; no permanent sidebar; text-only Lessons / Close at the far-right header; compact breadcrumb/metadata row and title; warm paper, dark outlines, offset shadows, Git-orange/charcoal accents, and approved diagram zones.
- [ ] Preserve command/editor-action distinctions, safe text-based inline-code formatting, the outlined light-bulb Key idea callout, numbered steps, Back/Next, and Replay. Omit comparison controls, debug displays, unapproved site destinations, and redundant scene-introduction copy.
- [ ] Stable hash locations use a lesson slug and one-based step number. Direct entry, refresh, browser Back/Forward, and invalid-location normalization work. Opening the lesson from Lessons selects step one and closes the list.
- [ ] Back/Next remain within the lesson and disable at boundaries. Numbered steps select directly. The player supports a separate Next lesson action only when a following implemented lesson exists, without placeholder or invented destinations.
- [ ] The lesson’s Back and Next controls play the destination transition. Initial load, direct selection, and browser-history navigation show final states immediately. Replay independently repeats the current step's before-to-after transition without changing location. Navigation cancels superseded work, and no callback can restore a stale scene. No auto-advance occurs.
- [ ] Honor reduced motion at load and on live changes: cancel motion, show the final state immediately, retain the explanation, and keep Replay visible but disabled with “Unavailable with reduced motion.” Remove travel and decorative motion rather than shortening it.
- [ ] Provide named scenes, equivalent per-step state/change text, announced step changes, keyboard controls, visible focus, and sensible focus return from Lessons. Preserve at least 16px story text and 44×44px targets without relying on color alone.
- [ ] Phones use compact scene-before-story ordering and normal document scrolling, with fixed safe-area-aware Back/Next and enough padding to protect content/focus. Keep numbered steps and Replay near the scene. Short desktops scroll the guide or reflow rather than shrinking the whole page; zoom enlarges content.
- [ ] Vitest verifies authored state and public player behavior; Playwright in Chromium reaches every lesson step and verifies independent entry, location/history/refresh, malformed locations, boundaries, Replay, interruption, keyboard behavior, live reduced motion, and phone clearance without private-renderer test APIs.
- [ ] Type checking and the production build pass. Verify compiled Tailwind utilities and no reset regressions in controls, focus, command blocks, or SVG. Record actual desktop/phone checks and any failures; do not claim production acceptance from prototype evidence.
