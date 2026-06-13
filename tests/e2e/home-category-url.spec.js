import { test, expect } from '@playwright/test';

// Locate a filter button by its visible label. Buttons live in
// `nav.filter-menu button.filter-btn` and carry a trailing count <sup>,
// so `hasText` (substring match) is the reliable selector, matching the
// convention already used in gallery.spec.js.
const filterButton = (page, label) =>
  page.locator('nav.filter-menu button.filter-btn', { hasText: label });

test.describe('Home category URL sync', () => {
  test('clicking Articles updates the URL to ?category=articles without reload', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.gallery-home-item').first()).toBeVisible();

    // Tag the window so we can prove there was no full page reload.
    await page.evaluate(() => { window.__noReload = true; });

    await filterButton(page, 'Articles').click();

    await expect(page).toHaveURL(/category=articles/);
    // The marker survives only if the document was not reloaded.
    expect(await page.evaluate(() => window.__noReload)).toBe(true);
  });

  test('clicking All leaves the URL without a category param', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.gallery-home-item').first()).toBeVisible();

    // First move away from the clean state so resetting is meaningful.
    await filterButton(page, 'Projects').click();
    await expect(page).toHaveURL(/category=projects/);

    await filterButton(page, 'All').click();

    expect(page.url()).not.toContain('category=');
  });

  test('navigating to ?category=projects activates Projects and filters the gallery', async ({ page }) => {
    await page.goto('/?category=projects');
    await expect(page.locator('.gallery-home-item').first()).toBeVisible();

    // The Projects button must be the active one.
    await expect(filterButton(page, 'Projects')).toHaveClass(/active/);

    // Every rendered gallery item belongs to the projects category.
    const items = page.locator('.gallery-home-item');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(items.nth(i)).toHaveAttribute('data-category', 'projects');
    }
  });

  test('navigating to an unknown category falls back to All and keeps the gallery working', async ({ page }) => {
    await page.goto('/?category=does-not-exist');
    await expect(page.locator('.gallery-home-item').first()).toBeVisible();

    // Unknown slug resolves to the default "All" selection.
    await expect(filterButton(page, 'All')).toHaveClass(/active/);

    // Gallery is not broken: items are present and visible.
    const items = page.locator('.gallery-home-item');
    expect(await items.count()).toBeGreaterThan(0);
  });

  test('going back after filtering by Projects restores All and a clean URL', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.gallery-home-item').first()).toBeVisible();
    await expect(filterButton(page, 'All')).toHaveClass(/active/);

    await filterButton(page, 'Projects').click();
    await expect(page).toHaveURL(/category=projects/);
    await expect(filterButton(page, 'Projects')).toHaveClass(/active/);

    await page.goBack();

    await expect(filterButton(page, 'All')).toHaveClass(/active/);
    expect(page.url()).not.toContain('category=');
  });
});
