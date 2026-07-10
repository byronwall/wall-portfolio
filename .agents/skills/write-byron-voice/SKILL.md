---
name: write-byron-voice
description: Draft, revise, or review technical blog posts, project updates, essays, and explanations in Byron Wall's voice. Use when writing portfolio content for Byron, converting his notes or transcripts into prose, cleaning up AI-generated MDX without inheriting its style, or checking a draft for fidelity to Byron's transcript-derived language, reasoning, and technical point of view.
---

# Write in Byron's Voice

Produce readable prose that thinks like Byron without reproducing raw dictation artifacts.

## Protect the voice boundary

- Treat only voice-memo transcripts as evidence of Byron's voice.
- Never infer voice, preferred phrasing, opinions, or personal experience from existing blog or MDX files. Existing prose may be an editing target or a source of topic facts, but it is not voice evidence.
- Use user-supplied notes, code, research, and drafts to ground article-specific claims. Keep that topical evidence separate from the voice model.
- Never invent a first-person anecdote, tool usage claim, result, preference, or strong opinion.
- Preserve uncertainty. Do not upgrade `maybe`, `I think`, or an open question into certainty unless another source supports it.

## Load the voice references

Read [references/voice-profile.md](references/voice-profile.md) and [references/reasoning-and-structure.md](references/reasoning-and-structure.md) before drafting or substantially rewriting prose.

Read [references/phrasing-and-examples.md](references/phrasing-and-examples.md) when calibrating sentence rhythm, transitions, questions, openings, or endings.

Read [references/transcript-evidence.md](references/transcript-evidence.md) when auditing why a voice rule exists, updating this skill from new transcripts, or resolving tension between a draft and the profile.

## Draft in passes

1. Extract the article's supported claims, examples, constraints, open questions, and qualifications. Mark missing support instead of filling it in.
2. State the practical question or desired end state. Build the outline around the decisions the reader must make.
3. Work through concrete cases, relevant dimensions, and alternatives. Let examples expose the underlying distinction.
4. Give a provisional recommendation or useful model. Include the boundary where it stops working.
5. Draft compact prose. Use headings only when they help navigation; use lists for genuine sets of options, criteria, or steps.
6. Remove speech debris: `um`, `uh`, repeated setup, false starts, duplicated intensifiers, and recording sign-offs.
7. Run a voice-fidelity pass separately from technical fact-checking.

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
- A thesis announced without the concrete path that justifies it.
- Universal prescriptions where the evidence supports only a default.
- Toy examples when a realistic application or data-flow example is available.
- Lists of features without explaining what changes with scale, data, or user intent.
- Formal vocabulary that Byron would state more plainly.
- Repetitive summary conclusions. Prefer a final decision rule, unresolved question, or next useful step.

If the source material cannot support an authentic first-person article, produce a clearly marked list of gaps or questions before drafting.
