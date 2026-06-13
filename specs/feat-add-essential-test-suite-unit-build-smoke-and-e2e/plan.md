# Plan — Add essential test suite: unit, build smoke, and browser E2E phases

## Enfoque

The Vitest + jsdom harness already exists (`vitest.config.js`, `tests/unit/reading-progress.test.js`); this plan extends it rather than rebuilding it. Batch 1 wires up the three npm scripts and dev dependencies so every later batch has a runnable target. Batches 2-4 add one unit-test file per component (`Gallery`, `FilterMenu`, `LazyLoader`) — independent files that can be written in parallel and keep the suite under 30 s. Batch 5 isolates the heavy Playwright E2E suite into its own config so it never enters the default loop, and Batch 6 adds the three CI workflows matched to their triggers. Build-smoke risk (broken links, `--strict` failures) is mitigated early via the `test:build` script in Batch 1.

## Batch 1 — Scripts and dependencies

- [x] · @code-developer - Edit `package.json`: in `scripts`, keep `"test": "vitest run"` and add `"test:build": "mkdocs build --strict"` and `"test:e2e": "playwright test"`. In `devDependencies` add `"@playwright/test": "^1.49.0"`. Guard: `npm run` lists `test`, `test:build`, and `test:e2e`; `package.json` remains valid JSON (`node -e "require('./package.json')"` exits 0).

- [x] · @code-developer - Edit `package.json` (or create `.npmrc` if needed): confirm `"type": "module"` is preserved so Vitest and Playwright configs resolve as ESM. Guard: `npm test` runs without an ESM/CJS module-type error against the existing `reading-progress.test.js`.

## Batch 2 — Gallery unit tests

- [ ] · @test-developer - Create `tests/unit/gallery.test.js` importing `{ Gallery }` from `../../docs/assets/javascripts/components/GalleryHome.js`. Setup helper `mountContainer()` that sets `document.body.innerHTML = '<div id="gallery"></div>'` and returns the node; `beforeEach`/`afterEach` reset `document.body.innerHTML = ''`. Stub `global.fetch` per test with `vi.fn()`. Cover: (1) `init()` sorts `data.items` by `date` descending — assert `gallery.allItems[0].date >= gallery.allItems[1].date`; (2) `init()` error state — `fetch` resolves `{ ok: false }`, assert `container.innerHTML` contains `'Failed to load gallery data.'`; (3) `init()` rejects malformed data — resolve `{ ok: true, json: async () => ({}) }`, assert error message rendered; (4) `setFilter('Projects')` filters `filteredItems` to items with `category === 'projects'`; (5) `setFilter('Articles')` keeps only `category === 'references'` items whose `src` includes `/articles/`; (6) `setFilter('All')` restores `filteredItems` to `allItems`; (7) `renderItems(items)` produces one `.gallery-home-item` element per item with correct `data-category` and `data-id` attributes, and `renderItems(items, { append: true })` does not clear existing children. Run with `npm test -- gallery`. Guard: `npm test -- gallery` reports all cases passing.

## Batch 3 — FilterMenu unit tests

- [ ] · @test-developer - Create `tests/unit/filter-menu.test.js` importing `{ FilterMenu }` from `../../docs/assets/javascripts/components/FilterMenu.js`. Setup: `document.body.innerHTML = '<div id="filterMenu"></div>'` in `beforeEach`, reset in `afterEach`. Cover: (1) initial render with `categories = ['All','Projects','Notebooks']` creates one `button.filter-btn` per category and marks the first (`All`) with class `active`; (2) `setActive('Projects')` moves the `active` class to the Projects button and removes it from `All`; (3) `setActive('Projects')` invokes the `onChange` callback once with argument `'Projects'` (use `vi.fn()`); (4) clicking a rendered button (`button.click()`) triggers `setActive` and fires `onChange` with that category; (5) `setCounts({ All: 5, Projects: 2 })` re-renders and the `All` and `Projects` buttons contain a `sup.filter-count` with text `5` and `2` respectively; (6) a category with count `0` and not equal to `All` renders no `sup.filter-count`. Run with `npm test -- filter-menu`. Guard: `npm test -- filter-menu` reports all cases passing.

## Batch 4 — LazyLoader unit tests

