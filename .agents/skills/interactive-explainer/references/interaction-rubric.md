# Interaction Rubric

Use this reference when designing, critiquing, or polishing the interactive parts of a technical explainer.

## Interaction Spec

Define this before implementing each interactive:

```md
### Interactive: <Name>

Purpose:
- Teaches <specific concept>.

Reader controls:
- <Control 1>
- <Control 2>

Displayed state:
- <Visible state>
- <Hidden/internal state revealed>

Default state:
- <Initial configuration>

Presets:
- <Preset A>: demonstrates <lesson>
- <Preset B>: demonstrates <lesson>
- <Preset C>: demonstrates <lesson>

Expected reader actions:
- <Action>
- <Action>

Key observations:
- <Observation>
- <Observation>

Misconceptions prevented:
- <Misconception>

Fallback:
- Static diagram showing <state>.
- Text summary explaining <takeaway>.
```

If the purpose, hidden state, takeaway, or fallback is weak, simplify or remove the interactive.

## Interaction Types

Choose the least powerful interaction that teaches the concept clearly.

### Direct Manipulation

The reader drags, moves, edits, or places something.

Use for geometry, graphs, pathfinding, physical systems, spatial relationships, and input/output algorithms.

Best when the action maps directly to the concept, the result is immediate, and the control feels like touching the model.

### Slider / Scrubber

The reader changes one continuous value.

Use for time, thresholds, weights, angles, probability, speed, scale, model confidence, or noise.

Best when one variable has a clear causal effect, the reader needs to observe a transition, or the concept involves thresholds or phase changes.

Avoid too many sliders, unlabeled ranges, and effects that are too subtle or delayed to read.

### Stepper

The reader advances one discrete step at a time.

Use for algorithms, queues, parsing, search, sorting, dynamic programming, protocols, and state machines.

Include current step, previous step, next-step preview when useful, reset, play/pause, and speed control for long sequences.

### Layer Toggle

The reader turns layers on or off.

Use for hidden machinery, coordinate systems, model internals, rendering pipelines, network paths, cost maps, and intermediate representations.

Best when the same object has multiple useful views or when all overlays at once would be overwhelming.

### Sandbox

The reader freely experiments with a small model.

Use near the end of a section or article, after the reader knows the parts. A sandbox without scaffolding feels like a toy with no lesson.

### Puzzle Gate

The reader must try something before the explanation continues.

Use sparingly. Best when the concept is counterintuitive, prediction matters, and the reader can try it in under a minute.

### Coordinated Views

Multiple panels update together.

Use for connecting representations: code plus visualization, data plus model, graph plus equation, input plus output plus hidden state.

Best when the same state has multiple meaningful representations and one view helps explain another.

### Scroll-Staged Animation

The reader scrolls through a controlled sequence.

Use for narrative pacing, gentle introductions, statistical explainers, and topics where full freedom would distract early.

Best when the author needs to control attention before opening up exploration.

## Attention Budget

Use these as defaults, not hard rules:

- Hook and motivation: 10-15%.
- Guided explanation, setup, static diagrams, definitions: 20-30%.
- Interactive exploration, prediction, inspection, comparison: 35-50%.
- Synthesis, edge cases, transfer, implementation notes: 10-20%.

Per-section rhythm:

1. One short setup paragraph.
2. One visual or interactive.
3. One instruction.
4. One result explanation.
5. One connection paragraph.

Avoid long stretches of text before the first meaningful visual. For beginner or intermediate readers, do not go more than 2-4 paragraphs without a visual change, more than one major concept without reader interaction, or more than one new control at a time.

## How Interactives Add Value

An interactive should do at least one of these:

- Convert a claim into an experiment.
- Make hidden state visible.
- Reduce memory load by keeping parts labeled, color-coded, and visible.
- Link cause and effect through immediate feedback or scrubbing.
- Show boundary conditions, failure modes, or cases where the method slows down or breaks.
- Connect abstraction levels, from concrete example to intermediate state to formal rule to practical implementation.

