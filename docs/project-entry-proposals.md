# Project Entry Proposals

Generated from a scan of `/Users/byronwall/Projects` on 2026-05-02.

Scope used for this pass:

- Git repositories directly under `~/Projects`
- `origin` remote points at GitHub
- Recent work based on the latest commit date, with dirty worktrees called out
- Existing portfolio entry for `srcly` treated as the style reference
- No changes made to `content/projects`

## Scan Results

| Repo | GitHub remote | Latest commit | Dirty files | Recommendation |
| --- | --- | ---: | ---: | --- |
| `ai-icon-kit` | `byronwall/logododo` | 2026-05-02 | 4 | Add as `logo-dodo` or `ai-icon-kit`; strongest new candidate |
| `product-grid-mgmt` | `byronwall/prod-mgmt-grid` | 2026-05-02 | 1 | Add as `product-grid-management`; strong candidate |
| `comic-books` | `byronwall/comic-book-creator` | 2026-04-27 | 1 | Add as `comic-book-creator`; already has screenshots and matches existing portfolio style |
| `solid-start-panda-park-ui` | `byronwall/solid-start-panda-park-ui` | 2026-04-27 | 0 | Mention as a starter/tooling repo, lower priority than apps |
| `recipes-modern` | `byronwall/recipes-modern` | 2026-04-26 | 0 | Add if personal/internal apps belong on the portfolio |
| `vsc-markdown-helpers` | `byronwall/vsc-markdown-helpers` | 2026-04-18 | 0 | Add as a developer-tool project |
| `ui-gallery` | `byronwall/swiss-styles` | 2026-04-06 | 0 | Add if you want to feature the commercial UI-system work |

I did not include third-party upstreams such as `shadcn-ui`, `panda`, `park-ui`, `solid`, `humanlayer`, or `coolify`, even though they have GitHub remotes, because they are upstream projects rather than portfolio projects.

## Proposed Entry: Logo Dodo

Suggested file: `content/projects/logo-dodo.mdx`

```mdx
---
title: "Logo Dodo"
description: "A SolidStart app for AI-assisted logo exploration, feedback, and visual direction refinement"
date: "2026-05-03"
publishedAt: "2026-05-03"
summary: "A SolidStart app for AI-assisted logo exploration, feedback, and visual direction refinement"
tags: ["SolidStart", "SolidJS", "TypeScript", "OpenAI", "Image Generation", "Design Tools"]
image: "https://raw.githubusercontent.com/byronwall/logododo/main/app/public/brand/logo-dodo.png"
---

Logo Dodo is a local-first logo workbench for moving from a short brand brief to generated concept boards, structured candidate feedback, and increasingly focused visual directions. The workflow is built around practical art direction: generate a broad board, mark the strongest and weakest candidates, then use that feedback to steer the next round.

- Source: [byronwall/logododo](https://github.com/byronwall/logododo)

## Workflow

Logo Dodo turns a brand brief into a sequence of reviewable boards:

- Creates `5x5`, `4x4`, `3x3`, and `2x2` logo concept boards.
- Detects candidate bounds so individual marks can be reviewed apart from the full board.
- Captures likes, loves, rejections, tags, notes, and additional reviewer direction.
- Synthesizes feedback into the next creative territory for iterative generation.
- Exports a Markdown creative summary with the brief, board history, selected notes, prompts, and run metadata.

## How it works

The app uses SolidStart with server-side OpenAI calls:

- Text models plan visual territories and refinement directions.
- Image generation produces PNG board assets saved into the local app workspace.
- Candidate previews are extracted as a review convenience layer.
- Project history and feedback are persisted locally so each board has durable context.

## Highlights

- Structured brand briefs with include and avoid guidance
- Iterative board generation from user feedback
- Candidate-level review and tagging
- Local project history with Markdown handoff export
- Docker Compose setup with persistent data and generated asset volumes
```

## Proposed Entry: Product Grid Management

Suggested file: `content/projects/product-grid-management.mdx`

```mdx
---
title: "Product Grid Management"
description: "A spatial graph workspace for mapping product ideas, UI architecture, and planning context"
date: "2026-05-03"
publishedAt: "2026-05-03"
summary: "A spatial graph workspace for mapping product ideas, UI architecture, and planning context"
tags: ["SolidStart", "SolidJS", "TypeScript", "OpenAI", "Spatial UI", "Product Tools"]
image: "https://raw.githubusercontent.com/byronwall/prod-mgmt-grid/main/docs/readme-screenshots/canvas-viewer.png"
---

Product Grid Management is a SolidStart application for mapping product ideas, UI architecture, system relationships, and planning context as a spatial graph. It combines a project registry, interactive canvas, structured node metadata, markdown notes, image attachments, and AI-assisted workflows for turning loose context into navigable product maps.

- Source: [byronwall/prod-mgmt-grid](https://github.com/byronwall/prod-mgmt-grid)

## Interface

<div className="not-prose mt-6">
  <img
    src="https://raw.githubusercontent.com/byronwall/prod-mgmt-grid/main/docs/readme-screenshots/canvas-viewer.png"
    alt="Product Grid Management spatial product map with selected node inspector"
    className="w-full h-auto rounded-lg border border-neutral-200 dark:border-neutral-800"
    loading="lazy"
  />
</div>

## How it works

Product Grid Management treats planning information as a graph:

- Nodes represent product areas, workflows, UI pieces, notes, and implementation details.
- Links capture hierarchy, dependencies, reuse, and related concepts.
- The same graph can be explored as a spatial canvas, hierarchy tree, document view, or metadata grid.
- Node context supports markdown notes, image attachments, custom metadata, and status/type fields.
- AI workflows can add nodes, decompose source material, convert loose notes, and generate mockup images.

## Highlights

- Project registry with import and export
- Pan-and-zoom canvas with focus, isolation, depth filtering, and command search
- Dense metadata grid and reading-oriented tree/document view
- Markdown context nodes and source-note conversion
- Server-side OpenAI workflows with streamed progress
```

