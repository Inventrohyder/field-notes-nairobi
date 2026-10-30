import { defineConfig, devices } from '@playwright/test';

const local = !process.env.CI;
const PORT = 4321;

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}/field-notes-nairobi/`,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    launchOptions: local ? { executablePath: '/opt/google/chrome/chrome' } : {},
  },
  projects: [
    {
      name: 'phone',
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, hasTouch: true },
    },
    {
      name: 'laptop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
  ],
  webServer: {
    command: `npx astro preview --port ${PORT}`,
    url: `http://localhost:${PORT}/field-notes-nairobi/report-followup/`,
    reuseExistingServer: local,
    timeout: 120_000,
  },
});
