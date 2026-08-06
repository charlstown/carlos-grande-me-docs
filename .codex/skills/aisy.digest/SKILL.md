---
name: aisy.digest
description: Starting from a vague doubt, fear, or reflection, asks up to three clarifying questions, does brief web research, and returns one recommended path plus one honest alternative with justification. Use when the user asks for a digest or invokes $aisy.digest.
---

# aisy.digest

## Purpose

Help the user think through a vague topic by tightening the question, doing light external research, and returning a recommendation plus an alternative.

## Workflow

1. Detect the user's language from their latest message and keep the run in that language.
2. Capture the vague prompt from the user's message. If it is missing, ask what doubt, fear, or reflection they want to digest.
3. Check whether three dimensions are already clear:
   - what to research
   - what kind of sources are useful
   - what decision or context the research should support
4. If any dimension is missing, ask up to three clarification questions in a single round.
5. Do light web research:
   - build 2-4 focused queries
   - review 3-6 relevant and recent sources
   - optionally fetch a few of the strongest sources for more detail
6. If the topic clearly splits into 2-3 distinct research angles, parallelize the research by angle. Otherwise keep it sequential.
7. Synthesize the result into:
   - Context
   - Recommendation, Option A
   - Why
   - Alternative, Option B
   - When to choose it instead
   - Sources consulted

## Constraints

- This is not an implementation skill.
- Ask at most three clarification questions in one round.
- Keep research brief and source-backed.
- Always provide both Option A and Option B.
- Never invent trends, numbers, or sources. If evidence is weak, say so.

## Closing

Offer either to go deeper on one option or to save the digest to a user-specified path.
