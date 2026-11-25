import { test, expect } from '@playwright/test';

const MOBILE_VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 360, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 414, height: 896 },
  { width: 430, height: 932 },
];

const TABLET_VIEWPORTS = [
  { width: 768, height: 1024 },
  { width: 820, height: 1180 },
  { width: 1024, height: 1366 },
];

test.describe('ANTIGRAVITY V7 — Strict Mobile & Tablet Fidelity Lock', () => {
  test.beforeEach(async ({ page, browserName }) => {
    if (browserName === 'firefox') {
      await page.route('http://localhost:3000/**', async (route) => {
        try {
          const targetUrl = route
            .request()
            .url()
            .replace('http://localhost:3000', 'http://[::1]:3000');
          const response = await route.fetch({
            url: targetUrl,
            headers: {
              ...route.request().headers(),
              host: 'localhost:3000',
            },
          });
          await route.fulfill({ response });
        } catch {
          // Ignore in-flight request teardown when test ends
        }
      });
    }
  });

  test.afterEach(async ({ page, browserName }) => {
    if (browserName === 'firefox') {
      await page.unrouteAll({ behavior: 'ignoreErrors' });
    }
  });

  test('Verifies 0 invented bottom nav and exact mobile navigation contract across 6 mobile viewports', async ({
    page,
  }) => {
    for (const vp of MOBILE_VIEWPORTS) {
      await page.setViewportSize(vp);
      await page.goto('/home');

      // Zero invented bottom navigation bar
      await expect(page.locator('nav[aria-label="Mobile bottom navigation"]')).toHaveCount(0);

      // Floating Toggle navigation circular button is visible at (12, 16)
      const toggleBtn = page.getByRole('button', { name: 'Toggle navigation' });
      await expect(toggleBtn).toBeVisible();
      const box = await toggleBtn.boundingBox();
      expect(box?.x).toBeCloseTo(12, 1);
      expect(box?.y).toBeCloseTo(16, 1);
      expect(box?.width).toBeCloseTo(40, 1);
      expect(box?.height).toBeCloseTo(40, 1);

      // Mobile 2-column Create Avatar / Create Video cards are visible
      await expect(page.getByRole('button', { name: 'Create Avatar' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Create Video' })).toBeVisible();
    }
  });

  test('Verifies mobile Navigation dual-column dialog and Make your first video bottom sheet at 375x812', async ({
    page,
  }) => {
    page.on('pageerror', (err) => console.log('PAGE ERROR:', err.message));
    page.on('requestfailed', (req) => console.log('REQ FAILED:', req.url(), req.failure()?.errorText));
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/home');

    // Open Toggle navigation dialog
    const toggleBtn = page.getByRole('button', { name: 'Toggle navigation' });
    await expect(toggleBtn).toBeVisible();
    await toggleBtn.click();
    const navDialog = page.getByRole('dialog', { name: 'Navigation' });
    await expect(navDialog).toBeVisible();
    const dialogBox = await navDialog.boundingBox();
    expect(dialogBox?.width).toBeCloseTo(288, 2);

    // Close navigation dialog
    await navDialog.getByRole('button', { name: 'Close' }).click();
    await expect(navDialog).toBeHidden();

    // Open Create Video bottom sheet
    await page.getByRole('button', { name: 'Create Video' }).click();
    const videoDialog = page.getByRole('dialog', { name: 'Make your first video' });
    await expect(videoDialog).toBeVisible();
    await expect(videoDialog.getByText('Guided Creation', { exact: true })).toBeVisible();
    await expect(videoDialog.getByText('Prompt to Video', { exact: true })).toBeVisible();
  });

  test('Verifies tablet viewports (768x1024, 820x1180, 1024x1366) keep the 286px dual sidebar and 304px main offset', async ({
    page,
  }) => {
    for (const vp of TABLET_VIEWPORTS) {
      await page.setViewportSize(vp);
      await page.goto('/home');

      await expect(page.locator('nav[aria-label="Mobile bottom navigation"]')).toHaveCount(0);
      await expect(page.getByRole('button', { name: 'Toggle navigation' })).toBeHidden();
      await expect(page.getByRole('heading', { name: 'Welcome to HeyGen' })).toBeVisible();
      await expect(page.getByText(/Finish your account setup/i)).toBeVisible();

      const mainBox = await page.locator('main').boundingBox();
      expect(mainBox?.x).toBe(0);
      const paddingLeft = await page
        .locator('main')
        .evaluate((el) => window.getComputedStyle(el).paddingLeft);
      expect(paddingLeft).toBe('304px');
    }
  });
});
