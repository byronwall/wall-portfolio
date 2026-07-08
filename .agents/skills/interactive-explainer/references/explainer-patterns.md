# Explainer Patterns

Use this reference when choosing the explanatory structure for an interactive technical article. Copy the teaching pattern, not the surface style.

## Pattern Selection

- Physical mechanism, geometry, spatial structure, optics, mechanics, rendering, networks: use the Bartosz Ciechanowski pattern.
- Algorithm, data structure, graph, grid, map, geometry, game-dev system: use the Red Blob Games pattern.
- Social model, incentive system, feedback loop, emergence, game theory: use the Nicky Case pattern.
- Machine learning, research concept, math-heavy model internals: use the Distill / PAIR pattern.
- Beginner statistical or machine-learning introduction with a concrete dataset: use the R2D3 pattern.
- Software internals, infrastructure, runtime behavior, queues, caches, retries, load balancing: use the Sam Rose pattern.
- Abstract concept that needs multiple synchronized representations: use the Bret Victor active-essay pattern.

## Bartosz Ciechanowski Pattern

Use for physical systems, geometry, rendering, optics, mechanics, networks, or anything with hidden spatial structure.

Typical flow:

1. Start with the real object or full mechanism.
2. Let the reader inspect, rotate, scrub, zoom, or look inside.
3. Reduce to the minimal core that still works.
4. Rebuild one part at a time.
5. Reuse the same colors, labels, camera angles, and animation conventions.
6. Reassemble the full system once the parts are understood.

Best when the topic has physical parts, spatial relationships, motion, hidden dependencies, or many named components that would overwhelm the reader if introduced all at once.

Failure risk: beautiful mechanism tour without enough reader agency. Add scrubbing, toggles, labels, and prediction prompts.

## Red Blob Games Pattern

Use for algorithms, data structures, geometry, maps, graphics, game development, and systems where the reader can manipulate inputs.

Typical flow:

1. Start from a practical problem.
2. Use a small working model.
3. Let the reader directly manipulate inputs.
4. Show computed outputs immediately.
5. Reveal intermediate state such as frontier, costs, neighbors, queues, or constraints.
6. Layer variants and edge cases gradually.

Best when the topic has inputs, outputs, intermediate algorithm state, variants, tradeoffs, edge cases, and practical implementation relevance.

Failure risk: turning the article into a tool before the reader knows the concept. Start with one small grid, graph, or example before adding controls.

## Nicky Case Pattern

Use for systems thinking, social dynamics, game theory, incentives, networks, and conceptual models.

Typical flow:

1. Start with an emotionally or narratively interesting question.
2. Turn the idea into a playable model.
3. Ask the reader to predict, choose, or experiment.
4. Let the system produce the lesson.
5. Explain after the reader has felt the behavior.
6. Climb from concrete play to abstract principle.

Best when the topic has feedback loops, emergence, competing strategies, incentives, social dynamics, behavioral dynamics, or counterintuitive aggregate effects.

Failure risk: hands-on activity without learning. The interaction must make the reader think, not merely click.

## Distill / PAIR Pattern

Use for machine learning, math-heavy research, model internals, and subjects where readers need to connect formal theory with live behavior.

Typical flow:

1. State the conceptual problem.
2. Show the model, mathematical object, or data structure.
3. Give the reader manipulable representations.
4. Connect code, data, diagrams, equations, and explanation.
5. Let the reader test hypotheses.
6. Show where the representation succeeds and where it misleads.

Best when the topic has formal models, data, parameters, multiple representations, and behavior that changes under interventions.

Failure risk: too many simultaneous abstractions. Coordinate views carefully and keep one representation primary at a time.

## R2D3 Pattern

Use for statistical or machine-learning introductions.

Typical flow:

1. Start with a concrete dataset.
2. Make the invisible model visible.
3. Use staged explanation.
4. Introduce one model behavior at a time.
5. Keep early interaction gentle and guided.
6. Move from example data to general lesson.

Best when the topic has a beginner-friendly dataset, classification or prediction, visual separability, a sequence of model decisions, and a risk of abstract vocabulary arriving too early.

Failure risk: scroll staging that becomes passive. Add light interaction, prediction, or comparison at key turns.

## Sam Rose Pattern

Use for software internals and programming concepts.

Typical flow:

1. Start from the simplest possible case.
2. Build bottom-up.
3. Add one implementation detail at a time.
4. Use friendly diagrams and small simulations.
5. Keep the reader close to practical developer intuition.
6. End with implementation tradeoffs and transfer.

Best when the topic has queues, caches, hashing, memory, networking, retries, load balancing, protocol behavior, runtime behavior, or invisible infrastructure.

Failure risk: becoming an implementation dump. Keep each code sample tied to a visible model change.

## Bret Victor Active-Essay Pattern

Use when the reader needs to move between concrete examples and abstract structure.

Typical flow:

1. Keep multiple representations visible or close together.
2. Let edits in one representation update the others.
3. Show cause and effect immediately.
4. Make the system deterministic enough to reason about.
5. Use direct manipulation where possible.

Best when the topic has code plus visualization, data plus model, graph plus equation, example plus rule, or concrete plus abstract views.

Failure risk: coordinated views can become visually dense. Use progressive disclosure and highlight only the representation currently being taught.
