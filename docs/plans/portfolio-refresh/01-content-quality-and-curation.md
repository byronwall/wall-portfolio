# Content quality and curation plan

## Goal

Make the public archive show useful, human-reviewed work. Keep the blog from
becoming a chronological dump of generated notes.

## Current evidence

The memo sets this direction:

- The site should reflect capability, not become a “dumping ground” (source
  memo, `00:04–00:31`).
- Some older posts read as obviously AI-written. The proposed remedy is an
  edit-date pass, the voice skill, and a human voiceover review (`02:02–02:57`).
- The preferred public material is interesting explainers and process notes.
  Deep technical dives should not receive automatic promotion (`04:46–05:17`).
- Find My AI Fit and the soccer project are named as examples of process posts
  that may deserve a pin or feature (`05:15–06:39`).
- The list layout assumes a good image. The memo prefers a real artifact and
  treats a diagram or no-image treatment as a last resort (`00:47–01:58`).

The repository has 38 blog posts. Twenty-two declare an `image` field, and 21
contain a body image or image component. The rest rely on the fallback path in
`app/blog/utils.ts` or render without a content image.

`app/blog/page.tsx` renders every post from `getBlogPosts()` in publication-date
order. `app/blog/utils.ts` infers a category when `type` is absent. The home
page uses the existing `featured` field, but the blog index does not expose a
curated view. The repository already contains the
`.agents/skills/write-byron-voice/` skill. Its current local changes are user
work and must remain intact.

Git history gives the review cutoff. Commit
`91407757c8277f77c5cb5f488dce71224db55b25` added the skill on
`2026-07-09T23:02:33-04:00`. Use that repository-history date, not frontmatter
as the cutoff. Twenty of the current 38 post records have `publishedAt` before
the cutoff date.

## Scope

- Audit every post before changing its prose.
- Review the old-post queue first: posts with `publishedAt` before
  `2026-07-09`, the calendar date discovered from repository history.
- Use the voice skill as an editing aid, then perform a human voiceover pass.
- Record a clear outcome for each post: keep, revise, combine, park, or remove.
- Keep existing `project` and `type` metadata accurate where the relationship
  is clear. Do not add a new public explainer taxonomy.
- Select a small set of explainers and process notes for promotion.
- Require an image for every public blog index item. Prefer meaningful evidence.
  Use a placeholder only when no meaningful image exists, and track every such
  item in the editorial inventory.
- Use `featured` as the only promotion flag. All included content is public.

## Non-goals

- Do not rewrite all 38 posts in one batch.
- Do not remove deep technical posts from the archive by default.
- Do not generate decorative images when a real artifact does not exist.
- Do not add blog filters or a new Reference route in this slice.
- Do not add draft, unlisted, or private publication states.
- Do not add public voiceover audio or a new explainer taxonomy.
- Do not publish directly from a transcript or an agent output.

## Proposed implementation

Create a private editorial inventory during implementation. Each row should
include the post slug, publication and update dates, project, type, image
source, review result, sensitivity result, and promotion result.

Use this queue rule and review order:

1. Use `git log --follow --reverse` on the voice-skill path to establish the
   cutoff commit and date.
2. Put a post in the old-post queue when its `publishedAt` date is before
   `2026-07-09`. The current queue contains 20 posts.
3. Review queued posts in `publishedAt` order, then path order for ties. Do not
   use filesystem timestamps to define the queue.
4. Review posts that lack a useful image or accurate existing metadata.
5. Review candidate explainers and process notes for promotion.
6. Leave deep technical posts in the archive unless they earn promotion on
   their own merits.

For each reviewed post:

- Read the full post and its source material.
- Check claims, first-person statements, names, links, and project context.
- Run the voice-skill review and then read the draft aloud.
- Remove generic AI phrasing, unsupported certainty, and empty summaries.
- Preserve useful uncertainty and concrete technical evidence.
- Add or select a meaningful image when one exists.
- If no meaningful image exists, use the approved placeholder and record the
  slug and reason in the editorial inventory.

Use the existing `featured` field for on-site promotion. Keep category
inference as a fallback. Do not add public labels for “explainer,” “process
note,” or other new categories in this pass.

## Affected files or systems

| Area | Planned work |
| --- | --- |
| `app/blog/posts/*.mdx` | Human review, metadata backfill, selected image references, and promotion flags. |
| `content/projects/*.mdx` | Check project summaries and images when a post promotes a project story. Do not rewrite project pages in this slice. |
| `app/blog/utils.ts` | Keep thumbnail and existing metadata handling aligned with the image requirement. Do not add visibility states. |
| `app/blog/page.tsx`, `app/blog/blog.module.css` | Render the selected metadata and the tracked placeholder treatment for items with no meaningful image. |
| `app/page.tsx` | Keep home featured content aligned with the approved curation set. |
| `public/images/posts/**` | Store only useful, owned, or stable visual evidence. |
| `.agents/skills/write-byron-voice/**` | Read as the review dependency. Preserve all existing user changes. |

## Stages

1. Build the editorial inventory and identify the first review batch.
2. Review the first batch for voice, factual support, project identity, and
   sensitivity.
3. Resolve image readiness for every public index item. Track placeholder use.
4. Select the first explainer and process-note set. Record why each item earns
   promotion.
5. Apply metadata and any small rendering change required by the chosen
   image/promotion policy.
6. Repeat the process in smaller batches. Do not make a bulk rewrite the
   default workflow.

## Acceptance criteria

- Every post has a recorded editorial outcome.
- The first review batch has human approval after a voiceover pass.
- Every public blog index item has a meaningful image or a tracked placeholder.
- Promoted posts have a clear project link when applicable, summary, canonical
  URL, and `featured` flag when selected.
- The archive still contains useful deep technical work, but promotion is
  based on reader value rather than recency alone.
- The home page and blog index do not show stale or accidental featured items.
- No draft, unlisted, or private publication state is introduced.
- No change touches the existing modified voice-skill files unless explicitly
  requested in a later implementation task.

## Verification

- Use `rg` to audit `project`, `featured`, and `image` coverage before and
  after the batch.
- Re-run the Git-history lookup and the `publishedAt < 2026-07-09` queue query.
  Confirm the cutoff commit, date, and 20-item count.
- Read the reviewed posts aloud and record the human review result.
- Check `/blog`, `/blog/[slug]`, and `/` in the existing development server.
- Check at least one post with a real image and one without a usable image.
- Check the generated OG route for a promoted post and its fallback state.
- Run only narrow static checks. Do not use `pnpm build` as verification.

## Dependencies

- Confirm the first promotion set. The memo names examples, but it does not
  define the final list.
- Confirm ownership and safety for candidate images.

## Risks

- A bulk voice pass can make distinct posts sound formulaic.
- Image generation can hide the absence of real evidence.
- Promotion can reward recency or visual polish instead of reader value.
- Manual review can become a one-time cleanup instead of a repeatable gate.
- Metadata changes can expose a mismatch between a post and its project page.
