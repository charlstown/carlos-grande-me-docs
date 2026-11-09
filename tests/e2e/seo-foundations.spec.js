import { test, expect } from '@playwright/test';

const PAGES = [
  ['home', '/'],
  ['about me', '/about-me/'],
  ['Python generators notebook', '/notebooks/coding/python-generators/'],
];

const CANONICAL_ORIGIN = 'https://carlosgrande.me';
const SITEMAP_URL = `${CANONICAL_ORIGIN}/sitemap.xml`;

async function parseSitemap(page, xml) {
  return page.evaluate((source) => {
    const document = new DOMParser().parseFromString(source, 'application/xml');
    return {
      root: document.documentElement.localName,
      namespace: document.documentElement.namespaceURI,
      hasParseError: document.getElementsByTagName('parsererror').length > 0,
      locations: [...document.getElementsByTagNameNS('*', 'loc')].map((node) => node.textContent.trim()),
    };
  }, xml);
}

test.describe('SEO foundations', () => {
  for (const [name, url] of PAGES) {
    test(`${name} exposes shareable metadata and structured data`, async ({ page }) => {
      const response = await page.goto(url);
      expect(response.status(), `${url} should return HTTP 200`).toBe(200);

      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S+/);
      await expect(page.locator('script[type="application/ld+json"]')).not.toHaveCount(0);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\S+/);
      await expect(page.locator('meta[property="twitter:image"]')).toHaveAttribute('content', /\S+/);
    });
  }

  test('robots.txt and llms.txt are publicly available', async ({ request }) => {
    for (const path of ['/robots.txt', '/llms.txt']) {
      const response = await request.get(path);

      expect(response.status(), `${path} should return HTTP 200`).toBe(200);
      expect(await response.text(), `${path} should not be empty`).toMatch(/\S+/);
    }
  });

  test('translated pages expose absolute and reciprocal hreflang URLs', async ({ page }) => {
    const englishPath = '/resources/cheatsheets/my-8-levels-of-ai-development/';
    const spanishPath = `/es${englishPath}`;
    const pages = {};

    for (const [language, path] of [['en', englishPath], ['es', spanishPath]]) {
      const response = await page.goto(path);
      expect(response.status(), `${path} should return HTTP 200`).toBe(200);
      const canonical = await page.locator('head link[rel="canonical"]').getAttribute('href');
      expect(canonical, `${path} should have a canonical URL`).toBeTruthy();
      expect(new URL(canonical).pathname).toBe(path);

      // Read the raw attribute: the DOM's href property resolves relative URLs
      // automatically and would hide the regression this test must detect.
      const alternates = await page.locator('head link[rel="alternate"][hreflang]').evaluateAll(
        (links) => links.map((link) => ({
          language: link.getAttribute('hreflang'),
          href: link.getAttribute('href'),
        })),
      );
      for (const locale of ['en', 'es']) {
        const matches = alternates.filter((link) => link.language === locale);
        expect(matches, `${path} should have one ${locale} alternate`).toHaveLength(1);
        expect(matches[0].href, `${path} ${locale} alternate must be absolute`).toMatch(/^https?:\/\//);
      }
      pages[language] = { canonical, alternates };
    }

    for (const { alternates } of Object.values(pages)) {
      for (const language of ['en', 'es']) {
        expect(alternates.find((link) => link.language === language).href)
          .toBe(pages[language].canonical);
      }
    }
  });

  test('llms.txt uses the configured root site URL', async ({ request }) => {
    const response = await request.get('/llms.txt');
    expect(response.status()).toBe(200);
    const content = await response.text();
    expect(content).toContain(`Canonical site URL: ${CANONICAL_ORIGIN}/`);
    expect(content).not.toContain(`${CANONICAL_ORIGIN}/docs/`);

    // Request the equivalent local paths rather than depending on live production.
    const siteUrls = [...content.matchAll(/https:\/\/carlosgrande\.me(?:\/[^\s]*)?/g)]
      .map(([url]) => url.replace(/[.,;]+$/, ''));
    expect(siteUrls.length).toBeGreaterThan(0);
    for (const url of new Set(siteUrls)) {
      const { pathname, search } = new URL(url);
      const target = await request.get(`${pathname}${search}`);
      expect(target.status(), `${url} should resolve locally`).toBe(200);
      expect(target.headers()['content-type'], `${url} should serve HTML`).toMatch(/text\/html/i);
    }
  });

  test('robots advertises the canonical sitemap and the served sitemap contains pages', async ({ page, request, baseURL }) => {
    const robots = await request.get('/robots.txt');
    expect(robots.status()).toBe(200);
    const sitemapDirectives = (await robots.text()).split(/\r?\n/)
      .filter((line) => /^sitemap\s*:/i.test(line))
      .map((line) => line.replace(/^sitemap\s*:\s*/i, '').trim());
    expect(sitemapDirectives).toContain(SITEMAP_URL);

    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const sitemap = await parseSitemap(page, await response.text());
    expect(sitemap.hasParseError).toBe(false);
    expect(sitemap.root).toBe('urlset');
    expect(sitemap.namespace).toBe('http://www.sitemaps.org/schemas/sitemap/0.9');
    expect(sitemap.locations.length).toBeGreaterThan(0);

    // `mkdocs serve` may rewrite site_url to its development server.
    const servedOrigin = new URL(baseURL).origin;
    const origins = sitemap.locations.map((location) => new URL(location).origin);
    expect(origins.every((origin) => origin === servedOrigin || origin === CANONICAL_ORIGIN)).toBe(true);
    expect(sitemap.locations.some((location) => new URL(location).pathname === '/')).toBe(true);
  });

  test('loads the GA4 tag or exposes its Material analytics marker', async ({ page }) => {
    await page.goto('/');

    const hasGa4Tag = await page.locator(
      'script[src*="googletagmanager.com/gtag/js"], #__analytics',
    ).count();

    expect(hasGa4Tag).toBeGreaterThan(0);
  });
});
