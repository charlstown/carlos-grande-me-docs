---
name: write-deck
description: Create embedded HTML decks with connected interactive steps, diagrams, animations, or games. Use when the user invokes write-deck or requests this kind of step-based interactive content.
---

# Write Deck

Build a connected sequence inside an HTML frame. Use the user's language and preserve their content, order and established interaction choices.

## Define the sequence

Without a description, interview from the broad idea down: purpose, approximate number of steps, known content, then each step's message, elements and connections. Ask focused questions in manageable groups. Reuse answers and materials already provided. With an adequate description, implement it and ask only about gaps that prevent progress.

Distinguish navigation steps from process phases. A sequence may revisit a phase with new content. A drawn process loop does not make navigation wrap.

## Deliver and integrate

Create decks in `docs/assets/decks/` in this repository. Page insertion is a separate task, performed when requested. Delimit the embeddable portion with `<!--8<-- [start:diagram]-->` and `<!--8<-- [end:diagram]-->`. Later insertion uses `--8<-- "assets/decks/<file>.html:diagram"` relative to `docs/`. This is a Snippets include, not an iframe API; do not rebuild the site's embedding system.

Use the expand/close icons and viewport-filling interaction of `docs/assets/html/my-aisy-toolkit-flow.html` (embedded in `docs/resources/tools/my-aisy-toolkit.md`). Restore actual prior scroll and focus state on close. Read the relevant shell; deck content remains independent of page internals.

## Shared contract

Read [design-and-motion.md](references/design-and-motion.md) before implementation.

Before delivery, check a per-step acceptance list against the user's brief, including retained elements, connector endpoints, labels, colors and transition order. Passing navigation tests does not establish fidelity: a fade/reveal cannot stand in for a requested shared-element move or transposition. Report incomplete effects explicitly.

- Use a restrained modern design, host light/dark surfaces and dynamic accent, meaningful outline icons (Heroicons where appropriate), and clear hierarchy.
- Place large borderless previous/next chevrons at the vertical centers of the sides and expand at the upper right. Retain generous click targets and visible keyboard focus.
- Navigation is finite: hide unavailable directions. Support left/right keys when focused or expanded; preserve native keys in editable and scrollable content.
- Let users click phase names/icons to jump directly to them. Resolve repeated phases with the user's chosen navigation; do not silently add extra buttons.
- Show the requested content immediately. Decorative transitions run independently and remain interruptible; repeated input counts rather than being ignored.
- Use real buttons, localized accessible labels, current-state semantics and a phase indicator that does not rely solely on color.

## Implementation and verification

Scope styles, keyframes, queries and IDs per component. Use unique SVG marker IDs per instance. Keep navigation state, measured layout and animation lifecycles explicit, with a single source for related data where practical.

On removal, restore expanded-page state, remove global and media-query listeners, disconnect observers and cancel timers, frames and animations. Handle reduced-motion preference changes during playback by resolving the current visual state immediately.

Verify in a real browser when available: desktop, 320/375 px, short landscape fullscreen, both themes, all steps, direct jumps, rapid input, resize, keyboard/focus, dynamic reduced motion, two instances and removal while expanded. Measure visible bounds; DOM tests alone do not establish visual correctness. Run required site checks and report exact limitations.

Generalize the style to the requested content: a perimeter loop, six phases, a neural network and particular durations are example choices, not requirements for every deck.
