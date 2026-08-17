# Image coverage audit

Audited August 8, 2026 in the saved portfolio checkout. This audit covers the
public items rendered by the current Home, Projects, Blog, and Experience
indexes.

## Scope and route behavior

The current loaders do not filter by a publication state. All 24 files in
`content/projects/`, all 38 files in `app/blog/posts/`, and all four records in
`app/experience/data.ts` render on their indexes. This audit treats them as
public. `featured` remains a promotion flag. It is not a draft, private, or
unlisted state.

The route behavior is:

- Home shows two featured projects, two featured posts, the first two
  experience records, and Byron's headshot.
- Projects shows every project in its hierarchy.
- Blog shows every post in publication-date order.
- Experience shows every experience record and its company logo.
- `app/blog/utils.ts` uses the explicit `image` field first. If that field is
  absent, it uses the first markdown or HTML image in the body.
- Project and blog indexes render an initials fallback when no thumbnail
  exists. That fallback is not a usable asset.

The current Home selection is:

| Area | Items shown now | Image result |
| --- | --- | --- |
| Headshot | `home-portrait` | Meaningful page identity image: `/byron-wall-headshot.webp` |
| Projects | `find-my-ai-fit`, `logo-dodo` | Both have meaningful local project images |
| Blog | `pluck-inventory-viewport-time-debugging`, `component-level-solid-suspense` | Both have meaningful local post images |
| Experience | `relationalai`, `allison-software` | Both show company logos only |

Three posts have `featured: "true"`: `chatgpt-image-pan-zoom`,
`component-level-solid-suspense`, and
`pluck-inventory-viewport-time-debugging`. The Home page displays only the
latest two after sorting. `chatgpt-image-pan-zoom` is featured in metadata but
is not currently shown on Home.

The shared working tree now also contains `indexImage: "placeholder"` on
`data-visualization` (public title: Shifty), `family-recipes`,
`solid-start-park-ui-starter`, and `vacation-planner`. Those fields belong to a
concurrent project-index pass. This batch removed the marker from Basel
Standard, Markdown Helpers, Hydraulic Schematic Tool, and Decisory after
connecting verified or approved images. The remaining markers track placeholder
intent, but they do not provide an image, so those rows stay in status N until a
meaningful source exists.

## Status definitions

The status describes the image evidence available to the index. It does not
describe whether the page itself is public.

| Code | Status | Meaning |
| --- | --- | --- |
| M | Meaningful usable image | A concrete product screenshot, diagram, contact sheet, or other artifact explains the item. |
| B | Accidental/body image | The loader gets a usable image only from the first body image. The image is useful, but the index contract is implicit. |
| G | Generic placeholder | The current image is only an icon, logo, or identity mark. It does not show the work. |
| N | No image | No usable source resolves. A broken remote source also counts as no image. The initials or empty artifact slot remains a UI fallback. |

## Coverage counts

| Item set | M | B | G | N | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| Projects | 18 | 1 | 1 | 4 | 24 |
| Blog posts | 28 | 0 | 0 | 10 | 38 |
| Experience records | 0 | 0 | 4 | 0 | 4 |
| **All public index items** | **46** | **1** | **5** | **14** | **66** |

The Home headshot is one additional page-level image. It is not counted as a
project, post, or experience item.

## Projects index audit

