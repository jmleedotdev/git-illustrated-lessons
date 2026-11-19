import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

// Exercise the dev server locally and the production preview on CI.
const port = process.env.CI ? 4175 : 5175

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 5000 },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: process.env.CI
      ? `pnpm preview --host 127.0.0.1 --port ${port} --strictPort`
      : `pnpm dev --host 127.0.0.1 --port ${port} --strictPort`,
    url: `http://127.0.0.1:${port}`,
    // Never accidentally test another project already listening on this port.
    reuseExistingServer: false,
  },
})
