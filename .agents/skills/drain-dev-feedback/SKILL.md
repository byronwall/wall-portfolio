---
name: drain-dev-feedback
description: Safely process development-feedback notes stored as one JSON file per note in a repository queue. Use when an agent must claim feedback, implement the requested route or target change, ask anchored questions, preserve annotation history, and move the note to completed or failed.
---

# Drain Dev Feedback

Process one feedback note at a time. Keep the note traceable from inbox, through implementation, to its final queue state.

## Discover the queue

1. Inspect repository instructions, `git status`, and the feedback root before editing. Preserve unrelated changes.
2. Treat `.dev-feedback/inbox/` as the source queue. Discover `*.json` files and inspect one record and nearby records before assuming field names or status metadata.
3. Locate the matching `processing/`, `completed/`, `failed/`, and `annotations/open/` directories. Use the repository’s existing naming and annotation format.
4. Validate the selected JSON before acting. A malformed record is a failure to report, not a reason to discard it.

## Claim exactly one note

Claim before reading the note in detail or changing source files. Use an atomic move on the same filesystem:

```sh
source=".dev-feedback/inbox/$name"
claimed=".dev-feedback/processing/$name"
test -e "$source" || exit 0
test ! -e "$claimed" || exit 0
mv -n "$source" "$claimed"
test ! -e "$source" && test -e "$claimed" || exit 0
```

Use the actual filename, not a glob that could claim several notes. Treat a failed move or a source that disappeared as “another agent claimed it”; do not retry by copying it. Never overwrite an existing processing record.

## Read and implement

After claiming, read the complete JSON record. Identify all of these before editing:

- The requested feedback and its note ID.
- The route or page context.
- Every redundant target anchor, such as target ID, label, selector, source URL, or coordinates.
- Any existing status, claim, answer, or history fields.

Treat route and target context as safety checks. If they conflict, are missing, or do not identify a unique target, stop implementation and ask an anchored question. Do not guess from nearby UI.

Implement only the requested feedback. Keep the change scoped to the identified route and target. Do not add cleanup, redesign, refactors, or unrelated fixes. Preserve the note’s original wording and all existing history.

## Resolve ambiguity with annotations

When ambiguity blocks a correct change, create an anchored question in `annotations/open/` using the existing annotation format. Include the note ID, route, redundant target anchor, the exact ambiguity, and the smallest decision Byron must provide. Keep the claimed note in `processing/` while waiting; do not mark it completed or failed merely because it needs an answer.

Before resuming, read the answer attached to the annotation or its corresponding resolved annotation, following the repository’s existing convention. Re-check that the answer belongs to the same note, route, and target. Preserve the open question, answer, resolution, and every prior annotation event. Never delete an annotation or history record unless Byron explicitly requests deletion.

## Verify and finish

Run the narrowest relevant static checks and focused browser checks against the existing development server, normally `http://localhost:3010/`. Follow `AGENTS.md`. Never run `pnpm build`, `next build`, or another production build as proof that the site works.

Only after the requested change passes verification, move the record from `processing/` to `completed/` with an atomic move. Preserve the original fields and append completion metadata only when the queue’s existing format supports it.

If implementation or verification fails, preserve the original note and move it from `processing/` to `failed/`. Include a specific failure reason, failing command or check, and useful evidence in the established failure metadata format. Do not replace the note with a summary. If the queue has no format, retain every original field and add clear top-level failure metadata without deleting the original text.

Do not move a note to `failed/` when the only blocker is an unanswered question. Keep it in `processing/` and report that it is waiting for an answer.

## Handle stale claims safely

Never reclaim a record from `processing/` only because it is old. First inspect its claim owner, timestamp, heartbeat, and any repository-defined lease. If the lease is explicitly expired and no active owner remains, recover it with a no-clobber atomic move back to `inbox/`, then claim it normally. The recovery winner must verify that the source still exists and the destination does not.

If the queue has no reliable lease or owner signal, treat the claim as active or unknown. Leave it in `processing/` and create an anchored question or report the blocker to Byron. This avoids two agents implementing the same note.

Never delete queue records, annotation records, or history. Moving between queue states is the normal lifecycle; deletion requires Byron’s explicit request.