## Proposed Entry: Comic Book Creator

Suggested file: `content/projects/comic-book-creator.mdx`

```mdx
---
title: "Comic Book Creator"
description: "A SolidStart editor for printable comic books with templates, text tools, autosave, and print output"
date: "2026-05-03"
publishedAt: "2026-05-03"
summary: "A SolidStart editor for printable comic books with templates, text tools, autosave, and print output"
tags: ["SolidStart", "SolidJS", "TypeScript", "Panda CSS", "Park UI", "Creative Tools"]
image: "https://raw.githubusercontent.com/byronwall/comic-book-creator/main/docs/screenshots/comic-book-editor.png"
---

Comic Book Creator is a SolidStart app for making printable comic books. It provides a desktop-style editor for saved books, page templates, comic text, paper sizes, autosave, and print-ready page output backed by local JSON persistence.

- Source: [byronwall/comic-book-creator](https://github.com/byronwall/comic-book-creator)

## Interface

<div className="not-prose mt-6">
  <img
    src="https://raw.githubusercontent.com/byronwall/comic-book-creator/main/docs/screenshots/comic-book-editor.png"
    alt="Comic Book Creator editor with page preview and text controls"
    className="w-full h-auto rounded-lg border border-neutral-200 dark:border-neutral-800"
    loading="lazy"
  />
</div>

## Editor

The app supports the core workflow for assembling a printable comic:

- Create and manage multiple books from a library page.
- Add, select, reorder, and delete pages inside a book.
- Choose rectangular, splash, strip, reveal, letterbox, webtoon-style, and angled action page templates.
- Switch between letter and half-sheet paper sizes in portrait or landscape.
- Add speech bubbles, thought bubbles, captions, and sound effects.
- Drag, resize, rotate, retarget, and edit text directly on the page.

## Highlights

- Local JSON persistence with server-side normalization
- Autosave for book and page edits
- Print actions from the app interface
- Shared dialog system for rename, clear, and delete flows
- Panda CSS, Park UI, Ark UI, and Lucide-based interface stack
```

## Proposed Entry: Markdown Helpers

Suggested file: `content/projects/markdown-helpers.mdx`

```mdx
---
title: "Markdown Helpers"
description: "A VS Code extension for markdown-heavy workspaces with previews, path intelligence, and code-block tools"
date: "2026-05-03"
publishedAt: "2026-05-03"
summary: "A VS Code extension for markdown-heavy workspaces with previews, path intelligence, and code-block tools"
tags: ["VS Code", "TypeScript", "Markdown", "Developer Tools", "Mermaid"]
image: ""
---

Markdown Helpers is a VS Code extension for treating markdown as working source material instead of only static prose. It combines workspace discovery, a dedicated preview panel, editor-side path intelligence, fenced code block extraction, and readable wrapping defaults into one markdown-heavy workflow.

- Source: [byronwall/vsc-markdown-helpers](https://github.com/byronwall/vsc-markdown-helpers)

## Workflow

Markdown Helpers is designed for repos where markdown documents contain file references, runnable snippets, diagrams, and operational notes:

- Discovers markdown and markdown-like files across the workspace.
- Provides a dedicated preview panel with file picker, outline, and bounded reading width.
- Resolves local file, folder, line, column, and range references from source and preview.
- Adds hover previews for resolved local targets.
- Extracts fenced code blocks into untitled editors for inspection or execution.
- Enhances preview rendering for code blocks, tables, Mermaid diagrams, front matter, and path tokens.

## Highlights

- Recent Markdown activity-bar tree
- Changed-since-base filtering for markdown review
- Dedicated preview UI with local-link handling
- Code block actions in editor and preview
- Markdown-like extension support for `.prompt.md`, `.instructions.md`, and similar files
```

Note: this entry needs an image before publishing. The repo README does not currently advertise a screenshot path.

## Proposed Entry: Family Recipes

Suggested file: `content/projects/family-recipes.mdx`

