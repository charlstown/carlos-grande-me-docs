---
description: Creates a new post in the carlosgrande.me/docs repo. Asks the user about the topic, determines the right category folder, creates a git branch, scaffolds the MD file with frontmatter, runs a content interrogation to extract ideas, and finally delegates research and writing to the `research` subagent. Trigger when the user says "new post", "crear post", "nuevo post", "write a post", "quiero escribir sobre", or invokes /new-post.
---

# new-post

## Workflow

### Step 0 — Ask for topic and depth

Use `AskUserQuestion` with **2 questions in one call**:

1. **Topic**: "What do you want to write about? Describe the idea, concept, or thing you want to share — the more context the better."
   - Options (multiSelect: false): `A concept or theory I learned`, `A project I built or am building`, `A tool, technique or cheatsheet`, `A book or article I want to summarize`

2. **Depth**: "How deep should the content interrogation go?"
   - Options (multiSelect: false):
     - `4 questions` — Quick. Only the critical angles. (~5 min)
     - `6 questions` — Balanced. Critical + important details.
     - `12 questions` — Exhaustive. Full picture, edge cases, examples.

Wait for the user's answers. Save the free-text description as **TOPIC** and the number as **N_QUESTIONS**.

---

### Step 1 — Determine the category

The repo's content lives under `docs/` with the following top-level sections and their subcategories:

| Top-level | Subcategories | When to use |
|---|---|---|
| `notebooks` | `coding`, `business`, `data-architecture`, `data-science` | Learning notes, tutorials, concepts from books or courses |
| `projects` | _(none)_ | Personal or professional projects built by the author |
| `references` | `articles`, `case-studies` | Articles summaries, papers, theories, case studies of people or companies |
| `resources` | `cheatsheets`, `templates`, `tools`, `thesis` | Reference sheets, templates, tool guides, deep frameworks |

**Always ask** the user which top-level section fits using `AskUserQuestion`:

- **Question**: "¿En qué sección de docs quieres guardar el post?"
- **Options** (exactly these four):
  - `notebooks` — Notas de aprendizaje, tutoriales, libros o cursos
  - `projects` — Proyectos personales o profesionales
  - `references` — Resúmenes de artículos, papers, teorías o case studies
  - `resources` — Cheatsheets, templates, tools, frameworks conceptuales

Save the answer as **TOP_LEVEL**.

Then, if **TOP_LEVEL** has subcategories (`notebooks`, `references`, or `resources`), infer the subcategory from **TOPIC**. If ambiguous, use a second `AskUserQuestion`:

- `notebooks` subcategories: `coding`, `business`, `data-architecture`, `data-science`
- `references` subcategories: `articles`, `case-studies`
- `resources` subcategories: `cheatsheets`, `templates`, `tools`, `thesis`

Save the full relative path as **CATEGORY_PATH** (e.g. `docs/resources/thesis`).

---

### Step 2 — Generate slug and branch name

From **TOPIC**, derive a kebab-case slug:
- Lowercase
- Replace spaces and special characters with hyphens
- Keep it short (3–5 words max)

Example: "Python async generators deep dive" → `python-async-generators`

Save as **SLUG**.

---

### Step 3 — Create the git branch

Run:

```bash
git checkout -b feature/post-{SLUG}
```

Confirm to the user: "Branch `feature/post-{SLUG}` created."

---

### Step 4 — Scaffold the MD file

Create the file at `{CATEGORY_PATH}/{SLUG}.md` with this starter content:

```markdown
---
short_title: {Title derived from SLUG — title case}
description: none
date: {today YYYY-MM-DD}
thumbnail: assets/images/thumbnails/{SLUG}-portrait.png
---

# {Title derived from SLUG — title case}

```

Confirm to the user: "File `{CATEGORY_PATH}/{SLUG}.md` created."

---

### Step 5 — Run the content interrogation

This is a grill-me style interview focused on extracting the raw material for the post.

**Internal analysis (do not show to user):**

From **TOPIC** and what the user has shared so far, identify the most important unknowns:

1. **Core thesis** — What is the one main idea or insight this post should leave the reader with?
2. **Target audience** — Who is this for? What do they already know? What do they need to get?
3. **Key concepts** — What are the essential ideas, terms, or frameworks to cover?
4. **Concrete examples** — Are there examples, analogies, or use cases that make it click?
5. **Existing sources** — Are there books, papers, talks, tools, or URLs the user wants to reference?
6. **Angle / perspective** — Is there a unique take, a comparison, a personal story, or a contrarian view?
7. **Scope** — What should this post NOT cover? What's out of scope?
8. **Visuals** — Are there diagrams, tables, or images that would help explain the content?

Select the **N_QUESTIONS** most critical unknowns and formulate direct, specific questions for each.

**Rules for the interrogation questions:**
- Phrase them as "What is X?" or "Do you want to include Y?" — not open-ended essays
- Provide 3–4 plausible options per question; the user can always choose "Other" for free text
- If N=4, cover only core thesis + audience + key concepts + examples
- If N=6, add sources + angle
- If N=12, cover all 8 above plus depth on examples, scope, and visuals

**Launch the interrogation in rounds of max 4 questions per `AskUserQuestion` call.**

Before the first round, tell the user:
> "Starting content interrogation — {N_QUESTIONS} questions, from most critical to most granular."

Accumulate all answers as **INTERVIEW_ANSWERS**.

---

### Step 6 — Delegate to the research agent

Once all rounds are complete, spawn the `research` subagent using the `Agent` tool with `subagent_type: research`.

Pass this context in the prompt:

```
Post topic: {TOPIC}
File path: {CATEGORY_PATH}/{SLUG}.md
Category: {CATEGORY_PATH}
Branch: feature/post-{SLUG}
Today's date: {today YYYY-MM-DD}

User's answers from the content interrogation:
{INTERVIEW_ANSWERS — formatted as Q: / A: pairs}

Task: Research, enrich, and write the complete post following the instructions in your agent definition.
```

Tell the user: "Handing off to the research agent — it will search for sources and write the full post."
