# Public site transcript gap analysis

Date: 2026-07-13  
Source: `docs/transcripts/public-site-structure-blog-workflow-and-dev-tooling-content-plan.md`  
Scope: current Home, Projects, Blog, Experience, About, Open Graph/RSS infrastructure, and the transcript-driven publishing/tooling workflow

## Executive summary

The site has implemented much more of the transcript's visual and route-level direction than the earlier July 9 plan suggests. The major public routes exist, the homepage introduces the right themes, Projects and Blog have strong image-led indexes, long-form posts have an editorial left rail and first-class code blocks, Experience has both an index and detail routes, and project/blog pages have generated Open Graph images. The site now reads like an intentional portfolio rather than a generic resume template.

The largest remaining gap is the transcript's core product model: **projects are not yet actual containers for an evolving body of work**. They are visually polished MDX summaries, but they have no structured status, milestones, related updates, source/demo/package links, or consistent sections for lessons and next steps. Blog posts are not linked to projects in metadata or UI. As a result, the site's two strongest content collections behave as separate archives rather than the connected work ledger described in the dictation.

The second major gap is publishing workflow. The repository now has strong writing guidance and many transcript-derived posts, but the content model has no draft, private, unlisted, or embargoed state. Every MDX file is included by the loaders, public indexes, static parameters, sitemap, and RSS. There is also no documented project-update template or repository-local command/workflow that takes a voice memo through review, sensitivity checks, metadata assignment, and publication.

The third gap is depth and evidence. The Experience detail routes exist, but all four use designed placeholders instead of representative artifacts. Most project pages are only 180–400 words and use generic sections such as “Interface,” “How it works,” and “Highlights.” That is enough for a product preview, but not enough to explain history, evolution, failures, durable lessons, or what comes next.

The fourth gap is the proposed reference/skills and dev-tool publishing track. Several named tools have project pages and some have good blog coverage, but there is no coherent reference destination, no annotated-skill format, no audio/transcript presentation block, and no visible series connecting the tools into a point of view.

### Recommended priority

1. Implement the shared publishing/content model: `visibility`, explicit project `status`, post `type`, post `project`, and structured links.
2. Make projects real containers by rendering related updates and enriching 3–5 flagship pages with history, lessons, and next steps.
3. Add project/type context to the blog and decide whether filtering is necessary after that metadata is visible.
4. Replace Experience placeholders with public-safe artifacts and deepen the non-software engineering story.
5. Prove one reference/annotated-skill page before creating a new top-level section.

## What is already implemented well

These areas should be treated as foundations, not rebuilt.

### Global information architecture and visual direction

- The primary navigation is the intended `BW`, Projects, Blog, Experience, About, GitHub, and LinkedIn structure.
- The site uses the calm cool-neutral palette, shared gutters, restrained surfaces, asymmetric compositions, and image-aware layouts established by the redesign guidance.
- Home answers who Byron is, what he does, where he works, what technologies and problems interest him, and where to go next.
- Home previews projects, posts, and experience without introducing metric cards, a skills page, a contact page, or dashboard-like UI.
- Desktop layouts preserve the intended left/right compositions. CSS explicitly stacks project rows, article rails, experience entries, and detail heroes at narrow breakpoints.

### Blog presentation

- `/blog` is now an image-led editorial list with title, summary, date, calculated reading time, and an inferred category.
- `/blog/[slug]` uses a marginal left rail with date, reading time, category, and a sticky active table of contents on desktop.
- Article code rendering includes syntax highlighting, horizontal safety, and a copy button.
- MDX supports tables and custom interactive explainers; several posts already contain substantial interactive material.
- RSS, canonical metadata, JSON-LD, and generated 1200×630 Open Graph images are implemented.
- A post can opt out of its article hero using `articleHero: false`.

### Project and experience route scaffolding

- `/projects` is a vertical editorial ledger rather than a dense grid.
- `/projects/[slug]` has the preferred summary-left, artifact-right hero and a marginal page outline.
- `/experience` is a concise vertical chronology with company marks and a resume link.
- `/experience/[slug]` provides company, role, dates, location, overview, focus, tools, reflection, and an external company link.
- `/about` clearly explains the chemical-engineering-to-software transition and keeps the present-day identity software-forward.

