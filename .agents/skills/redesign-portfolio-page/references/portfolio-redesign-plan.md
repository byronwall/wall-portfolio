# Portfolio Site Design Brief

## Overall intent

I want this site to feel like a clear, opinionated record of who I am, what I’ve worked on, what I’m building now, and how I think.

It should not feel like a generic developer portfolio full of dashboards, metric cards, oversized headshots, or decorative UI for its own sake. It should feel editorial, technical, image-aware, and reasonably restrained.

The core content model is:

- Home
- Projects
- Blog
- Experience
- About

Projects should act as containers for a body of work. Each project can have a summary, screenshots, history, lessons, and related updates. Those updates are effectively blog posts tied back to the project. The site should make it easy to move between the high-level project page and the individual posts that document progress, decisions, experiments, failures, and lessons learned.

I expect the site to grow into a ledger of ongoing work rather than a frozen résumé site.

---

## Global visual direction

### Layout

I consistently prefer strong left/right compositions.

The design should use asymmetric two-column layouts where one side carries the visual weight and the other side carries the text. This should feel intentional and architectural, not like a standard centered marketing page.

Common patterns I like:

- Text on the left, image on the right
- Large image on the left, article text on the right
- Table of contents or marginalia on the left, article body on the right
- Project summary on the left, product image on the right
- Timeline rail on the left or center, company details aligned beside it

The layout can scroll. I no longer think the entire site needs to be locked to a single viewport. The first viewport should still feel composed and complete, but project pages, articles, and experience detail pages can continue naturally below the fold.

### Color

Use a neutral gray or cool off-white base.

I do not want:

- Sepia
- Sand
- Beige-heavy palettes
- Warm editorial cream as the dominant background
- Neon colors
- Highly saturated accent colors

I do like:

- Soft blue
- Muted navy
- Dusty purple
- Small orange accents
- Very light cool-gray surfaces
- Dark charcoal text rather than absolute black everywhere

The accent colors should support hierarchy, not become the identity of the page.

### Typography

The typography can have some editorial character, especially for major titles and long-form articles.

Good options include:

- A strong serif for major page titles, article titles, or my name
- A clean sans-serif for navigation, metadata, labels, tags, and supporting text
- Or a restrained all-sans system if the hierarchy is strong enough

Avoid oversized text that dominates the entire viewport. My name can be large, but it should not feel like a poster that leaves no room for the rest of the page.

### Navigation

Use `BW` as the brand mark in the top-left.

Do not use my headshot in the navigation. That created a repeated-image problem on pages that already contain my picture.

The navigation should stay simple:

- Projects
- Blog
- Experience
- About

GitHub and LinkedIn icons can sit on the right.

A theme toggle is fine but not important to the core layout.

### Things I explicitly do not want

- No metric tiles anywhere
- No “14+ years / 20+ projects / infinite curiosity” cards
- No eyebrow text above headers
- No all-caps kicker text above major headings
- No giant portrait that occupies half the viewport
- No horizontal project timeline
- No decorative lifestyle collage next to my headshot
- No contact page
- No dedicated skills page
- No dashboard aesthetic
- No dense grid of screenshots with no narrative between them
- No generic stock imagery when a project screenshot or relevant artifact would work better

---

## Home page

### Purpose

The home page should quickly answer:

- Who am I?
- What do I do?
- Where do I work?
- What am I interested in?
- Where should someone go next?

It should feel like a strong introduction, not a complete résumé or a dashboard.

### Preferred first viewport

Use a strong two-column composition.

#### Left side

The left side should contain:

- `Byron Wall`
- A short description of what I do
- My current role at RelationalAI
- A compact summary of my interests and preferred stack
- Primary links to Projects, Blog, Experience, and About

The text should sound direct and grounded. Something close to:

> I’m a software engineer with more than 14 years of experience across software and chemical engineering. I build full-stack applications, data tools, and developer tooling. I’m currently a Full Stack Engineer at RelationalAI, working on an agentic and LLM-driven data modeling application for Snowflake.

The exact text can evolve, but the structure should stay compact.

#### Right side

Use a headshot in the upper-right area.

The headshot should be:

- Clearly visible
- Roughly one-fifth to one-quarter of the full viewport
- Cropped like a headshot rather than a full-height portrait
- Visually strong but not dominant
- Fully contained in the first viewport

I do not want the image to extend down the page while the user scrolls.

A good proportion would be a medium portrait card in the upper-right quadrant, with generous whitespace around it.

### Below the introduction

Below the initial intro, show a small amount of featured work.

Good options:

- Two featured projects
- One featured project and one recent post
- A simple four-link navigation row

The project cards can include:

- Project logo
- Project name
- One-sentence description
- A few restrained technology tags

Do not turn this section into a metric dashboard.

---

