import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];

test.describe('HeyGen Platform Reconstruction — E2E & Multi-Viewport Visual Validation', () => {
  for (const vp of VIEWPORTS) {
    test(`Renders /home accurately at viewport ${vp.width}x${vp.height}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.goto('/home');
      // Verify zero invented bottom navigation bar at all viewports
      await expect(page.locator('nav[aria-label="Mobile bottom navigation"]')).toHaveCount(0);

      if (vp.width <= 479) {
        await expect(page.getByRole('button', { name: 'Toggle navigation' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Create Avatar' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Create Video' })).toBeVisible();
        await expect(page.getByText('Video Prompts')).toBeVisible();
      } else {
        await expect(page.getByRole('heading', { name: 'Welcome to HeyGen' })).toBeVisible();
        await expect(page.getByText(/Finish your account setup/i)).toBeVisible();
        await expect(page.getByText('Video Prompts')).toBeVisible();
      }
    });
  }

  test('Navigates all major routes and verifies Super Admin Dashboard', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Welcome to HeyGen' })).toBeVisible();

    await page.goto('/avatar/my-avatars?tab=public');
    await expect(page.getByText('Public Avatars')).toBeVisible();
    await expect(page.getByText('Annie')).toBeVisible();

    await page.goto('/avatar/voices');
    await expect(page.getByText('Create your HeyGen voice')).toBeVisible();
    await expect(page.getByText('Annie - Lifelike')).toBeVisible();

    await page.goto('/apps');
    await expect(page.getByRole('heading', { name: 'App Library' })).toBeVisible();
    await expect(page.getByText('Prompt to Video')).toBeVisible();

    await page.goto('/apps/studio');
    await expect(page.getByRole('heading', { name: 'Welcome to AI Studio' })).toBeVisible();

    await page.goto('/home/translate');
    await expect(
      page.getByRole('heading', { name: 'Translate your videos in 175+ languages' })
    ).toBeVisible();

    await page.goto('/admin');
    await expect(page.getByText('HeyGen Super Admin')).toBeVisible();
    await expect(page.getByText('Total Users')).toBeVisible();
  });
});