### Existing content volume

The repository already contains enough material to support the connected model:

- 22 project MDX entries.
- 26 blog posts.
- 4 visible experience entries across RelationalAI, Allison software, Allison engineering, and TDA Research.
- 17 projects with a hero image and 14 with at least one body image or image component.
- 13 posts with an explicit thumbnail and 13 with at least one body image or image component.
- Strong clusters already exist around Video to Context, TSX/Data Flow, SolidJS UI work, Pluck debugging, and LLM/tooling workflows.

## Major missing areas

### 1. Projects and posts are not connected

This is the highest-impact gap because it prevents the intended “ledger of ongoing work” from existing.

#### Transcript intent

A project is a durable container. Updates are blog posts tagged back to it. A visitor should move from the project overview into feature work, experiments, troubleshooting, failures, process changes, and lessons, then return to the high-level project story.

#### Current state

- No blog post has `project`, `projectSlug`, or `relatedProject` frontmatter.
- Project pages do not query or render related posts.
- Blog rows and article rails do not show a related project.
- Articles have no related-content footer or backlink to a project.
- Projects cannot distinguish a general update from a feature, experiment, troubleshooting note, process change, failure, or reflection.

This is especially visible for Video to Context and TSX Data Flow. Both have project pages and multiple clearly related posts, but the relationship exists only in prose and filenames. A visitor has to infer it.

#### What needs to be implemented

- Add optional `project` and `type` fields to blog frontmatter.
- Define a small controlled vocabulary for `type`, such as `update`, `feature`, `debugging`, `experiment`, `tooling`, `failure`, `reflection`, and `reference`.
- Add helpers such as `getPostsForProject(slug)` and centralized public-content filtering.
- Render a dated “Updates” stream on project pages.
- Render the related project in the article rail/mobile metadata and add a project backlink.
- Add a restrained related-post section at the end of articles, preferably driven first by exact project match rather than fuzzy tags.
- Backfill metadata for the obvious clusters before attempting comprehensive tagging.

#### Why this should precede filters

Filters are secondary navigation. The underlying project/type relationships are the product model. Adding filter controls before the metadata is reliable would expose inconsistent classifications and create maintenance work without fixing navigation between the content itself.

### 2. Project pages are polished summaries, not histories

#### Transcript intent

Project pages should explain what the project is, why it exists, whether it is active or done, how it evolved, what was built, what worked, what failed, what was learned, what would be done differently, and what comes next. Images should show evolution over time.

#### Current state

- Most project files are approximately 180–400 words; only Video to Context reaches roughly 650 words.
- Most use generic “Interface / How it works / Highlights” sections.
- There is no consistent milestone/timeline presentation.
- No project has explicit `status` metadata. The UI infers status from publication year: 2026 means Active, 2024–2025 means Recent or Completed, and older entries become Archive. This produces incorrect product semantics as time passes and cannot represent paused, experimental, shipped, or privately developed work.
- There are no structured repository, live demo, package, marketplace, docs, or install links in frontmatter, even when links appear ad hoc in body copy.
- The detail hero uses the first/declared image but has no project logo or distinct identity field.
- Lessons, failures, and next steps are inconsistent and usually absent.

#### What needs to be implemented

- Add explicit project fields: `status`, `featured`, `repo`, `demo`, `package`, `docs`, and optionally `logo`.
- Stop deriving project lifecycle state from `publishedAt`.
- Define a minimum flagship-project narrative: Overview, Why it exists, Evolution or Milestones, What changed, Lessons, What I would do differently, Next, and Updates.
- Keep narrative sections in MDX initially. Only milestones that must be reused or sorted need structured data.
- Enrich 3–5 projects first: Video to Context, TSX Data Flow, Srcly, Code Annotations, and one visually strong consumer/product project.
- Use related posts as much of the timeline. Hand-author only the milestone events that are not represented by posts.

### 3. There are no publication or visibility controls

#### Transcript intent

Byron should be able to prepare posts for private/unreleased projects, keep drafts out of public indexes, and flip content public later. The dictation explicitly considers unpublished, not-yet-published, hidden-from-list, and public-before-repo-release states.