| Item type / slug | Current image source | Coverage | Best existing candidate | Recommended action | Placeholder backlog status |
| --- | --- | --- | --- | --- | --- |
| project · `0-hn-offline` | `https://raw.githubusercontent.com/byronwall/hn-offline/master/docs/image.png` | M | Existing HN Offline owner-repo screenshot. The sibling `/Users/byronwall/Projects/hn-client/docs/image.png` remains excluded because its remote origin is different. | Promote the verified owner-repo screenshot to explicit project front matter. | Clear |
| project · `1-plantasktic` | Body image: `plantasktic/main/public/landing/timeblock.png`; no `image` field | B | `/Users/byronwall/Projects/tasks-trpc/public/landing/timeblock.png` matches the task app and its README. Its remote origin is `tasks-tasks`, so verify lineage first. | Confirm the asset belongs to Plantasktic, localize it, and set explicit project front matter. | Promote existing candidate |
| project · `basel-standard` | `/images/projects/basel-standard/docs-landing-after.png` | M | Localized copy of `/Users/byronwall/Projects/ui-gallery/docs/feedback-fix-2026-03-27/docs-landing-after.png`, a verified Basel Standard docs surface. | Keep the localized owner-repo screenshot as the hero image. | Clear |
| project · `bible-study` | `/images/projects/bible-study/reader.png` | M | `/Users/byronwall/Projects/bible-daily/docs/reader.png`, already mirrored into the portfolio. | Keep the reader screenshot. The plan screenshot is a useful secondary asset. | Clear |
| project · `chrome-image-modal` | `/images/projects/chrome-image-modal/modal.png` | M | `/Users/byronwall/Projects/chrome-image-modal/docs/screenshots/modal.png`, already mirrored into the portfolio. | Keep the modal screenshot. | Clear |
| project · `code-annotations` | Remote `vsc-code-annotations/main/assets/icon.png` | G | `/Users/byronwall/Projects/vsc-code-annotations/assets/icon.png` is the same icon. No screenshot exists in the local repo. | Capture the extension in VS Code. Keep the icon only as a separate identity asset. | Replace identity image |
| project · `comic-book-creator` | Remote `comic-book-creator/main/docs/screenshots/comic-book-editor.png` | M | `/Users/byronwall/Projects/comic-books/docs/screenshots/comic-book-editor.png` | Localize the editor screenshot if remote stability is a concern. | Clear |
| project · `data-visualization` | No image field or body image | N | `/Users/byronwall/Projects/data-viz/packages/explorEDA/docs/main-image.png` is a strong data-analysis UI candidate. The portfolio entry has no owning repo field, so confirm project identity before reuse. | Confirm that `explorEDA` represents this project. If not, request a non-confidential screenshot from the original engineering platform. | Verify candidate or request source |
| project · `data-viz-copilot-usage` | Remote `llmly/main/docs/img/small-multiples.png` | M | `/Users/byronwall/Projects/data-viz-copilot-usage/docs/img/small-multiples.png` | Localize the owner-repo image and keep it as the hero. | Clear |
| project · `decisory` | `/images/projects/decisory/guided-decision-flow.png` in front matter; remote body screenshots remain broken | M | Approved generated high-level guided-decision flow. It is a conceptual portfolio visual, not a product screenshot. | Keep the local diagram as the index image. Replace the body screenshots only with an authorized capture or user-provided source. | Clear for index; body capture still open |
| project · `family-recipes` | `image: ""` | N | None. `/Users/byronwall/Projects/recipes-modern` contains only identity assets, not a representative screen. | Run a seeded local app and capture a recipe or meal-plan screen. Use a user-provided source if the app data is private. | Open — capture needed |
| project · `find-my-ai-fit` | `/images/projects/find-my-ai-fit/current-landing.png` | M | The current local landing image. The owner repo also has `docs/images/find-my-ai-fit/landing.png`. | Keep the current landing image. | Clear |
| project · `hydraulic-schematic-tool` | `/images/projects/hydraulic-schematic-tool/hydraulic-topology-diagram.png` | M | Approved generated fictional high-level hydraulic topology. It does not reproduce employer software or real machine data. | Keep the local diagram as the index image. Use an authorized source later only if one becomes available. | Clear — approved generated fallback |
| project · `logo-dodo` | `/images/projects/logo-dodo/rise-and-riot-board.png` | M | The current local direction board. `/Users/byronwall/Projects/ai-icon-kit/app/public/marketing/logo-workbench/project-rise-and-riot-demo-board-50611e33-865c-4033-b6f6-02343cd0baf6.png` is the owner-repo source. | Keep the direction board. | Clear |
| project · `markdown-helpers` | `/images/projects/markdown-helpers/preview-reader.jpg` | M | Localized copy of `/Users/byronwall/Projects/vsc-markdown-helpers/assets/screenshots/preview-reader.jpg`, a verified reader-workspace screenshot. | Keep the localized owner-repo screenshot as the project image. | Clear |
| project · `product-grid-management` | `/images/projects/product-grid-management/canvas-viewer.png` | M | `/Users/byronwall/Projects/product-grid-mgmt/docs/readme-screenshots/canvas-viewer.png`, already mirrored into the portfolio. | Keep the canvas screenshot. | Clear |
| project · `runndaily` | `/images/posts/runnDAILY/index.png` | M | Existing local `index.png` is meaningful 2009 interface evidence. `routes.png` remains a secondary body image. | Promote the existing local screenshot to explicit project front matter. | Clear |
| project · `soccer-coach-companion` | Remote `soccer-schedule/main/docs/images/readme/dashboard.png` | M | `/Users/byronwall/Projects/soccer-schedule/docs/images/readme/dashboard.png` | Localize the dashboard or use it as the stable project hero. | Clear |
| project · `solid-start-park-ui-starter` | `image: ""` | N | None in `/Users/byronwall/Projects/solid-start-panda-park-ui` beyond a favicon. | Capture the public component explorer. Use a component-grid screen, not a generated decorative image. | Open — demo capture needed |
| project · `srcly` | Remote `srcly/main/docs/00-main.png` | M | `/Users/byronwall/Projects/srcly/docs/00-main.png` | Localize the owner-repo screenshot if needed. | Clear |
| project · `tsx-data-flow` | `/images/projects/tsx-data-flow/thumbnail.svg` | M | The current SVG is a meaningful render-path data-flow diagram. | Keep the SVG. It is a suitable Bento hero asset. | Clear |
| project · `vacation-planner` | `image: ""` | N | `/Users/byronwall/Projects/vacation-planner/app/data/captures/images/mlx6tmer-5knzwd3-map.png` shows the app, but it includes a real map. Other captures show third-party Airbnb content. | Capture a clean synthetic-data screen. Do not reuse the existing map or listing capture without redaction and permission. | Review before reuse — sanitized capture needed |
| project · `video-to-context` | `/images/projects/video-to-context/voice-memo-review.jpg` | M | `/Users/byronwall/Projects/video-to-context/docs/readme-assets/review-ui-workspace.jpg`, mirrored into the portfolio. | Keep the review workspace image. | Clear |
| project · `visual-notes` | Remote `visual-notes/main/docs/main-ui.png` | M | `/Users/byronwall/Projects/visual-notes/docs/main-ui.png` | Localize the owner-repo image if needed. | Clear |

