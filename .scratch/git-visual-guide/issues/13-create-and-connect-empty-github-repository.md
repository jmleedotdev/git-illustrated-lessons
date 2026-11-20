# 13: Create and connect an empty GitHub repository

**What to build:** Complete Create a remote repository and Connect local and remote lessons. Readers see Alice create an empty hosted repository, then configure origin locally without publishing any history.

**Parent:** [Git visual learning website — implementation spec](../spec.md)

**Blocked by:** [10 — Record commits and read their history](10-record-commits-and-read-history.md).

**Status:** ready-for-agent

Reuse approved comic-sphere/history visual elements from 10. This ticket is intentionally not blocked by 12: its lessons use immutable, independently authored post-merge states specified by the parent, not playback from the merge lesson.

- [x] Both lessons start from the specified clean local post-merge history: c1 has no parent; c2 → c1; c3 → c2; c4 → c2; c5 has ordered parents c4 and c3. main is at c5, ideas at c3, HEAD on main, and working directory/staging match c5's notes.txt and ideas.txt snapshot.
- [x] Create a remote repository starts with no origin or upstream and no published history. Illustrate GitHub repository git-notes with README, .gitignore, and license initialization unselected. The created hosted repository contains no commits, files, or main reference; local history stays unchanged.
- [x] Connect local and remote independently starts with that empty hosted repository. Adding origin stores a clearly illustrative GitHub HTTPS address locally. GitHub remains empty, no history or files transfer, and no upstream association is created.
- [x] Explain origin as a conventional local name for an address, not a special GitHub service or automatic synchronization. State Git installation, identity, account, and HTTPS-authentication prerequisites without teaching setup or credentials.
- [x] Preserve final revised A: separate local and GitHub panels with rounded dotted borders, each with its own confined isometric square grid behind the comic spheres. There is no shared grid outside the panels.
- [x] Retain repository headings, local HEAD → main → c5, starred current-branch marker, branch names, and origin connection identifiers. Omit per-panel explanatory captions, the remote current-branch/parent-arrow legend, bottom explanation, and redundant origin/upstream status strip.
- [x] Put explanations in the scene note and guide, including equivalent diagram text. Non-command GitHub creation actions are explanatory text, not shell commands; illustrate the concept rather than cloning a dashboard.
- [x] Show origin as a dashed configured connection without history travel or hosted commits. Next/Replay, direct final states, cancellation, and reduced motion preserve this no-transfer distinction.
- [x] Each lesson and every step opens independently through hash navigation; Lessons, numbered steps, boundaries, and separate Next lesson navigation work without mutable coupling to earlier lessons.
- [x] Vitest validates the full authored local graph, clean snapshots, hosted emptiness, origin-only configuration, and absent upstream/transfer. Playwright reaches every new step and checks direct entry, navigation, Replay, interruption, and live reduced motion.
- [x] Keep phone/textual equivalents readable, named scenes and per-step state/change explanations available, keyboard focus visible, targets/text at required minima, and the fixed phone bar clear of content/focus. Verify no horizontal overflow and retain green build/type/regression checks; record actual results.
- [x] No live GitHub access, real repository creation, command execution, credential handling, or network mutation occurs. Do not add an unselected hosted file-list panel or prototype comparison/debug controls.

## Comments

Implemented both two-step lessons. Open `/#/create-a-remote-repository/2` for the empty hosted repository, or `/#/connect-local-and-remote/2` for the configured connection. Both open independently; Replay highlights only the created repository name or the dashed connection, never the commits.

**Visual comparison:** Opened the matching revised A states from `prototype/git-visual-guide` alongside production preview in Chromium at 1440×900 and 390×844, 100% zoom and DPR 1. The desktop SVG retains the `0 0 900 420` viewBox, 380×330 rounded dotted panels at `(25,30)` and `(495,30)`, the separate 56×28 diamond patterns, the five sphere centers, parent arrow geometry, branch placement, and dashed `M405 140H495` origin path. Production scales the approved shared comic sphere to the study’s 23-unit radius and uses shared palette and type tokens. The archived study still contains the empty-panel copy and pre-origin “no link” label; the canonical approval calls for their removal, so production puts the explanation in the scene note and guide. The production timeline represents each lesson separately, with independent Next lesson navigation. The textual view replaces the SVG on narrow screens and short desktop windows to avoid shrinking labels. [Create, desktop](../screenshots/13/product-create-1440.png) · [Connect, desktop](../screenshots/13/product-connect-1440.png) · [Connect, phone](../screenshots/13/product-connect-390.png).

**Verification:** `pnpm verify` passed the palette, lint, format, type, build and production artifact checks, 19 Vitest tests, and 40 Playwright tests each in dev and production preview. Browser tests checked hash entry and reload at all four steps, numbered and adjacent navigation, keyboard focus, disabled boundaries, no-motion commit nodes, Replay cancellation and live reduced motion. Production preview smoke checks found no horizontal overflow or requests to external origins across all four steps at 1440×900, 1280×720, 1200×560, 1024×768, 720×700, 390×844, and 320×700. The phone checks measured 16px diagram text and a 44px minimum target with visible keyboard focus above the fixed bottom bar. At 320×700 the full guide could scroll clear of the fixed bar at every step. Native Safari and screen-reader testing were not performed.

**Standards review (four findings addressed):** Extend the text fallback to 1280×720, keep shared story line height, assert visible labels and stationary commits rather than brittle SVG coordinates in the browser tests, and share the example repository owner and prerequisite copy. The exact SVG geometry was checked against the study separately.

**Spec review (three findings addressed):** The short-desktop fallback preserves readable labels, the text view carries the `* main` marker, and steps that change nothing no longer play a decorative pulse. Those steps explain why Replay is unavailable; creation and origin configuration still replay their respective reveals.
