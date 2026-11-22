# Git Illustrated Lessons

Git Illustrated Lessons is an interactive visual guide to Git, with step-by-step lessons that show what Git commands do.

## Tech stack

Vue 3, Vue Router, TypeScript, Vite, and Tailwind CSS.

## Local development

Use Node.js 22.18 or later in the 22.x series, or Node.js 24.12 or later. Install pnpm 12.14.0.

```sh
pnpm install
pnpm hooks:install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) by default. If Vite uses a different port, open the URL it prints. `pnpm hooks:install` enables this checkout's pre-commit hook. Run `pnpm check` to check formatting, lint, types, and unit tests.

### Type-check the application and tests

`pnpm type-check` checks the application, configuration, unit tests, and browser tests.

### Unit tests with Vitest

```sh
pnpm test:unit --run # Run once
pnpm test:unit       # Watch for changes
```

### End-to-end tests with Playwright

```sh
pnpm exec playwright install chromium # First run
pnpm test:e2e                         # Run against the development server
pnpm test:e2e e2e/lesson.spec.ts      # Run only the lesson tests
pnpm test:e2e --headed               # Show the browser
pnpm test:e2e --debug                # Open the Playwright Inspector
```

To test the production build instead:

```sh
pnpm build
CI=1 pnpm test:e2e
```

### Lint

Run `pnpm lint` to lint and apply fixes with Oxlint and ESLint. Run `pnpm lint:check` to lint without changing files.

## Deployment

Build and preview the production site locally:

```sh
pnpm build
pnpm preview
```

Publish `dist/` to a static host. Configure the host to serve `index.html` for lesson URLs that don't match a static file. After deploying, open `/start-a-repository/2` directly and refresh the page to verify that the lesson loads both times.