#### Current state

- There are zero `draft`, `published`, `visibility`, or `private` fields across project and post frontmatter.
- `getBlogPosts()` and `getProjects()` return every MDX file.
- Static parameters, indexes, homepage features, sitemap, and RSS consume those unfiltered arrays.
- The frontmatter parser is simple and permissive, but it has no validation, schema errors, or safe defaults beyond string parsing.
- Future-dated content is not separately handled.

#### What needs to be implemented

- Add a documented `visibility` model and centralize its interpretation.
- Apply filtering consistently to indexes, homepage sections, related-content queries, sitemap, RSS, and static parameters.
- Add metadata validation so an invalid project slug or visibility value fails locally instead of silently publishing surprising output.
- Decide whether local preview should include drafts automatically or require an environment flag.
- Consider `public`, `unlisted`, and `draft`; avoid implementing private authentication unless there is a concrete need.

#### Important security boundary

An “unlisted” route is discoverability control, not confidentiality. If sensitive content cannot ship, it must be excluded from the deployment output, not merely omitted from the index or hidden behind a query parameter.

### 4. Blog taxonomy is inferred, incomplete, and not user-controlled

#### Transcript intent

The blog should visibly mix project updates, features, experiments, debugging, process changes, failed approaches, difficult problems, tooling, and durable essays. Visitors should be able to tell what kind of artifact they are opening and which project it belongs to.

#### Current state

- `getPostCategory()` infers categories from title, summary, and tags using keyword rules.
- Many posts therefore fall back to “Project update” even when they are not connected to a project.
- The blog index has no project label, explicit type, category navigation, search, or filter state.
- Half the posts lack an explicit thumbnail and therefore use a generic `BW / XX` fallback. The fallback is coherent, but a blog whose intended identity is image-led should not depend on it for half the archive.
- There is no visible distinction between quick updates, substantial essays, interactive explainers, and reference-oriented posts.

#### What needs to be implemented

- Prefer explicit `type` and `project` metadata; retain inference only as a temporary fallback.
- Surface project/type labels in the index and article metadata.
- Design a repeatable thumbnail strategy for posts without screenshots: code/diagram excerpts, a generated terminal artifact, an OG-derived editorial card, or a deliberate no-image row variant.
- Add filters only after metadata coverage is high enough. A compact filter row is more aligned with the current design than a permanent third-column taxonomy sidebar.
- Consider a visible “interactive” marker for the small number of explorable posts because their reading behavior differs materially.

### 5. The transcript-to-publication workflow is only partially productized

#### Transcript intent

The site should benefit from a repeatable loop: open a project or work session, narrate the missing context, extract candidate updates, review tone and sensitivity, attach evidence, choose what is worth publishing, and link it back to the project. Repeated voice feedback should improve skills and output over time.

#### Current state

- The repository contains a mature `write-byron-voice` skill with transcript-derived voice guidance.
- Video to Context has a project page and multiple posts explaining voice memo processing, transcript review, evidence extraction, prompt caching, and CLI analysis.
- Recent posts demonstrate that the workflow can produce concrete, evidence-backed technical writing.
- However, there is no repository-local content contract or checklist that guarantees `project`, `type`, `visibility`, evidence, sensitivity review, image/OG review, and next-step linkage.
- There is no explicit distinction between source transcript, working draft, reviewed post, and published artifact.
- Audio, full transcript, excerpts, annotations, and “how this was made” notes are not reusable MDX components.

#### What needs to be implemented

- Document one project-update template and one longer essay template.
- Define a review checklist covering claims, confidentiality, project/type metadata, links, images, alt text, code, and OG output.
- Decide where source audio/transcripts live and whether they are public artifacts or private inputs.
- Add optional MDX components only when a real post needs them: audio player, transcript disclosure, timestamped quote, and source-note block.
- Add a lightweight status handoff from generation to human review; do not auto-publish directly from transcripts.

### 6. Experience detail pages lack the evidence promised by the transcript

#### Transcript intent

The index remains concise and software-forward. Detail pages carry richer context, including TDA's yellow skids, Allison fluid/plastics work, physical systems, engineering artifacts, diagrams, and reflections. This is how non-programming experience becomes an advantage without diluting the resume.

