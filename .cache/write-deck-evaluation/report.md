# Write Deck — independent generation trial

## Method

The worker started without conversation history. It received the Codex skill path and a seven-step next-token brief. It was prohibited from reading the finished reference deck, its tests or other agents' outputs. It owned only this isolated evaluation directory. The artifact was not inserted into the site.

The trial used the first enriched version of the skill; after review, the skill gained an explicit fidelity checklist and screenshot/transition comparisons. That final addition has not been evaluated with a second blind generation.

## Result

Partial success: functional prototype, not a close replacement for the approved deck. The worker reported 35 passing browser assertions, no browser JavaScript errors, and corrected a test timing assumption about asynchronous reduced-motion event delivery.

Verified/reported coverage includes seven steps, finite navigation, phase jumps, softmax, rapid keys, equal network geometry, 320/375 px control bounds, dark mode, short fullscreen close/Escape and removal restoration. Screenshots and machine-readable results are in this directory. The automated bounds checks are not comprehensive pairwise collision tests.

Parent inspection of desktop and narrow screenshots and source confirmed material fidelity gaps:
- Arrowheads remain midway along perimeter segments instead of near destinations.
- The transpose is a row reveal rather than an identity-preserving movement.
- Output tags are recreated rather than moved into the distribution view.
- Some requested details are simplified: phase numbering, standalone ID label, V labels, short vector brackets, and filled/inverted output tags.
- Narrow token and network content uses extensive horizontal scrolling. It is readable, but differs from the reference's more compact token composition.

Two simultaneous instances, 200% zoom, full focus restoration and detailed transition timing were not independently tested. The trial did not run a site build.

## Interpretation

The skill transfers general structure, finite navigation, staged motion, readable IDs and several lifecycle protections. It does not yet ensure close visual fidelity from a textual brief alone. A visual baseline and explicit element-by-element/transition acceptance checks are still needed. Do not treat this one trial as a reliability estimate across models or arbitrary diagrams.

## Time and cost

Worker-measured time: 7 min 5 sec from skill read through final verification; 5 min 40 sec to create HTML. Latest browser pass: 1.691 sec. These figures are not total conversation elapsed time.

Skill size before the last fidelity addition: 505 words in SKILL.md and 735 in the reference, measured from the files. Actual billed tokens and session cost are not exposed by the available tools; no currency cost or fabricated token total is reported.

## Artifacts

- [Generated deck](generated.html)
- [Browser results](verification.json)
- [Browser verification script](verify.cjs)
- [Desktop embeddings](desktop-3.png)
- [Desktop processing](desktop-4.png)
- [Narrow embeddings](narrow-320-3.png)
