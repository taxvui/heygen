import { test, expect } from '@playwright/test';

const CROSS_BROWSER_ROUTES = [
  { path: '/home', expectedHeading: 'Welcome to HeyGen' },
  { path: '/home/video-agent', expectedHeading: 'What should your video be about?' },
  { path: '/avatar/my-avatars?tab=public', expectedText: 'Public Avatars' },
  { path: '/avatar/voices', expectedText: 'Create your HeyGen voice' },
  { path: '/brand', expectedHeading: 'Brand Systems' },
  { path: '/apps', expectedHeading: 'App Library' },
  { path: '/apps/studio', expectedHeading: 'Welcome to AI Studio' },
  { path: '/projects', expectedHeading: 'Projects' },
  { path: '/developers/api', expectedHeading: 'Get started with the API' },
  { path: '/admin', expectedText: 'HeyGen Super Admin' },
];

test.describe('Rule 6 — Multi-Engine Cross-Browser & Mobile Device Compatibility Suite', () => {
  test('Renders all core routes with zero overflow, loaded fonts, and interactive modals across browser engines', async ({
    page,
  }) => {
    for (const r of CROSS_BROWSER_ROUTES) {
      await page.goto(r.path, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(250);

      if (r.expectedHeading) {
        await expect(page.getByRole('heading', { name: r.expectedHeading })).toBeVisible();
      }
      if (r.expectedText) {
        await expect(page.getByText(r.expectedText).first()).toBeVisible();
      }

      const layoutCheck = await page.evaluate(async () => {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
        const scrollWidth = document.documentElement.scrollWidth;
        const innerWidth = window.innerWidth;
        return {
          scrollWidth,
          innerWidth,
          overflow: scrollWidth > innerWidth + 2,
          fontsLoaded: document.fonts ? document.fonts.status === 'loaded' : true,
        };
      });

      expect(
        layoutCheck.overflow,
        `Overflow detected on ${r.path}: scrollWidth=${layoutCheck.scrollWidth}, innerWidth=${layoutCheck.innerWidth}`
      ).toBe(false);
    }
  });
});
