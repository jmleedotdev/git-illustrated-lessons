# 09: Edit, inspect, and stage selected contents

**What to build:** Complete Edit and inspect and Choose what to stage lessons. Readers watch Alice edit notes.txt, inspect its status, select contents for staging, and edit again while the staging area retains its earlier selection.

**Parent:** [Git visual learning website — implementation spec](../spec.md)

**Blocked by:** [08 — Open and play “Start a repository”](08-open-and-play-start-a-repository.md).

**Status:** ready-for-agent

Extend the production experience established by 08 and preserve the parent spec's visual, player, responsive, accessibility, and safety contracts. Each lesson is independently authored; earlier playback is never a prerequisite for opening it.

- [ ] Edit and inspect begins with the initialized repository, untracked notes.txt, and no commits. Editing and inspecting git status leave the file untracked and create no history automatically.
- [ ] Choose what to stage begins with edited, untracked notes.txt and no commits. Staging selected contents starts tracking the file while leaving the working file present.
- [ ] A subsequent editor change produces newer working-directory contents while the staging area retains the selected earlier contents. Show both explicitly, with no hidden baseline commit and no implication that staging moves a file.
- [ ] Author short Alice-and-Bob steps with real commands only in standalone command blocks, plain actions under “In Alice's editor,” ordinary inline-code references, meaningful Key idea callouts, and sentence-based descriptions of content changes.
- [ ] Preserve the approved isometric staging treatment, Git palette, compact heading, and scene-left/guide-right composition. Provide equivalent state/change text and readable scene-first phone presentation without removing essential distinctions.
- [ ] Next and Replay explain selected contents being copied into staging without removing the working file. Later editing must visibly leave staged contents unchanged. Whole-scene fades alone are insufficient.
- [ ] Both lessons and every step open directly into completed authored states. Lessons selects step one and closes; Back/Next stay within the lesson; a separate Next lesson action opens the following available lesson at step one.
- [ ] Replay works after direct entry without altering location. Navigating or changing to reduced motion during staging settles correctly and cannot be overwritten by stale animation work; no auto-advance occurs.
- [ ] Vitest checks untracked-to-staged behavior, version separation, and independent starting states through content/player interfaces. Playwright reaches every new step and verifies lesson switching, deep links, Next lesson, Replay, interruption, and reduced motion.
- [ ] Verify keyboard/focus behavior, named scenes and equivalent text, 16px story text, 44×44px targets, phone fixed-bar clearance, short-desktop scrolling/reflow, and no horizontal page overflow. Build/type checks and existing tests remain green; record actual outcomes.
