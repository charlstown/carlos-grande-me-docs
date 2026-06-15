import { test, expect } from '@playwright/test';

// Pilot bilingual post: English at the root URL, Spanish under /es/.
const EN_URL = '/resources/cheatsheets/my-8-levels-of-ai-development/';
const ES_URL = '/es/resources/cheatsheets/my-8-levels-of-ai-development/';

// A post WITHOUT a Spanish translation. The i18n plugin still serves an English
// fallback under /es/, and the toggle is still shown.
const UNTRANSLATED_URL = '/resources/cheatsheets/my-branch-model-cheatsheet/';

const HOME_URL = '/';
const ES_HOME_URL = '/es/';
const PILOT_POST_ID = 'my-8-levels-of-ai-development';

// The language toggle: a single header anchor (icon + target-language label)
// that links straight to the other language — no dropdown.
const TOGGLE = 'header.md-header .md-lang-toggle';

// ---------------------------------------------------------------------------
// 1. The toggle is a single button present on every page (always visible).
// ---------------------------------------------------------------------------

for (const [name, url] of [
  ['home', HOME_URL],
  ['translated EN post', EN_URL],
  ['untranslated post', UNTRANSLATED_URL],
]) {
  test(`language toggle is present (single button) on the ${name}`, async ({ page }) => {
    await page.goto(url);
    await expect(page.locator(TOGGLE)).toHaveCount(1);
    // No native dropdown remains.
    await expect(page.locator('.md-select__link')).toHaveCount(0);
  });
}

// ---------------------------------------------------------------------------
// 2. On an EN page the toggle targets ES; on an ES page it targets EN.
// ---------------------------------------------------------------------------

test('toggle on an EN page shows the ES label and links to the /es/ version', async ({ page }) => {
  await page.goto(EN_URL);

  const toggle = page.locator(TOGGLE);
  await expect(toggle.locator('.md-lang-toggle__label')).toHaveText('ES');
  await expect(toggle).toHaveAttribute('href', /\/es\//);
});

test('toggle on an ES page shows the EN label and links back to the root version', async ({ page }) => {
  await page.goto(ES_URL);

  const toggle = page.locator(TOGGLE);
  await expect(toggle.locator('.md-lang-toggle__label')).toHaveText('EN');
  const href = await toggle.getAttribute('href');
  expect(href).not.toContain('/es/');
});

// ---------------------------------------------------------------------------
// 3. Clicking the toggle navigates to the other language.
// ---------------------------------------------------------------------------

test('clicking the toggle on the EN post navigates to the ES version', async ({ page }) => {
  await page.goto(EN_URL);
  await page.locator(TOGGLE).click();
  await expect(page).toHaveURL(/\/es\/resources\/cheatsheets\/my-8-levels-of-ai-development\//);
});

test('clicking the toggle on the home navigates to the /es/ home', async ({ page }) => {
  await page.goto(HOME_URL);
  await page.locator(TOGGLE).click();
  await expect(page).toHaveURL(new RegExp(`${ES_HOME_URL}$`));
});

// ---------------------------------------------------------------------------
// 4. Both homes show all articles; the /es/ gallery thumbnails are not broken.
// ---------------------------------------------------------------------------

for (const [name, url] of [
  ['default', HOME_URL],
  ['/es/', ES_HOME_URL],
]) {
  test(`the ${name} home gallery renders all articles with working thumbnails`, async ({ page }) => {
    await page.goto(url);

    const gallery = page.locator('#gallery-home');
    await expect(gallery.locator('.gallery-home-item')).not.toHaveCount(0);

    // Every thumbnail must actually load (naturalWidth > 0), which fails when
    // the src resolves to a 404 (the previous /es/ bug).
    await expect.poll(async () => {
      return page.locator('#gallery-home img').evaluateAll(
        imgs => imgs.length > 0 && imgs.every(im => im.complete && im.naturalWidth > 0),
      );
    }).toBe(true);
  });
}

// ---------------------------------------------------------------------------
// 5. Gallery deduplication: the pilot post appears exactly once.
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
