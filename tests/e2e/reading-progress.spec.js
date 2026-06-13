import { test, expect } from '@playwright/test';

test('reading progress bar fills as the post is scrolled', async ({ page }) => {
  await page.goto('/projects/app-pickasa/');

  const bar = page.locator('.reading-progress');
  await expect(bar).toBeAttached();

  // The bar is inserted as the first child of <body>.
  const parentTag = await bar.evaluate(el => el.parentElement.tagName);
  expect(parentTag).toBe('BODY');

  const fill = page.locator('.reading-progress__fill');
  const initialWidth = await fill.evaluate(el => parseFloat(el.style.width) || 0);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);

  const scrolledWidth = await fill.evaluate(el => parseFloat(el.style.width) || 0);
  expect(scrolledWidth).toBeGreaterThan(initialWidth);
});
