# Site improvement plan from public-site transcript

Source transcript: `/Users/byronwall/Downloads/public-site-project-blog-structure-and-dev-tool-publishing-plan.md`

Status: unpublished planning document

Date: 2026-07-09

## Executive summary

The transcript argues for turning the portfolio from a static resume/projects/blog site into a public work ledger: experience, active projects, project-linked updates, voice-over-derived context, and a focused track for developer tools and reusable skills.

The current site already has most of the content substrate:

- Project entries live in `content/projects/*.mdx`.
- Blog posts live in `app/blog/posts/*.mdx`.
- Project and blog detail pages already generate canonical and Open Graph metadata.
- The About page already carries professional experience.
- Several recent posts already model the desired practical, evidence-backed writing style.

The next improvement should be structural, not just additive. Projects should become containers with status, history, images, milestones, related posts, and "what I learned" sections. Blog posts should carry enough metadata to be filtered as updates, experiments, process notes, troubleshooting write-ups, and dev-tool notes. The site should also support unpublished/draft content so private or not-yet-ready project pages can be prepared without appearing in public indexes.

## Goals from the transcript

1. Make the site explain who Byron is through experience, active work, and visible project evolution.
2. Treat project pages as durable containers rather than one-off summaries.
3. Use blog posts as project updates, with each update linked back to a project when relevant.
4. Capture voice-over context that code and commit history do not preserve: why something happened, what was learned, what failed, and what should happen next.
5. Improve blog presentation: better listing style, stronger image handling, better code rendering, and useful OG thumbnails.
6. Add publication controls for drafts, private-repo projects, and future content.
7. Build a visible dev-tools and skills track around LLM tracing, markdown/log viewers, code annotation, video-to-context, data-flow visualization, and reusable Codex skills.
8. Keep Twitter separate from the site, using it mainly for distribution, links, short threads, and engagement.

## Current-site observations

The repo is already close to supporting this direction, but a few assumptions are hard-coded:

- `app/blog/utils.ts` parses frontmatter with a simple line-oriented parser and returns all MDX files without draft filtering.
- `getBlogPosts()` and `getProjects()` do not distinguish published, draft, private, featured, active, archived, or update-only content.
- `app/components/posts.tsx` renders the blog index as a compact title/date list without summaries, images, categories, or project context.
- `app/projects/page.tsx` renders a simple project list with thumbnail, description, and tags.
- `app/projects/[slug]/page.tsx` renders project MDX directly but does not add project status, milestones, timeline, related posts, or update navigation.
- `app/page.tsx` manually defines featured and additional projects instead of using project metadata.
- `app/about/page.tsx` covers professional experience but is still mostly resume-style; it does not yet use images or narrative case-study links for the non-programming and engineering work mentioned in the transcript.

## Proposed information architecture

Keep the main navigation simple:

- Home
- Projects
- Blog
- About
- Reference

`Reference` can start as an unpublished or lightly-linked section until there are enough pages to justify top-level navigation. The transcript frames it as "how I make this" content: skills, prompts, annotated workflows, reusable tools, and methodology.

Projects should become the main organizing objects. A project page should answer:

- What is this?
- Is it active, paused, shipped, archived, private, or experimental?
- Where can I see source, demo, package, screenshots, or docs?
- What changed over time?
- What blog posts are updates for this project?
- What did I learn?
- What would I do differently?
- What comes next?

Blog posts should remain the stream of work, but with stronger types:

- `update`: a general project progress note.
- `feature`: a feature implementation write-up.
- `debugging`: a problem solved or investigation.
- `experiment`: something tried with uncertain outcome.
- `tooling`: a change to development process or tools.
- `failure`: something that did not work.
- `reflection`: what changed in taste, process, or judgment.
- `reference`: durable guide or method explanation.

## Content model changes

Extend project frontmatter with optional fields:

```mdx
---
title: "Project Name"
description: "Short list-page description"
date: "YYYY-MM-DD"
publishedAt: "YYYY-MM-DD"
summary: "Metadata summary"
tags: ["TypeScript", "Developer Tools"]
image: "/images/projects/project-name/hero.png"
status: "active"
featured: true
visibility: "public"
repo: "https://github.com/byronwall/example"
demo: "https://example.com"
---
```

Recommended `status` values:

- `active`
- `shipped`
- `paused`
- `archived`
- `experimental`
- `private`

Recommended `visibility` values:

- `public`: appears in indexes and sitemap.
- `unlisted`: page can render if linked directly but does not appear in public indexes.
- `draft`: excluded from static params, sitemap, RSS, and public indexes unless local preview explicitly includes drafts.

Extend blog frontmatter with optional fields:

