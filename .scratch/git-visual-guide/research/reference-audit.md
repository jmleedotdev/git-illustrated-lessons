# Reference audit — Designed to Scale

Evidence capture for ticket 01; not a prototype, approved design, final lesson plan, or architecture decision. Target adaptation remains **Vue + TypeScript + SVG + Vite**, roughly five short, explanation-led Git lessons. Parent owns ticket resolution and map updates.

## 1. Sources, method, and evidence labels

Inspected **2026-11-18 UTC**. Reused the existing downloaded evidence and stack handoff, then fetched the first-party document and assets again: all three were byte-identical to the supplied copies.

- **[H] [Live document](https://designed-to-scale.vercel.app/)** — HTML, initial layout/theme scripts, viewport metadata.
- **[C] [Deployed stylesheet](https://designed-to-scale.vercel.app/assets/index-CxX-BAVx.css)** — exact tokens, selectors, dimensions and responsive rules. Search the selector/literal quoted below; the asset is minified.
- **[J] [Deployed application bundle](https://designed-to-scale.vercel.app/assets/index-BeXJu_A0.js)** — lesson content, generated markup, event handlers, SVG drawing and animation. Function names below are build-specific locators, not proposed APIs.
- **[R1] [Request lesson, step 1](https://designed-to-scale.vercel.app/#/request-lifecycle/1)**, [step 2](https://designed-to-scale.vercel.app/#/request-lifecycle/2), [step 3](https://designed-to-scale.vercel.app/#/request-lifecycle/3).
- **[R2] [Scaling, problem](https://designed-to-scale.vercel.app/#/vertical-horizontal/2)**, [solution](https://designed-to-scale.vercel.app/#/vertical-horizontal/3), [recap](https://designed-to-scale.vercel.app/#/vertical-horizontal/11), [next lesson](https://designed-to-scale.vercel.app/#/load-balancing/1).

**Labels:** **S** = static first-party code evidence; **B** = live headless-browser DOM/geometry/interaction observation; **I** = interpretation; **Rec** = recommendation for human review; **U** = unknown/unverified. B does **not** mean a human inspected rendered screenshots or watched animation.

Browser method: installed Chrome **157.0.8103.80**, headless, Chrome DevTools Protocol driven by inline Node scripts; isolated temporary profiles removed afterward. Used device-metric overrides (device scale factor 1; `mobile:false`, including narrow tests), DOM clicks, an actual dispatched ArrowRight key, computed styles/bounding rectangles, SVG packet transforms, storage reads, and reduced-motion media emulation. No screenshot, visual design, Figma artifact, application scaffold, or dependency installation was created. No browser-discovery/web-enable tool was exposed in this worker's tool allowlist; direct HTTPS and installed Chrome supplied primary evidence instead.

Reproducibility fingerprints: CSS 64,269 bytes, SHA-256 `dc99c195d0230ae0d23c005906c6e307fbd8184ad59408735878b58b7430eee1`; JS 790,585 bytes, SHA-256 `475546d36e0549aecbc4d5e4557f7d5fecfd0b14f207ef7e0b5412c464b06fa0`. Hashed URLs can change on redeploy. Prior context: `/tmp/designed-to-scale-research/findings.md`, its `index.html`/`app.css`/`app.js`, and the supplied `website-stack-research-handoff.md`; those notes were not treated as visual/runtime proof.

## 2. Reference character and presentation hierarchy

**I:** The defining composition is a compact, paper-colored **course workspace**, not a landing-page hero or terminal: course tree at left, a large diagram sheet in the middle, explanatory step card and learning goals at right. Monospaced type, outlined pastel controls, small offset shadows, isometric objects, and restrained paper texture give it an illustrated technical-notebook character. This description follows the markup, CSS, and SVG construction—not a perceptual screenshot assessment. [C: `.body`, `.sheet`, `.rail`, `.btn-pop`, `.window:after`; J: `.window` template, SVG renderer]

### Desktop geometry

**S:** `.window` is a viewport-filling grid with a **54px** header; `.body` columns are **296px / minmax(0,1fr) / 376px**. Document overflow is hidden; course tree and guide prose scroll independently. Center `.sheet` has 14px radius, margins `12px 0 14px 2px`, padding `0 16px 16px`; right rail has 14px gaps and padding `12px 14px 14px`. Guide occupies remaining height above a content-sized goals card. [C: `.window`, `.body`, `.course`, `.guide__content`, `.sheet`, `.rail`]

**Important S+B:** Desktop is **globally scaled**, not just reflowed. Bundle literal `Qh={w:1672,h:920}` and `tg()` apply:

`zoom = min(1, viewportWidth / 1672, viewportHeight / 920)`

The window's unscaled width/height are expanded to viewport size divided by zoom. Thus CSS font sizes and widths below are **pre-zoom**; they are not the displayed pixel sizes on every laptop. This can make text very small on a short desktop viewport. [J: `tg`, `eg`; B: R1 resize checks]

**B, R1 step 1 at 1672×920, zoom 1:** measured CSS-pixel rectangles, rounded to nearest pixel:

| Region | x / y | width × height |
|---|---:|---:|
| Header | 0 / 0 | 1672 × 54 |
| Sidebar | 0 / 54 | 296 × 866 |
| Center sheet | 298 / 66 | 998 × 840 |
| Diagram stage | 315 / 178 | 964 × 592 |
| Inner SVG host | 330 / 237 | 934 × 498 |
| Timeline | 315 / 782 | 964 × 107 |
| Guide card | 1310 / 66 | 348 × 628 |
| Goals card | 1310 / 708 | 348 × 198 |

These are **one lesson/state**, not universal card heights. Stage flexes with header/timeline content; goals depend on copy length. [R1; C: flex layout rules]

Header sequence: brand/link, Learn/Practice/Design Lab/Cheatsheets buttons, search, language, theme, author credit. Center sequence: breadcrumb → title plus duration/difficulty/step-count pills → one-line summary → diagram stage → numbered timeline. Stage has metric chips top-left, replay/pause tools top-right, legend at bottom; right guide has step count, chapter badge, title, explanation, optional callout/change list, Back/Next, keyboard hint. [S: J templates `Km`, `Xm`, `rh`; C stage selectors]

## 3. Visual inventory — transferable values, not approved tokens

All numeric CSS values here are **S/pre-zoom**. [C]

| Element | First-party values / convention |
|---|---|
| Main palette | `--paper:#f4ebe0`, `--paper-2:#f7efe4`, `--sheet:#f9f2e8`, `--card:#f8f0e6`, `--card-2:#f6eee3`; stage `#faf3e9` |
| Text and outlines | ink `#1d1b18`, secondary `#34302b`, muted `#6f6961`, muted-2 `#8b847a`; lines `#ddd3c5`, soft `#e6ddd0`, strong `#c6bbac` |
| Accents | green `#cfe3b2`, green-2 `#b2d491`, green-3 `#7fc278`; violet `#e7ddf5`; orange `#fcdcbd`; mint `#dff0de`; rust tokens `#d0683a` / `#d97a4f` (presence does not imply dominance) |
| Font | JetBrains Mono, then UI monospace/SFMono-Regular/Menlo; self-hosted Latin weights 400/500/600/700/800; ligatures and contextual alternates disabled; body 13px / 1.4 |
| Type hierarchy | brand 19px/800; lesson title 30px/800, line-height 1.12; guide title 19px/800, line-height 1.25; guide paragraphs 12.8px / 1.65; sidebar lesson 13px/500; eyebrow uppercase usually 11.5–14px/700–800 |
| Controls/cards | card radius 12px, 1px subtle border; primary button radius 8px, 1.5px ink border, green fill, offset shadow `1.5px 2.5px 0`; secondary controls typically 1.3px borders and 1.5px downward shadow; pressed buttons translate slightly and lose shadow |
| Pills and emphasis | header tags 25px tall, 13px radius, 11.5px type; chapter badge 22px tall, uppercase 10.5px/800; key terms use a green highlight under the lower part of the word, not a solid text background; inline code has thin border, beige fill, 4px radius |
| Spacing rhythm | mostly 6–16px gaps/padding; guide padding `15px 16px 12px`; paragraph bottom margin 10px; callout padding `11px 12px 12px`, 10px radius; no single universal spacing unit established |
| Surface detail | `.window:after` overlays SVG turbulence noise at opacity .05 with multiply blending and `pointer-events:none`; subtle gradients/inset highlights accompany card shadows |

**S+B:** Light is the default unless stored `sdt:theme` is dark. Dark mode uses warm charcoal—not black: paper `#211e1a`, sheet `#28241f`, card `#26231e`, ink `#efe6d6`, muted `#a3998b`; dedicated color remapping exists. Clicking theme produced body `rgb(33,30,26)` and stored `"dark"`. The theme button uses a 560ms expanding-circle View Transition where supported, bypassed for reduced motion. Actual transition appearance and dark diagram contrast remain U. [H; C: `:root[data-theme=dark]`; J: `bh`, theme click handler; B: R2]

**B:** `document.fonts.check('500 13px "JetBrains Mono"')` returned true. **U:** no network-font trace or human font/rasterization comparison; font declarations are the stronger identification evidence. [R1; C: `@font-face`]

## 4. Diagram vocabulary

- **S:** Isometric SVG construction, not perspective WebGL. Projection `j(x,y,z) = [14(x+y), 7(x-y)-z]` gives 2:1 ground-plane diagonals. `iso-grid` is a 28×14 SVG diamond pattern (stroke `#a8916f`, .3 opacity, .8 width) with a radial fade mask. Objects use rounded polygon corners, shaded top/side faces, cast shadows, dark outlines, icon glyphs, short labels and floating status pills. Layer order separates floor, links, packets, entities, overlays, and HUD. [J: `j`, `jr`, `Zr`, renderer constructor]
- **S:** Vocabulary includes blocks, people/crowds, devices, database cylinders, zones, queues, information panels and rings. Light-mode face gradients include blue top `#dfebf9 → #cde0f5`, blue side `#bcd3ef → #a9c5e8`; orange and green have corresponding pastel face shading. SVG drawing ink starts at `#211e1b`, slightly different from CSS body ink. [J: `vr`, `Oi`, `ki`]
- **S:** Links are ink-colored rounded paths, usually 1.9px strokes; solid arrows indicate connection/direction, dashed/off/heartbeat/cut styles distinguish states. Labels are separate pills placed to reduce collisions. Traffic uses orange request dots, green return dots; heavier/written/message traffic has different shape/color. A text legend accompanies symbols. These are system-design meanings, **not Git semantics**. [C: `.link*`, `.pkt*`, `.lg*`; J: `updateLinks`, `Am`]
- **S:** Scene framing fits entity/link bounds, tries to avoid panel collisions, and can preserve a nearby camera plan to reduce unnecessary shifts. Panel placement and label measurements are content-dependent; fixed scene dimensions cannot be read from the CSS alone. At SVG host width **<520px**, information panels are omitted from the scene and the corresponding figure can appear in guide content (`cards-inline`). [J: `wf=520`, `measure`, `planFor`, `eh`; C: `.guide__card`]
- **B:** R1 changed from one device entity to device + DNS entity on Next, with a link and moving packet. R2 problem rendered server block + crowd, metric chips reading **12,000 users / 480 requests/s / 2.4s p95 / 17% errors / $150 per month**, plus explicit change list. At 390px viewport `cards-inline` was true, but this sampled step had no information panel; actual panel relocation remains **S, not browser-verified**. [R1, R2]

## 5. Explanatory and animation behavior

### Narrative pattern

**S+B:** The unit is a **curated explanatory step**: chapter category + headline + short prose + synchronized scene/metrics + optional insight/warning and “What changed.” It does not require inventing arbitrary commands. Chapters available in the bundle are Setup/sand, Problem/red, Solution/green, Technique/blue, Trade-off/amber, Insight/violet, Recap/ink; they are reusable categories, not a mandatory fixed order. Callouts are “Watch out,” “Good to know,” “Key idea,” and “Coming up.” [J: `o`, `km`, `rh`; B: R1/R2 sampled chapters]

**S, representative arc:** Scaling's 11 authored steps are One server → Viral spike → Scale up → The ceiling → One failure → Scale out → Night time → Autoscale → Flash sale → Who routes? → Recap. The problem/solution alternation ties a visible state change to a reason, limitation or counterexample; recap uses a comparison table, and the final problem introduces the next lesson. This is a useful explanation structure, **not a recommendation to copy 11 steps into each Git lesson**. [J: `id:\`vertical-horizontal\`` lesson object; R2]

**B:** Request step 1 asks where page-load time goes; Next updates the URL to step 2, headline to “Find the address (DNS),” chapter to Technique, prose to the lookup explanation, diagram entity count 1→2, and first goal to checked. This binds text, diagram and goals to the same step. [R1]

### Control and state inventory

| Behavior | Evidence and observed boundary |
|---|---|
| Manual stepping | **S+B:** Back/Next and timeline buttons set `#/<lesson-id>/<1-based-step>`; ArrowRight dispatched in Chrome advanced scaling 2→3. No automatic lesson advancement observed while waiting. Timeline allows direct jumps; “done” dots indicate indices before current step, not a knowledge test. [J: `sh`, `ch`, `Zm`; R1/R2] |
| Replay | **S+B:** Replay replays the transition into the current step; code restores prior scene instantly, then transitions forward (first step clears instead). It does not restart the lesson. Observed animations after Replay while traffic was paused. [J: `Dh`; R1] |
| Pause | **S+B:** Pause means **traffic**, not all motion. Three packet transforms were identical across 350ms after pause on scaling step 2; ArrowRight still changed the scene/headline while paused. `tick()` processes entity/camera transitions before checking `paused` for packet movement. [J: `kh`, `tick`; R2] |
| Progress | **S+B:** Visiting recap immediately added `vertical-horizontal` to `sdt:done`, checked goals and tree marker; no quiz/confirmation required. Next then navigated to Load Balancing. Goals check at step thresholds; completion is visitation, not assessed mastery. [J: `dh`, `rh`; R2] |
| Resume | **S:** Last lesson/step, recent lessons, completed lessons, theme and progress-panel preference use `sdt:` localStorage. No-hash fallback resumes saved last state, otherwise first available lesson. Storage writes observed; reload/resume and browser Back were not exercised. [J: `Rm`, `ch`, `dh`; R1/R2] |
| Course tree | **S+B:** Module folder buttons expand; current lesson gets green raised treatment, completed lesson gets check icon. Clicking headings keeps at most one module open; course reveal animates scrolling. Narrow-screen drawer opened and focused its Close button. [J: `Bm`, `Vm`, `Wm`, `rg`; R1] |
| Search | **S+B:** Modal search exists, not a decorative input: DOM click opened a dialog and focused its combobox; 40 result elements appeared with empty query. Code supports lesson/concept/step results, highlighted matches, arrow selection, Enter, Esc, Cmd/Ctrl+K and `/`. Search ranking, keyboard activation and focus restoration were not comprehensively tested. [J: `tm`; R1] |
| Other header tabs | **S+B:** Practice produced “Practice is coming soon” toast; bundle maps Design Lab/Cheatsheets similarly. Do not treat these as functioning sections or required Git features. [J: `fh`; R1] |
| Diagram manipulation | **S:** Double-click/double-tap zoom, wheel zoom, drag/pinch/pan and unzoomed horizontal-swipe stepping have handlers; Fit/`0` restores framing. **B:** narrow-screen Expand filled 390×844 via a fixed-position stage. This is a CSS overlay, not evidence of browser Fullscreen API use. Touch/zoom gestures untested. [J: `gestures`, `ag`, `Q.onSwipe`; R1] |
| Narration | **S+B:** Read-aloud code exists but feature flag `{readAloud:!1}` disables it; no speech control appeared in the sampled guide. Do not promise narration. [J; R1/R2] |

### Motion recipe (S unless noted)

Scene transitions remove old objects, move retained objects, introduce new objects with stagger/lift, draw links, then start recurring traffic. Constants: exit **420ms**, move **820ms**, enter **680ms**, stagger **130ms**, link draw **560ms**; durations overlap and are **not** the total step duration. New links wait on related objects. The renderer interpolates camera and numeric entity fields; cubic in/out and a back/overshoot easing support movement/entry. [J: `yf`, `gf`, `goTo`, `tick`]

Guide text slides roughly **36px** with a 150ms outgoing ghost and 360ms incoming staggered children; chapter badge uses 14px slide when category changes. Numeric metrics interpolate over 900ms, chip widths over 480ms for nonnumeric changes, with a 1.5s flash. CSS adds 1.5s scene spotlights and success/failure bursts. **B:** at 100ms after Next the new text/URL were already present, an outgoing guide ghost existed, and 24 animations were reported; after settling, packets continued. No frame-by-frame visual timing or motion-feel judgment was made. [C: `guide-in/out`, `chip-flash`, `spot`; J: `dh`, `oh`; R1]

## 6. Responsive rules and measured consequences

**S:** Both boot HTML and resize code choose layouts by **width AND height**, not device labels. [H; J: `eg`, `tg`; C: `data-layout` selectors]

| Mode | Rule | Presentation |
|---|---|---|
| Desktop | width ≥1200 **and** height ≥560 | Three columns; whole-window zoom above; clipped viewport with internal scrolling |
| Tablet | otherwise width ≥960 **and** height ≥600 | Course becomes drawer, top navigation hidden; center + **340px** guide rail; normal scale; viewport height `100dvh` |
| Stack | otherwise | Sticky 54px topbar; normal document scrolling; sheet → timeline → guide → goals; Back/Next fixed at bottom with safe-area padding |

**S:** Stack title wraps at `clamp(22px,6.4vw,30px)`; diagram height `clamp(300px,min(76vw,68dvh),580px)`. Non-desktop chips become horizontally scrollable; tools move bottom-right and hide text labels; legend becomes scrollable. At ≤639px search collapses to an icon; header language/credit move out of the way into drawer affordances; timeline dots shrink 26→22px. If per-step timeline width falls below 70px, only current step's label remains visible. At ≤380px brand shrinks to 16px. Hoverless devices hide keyboard hints. [C; J: `Qm`]

**B, R1 step 2:**

| Viewport | Actual mode / zoom | Consequence measured in browser |
|---|---|---|
| 1440×900 | desktop / .861244 | Header 46.5px; displayed sidebar ~255px, right rail ~324px |
| 1200×560 | desktop / .608696 | Header ~32.9px; guide nav buttons only ~23.1px tall after scaling |
| 1199×900 | tablet / no zoom | Right rail 340px; course off-canvas |
| 1024×768 | tablet / no zoom | Center sheet 672px; stage 638×446px |
| 959×900 | stack / no zoom | Stage 917×580px; guide begins at y~892px (below initial viewport) |
| 390×844 | stack / no zoom | Stage 348×300px; guide begins y~654px; fixed navigation y785, height59; document scrollWidth390 (no horizontal page overflow in this state) |

**I/Rec:** Fidelity should account for desktop scaling and the mobile diagram-before-explanation ordering, but copying them blindly risks tiny laptop text/targets and a long gap between scene and prose. Human must decide whether to preserve or deliberately depart; this audit does not settle that trade-off. Real-device touch, address-bar resizing, safe areas and mobile viewport behavior are still U because narrow tests used desktop headless emulation.

## 7. Accessibility and reduced motion — clues, not certification

- **S:** Native buttons/links, H1/H2 hierarchy, labeled course aside, expanded-state attributes on tree/drawer controls, a search `role=dialog`/`aria-modal`, combobox/listbox semantics, language menu radio state, decorative icons `aria-hidden`, and polite status toast are present. **B:** search focused its input; drawer focused Close. These are positive clues, not proof of complete keyboard or screen-reader support. [J templates, `tm`, `rg`; R1]
- **S+B:** Main stage SVG has `role=img` but no accessible name in sampled R1 steps (`aria-label` null; no `<title>`/`<desc>` in the inspected renderer). Separate inline panel figures have title-derived `aria-label`. No `aria-current` was found in the core bundle for current lesson/timeline state. Screen-reader output and diagram equivalence need human testing. [J renderer, `eh`, `Vm`, `Zm`; R1]
- **S:** Only CSS reduced-motion query found disables speech-wave animation; JS checks reduced motion for theme reveal and speech auto-scroll (speech is disabled). **B:** with `prefers-reduced-motion:reduce` emulated, Next still produced 360ms guide entry and 1.5s metric-chip animations; packet transform changed from `translate(-77.59 129.21)` to `translate(-46.15 144.93)` over 250ms. Thus **do not claim general reduced-motion support**. [C; J; R1 step 3]
- **U:** No WCAG contrast measurement, accessibility-tree audit, screen-reader run, exhaustive Tab/Esc/focus-return test, browser zoom test or touch-target audit. Styles include some `:focus-visible` handling, but this does not establish adequate focus visibility across controls. Desktop CSS zoom makes apparent target/type sizes particularly important to review. **Rec:** preserve useful semantic controls; improve rather than reproduce these gaps.

## 8. Git translation considerations — recommendations only

These are **Rec**, not findings about Git functionality on the reference and not settled human decisions:

1. Preserve the workspace hierarchy, warm paper/ink palette, monospaced hierarchy, outlined pastel cards, large annotated SVG scene, numbered step progression, brief causal prose, callouts and explicit “What changed.” This carries more identity than recreating a large catalogue or placeholder top tabs.
2. Use original Git explanations and purpose-built file/staging/commit/branch/HEAD symbols. Keep identity and labels stable through steps. Isometric tiles can carry reference style, but Git history needs clearly readable directed parent relationships and pointer labels; reference traffic arrows must not silently stand for commit ancestry.
3. Avoid implying that `git add` moves a file out of the working directory, that branches are duplicate folders, or that commits disappear when switching branches. Show changed snapshots/references with textual explanations, not a continuous network-traffic metaphor. Validate these choices in later domain modeling; no Git-domain source audit was performed here.
4. Use step-local state summaries (for example current branch/HEAD or staged-file count) only when they explain the scene; do not port latency, cost or failure metrics as decorative dashboard filler. A code-styled command caption can explain a transition without becoming an input terminal or simulator.
5. Approximately five lessons can cover the already requested local fundamentals; **exact grouping, step counts, persistent-progress semantics and playback controls remain open**. Reference provides Replay and traffic pause, but continuous traffic has no obvious Git equivalent. Human should decide whether replay alone, no playback, or another constrained explanatory control is appropriate.
6. Fixed stack can reproduce this vocabulary using Vue-managed UI and SVG shapes/transitions. This finding provides no reason to add React, Three.js, a graph-layout framework, backend or command execution. Detailed renderer/content architecture belongs to the later design task.
7. For the later human-reviewed representative lesson, compare desktop workspace proportions, narrow reading order, Git-specific symbol clarity, and motion/reduced-motion alternatives. Do not treat code-derived timing constants as proof that an animation feels faithful.

## 9. Browser/human verification queue and limits

Before approving the later prototype, inspect the **live reference** alongside it:

- **Visual first:** human screenshots at 1672×920 and 1440×900, plus a real phone near390px width. Compare paper grain/subtle shadows, actual font weight, isometric face treatment, label legibility, diagram scale/negative space, and relative emphasis of guide versus scene. No visual screenshot comparison was completed here.
- **Watch transitions:** R1 steps1→2→3 and R2 steps2→3→6; inspect forward/back/replay, interrupted rapid steps, moving labels/camera, and whether one can read while objects animate. Runtime DOM evidence is not an animation recording or performance benchmark.
- **Narrow reading:** verify scroll between diagram and prose, sticky navigation overlap, chip/legend scrolling, full-stage entry/exit and restoration. Test touch swipe, pinch, double-tap and drag on actual hardware; all gesture behavior except Expand is code evidence only.
- **Content-dependent framing:** inspect a lesson with an information panel at SVG widths just above/below520px; verify relocation, label collision and long headings. Sampled R1/R2 do not establish every lesson's layout.
- **Accessibility:** keyboard-only course/search/drawer/theme walkthrough with visible focus and focus return; screen-reader announcement of step changes; accessible textual diagram explanation; 200% browser zoom, contrast, real target sizes; reduce-motion preference set before load and toggled during use.
- **State/navigation:** fresh profile vs saved profile, reload/resume, browser Back/Forward, deep links to later steps, completion on direct recap jump, and storage-unavailable handling. State reads/writes and hash updates were observed, not this whole matrix.

**Coverage limit:** Two sampled lesson families and a next-lesson transition, one Chrome build, scripted interactions and a small viewport matrix. No full-course runtime audit, screenshots, Safari/Firefox/mobile-browser run, assistive-technology run, source repository/license verification, or original-author design-intent confirmation. Deployed behavior can change; no asset-copying permission is established. This artifact inventories the reference for a later human-reviewed prototype; it does not approve lesson grouping, controls, a final visual design, or production architecture.
