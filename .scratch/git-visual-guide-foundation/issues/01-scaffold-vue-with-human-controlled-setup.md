# 01: Scaffold Vue with human-controlled setup

**What to build:** A clean, runnable production Vue starter created with the official create-vue command, with the user answering the interactive setup questions rather than an agent silently selecting flags or defaults.

**Parent:** [08 — Open and play “Start a repository”](../../git-visual-guide/issues/08-open-and-play-start-a-repository.md)

**Blocked by:** None (can start immediately).

**Status:** ready-for-human

**Implementation:** complete (the Status above records the human-assisted triage role).

This ticket is human-assisted scaffolding, not lesson implementation. Follow the approved implementation spec and preserve existing repository contents. The disposable prototype is not the production starting point.

- [x] Agree with the user on the package manager and application location before invoking create-vue. Inspect the destination first; do not overwrite existing planning documents or other work.
- [x] Use the official interactive create-vue command and give the user control of its questions in an interactive terminal. If the agent cannot hand over terminal interaction, ask the user to run it and report the choices; do not answer on their behalf.
- [x] Explain the agreed Vue, TypeScript, and Vite requirements and the Vitest/Playwright testing needs before the user answers. Record actual selected options and resolve any conflict with the agreed stack explicitly.
- [x] Ensure Vitest and Playwright in Chromium are available for subsequent work, and exercise a minimal starter test through each without implementing lesson behavior.
- [x] Check current dependency and security status rather than copying the prototype dependency tree. Record runtime/package-manager versions, actual findings, and unresolved issues.
- [x] Verify the starter can run locally, type-check, and produce a production build. Record commands and actual outcomes.
- [x] Keep the prototype separate. Do not initialize Git, create a remote, push, deploy, or start design-token or lesson implementation as part of this ticket.

## Setup record

- Human confirmed **pnpm**, the **current repository root**, and the two testing seams before scaffolding: a mounted starter through Vitest and the served starter through Playwright/Chromium. These catch rendering/serving regressions, not lesson behavior or visual acceptance.
- The agent explained Vue, TypeScript, Vite, Vitest, and Playwright requirements, then supplied `pnpm create vue@latest .` for the human's interactive terminal. No feature flags or answers were supplied by the agent.
- Human reported: **TypeScript yes; Router, Vitest, End-to-End Testing, Linter, Prettier selected; Playwright selected; no experimental features; skip all example code yes**. The generated linter setup includes ESLint and Oxlint. No stack conflicts were found.
- The human temporarily moved the original repository/planning files to `../bk/` before generation, then restored them. Verified original HEAD `ccc5b772d29e6034309c7c50e47b254a5d6ddc2d` and all planning files returned; existing ignore rules remain covered by the generated `.gitignore`. The agent did not initialize Git or import prototype source/dependencies.
- Runtime **Node v24.22.2**, **pnpm 12.14.0** (pinned in `package.json`); generated Node engine range `^22.18.0 || >=24.12.0`. Registry `create-vue` latest was **3.24.0** when checked; the human did not supply the generator version banner, so the exact executed generator version is not independently recorded.
- Kept the generated blank `You did it!` page and both generated smoke tests. There was no new application behavior requiring a red/green implementation slice. Configured headless Chromium, pnpm web-server commands, and separate strict loopback test ports **5175** (dev) / **4175** (preview), with no existing-server reuse. Extended typechecking to include browser tests.

## Verification

| Command | Actual outcome |
| --- | --- |
| `pnpm install` | Installed 381 packages and created `pnpm-lock.yaml`; no prototype dependency tree used. |
| `pnpm install --frozen-lockfile` | Passed; lockfile up to date. |
| `pnpm exec playwright install chromium` | Passed; Chromium available. |
| `pnpm test:unit --run src/__tests__/App.spec.ts` | Passed, 1 mounted-starter test. |
| `pnpm test:e2e e2e/vue.spec.ts` | Passed, 1 Chromium test against an automatically started local Vite dev server. |
| `pnpm type-check` | Passed for app, Node configs, unit tests, and E2E test sources. |
| `pnpm build` | Passed typecheck and production build; 22 modules transformed, generated HTML and JS. |
| `CI=1 pnpm test:e2e e2e/vue.spec.ts` | Passed, 1 Chromium test against the production preview. |
| `pnpm exec oxlint .` and `pnpm exec eslint .` | Passed without fixes. |
| `pnpm exec prettier --check src/ playwright.config.ts package.json README.md` | Passed. |
| `pnpm audit --prod` | No known vulnerabilities found. |
| `pnpm audit` | **2 moderate vulnerabilities**, development-only, unresolved below. |
| `pnpm outdated` | Exit 1, newer versions available; details below. |

Initial browser smoke test failed because the scaffold's existing-server reuse reached an unrelated application already listening on port 5173 (`Overview` rather than `You did it!`). Confirmed via listening-process and HTTP inspection. Fixed by using dedicated strict ports and disabling reuse, without stopping the unrelated server or weakening the test. The same smoke test then passed against dev and preview.

### Dependency/security findings and remaining issues

Resolved core versions: Vue **3.5.45**, Vue Router **5.5.1**, Vite **8.3.8**, TypeScript **6.0.3**, Vitest **4.1.12**, Playwright **1.65.1**, Vue Test Utils **2.6.0**. The lockfile is the complete version record.

Full audit reports:

- [`GHSA-3g3m-2fjr-6pw4`](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4): `glob` **13.0.7**, via `@vue/test-utils > js-beautify`; cancellation bypass permits post-timeout filesystem traversal. Patched in **14.0.2+**.
- [`GHSA-g3hv-75wg-m249`](https://github.com/advisories/GHSA-g3hv-75wg-m249): `minimatch` **10.2.6**, via `@vue/test-utils > js-beautify > glob` and `editorconfig`; potential denial of service via globparts amplification. Patched in **11.0.1+**.

These are development test-tooling dependencies, not production dependencies. Latest `@vue/test-utils` **2.6.0** and `js-beautify` **2.0.3** still declare these dependency major ranges. No major-version override or audit suppression was applied; follow upstream compatible fixes and rerun the audit. This starter is **not** claimed to have a clean full audit.

`pnpm outdated` reported: eslint-plugin-oxlint/oxlint **1.82.0 → 1.94.0**, eslint-plugin-vue **10.11.1 → 10.12.1**, Prettier **3.9.6 → 3.10.1**, @types/node **24.19.2 → 26.6.6**, jsdom **30.1.3 → 31.0.1**, TypeScript **6.0.3 → 7.0.2**, Vitest **4.1.12 → 5.1.0**. Retained the official generator's constraints rather than changing toolchain majors or Node typings beyond the verified runtime. pnpm also advertised **12.21.0**; this repository pins the actually verified **12.14.0**.

The user-selected blank Router setup has no routes and emits a development warning for `/`; the starter renders and both browser checks pass. Route behavior is deferred to feature work, not implemented speculatively here.

Full-suite final run: `pnpm test:unit --run` passed (1 test); `pnpm test:e2e` and `CI=1 pnpm test:e2e` each passed (1 Chromium test). Typechecking, build, lint, and the formatting check above also passed in that run.

No remote creation, pushing, deployment, design-token implementation, or lesson implementation occurred. Ticket 02 may proceed; its explicit human visual-approval gate still blocks lesson work.
