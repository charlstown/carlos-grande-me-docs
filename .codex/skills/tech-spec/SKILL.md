---
name: tech-spec
description: Creates or updates specs/tech-spec.md through context reading, a structured technical interview, and a final write confirmation. Use when the user asks for a tech spec or invokes $tech-spec.
---

# tech-spec

## Purpose

Create `specs/tech-spec.md`, the document that answers how the product is built: stack, architecture, data, integrations, operations, and key technical decisions.

## Workflow

1. Detect the user's language from their latest message and keep the entire interaction in that language.
2. Read existing context in parallel when present:
   - `specs/tech-spec.md`
   - `specs/product-spec.md`
   - `specs/roadmap.md`
   - dependency manifests
   - database schema files
   - CI and deploy config
   - source tree structure
3. Internally map:
   - what already exists in code and config
   - what the Product Spec already decided
   - what is missing
   - what appears inconsistent
4. Show the user that the interview is organized into six rounds:
   - Technical scope and boundaries
   - Stack and versions
   - Architecture and modules
   - Data and integrations
   - Operations
   - Decisions, tradeoffs, and Discovery
5. Ask the user how deep the interview should be:
   - 5 questions, quick
   - 8 questions, balanced
   - 12 questions, exhaustive
6. Distribute the question budget across the six rounds based on the largest real gaps.
7. Ask one question at a time, sequentially. Never bundle separate technical questions into the same turn after the intensity choice.
8. Use concrete, context-aware options whenever possible. Never invent dependency versions.
9. After the interview, read only the extra code or config needed to fill unresolved technical sections accurately.
10. Show a short session summary table.
11. Ask whether to:
   - write the full file now
   - revisit a round
   - write only the key sections with the rest marked TBD
12. If approved, write `specs/tech-spec.md`.

## Required structure

Write sections in this order. Omit only those that truly do not apply.

1. Metadata callout
2. Scope
3. Tech Stack
4. Module Design
5. Database Schema, only if there is a database
6. Integration Mapping
7. Error Handling
8. Healthcheck
9. Logging
10. Testing Strategy
11. Deployment
12. Dependencies
13. ADRs
14. Known Limitations
15. Discovery

## Content rules

- Use Mermaid for diagrams.
- Never invent versions. Use exact versions from manifests, or mark them TBD.
- The Tech Spec must not repeat the Product Spec's what and why.
- Module responsibility lines should stay concise.
- Keep output to a single file.

## Closing

If the file was written successfully and this skill was run directly by the user, suggest:

- `$roadmap`, optional
- `$specify-feature`

If this skill was run from `$constitution`, suppress that suggestion block.
