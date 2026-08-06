import { test, expect } from '@playwright/test';

const PAGES = [
  ['home', '/docs/'],
  ['about me', '/docs/about-me/'],
  ['Python generators notebook', '/docs/notebooks/coding/python-generators/'],
];

test.describe('SEO foundations', () => {
  for (const [name, url] of PAGES) {
    test(`${name} exposes shareable metadata and structured data`, async ({ page }) => {
      await page.goto(url);

      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S+/);
      await expect(page.locator('script[type="application/ld+json"]')).not.toHaveCount(0);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\S+/);
      await expect(page.locator('meta[property="twitter:image"]')).toHaveAttribute('content', /\S+/);
    });
  }

  test('robots.txt and llms.txt are publicly available', async ({ request }) => {
    for (const path of ['/docs/robots.txt', '/docs/llms.txt']) {
      const response = await request.get(path);

      expect(response.status(), `${path} should return HTTP 200`).toBe(200);
      expect(await response.text(), `${path} should not be empty`).toMatch(/\S+/);
    }
  });

  test('loads the GA4 tag or exposes its Material analytics marker', async ({ page }) => {
    await page.goto('/');

    const hasGa4Tag = await page.locator(
      'script[src*="googletagmanager.com/gtag/js"], #__analytics',
    ).count();

    expect(hasGa4Tag).toBeGreaterThan(0);
  });
});
