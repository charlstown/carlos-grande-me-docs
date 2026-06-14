import { test, expect } from '@playwright/test';

// Pilot bilingual post: English at the root URL, Spanish under /es/.
const EN_URL = '/resources/cheatsheets/my-8-levels-of-ai-development/';
const ES_URL = '/es/resources/cheatsheets/my-8-levels-of-ai-development/';

// A post WITHOUT a Spanish translation. The i18n plugin still builds an /es/
// fallback serving English content, but the toggle must not appear on it.
const UNTRANSLATED_URL = '/resources/cheatsheets/my-branch-model-cheatsheet/';

const HOME_URL = '/';
const PILOT_POST_ID = 'my-8-levels-of-ai-development';

// ---------------------------------------------------------------------------
// 1. The language link appears ONLY on posts with a real translation.
// ---------------------------------------------------------------------------

test('translated EN post shows the language link pointing to the ES version', async ({ page }) => {
  await page.goto(EN_URL);

  const toggle = page.locator('header.md-header .md-lang-toggle');
  await expect(toggle).toBeAttached();

  // The link points at the Spanish version of the same post.
  await expect(toggle).toHaveAttribute('href', /\/es\/resources\/cheatsheets\/my-8-levels-of-ai-development\//);
});

test('translated ES post shows the language link pointing back to the EN version', async ({ page }) => {
  await page.goto(ES_URL);

  const toggle = page.locator('header.md-header .md-lang-toggle');
  await expect(toggle).toBeAttached();

  // The link points back at the English version, without an /es/ prefix.
  const href = await toggle.getAttribute('href');
  expect(href).toContain('/resources/cheatsheets/my-8-levels-of-ai-development/');
  expect(href).not.toContain('/es/');
});

test('untranslated post does NOT show the language link', async ({ page }) => {
  await page.goto(UNTRANSLATED_URL);

  // The guard hides the toggle on fallback pages without a real translation.
  await expect(page.locator('.md-lang-toggle')).toHaveCount(0);
});

test('home page does NOT show the language link', async ({ page }) => {
  await page.goto(HOME_URL);

  await expect(page.locator('.md-lang-toggle')).toHaveCount(0);
});

// ---------------------------------------------------------------------------
// 2. Clicking the link navigates between the two language versions.
// ---------------------------------------------------------------------------

test('clicking the link on the EN post navigates to the ES version', async ({ page }) => {
  await page.goto(EN_URL);

  await page.locator('.md-lang-toggle').click();

  await expect(page).toHaveURL(/\/es\/resources\/cheatsheets\/my-8-levels-of-ai-development\//);
});

// ---------------------------------------------------------------------------
// 3. The logo always links to the site root '/', never the /es/ home.
// ---------------------------------------------------------------------------

test('logo on an ES post links to the site root, not the /es/ home', async ({ page }) => {
  await page.goto(ES_URL);

  // Click the header logo and assert we land on the canonical root home.
  await page.locator('header.md-header a.md-logo').click();

  await expect(page).toHaveURL(new RegExp(`^https?://[^/]+${HOME_URL}$`));
});

// ---------------------------------------------------------------------------
// 4. Gallery deduplication: the home gallery renders the pilot post exactly
//    once — no duplicate card for the ES translation.
// ---------------------------------------------------------------------------

test('home gallery shows the pilot post exactly once (no ES duplicate)', async ({ page }) => {
  await page.goto(HOME_URL);

  const gallery = page.locator('#gallery-home');
  await expect(gallery.locator('.gallery-home-item')).not.toHaveCount(0);

  const hrefs = await gallery.locator('a[href]').evaluateAll(
    (anchors, id) => anchors
      .map(a => a.getAttribute('href') || '')
      .filter(href => href.includes(id)),
    PILOT_POST_ID,
  );

  expect(hrefs).toHaveLength(1);
});
