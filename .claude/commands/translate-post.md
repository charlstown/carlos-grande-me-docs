---
description: Given the path to one language version of a post, ensures its counterpart exists and is symmetric. If the counterpart is missing, generates it by translating (delegating to the `translator` subagent). If both exist, compares them for divergences in content, structure, links, Mermaid diagrams, tables, and code (also via `translator`). Trigger when the user says "translate post", "traduce este post", "translate-post", "sincroniza la traducción", or invokes /translate-post with a path.
---

# translate-post

Keeps a post's English (`.md`) and Spanish (`.es.md`) versions in sync. The site uses `mkdocs-static-i18n` with **suffix** structure: `<name>.md` is the **default** locale (English) and `<name>.es.md` is the Spanish counterpart.

The heavy lifting — translating or auditing parity — is always delegated to the **`translator`** subagent. This command's job is to resolve the file pair, decide the mode, drive the subagent, and report.

> **Content language**: English is the canonical language of the repo (CLAUDE.md §4). When a missing English file is generated from Spanish, it must read as a native English original.

---

## Workflow

### Step 1 — Resolve the input path

The post path is passed as an argument: **$ARGUMENTS**

- If **$ARGUMENTS** is empty, ask the user: *"Pega la ruta al post (la versión `.md` o `.es.md`) que quieres traducir o sincronizar."* Wait for the answer.
- Normalize the path and confirm the file exists with `Read` (or `Glob`). If it does not exist, stop and tell the user the path is invalid.

Save it as **INPUT_FILE**.

### Step 2 — Determine language and derive the counterpart

Inspect the filename suffix:

- Ends in **`.es.md`** → INPUT is **Spanish**. Counterpart is the same path with `.es.md` replaced by `.md`.
- Ends in **`.md`** (but not `.es.md`) → INPUT is **English (default)**. Counterpart is the same path with `.md` replaced by `.es.md`.

Save:
- **EN_FILE** — the `.md` path (default/English).
- **ES_FILE** — the `.es.md` path (Spanish).
- **COUNTERPART** — whichever of the two is *not* INPUT_FILE.

### Step 3 — Check whether the counterpart exists

Use `Glob` or `Read` to test for **COUNTERPART**.

- **Counterpart exists** → go to **Step 4A (Compare)**.
- **Counterpart missing** → go to **Step 4B (Translate)**.

Tell the user which path you're taking, e.g.:
> "Ambas versiones existen — voy a comparar parity." / "Falta la versión inglesa — la genero traduciendo desde el español."

---

### Step 4A — Compare (both files exist)

Spawn the **`translator`** subagent with `Agent` (`subagent_type: translator`). Prompt:

```
Mode: Compare (audit parity — report only, do not edit).

FILE_EN: {EN_FILE}
FILE_ES: {ES_FILE}

Read both files in full and walk them in parallel against your parity table.
Report every divergence in content, structure, frontmatter, headings, section
count/order, horizontal rules, images, links, tables, Mermaid diagrams, code
blocks, admonitions, tabs, and emphasis — plus any semantic mismatch where the
two languages say materially different things. Classify each as blocking or
minor with a concrete suggested fix. Do not modify the files.
```

When the subagent returns, relay its parity report to the user.

- If **0 divergences** → confirm: *"Las dos versiones son simétricas. Nada que arreglar."* Done.
- If divergences exist → present the findings and ask:
  > "Encontré {n} divergencia(s) ({b} bloqueantes). ¿Aplico los arreglos sugeridos?"
  > Options: `Aplica los arreglos`, `Solo el reporte`

  If the user chooses to apply, spawn `translator` again with the same file pair but **Mode: Compare with fixes — apply the suggested corrections to bring the files into parity**, then confirm what changed.

---

### Step 4B — Translate (counterpart missing)

Determine **DIRECTION**:
- INPUT is `.es.md`, missing `.md` → **`es→en`** (generate the canonical English file).
- INPUT is `.md`, missing `.es.md` → **`en→es`** (generate the Spanish file).

Spawn the **`translator`** subagent with `Agent` (`subagent_type: translator`). Prompt:

```
Mode: Translate (generate the missing counterpart).

SOURCE_FILE: {INPUT_FILE}
TARGET_FILE: {COUNTERPART}
DIRECTION: {es→en | en→es}

Read the source in full, absorb the style of existing posts in the same
category, and write TARGET_FILE as a complete, symmetric translation following
your parity table: copy `date` and `thumbnail` verbatim, translate `short_title`
and `description`, and preserve every heading, section, horizontal rule, image
path, link URL, table shape, Mermaid topology, code block, admonition, and tab.
Then run your parity self-check and fix anything you introduced.
```

When the subagent returns:

1. Confirm the new file was created at **COUNTERPART**.
2. Run a **second pass for safety**: spawn `translator` once more in **Mode: Compare** on the now-existing pair (EN_FILE ⇄ ES_FILE) to verify the freshly generated file is truly symmetric. Relay any findings.
3. If the compare pass finds blocking divergences, ask the user whether to apply the fixes (same prompt as Step 4A).

---

### Step 5 — Report

Print a short summary:

```
translate-post — {post slug}
━━━━━━━━━━━━━━━━━━━━━━━━━━
Mode    : {Compare | Translate}
EN file : {EN_FILE}
ES file : {ES_FILE}
Result  : {Symmetric | Generated {COUNTERPART} | {n} divergences}
━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Do **not** commit or push — leave that to the user (or the `/post` command). If a new file was generated, remind the user it's unstaged and uncommitted.
