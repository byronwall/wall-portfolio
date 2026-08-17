# Voice review queue

## Goal

Review blog posts published before the Byron voice skill entered this
repository. Keep the queue traceable. Do not change public prose in this
inventory task.

## Cutoff evidence

The first repository appearance of the voice skill is:

- Commit: `91407757c8277f77c5cb5f488dce71224db55b25`
- Commit date: `2026-07-09T23:02:33-04:00`
- Subject: `Add Byron voice writing skill and supporting references`
- Author and committer: Byron Wall `<byron@byroni.us>`

That commit added the skill directory and six files:

- `.agents/skills/write-byron-voice/SKILL.md`
- `.agents/skills/write-byron-voice/agents/openai.yaml`
- `.agents/skills/write-byron-voice/references/phrasing-and-examples.md`
- `.agents/skills/write-byron-voice/references/reasoning-and-structure.md`
- `.agents/skills/write-byron-voice/references/transcript-evidence.md`
- `.agents/skills/write-byron-voice/references/voice-profile.md`

The later commit `81be3bf17541622e7f49fdeca2c04def21db14f6`, dated
`2026-07-09T23:16:05-04:00`, only updates the skill. It is not the cutoff.

The repository stores blog publication dates as date-only `publishedAt` values.
This queue uses dates earlier than `2026-07-09`. No post has
`publishedAt: 2026-07-09`, so the queue ends on `2026-07-08`.

Queue size: **20 posts**.

## Completion field

Each item starts with `completion: pending`.

Set `completion: complete` only after the post has a voice review, a
sensitivity check, an editorial result, and an image decision. Use
`completion: parked` when the review records a deliberate hold.

## Ordered review items

The queue is oldest-first by `publishedAt`. Ties use the post path. “Existing
thumbnail” means the current loader finds a frontmatter, Markdown, or HTML
image. The image still needs a meaningfulness check during review.

| # | publishedAt | updatedAt | post | path | image status | completion |
|---:|---|---|---|---|---|---|
| 1 | 2025-01-31 | — | Coming soon - building a threaded comments interface with React | `app/blog/posts/threaded-comments.mdx` | Needs image or tracked placeholder | pending |
| 2 | 2025-02-01 | — | Running LibreChat on Coolify (and actually keeping it updated) | `app/blog/posts/libre-chat-coolify.mdx` | Needs image or tracked placeholder | pending |
| 3 | 2026-05-27 | — | Why I made a pan-and-zoom viewer for webpage images | `app/blog/posts/chatgpt-image-pan-zoom.mdx` | Existing thumbnail: `/images/posts/chatgpt-image-pan-zoom/modal.png` | pending |
| 4 | 2026-06-15 | — | Speeding up Pluck's full-page Chrome extension capture loop | `app/blog/posts/pluck-extension-capture-speedup.mdx` | Needs image or tracked placeholder | pending |
| 5 | 2026-06-22 | — | A small shared expense splitter for family trips | `app/blog/posts/shared-expense-splitter.mdx` | Existing thumbnail: `https://raw.githubusercontent.com/byronwall/expense-splitter/main/assets/demo-screenshot.jpg` | pending |
| 6 | 2026-06-26 | — | Expanding webpage tables when copy is the real feature | `app/blog/posts/expanding-web-tables-for-copying.mdx` | Existing thumbnail: `https://raw.githubusercontent.com/byronwall/chrome-image-zoom/main/docs/screenshots/table-viewer.png` | pending |
| 7 | 2026-07-01 | — | Debugging background removal on a carpet-colored stuffed animal | `app/blog/posts/debugging-stuffed-animal-background-removal.mdx` | Existing thumbnail: `/images/posts/debugging-stuffed-animal-background-removal/right-side-repair-roi.png` | pending |
| 8 | 2026-07-02 | — | Packaging llmly for PyPI with a publish script | `app/blog/posts/packaging-llmly-for-pypi.mdx` | Needs image or tracked placeholder | pending |
| 9 | 2026-07-02 | — | Making Pluck capture faster by making the timings harder to ignore | `app/blog/posts/pluck-capture-timing-loop.mdx` | Needs image or tracked placeholder | pending |
| 10 | 2026-07-02 | — | Turning voice memos into Codex-ready analysis | `app/blog/posts/video-to-context-codex-analysis-cli.mdx` | Needs image or tracked placeholder | pending |
| 11 | 2026-07-02 | — | Adding voice memo support to Video to Context | `app/blog/posts/voice-memos-video-to-context.mdx` | Needs image or tracked placeholder | pending |
| 12 | 2026-07-03 | — | Breaking top-level Suspense into component-level Suspense | `app/blog/posts/component-level-solid-suspense.mdx` | Existing thumbnail: `/images/posts/component-level-solid-suspense/after-loaded.png` | pending |
| 13 | 2026-07-03 | — | Understanding SolidJS resources | `app/blog/posts/understanding-solidjs-resources.mdx` | Needs image or tracked placeholder | pending |
| 14 | 2026-07-03 | — | Building a review UI for LLM-processed voice memos | `app/blog/posts/video-to-context-review-ui-llm-transcripts.mdx` | Existing thumbnail: `https://raw.githubusercontent.com/byronwall/video-to-context/main/docs/readme-assets/review-ui-workspace.jpg` | pending |
| 15 | 2026-07-04 | — | Iterating a comic-book app icon with contact sheets | `app/blog/posts/comic-icon-iteration-contact-sheet.mdx` | Existing thumbnail: `/images/posts/comic-icon-iteration/contact-sheet.png` | pending |
| 16 | 2026-07-04 | 2026-07-17 | OpenAI prompt caching with prompt_cache_key and cached_tokens | `app/blog/posts/managing-openai-prompt-cache.mdx` | Needs image or tracked placeholder | pending |
| 17 | 2026-07-05 | — | Encoding time on the canvas to debug Pluck inventory panning | `app/blog/posts/pluck-inventory-viewport-time-debugging.mdx` | Existing thumbnail: `/images/posts/pluck-inventory-viewport-time/viewport-trace-good.png` | pending |
| 18 | 2026-07-05 | — | Forcing Suspense boundaries from a tiny debug overlay | `app/blog/posts/suspense-boundary-debug-overlay.mdx` | Existing thumbnail: `/images/posts/suspense-boundary-debug-overlay/forced-state.png` | pending |
| 19 | 2026-07-08 | — | Canvas interactivity basics | `app/blog/posts/canvas-interactivity-basics.mdx` | Needs image or tracked placeholder | pending |
| 20 | 2026-07-08 | — | Using Codex as a bridge between browser apps | `app/blog/posts/codex-appshots-calendar-notes-workflow.mdx` | Needs image or tracked placeholder | pending |