## Blog index audit

| Item type / slug | Current image source | Coverage | Best existing candidate | Recommended action | Placeholder backlog status |
| --- | --- | --- | --- | --- | --- |
| post · `adding-useful-analytics-admin-panel` | `/images/posts/adding-useful-analytics-admin-panel/dashboard-overview.jpg` | M | Current dashboard screenshot | Keep the dashboard screenshot. | Clear |
| post · `backdrop-filter-blank-code-blocks` | `/images/posts/backdrop-filter-blank-code-blocks/broken-code-blocks.png` | M | Current broken-render screenshot. The fixed screen is a useful secondary image. | Keep the broken state as the explanatory thumbnail. | Clear |
| post · `building-a-force-directed-graph-one-desire-at-a-time` | `/images/posts/data-flow-visualization-iterations/17-first-force-topology.png` | M | Existing portfolio force-topology artifact from the TSX Data Flow work. | Use the existing force-topology image as explicit post front matter. | Clear |
| post · `building-ai-project-intake-with-chatgpt-sites` | `/images/posts/building-ai-project-intake-with-chatgpt-sites/main.png` | M | Current public intake screen | Keep the main screen. | Clear |
| post · `building-find-my-ai-fit` | `/images/projects/find-my-ai-fit/current-landing.png` | M | Current Find My AI Fit landing image | Keep the shared project image. A separate process image is optional, not required. | Clear |
| post · `canvas-interactivity-basics` | No image; interactive `CanvasInteractivityExplorer` only | N | None. The interactive state itself is the artifact. | Capture a representative canvas state from the post and set explicit front matter. | Open — capture needed |
| post · `chatgpt-image-pan-zoom` | `/images/posts/chatgpt-image-pan-zoom/modal.png` | M | Current extension modal screenshot | Keep the modal screenshot. | Clear |
| post · `codex-appshots-calendar-notes-workflow` | No image | N | None found in the portfolio assets. | Request or capture a privacy-safe workflow image. Do not use personal calendar or notes data without review. | Open — user source or capture |
| post · `comic-icon-iteration-contact-sheet` | `/images/posts/comic-icon-iteration/contact-sheet.png` | M | Current contact sheet. The SVG version is also available. | Keep the contact sheet. | Clear |
| post · `component-level-solid-suspense` | `/images/posts/component-level-solid-suspense/after-loaded.png` | M | Current loaded-state screenshot | Keep the loaded state. | Clear |
| post · `debugging-stuffed-animal-background-removal` | `/images/posts/debugging-stuffed-animal-background-removal/right-side-repair-roi.png` | M | Current repair-region screenshot | Keep the repair screenshot. | Clear |
| post · `expanding-web-tables-for-copying` | Remote `chrome-image-zoom/main/docs/screenshots/table-viewer.png` | M | `/Users/byronwall/Projects/chrome-image-modal/docs/screenshots/table-viewer.png` | Localize the owner-repo screenshot and keep the table viewer as the thumbnail. | Connect existing local asset |
| post · `github-push-http-408` | `/images/posts/github-push-http-408/git-push-http-408.png` | M | Current terminal/social-card image | Keep the existing image. | Clear |
| post · `incremental-progress-for-static-analysis` | `/images/posts/incremental-analysis-progress/pluck-symbol-indexing.png` | M | Current progress screen. The paired `pluck-analysis-stages.png` is a useful body image. | Keep the progress image. The Pluck name is explained in the post as the analyzed sample. | Clear |
| post · `introducing-coach-companion` | Remote `soccer-schedule/main/docs/images/readme/schedule-builder.png` | M | `/Users/byronwall/Projects/soccer-schedule/docs/images/readme/schedule-builder.png` | Localize the schedule-builder screenshot if needed. | Clear |
| post · `learning-to-zoom-out-data-flow-visualization` | `/images/posts/data-flow-visualization-iterations/40-current-topology-selection.png` | M | Current topology selection screenshot and its 40-image body sequence | Keep the current image. | Clear |
| post · `letting-a-starter-learn-from-derived-projects` | No image | N | None in `/Users/byronwall/Projects/solid-start-panda-park-ui`. | Capture the starter's component explorer or use a source screenshot supplied by the author. | Open — demo capture needed |
| post · `libre-chat-coolify` | No image | N | None found in the portfolio assets or the local Coolify checkout that directly represents this post. | Capture a privacy-safe deployment screen or request a source image. | Open — capture or user source |
| post · `managing-openai-prompt-cache` | No image | N | No direct cache-monitoring screenshot. A Video to Context review screen would be misleading as the hero. | Capture a prompt-cache trace, token readout, or concise diagram from the actual workflow. | Open — direct artifact needed |
| post · `packaging-llmly-for-pypi` | `/images/posts/packaging-llmly-for-pypi/small-multiples.png` | M | Localized copy of `/Users/byronwall/Projects/data-viz-copilot-usage/docs/img/small-multiples.png`, a meaningful llmly product screen. | Keep the localized owner-repo screenshot as the post image. | Clear |
| post · `photographing-hand-drawn-comics-for-printing` | `/images/posts/photographing-hand-drawn-comics/photo-layer-editor.png` | M | Current photo-layer editor screenshot | Keep the editor screenshot. | Clear |
| post · `pluck-capture-timing-loop` | No image | N | No direct timing-panel screenshot. The local `pluck-ui` checkout has design images, but they are not proof of this workflow. | Capture the timing trace or a sanitized extension capture screen. | Open — direct artifact needed |
| post · `pluck-extension-capture-speedup` | No image | N | No direct speedup artifact found. | Capture the extension capture result with timing evidence. | Open — direct artifact needed |
| post · `pluck-inventory-viewport-time-debugging` | `/images/posts/pluck-inventory-viewport-time/viewport-trace-good.png` | M | Current good trace screenshot | Keep the good trace. | Clear |
| post · `product-first-plan-review` | No image | N | `/images/posts/data-flow-visualization-iterations/39-current-topology-overview.png` is possible project context, but it does not show the plan-review method. | Prefer a capture of the reviewed plan or a small evidence diagram. Use the topology image only if the post explains the connection. | Open — direct artifact preferred |
| post · `run-a-tweet-to-ground-with-codex` | No image | N | None found. | Request or capture a sanitized diagnostic output image. Do not generate a generic tweet illustration. | Open — user source or capture |
| post · `shared-expense-splitter` | Remote `expense-splitter/main/assets/demo-screenshot.jpg` | M | `/Users/byronwall/Projects/expense-splitter/assets/demo-screenshot.jpg` | Localize the owner-repo screenshot. | Clear |
| post · `static-analysis-component-identity` | `/images/posts/data-flow-visualization-iterations/34-upstream-cycle.png` | M | Current cycle screenshot | Keep the cycle screenshot. | Clear |
| post · `suspense-boundary-debug-overlay` | `/images/posts/suspense-boundary-debug-overlay/forced-state.png` | M | Current forced-state screenshot | Keep the forced-state image. | Clear |
| post · `testing-open-graph-images-with-contact-sheets` | `/images/posts/testing-open-graph-contact-sheets/contact-sheet.png` | M | Current contact sheet | Keep the contact sheet. | Clear |
| post · `threaded-comments` | `https://raw.githubusercontent.com/byronwall/hn-offline/master/docs/image.png` | M | Existing HN Offline owner-repo screenshot. The local sibling `/Users/byronwall/Projects/hn-client/docs/image.png` remains excluded because its remote origin is different. | Promote the verified owner-repo screenshot to explicit post front matter. | Clear |
| post · `tuning-a-force-directed-graph-with-visible-controls` | `/images/posts/tuning-force-directed-layout/07-layout-debug-controls.png` | M | Current layout-debug control screen and six-step body sequence | Keep the control screen. | Clear |
| post · `typescript-solid-client-server-migration` | `/images/posts/solid-client-server-migration/code-map-after.jpg` | M | Existing portfolio before/after migration screenshot set. | Promote the after-map screenshot to explicit post front matter. | Clear |
| post · `understanding-solidjs-resources` | No image; interactive resource explorer only | N | None. The explorer is the artifact. | Capture a representative resource state and set explicit front matter. | Open — capture needed |
| post · `video-to-context-codex-analysis-cli` | `/images/posts/video-to-context-codex-analysis-cli/review-ui-workspace.jpg` | M | Localized copy of `/Users/byronwall/Projects/video-to-context/docs/readme-assets/review-ui-workspace.jpg`, the best privacy-safe project-level screen. | Keep the localized owner-repo screenshot as the post image. | Clear |
| post · `video-to-context-review-ui-llm-transcripts` | `/images/posts/video-to-context-review-ui-llm-transcripts/review-ui-workspace.jpg` | M | Localized owner-repo workspace, summary, and overlay screenshots from `/Users/byronwall/Projects/video-to-context/docs/readme-assets/`. | Keep the localized assets in front matter and body. | Clear |
| post · `voice-memos-video-to-context` | `/images/posts/voice-memos-video-to-context/voice-memo-review.jpg` | M | Localized copy of `/Users/byronwall/Projects/video-to-context/docs/readme-assets/voice-memo-review.jpg`, a meaningful review screen. | Keep the localized owner-repo screenshot as the post image. | Clear |
| post · `what-coach-companion-changed-about-my-development-workflow` | Remote `soccer-schedule/main/docs/images/readme/dashboard.png` | M | `/Users/byronwall/Projects/soccer-schedule/docs/images/readme/dashboard.png` | Localize the owner-repo dashboard if needed. | Clear |

