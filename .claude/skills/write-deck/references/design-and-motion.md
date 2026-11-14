# Design and motion

## Layout and spacing

Center the complete visible group, including annotations, dimensions and outputs, rather than just its first text row. Reserve separate space for explanation, content, phase labels, controls and progress.

Persistent words and objects keep their horizontal positions between steps. Move their group vertically to introduce annotations, avoiding arbitrary jumps. Align equal rows and headings consistently. Side labels such as ID and dimensions share a separate aligned column.

Center labels on their icons unless requested otherwise. Give content breathing room within its perimeter. Match the visible gaps at both connector ends, accounting for icon backgrounds and arrowheads. Put a clearly visible arrowhead near each destination, rather than in the middle, and match line/head colors. On rounded paths, place icons on straight sections clear of the corners.

Equal network nodes retain equal radii and center spacing. Center every layer on the same vertical axis; more nodes make a taller layer. Distribute horizontal space through inter-layer gaps after reserving room for output labels.

## Theme and typography

Contain the normal panel's z-index values in its own stacking context, so phase labels and controls cannot cover host navigation or floating buttons. The expanded panel may rise above the host intentionally; avoid putting that panel inside an ancestor stacking context that would prevent expansion. Verify layering by scrolling the embed under sticky headers and back-to-top controls in the actual host page.

Use host tokens such as `--md-default-bg-color`, `--md-default-fg-color` and `--md-accent-fg-color` with standalone fallbacks. Respect explicit host theme selection as well as system preference. Derive contrast-adjusted text shades from the accent when necessary; never freeze it to a literal blue or teal.

Use accent for the current operation or result; return other elements to the normal foreground. Define the final colors in each sequence. Active phase labels and underlines change immediately without animation. A discrete underline provides a non-color cue; omit selection halos by default.

Keep icon and control styles consistent. Show only expand while collapsed and only close while expanded. Short conversational explanations can be italic inside the perimeter, above the content; wrap rather than truncate on narrow screens.

Main content is larger than annotations, but avoid inherited em sizes that make IDs illegible: secondary IDs should have a minimum of 12 CSS px. Equal-rank values (such as logits and their counterparts) share type size. Check actual output-tag legibility when small text is requested.

## Responsive behavior

Validate the actual host page in addition to the standalone file. Material's `.md-typeset svg` sets `height: auto` and can override a single-class deck selector; root-scope component rules (for example `.deck-root .deck-track`) so SVG geometry, typography and margins survive host defaults. Explicitly size diagram SVGs and compare their rendered bounds with the node coordinate area. Avoid changing global MkDocs styles to fix one embed. Test both explicit host themes with the system preference set to the opposite theme, including expanded view.

Adapt to the container's available width, including narrow desktop embeds. Preserve complete-group centering after reflow. At 320/375 px, verify phase names, expand control and bottom progress do not collide. Wrap titles at word boundaries and scale or reflow content without shrinking annotations into illegibility.

Prefer fitting a dense diagram as a coherent group within the content area. If scaling, separate logical layout coordinates from rendered coordinates, apply the same scale to matrix, graph and labels, and convert measured source bounds correctly for transitions. Recalculate on container resize and fullscreen changes. Check legibility at the resulting size. Use internal scrolling only when appropriate to the brief or agreed with the user; make it labeled, keyboard-focusable and visibly discoverable, with native arrow-key scrolling. Never clamp layer gaps to zero so all layers overlap.

In short fullscreen viewports, adapt or allow panel scrolling; keep close and navigation reachable. Restore the prior page state on exit. Test visible descendants, not only container rectangles.

## Motion

Logical navigation is independent of presentation. Content, descriptions and phase text update immediately; only the intended objects animate. Preserve the identity and correspondence of elements that move between layouts.

A simple shared-element/FLIP or Web Animations transition is often enough for columns becoming rows. Capture source geometry before hiding it and obtain current geometry synchronously when navigation precedes a scheduled render frame. Provide an immediate accessible fallback.

Stage meaningful dependencies: move existing content, reveal connectors, then new data. Stagger siblings coherently in reading order. Share a clock or named timing constants so related components stay synchronized.

A connector pulse illuminates its arrowhead at arrival. Layer pulses hand off accent from one layer to the next and leave the requested final state visible. Avoid making color the only explanation.

Counters and bars share normalized progress and easing. Use deliberate deceleration for a quick start and slower final increments; prevent rounding from showing the final digit too early. Calculate coherent numbers, such as softmax probabilities summing to 100% within rounding; mark invented data as examples.

Interrupt safely: finish/cancel prior presentation, honor the new destination, clear stale callbacks and remove temporary clones or hidden targets. Do not discard rapid input. Reduced motion skips travel, blinking and waiting. A change of preference during playback resolves all active sequences, including counters and pending text substitutions.

## Verification

When a reference look is requested, compare representative screenshots and transition checkpoints, not only the final frames. In this repository, `docs/assets/decks/next-token-prediction.html` is the first visual example; use it as a visual baseline when appropriate, while keeping its content-specific choices out of unrelated decks. Preserve all requested labels and annotations; do not silently drop elements to simplify layout.

Check arrowhead positions against their destination icons, and verify that persistent values actually move between layouts rather than being replaced with newly revealed rows. Navigation assertions and container bounds alone do not establish these properties. Document any deliberate approximation and any untested contract items.

Check all steps in wide/narrow layouts, short fullscreen, both themes, keyboard and touch; try 200% zoom where practical. Look for collisions, clipped content, unequal endpoint gaps, distorted curves and unbalanced group centering.

Use meaningful regression checks for removal while expanded, multiple instances, early navigation before render and reduced-motion changes during playback. Check data relationships and transposition correspondence.

Primary guidance: [W3C reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), [contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [interaction animation](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions), [Apple motion](https://developer.apple.com/design/human-interface-guidelines/motion), [MDN easing](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/easing-function).
