---
name: interactive-explainer
description: Create, critique, or improve deep interactive technical explainers, active essays, explorable explanations, canvas/SVG/WebGL demos, visual algorithm guides, model visualizations, or educational blog posts where prose, code, and interactive diagrams build a mental model. Use when asked to make an explainer feel like Bartosz Ciechanowski, Red Blob Games, Nicky Case, Distill, R2D3, Sam Rose, Bret Victor-style active essays, or when improving interactivity, visual pedagogy, hidden-state diagrams, animations, sliders, panning/zooming, hover layers, hit testing, or large-data canvas examples.
---

# Interactive Explainer

Use this skill to build interactive technical explainers where the reader can think inside the model. The goal is not to decorate prose with animation. The goal is to turn an invisible mechanism into something the reader can inspect, manipulate, predict, and transfer.

## References

Keep this `SKILL.md` focused on the operating procedure. Load these references only when they match the task:

- Read `references/explainer-patterns.md` when choosing an exemplar structure, adapting a known explorable-explanation style, or diagnosing why the article flow feels wrong.
- Read `references/interaction-rubric.md` when designing a suite of interactives, reviewing an explainer for publication quality, choosing control types, or checking accessibility, performance, templates, and anti-patterns.

## Core Standard

An interactive explainer should make the reader feel:

- I can see the hidden mechanism.
- I can predict what happens next.
- I can test my intuition.
- I understand how the pieces interact.
- The hard idea now feels inevitable.

Use interactivity when the reader needs to manipulate a system, observe cause and effect, compare cases, step through time, reveal hidden state, test a prediction, or move between concrete examples and abstract rules.

Do not add an interactive unless it changes the reader's mental model.

## Recommended Flow

Use this sequence unless the topic strongly suggests another structure:

1. Hook with a concrete question.
2. Show the whole system briefly.
3. Strip to the smallest working model.
4. Teach one mechanism in isolation.
5. Add complexity one layer at a time.
6. Ask the reader to predict before explaining.
7. Reveal hidden state.
8. Compare alternatives or failure modes.
9. Reassemble the full system.
10. End with transfer: where this pattern applies elsewhere.

Avoid opening with definitions, historical background, a taxonomy, prerequisites, or a giant fully labeled diagram.

## Choose an Exemplar Pattern

Pick one primary explanatory style, then adapt the structure rather than copying surface aesthetics:

- **Bartosz Ciechanowski**: physical systems, geometry, rendering, optics, mechanics, networks, hidden spatial structure. Show the whole mechanism, reduce to core parts, rebuild piece by piece, reuse visual language.
- **Red Blob Games**: algorithms, data structures, geometry, maps, graphics, game development. Start with a practical problem, use a small model, let the reader manipulate inputs, show computed outputs and intermediate state.
- **Nicky Case**: systems thinking, incentives, game theory, social dynamics. Start with a compelling question, make a playable model, let the system produce the lesson, explain after the reader feels the behavior.
- **Distill / PAIR**: machine learning, math-heavy research, model internals. Connect code, data, diagrams, formal representations, and hypotheses.
- **R2D3**: statistical or machine-learning introductions. Use a concrete dataset, staged explanations, and gentle guided interaction.
- **Sam Rose**: software internals. Build bottom-up from the smallest case, add one implementation detail at a time, keep practical developer intuition close.
- **Bret Victor**: abstraction bridges. Keep multiple representations synchronized so text becomes an environment for thinking.

## Interactive Design Contract

Define this for each interactive before implementation:

- **Concept**: What idea does it teach?
- **Reader action**: What can the reader manipulate?
- **System response**: What changes immediately?
- **Hidden state**: What invisible bookkeeping becomes visible?
- **Takeaway**: What should the reader understand afterward?
- **Failure mode**: What misconception does this prevent?
- **Fallback**: What static or reduced-motion view still explains the point?

If one field is weak, simplify or remove the interactive.

