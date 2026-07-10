---
name: write-byron-voice
description: Draft, revise, or review technical blog posts, project updates, essays, and explanations in Byron Wall's voice. Use when writing portfolio content for Byron, converting his notes or transcripts into prose, cleaning up AI-generated MDX without inheriting its style, or checking a draft for fidelity to Byron's transcript-derived language, reasoning, and technical point of view.
---

# Write in Byron's Voice

Produce readable prose that thinks like Byron without reproducing raw dictation artifacts.

## Protect the voice boundary

- Treat Byron's explicit corrections about his own voice as the highest authority. If a correction conflicts with the profile or transcripts, follow the correction and flag the reference that may need updating.
- Treat voice-memo transcripts as the primary observational evidence of Byron's voice.
- Never infer voice, preferred phrasing, opinions, or personal experience from existing blog or MDX files. Existing prose may be an editing target or a source of topic facts, but it is not voice evidence.
- Use user-supplied notes, code, research, and drafts to ground article-specific claims. Keep that topical evidence separate from the voice model.
- Never invent a first-person anecdote, tool usage claim, result, preference, or strong opinion.
- Preserve uncertainty. Do not upgrade `maybe`, `I think`, or an open question into certainty unless another source supports it.

## Load the voice references

Read [references/voice-profile.md](references/voice-profile.md) and [references/reasoning-and-structure.md](references/reasoning-and-structure.md) before drafting or substantially rewriting prose.

Read [references/phrasing-and-examples.md](references/phrasing-and-examples.md) before drafting or substantially rewriting prose. Use it to calibrate sentence rhythm, transitions, questions, openings, endings, and how much roughness to retain.

Read [references/transcript-evidence.md](references/transcript-evidence.md) when auditing why a voice rule exists, updating this skill from new transcripts, or resolving tension between a draft and the profile.

## Draft in passes

1. Extract the article's supported claims, examples, constraints, open questions, qualifications, and first-person evidence. Distinguish supported material, reasonable inference, and missing support; do not silently fill gaps.
2. Choose the smallest structure appropriate to the genre. Use the relevant pattern in [references/reasoning-and-structure.md](references/reasoning-and-structure.md), but do not force the material through every stage of the default arc.
3. State the practical question or desired end state. Build the outline around the decisions the reader must make.
4. Work through the concrete cases, relevant dimensions, and alternatives the material actually supports. Let examples expose the underlying distinction.
5. Give a provisional recommendation or useful model when the evidence earns one. Include the boundary where it stops working.
6. Draft compact prose. Use headings only when they help navigation; use lists for genuine sets of options, criteria, or steps. Preserve asymmetry when one example or unresolved thread deserves more space.
7. Remove speech debris: `um`, `uh`, repeated setup, false starts, duplicated intensifiers, and recording sign-offs.
8. Run the voice-fidelity check below separately from technical fact-checking.

## Translate speech into prose

Keep:

- The problem-first orientation.
- Concrete scenarios and realistic quantities.
- Question-driven exploration.
- Reframing from a surface feature to the constraint that matters.
- Comparisons across scale, data shape, user intent, and operational cost.
- Honest uncertainty and willingness to leave a thread open.
- Plain, conversational technical language.

Clean up:

- Repetition used to think aloud.
- Long chains joined only by `and so`, `but then`, or `so then`.
- Fragments caused by transcription errors.
- Ritual openings such as `Alright, here we go.`
- Endings such as `Okay, enough for now.`
- Spoken exaggeration such as `really, really, really`; retain at most one intensifier when it earns emphasis.

## Review for fidelity

Flag and revise:

- Generic AI framing, promotional language, or polished-but-empty transitions.
- A suspiciously complete structure in which every section follows the same scenario, contrast, and recommendation pattern.
- Repeated rhetorical questions, `not X but Y` reframes, tidy groups of three, or uniformly sized paragraphs used as mannerisms rather than reasoning.
- Excessive headings, em dashes, abstract nouns, or transitions such as `This is where...` that make the prose feel smoother than the underlying thought.
- A thesis announced without the concrete path that justifies it.
- Universal prescriptions where the evidence supports only a default.
- Toy examples when a realistic application or data-flow example is available.
- Lists of features without explaining what changes with scale, data, or user intent.
- Formal vocabulary that Byron would state more plainly.
- Repetitive summary conclusions. Prefer a final decision rule, unresolved question, or next useful step.
- Editing that removes every blunt judgment, fragment, uneven transition, or open thread until the prose becomes professionally anonymous.

## Run the voice-fidelity check

Before delivering prose, answer these questions internally and revise any failed item:

1. Is every first-person claim supported by the supplied material or an explicit statement from Byron?
2. Does the draft get close to an actual object, tension, or desired result instead of announcing a generic thesis?
3. Does each important recommendation show the observation, example, or constraint that earned it?
4. Are qualifications attached to real uncertainty rather than sprinkled in to imitate speech?
5. Has the prose become more orderly, balanced, or conclusive than the source reasoning supports?
6. If the characteristic phrases were removed, would the reasoning still sound like Byron?

If the source material cannot support an authentic first-person article, produce a clearly marked list of gaps or questions before drafting.
