# Changelog

All notable changes to [carlosgrande.me/docs](https://carlosgrande.me/docs) are listed here.

---

## [1.3.0] — 2026-06-21

- Add ES/EN language toggle button to header with site-wide redirect
- Integrate mkdocs-static-i18n plugin for bilingual support
- Add Spanish translation of pilot post
- Fix: Prevent redirect loop on i18n fallback es pages
- Fix: Correct this.current mutation, memory leak, and open redirect
- Fix: Exclude translations from home gallery JSON
- Fix: Make toggle alternate guard symmetric (en+es)
- Sync home category filter with URL
- Add reading progress bar component and styles
- Add post publication date display
- Add CI workflows (GitHub Actions, Playwright e2e, Vitest unit)
- Add GitHub Environments to deploy workflows
- Enforce PR source branch into main
- Add Dependabot for GitHub Actions
- Add dev branch to gh-pages deploy workflow
- Adapt Claude toolkit with hooks
- Bump actions/checkout from 6 to 7
- Bump actions/setup-node from 4 to 6
- Bump actions/setup-python from 5 to 6
- Bump aws-actions/configure-aws-credentials from 4 to 6

---

## [1.2.0] — 2026-06-21

- Claude Code toolkit integrated (hooks, AI agent config, specs workflow)
- CI: GitHub Actions dependencies bumped to latest versions

---

## [1.1.0] — 2026-06-15

- New post: The 8 Levels of AI Development *(cheatsheet)*
- EN/ES language toggle button in post header

---

## [1.0.0] — 2026-06-13

- Reading progress bar on posts
- Post publication date displayed on each post
- Home category filter state synced to URL
- Full test suite: unit (Vitest) + e2e (Playwright) + build smoke
- Dev branch preview deploy to GitHub Pages
- Enforce PR source-branch policy (`dev`/`hotfix/*` → `main` only)

---

## [0.4.0] — 2026-01-09

- New post: My Branch Model Cheatsheet *(git flow + gitlab flow diagrams)*

---

## [0.3.0] — 2025-11-09

- New post: My Semantic Versioning Cheatsheet
- New post: Pickasa App *(project)*

---

## [0.2.0] — 2025-10-25

- Gallery reveal animation and lazy loader
- Super index with item count per category

---

## [0.1.0] — 2024-06-02

- Initial site launch (MkDocs Material)
- Notebooks: business, coding, data architecture, data science
- Projects: Madrid Airbnb analysis, Madrid Invisible, Rubik's Cube model
- References: articles and case studies
- Resources: cheatsheets, templates, thesis
- Automated deploy to S3 via GitHub Actions
