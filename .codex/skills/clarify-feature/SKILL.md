---
name: clarify-feature
description: Interrogates the user to close open DEFINITION GAP items in one or more requirements.md files, folds the answers into the documents, and removes the gap section when fully resolved. Use when the user asks to clarify a feature or invokes $clarify-feature.
---

# clarify-feature

## Purpose

Resolve only the gaps that are already listed in a feature requirements file. This skill does not hunt for new gaps.

## Workflow

1. Detect the user's language from their latest message and keep the interaction in that language.
2. Resolve the target:
   - direct `requirements.md` path
   - feature folder path
   - slug or name fragment
   - otherwise discover files under `specs/*/requirements.md`
3. Detect open gap sections by finding a `##` heading containing `gap` and unresolved `- [ ]` items beneath it.
4. If no target has open gaps, stop.
5. If there is one target, use it automatically. If there are several, ask whether to process all or a single one.
6. Process targets sequentially, never in parallel.
7. For each target:
   - extract unresolved gap bullets in order
   - build one question per gap, unless two are tightly coupled
   - always offer a "not sure yet" option so a gap can remain open
   - ask in rounds of at most four questions
   - fold answers back into the right sections of the document
   - remove resolved bullets from the gap section
   - delete the whole gap section if everything was resolved
8. Make minimal edits only. Do not rewrite unrelated parts of the file.

## Closing

After all selected files are processed, show a short summary table with:

- feature
- gaps resolved
- gaps still open

If any gaps remain, remind the user they can run `$clarify-feature` again later.

Then suggest `$plan-feature`.
