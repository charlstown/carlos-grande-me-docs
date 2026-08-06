---
name: product-spec
description: Creates or updates specs/product-spec.md by reading repo context, asking exactly three product questions, and writing a structured Product Spec. Use when the user asks for a product spec or invokes $product-spec.
---

# product-spec

## Purpose

Create `specs/product-spec.md`, the document that defines the product's what and why without drifting into technical implementation detail.

## Workflow

1. Detect the user's language from their latest message and keep the entire interaction in that language.
2. Read existing context in parallel when present:
   - `specs/product-spec.md`
   - `specs/tech-spec.md`
   - `specs/roadmap.md`
   - `README.md`
   - dependency manifests such as `package.json`, `requirements.txt`, `pyproject.toml`, `go.mod`, `Cargo.toml`
3. Before writing anything, ask exactly three product questions covering:
   - Scope: what product, module, or service this spec covers; what is in and out of scope; what interfaces or operations it exposes
   - Decisions: primary user, user pain, guiding design principles, consciously excluded features
   - Context: tone, naming rules, style constraints, open questions, future ideas outside current scope
4. After the interview, read only the extra source files needed to fill gaps accurately, such as:
   - `src/`, `app/`, `lib/`, or equivalent for project structure
   - entry points, routes, handlers, and commands for interfaces
   - config and env files for configuration
5. Write `specs/product-spec.md`.

## Required structure

Write sections in this order. Omit only sections that truly do not apply.

1. Metadata callout
2. Vision
3. Problem Statement
4. Target User
5. Design Principles
6. Architecture
7. Interfaces
8. Configuration
9. Operations
10. Deliverables
11. Project Structure
12. Out of Scope
13. Future
14. Discovery

## Content rules

- Keep Vision to 1-2 sentences.
- Use a Mermaid flowchart for Architecture.
- Interfaces should describe public operations and their parameters in plain product terms.
- Do not invent technical details that belong in the Tech Spec.
- Mark unknown fields with `-` or `TBD` instead of guessing.
- Keep the output to a single file.

## Closing

If the file was written successfully and this skill was run directly by the user, suggest `$tech-spec`.

If this skill was run as part of `$constitution`, do not print a suggestion block.