## Managing Focus

Early sections should isolate variables aggressively:

- one object
- one input
- one output
- one visible causal relationship
- one new control

Middle sections can introduce two interacting aspects. Say what was held constant before, what now varies, and what interaction to watch.

Later sections can expose the full system. Use visual grouping, stable colors, labels, reset buttons, presets, and interesting-case actions.

Useful preset labels:

- Normal case
- Edge case
- Failure case
- High noise
- Low memory
- Overloaded
- Adversarial
- Slow but accurate
- Fast but risky

## Visual Consistency

Create visual grammar before building:

- Semantic color: each color means one thing throughout.
- Stable shapes: circles, lines, arrows, rectangles, dashed outlines, and solid outlines carry consistent meaning.
- Stable layout: inputs, process, output, time, abstraction, detail, and hidden state have predictable locations.
- Stable motion: fade, pulse, slide, grow, invalid motion, ghost trails, and slow motion have consistent meanings.
- Stable labels: short, close to objects, reused across sections, removed only when color, shape, and placement are sufficient.

Every animation should answer:

- What changed?
- Why did it change?
- Where should the reader look?

## Technical Checklist

Before designing visuals, define:

- state variables
- reader-controllable inputs
- derived values
- rendered outputs
- valid transitions
- interesting presets
- failure states

Prefer deterministic interactions. If randomness matters, show the seed, provide rerun, explain variance, and offer representative presets.

Keep controls near effects. Every nontrivial interactive should have reset, clear default state, useful presets, and optional play or step controls when appropriate.

## Accessibility And Performance

Required:

- keyboard-accessible controls
- reduced-motion fallback
- static fallback image or equivalent summary
- alt text or textual summary
- high contrast
- mobile-aware layout
- fast initial load
- lazy loading for heavy interactives
- no scroll jank
- no requirement for precise pointer movement

## Publication Rubric

Score from 1 to 5:

- Hook quality: concrete question instead of definitions.
- Concept decomposition: smallest working model, then one new mechanism at a time.
- Interaction purpose: prediction, hidden state, intuition, not decoration.
- Causal clarity: every control has an immediate, legible effect.
- Visual consistency: coherent grammar across colors, labels, layout, motion, and controls.
- Progressive complexity: no dashboard dump before scaffolding.
- Hidden state visibility: internal bookkeeping is inspectable.
- Reader agency: meaningful alternatives, edge cases, and failure modes.
- Synthesis: final section returns to the original question and transfers the pattern.
- Craft: polished learning environment, not merely a demo.

Minimum bar before publication:

- first interactive appears early
- every interactive has a clear teaching purpose
- no expert prerequisites are required for the opening sections
- visual grammar is consistent
- one new idea is introduced at a time
- final section returns to the original question
- at least one interactive reveals hidden state
- at least one interactive asks for prediction or comparison
- at least one section shows a failure mode or edge case
- reduced-motion or static fallback is considered

## Anti-Patterns

### Dashboard Dump

A complex panel with many controls appears before the reader knows what matters.

Fix by splitting into smaller interactives, introducing one control at a time, and adding presets.

### Decorative Animation

An animation plays but the reader cannot inspect or reason with it.

Fix by adding pause, scrub, labels, and explanation, or replacing it with a static diagram.

### Mystery Slider

A slider changes the visual, but the causal relationship is unclear.

Fix by labeling the variable, showing numeric value, highlighting changed elements, and explaining expected observations.

### Jargon Wall

The article starts by defining many terms.

Fix by starting with a concrete system, introducing terms only when the object appears, and keeping labels visible.

### Full-System Trap

The explainer shows the complete real-world system too early.

Fix by previewing the full system, then immediately reducing to the smallest working model.

### Toy That Does Not Transfer

The interactive is fun but does not connect back to the real concept.

Fix by adding synthesis after play, mapping toy components to real components, and showing where the toy model breaks.

### Overfree Sandbox

The reader gets total freedom before understanding the system.

Fix by using guided presets first and unlocking free exploration after the components are taught.
