import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 180000,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: { browserName: 'chromium', viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'firefox-desktop',
      testMatch: /cross-browser\.spec\.ts|mobile-v7\.spec\.ts/,
      use: {
        browserName: 'firefox',
        baseURL: 'http://localhost:3000',
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'webkit-safari-desktop',
      testMatch: /cross-browser\.spec\.ts|mobile-v7\.spec\.ts/,
      use: { browserName: 'webkit', viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile-chrome-android',
      testMatch: /cross-browser\.spec\.ts|mobile-v7\.spec\.ts/,
      use: {
        ...devices['Pixel 7'],
        browserName: 'chromium',
      },
    },
    {
      name: 'mobile-safari-ios',
      testMatch: /cross-browser\.spec\.ts|mobile-v7\.spec\.ts/,
      use: {
        ...devices['iPhone 14'],
        browserName: 'webkit',
      },
    },
  ],
});