## Experience index audit

The experience records use `logoUrl` as their only index image. The detail
pages reserve an artifact slot, but the data explicitly says that the relevant
work is private, still being prepared, or will come from a personal archive.
The logos are useful identity assets, but they are generic from an artifact
coverage perspective.

| Item type / slug | Current image source | Coverage | Best existing candidate | Recommended action | Placeholder backlog status |
| --- | --- | --- | --- | --- | --- |
| experience · `relationalai` | Remote RelationalAI lockup SVG in `logoUrl` | G | The current company lockup | Keep the logo until authorized product imagery becomes public. A high-level data-modeling diagram could be a later user-approved source. | Identity fallback accepted; artifact pending |
| experience · `allison-software` | Remote Allison Transmission logo in `logoUrl` | G | The current company logo | Keep the logo. The data states that representative internal software screenshots are not public. Use an authorized, sanitized diagram only if one becomes available. | Identity fallback accepted; artifact restricted |
| experience · `allison-engineering` | Remote Allison Transmission logo in `logoUrl` | G | The current company logo | Keep the logo. Request a non-confidential hydraulic-system artifact from the personal archive or employer-approved source. | Identity fallback accepted; authorized source pending |
| experience · `tda-research` | Remote TDA Research logo in `logoUrl` | G | The current company logo | Keep the logo. Review personal process or equipment photography before publication. | Identity fallback accepted; archive review pending |

