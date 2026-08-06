---
short_title: My AIsy Toolkit
description: A copy-paste catalog of skills and subagents that turns Spec-Driven Development and agentic loops into a single closed-loop workflow, no install required.
date: 2026-08-04
thumbnail: assets/images/thumbnails/my-aisy-toolkit-portrait.png
social:
  cards_layout_options:
    background_image: docs/assets/images/thumbnails/my-aisy-toolkit-portrait.png
    background_color: transparent
---

# My AIsy Toolkit

I spent a while looking for a framework simple enough to actually use every day, but complete enough to cover the whole journey: Spec-Driven Development in the style of [spec-kit](https://github.com/github/spec-kit), and worktree-based agentic-loop management in the style of [Sandcastle](https://github.com/mattpocock/sandcastle). I never found one that did both while staying simple, so after a lot of trial and error across different development patterns, I ended up publishing my own. **My AIsy Toolkit** is a catalog of skills and subagents that install at the repository level and that I use every day.

[Source repo](https://github.com/charlstown/my-aisy-toolkit){ .md-button .text-center target="_blank" }

If you've read my post on the [8 levels of AI](../cheatsheets/my-8-levels-of-ai-development.md), this toolkit covers everything from **level 3 (Agent mode)** and **level 4 (CLI first)** of Spec-Driven Development, up through **level 5 (Subagents)** and **level 6 (Multiagents)**: a lead agent delegating verifiable waves of work to specialists on isolated branches.

---

## 1. Installation

I could have packaged this as a library with proper install packages, but since it's a public repo and I wanted maximum simplicity, I set it up so all you need to do is paste one prompt into your agent's conversation: it fetches and follows the setup instructions itself.

!!! tip "Paste this prompt into your CLI agent's chat"

    ```text
    Fetch and follow the setup instructions at https://raw.githubusercontent.com/charlstown/my-aisy-toolkit/main/setup-ai.md
    ```

**Compatible with the following agents:**

<div class="grid cards" markdown>

- [:simple-claude: __CLAUDE CLI__](https://code.claude.com/docs/en/quickstart){ target="_blank" }
- [:fontawesome-brands-openai: __CODEX CLI__](https://learn.chatgpt.com/docs/codex/cli#getting-started){ target="_blank" }

</div>

> *It can be installed on other agents too, just tell it in the prompt to adapt the skills to that agent's own documentation.*

## 2. How it works

The whole skill cycle is designed as a closed loop, and it starts with `/constitution`: a living document that stays with the product for its whole life and pins down what it is and how you're going to build it. Once that's in place, the loop starts turning: you specify the features you want to add, plan them, and implement them, one at a time. When a feature is done, `/clean-feature` realigns that living document with what you actually just built, and the whole thing starts over from there.

--8<-- "assets/html/my-aisy-toolkit-flow.html:diagram"

### 2.1 Skill catalog

The first four bootstrap the loop (or regenerate a single piece of the living document on its own); the next five are the cycle that repeats for every feature:

| Phase | Skill | What it does | Example |
|---|---|---|---|
| 1 | `/constitution` | Bootstraps `product-spec.md`, `tech-spec.md`, and `roadmap.md` | `/constitution` |
| 1 | `/product-spec` | Regenerates just the `product-spec.md` | `/product-spec` |
| 1 | `/tech-spec` | Regenerates just the `tech-spec.md` | `/tech-spec` |
| 1 | `/roadmap` | Recalculates the `roadmap.md` phases | `/roadmap` |
| 2 | `/specify-feature` | Scopes the feature: the what and the why | `/specify-feature "add dark mode to the dashboard"` |
| — | `/clarify-feature` | Closes decision gaps before anything gets planned | `/clarify-feature specs/003-dark-mode/requirements.md` |
| 3 | `/plan-feature` | Breaks the feature down into a `plan.md` | `/plan-feature specs/003-dark-mode/requirements.md` |
| 4 | `/implement-feature` | Builds it, isolated in a git worktree | `/implement-feature` |
| 5 | `/clean-feature` | Aligns the specs with what actually shipped | `/clean-feature` |

### 2.2 Agent catalog

`/implement-feature` doesn't do the work alone: `/plan-feature` already decided which subagent owns each task, and `/implement-feature` just spins them up and hands out their share.

| Agent | What it does |
|---|---|
| `architect` | Researches, evaluates alternatives, and designs the solution before anything gets implemented |
| `code-developer` | Implements backend or general-purpose code from an already-clear plan |
| `ui-developer` | Designs and implements full screens, from visual concept to component |
| `test-developer` | Writes tests without running them |
| `tester` | Runs the tests and verifies the app's actual behavior |
| `judge` | Reviews another agent's work and returns `PASS` or `CHANGES_REQUESTED` |

---

If any of this sounds like your daily workflow, the install prompt above is the whole barrier to entry. I use this exact catalog every day and keep extending it as new gaps show up; if you hit one yourself, or something behaves differently than described here, [open an issue on the repo](https://github.com/charlstown/my-aisy-toolkit/issues/new).

## 3. Further reading and resources

| Resource | Description |
|---|---|
| [Claude Code CLI: The complete guide](https://blakecrosley.com/guides/claude-code) | Blake Crosley's complete guide to Claude Code CLI |
| [The 8 levels of AI](../cheatsheets/my-8-levels-of-ai-development.md) | The framework this toolkit puts into practice |
| [Spec-Driven Development with Coding Agents](https://www.deeplearning.ai/courses/spec-driven-development-with-coding-agents) | DeepLearning.AI × JetBrains course on the constitution → spec → plan → implement workflow |
| [Sandcastle](https://github.com/mattpocock/sandcastle) | The git-worktree agentic-loop tool that inspired the isolation model here |
| [Claude Code Ultimate Guide](https://github.com/FlorianBruniaux/claude-code-ultimate-guide) | Beginner-to-power-user reference with production-ready templates and a cheatsheet |

## References

- DeepLearning.AI. (2026). *Spec-driven development with coding agents* [Course]. https://www.deeplearning.ai/courses/spec-driven-development-with-coding-agents
- FlorianBruniaux. (2026). *Claude Code ultimate guide* [GitHub repository]. GitHub. https://github.com/FlorianBruniaux/claude-code-ultimate-guide
- GitHub. (2026). *Spec-kit* [GitHub repository]. https://github.com/github/spec-kit
- Pocock, M. (2026). *Sandcastle* [GitHub repository]. GitHub. https://github.com/mattpocock/sandcastle
