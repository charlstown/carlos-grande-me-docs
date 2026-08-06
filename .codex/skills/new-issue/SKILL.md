---
name: new-issue
description: Opens a GitHub bug or feature issue after classifying the request, gathering enough evidence or clarification, and confirming the final content with the user. Use when the user asks to open a new issue or invokes $new-issue.
---

# new-issue

## Purpose

Open a GitHub issue and nothing else. This skill must not modify repository files, commit code, or push branches.

## Rules

- GitHub is the only write target.
- Never write or edit files in the repo.
- Never run `git commit` or `git push`.
- Every issue title must start with `[BUG]` or `[FEAT]`.
- Keep the entire interaction in the user's language.

## Workflow

1. Classify the user's request as Bug or Feature.
2. If the type is ambiguous, ask the user which type they want to open.

### Bug flow

1. Capture the bug description from the command argument or the user's message. If missing, ask for it.
2. Investigate the code using repo search and file reads.
3. Review recent relevant commits.
4. If the problem is UI-facing, try to reproduce it locally and collect evidence such as screenshot, console errors, and failed network requests.
5. Build a bug report with:
   - title
   - description
   - steps to reproduce
   - expected behavior
   - actual behavior
   - evidence
   - involved files
   - cause hypothesis
   - environment
6. Confirm the final issue content with the user.
7. Create the issue with `gh issue create`, using the `bug` label only if it exists.

### Feature flow

1. Capture the feature description from the command argument or the user's message. If missing, ask for it.
2. Check whether the what, why, and scope are clear.
3. If any of those are unclear, ask up to three clarification questions in one round.
4. Build a feature request with:
   - title
   - description
   - desired behavior
   - acceptance criteria
   - additional context
5. Confirm the final issue content with the user.
6. Create the issue with `gh issue create`, preferring the `enhancement` label and falling back to `feature` or no label.

## Closing

After issue creation, report the issue number and URL, then point the user to `$specify-feature`.