## Projects index

### Purpose

The projects page should provide a clear list of active, completed, and meaningful projects.

Projects are not just gallery items. They are containers for a body of work, including updates, screenshots, decisions, lessons, and future plans.

### Layout

A clean vertical list works well.

Each project row should include:

- Project logo
- Project name
- Short description
- A representative image or screenshot
- A few tags
- Optional status such as Active, Completed, or Paused

I prefer rows or editorial list items over a dense card grid.

The page should feel easy to scan without reducing every project to a tiny tile.

### Filtering

A small amount of filtering is fine, such as:

- All
- Apps
- Developer Tools
- Experiments

Do not overbuild this.

---

## Project detail page

### Purpose

The project page should explain:

- What the project is
- Why it exists
- Whether it is active or complete
- What I built
- How it changed over time
- What I learned
- What I would do differently
- What comes next
- Which posts or updates belong to it

The project page is a container for the complete story of the project, not just a landing page. It should be image-heavy, but the images should support the narrative rather than appear as one uninterrupted gallery.

### Above the fold

Use a strong two-column layout.

#### Left side

Include:

- Project logo
- Project name
- Short description
- Technology tags
- Live demo and repository links where appropriate
- A concise overview
- Current status

#### Right side

Show one large, high-quality product image or screenshot.

This is one of the strongest recurring patterns from the concepts. I prefer the large product image on the right rather than pushing all screenshots below the fold.

### Page body

The project page should scroll and become more like a structured article.

Suggested sections:

- Overview
- Why I built it
- Current status
- What I built
- Screenshots and examples
- Key decisions
- What worked
- What did not work
- What I learned
- What I would do differently
- What is next
- Related updates

Images should be distributed throughout the page.

Do not place every screenshot in one big block. Break them up with commentary and context.

### Updates

Project updates should link to blog posts.

Useful update types include:

- Feature shipped
- Problem solved
- Experiment run
- Tooling improvement
- Process change
- Failed approach
- Difficult problem
- General progress update

Those categories reflect the way I expect to document work over time.

---

## Blog index

### Purpose

The blog should feel like an editorial record of what I am building, learning, troubleshooting, and changing.

It is not just polished essays. It should support a mix of:

- Project updates
- Technical write-ups
- Experiments
- Process notes
- Lessons learned
- Tooling posts
- More durable essays

### Layout

Use a strong image-led list.

Each row should have:

#### Left

- A meaningful image
- Project screenshot
- Diagram
- Code-related visual
- Illustration or article thumbnail

#### Right

- Post title
- Short subtitle or summary
- Date
- Reading time
- Category
- Related project where applicable

This layout feels much stronger than a text-only article list.

A two-column editorial list is preferred. A narrow third column for categories, tags, or search can work, but it should remain visually secondary.

### Content hierarchy

The title and image should carry most of the weight.

Metadata should be visible but quiet.

The blog index can support filters such as:

- All
- Projects
- Engineering
- Process
- Tools
- Experiments

Search is useful but not central.

### Imagery

Images matter here. The blog should not become a plain list of text links.

Open Graph images and post thumbnails should be designed as part of the publishing workflow rather than added as an afterthought. The original content plan explicitly calls out blog imagery, code rendering, and useful Open Graph thumbnails as important presentation work.

---

## Blog post / project update

### Purpose

The long-form post should be the most editorial page on the site.

It should support:

- Strong images
- Code
- Diagrams
- Screenshots
- Inline notes
- Project relationships
- Table of contents
- Long-form narrative

### Preferred layout

Use a left-side table of contents or marginalia rail.

This is one of the strongest patterns from the generated concepts.

#### Left rail

Include:

- Table of contents
- Date
- Reading time
- Category
- Related project
- Share links where appropriate

The left rail should feel like editorial marginalia, not a large sidebar.

It can become sticky on desktop.

#### Main column

Start with:

- Post title
- Subtitle
- Large hero image
- Metadata

Then flow into the article.

The hero image should be wide and prominent, but it should not consume the entire page.

### Article structure

The body should have generous spacing and clear section headings.

Posts may include sections such as:

- Why this matters
- Context
- What I tried
- What I built
- Results
- What failed
- What I learned
- What I would do differently
- What is next

For project updates, make the related project visible without overpowering the article.

### Code and technical content

Code rendering needs to be first-class.

Use:

- Good syntax highlighting
- Readable line lengths
- Optional filenames
- Copy buttons
- Callouts for important details
- Diagrams where code alone is insufficient

Do not squeeze code into a narrow editorial column.

### Audio and transcripts

Some posts may originate from dictated walkthroughs or voice-over transcripts.

The design should leave room for optional:

- Audio player
- Transcript
- Highlighted excerpt
- Annotation
- “How this was made” notes

