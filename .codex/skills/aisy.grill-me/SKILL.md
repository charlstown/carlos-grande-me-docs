---
name: aisy.grill-me
description: Runs a critical interrogation over a document to uncover fatal gaps, inconsistencies, unresolved decisions, and ambiguous scope, then rewrites the document with the user's answers folded in. Use when the user asks for a hard review or invokes $aisy.grill-me.
---

# aisy.grill-me

## Purpose

Interrogate a document aggressively enough to reduce ambiguity, then rewrite it with the learned decisions integrated.

## Workflow

1. Detect the user's language from their latest message and keep the run in that language.
2. Obtain the input document from:
   - a file path
   - pasted content
   - or a user reply if no document was provided
3. Ask the user how deep the interrogation should be:
   - 4 questions
   - 6 questions
   - 12 questions
4. Analyze the document internally for:
   - fatal gaps
   - internal inconsistencies
   - decisions not made
   - implicit assumptions
   - scope ambiguities
5. Select the most critical questions based on the requested depth.
6. Ask them in rounds of at most four questions, from most critical to most granular.
7. Rewrite the original document by:
   - integrating the user's answers
   - resolving inconsistencies
   - making assumptions explicit
   - marking still-open items with a visible unresolved gap marker
8. If the source was a file path, overwrite that file. If it was pasted text, return the rewritten document in chat.

## Constraints

- Keep the original structure and tone.
- Do not invent content the user did not provide.
- If a gap remains unresolved after the interrogation, mark it explicitly instead of guessing.

## Closing

Report:

- where the rewritten document was delivered
- how many gaps were resolved
- how many remain open
- how many inconsistencies were resolved