## Completed in first implementation batch

This batch connected only privacy-safe assets with confirmed ownership or
existing portfolio provenance. It changed image fields and image paths only.

| Content file | Image source or sources |
| --- | --- |
| `content/projects/0-hn-offline.mdx` | `https://raw.githubusercontent.com/byronwall/hn-offline/master/docs/image.png` |
| `content/projects/basel-standard.mdx` | `/images/projects/basel-standard/docs-landing-after.png` from `ui-gallery/docs/feedback-fix-2026-03-27/docs-landing-after.png` |
| `content/projects/markdown-helpers.mdx` | `/images/projects/markdown-helpers/preview-reader.jpg` from `vsc-markdown-helpers/assets/screenshots/preview-reader.jpg` |
| `content/projects/runndaily.mdx` | Existing `/images/posts/runnDAILY/index.png` promoted from the body |
| `app/blog/posts/building-a-force-directed-graph-one-desire-at-a-time.mdx` | Existing `/images/posts/data-flow-visualization-iterations/17-first-force-topology.png` |
| `app/blog/posts/packaging-llmly-for-pypi.mdx` | `/images/posts/packaging-llmly-for-pypi/small-multiples.png` from `data-viz-copilot-usage/docs/img/small-multiples.png` |
| `app/blog/posts/threaded-comments.mdx` | `https://raw.githubusercontent.com/byronwall/hn-offline/master/docs/image.png` |
| `app/blog/posts/typescript-solid-client-server-migration.mdx` | Existing `/images/posts/solid-client-server-migration/code-map-after.jpg` promoted from the body |
| `app/blog/posts/video-to-context-codex-analysis-cli.mdx` | `/images/posts/video-to-context-codex-analysis-cli/review-ui-workspace.jpg` from `video-to-context/docs/readme-assets/review-ui-workspace.jpg` |
| `app/blog/posts/video-to-context-review-ui-llm-transcripts.mdx` | Local workspace, summary, and overlay copies under `/images/posts/video-to-context-review-ui-llm-transcripts/` |
| `app/blog/posts/voice-memos-video-to-context.mdx` | `/images/posts/voice-memos-video-to-context/voice-memo-review.jpg` from `video-to-context/docs/readme-assets/voice-memo-review.jpg` |

