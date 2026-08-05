---
short_title: My AIsy Toolkit
description: A copy-paste catalog of skills and subagents that turns Spec-Driven Development and agentic loops into one closed-loop workflow, no install required.
date: 2026-08-04
thumbnail: assets/images/thumbnails/my-aisy-toolkit-portrait.png
---

# My AIsy Toolkit

I spent a while looking for a framework that was simple enough to actually use every day but complete enough to cover the whole journey — Spec-Driven Development in the style of [spec-kit](https://github.com/github/spec-kit), and agentic-loop / worktree management in the style of [Sandcastle](https://github.com/mattpocock/sandcastle). I never found one that did both without piling on steps and ceremony, so I built my own. **My AIsy Toolkit** is a copy-paste catalog of skills and subagents I now use daily — no install, no package manager, just a prompt.

--8<-- "assets/html/my-aisy-toolkit-flow.html:diagram"

---

## 1. Why this exists

Most SDD tooling stops at specs and plans. Most agentic-loop tooling stops at sandboxing and worktrees. I wanted one flow that starts at "I have an idea" and ends at "it shipped and the specs still match reality" — without switching tools halfway through.

That's the thesis: this isn't just SDD, and it isn't just loop orchestration. It's a single closed loop that covers both, and it works the same way regardless of what you're building.

If you've read my [8 levels of AI development](../cheatsheets/my-8-levels-of-ai-development.md) post, this toolkit is where I put that framework into practice. The default profile operationalizes **Phase B → Phase C**: `/specify-feature` through `/clean-feature` is Spec-Driven Development (levels 3-4), and the subagent catalog plus git-worktree isolation is the first concrete step into **level 5 (Subagents)** and **level 6 (Multiagents)** — a lead agent delegating verifiable waves of work to specialists on isolated branches. I won't re-explain the framework here; go read that post if you want the full map.

The repo keeps growing — new skills get added as I need them. This post won't try to catalog every one of them; it explains the mechanism that doesn't change.

## 2. Install it in one prompt

There's nothing to `npm install` or `pip install`. You paste one prompt into your agent's conversation and it fetches and follows the setup instructions itself:

```text
Fetch and follow the setup instructions at https://raw.githubusercontent.com/charlstown/my-aisy-toolkit/main/setup-ai.md
```

That's the entire installation. Side effects are contained to `.claude/` and/or `.codex/` in the target repo — nothing global, nothing to uninstall system-wide. It works natively with **Claude Code**; **Codex CLI** support is best-effort, since Codex has no subagent equivalent and only the skills catalog gets translated over.

> Re-running the same prompt on a repo that already has the kit installed pulls the latest catalog version — new skills get added, changed ones get updated. There's no semantic versioning to track; the prompt is always pointed at `main`.

## 3. The default profile — a closed loop

The default profile is 10 skills, but the useful way to think about it isn't a list — it's a loop.

### 3.1 Bootstrapping

`/constitution` runs once per project and scaffolds three files: `specs/product-spec.md`, `specs/tech-spec.md`, and `specs/roadmap.md`. These are the shared source of truth every subsequent skill reads from and writes back to. `/product-spec`, `/tech-spec`, and `/roadmap` also exist as standalone entry points, so you can regenerate any one of the three on its own without re-running the whole bootstrap.

### 3.2 The feature loop

Every feature after that goes through the same five-step cycle:

| Skill | What it does |
|---|---|
| `/specify-feature` | Scopes the feature — what, and why |
| `/clarify-feature` | Closes decision gaps before anything gets planned |
| `/plan-feature` | Breaks the feature into a `plan.md` |
| `/implement-feature` | Builds it, isolated in a git worktree |
| `/clean-feature` | Aligns the specs with what actually shipped |

`/clean-feature` is what makes this a loop and not a pipeline: it closes the current feature by reconciling the specs, and that updated state is what `/specify-feature` reads from on the next feature. There's also `/new-issue` as a lightweight standalone entry point when all you need is a scoped issue on the repo, not a full spec.

![My AIsy Toolkit — default skill cycle](../../assets/images/resources/my-aisy-toolkit-skill-cycle.svg){ .image-width-24 }

### 3.3 Worktree isolation

`/implement-feature` doesn't build on your working branch — it builds in a **git worktree**, an isolated checkout of the repo on its own branch. That's the piece borrowed directly from Sandcastle's approach to agentic loops: the agent can work, fail, retry, and leave a messy history in its own worktree without ever touching your main working directory. You review and merge when it's done, not before.

## 4. The subagent catalog

Claude Code gets six subagents on top of the skills — Codex CLI has no equivalent primitive, so this part is Claude Code only. They cover the roles you'd expect across a feature's lifecycle: discovery and design before anything gets built (`architect`), implementation for backend and full UI screens (`code-developer`, `ui-developer`), test writing separated from test running (`test-developer` writes tests without running them, `tester` runs them and verifies real behavior), and review (`judge`, which reads another agent's work and returns a `PASS` or `CHANGES_REQUESTED` verdict).

The point isn't the specific six — it's that the lead agent has specialists to delegate to instead of doing everything itself in one long conversation.

## 5. Utils pack — three extra tools

On top of any profile, an optional `utils` pack adds three standalone skills I reach for outside the feature loop:

- **`/grill-me`** — critically interrogates a document to close gaps and inconsistencies, then rewrites it with what it learned.
- **`/for-dummies`** — explains a concept from a prompt, a link, or a document like an expert teacher would, with examples.
- **`/digest`** — turns a vague doubt into a short interrogation plus brief web research, and returns a recommendation with an alternative.

There's also an optional `ui-ux` profile that adds two more skills for interrogating UI/UX decisions before specifying a screen — it exists if you need it, but it's out of scope for this post.

---

If any of this sounds like your daily workflow, the install prompt above is the whole barrier to entry. I use this exact catalog every day and keep extending it as new gaps show up — if you hit one yourself, or something behaves differently than described here, [open an issue on the repo](https://github.com/charlstown/my-aisy-toolkit/issues/new).

## References

Crosley, B. (2026, July 28). *Claude Code CLI: The complete guide*. Blake Crosley. https://blakecrosley.com/guides/claude-code

DeepLearning.AI. (2026). *Spec-driven development with coding agents* [Course]. https://www.deeplearning.ai/courses/spec-driven-development-with-coding-agents

FlorianBruniaux. (2026). *Claude Code ultimate guide* [GitHub repository]. GitHub. https://github.com/FlorianBruniaux/claude-code-ultimate-guide

GitHub. (2026). *Spec-kit* [GitHub repository]. https://github.com/github/spec-kit

Grande, C. (2026). *My AIsy toolkit* [GitHub repository]. GitHub. https://github.com/charlstown/my-aisy-toolkit

Pocock, M. (2026). *Sandcastle* [GitHub repository]. GitHub. https://github.com/mattpocock/sandcastle

## Further reading

- [My AIsy Toolkit — GitHub repo](https://github.com/charlstown/my-aisy-toolkit) — The full catalog, always up to date.
- [The 8 levels of AI note](../cheatsheets/my-8-levels-of-ai-development.md) — The framework this toolkit puts into practice.
- [Spec-Driven Development with Coding Agents](https://www.deeplearning.ai/courses/spec-driven-development-with-coding-agents) — DeepLearning.AI × JetBrains course on the constitution → spec → plan → implement workflow.
- [Sandcastle](https://github.com/mattpocock/sandcastle) — The git-worktree agentic-loop tool that inspired the isolation model here.
- [Claude Code Ultimate Guide](https://github.com/FlorianBruniaux/claude-code-ultimate-guide) — Beginner-to-power-user reference with production-ready templates and a cheatsheet.
