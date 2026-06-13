import { test, expect } from '@playwright/test';

test.describe('Home gallery', () => {
  test('renders gallery items on the homepage', async ({ page }) => {
    await page.goto('/');
    const items = page.locator('.gallery-home-item');
    await expect(items.first()).toBeVisible();
    expect(await items.count()).toBeGreaterThan(0);
  });

  test('filtering by Projects shows only project items', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.gallery-home-item').first()).toBeVisible();

    await page.locator('nav.filter-menu button.filter-btn', { hasText: 'Projects' }).click();

    const visibleItems = page.locator('.gallery-home-item');
    await expect(visibleItems.first()).toBeVisible();
    const count = await visibleItems.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(visibleItems.nth(i)).toHaveAttribute('data-category', 'projects');
    }
  });

  test('scrolling loads more items via lazy loading', async ({ page }) => {
    await page.goto('/');
    const items = page.locator('.gallery-home-item');
    await expect(items.first()).toBeVisible();
    const initialCount = await items.count();

    let currentCount = initialCount;
    for (let i = 0; i < 6 && currentCount <= initialCount; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      currentCount = await items.count();
    }

    expect(currentCount).toBeGreaterThan(initialCount);
  });
});
