import type { PlaywrightTestConfig } from '@playwright/test'
import { devices } from '@playwright/test'

const PORT = +process.env.PORT || 3000
const SERVER = `http://127.0.0.1:${PORT}`

const config: PlaywrightTestConfig = {
  timeout: 15 * 1000,
  expect: {
    timeout: 5000
  },
  globalSetup: './scripts/e2e/setup.mjs',
  globalTeardown: './scripts/e2e/teardown.mjs',
  snapshotPathTemplate: './packages/shiki/src/__tests__/__screenshots__{/projectName}/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html']] : 'html',
  use: {
    baseURL: SERVER,
    trace: 'on-first-retry',
    headless: true
  },
  projects: [
    {
      name: 'shiki-browser',
      testMatch: /packages\/shiki\/src\/__tests__\/e2e.browser.spec.ts/,
      use: {
        ...devices['Desktop Chrome']
      }
    },
    {
      name: 'shiki-cdn',
      testMatch: /packages\/shiki\/src\/__tests__\/e2e.cdn.spec.ts/,
      use: {
        ...devices['Desktop Chrome']
      }
    }
  ]
}

export default config
