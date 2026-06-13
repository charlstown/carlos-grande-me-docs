import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  // A single mkdocs dev server backs every test; run serially so parallel
  // workers don't contend for it during the initial cold load.
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  timeout: 60000,
  use: {
    baseURL: 'http://127.0.0.1:8000',
    navigationTimeout: 30000,
    actionTimeout: 15000,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'mkdocs serve -a 127.0.0.1:8000',
    url: 'http://127.0.0.1:8000',
    reuseExistingServer: true,
    timeout: 120000,
  },
});
