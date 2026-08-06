---
name: plan-feature
description: Reads a requirements.md file, asks only the critical unresolved questions that code inspection cannot answer, discovers repo agents when present, and generates a plan.md with task checkboxes and optional agent attribution. Use when the user asks to plan a feature or invokes $plan-feature.
---

# plan-feature

## Purpose

Generate `plan.md` for a selected feature folder, turning requirements into an ordered implementation plan.

## Workflow

1. Detect the user's language from their latest message and keep the run in that language.
2. Resolve the target `requirements.md`:
   - use the provided path if present
   - otherwise search `specs/*/requirements.md`
   - if several exist, ask the user which one to plan
3. Read the selected requirements file.
4. Evaluate whether there are 1-3 critical gaps that the planner cannot resolve by reading the codebase or existing patterns.
5. If there are critical gaps, ask all of them in a single round. If there are none, do not ask.
6. Discover repo-specific agents by scanning `.codex/agents/*.toml` first. If none exist, fall back to `.claude/agents/*.md`. Build a catalog from each agent's `name` and `description`.
7. Generate `plan.md` in the same folder as the requirements file.

## Task format

Every task must be a checkbox:

- With repo agents available:
  `- [ ] @agent-name · Short task name: detailed description.`
- Without repo agents:
  `- [ ] Short task name: detailed description.`

## Planning rules

- Do not edit `requirements.md`.
- Attribute each task to the best-fitting real agent when an agent catalog exists.
- If there is no agent catalog, omit agent attribution completely.
- The plan should be specific enough that `$implement-feature` can execute it.

## Closing

Report:

- the generated `plan.md` path
- how many tasks or batches were created
- whether repo agents were used and how tasks were distributed
- any user clarifications that materially affected the plan

Then suggest `$implement-feature`.
