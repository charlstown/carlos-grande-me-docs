import { test, expect } from '@playwright/test';

// Pilot bilingual post: English version lives at the root URL, Spanish under /es/.
const EN_URL = '/resources/cheatsheets/my-8-levels-of-ai-development/';
// English-only post: no alternate translation, so it must not expose a toggle.
const EN_ONLY_URL = '/projects/app-pickasa/';

const STORAGE_KEY = 'preferred-lang';

test('the language toggle is visible on the bilingual pilot post', async ({ page }) => {
  await page.goto(EN_URL);

  const toggle = page.locator('.md-lang-toggle');
  await expect(toggle).toBeAttached();
});

test('clicking the toggle navigates to the ES URL and persists the preference', async ({ page }) => {
  await page.goto(EN_URL);

  const toggle = page.locator('.md-lang-toggle');
  await expect(toggle).toBeAttached();

  await toggle.click();

  // The click handler calls location.assign(esUrl); the ES version lives under /es/.
  await expect(page).toHaveURL(/\/es\//);

  // The choice is persisted globally so other pages can honor it.
  const stored = await page.evaluate(
    key => localStorage.getItem(key),
    STORAGE_KEY,
  );
  expect(stored).toBe('es');
});

test('a stored ES preference redirects the EN pilot URL to the ES version', async ({ page }) => {
  // applyLanguageRedirect skips automated agents (navigator.webdriver === true),
  // which Playwright sets by default. Override it before any page script runs so
  // the default-language redirect path is exercised like a real visitor.
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', {
      configurable: true,
      get: () => false,
    });
  });

  // Seed the stored preference before navigating so the redirect reads it on load.
  await page.addInitScript(
    ([key, value]) => {
      try {
        localStorage.setItem(key, value);
      } catch {
        // Ignore: storage may be unavailable; the assertion below will surface it.
      }
    },
    [STORAGE_KEY, 'es'],
  );

  await page.goto(EN_URL);

  // applyLanguageRedirect uses location.replace(esUrl) to land on the ES version.
  await expect(page).toHaveURL(/\/es\//);
});

test('an English-only post does not render a language toggle', async ({ page }) => {
  await page.goto(EN_ONLY_URL);

  await expect(page.locator('.md-lang-toggle')).toHaveCount(0);
});
