# CLAUDE.md

Rules and guidelines for AI agents (Claude Code and similar) working in this repository.

---

## 1. Repository context

This is an **MkDocs Material** documentation site (`carlosgrande.me/docs`). Content is written in Markdown and organized under `docs/` into notebooks, projects, references, and resources. The `mkdocs.yml` file controls site structure and configuration.

---

## 2. Allowed actions (no confirmation needed)

Agents may perform the following without asking:

- Create or edit `.md` files under `docs/`.
- Run `mkdocs serve` to preview the site locally.
- Create git feature branches following the branch conventions below.
- Commit changes following the commit conventions below.

---

## 3. Prohibited or restricted actions

Always ask for explicit confirmation before:

- Pushing to `main` or `dev` branches.
- Deleting any existing `.md` file.
- Modifying `mkdocs.yml` or any other configuration file.
- Installing or removing Python packages or dependencies.

> Some of these rules are enforced automatically by hooks (see `.claude/README.md` §10): editing config files or deleting a content `.md` triggers a confirmation prompt, and a strict build runs before a session ends when `docs/` changed.

---

## 4. Content language

All `.md` content must be written in **English**, matching the language of existing documents in the repo.

---

## 5. Markdown file conventions

### 5.1 Frontmatter

Every new `.md` file must include this YAML frontmatter block at the top:

```yaml
---
short_title: <short display title>
description: <one-sentence summary>
date: YYYY-MM-DD
thumbnail: assets/images/thumbnails/<filename>.png
---
```

### 5.2 Structure

- Use a single `# H1` heading at the top as the page title.
- Number top-level sections: `## 1. Section name`.
- Number subsections: `### 1.1 Subsection name`.
- Use `---` horizontal rules **only between H2 top-level sections**, never between H3 subsections or lower.

### 5.3 Style

- Match the tone and formatting of existing files in the same category (`notebooks/`, `projects/`, `references/`).
- Use `**bold**` for keywords and `*italic*` for references or links.
- Include blockquotes (`>`) for key definitions or takeaways.
- Keep paragraphs concise and informative.

### 5.4 MkDocs Material elements

Official docs: https://squidfunk.github.io/mkdocs-material/reference/

Use native MkDocs Material components **sparingly and only when they clearly improve readability**:

- **Admonitions** (`!!! tip`, `!!! note`, `!!! warning`) — for callouts, key insights, or warnings that benefit from visual emphasis. Always use a custom title or an empty title (`!!! note ""`); never leave the default title.
- **Tabs** (`=== "Tab name"`) — for parallel comparisons or multi-step content (e.g. self-assessment organized by phase).
- **Code blocks with syntax highlighting** — always specify the language.

Do not use Material elements just for decoration. One or two per post is the right amount.

### 5.5 Thumbnails

Place thumbnail images in `docs/assets/images/thumbnails/` following the naming pattern `{slug}-portrait.{ext}`.

---

## 6. Git conventions

Follow the conventions defined in [`contributing.md`](contributing.md).

### 6.1 Branches

- Always work in a feature branch: `feature/<short-description>`.
- Branch from `dev`, not from `main`.
- Branching model: `feature/* → dev → main`.
  - `dev` is the integration branch; pushing to it deploys a **preview** to GitHub Pages.
  - `main` is production; pushing to it deploys to **S3** (`carlosgrande.me`).
  - PRs into `main` are accepted **only** from `dev` or `hotfix/*` (enforced by the `enforce-pr-source` workflow). Never open a PR from a `feature/*` branch directly into `main`.

### 6.2 Commits

Use the format `[action] description` (imperative mood, max 50 chars in subject):

| Action   | When to use                                      |
|----------|--------------------------------------------------|
| `update` | Changes that don't alter the outcome             |
| `wip`    | Work in progress, not yet complete               |
| `fix`    | Correcting a previous error                      |
| `feature`| Adding new content or functionality              |

Example: `[feature] add python generators notebook`

---

## 7. Out of scope

Agents should **not**:

- Refactor or restructure content beyond what is explicitly requested.
- Add content not requested by the user.
- Modify the site navigation or theme settings without confirmation.