#### Current state

- The Experience index is well aligned: concise, chronological, logo-led, and resume-like.
- Detail routes exist and establish the right two-column anatomy.
- All four experience detail pages use a generated grid/monogram placeholder with a sentence about future imagery.
- There are no real `artifactImage` fields in the experience data.
- Detail bodies are limited to overview, bullet-list focus, tools, and one reflection. There is no selected work, challenges, impact, images, or cross-linking to relevant projects/posts.
- Allison is split into software and engineering roles, which is useful, but the fluid/plastics/physical-system story from the transcript is not yet visible.

#### What needs to be implemented

- Add public-safe representative images for TDA and Allison engineering first.
- Extend the experience model to support a hero artifact, caption/credit, and optional secondary images.
- Add selected-work narrative and links to Hydraulic Schematic Tool, data visualization, or relevant posts where appropriate.
- Establish a confidentiality review for internal products and industrial photography.
- Preserve the current concise index; put the additional depth only on detail pages.

### 7. The reference/skills concept is not yet a site feature

#### Transcript intent

The site may include opinionated “how this was made” material: final skill text, source prompt/content, line-level rationale, voice quotes, audio, revisions, and diffs. It could become a Reference section or remain a Skills project plus blog posts until the collection is substantial.

#### Current state

- There is no `/reference` route or nav item.
- There is no annotated-skill renderer or general audio/transcript annotation system.
- `product-first-plan-review.mdx` is a promising skill-oriented post, and interactive MDX support proves specialized content is technically feasible.
- Code Annotations, Markdown Helpers, Srcly, TSX Data Flow, and Video to Context are present as project pages, but they are not presented as a coherent reference collection.

#### What needs to be implemented

- First build one proof page as a normal blog/reference post using existing MDX.
- Include the final skill, a small number of annotations, an example output, and the reasoning behind key sections.
- Only create `/reference` after at least three strong entries exist and the differences from Blog/Projects are clear.
- If line-level audio/diff linking proves valuable, model it as a specialized component after the editorial format is proven.

### 8. The named dev-tool publishing track is uneven

The transcript names a family of tools that should be public, explained, and improved. Current coverage is uneven:

| Track | Project page | Blog/explanation | Major missing piece |
| --- | --- | --- | --- |
| Video to Context | Strong | Multiple substantial posts | Tie posts back to project; publish workflow/reference overview |
| TSX Data Flow | Present | Migration and progress posts | Project linkage, real-project case studies, explicit lessons/roadmap |
| Srcly/code quality | Present | Little or no dedicated narrative | Overview and real hotspot/refactor case study |
| Code Annotations | Present | No dedicated post | Practical workflow post, marketplace/install link, evolution |
| Markdown Helpers | Present | No dedicated post | Overview/use-case post and marketplace/install link |
| JSON/log viewer | Not clearly identifiable as its own project | Not clearly covered | Decide product identity; add page and a practical example |
| LLM tracing/usage viewer | Data Viz Copilot Usage likely covers part of it | Packaging/usage material exists | Clarify naming, tracing vs usage scope, visualization series |
| Public Codex skills | Individual skill-related post exists | Fragmentary | Public collection/repo, install path, annotated-skill proof |

The main product need is not simply “write more posts.” Each tool needs a clear identity, public destination, installation/source path, one overview, one real use case, and a visible improvement backlog.

## Page-by-page assessment

| Page/area | Alignment with transcript | Major remaining work |
| --- | --- | --- |
| Home | Strong | Make featured projects metadata-driven; ensure public/draft filtering; consider showing active work rather than two hard-coded projects |
| Projects index | Visually strong, structurally partial | Explicit status; simple type/status filtering only if useful; structured links; distinguish active/shipped/paused/experimental accurately |
| Project detail | Strong shell, weak container behavior | Related updates, milestones/history, links, lessons, failures, next steps, richer images |
| Blog index | Strong visual redesign | Explicit type/project metadata, thumbnail coverage, optional compact filters/search |
| Blog detail | Strong editorial reading experience | Related project, related posts, optional transcript/audio/source blocks, mobile table of contents decision |
| Experience index | Strong | Check chronology completeness and whether all important roles should appear; otherwise preserve restraint |
| Experience detail | Route exists but evidence is missing | Real artifacts, selected work, challenges/impact, project links, confidentiality review |
| About | Strong and on-message | Optional personal context if desired; avoid duplicating Experience |
| Reference/skills | Not implemented | Prove content format, then decide route/nav status |
| Publishing workflow | Partial supporting tools, no enforceable site model | Visibility, schema validation, templates, review gate, evidence/OG checklist |
| Distribution | Appropriately separate | No site work required beyond good OG images and optional share affordances |

