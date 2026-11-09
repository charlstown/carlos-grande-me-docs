import { test, expect } from '@playwright/test';

const path = '/resources/cheatsheets/my-continuous-testing-cheatsheet/';

for (const locale of ['', '/es']) {
  test(`the ${locale || 'English'} article loads the diagram and follows the site theme`, async ({ page }) => {
    await page.goto(locale + path);
    const iframe = page.locator('.continuous-testing-embed iframe');
    await iframe.scrollIntoViewIfNeeded();
    const diagram = iframe.contentFrame();

    await expect(diagram.locator('.stop')).toHaveCount(51);
    await page.evaluate(() => document.body.setAttribute('data-md-color-scheme', 'slate'));
    await expect(diagram.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.evaluate(() => document.body.setAttribute('data-md-color-scheme', 'default'));
    await expect(diagram.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(diagram.locator('.theme-bar')).toBeHidden();
  });
}

test('the mobile diagram expands in the article when its descriptions open', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/es' + path);
  const iframe = page.locator('.continuous-testing-embed iframe');
  await iframe.scrollIntoViewIfNeeded();
  const diagram = iframe.contentFrame();

  await expect(diagram.locator('.mobile-phase')).toHaveCount(7);
  await expect(diagram.locator('.mobile-stop')).toHaveCount(51);
  await expect(diagram.locator('.mobile-stop').first()).toBeVisible();
  const initialHeight = (await iframe.boundingBox()).height;
  await diagram.locator('.mobile-phase-header').first().click();
  await diagram.locator('.mobile-stop summary').first().click();
  await expect.poll(async () => (await iframe.boundingBox()).height).toBeGreaterThan(initialHeight);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
});

test('each article shows the map in its own language, including on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const [locale, expectedTitle, expectedFrequency] of [
    ['', 'Format and style', 'PER CHANGE'],
    ['/es', 'Formato y estilo', 'POR CAMBIO'],
  ]) {
    await page.goto(locale + path);
    const iframe = page.locator('.continuous-testing-embed iframe');
    await iframe.scrollIntoViewIfNeeded();
    const diagram = iframe.contentFrame();
    const first = diagram.locator('.mobile-stop').first();
    await expect(first.locator('.mobile-stop-title')).toHaveText(expectedTitle);
    await expect(first.locator('.mobile-stop-meta')).toContainText(expectedFrequency);
    await first.locator('summary').click();
    await expect(first.locator('.mobile-stop-description')).toBeVisible();
    await expect(diagram.locator('.mobile-stop')).toHaveCount(51);
  }
});

test('clicking an empty part of the map restores the initial message', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(path);
  const iframe = page.locator('.continuous-testing-embed iframe');
  await iframe.scrollIntoViewIfNeeded();
  const diagram = iframe.contentFrame();
  const phase = diagram.locator('.phase').first();
  await phase.evaluate(element => element.dispatchEvent(new MouseEvent('click', { bubbles: true })));
  await expect(diagram.locator('#info-title')).toHaveText('Local Prechecks');
  await expect(phase).toHaveAttribute('aria-pressed', 'true');

  await diagram.locator('svg[role="img"]').evaluate(element =>
    element.dispatchEvent(new MouseEvent('click', { bubbles: true })),
  );
  await expect(diagram.locator('#info-kicker')).toHaveText('EXPLORE THE MAP');
  await expect(diagram.locator('#info-title')).toHaveText('Select a phase or stop');
  await expect(phase).toHaveAttribute('aria-pressed', 'false');
});

for (const width of [375, 1280]) {
  test(`the diagram fits the article and can enter and leave full screen at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/es' + path);
    const container = page.locator('.continuous-testing-embed');
    const iframe = container.locator('iframe');
    const button = container.locator('button');
    await container.scrollIntoViewIfNeeded();
    await expect(iframe.contentFrame().locator('#mobile-map')).toBeAttached();

    const article = await page.locator('.md-content__inner').boundingBox();
    const inline = await container.boundingBox();
    expect(inline.x).toBeGreaterThanOrEqual(article.x - 1);
    expect(inline.x + inline.width).toBeLessThanOrEqual(article.x + article.width + 1);

    await button.click();
    await expect(container).toHaveAttribute('data-full', 'true');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect.poll(async () => Math.round((await iframe.boundingBox()).width)).toBe(width);
    await iframe.contentFrame().locator('body').press('Escape');
    await expect(container).toHaveAttribute('data-full', 'false');
    await expect(button).toHaveAttribute('aria-pressed', 'false');
  });
}