```mdx
---
title: "Family Recipes"
description: "A modern recipe, meal-planning, and shopping-list app with auth, images, and optional Kroger integration"
date: "2026-05-03"
publishedAt: "2026-05-03"
summary: "A modern recipe, meal-planning, and shopping-list app with auth, images, and optional Kroger integration"
tags: ["Next.js", "React", "TypeScript", "tRPC", "Prisma", "PostgreSQL"]
image: ""
---

Family Recipes is a Next.js app for creating and managing recipes, planning meals, and maintaining a shopping list. It includes grouped ingredients and step groups, recipe scheduling, image uploads, authentication, and optional Kroger cart integration.

- Source: [byronwall/recipes-modern](https://github.com/byronwall/recipes-modern)

## Features

The app covers the practical loops around home cooking:

- Create, view, edit, and delete recipes with grouped ingredients and step groups.
- Schedule recipes on a meal-planning calendar.
- Add recipes or loose items to a shopping list and mark items as bought.
- Upload recipe images through an S3-compatible object store.
- Authenticate users with NextAuth credentials.
- Optionally connect Kroger OAuth for product search and add-to-cart flows.

## Highlights

- Next.js App Router with React 18
- tRPC and Zod for typed API surfaces
- Prisma with PostgreSQL persistence
- S3-compatible media storage with MinIO local setup
- Docker Compose deployment path for Coolify
```

Note: this entry needs an image before publishing. The repo README does not currently advertise a screenshot path.

## Proposed Entry: The Basel Standard

Suggested file: `content/projects/basel-standard.mdx`

```mdx
---
title: "The Basel Standard"
description: "A premium shadcn-compatible interface system for dense, product-facing software"
date: "2026-05-03"
publishedAt: "2026-05-03"
summary: "A premium shadcn-compatible interface system for dense, product-facing software"
tags: ["Next.js", "React", "TypeScript", "shadcn/ui", "Design Systems", "UI"]
image: ""
---

The Basel Standard is a shadcn-compatible interface system for modern product software. It is positioned as an authored interface standard for teams that need dense, product-facing UI to feel structured, credible, and resolved without inventing a design language from scratch.

- Source: [byronwall/swiss-styles](https://github.com/byronwall/swiss-styles)

## Product

The repository contains the product workspace and proof surface:

- Installable registry source
- Marketing site
- Documentation site
- Editorial journal surface
- Demo infrastructure for validating the system under realistic UI pressure

## Design Direction

The system applies a contemporary Swiss International influence to product interfaces:

- Typography carries hierarchy before decoration.
- Grid logic, alignment, and spacing define the structure.
- Rules, dividers, and hard-edged surfaces provide discipline without over-framing.
- Color is sparse and semantic.
- Dense states, overlays, tables, navigation, forms, and documentation are treated as first-class surfaces.

## Highlights

- Local shadcn-compatible registry
- `swiss-international` style entry
- 55 UI components and 7 blocks documented in the repo
- Marketing, docs, journal, and demo surfaces in one workspace
- Strong fit for B2B, prosumer, finance, operations, research, admin, and other information-dense apps
```

Note: this entry needs an image before publishing. Pick a screenshot from the marketing/docs/demo surface before moving it into `content/projects`.

## Proposed Entry: SolidStart Park UI Starter

Suggested file: `content/projects/solid-start-park-ui-starter.mdx`

```mdx
---
title: "SolidStart Park UI Starter"
description: "A SolidStart starter with Park UI wrappers, Panda CSS theming, and a GitHub Pages component explorer"
date: "2026-05-03"
publishedAt: "2026-05-03"
summary: "A SolidStart starter with Park UI wrappers, Panda CSS theming, and a GitHub Pages component explorer"
tags: ["SolidStart", "SolidJS", "TypeScript", "Panda CSS", "Park UI", "Starter"]
image: ""
---

SolidStart Park UI Starter is a starter repository for SolidStart applications using Park UI wrappers, Panda CSS theming, and a curated set of developer-focused assets reconciled from earlier UI experiments.

- Source: [byronwall/solid-start-panda-park-ui](https://github.com/byronwall/solid-start-panda-park-ui)
- Demo: [GitHub Pages explorer](https://byronwall.github.io/solid-start-panda-park-ui/)

## What it includes

The repo packages a reusable setup for SolidStart projects:

- SolidStart application scaffold under `app/`
- Park-style wrapper components
- Panda CSS theme and generated styling workflow
- Contributor and agent guidance
- Ark UI MCP wiring
- GitHub Pages workflow for a static component explorer

## Highlights

- `pnpm -C app` workflow for install, dev, type-check, test, build, and start
- Static pre-rendered Comps Explorer deployed to GitHub Pages
- Shared wrappers such as `SimpleDialog`, `SimplePopover`, `SimpleSelect`, `PanelPopover`, `ConfirmDialog`, `ClearButton`, and `WrapWhen`
- Documentation for reconciliation and migration decisions
```

Note: this is useful as a tooling/starter entry, but it is less product-like than the app projects above.

## Suggested Priority

1. Add `logo-dodo`, `product-grid-management`, and `comic-book-creator` first. They are recent, product-like, and have clear screenshot assets.
2. Add `markdown-helpers` next if developer tools are a portfolio priority.
3. Add `basel-standard` once a representative screenshot is selected.
4. Add `family-recipes` if personal/internal apps are in scope.
5. Keep `solid-start-park-ui-starter` as optional supporting work unless you want to show infrastructure and starter repos.
