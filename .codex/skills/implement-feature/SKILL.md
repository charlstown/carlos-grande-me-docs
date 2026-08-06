---
name: implement-feature
description: Orchestrates one or more feature plans using isolated git worktrees, sequential or limited parallel execution, task state updates, retries, and PR creation. Use when the user asks to implement a plan or invokes $implement-feature.
---

# implement-feature

## Purpose

Execute pending `plan.md` tasks as an orchestrator. This skill coordinates work; it should delegate individual implementation tasks instead of doing all coding inline.

## Workflow

1. Detect the user's language from their latest message and keep the interaction in that language.
2. Find `specs/*/plan.md` files and count pending `- [ ]` tasks.
3. Stop if no plan has pending tasks.
4. Verify whether `git worktree` is available.
5. Ensure `.worktrees/` is listed in `.gitignore`.
6. Always ask the user which plans to run, even if there is only one.
7. If multiple plans are selected, analyze likely dependencies by looking for:
   - shared files
   - cross references between requirements and plans
   - matching batch dependencies
8. Ask whether to run sequentially or in parallel with up to two workers. Recommend sequential when dependencies exist.
9. Create one isolated worktree per selected plan. Use branch names derived from the folder names.
10. Run each plan:
   - sequentially, one plan at a time, or
   - in parallel batches of two plans maximum
11. For each pending task:
   - build context from the task line, batch title, plan excerpt, and worktree path
   - intercept `@human` tasks and pause for user action instead of executing them
   - otherwise delegate the task to the best fitting agent or a general implementation worker
   - if the task completes, mark it `[x]`
   - if it blocks, retry once
   - if it blocks again, mark it `[blocked]` with a reason and stop that plan
12. Commit after finishing each batch.
13. When a plan is fully complete:
   - push the branch
   - open a PR against `dev`
   - close the linked issue when applicable
   - remove the worktree
14. If a plan ends blocked, remove the worktree but do not open a PR.

## Constraints

- Always prefer an isolated worktree while tasks are in flight.
- Never execute `@human` tasks on the user's behalf.
- Persist plan status to disk after each task.
- One delegated worker per task. Do not group unrelated tasks.

## Closing

For each plan, report:

- tasks completed this session
- tasks previously completed
- blocked tasks
- remaining tasks
- PR URL, if created

If multiple plans ran, also print a global summary table.

Only when every selected plan completed successfully, suggest `$clean-feature`.
