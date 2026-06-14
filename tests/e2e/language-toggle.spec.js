import { test, expect } from '@playwright/test';

// Pilot bilingual post: English version lives at the root URL, Spanish under /es/.
const EN_URL = '/resources/cheatsheets/my-8-levels-of-ai-development/';
const ES_URL = '/es/resources/cheatsheets/my-8-levels-of-ai-development/';

// Home page URL.
const HOME_URL = '/';

// The pilot post id used to verify gallery deduplication.
const PILOT_POST_ID = 'my-8-levels-of-ai-development';

const STORAGE_KEY = 'preferred-lang';

// ---------------------------------------------------------------------------
// 1. Toggle button is present in the header on relevant pages
// ---------------------------------------------------------------------------

test('toggle button is in the header on the home page', async ({ page }) => {
  await page.goto(HOME_URL);

  // The button must be attached inside the Material header element.
  const header = page.locator('header.md-header');
  const toggle = header.locator('.md-lang-toggle');
  await expect(toggle).toBeAttached();
});

test('toggle button is in the header on the EN pilot post', async ({ page }) => {
  await page.goto(EN_URL);

  const header = page.locator('header.md-header');
  const toggle = header.locator('.md-lang-toggle');
  await expect(toggle).toBeAttached();
});

test('toggle button is in the header on the ES pilot post', async ({ page }) => {
  await page.goto(ES_URL);

  const header = page.locator('header.md-header');
  const toggle = header.locator('.md-lang-toggle');
  await expect(toggle).toBeAttached();
});

// ---------------------------------------------------------------------------
// 2. Clicking the toggle on the EN post navigates to /es/... and persists
//    the preferred-lang preference in localStorage.
// ---------------------------------------------------------------------------

test('clicking the toggle on the EN post navigates to the ES URL and persists the preference', async ({ page }) => {
  await page.goto(EN_URL);

  const toggle = page.locator('.md-lang-toggle');
  await expect(toggle).toBeAttached();

  await toggle.click();

  // The click handler calls location.assign(esUrl); the ES version lives under /es/.
  await expect(page).toHaveURL(/\/es\//);

  // The choice must be persisted globally so other pages can honour it.
  const stored = await page.evaluate(
    key => localStorage.getItem(key),
    STORAGE_KEY,
  );
  expect(stored).toBe('es');
});

// ---------------------------------------------------------------------------
// 3. Site-wide redirect: with preferred-lang='es' seeded, opening the EN
//    pilot URL redirects to the ES version.
//
//    Strategy: LanguageRedirect.js skips automated agents by checking
//    `navigator.webdriver === true`, which Playwright sets by default.
//    Override it with addInitScript (runs before any page script) so the
//    redirect path executes as it would for a real visitor.
// ---------------------------------------------------------------------------

test('a stored ES preference redirects the EN pilot URL to the ES version', async ({ page }) => {
  // applyLanguageRedirect bails out when navigator.webdriver is true (crawler
  // guard). Override it before any page script runs so the real redirect path
  // is exercised the way a human visitor would experience it.
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

// ---------------------------------------------------------------------------
// 4. Home does NOT redirect: with preferred-lang='es' seeded, opening the
//    home page must stay at '/' and continue showing all posts.
//
//    LanguageRedirect.js exits early when data-is-home='true', so the home
//    page is never redirected regardless of the stored preference.
// ---------------------------------------------------------------------------

test('home page does not redirect even with a stored ES preference', async ({ page }) => {
  // Override webdriver flag so the crawler guard does not short-circuit the
  // redirect logic before it reaches the is-home check.
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', {
      configurable: true,
      get: () => false,
    });
  });

  await page.addInitScript(
    ([key, value]) => {
      try {
        localStorage.setItem(key, value);
      } catch {
        // Ignore: assertion below will surface storage failures.
      }
    },
    [STORAGE_KEY, 'es'],
  );

  await page.goto(HOME_URL);

  // The home must stay at '/' — no redirect to /es/.
  await expect(page).toHaveURL('/');

  // The gallery must still render cards (home page shows all posts).
  const gallery = page.locator('#gallery-home');
  await expect(gallery).toBeAttached();
});

// ---------------------------------------------------------------------------
// 5. Gallery deduplication: the home gallery renders the pilot post exactly
//    once — no duplicate card for the ES translation.
//
//    The generate_pages.py hook excludes '.es.md' files from publications.json,
//    so the gallery should have a single card for the pilot post id.
// ---------------------------------------------------------------------------

test('home gallery shows the pilot post exactly once (no ES duplicate)', async ({ page }) => {
  await page.goto(HOME_URL);

  // Wait for the gallery to render at least one card before counting.
  const gallery = page.locator('#gallery-home');
  await expect(gallery.locator('.card')).not.toHaveCount(0);

  // Collect the href values of all gallery card links and filter for the pilot.
  const hrefs = await gallery.locator('a[href]').evaluateAll(
    (anchors, id) => anchors
      .map(a => a.getAttribute('href') || '')
      .filter(href => href.includes(id)),
    PILOT_POST_ID,
  );

  // Exactly one card must point to the pilot post; zero would mean it is
  // missing, more than one means the ES translation leaked into the index.
  expect(hrefs).toHaveLength(1);
});
