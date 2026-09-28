# Placeholder content dossier

Scanned September 28, 2026 against `content/`, `app/blog/posts/`, and `app/experience/data.ts`. Every gap below is either a **proposal** (filled in from the repo, posts, READMEs, or package registries, waiting for a yes) or a **question** (only Byron can answer). Nothing here has been changed on the site yet.

How to answer: reply with the item number and "yes", a correction, or "cut". Items marked **Evidence needed** want a file (screenshot, photo) dropped in the thread.

## At a glance

| # | Gap | Count | What's needed |
| --- | --- | ---: | --- |
| 1 | Project status reads "Content coming soon" | 22 of 26 | Confirm a status per project (proposals below) |
| 2 | Project pages with seven empty history sections | 5 | Confirm two drafted from posts; answer prompts for three |
| 3 | Index tiles showing "Visual placeholder" | 4 | Screenshots, or drop the tile |
| 4 | Decisory body screenshots broken | 2 images | Screenshots, or remove the two images |
| 5 | TSX Data Flow page says `npx tsx-data-flow`, but the package is not on npm | 1 | Publish it, or change the install line |
| 6 | Posts since mid-August with no `project:` | 12 | Confirm mappings; decide whether some become projects |
| 7 | Experience detail pages with "imagery will be added" boxes | 4 | Photos, or reword the box |
| 8 | Blog post titled "Coming soon" | 1 | Write it or unpublish it |
| 9 | Thin legacy project pages | 3 | Decide keep, expand, or archive |

---

## 1. Project statuses

The status chip is rendered from `status` front matter (`app/projects/[slug]/page.tsx:86`). 22 projects literally have `status: "Content coming soon"`, so the chip announces unfinished content on almost every page. The four finished pages use `active`.

**Proposal: a small fixed vocabulary.** `Active` (being worked on), `In use` (done enough, used regularly), `Published` (released package or extension), `Live` (public site), `Internal` (built for an employer, not public), `Archived`.

| Project | Proposed status | Evidence | Confidence |
| --- | --- | --- | --- |
| TSX Data Flow | Active | 9 linked posts, latest Aug 15 | High |
| Comic Book Creator | Active | Post "Keeping the original when cropping…" Sep 24 | High |
| Video to Context | In use | Page calls it "an ongoing voice memo workflow"; `v2ctx@1.0.0` on npm (Jul 2) | High |
| Srcly | Published | `srcly 0.1.32` on PyPI; README runs `uvx srcly` | High |
| Data Viz Copilot Usage (llmly) | Published | `llmly 0.1.3` on PyPI; post "Packaging llmly for PyPI" | High |
| SolidStart Park UI Starter | Active | Post Jul 15 about derived projects feeding back; GitHub Pages demo | Medium |
| Logo Dodo | Live | `demo: logododo.com` (not reachable from my sandbox, please confirm it is up) | Medium |
| HN Offline | Live | `demo: hnoffline.dev` (same caveat) | Medium |
| Plantasktic | Live | `demo: plantasktic.dev` (same caveat) | Medium |
| Code Annotations | Prototype | Repo README calls it "a VS Code extension prototype" | Medium |
| Shifty | Internal | Body describes Allison transmission-testing data | High |
| Interactive Hydraulic Schematic Tool | Internal | Built at Allison (experience page says so) | High |
| runnDAILY.com [2009] | Archived | 2009 PHP project | High |

**Questions: which status fits?** No posts, demo, or package to go on:

