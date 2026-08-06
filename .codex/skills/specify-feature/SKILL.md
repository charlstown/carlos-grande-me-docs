---
name: specify-feature
description: Detects one or more feature candidates from a file, URL, roadmap, GitHub issues, or free text, then creates numbered specs/*/requirements.md files that preserve ambiguity as explicit definition gaps. Use when the user asks to specify a feature or invokes $specify-feature.
---

# specify-feature

## Purpose

Turn already-existing feature descriptions into `requirements.md` files. This skill documents ambiguity instead of resolving it.

## Workflow

1. Detect the user's language from their latest message and keep the run in that language, except for fixed metadata labels such as `Feature Branch`, `Created`, and `Status`.
2. Detect the source of the feature input, in this priority order:
   - explicit file path
   - explicit GitHub issue URL
   - explicit GitHub repo URL, meaning "use GitHub issues"
   - other URL
   - free text prompt
   - `specs/roadmap.md`
   - open GitHub issues in the current repo
3. Normalize each detected feature into:
   - title
   - raw description
   - source tag
   - `source_issue_url`, only when it was resolved from a real GitHub issue during this run
4. If exactly one unambiguous feature was found, proceed automatically.
5. Otherwise, print the candidate list, ask the user which ones to develop, and default to all if the answer is empty or unclear.
6. Assign numeric prefixes by scanning existing `specs/*` folders and continuing from the highest `NNN-` prefix.
7. Build a kebab-case slug for each selected feature and create `specs/{NNN}-{slug}/requirements.md`.
8. Generate one requirements file per selected feature. Features are independent, so parallel generation is acceptable when the environment supports it.

## Required template

Each `requirements.md` must contain:

1. Feature name
2. Feature Branch
3. Source Issue, only when `source_issue_url` is non-null
4. Created date
5. Status
6. Input
7. User Scenarios and Testing
8. Edge Cases
9. Requirements
10. Key Entities, only if relevant
11. Success Criteria
12. Assumptions
13. DEFINITION GAP

## Content rules

- Never invent decisions not supported by the source.
- Every unresolved ambiguity belongs in `DEFINITION GAP`.
- `DEFINITION GAP` must always contain at least one item. If nothing is unclear, explicitly mark that no blocking gaps were detected.
- Keep the `Source Issue:` line only when the issue URL was truly resolved during this run. Never reconstruct it from memory or repo naming.

## Closing

After generation, report:

- the folders created
- any skipped folders that already existed
- how many definition gaps each generated file contains

Then suggest:

- `$clarify-feature`, optional
- `$plan-feature`
