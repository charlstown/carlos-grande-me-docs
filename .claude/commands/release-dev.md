---
description: Prepares a release from dev to main. Collects commits since the last release, bumps the version, updates CHANGELOG.md and VERSION, commits to dev, and opens a PR into main. Trigger when the user says "release", "cut a release", "publica release", "hacer release", or invokes /release-dev.
---

# release-dev

Cuts a new release: bumps the version, writes the changelog, and opens a PR from `dev` into `main`.

> **Branching model**: `dev` → `main` is production (deploys to S3 at `carlosgrande.me`).
> PRs into `main` are accepted **only** from `dev` or `hotfix/*` — never from a `feature/*` branch.

---

## Workflow

### Step 1 — Guard: must be on `dev`

Run:

```powershell
git branch --show-current
```

If the current branch is **not** `dev`, stop and tell the user:

> "You must be on `dev` to cut a release. Switch with `git checkout dev` and try again."

---

### Step 2 — Collect changes since last release

Run the following in parallel:

```powershell
git log main..HEAD --oneline --no-merges
git log main..HEAD --format="%s" --no-merges
git log main..HEAD --format="%H %s" --no-merges
```

Also read the current version:

```powershell
Get-Content VERSION
```

Save:
- **CURRENT_VERSION** — content of `VERSION` (e.g. `1.2.0`)
- **COMMITS** — list of commit subjects (one per line, from `--format="%s"`)
- **COMMIT_LOG** — full `hash subject` list for the PR body

If `COMMITS` is empty (no commits ahead of `main`), stop:

> "`dev` is already up to date with `main`. Nothing to release."

---

### Step 3 — Ask for version bump type

Parse **CURRENT_VERSION** into `MAJOR.MINOR.PATCH`.

Use `AskUserQuestion` to ask which kind of bump to apply:

```
What kind of release is this? (current: {CURRENT_VERSION})
```

Options:
- **minor — {MAJOR}.{MINOR+1}.0** — New features or posts added (Recommended)
- **fix — {MAJOR}.{MINOR}.{PATCH+1}** — Only fixes, updates, or small corrections
- **major — {MAJOR+1}.0.0** — Breaking changes or full site redesign

If the user does not answer or skips, default to **minor**.

Save the resulting version string as **NEW_VERSION**.

---

### Step 4 — Draft changelog entries

From **COMMITS**, group entries into human-readable bullets following the existing CHANGELOG.md style:

Mapping rules (apply in order, first match wins):

| Commit prefix | Changelog phrasing |
|---|---|
| `[feature] add ... post` | `New post: {title from commit}` |
| `[feature] …` | `{description from commit, capitalized}` |
| `[fix] …` | `Fix: {description from commit, capitalized}` |
| `[update] …` | `{description from commit, capitalized}` |
| `chore: …` | Skip unless it adds visible tooling (e.g. CI workflow, hooks) |
| `wip` | Skip |
| Merge commits | Skip (already filtered by `--no-merges`) |

Produce a draft entry block:

```
## [{NEW_VERSION}] — {TODAY}

- {bullet 1}
- {bullet 2}
- …
```

Where **TODAY** is today's date in `YYYY-MM-DD` format (read from the system or use `Get-Date -Format "yyyy-MM-dd"`).

Present the draft to the user:

```
Draft changelog entry:
─────────────────────────────────────────
## [{NEW_VERSION}] — {TODAY}

- {bullet 1}
- {bullet 2}
─────────────────────────────────────────
```

Then ask using `AskUserQuestion`:

```
Does this changelog entry look right?
```

Options:
- **Looks good, proceed** — Use the draft as-is
- **I'll edit it myself** — Pause; tell the user to edit CHANGELOG.md manually, then re-run `/release`

If the user chooses to edit manually, stop here.

---

### Step 5 — Update CHANGELOG.md and VERSION

**Read** `CHANGELOG.md` first (required before editing).

Insert the new entry block **after the first `---` separator** (i.e. right below the header intro), preserving all existing content.

The resulting structure must be:

```markdown
# Changelog

All notable changes to [carlosgrande.me/docs](https://carlosgrande.me/docs) are listed here.

---

## [{NEW_VERSION}] — {TODAY}

- …

---

## [{PREVIOUS_VERSION}] — …

…
```

Use `Edit` with the exact string replacement — do not rewrite the whole file.

Then overwrite `VERSION` with **NEW_VERSION** (one line, no trailing spaces):

```powershell
Set-Content -Path VERSION -Value "{NEW_VERSION}" -NoNewline
```

---

### Step 6 — Commit changelog and version

Stage only `CHANGELOG.md` and `VERSION`:

```powershell
git add CHANGELOG.md VERSION
git commit -m "chore: release {NEW_VERSION}"
```

Confirm: "`chore: release {NEW_VERSION}` committed."

---

### Step 7 — Push `dev`

```powershell
git push origin dev
```

If the push fails (divergence, auth error), print the exact error and stop — do **not** force-push.

Confirm: "`dev` pushed to origin."

---

### Step 8 — Open PR from `dev` into `main`

Build the PR body using **COMMIT_LOG** (all non-merge commits since the last release, formatted as a bullet list with short hash and subject).

```bash
gh pr create \
  --base main \
  --head dev \
  --title "release: v{NEW_VERSION}" \
  --body "$(cat <<'EOF'
## Release v{NEW_VERSION}

### Changelog

{DRAFT_ENTRY — the bullet list from Step 4, without the header line}

### Commits included

{COMMIT_LOG formatted as:
- `{short_hash}` {subject}
- …
}

### Deploy

Merging this PR triggers the **production deploy** to S3 (`carlosgrande.me`).

---
🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Print the PR URL returned by `gh pr create`.

---

### Step 9 — Done

Print a final summary:

```
Release v{NEW_VERSION} ready.
─────────────────────────────────────────
Version  : {CURRENT_VERSION} → {NEW_VERSION}
Changelog: CHANGELOG.md updated
PR       : {PR URL}
─────────────────────────────────────────
Merge the PR when ready to deploy to production.
```

---

## Notes

- **Never push directly to `main`** — always via the PR.
- **If a PR already exists** (`dev` → `main`), `gh pr create` will error. In that case, run `gh pr list --base main --head dev` to find the existing PR and report its URL instead of failing.
- **Version file format**: `VERSION` contains a single line with the semver string (e.g. `1.3.0`), no `v` prefix, no trailing newline.
- **Changelog format**: each entry is a flat bullet list — no sub-headings, no nested bullets — matching the existing style in `CHANGELOG.md`.
- **Date**: always use `Get-Date -Format "yyyy-MM-dd"` to get today's date; never hardcode it.
