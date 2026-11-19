# 01: Scaffold Vue with human-controlled setup

**What to build:** A clean, runnable production Vue starter created with the official create-vue command, with the user answering the interactive setup questions rather than an agent silently selecting flags or defaults.

**Parent:** [08 — Open and play “Start a repository”](../../git-visual-guide/issues/08-open-and-play-start-a-repository.md)

**Blocked by:** None (can start immediately).

**Status:** ready-for-human

This ticket is human-assisted scaffolding, not lesson implementation. Follow the approved implementation spec and preserve existing repository contents. The disposable prototype is not the production starting point.

- [ ] Agree with the user on the package manager and application location before invoking create-vue. Inspect the destination first; do not overwrite existing planning documents or other work.
- [ ] Use the official interactive create-vue command and give the user control of its questions in an interactive terminal. If the agent cannot hand over terminal interaction, ask the user to run it and report the choices; do not answer on their behalf.
- [ ] Explain the agreed Vue, TypeScript, and Vite requirements and the Vitest/Playwright testing needs before the user answers. Record actual selected options and resolve any conflict with the agreed stack explicitly.
- [ ] Ensure Vitest and Playwright in Chromium are available for subsequent work, and exercise a minimal starter test through each without implementing lesson behavior.
- [ ] Check current dependency and security status rather than copying the prototype dependency tree. Record runtime/package-manager versions, actual findings, and unresolved issues.
- [ ] Verify the starter can run locally, type-check, and produce a production build. Record commands and actual outcomes.
- [ ] Keep the prototype separate. Do not initialize Git, create a remote, push, deploy, or start design-token or lesson implementation as part of this ticket.