## Section Rhythm

Use this rhythm for each major concept:

```md
## <Concept>

<One-sentence motivation.>

<Minimal definition in plain language.>

<Interactive>

Try this:
- <Action 1>
- <Action 2>

Notice:
- <Observation 1>
- <Observation 2>

This happens because <causal explanation>.

This matters because <connection to larger system>.
```

Do not go more than one major concept without a visual or interactive. Keep controls near the effect they change.

## Progressive Complexity

Early sections should isolate one aspect:

- one object
- one input
- one output
- one visible causal relationship
- one new control

Middle sections can introduce two interacting aspects. Explicitly say what was held constant before and what now varies.

Later sections can become a sandbox, but only after the reader already knows the parts.

## Visual Grammar

Establish a stable visual grammar before building:

- Semantic color: each color means one thing across the article.
- Stable shapes: circles, rectangles, arrows, dashed outlines, handles, labels each carry meaning.
- Stable layout: inputs left, process middle, output right; or another deliberate spatial metaphor.
- Stable motion: fade means new, pulse means active, ghost means previous/future, slider means deterministic time.
- Stable labels: short, close to the object, reused consistently.

Do not make the reader relearn the visual language in every section. Remove legends when labels, placement, or direct manipulation make the meaning obvious.

## Controls And Layout

Controls should make actions obvious without looking like a dashboard dump.

- Put primary action presets close to the canvas, usually above or below it.
- Use a small icon or symbol on action buttons so they read as clickable actions.
- Keep hidden-state readouts in a side panel when space allows.
- Keep toggles with the state they control.
- Keep zoom/pan affordances consistent across all canvases in the same article, even if only one section emphasizes camera math.
- Prefer minimal zoom controls over bulky toolbars. A top-right overlay such as `- 1.00x +` is enough.
- If one canvas supports pan or zoom, strongly consider giving every related canvas the same behavior.
- Avoid repeated explanatory cards when the interactive and surrounding prose already teach the idea.

For widened interactives inside narrow prose columns:

- Let the interactive bleed beyond the prose width when the content needs room.
- Center the bleed so extra pixels split evenly left and right.
- Cap the width before either side clips offscreen.
- Use a smaller centered bleed for simple preview interactives.

## Canvas Explainers

For canvas-based explainers, teach the DOM and the model separately.

Show a minimal DOM slice early:

```tsx
<div className="canvas-shell">
  <canvas ref={baseCanvasRef} aria-label="base" />
  <canvas ref={overlayCanvasRef} aria-label="overlay" onPointerMove={handlePointerMove} />
</div>
```

Then explain that canvas pixels are not the source of truth. The application owns a scene model and the canvas is only an output surface.

### Recommended Canvas Ladder

1. **Whole loop preview**: pointer event -> coordinate transform -> hit test -> redraw.
2. **Single scene model**: boxes, arrows, points, or nodes as data.
3. **Hit testing**: convert screen coordinates to world coordinates, then test against geometry.
4. **Overlay layer**: base canvas for stable scene, overlay canvas for hover/selection/crosshair/tooltips.
5. **Camera math**: pan and zoom by transforming world-to-screen and screen-to-world.
6. **Performance scale-up**: real high-count example, not just prose.
7. **Animation**: deterministic time slider plus `requestAnimationFrame` advancing that slider.

### Canvas Interaction Rules

- Keep model state separate from rendered pixels.
- Use `screenToWorld` and `worldToScreen` everywhere, including hit testing and tooltips.
- Use pointer capture during drag-pan.
- Support pan and zoom consistently across related canvases.
- Keep hover and transient affordances cheap, often on an overlay canvas.
- Batch rendering with `requestAnimationFrame` when events can arrive faster than frames.
- Show hidden state: world coordinates, camera, hit target, candidate count, grid cells, active layer, time.
- For zoom, support a minimal visible control and optionally command/control-wheel zoom around the pointer.

Example camera math:

