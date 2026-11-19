# 13: Create and connect an empty GitHub repository

**What to build:** Complete Create a remote repository and Connect local and remote lessons. Readers see Alice create an empty hosted repository, then configure origin locally without publishing any history.

**Parent:** [Git visual learning website — implementation spec](../spec.md)

**Blocked by:** [10 — Record commits and read their history](10-record-commits-and-read-history.md).

**Status:** ready-for-agent

Reuse approved comic-sphere/history visual elements from 10. This ticket is intentionally not blocked by 12: its lessons use immutable, independently authored post-merge states specified by the parent, not playback from the merge lesson.

- [ ] Both lessons start from the specified clean local post-merge history: c1 has no parent; c2 → c1; c3 → c2; c4 → c2; c5 has ordered parents c4 and c3. main is at c5, ideas at c3, HEAD on main, and working directory/staging match c5's notes.txt and ideas.txt snapshot.
- [ ] Create a remote repository starts with no origin or upstream and no published history. Illustrate GitHub repository git-notes with README, .gitignore, and license initialization unselected. The created hosted repository contains no commits, files, or main reference; local history stays unchanged.
- [ ] Connect local and remote independently starts with that empty hosted repository. Adding origin stores a clearly illustrative GitHub HTTPS address locally. GitHub remains empty, no history or files transfer, and no upstream association is created.
- [ ] Explain origin as a conventional local name for an address, not a special GitHub service or automatic synchronization. State Git installation, identity, account, and HTTPS-authentication prerequisites without teaching setup or credentials.
- [ ] Preserve final revised A: separate local and GitHub panels with rounded dotted borders, each with its own confined isometric square grid behind the comic spheres. There is no shared grid outside the panels.
- [ ] Retain repository headings, local HEAD → main → c5, starred current-branch marker, branch names, and origin connection identifiers. Omit per-panel explanatory captions, the remote current-branch/parent-arrow legend, bottom explanation, and redundant origin/upstream status strip.
- [ ] Put explanations in the scene note and guide, including equivalent diagram text. Non-command GitHub creation actions are explanatory text, not shell commands; illustrate the concept rather than cloning a dashboard.
- [ ] Show origin as a dashed configured connection without history travel or hosted commits. Next/Replay, direct final states, cancellation, and reduced motion preserve this no-transfer distinction.
- [ ] Each lesson and every step opens independently through hash navigation; Lessons, numbered steps, boundaries, and separate Next lesson navigation work without mutable coupling to earlier lessons.
- [ ] Vitest validates the full authored local graph, clean snapshots, hosted emptiness, origin-only configuration, and absent upstream/transfer. Playwright reaches every new step and checks direct entry, navigation, Replay, interruption, and live reduced motion.
- [ ] Keep phone/textual equivalents readable, named scenes and per-step state/change explanations available, keyboard focus visible, targets/text at required minima, and the fixed phone bar clear of content/focus. Verify no horizontal overflow and retain green build/type/regression checks; record actual results.
- [ ] No live GitHub access, real repository creation, command execution, credential handling, or network mutation occurs. Do not add an unselected hosted file-list panel or prototype comparison/debug controls.