Image summary: 9 items have an existing thumbnail. 11 items need a meaningful
artifact or a deliberate placeholder. Track the placeholder decision in the
editorial result. Do not generate a decorative image to hide missing evidence.

## Publication model confirmation

The current publication model is public content plus an optional `featured`
flag:

- `app/blog/utils.ts:84-101` loads every `.mdx` file in `app/blog/posts`.
- `app/blog/utils.ts:150-153` loads every `.mdx` file in `content/projects`.
- `app/blog/page.tsx:22-25` renders every loaded post.
- `app/projects/page.tsx:14-19` renders every loaded project.
- `app/sitemap.ts:7-15` adds every post and project to the sitemap.
- `app/rss/route.ts:14-34` adds every loaded post to RSS.
- `app/page.tsx:8-18` uses `featured === "true"` for home promotion.

No `public`, `visibility`, `draft`, `unlisted`, or `private` frontmatter key
exists in the blog or project records. Do not add those states for this
review queue.

Existing contrary or ambiguous metadata remains unchanged:

- Project records use `status`, usually `"Content coming soon"`, with
  `"active"` on Coach Companion and Find My AI Fit. The current Projects page
  displays this value, but no loader treats it as publication state.
- `featured` exists on two projects and three blog posts. It is the existing
  promotion field.
- `updatedAt`, `articleHero`, `layout`, `interactionTime`, `type`, and
  `project` describe editorial or rendering behavior. They do not control
  visibility.
- “Private” appears in some public descriptions and post bodies, including
  Coach Companion and private admin workflows. These are prose claims, not
  publication metadata.

## Shifty mapping

Working repository mapping: **Shifty corresponds to the project record
`data-visualization`, titled “Custom Data Visualization Platform.”**

Evidence:

- `content/projects/data-visualization.mdx:2-8` describes a specialized
  engineering data-visualization platform with TypeScript, D3.js, SVG, and
  Canvas.
- `content/projects/data-visualization.mdx:15-18` describes interactive charts
  with zoom, pan, and selection.
- `content/projects/data-visualization.mdx:32-37` connects the tool to
  transmission testing data and interactive engineering analysis.
- `app/experience/data.ts:40-56` records Allison Software work on a large
  engineering analysis platform using React/SolidJS and D3, with data
  visualization listed among the tools.
- `.cursorrules:24-32` gives the same resume evidence: a transmission time
  series analysis and visualization platform with interactive D3.js and SVG
  exploration.

The `allison-software` experience record is the supporting work-history record.
The separate `hydraulic-schematic-tool` project and `allison-engineering`
experience record match the repository’s “interactive schematic” evidence;
do not merge that record with Shifty without new evidence. The literal name
“Shifty” does not appear in the repository. If the name is used publicly,
keep the description high-level and call it an interactive data-visualization
tool.

## Deferred decisions

This queue does not implement or decide the following:

- project relationship graph;
- explainer taxonomy;
- public voiceover audio;
- social publishing automation.
