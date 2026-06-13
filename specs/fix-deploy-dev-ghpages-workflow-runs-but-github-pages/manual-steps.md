# GitHub Pages Manual Configuration Steps

This document covers the manual UI steps to configure GitHub Pages for the
`carlos-grande-me-docs` repository. Use it if the automated API call fails or
if the configuration needs to be reproduced from scratch.

## Context

The root cause of the broken preview was a flag rename in `mkdocs-material`:
the `--branch` option in `mkdocs gh-deploy` was renamed to `--remote-branch`.
The workflow `.github/workflows/deploy-dev-ghpages.yml` was updated accordingly
(replacing `--branch gh-pages` with `--remote-branch gh-pages`), so the deploy
step now pushes the built site to the `gh-pages` branch as expected.

GitHub Pages also needs to be pointed at that branch. The equivalent API call is:

```bash
gh api -X PUT repos/charlstown/carlos-grande-me-docs/pages \
  -f source[branch]=gh-pages \
  -f source[path]=/
```

If that call fails or the setting is later lost, follow the manual steps below.

## Manual steps via GitHub UI

### 1. Configure GitHub Pages source

1. Open the repository on GitHub: `https://github.com/charlstown/carlos-grande-me-docs`
2. Go to **Settings** → **Pages** (left sidebar, under *Code and automation*).
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
4. Under **Branch**, select `gh-pages` and set the folder to `/ (root)`.
5. Click **Save**.

### 2. Grant write permissions to Actions

1. Still in **Settings**, go to **Actions** → **General** (left sidebar).
2. Scroll down to **Workflow permissions**.
3. Select **Read and write permissions**.
4. Click **Save**.

### 3. Trigger a deploy

Push any change to the `dev` branch (or re-run the latest workflow run from the
Actions tab). The workflow will build the site with `mkdocs gh-deploy` and push
the output to the `gh-pages` branch.

## Verification

After the workflow completes with `conclusion: success`, the preview site is
available at:

```
https://charlstown.github.io/carlos-grande-me-docs/
```

Confirm the page loads (HTTP 200) and reflects the current content of `dev`.
To verify the Pages configuration programmatically:

```bash
gh api repos/charlstown/carlos-grande-me-docs/pages \
  --jq '{source_branch: .source.branch, source_path: .source.path, html_url: .html_url}'
```

Expected output:

```json
{
  "source_branch": "gh-pages",
  "source_path": "/",
  "html_url": "https://charlstown.github.io/carlos-grande-me-docs/"
}
```