## Major product and UX questions to resolve

These questions materially affect implementation and should be answered before broad backfilling.

### A. What is a project?

1. Is every listed experiment a durable project, or should some entries become blog posts/reference notes instead?
2. Which lifecycle states matter to visitors: `active`, `shipped`, `paused`, `experimental`, `archived`, and/or `private`?
3. Is “active” manually curated, or can recent related updates influence its display without changing the canonical status?
4. Should one project be allowed multiple public destinations—repo, demo, package, marketplace, docs—and which should be primary?
5. Are project milestones hand-authored, derived from related posts, or a hybrid? A hybrid is the recommended default.

### B. What belongs in the blog?

1. Should small nightly updates all be public, or should several be combined into a digest?
2. Which distinctions matter to readers versus only to the authoring workflow? Eight internal types may collapse into four public labels.
3. Should posts support more than one related project, or is one primary project plus freeform tags sufficient?
4. Does the blog need filters now, or will visible type/project labels and good internal linking solve the scan problem first?
5. Should short posts use the same image-heavy row as long essays, or should the index support a compact update row?

### C. What does “unlisted” mean?

1. Must an unlisted page be included in the deployed site and reachable by direct URL?
2. If content is genuinely sensitive, should it remain outside the repository/deployment entirely?
3. Should local development show drafts automatically, by query parameter, or by environment flag?
4. How should future publication dates behave?
5. Should drafts be allowed to generate preview OG images locally?

### D. How public are source recordings and transcripts?

1. Are audio and full transcripts public content, supporting evidence available on demand, or private authoring inputs?
2. If only excerpts are public, who selects and redacts them?
3. Where do large audio files live, and what are the cost/privacy implications?
4. Should “how this was made” provenance appear on ordinary posts or only on reference/skill explainers?
5. Is line-level audio synchronization valuable enough to justify a specialized player, or would timestamp links and quoted excerpts deliver most of the value?

### E. What is Reference relative to Projects and Blog?

1. Is Reference a content type, a curated landing page, or a genuinely different template?
2. What threshold earns a top-level nav item—three entries, six entries, or an ongoing publication commitment?
3. Are reusable skills themselves projects, downloadable artifacts, or reference entries with supporting posts?
4. Should interactive explainers live in Blog, Reference, or both via one canonical URL and multiple collection views?
5. What user job does Reference solve that Blog tags cannot?

### F. How much non-software experience should be public?

1. Which TDA and Allison images are personally owned and safe to publish?
2. Can internal product screenshots be replaced with diagrams or recreated representative artifacts?
3. Should Allison's software and engineering periods remain separate detail pages or become one company page with role chapters?
4. How much process/fluid/plastics detail strengthens the story before it competes with the software identity?
5. Should the public resume remain programming-focused while the site preserves the broader chronology? The transcript strongly suggests yes.

### G. How should imagery scale?

1. Is every blog row required to have a unique image, or can short updates use a deliberately compact text treatment?
2. Should the generated OG renderer also create on-site thumbnails for posts without screenshots?
3. Are external GitHub/raw images acceptable long-term, or should published assets be localized for reliability?
4. What is the minimum image evidence for a flagship project: hero plus two historical screenshots, or something more flexible?
5. Who owns alt text and image captions during transcript-driven generation?

## Recommended implementation sequence

### Phase 1: content model and safe publishing

Implement before adding more content:

- Typed/validated frontmatter parsing.
- `visibility` for posts and projects.
- Explicit project `status`.
- Blog `project` and `type`.
- Structured project destinations (`repo`, `demo`, `package`, `docs`, `marketplace`).
- Central public-content selectors reused by Home, indexes, static params, sitemap, RSS, and related-content queries.
- Frontmatter documentation with examples and local preview rules.

