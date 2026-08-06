---
name: aisy.for-dummies
description: Explains up to three concepts from a vague prompt, link, or document in plain language with analogies, examples, and optional free resources. Use when the user asks for an explanation in simple terms or invokes $aisy.for-dummies.
---

# aisy.for-dummies

## Purpose

Explain unfamiliar concepts clearly enough that a smart beginner can follow them, with real examples and optional free resources.

## Workflow

1. Detect the user's language from their latest message and keep the run in that language.
2. Capture the thing to explain from:
   - a direct prompt
   - a file or pasted document
   - a URL, fetched live
3. Internally identify candidate concepts.
4. If the user explicitly named one or two concepts, explain those directly.
5. If there are three or fewer concepts after cleanup, explain all of them.
6. If there are more than three, print the full list and ask the user which ones to cover, up to three. Ask this at most once.
7. Do light research for each selected concept, preferring official sources.
8. Explain each concept in order, using this pattern:
   - one-sentence plain-language definition
   - analogy
   - how it actually works
   - one concrete example
   - common confusion
   - optional resources, up to three

## Constraints

- Never explain more than three concepts in one round.
- The example is mandatory for every concept.
- Research is required but should stay light.
- Never invent sources, URLs, versions, or figures.
- Resources are optional. The explanation must stand on its own without them.

## Closing

Offer to go deeper on one concept, expand an example, or compare it against alternatives. If concepts were deferred because of the three-concept cap, name them.
