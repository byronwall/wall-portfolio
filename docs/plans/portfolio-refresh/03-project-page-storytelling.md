# Project page storytelling plan

## Goal

Make selected project pages explain why the work exists, what changed, what was
learned, and what remains. Use voiceover as the source for context that code,
screenshots, and post summaries do not show.

## Current evidence

The memo asks for a manual voiceover pass on project pages. The questions are:
why the project started, what was learned, and what was interesting or unique
(`09:54–10:43`). The memo says the motivation can be small, even simple
curiosity (`10:30–10:43`).

The memo also suggests a diagram that shows projects informing later projects,
with labeled dots, year lanes, connections, and optional monthly zoom
(`10:46–11:50`). The speaker calls this overkill and says it “might be fun.”
The relationship graph is deferred.

The repository already has useful project-page infrastructure:

- `app/projects/[slug]/page.tsx` renders a hero, MDX story, page outline, and
  related posts.
- `app/blog/utils.ts` matches posts through the explicit `project` field.
- `app/blog/[slug]/page.tsx` links articles back to their related project and
  lists more posts from that project.
- Several project files already include `Overview`, `Why it exists`,
  `Evolution and milestones`, `What changed`, `Lessons`, `What I would do
  differently`, and `Next` headings.
- Five project files still contain `project-content-placeholder` blocks.

This plan therefore deepens the story and fills the strongest gaps. It does
not rebuild the existing project/post relationship.

## Scope

- Define a minimum narrative contract for flagship project pages.
- Use a manual voiceover review to fill that contract.
- Start with the projects named or supported by the memo and repository:
  Find My AI Fit, Coach Companion, and Video to Context.
- Replace placeholder sections on the selected pages with specific evidence.
- Use existing related posts as the dated work stream.
- Add only the structured data needed to support a clear story.
- Permit a high-level public mention of Shifty as an interactive
  data-visualization tool. Keep the wording high-level.

## Non-goals

- Do not require every one of the 24 projects to receive the same treatment.
- Do not create the deferred project relationship graph.
- Do not add public voiceover audio or full transcript playback.
- Do not duplicate the complete body of every related post.
- Do not make unsupported claims about private work or project impact.

## Proposed implementation

Use this minimum narrative contract for a flagship page:

1. **Overview** — what the project is now and who it helps.
2. **Why it exists** — the concrete need, curiosity, or constraint that
   started it.
3. **Evolution and milestones** — the few changes that altered its direction.
4. **What changed** — the current result, with screenshots or other evidence.
5. **Lessons** — what the work changed in Byron’s practice or judgment.
6. **What I would do differently** — one or more honest corrections.
7. **Next** — the next useful step, or why the project is complete.

Keep these sections in MDX for the first slice. Use related posts for dated
updates. Add a hand-written milestone only when the event is important and no
post documents it. Do not build a second timeline data model yet.

For each pilot page, record a voiceover that answers the four source questions:

- Why did I do this?
- What did I learn?
- What was interesting or unique?
- What was I curious about?

Then edit the page against the voice skill and verify each claim against the
repository, screenshots, or linked post. Keep the page concise. Let the posts
carry detailed implementation trails.

Use the existing related-post section as the project ledger. Confirm that the
pilot posts have accurate `project` metadata and useful `type` values. Avoid
fuzzy matching by title or tags.

Defer the project relationship graph. Do not collect or expose a second
relationship data model in this delivery slice.

Handle Shifty as a bounded content update when the relevant experience or
project page is edited. Name it as “Shifty, an interactive data-visualization
tool.” Do not include proprietary implementation details, internal screenshots,
or a deeper technical claim.

## Affected files or systems

| Area | Planned work |
| --- | --- |
| `content/projects/find-my-ai-fit.mdx` | Replace the preview-only ending with the full project story. |
| `content/projects/soccer-coach-companion.mdx` | Add motivation, evolution, lessons, and next steps from a reviewed voiceover. |
| `content/projects/video-to-context.mdx` | Replace the remaining placeholder narrative sections and connect the update history. |
| `content/projects/*.mdx` | Audit other placeholder sections after the pilot. Do not bulk-rewrite them. |
| `app/projects/[slug]/page.tsx` | Adjust section labels or related-update presentation only if the pilot exposes a shared UI gap. |
| `app/projects/projects.module.css` | Style any new narrative or update treatment while preserving the current hero/story layout. |
| `app/blog/utils.ts` | Keep exact project-post matching and stable update ordering. |
| `app/blog/posts/*.mdx` | Correct pilot `project` or `type` metadata only where repository evidence supports it. |
| `app/experience/data.ts`, `app/experience/[slug]/page.tsx` | Provide the high-level Shifty wording in the appropriate experience narrative when that page is implemented. |

## Stages

1. Audit the three pilot pages, their related posts, images, and source links.
2. Record one voiceover per pilot using the four source questions.
3. Draft the seven narrative sections and mark unsupported or sensitive claims.
4. Replace placeholders and add the smallest useful historical images or
   links.
5. Verify the project page and each related post as one connected story.
6. Capture lessons from the pilot before deciding whether to extend the
   contract to more projects.

## Acceptance criteria

- Each pilot page answers why it exists, what changed, what was learned, what
  would change next time, and what comes next.
- No pilot page shows `Content coming soon` placeholders in the story.
- Each dated update belongs to the correct project and appears in stable order.
- Images support a claim or a change. They do not act as decoration only.
- A visitor can move from project to update and back without guessing the
  relationship.
- The page does not claim a project is important without a concrete reason.
- If Shifty is named, it is described only as an interactive
  data-visualization tool at a high level.
- No public voiceover audio or project relationship graph is added.

## Verification

- Use `rg` to check the pilot pages for placeholders, required headings, and
  project links.
- Check `/projects/find-my-ai-fit`, `/projects/soccer-coach-companion`, and
  `/projects/video-to-context` in the existing development server.
- Open one related post from each pilot and follow its project backlink.
- Check the story outline, image alt text, mobile layout, and update order.
- Compare the rendered page with the voiceover notes for unsupported claims.
- Run only narrow static checks. Do not run a production build.

## Dependencies

- Confirm whether “Date Night” is a project in this repository. No matching
  project entry exists in the current checkout.
- Confirm which images and project descriptions are safe to publish. Use a
  tracked placeholder when no meaningful image exists.

## Risks

- A fixed seven-section template can make unrelated projects sound identical.
- A project page can repeat its related posts instead of adding durable context.
- Voiceover can introduce private details that screenshots do not reveal.
- A timeline can imply causation when projects only share a technology.
- Placeholder removal can create confident prose without enough evidence.
