import { test, expect } from '@playwright/test';

// Pilot bilingual post: English at the root URL, Spanish under /es/.
const EN_URL = '/resources/cheatsheets/my-8-levels-of-ai-development/';

// A post WITHOUT a Spanish translation. The i18n plugin still serves an English
// fallback under /es/, and the native selector is still shown.
const UNTRANSLATED_URL = '/resources/cheatsheets/my-branch-model-cheatsheet/';

const HOME_URL = '/';
const ES_HOME_URL = '/es/';
const PILOT_POST_ID = 'my-8-levels-of-ai-development';

// The native mkdocs-static-i18n / Material language selector renders as a
// dropdown of links inside the header.
const SELECTOR_LINKS = 'header.md-header .md-header__option .md-select__link';

// ---------------------------------------------------------------------------
// 1. The native language selector is present on every page (always visible).
// ---------------------------------------------------------------------------

for (const [name, url] of [
  ['home', HOME_URL],
  ['translated EN post', EN_URL],
  ['untranslated post', UNTRANSLATED_URL],
]) {
  test(`native language selector is present on the ${name}`, async ({ page }) => {
    await page.goto(url);

    const links = page.locator(SELECTOR_LINKS);
    // One link per language (English + Español).
    await expect(links).toHaveCount(2);
    await expect(links.filter({ hasText: 'English' })).toHaveCount(1);
    await expect(links.filter({ hasText: 'Español' })).toHaveCount(1);
  });
}

// ---------------------------------------------------------------------------
// 2. Selecting Español from the home navigates to the /es/ home.
// ---------------------------------------------------------------------------

test('selecting Español from the home navigates to the /es/ home', async ({ page }) => {
  await page.goto(HOME_URL);

  // The dropdown is a CSS hover menu; the link is in the DOM, follow its href.
  const esHref = await page
    .locator(SELECTOR_LINKS)
    .filter({ hasText: 'Español' })
    .getAttribute('href');

  await page.goto(esHref);

  await expect(page).toHaveURL(new RegExp(`${ES_HOME_URL}$`));
});

// ---------------------------------------------------------------------------
// 3. Both homes show all articles; the /es/ gallery thumbnails are not broken.
// ---------------------------------------------------------------------------

for (const [name, url] of [
  ['default', HOME_URL],
  ['/es/', ES_HOME_URL],
]) {
  test(`the ${name} home gallery renders all articles with working thumbnails`, async ({ page }) => {
    await page.goto(url);

    const gallery = page.locator('#gallery-home');
    const items = gallery.locator('.gallery-home-item');
    await expect(items).not.toHaveCount(0);

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
// 4. Gallery deduplication: the pilot post appears exactly once.
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