Acceptance test: a draft never appears in any public collection or feed; an unlisted page behaves according to the chosen policy; an invalid relationship fails clearly; project status never changes because a calendar year changed.

### Phase 2: connect the ledger

- Backfill project/type metadata for the Video to Context and TSX Data Flow clusters.
- Add related-project metadata to article pages.
- Add dated related updates to project pages.
- Add article-to-project backlinks and exact-project related posts.
- Make homepage featured projects metadata-driven and visibility-aware.

Acceptance test: a visitor can enter through either a post or project, understand the relationship, browse the project's evolution, and return without relying on browser Back.

### Phase 3: flagship project depth

- Expand 3–5 project narratives using voice-over source material.
- Add explicit why/history/lessons/different-next-time/next sections.
- Add milestone events not already represented by posts.
- Add reliable source/demo/install links and localize critical imagery.

Acceptance test: each flagship page explains the project's current state and evolution, not just its interface and feature list.

### Phase 4: experience evidence

- Add real artifacts and captions to TDA and Allison engineering.
- Add selected work, challenges, impact, and relevant project links.
- Review confidentiality and image rights.
- Decide whether Allison remains split by role or is grouped by company.

Acceptance test: the index remains concise, while a curious visitor can understand how physical engineering shaped the later software work.

### Phase 5: publishing workflow and reference proof

- Add/update the voice-over post template and review checklist.
- Publish one annotated-skill proof using existing MDX components where possible.
- Test an optional audio/transcript block on one real piece of content.
- Decide whether three proven entries justify `/reference` and navigation.

Acceptance test: the workflow produces a reviewed, linked, image-complete post without relying on undocumented memory, and the reference format demonstrates a visitor benefit beyond a normal blog post.

### Phase 6: discovery refinements

- Review blog/project scan behavior after metadata backfill.
- Add compact filters if the archive needs them.
- Consider search only if visitors cannot find known content through project and type relationships.
- Add explicit thumbnail treatment for short/no-image posts.
- Continue OG contact-sheet verification across representative project/post states.

## Suggested first implementation batch

A focused first batch should touch the model and two content clusters, not all 48 content entries:

1. Define and validate the new frontmatter fields.
2. Filter public content everywhere it is consumed.
3. Add `project` and `type` to the Video to Context posts.
4. Add `project` and `type` to the TSX Data Flow posts.
5. Add related updates to project detail pages.
6. Add related-project links to article pages.
7. Add explicit status and destination links to those two project pages.
8. Replace their generic closing sections with lessons and next steps.
9. Document the authoring contract and visibility behavior.
10. Verify indexes, detail pages, sitemap, RSS, and OG routes against public/draft/unlisted fixtures.

This batch proves the architecture with real content and exposes whether the metadata and UI are sufficient before a large backfill.

## Verification notes and evidence

- Representative routes returned HTTP 200 from the existing development server: `/`, `/projects`, `/projects/video-to-context`, `/blog`, `/blog/video-to-context-review-ui-llm-transcripts`, `/experience`, `/experience/tda-research`, and `/about`.
- Rendered project markup includes status and “Project story,” but no related updates or milestones.
- Rendered article markup includes Published, Reading time, Filed under, and On this page, but no related project, audio, or transcript presentation.
- Rendered TDA detail markup explicitly describes the hero as representative imagery/photography to be added.
- No production build was run. This audit used source inspection and focused checks against the existing development server, consistent with repository guidance.

## Bottom line

The visual redesign and core page scaffolding are no longer the main problem. The site now looks and reads close to the intended product. What remains is the connective tissue and publishing discipline that make it a living record of work:

- explicit project lifecycle state;
- posts that belong to projects;
- projects that show history, lessons, and next steps;
- safe draft/unlisted behavior;
- real evidence on experience pages;
- and a repeatable transcript-to-reviewed-publication workflow.

Implementing those foundations will create more user value than adding another standalone page or another visual redesign pass. Once the relationships are real, the existing 22 projects and 26 posts can become one navigable body of work instead of two adjacent archives.