This should be supported as an optional content block, not forced into every article. The transcript-driven workflow is an important part of how I expect to capture richer context, plans, and lessons from ongoing work.

---

## Experience index

### Purpose

The main experience page should feel like a résumé.

It should be concise, chronological, and easy to scan.

This is not the place for extensive storytelling. The detailed commentary, images, and reflections should live on separate company or role detail pages.

### Layout

Use a vertical timeline rail.

Each entry should contain:

- Dates
- Company
- Role
- Company logo
- One short description
- Optional restrained technology tags

I like company icons aligned on the right side of each entry, although placing them near the company name is also acceptable if recognition is better.

The rail should be visually clear without becoming decorative.

### Content

Only list companies and roles here.

Do not include:

- Metric tiles
- Large project galleries
- Long paragraphs
- Personal-interest cards
- A large skills breakdown

The page should read like a polished résumé.

The résumé itself can remain focused on technical work, while the website can include broader engineering history for visitors who choose to explore further.

---

## Experience detail page

### Purpose

Each company or major experience can have its own detail page.

This is where I can include the context that would make the main experience timeline too long.

The page should explain:

- What the company did
- What my role was
- What I worked on
- What problems I helped solve
- The systems, products, or processes involved
- What I learned
- How the experience influenced later work

### Above the fold

Use a layout similar to the project detail page.

#### Left side

Include:

- Company logo
- Company name
- Role
- Dates
- Location or remote status
- Short overview

#### Right side

Show a strong representative image.

This could be:

- Product screenshot
- Diagram
- Workplace image
- Engineering artifact
- Industrial equipment
- Relevant technical photograph

Every experience detail page should include the company icon.

### Page body

The page can include multiple images, but they should be broken up with text.

Suggested sections:

- Overview
- My role
- What I worked on
- Selected work
- Systems and tools
- Challenges
- Impact
- Reflections
- What I learned

For earlier chemical engineering work, the page can include images of the physical systems, plants, equipment, skids, fluids, or processes involved.

The goal is to show the breadth of my background without diluting the technical résumé-style experience index.

---

## About page

### Purpose

The About page should provide the personal and professional context that does not belong on the résumé-style experience page.

It can include:

- A fuller version of my background
- The transition between chemical engineering and software
- What kinds of problems I enjoy
- What I care about in software
- Current interests
- Music, family, or other personal context where appropriate
- Links to GitHub and LinkedIn

### Layout

Keep it simple and editorial.

A modest headshot is appropriate here, but it should still not dominate the viewport.

The page should feel like a thoughtful introduction rather than a biography or a personal-brand exercise.

---

## Reference and tooling content

I may eventually want a reference-oriented section, but it does not need to be a primary navigation item in the first version.

This content can initially live under Projects or Blog.

Examples include:

- LLM tracing tools
- Markdown tooling
- JSON log viewers
- Code annotation tools
- Data-flow visualization
- Reusable development skills
- Prompt and transcript workflows
- Explanations of how a tool or skill evolved

Some of these may become interactive explainers or annotated artifacts over time. The content plan includes ideas such as showing the final skill, the reasoning behind individual lines, related audio, transcripts, and diffs.

For now, the architecture should be flexible enough to support this without requiring a dedicated Skills page.

---

## Responsive behavior

### Desktop

Preserve the strong two-column compositions.

The navigation can remain horizontal.

The article table of contents can stay in a left rail.

### Tablet

Reduce the column gap and image size.

Keep the core visual split where possible.

The table of contents can become collapsible.

### Mobile

Stack content in a sensible reading order.

For the home page:

1. Name and introduction
2. Headshot
3. Main links
4. Featured work

For project detail:

1. Logo and title
2. Summary and links
3. Main image
4. Page content

For blog posts:

1. Title and metadata
2. Hero image
3. Collapsible table of contents
4. Article body

Do not preserve desktop asymmetry at the cost of readability.

---

## Final design principles

The site should feel:

- Editorial
- Technical
- Personal without being self-promotional
- Image-rich where the images carry information
- Restrained
- Easy to scan
- Built around real work and real artifacts
- Capable of growing over time

The site should not feel:

- Like a SaaS dashboard
- Like a résumé template
- Like a generic developer landing page
- Like a personal-brand funnel
- Like a collection of tiny metric cards
- Like a gallery with no written context

The strongest recurring direction is:

> Use a calm, cool, off-white visual system with soft blue, purple, and orange accents. Build pages around strong asymmetric columns. Keep the home page compact, keep the experience index résumé-like, make project and experience detail pages image-rich and narrative, and give the blog a strong editorial system with images, metadata, and a left-side table of contents.

## Visual reference

The selected concept sheet lives beside this document at [`portfolio-redesign-reference.png`](./portfolio-redesign-reference.png).
