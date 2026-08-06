---
name: roadmap
description: Generates or updates specs/roadmap.md from the Product Spec and Tech Spec through a short three-question interview and a structured phased plan. Use when the user asks for a roadmap or invokes $roadmap.
---

# roadmap

## Purpose

Create `specs/roadmap.md`, the execution plan that translates the product and technical specs into phases, dependencies, and gates.

## Workflow

1. Detect the user's language from their latest message and keep the entire interaction in that language.
2. Read existing context in parallel when present:
   - `specs/product-spec.md`
   - `specs/tech-spec.md`
   - `specs/roadmap.md`
   - `README.md`
3. Internally determine:
   - whether the Tech Spec includes PoCs that should become Phase 0
   - which features or deliverables exist
   - obvious dependencies
   - natural gates
   - what is explicitly out of scope
4. Tell the user the roadmap is driven by three questions:
   - phase structure
   - tracking system
   - phase gate
5. Ask those three questions sequentially.
6. Show a short session summary table.
7. Ask whether to:
   - generate now
   - adjust an answer
   - write only a skeleton with TBD sections
8. If approved, write `specs/roadmap.md`.

## Required structure

Write sections in this order.

1. Metadata callout
2. Tracking, only if the user uses an external tracker
3. Vision
4. Overview
5. Phase 0, Proof of Concepts, only if PoCs exist in the Tech Spec
6. One section per feature phase
7. Dependency Graph
8. Gates
9. Out of Roadmap

## Content rules

- Use Mermaid for all diagrams.
- Do not invent features. Derive them from the Product Spec, Tech Spec, and their deliverables.
- Do not invent PoCs. Only include them if the Tech Spec explicitly supports them.
- Do not invent estimates.
- Keep output to a single file.

## Closing

If the file was written successfully, suggest `$specify-feature`.