```ts
function worldToScreen(point, camera) {
  return {
    x: point.x * camera.scale + camera.x,
    y: point.y * camera.scale + camera.y,
  };
}

function screenToWorld(point, camera) {
  return {
    x: (point.x - camera.x) / camera.scale,
    y: (point.y - camera.y) / camera.scale,
  };
}
```

### Large Canvas Data

Do not tease large-scale performance without rendering a real example.

For a 10,000-point scatter explainer:

- Actually draw 10,000 points.
- Show a hidden-state readout for point count, candidate count, grid cell count, seed, and mode.
- Provide actions that visibly change the data, such as random clusters and random everywhere.
- If randomizing clusters, move the cluster centers. Local jitter alone reads as shimmer, not a new layout.
- Use a grid, quadtree, R-tree, or similar spatial index for hover lookup instead of scanning all points every pointer move.
- Convert screen-radius hover tolerance into world units: `radius / camera.scale`.

### Animation

Teach animation as explicit time, not magic motion.

Use a deterministic slider as the canonical state:

- `t = 0`: initial state.
- `t = 1`: target state.
- Drawing a frame interpolates model state from `from` to `to`.
- The `requestAnimationFrame` loop only advances `t` as browser frames allow.

For 10,000 animated points:

- Precompute deterministic source and target positions.
- Render each frame from `from + (to - from) * easedTime`.
- Let the user scrub the same `t` with a slider.
- Add play/pause and reset.
- Loop random -> clustered -> random when useful.

Example:

```ts
function frame(now) {
  const delta = now - previousNow;
  previousNow = now;

  t += direction * (delta / 2000);

  if (t >= 1) {
    t = 1;
    direction = -1;
  }

  if (t <= 0) {
    t = 0;
    direction = 1;
  }

  requestAnimationFrame(frame);
}
```

The draw function should remain deterministic:

```ts
for (let i = 0; i < count; i += 1) {
  const x = randomX[i] + (clusterX[i] - randomX[i]) * t;
  const y = randomY[i] + (clusterY[i] - randomY[i]) * t;
  ctx.fillRect(x - 1, y - 1, 2, 2);
}
```

## Quality Rubric

Score the explainer from 1 to 5:

- **Hook**: concrete question rather than definitions.
- **Concept decomposition**: smallest working model, then one new mechanism at a time.
- **Interaction purpose**: readers test predictions and reveal hidden state.
- **Causal clarity**: every control has an immediate, legible effect.
- **Visual consistency**: colors, labels, layout, and controls are reused.
- **Progressive complexity**: no dashboard dump before scaffolding.
- **Hidden state visibility**: internal bookkeeping is visible.
- **Reader agency**: meaningful alternatives, edge cases, and failure modes.
- **Synthesis**: final section returns to the original question and transfers the pattern.
- **Craft**: feels like a polished learning environment, not a demo.

Do not publish until:

- the first interactive appears early,
- every interactive has a teaching purpose,
- the article works without expert prerequisites,
- visual grammar is consistent,
- at least one interactive reveals hidden state,
- at least one interactive asks the reader to predict or compare,
- at least one edge case or performance boundary is real,
- reduced-motion/static fallback is considered,
- desktop and mobile layouts have been checked visually.

## Validation Workflow

When implementing in a repo:

1. Inspect existing article/component patterns first.
2. Build small reusable components rather than one giant dashboard.
3. Keep prose width readable and allow interactives to center-bleed only when needed.
4. Test with the browser, not only TypeScript.
5. Capture desktop and mobile screenshots or equivalent visual checks.
6. Verify text does not overflow controls.
7. Verify canvases are nonblank and interactive.
8. Verify all controls affect visible state.
9. Run the repo-appropriate typecheck or tests.
10. Avoid expensive or destabilizing build commands if the user says not to run them.

When a dev server is already running, do not restart it unless necessary. If a production build corrupts a dev cache, clear only generated cache after approval.
