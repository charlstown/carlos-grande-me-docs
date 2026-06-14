---
description: Reviews the current post, commits pending changes, pushes the branch, and opens a PR against dev. Run after /new-post has written the content. Trigger when the user says "post it", "publish", "make the PR", "push and PR", "publica el post", or invokes /post.
---

# post

Reviews the current post for quality, commits, pushes, and opens a PR against `dev`.

> **Branching model**: feature branches merge into `dev` (preview deploy to GitHub Pages).
> `dev` is later promoted to `main` (production deploy to S3) via a separate PR.
> A PR from a `feature/*` branch directly into `main` is rejected by the
> `enforce-pr-source` workflow — always target `dev`.

---

## Workflow

### Step 1 — Detect context

Run in parallel:

```bash
git branch --show-current
git status --short
git log main..HEAD --oneline
```

From the output:
- Save the current branch as **BRANCH** (expected format: `feature/post-{slug}`)
- Extract **SLUG** from the branch name (everything after `feature/post-`)
- Save any uncommitted changed files
- Save the list of commits ahead of `main`

If the current branch is `main` or `dev`, stop and tell the user:
> "You're on `{branch}`. Switch to a `feature/post-*` branch first."

---

### Step 2 — Find the post file

Look for the `.md` file that matches the slug in `docs/`:

```bash
find docs/ -name "{SLUG}.md"
```

Save the path as **POST_FILE**.

If no file is found, ask the user:
- "Which file is the post you want to publish?" (free text)

---

### Step 3 — Review the post

Read **POST_FILE** and check every item in this checklist. Work through it silently — only report findings, not the checklist itself.

**Frontmatter**
- [ ] `short_title` is set and not the default placeholder
- [ ] `description` is a real sentence (not `none`)
- [ ] `date` is a valid date in `YYYY-MM-DD` format
- [ ] `thumbnail` field is present

**Structure**
- [ ] There is exactly one `# H1` heading matching the `short_title`
- [ ] Sections are numbered (`## 1.`, `## 2.`, etc.)
- [ ] No section is empty or contains only placeholder text like "TODO" or "..."

**Content**
- [ ] No `⚠` gap markers left from the research agent
- [ ] No sentences that are obviously incomplete or cut off
- [ ] The intro paragraph exists and is at least 2 sentences

**References**
- [ ] A `## References` section exists with at least one entry
- [ ] References follow APA format (Author, Year, Title, Source)
- [ ] No broken markdown links (`[text]()` with empty URL)

After the review, print a short report:

```
Post review — {POST_FILE}
━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Frontmatter OK
✓ Structure OK
⚠ Description is still "none"      ← example finding
⚠ 1 empty section found (## 3.)   ← example finding
━━━━━━━━━━━━━━━━━━━━━━━━━━
Issues found: {n}  |  Ready to post: {yes/no}
```

If **any blocking issues** are found (empty sections, gap markers `⚠`, broken links), stop and tell the user what to fix before proceeding. Do not push with broken content.

If only **minor issues** are found (e.g. `description: none`), ask the user:

> "Found {n} minor issue(s). Fix them now or proceed anyway?"
> Options: `Fix now`, `Proceed anyway`

If `Fix now`: apply the fixes using `Edit` before continuing.

---

### Step 4 — Commit pending changes

If `git status` shows uncommitted changes to the post file:

```bash
git add {POST_FILE}
git commit -m "[feature] add {SLUG} post"
```

If there are other uncommitted files unrelated to the post, do **not** stage them. Only stage **POST_FILE**.

If nothing is uncommitted, skip this step.

---

### Step 5 — Push the branch

```bash
git push -u origin {BRANCH}
```

Confirm: "Branch `{BRANCH}` pushed to origin."

---

### Step 6 — Create the PR

Read the first 30 lines of **POST_FILE** to extract a one-line summary of the post.

Then run:

```bash
gh pr create \
  --base dev \
  --title "[feature] {short_title}" \
  --body "$(cat <<'EOF'
## Summary

- Adds a new post: **{short_title}**
- Category: `{category path derived from POST_FILE}`
- File: `{POST_FILE}`

## Checklist

- [x] Frontmatter complete (short_title, description, date, thumbnail)
- [x] Sections numbered and non-empty
- [x] References in APA format
- [ ] Thumbnail image added to assets

## Preview

> {one-line summary of the post extracted from the intro paragraph}

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Print the PR URL returned by `gh pr create`.

---

### Step 7 — Done

Report:

```
Done.
Branch : {BRANCH}
PR     : {PR URL}
File   : {POST_FILE}
```