The batch added eight localized owner-repo files. It also promoted three
existing portfolio images and two confirmed HN Offline remote references.

## Remaining quick existing-asset connections

These are the lowest-risk connections because a relevant image already exists
in the portfolio or an owning local checkout:

- Plantasktic → `tasks-trpc/public/landing/timeblock.png`, after repository
  lineage is confirmed.
- Shifty (`data-visualization`) → `data-viz/packages/explorEDA/docs/main-image.png`,
  after project identity is confirmed.
- Coach Companion posts → `soccer-schedule/docs/images/readme/` screenshots.
- Shared Expense Splitter → `expense-splitter/assets/demo-screenshot.jpg`.
- Visual Notes → `visual-notes/docs/main-ui.png`.
- Comic Book Creator → `comic-books/docs/screenshots/` screenshots.

These connections do not require image generation. Localizing stable owner-repo
images is preferable to adding another remote dependency.

## Assets needing capture, permission, or a user-provided source

The following items have no safe, direct artifact in the portfolio assets. A
capture from a local or public app is preferred. A user-provided source is
needed when the work is private or the capture would expose personal or
third-party data.

| Item | Need | First safe action |
| --- | --- | --- |
| `decisory` | Both remote screenshots are broken. The local source has no screenshots. | Capture local home and session states, then localize both. |
| `data-visualization` | A probable `explorEDA` candidate exists, but the entry has no owner link. | Confirm identity or request a non-confidential engineering-platform screen. |
| `family-recipes` | The local repo has no representative image. | Seed safe data and capture the recipe or planning workspace. |
| `hydraulic-schematic-tool` | No public owner repo or safe artifact was found. | Request an authorized schematic or a high-level user-approved diagram. |
| `solid-start-park-ui-starter` | The local repo has only a favicon. | Capture the public GitHub Pages component explorer. |
| `vacation-planner` | Local captures contain a real map and third-party Airbnb material. | Capture synthetic data and remove third-party branding or listing content. |
| `canvas-interactivity-basics` | The visual is an interactive component, not a static image. | Capture a representative explorer state. |
| `codex-appshots-calendar-notes-workflow` | No safe local image exists. | Request or capture a redacted workflow image. |
| `letting-a-starter-learn-from-derived-projects` | No direct image exists in the starter repo. | Capture the component explorer or provide a source screenshot. |
| `libre-chat-coolify` | No direct image exists. | Capture a privacy-safe deployment screen. |
| `managing-openai-prompt-cache` | No direct cache evidence exists. | Capture a cache/token trace or draw a small evidence diagram. |
| `pluck-capture-timing-loop` and `pluck-extension-capture-speedup` | Local Pluck design images do not prove the timing workflow. | Capture the timing trace from the real extension workflow. |
| `product-first-plan-review` | Existing TSX Data Flow screens are only indirect context. | Capture the reviewed plan or a product-question evidence diagram. |
| `run-a-tweet-to-ground-with-codex` | No direct artifact exists. | Request or capture a sanitized diagnostic result. |
| `understanding-solidjs-resources` | The visual is an interactive explorer. | Capture a representative resource state. |
| Allison and TDA experience records | Work artifacts are private or still under archive review. | Use an authorized personal or employer-approved source. |

