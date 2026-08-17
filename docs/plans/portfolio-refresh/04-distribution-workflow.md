# Distribution workflow plan

## Goal

Create a repeatable, manual way to distribute the strongest public work. Keep
the blog as the durable source and use external channels to bring readers to it
or to participate in useful conversations.

## Current evidence

The memo says to start sharing links broadly and not treat each post as too
precious (`03:31–03:45`). It suggests a monthly Hacker News post for the best
interactive work, frequent Twitter posts, and possible reuse on LinkedIn
(`03:46–04:31`). It favors process notes and interesting explainers, and says
deep technical dives may not be useful to promote (`04:41–05:17`).

The memo also says Twitter should stay separate from the website. It considers
short comments, reply links, occasional threads, and no rolling tweet summary
on the blog (`16:46–19:28` in the related site-structure memo). This plan keeps
that boundary.

The repository has no distribution automation. The blog supplies canonical
URLs, RSS, and generated Open Graph images. `app/og/route.tsx` supports both
real featured images and a fallback card. The post
`app/blog/posts/testing-open-graph-images-with-contact-sheets.mdx` records a
contact-sheet verification workflow. `app/data/site-links.ts` keeps social
navigation separate from the blog.

## Scope

- Define a publication gate before a URL enters the distribution queue.
- Create channel-specific adaptations from an approved blog post.
- Run a small manual pilot for X/Twitter, LinkedIn, and Hacker News.
- Verify canonical URLs and Open Graph images before sharing.
- Keep channel status and copy in a private working queue.
- Record what was shared and what earned a follow-up.
- Use public posts only. Use the existing `featured` flag for on-site
  promotion. Do not add publication-state fields.

## Non-goals

- Do not auto-post to external services.
- Do not mirror every tweet or LinkedIn post on the website.
- Do not add a social feed or rolling tweet archive.
- Do not make the blog depend on any social account.
- Do not add social publishing automation. Keep publication manual.
- Do not add draft, unlisted, or private publication states.
- Do not promote a post that fails the quality gate.

## Proposed implementation

Use a private Markdown queue or equivalent working record. Each item should
include:

- post slug and canonical URL;
- post type and project;
- image and Open Graph check result;
- approved channels;
- short channel copy;
- publication status and date;
- follow-up note or outcome.

The queue is an editorial record, not a publication state. A post enters it
only after it is public and passes review. The site uses public content plus
the existing `featured` flag. It does not add draft, unlisted, or private
states.

Apply this gate before adding an item:

1. The post passed the human content review.
2. The post has a clear summary and type.
3. The project link is correct when the post belongs to a project.
4. The URL is public and canonical.
5. The image, fallback, title, and description produce a useful OG card.
6. The post contains no private or sensitive material that the author has not
   approved.

Use the following channel adapters for the pilot:

- **X/Twitter:** one short observation or link comment. Use a reply link when
  that keeps the main post readable. Use a short thread only when the post has
  a real sequence. Do not create a site copy of the thread.
- **LinkedIn:** reuse selected process notes and explainers. Rewrite the
  opening for the channel instead of copying every post unchanged.
- **Hacker News:** submit the strongest interactive explainer on an occasional
  basis. Use the article title and a plain description. Do not submit every
  daily update.

Treat the memo’s daily and monthly rates as a pilot signal, not as an
automatic permanent schedule. Review the first pilot batch before increasing
volume.

## Affected files or systems

| Area | Planned work |
| --- | --- |
| Private distribution queue | Track approved URLs, channel copy, status, and follow-up. Keep it out of public content. |
| `app/blog/posts/*.mdx` | Supply the reviewed source posts and accurate metadata. |
| `app/blog/[slug]/page.tsx` | Preserve canonical metadata and related project context. Change only if the pilot finds a metadata gap. |
| `app/og/route.tsx`, `app/og-image.ts` | Verify image and fallback branches used by shared links. |
| `app/blog/posts/testing-open-graph-images-with-contact-sheets.mdx` | Reuse the existing contact-sheet cases as the visual QA reference. |
| RSS and sitemap | Confirm that shared URLs are public and discoverable when intended. |
| X/Twitter, LinkedIn, Hacker News | Manual external publication only. No automation is planned. |

## Stages

1. Create the private queue and apply the publication gate to existing
   reviewed posts.
2. Select one interactive explainer, one process note, and one additional
   durable post for the pilot.
3. Render and inspect their OG cards, including one missing-image fallback.
4. Prepare channel-specific copy without changing the source post.
5. Publish the pilot manually on the approved channels.
6. Record response, useful follow-ups, and any content or OG defects.
7. Adjust the queue and cadence before repeating the process.

## Acceptance criteria

- Every shared URL points to a public canonical post.
- Each shared post passes the content, sensitivity, and OG checks.
- X/Twitter, LinkedIn, and Hacker News copy has a distinct purpose.
- The site does not contain a mirrored tweet feed or external-post archive.
- The pilot can record publication state and follow-up without editing the
  source article after every share.
- A no-image or fallback OG case remains legible and honest.
- No external post is sent automatically by the repository workflow.

## Verification

- Check queue entries against the source MDX frontmatter.
- Open the canonical post, RSS item, sitemap entry, and OG URL locally.
- Use the existing contact-sheet approach for long titles, real images, and
  fallback cards.
- Review each channel draft for duplicate wording and channel fit.
- Record manual publication results without claiming traffic impact that was
  not measured.
- Do not run a production build or send external messages during this plan.

## Dependencies

- Confirm the final X/Twitter, LinkedIn, and Hacker News cadence.
- Choose the first “best interactive” post for Hacker News.
- Decide whether LinkedIn should receive the same URL for every promoted post.
- Decide whether distribution needs analytics, UTM parameters, or only manual
  notes.
- No automation or account integration is required for this plan.

## Risks

- A daily rate can turn useful sharing into low-value noise.
- Cross-posting can make the site feel like a social archive.
- An OG card can look correct locally but fail when an external crawler loads
  an unstable image URL.
- A channel adaptation can overstate the source post or remove its useful
  qualifications.
- Manual tracking can become stale unless every share has a clear status.
