This folder contains project-scoped Codex agents for this repository.

Files in `.codex/agents/*.toml` are local to the repo and replace the role
definitions currently stored in `.claude/agents/*.md`.

Catalog:

- `architect.toml`: architecture, discovery, decisions, and decomposition
- `planner.toml`: implementation planning from `requirements.md` to `plan.md`
- `code-developer.toml`: production code implementation
- `ui-developer.toml`: front-end design and implementation
- `test-developer.toml`: test authoring without execution
- `tester.toml`: test execution and diagnosis
- `code-reviewer.toml`: focused code review
- `judge.toml`: binary quality gate
- `research.toml`: research and post writing
- `translator.toml`: EN/ES translation and parity checks

The existing `.codex/skills` prompts should prefer this folder when they need
to discover repo-local agents.