## Old-post review queue

Repository history shows that the Byron voice skill entered this repository in
commit `9140775` on July 9, 2026. The queue boundary is therefore July 9,
2026. This inventory uses `publishedAt` to identify posts that predate that
boundary. A later `updatedAt` does not remove a post from the queue because it
does not prove that the full post received a voice review.

The queue contains 20 posts:

| Published | Slug |
| --- | --- |
| 2025-01-31 | `threaded-comments` |
| 2025-02-01 | `libre-chat-coolify` |
| 2026-05-27 | `chatgpt-image-pan-zoom` |
| 2026-06-15 | `pluck-extension-capture-speedup` |
| 2026-06-22 | `shared-expense-splitter` |
| 2026-06-26 | `expanding-web-tables-for-copying` |
| 2026-07-01 | `debugging-stuffed-animal-background-removal` |
| 2026-07-02 | `packaging-llmly-for-pypi`, `pluck-capture-timing-loop`, `video-to-context-codex-analysis-cli`, `voice-memos-video-to-context` |
| 2026-07-03 | `component-level-solid-suspense`, `understanding-solidjs-resources`, `video-to-context-review-ui-llm-transcripts` |
| 2026-07-04 | `comic-icon-iteration-contact-sheet`, `managing-openai-prompt-cache` |
| 2026-07-05 | `pluck-inventory-viewport-time-debugging`, `suspense-boundary-debug-overlay` |
| 2026-07-08 | `canvas-interactivity-basics`, `codex-appshots-calendar-notes-workflow` |

The image queue and the voice queue are separate. A post can have a useful
image and still need a voice review. A post can also have no image and still
remain public until a meaningful artifact or an approved fallback exists.

## Smallest recommended generation batch

The approved smallest generation batch is complete. It contains two project
images for gaps with no safe public artifact:

1. `hydraulic-schematic-tool` — a clearly labeled, high-level schematic that
   does not reproduce confidential employer software.
2. `decisory` — a high-level guided-decision flow that does not claim to be a
   screenshot of the private application.

These assets are conceptual portfolio-card visuals. They do not represent
screenshots or private product evidence. Prefer a real capture or a user-
provided source for `family-recipes`, `solid-start-park-ui-starter`,
`vacation-planner`, and the interactive blog posts.

## Audit result

After the first implementation batch and this approved two-image generation
batch, 46 of 66 public items have a meaningful image, one relies on body-image
inference, five show only identity marks, and 14 have no usable image source.
The current featured project pair is
image-ready for the Bento hierarchy. The Home experience pair still uses
identity-only logos.

The remaining body-image row is Plantasktic. The remaining no-image rows need
an identity-confirmed capture, a user-provided source, or an approved
placeholder. The approved generation batch is complete for Hydraulic Schematic
Tool and Decisory.

This batch changed only project image front matter, image body paths for the
localized Video to Context post, and the listed image copies. It did not change
titles, descriptions, tiers, publication behavior, or public prose.