```mdx
---
title: Post title
publishedAt: YYYY-MM-DD
summary: "Short summary for metadata and previews."
image: "/images/posts/slug/image.png"
type: "debugging"
project: "video-to-context"
visibility: "public"
---
```

This is the minimum metadata needed to connect posts back to project pages and give the blog index useful filtering.

## Project-page template

Each important project page should eventually follow this shape:

1. Hero area: title, summary, status, tags, source/demo links, primary screenshot.
2. Overview: what the project does and who it is for.
3. Timeline or milestones: key releases, pivots, and inflection points.
4. Interface/images: screenshots over time, not just one current image.
5. How it works: architecture, data model, workflows, or implementation details.
6. Updates: related blog posts sorted by date.
7. Lessons: what changed because of this project.
8. Next: planned work, open questions, or why the project is complete.

The near-term implementation can be simple: keep project content as MDX, but have the project detail page render metadata and related posts around the MDX body.

## Blog improvements

The blog index should move beyond a date/title list.

Recommended first pass:

- Add summary text under each post title.
- Show thumbnails when a post has `image`.
- Show post type and project label when frontmatter provides them.
- Add simple filters for `All`, `Updates`, `Debugging`, `Tooling`, `Reference`, and `Experiments`.
- Use a more editorial layout with better scan rhythm, inspired by newspaper or magazine indexes but still restrained.

Recommended post detail improvements:

- Add a top metadata block with date, type, related project, and source/repo link when present.
- Add "Related" links at the bottom using shared project or type metadata.
- Continue using image-heavy posts where screenshots actually explain the work.
- Keep practical code rendering and command snippets readable.

## Draft and private-project workflow

Implement `visibility` before adding many more content pages.

Rules:

- Production indexes, RSS, sitemap, and static params include only `visibility: public` or missing visibility.
- `visibility: unlisted` can render by direct URL if feasible, but should not appear in indexes, sitemap, or RSS.
- `visibility: draft` should not ship publicly unless a deliberate local preview flag enables it.
- Private-repo projects can be written early as `draft` or `unlisted`, then flipped to `public` when ready.

This directly addresses the transcript's concern about preparing posts for private or unreleased work without making the main site messy.

## Voice-over publishing workflow

Use voice memos as source material, not automatic publishing.

Recommended flow:

1. Open the local project, demo, screenshots, and current site page.
2. Record a voice memo covering context, plans, lessons, failures, and next steps.
3. Process it through the existing Video to Context workflow.
4. Generate candidate project updates or project-page edits from the transcript.
5. Review for sensitive details, weak claims, and tone.
6. Publish only the posts that are useful enough to stand alone.
7. Link published posts back to the project.

The prompt/template should ask for:

- What changed?
- Why did it matter?
- What was harder than expected?
- What evidence exists: screenshot, command, diff, metric, or source link?
- What did I learn?
- What will I do differently next time?
- Is anything sensitive, private, or not ready to publish?

## Tone and voice guidance

The transcript calls out tone as an explicit workstream. Create a short repository guide before scaling post generation.

The guide should prefer:

- Direct first-person explanation when the experience matters.
- Concrete implementation detail over generic claims.
- Specific tool names, file formats, screenshots, commands, and tradeoffs.
- Clear "what changed" and "why it mattered" framing.
- Honest notes about failed attempts or unfinished edges.

The guide should avoid:

- Inflated importance.
- Generic AI-product phrasing.
- Overexplaining obvious code changes.
- Publishing every generated artifact without editorial selection.
- Turning Twitter-style summaries into blog posts unless there is durable context.

## Experience section improvements

The About page should keep the tech-forward resume signal but add richer supporting material.

Recommended changes:

- Keep the resume and current role focused on programming.
- Add selected engineering and chemical-engineering work as visual/narrative case studies.
- Use public-safe images where available: TDA yellow skids, Allison fluid/plastics context, and engineering visualization screenshots.
- Link experience items to relevant project pages where possible, such as hydraulic schematic tooling and data visualization.
- Avoid diluting the programming identity by making non-programming work a "background that explains the taste" section rather than the main pitch.

## Reference and skills section

Start `Reference` as a small collection, not a broad taxonomy.

Initial candidates:

- Annotated Codex skills: show the skill text, why each section exists, and examples of output.
- Video to Context workflow: voice memo to transcript to review UI to publishable post.
- LLM tracing: how to inspect what an agent saw, what tools it called, and what context was missing.
- Data-flow visualization: TSX data flow, code-quality metrics, and when they become useful.
- Markdown/log tooling: markdown helpers, JSON log viewer, and code annotation.

An "annotated skill" page format could eventually include:

