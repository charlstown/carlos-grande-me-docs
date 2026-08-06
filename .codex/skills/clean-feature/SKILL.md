---
name: clean-feature
description: Cleans up completed feature folders by aligning root specs, confirming deletion, closing linked GitHub issues, deleting specs folders, and committing the cleanup. Use when the user asks to clean completed feature folders or invokes $clean-feature.
---

# clean-feature

## Purpose

Clean up completed feature folders only after their plans are done, while keeping root specs and GitHub issue state aligned with the implemented work.

## Workflow

1. Detect the user's language from their latest message and keep the run in that language.
2. Find `specs/*/plan.md` and classify plans as completed when they have no `- [ ]` tasks left. `- [blocked]` may exist and should be noted.
3. If no completed plan exists, stop.
4. If exactly one completed folder exists, proceed automatically. If several exist, ask the user which ones to clean.
5. For each selected folder, read:
   - `requirements.md`, if present
   - `plan.md`
   - the git log touching that folder
6. Build a short summary of the implemented changes and extract any linked GitHub issue number.
7. Audit relevant root specs. Review only the specs that the completed work could have affected, such as:
   - `specs/product-spec.md`
   - `specs/tech-spec.md`
   - `specs/css-spec.md`
   - `specs/ui-spec.md`
   - `specs/infra-spec.md`
   - `specs/security-spec.md`
   - `specs/roadmap.md`
8. For each relevant spec, detect whether it is aligned or needs surgical edits.
9. Apply only the required alignment edits and update the spec metadata date.
10. Show a summary of updated specs and the folders about to be deleted.
11. Ask the user whether to proceed with deletion and commit.
12. If confirmed, delete the selected feature folders.
13. Close linked GitHub issues only when the required spec alignment gate has passed.
14. Commit and push the cleanup to `dev`.

## Constraints

- Only delete folders whose plan has no pending `- [ ]` tasks.
- Audit and edit specs surgically. This is not a broad docs rewrite.
- If pushing fails because `dev` diverged, stop and report the exact error. Do not force push.
- Deleting folders and closing issues are separate gates. A spec alignment failure can keep an issue open while still allowing folder deletion.

## Closing

Report:

- deleted folders
- updated specs
- closed issues
- any folders whose issues stayed open because alignment failed
- the cleanup commit and push result

Do not print a next-step suggestion block.