- [ ] · @test-developer - Create `tests/unit/lazy-loader.test.js` importing `{ LazyLoader }` from `../../docs/assets/javascripts/components/LazyLoader.js`. Setup: stub `global.IntersectionObserver` with a `vi.fn()` class exposing `observe`, `disconnect`, and capturing the callback so tests can fire it manually; mount a container `<div id="list"></div>` in `beforeEach`. Cover: (1) `init()` creates a sentinel sibling after `container`, constructs an `IntersectionObserver`, calls `observe`, and renders the first batch via `renderFn` — with `items` of length 5 and `batchSize = 8`, `renderFn` is called and `loader.done` becomes `true` (all items fit one batch); (2) with `items` length 20 and `batchSize = 8`, `init()` renders the first 8 (`loader.offset === 8`, `done === false`), then firing the observer callback with `isIntersecting: true` loads the next batch (`offset === 16`); (3) once `loader.done === true`, calling `loadNext()` again does not call `renderFn` further (assert `renderFn` call count unchanged); (4) `destroy()` calls `observer.disconnect()`, nulls `_observer`, and removes the sentinel from the DOM (`_sentinel === null` and no orphan sentinel element). Stub `_sentinel.getBoundingClientRect` and `window.innerHeight` where the batch loop relies on geometry. Run with `npm test -- lazy-loader`. Guard: `npm test -- lazy-loader` reports all cases passing.

## Batch 5 — Playwright E2E suite

- [ ] · @code-developer - Create `playwright.config.js` (ESM `export default`) configuring `testDir: './tests/e2e'`, a single `chromium` project, and `webServer: { command: 'mkdocs serve -a 127.0.0.1:8000', url: 'http://127.0.0.1:8000', reuseExistingServer: true, timeout: 120000 }` with `use.baseURL: 'http://127.0.0.1:8000'`. Guard: `npx playwright test --list` resolves the config without error after `npm install`.

- [ ] · @code-developer - Create `tests/e2e/gallery.spec.js` using `@playwright/test`. Cover: (1) navigate to `/`, assert at least one `.gallery-home-item` is visible (gallery renders items); (2) click a filter button in `nav.filter-menu` (e.g. text `Projects`) and assert the visible `.gallery-home-item` elements all have `data-category="projects"`; (3) scroll to the bottom of the page and assert the count of `.gallery-home-item` increases versus the initial count (lazy loading triggers on scroll). Guard: file parses under `npx playwright test --list` and lists 3 tests.

- [ ] · @code-developer - Create `tests/e2e/reading-progress.spec.js` using `@playwright/test`. Cover: navigate to a known post page (e.g. `/projects/app-pickasa/`), assert `.reading-progress` exists and is attached to `body`, then scroll down and assert `.reading-progress__fill` `style.width` increases from its initial value. Guard: file parses under `npx playwright test --list` and lists 1 test.

## Batch 6 — CI workflows

- [ ] · @code-developer - Create `.github/workflows/unit-tests.yml` named `Unit Tests`, triggered `on: [push, pull_request]`, running on `ubuntu-latest`: checkout, `actions/setup-node@v4` with `node-version: 20`, `npm ci`, then `npm test`. Guard: file is valid YAML (`python -c "import yaml,sys; yaml.safe_load(open('.github/workflows/unit-tests.yml'))"` exits 0) and the job's final step runs `npm test`.

- [ ] · @code-developer - Create `.github/workflows/build-smoke.yml` named `Build Smoke Test`, triggered `on: pull_request: branches: ["main"]`, running on `ubuntu-latest`: checkout, `actions/setup-python@v5` with `python-version: '3.9'`, `pip install -r requirements.txt`, then `mkdocs build --strict`. Guard: valid YAML; trigger block restricts to PRs targeting `main`; final step is `mkdocs build --strict`.

- [ ] · @code-developer - Create `.github/workflows/e2e.yml` named `E2E Tests`, triggered only `on: release: types: [published]` and `on: milestone: types: [closed]` (no push/PR trigger), running on `ubuntu-latest`: checkout, `setup-node@v4` (node 20) + `npm ci` + `npx playwright install --with-deps chromium`, `setup-python@v5` (3.9) + `pip install -r requirements.txt`, then `npm run test:e2e`. Guard: valid YAML; no `push` or `pull_request` keys present under `on`; final step is `npm run test:e2e`.

## Write Tests

- [ ] · @test-developer - Confirm the three new unit-test files (`tests/unit/gallery.test.js`, `tests/unit/filter-menu.test.js`, `tests/unit/lazy-loader.test.js`) coexist with `tests/unit/reading-progress.test.js` in a single Vitest run with no duplicated `ReadingProgress` coverage. Run `npm test`. Guard: all four files are discovered and pass in one invocation; total run time is under 30 seconds.

## Run Tests

- [ ] · @tester - Run `npm test` and confirm it covers the unit-test acceptance criteria (Gallery, FilterMenu, LazyLoader, ReadingProgress) and completes in under 30 seconds. Guard: exit code 0 and reported duration below 30 s.

- [ ] · @tester - Run `npm run test:build` and confirm `mkdocs build --strict` exits with code 0 (no broken links, no build warnings/errors), satisfying the build-smoke acceptance criterion. Guard: command exits 0.