- Final skill text.
- Inline annotations explaining why important lines exist.
- Source quotes from voice memos or review notes.
- Links to diffs or revisions.
- Optional audio/transcript attachment.

This can be introduced as a specialized template later. The first milestone should be normal MDX pages with clear structure.

## Dev-tools publishing track

Prioritize a public track for the tools named in the transcript:

1. LLM tracing and visualization.
2. Markdown tooling.
3. JSON/log viewer.
4. Code annotation workflow.
5. Video to Context.
6. Public Codex skills.
7. TSX/data-flow visualization.
8. Code-quality metrics.

For each tool, produce:

- Project page or project-page update.
- One overview post.
- One practical post showing a real use case.
- Screenshots or short clips.
- Source, install, marketplace, or package links when public.
- A backlog note from voice-over review: what works, what does not, what to improve.

## Social distribution

Keep Twitter/X separate from the site.

Recommended policy:

- Blog remains the durable home.
- Twitter/X gets short observations, links, and occasional threads.
- Do not mirror every tweet back onto the site.
- For important posts, create a short thread variant and optionally link the blog in a reply.
- Use social sharing pressure as a reason to make OG images good, not as a reason to make the site dependent on Twitter/X.

## Implementation phases

### Phase 1: Publishing controls and metadata

- Add `visibility`, `type`, `project`, `status`, `featured`, `repo`, and `demo` fields to the metadata type.
- Add filtering helpers for public posts/projects.
- Exclude drafts from blog index, project index, sitemap, RSS, static params, and home featured sections.
- Document the frontmatter conventions in `docs/`.

### Phase 2: Project containers

- Update project detail pages to render metadata links, status, and hero image.
- Add related blog posts by matching `project` frontmatter to project slug.
- Add a reusable related-post list component.
- Update 3-5 flagship project pages to include lessons, timeline, images, and next steps.

### Phase 3: Blog index and post metadata

- Redesign the blog index around summaries, thumbnails, type labels, and project labels.
- Add type/project metadata to existing high-value posts first.
- Add filtering by type or project if it can be done without making the page feel heavy.
- Improve post detail metadata and related links.

### Phase 4: Experience refresh

- Refresh the About page with a clearer tech-forward opening.
- Add public-safe non-programming experience context.
- Link experience bullets to projects and posts.
- Add selected images only where they add evidence and do not create confidentiality risk.

### Phase 5: Reference section

- Add a `/reference` route once there are at least three strong entries.
- Start with dev-tool/skill explainers rather than a broad knowledge base.
- Add annotated-skill format only after one plain MDX reference page proves the content is worth the extra UI.

### Phase 6: Visual polish and OG images

- Improve the blog index visual style.
- Confirm code blocks, images, tables, and callouts render well in posts.
- Improve generated OG thumbnails for blog and project pages.
- Add screenshots to high-impression project pages, especially `hydraulic-schematic-tool`.

## First concrete backlog

1. Implement `visibility` filtering across posts, projects, sitemap, RSS, and static params.
2. Add `project` and `type` frontmatter to recent posts that clearly map to a project.
3. Render related blog posts on project pages.
4. Redesign the blog index to show title, date, summary, thumbnail, type, and project.
5. Convert the homepage featured projects to metadata-driven selection.
6. Update `hydraulic-schematic-tool` with a stronger intro, screenshots, and search-aligned copy.
7. Add a tone-and-voice guide for generated posts.
8. Add a project-update prompt/template for voice-over-derived posts.
9. Create first dev-tools publishing batch: Video to Context, LLM tracing, code annotation, TSX data flow.
10. Decide whether `/reference` should be public immediately or wait until the first three entries are ready.

## Success criteria

The site is improved when:

- A visitor can land on a project and see what it is, what changed over time, and where to read updates.
- A visitor can scan the blog and understand which posts are project updates, debugging notes, tooling notes, or reference material.
- Draft and private content can be prepared without appearing publicly.
- Voice-over transcripts reliably become reviewed, publishable project context rather than raw generated prose.
- At least a few dev tools have public pages that explain why they exist, how they work, and what they reveal about Byron's working style.
- The About page still reads as software-forward while using engineering background as a strength.

## Open decisions

- Should `unlisted` pages be statically generated and accessible by direct URL, or should the first implementation only support `public` and `draft`?
- Should the Reference section be a top-level nav item immediately or hidden until it has enough substance?
- Should project timelines be structured frontmatter data, MDX sections, or derived from related posts?
- Should voice-over source artifacts live in the repo, a separate public asset store, or remain private with only excerpts published?
- Which private-repo projects are safe to describe publicly before source code is released?
