# vibe-website

An illustrated Git learning website built with Vue, TypeScript, Vite, and Tailwind CSS. The first lesson, **Start a repository**, shows what happens when Alice runs `git init`. Run `pnpm dev` and open the URL Vite prints to play it.

Use Node `^22.18.0 || >=24.12.0` (verified on **24.22.2**) and **pnpm 12.14.0**, pinned in `package.json`. Commit `pnpm-lock.yaml` to keep installs reproducible. Existing planning documents stay in `.scratch/`; the disposable prototype is not the production source.

The lesson player uses browser hash locations. Shared design tokens live in `src/styles/main.css`. See [scaffolding and dependency findings](.scratch/git-visual-guide-foundation/issues/01-scaffold-vue-with-human-controlled-setup.md#verification).

## Development design showcase

Run `pnpm dev` and open **http://localhost:5173/__design/** (use the port Vite prints if 5173 is occupied). This is a separate development-server entry, not a production route. Use Tab and hover to inspect control states. The shared tokens, control/code treatments, and font declarations live in `src/styles/main.css`; the samples live in `src/dev/` and are not imported by the production app.

JetBrains Mono regular and bold are self-hosted, unmodified upstream WOFF2 files from [JetBrains/JetBrainsMono](https://github.com/JetBrains/JetBrainsMono/tree/master/fonts/webfonts). Their SIL Open Font License and copyright are retained in `public/fonts/OFL.txt` and shipped at `/fonts/OFL.txt`. No external font host is used.

For quick iteration: `pnpm type-check` and `pnpm test:unit --run src/__tests__/DesignShowcase.spec.ts`. After a build, `pnpm test:production` checks the shipped files without a browser. `pnpm test:e2e e2e/design.spec.ts` runs one development smoke test; `CI=1 pnpm test:e2e e2e/design.spec.ts` runs one production-preview smoke test (build first). In production preview, the showcase URL opens the lesson. `pnpm verify` runs the full checks once. The revised visual foundations have explicit human approval recorded in foundation ticket 02.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
pnpm hooks:install
```

### Local validation and commit hook

`pnpm hooks:install` sets this repository's local `core.hooksPath` to the tracked
`.githooks/` directory. Run it once per checkout; installation does not change global
Git configuration. No Husky or CI workflow is used. The hook requires Node and pnpm
on the committing process's `PATH`, including when committing from an editor.

```sh
# Fast, non-mutating source checks; also runs before each commit
pnpm check

# Full local verification before marking work complete
pnpm exec playwright install chromium # once per required browser version
pnpm verify
```

`check` runs lint without fixes, formatting checks for application/test sources,
root TypeScript/JSON/HTML configuration, VS Code recommendations, and this README,
then typechecking, Vitest in run mode, and Git whitespace checks for both unstaged
and staged tracked changes. Historical planning documents are outside the formatter
scope. Existing `pnpm lint` and `pnpm format` remain explicit fix commands; validation
does not rewrite or stage source files (tools may write ignored build/test caches).

`verify` runs `check`, the production build, a browser-free production-artifact check, and Chromium tests against dev and
production preview **sequentially**. Build/browser checks are deliberately outside
the commit hook to keep commits quick. The preview run sets `CI=1` locally to select
Playwright's production-preview mode; it does not require a CI service.

The hook checks the working tree, not an isolated staged snapshot. With partially
staged files, a passing hook does not prove the staged version passes independently.
Git hooks can be bypassed with `git -c core.hooksPath=/dev/null commit` for a deliberate
exception; record why and run validation afterward. To disable this setup, run
`git config --local --unset core.hooksPath` (restore any previous custom path if needed).

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Type-check application, configuration, unit tests, and browser tests

```sh
pnpm type-check
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit --run
# Watch during development
pnpm test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install Chromium for the first run
pnpm exec playwright install chromium

# When testing on CI, must build the project first
pnpm build

# Runs all configured browser tests (Chromium, headless)
# Starts the local dev server automatically
pnpm test:e2e
# Runs against the production preview instead (build first)
CI=1 pnpm test:e2e
# Runs only the lesson tests
pnpm test:e2e e2e/lesson.spec.ts
# Opens the browser for debugging
pnpm test:e2e --headed
pnpm test:e2e --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
