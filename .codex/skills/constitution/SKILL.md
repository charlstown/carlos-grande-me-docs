---
name: constitution
description: Bootstraps the repo's core specs by running $product-spec, then $tech-spec, then $roadmap in order. Use when the user asks to found the project specs, bootstrap specs, or invokes $constitution.
---

# constitution

## Purpose

Create or refresh the repo's root specs in the only valid order:

1. `specs/product-spec.md`
2. `specs/tech-spec.md`
3. `specs/roadmap.md`

`$tech-spec` depends on `product-spec.md`, and `$roadmap` depends on both earlier specs. Never run these in parallel.

## Workflow

1. Detect the user's language from their latest message and keep the entire run in that language.
2. Check whether these files already exist:
   - `specs/product-spec.md`
   - `specs/tech-spec.md`
   - `specs/roadmap.md`
3. If any file exists, ask the user what to do:
   - Regenerate all from scratch
   - Only run what is missing
   - Cancel
4. If the user cancels, stop.
5. If the user chose "only run what is missing" and all three files already exist, stop and tell them there is nothing to bootstrap. Point them to `$product-spec`, `$tech-spec`, `$roadmap`, or `$clean-feature` as appropriate.
6. Run the required skills strictly in order:
   - `$product-spec`
   - `$tech-spec`
   - `$roadmap`
7. Only run a step if it is due based on Step 3's decision.
8. Wait for each child skill to fully finish and confirm that its target file exists before continuing.
9. Suppress child skill closing suggestions. This skill prints the single closing block for the whole run.
10. If `$roadmap` fails or does not write `specs/roadmap.md`, stop and report the failure without a summary block.

## Success condition

Only when every due step succeeded and wrote its file, close with a short summary in the user's language:

```text
+ specs/product-spec.md
+ specs/tech-spec.md
+ specs/roadmap.md

Done. Suggested next step:

$specify-feature to turn the next thing to build into a feature spec.
```

## Constraints

- Never interview the user on behalf of the child skills. Any product or technical questions belong inside those skills.
- Never run the three child skills in parallel.
- Never overwrite existing root specs without first asking when any of them already exist.
