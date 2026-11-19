# vibe-website

Production starter for the Git visual learning website, scaffolded interactively with official create-vue in the repository root. Uses Vue, TypeScript, Vite, and the user-selected Router, Vitest, Playwright, ESLint/Oxlint, and Prettier. Experimental features and example code were not selected.

Use Node `^22.18.0 || >=24.12.0` (verified on **24.22.2**) and **pnpm 12.14.0**, pinned in `package.json`. Commit `pnpm-lock.yaml` to keep installs reproducible. Existing planning documents stay in `.scratch/`; the disposable prototype is not the production source.

This ticket adds no lessons, design tokens, or Tailwind integration; shared visual foundations are the next ticket. See [scaffolding verification and dependency findings](.scratch/git-visual-guide-foundation/issues/01-scaffold-vue-with-human-controlled-setup.md#verification).

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
```

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
# Runs the starter smoke test only
pnpm test:e2e e2e/vue.spec.ts
# Opens the browser for debugging
pnpm test:e2e --headed
pnpm test:e2e --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