- 1a. The Basel Standard (`swiss-styles` repo README not publicly readable; commercial UI system?)
- 1b. Bible Study Reader (`bible-daily` README not publicly readable)
- 1c. Alt Image Zoom Modal (two posts, May and June; do you still use it daily? Is it on the Chrome Web Store?)
- 1d. Decisory
- 1e. Family Recipes (still your household's recipe app?)
- 1f. Markdown Helpers (on the VS Code Marketplace?)
- 1g. Product Grid Management (`prod-mgmt-grid` README not publicly readable)
- 1h. Family Vacation Planner
- 1i. Visual Notes

For the four repos whose README I couldn't read anonymously (`swiss-styles`, `bible-daily`, `prod-mgmt-grid`, `chrome-image-modal`, plus `runnDAILY`), the page links a **Source** repo that visitors may hit as a 404. Inferred from `raw.githubusercontent.com` returning 404 on `main` and `master`; please confirm whether those repos are private and whether the Source link should go.

---

## 2. Project pages with empty history sections

Five pages end in seven headings (Overview, Why it exists, Evolution and milestones, What changed, Lessons, What I would do differently, Next), each followed by a "Content coming soon." block. The top half of each page is already solid.

**Default I'd suggest:** cut the seven-section scaffold from any page you don't want to write up, rather than leaving empty boxes. A page can stay a clean summary.

### 2a. TSX Data Flow (drafted from 9 posts, confirm or edit)

- **Why it exists:** Finding cleanup work in large TSX codebases, where props get relayed and re-wrapped across layers, and TypeScript already proves many defensive checks unnecessary.
- **Evolution and milestones:**
  - Jul 11: Plan reviewed product-first before architecture ("Review the product assumptions before the architecture"), then rebuilt from mixed JavaScript and generated HTML into TypeScript and SolidJS ("Rebuilding TSX Data Flow around TypeScript and SolidJS").
  - Jul 12: Analysis moved to a worker thread with per-file progress over SSE ("Making slow static analysis explain itself").
  - Jul 18: Four posts on the graph view: fixing a component-identity bug that invented recursive paths, building and tuning a force-directed layout with visible controls, and learning to zoom out to a route-scoped topology view.
  - Aug 13: Pointer-capture bug that turned node clicks into background deselects.
  - Aug 15: Serena vs. bare Codex navigation experiment, run on this codebase.
- **Lessons (from the posts):** merging render occurrences by name manufactures paths that don't exist; a graph layout is only tunable once each force is visible and steppable; early green tests missed the real event path.
- **Questions:** What would you do differently? What's next (npm release, see item 5)?

### 2b. Video to Context (drafted from 5 posts, confirm or edit)

- **Why it exists:** Turning screen recordings and Apple Voice Memos into transcripts and context an agent can use, with one command.
- **Evolution and milestones:**
  - Jul 2: Voice memo support behind one flag; Codex-backed analysis pipeline; `v2ctx@1.0.0` published.
  - Jul 3: Review workspace with sectioned transcripts and inline extracted evidence; page shell kept mounted with component-level Suspense.
  - Jul 4: Prompt caching with `prompt_cache_key` to make repeated transcript calls cheap and visible.
- **Questions:** Has it changed since early July? What would you do differently? What's next?

### 2c. Srcly, Code Annotations, Logo Dodo (questions only)

No linked posts exist for these, so the history has to come from you. For each, answer whichever of these you want on the page (a sentence or two each is plenty):

1. What problem were you having when you started it?
2. What was the first version, and roughly when?
3. What's the one change that made it actually useful?
4. What did it teach you?
5. What's next, or is it done?

Extra per project:
- **Srcly:** Its README links back to this page for "project background", so this is the page people land on from PyPI. Worth prioritizing.
- **Code Annotations:** Is it published to the Marketplace, or install-from-source only? The hero image is just the extension icon; **Evidence needed:** a screenshot of the sidebar or code lens in use.
- **Logo Dodo:** No Source link on the page (the `logododo` repo isn't publicly readable). Intentional?

---

## 3. Index tiles with "Visual placeholder"

These four set `indexImage: "placeholder"` and show a generated tile on `/projects`:

| Project | Has any image? | Ask |
| --- | --- | --- |
| Family Recipes | No (`image: ""`) | **Evidence needed:** one screenshot (recipe view or meal plan). Blur family names if needed. |
| SolidStart Park UI Starter | No | **Evidence needed:** screenshot of the GitHub Pages component explorer. I can capture this myself if you confirm the demo URL is still live. |
| Family Vacation Planner | No | **Evidence needed:** screenshot of the map view with lodging options. |
| Shifty | No | Internal Allison tool. Is a sanitized or synthetic-data screenshot possible? If not, proposal: keep a designed non-screenshot tile but drop the words "Visual placeholder". |

---

## 4. Decisory screenshots

`content/projects/decisory.mdx` shows two body images from `raw.githubusercontent.com/byronwall/llm-question-asker/main/docs/screenshot-{home,session}.png`. Both return 404.

**Correction to the July audit:** the repo is readable again (its README loads), but those two PNGs were never committed. The repo's own README embeds the same missing files, so it's broken there too. The page hero is already local (`public/images/projects/decisory/guided-decision-flow.png`) and works.

- **Evidence needed:** a home screenshot and a session screenshot. Once you drop them here, they go in `public/images/projects/decisory/` and I update both the page and, if you want, the repo README.
- **Fallback proposal:** remove the two broken images from the page now and keep the working hero.

---

## 5. TSX Data Flow install line

The page (and the repo README) say `npx tsx-data-flow --help` and `npm install -g tsx-data-flow`. `registry.npmjs.org/tsx-data-flow` returns `{"error":"Not found"}`, so both commands fail for a visitor.

- **Question:** Publish to npm, or should the page say to clone and run from source?

---

## 6. Posts with no project

Posts link to a project via `project:` front matter (`app/blog/utils.ts:105`). These 12 posts since August 9 have none.

**Proposed mappings to existing entries:**

| Post | Proposal |
| --- | --- |
| Making Gunk Patrol from my son's game idea (Aug 17) | Link to the Gunk Patrol game. The `project:` field only matches `content/projects/`, so this needs a small code change (e.g. a `game:` field). Question: want that? |

**Posts that point to repos with no project page.** Question for each: add a project entry, or leave as standalone posts?

| Post(s) | Repo / subject |
| --- | --- |
| Reviving an old site with a known Docker stack (Sep 9), Repolishing fawnix.rocks with OX Alpha workers (Aug 21) | fawnix.rocks (`kids-reading`). Two posts on one site; the strongest candidate for a new project entry. |
| Seeing the ticket graph, planning at the frontier (Sep 24), Backlog gave my agents a graph, but weakened the plan (Sep 8) | Your `ticket` tool and agent planning workflow. Candidate project: "Ticket". |
| ChatGPT Pro delivered one wrong Base64 character… (Aug 22) | `interactive-data-table-prototypes` |
| A small playback speed picker for Chrome (Aug 23) | Small Chrome extension; probably fine standalone |
| Building a date table that stays editable until print (Aug 16) | Possibly part of Coach Companion (schedule printing)? Question. |
| Building a dev feedback loop directly into my portfolio (Aug 10) | This site. Proposal: a "This portfolio" project entry, or leave standalone. |

**Proposed standalone (no project):** What 57.7 million free tokens taught me about Ox Alpha and omp; Updating Vaultwarden with Codex and a verified rollback path; Improving a diagram with a diagram-review skill. These are workflow and ops write-ups, not product work.

---

## 7. Experience detail pages

Each of the four `/experience/*` detail pages shows a monogram box with a caption (`app/experience/data.ts`, `artifactLabel`):

| Role | Current caption | Ask |
| --- | --- | --- |
| RelationalAI | "Product imagery will be added as the work becomes public." | Is anything public now (docs, launch post, conference talk)? If not, proposal: reword to a neutral caption with no promise. |
| Allison, software | "Internal engineering software — representative screenshots are not public." | Already honest. Keep. |
| Allison, engineering | "Hydraulic-system artifacts are being prepared for this archive." | **Evidence needed:** could the hydraulic topology diagram already on the Hydraulic Schematic Tool page (`/images/projects/hydraulic-schematic-tool/hydraulic-topology-diagram.png`) be reused here? That's a yes/no. |
| TDA Research | "Process and equipment photography will be added from the personal archive." | **Evidence needed:** one or two public-safe photos of equipment or a test rig, or say "none" and I'll reword. |

---

## 8. Blog post titled "Coming soon"

`app/blog/posts/threaded-comments.mdx` is published (Jan 31, 2025) as "Coming soon - building a threaded comments interface with React" with two sentences of body. It's linked to HN Offline.

- **Question:** Write it (I can draft from the `hn-offline` repo if you want), or unpublish it?

---

## 9. Thin legacy pages

These aren't placeholders, but they read as older, generic copy next to the newer pages:

- **Shifty** (`data-visualization.mdx`): generic feature list ("High-performance rendering…", "cornerstone of our data analysis platforms"). Question: keep, rewrite, or fold into the Allison experience page?
- **Interactive Hydraulic Schematic Tool:** short, and overlaps the Allison engineering experience page. Same question.
- **runnDAILY.com [2009]:** fine as an archive piece once its status says Archived.

---

## Quick reply template

Copy, fill in, send:

```
1: vocabulary ok / change to ___ ; 1a-1i: ___
2a: ok / edits ; 2b: ok / edits ; 2c: answers or "cut sections"
3: screenshots attached / drop tile
4: screenshots attached / remove images
5: will publish / say "from source"
6: gunk game link yes/no ; fawnix project yes/no ; ticket project yes/no ; date table → ___
7: RelationalAI public? ; reuse hydraulic diagram yes/no ; TDA photos attached / none
8: write / unpublish
9: keep / rewrite / fold
```
