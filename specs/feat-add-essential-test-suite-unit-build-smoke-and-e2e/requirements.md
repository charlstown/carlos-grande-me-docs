# Add essential test suite: unit, build smoke, and browser E2E phases

> GitHub: #16

## Descripción

## Descripción

The project has no tests beyond the `ReadingProgress` unit tests introduced in the latest PR. This issue tracks adding a minimal but comprehensive test suite organized in three phases: fast unit tests for each JS component, a build smoke test to catch MkDocs errors, and a separate heavy Playwright E2E suite reserved for milestone or release validation.

## Comportamiento deseado

1. `npm test` → unit tests for all JS components pass quickly (target: under 30 s).
2. `npm run test:build` → `mkdocs build --strict` exits 0 with no broken links or warnings.
3. On release / milestone: `npm run test:e2e` runs a Playwright browser suite covering real user interactions.

## Criterios de aceptación

- [ ] Vitest unit tests for `Gallery` — filter logic (`setFilter`), sort by date, `renderItems` output, error state when fetch fails.
- [ ] Vitest unit tests for `FilterMenu` — initial render, `setActive` changes active button, `setCounts` updates counters, `onChange` callback fires.
- [ ] Vitest unit tests for `LazyLoader` — first batch loads on `init`, subsequent batches load correctly, `done` flag prevents extra loads, `destroy` cleans up observer and sentinel.
- [ ] `ReadingProgress` tests from the current PR are included in the same suite (no duplication).
- [ ] Build smoke test: `mkdocs build --strict` exits with code 0 (no broken links, no build errors).
- [ ] Playwright E2E suite (separate, not in default CI) covering at minimum: gallery renders items, filter buttons work, lazy loading triggers on scroll, reading progress bar appears on post pages.
- [ ] `package.json` scripts defined: `test` (unit), `test:build` (smoke), `test:e2e` (Playwright).
- [ ] All unit tests complete in under 30 seconds.
- [ ] GitHub Actions workflows created to run each test phase at the appropriate trigger: unit tests on every push/PR, build smoke test on PRs targeting `main`, E2E suite on release or milestone events.

## Contexto adicional

- Existing test infrastructure: Vitest + jsdom introduced in the `ReadingProgress` PR worktree (`vitest.config.js`, `tests/unit/`).
- Components to cover: `docs/assets/javascripts/components/` → `GalleryHome.js`, `FilterMenu.js`, `LazyLoader.js`.
- The E2E phase is intentionally heavy and should NOT be part of the default developer loop or CI pipeline — it is a milestone-level gate.
- `extra.js` (legacy utilities: `unfade`, `animateNumbers`) is explicitly out of scope for now.

## Rama de desarrollo

- Base: `develop`
- Rama sugerida: `feat/add-test-suite`
