# Portfolio design preferences

Status: working source of truth for redesigning the remaining pages  
Derived from: the homepage iteration, `portfolio-redesign-plan.md`, `portfolio-redesign-reference.png`, and `homepage-color-and-ink-spec.md`  
Last updated: July 11, 2026

## Purpose

This document captures the visual preferences and design judgments established while rebuilding the homepage. Use it as the starting point for Projects, Blog, Experience, About, project detail pages, and article pages.

The reference image is directional, not a pixel-perfect template. Preserve its editorial restraint, strong left/right compositions, cool palette, image awareness, and clear hierarchy. Use the finished homepage as the practical calibration point for color, ink, gutters, spacing, borders, typography, responsive behavior, and verification.

## The overall trajectory

The site should feel like a clear, opinionated record of work and thought. It should be:

- editorial rather than dashboard-like;
- technical without looking like developer-tool chrome;
- image-aware without becoming a gallery;
- restrained without becoming sterile;
- structured by alignment, scale, spacing, and surfaces before decoration;
- compact enough to preview meaningful content without feeling compressed.

The design process should generally move in this direction:

1. Establish one architectural composition and shared gutters.
2. Build hierarchy with type scale, spacing, and image placement.
3. Introduce only the surfaces needed to separate major content regions.
4. Add borders only where they explain containment or interaction.
5. Add color only where it communicates action, navigation, or artifact identity.
6. Remove any ink, border, shadow, label, or link that does not perform a clear job.
7. Verify the result in the running browser with visual proof.

## Governing design test

Every visible mark must do at least one of these jobs:

- carry content;
- establish hierarchy;
- communicate interaction;
- clarify grouping;
- identify the underlying project or artifact.

If removing a mark does not make one of those jobs harder, remove it.

## Layout and composition

### Prefer strong left/right structures

Use asymmetric two-column compositions when they help tell the story:

- text left, image right;
- large image left, title and description right;
- marginal navigation left, article body right;
- project summary left, product screenshot right;
- timeline rail beside experience details.

The two sides do not need equal weight. The layout should feel architectural and deliberate rather than like a generic centered marketing template.

### Use one shared gutter system

All major page regions should resolve to the same left and right guides:

- brand mark;
- page title;
- body introduction;
- section headings;
- navigation endpoints;
- hero images;
- content preview grids;
- major article or project regions.

Current homepage calibration:

- desktop gutter: `86px`;
- narrow/mobile gutter: `28px`;
- narrow gutter begins at `760px`.

Do not give the navigation, hero, and lower sections independent horizontal padding. On the homepage, `BW`, the large `B` in Byron, and section headings share the left guide. The LinkedIn icon, portrait edge, and rightmost cards share the right guide.

### Let pages scroll

The first viewport should feel composed, but the whole page does not need to fit inside it. Project pages, articles, experience pages, and indexes should continue naturally below the fold.

Do not add empty height merely to make a section feel grand. Prefer compact, meaningful previews over large decorative whitespace.

### Responsive behavior should protect the content

Do not keep columns after their contents become cramped.

Current homepage behavior:

- preview cards use two columns above `960px`;
- preview cards use one column at `960px` and below;
- cards preserve image-left/text-right structure until `520px`;
- below `520px`, the image stacks above the copy;
- mobile navigation, hero, and content sections retain one shared `28px` gutter.

Choose breakpoints from the point where content stops fitting comfortably, not from device labels alone.

## Surfaces and page architecture

Use surfaces to identify major regions, not individual facts.

Current surface roles:

| Role | Color | Use |
| --- | --- | --- |
| Page field | `#eef2f6` | Outer canvas and footer field |
| Paper | `#ffffff` | Primary content surface |
| Quiet section | `#f7f9fc` | Secondary content region |
| Quiet chip | `#edf0f4` | Small metadata tags only |

Preferences:

- Surface changes should be visibly meaningful. Colors separated by only one or two RGB values are technically different but visually useless.
- Keep surfaces flat. Do not use gradients as ambient decoration.
- A footer should feel like the page returning to the outer field, not like another content card.
- The footer may keep one top divider, but it should have no left, right, or bottom border.
- The main content paper may have a quiet edge and an almost imperceptible ambient shadow.
- Do not nest multiple bordered surfaces unless each boundary explains a different level of containment.

## Color strategy

The site is low-chroma, not monochrome. Use a narrow cool-neutral system, one portrait-derived blue family, and a tiny warm accent.

### Neutral ink

| Role | Color | Use |
| --- | --- | --- |
| Primary ink | `#141b2b` | Major titles, brand, important prose |
| Body ink | `#3d4657` | Supporting prose and descriptions |
| Muted ink | `#68758a` | Metadata, labels, social icons |
| Tertiary ink | `#8993a3` | Rare, genuinely tertiary information |

Rules:

- Use dark charcoal rather than pure black.
- Do not introduce a new gray when an existing role already fits.
- A component should normally contain no more than two text-ink levels.
- Use font weight before inventing another text color.

### Action blue

The blue family comes from the shirt in the homepage portrait:

| Role | Color |
| --- | --- |
| Primary action | `#2f536c` |
| Primary hover | `#263f52` |
| Quiet action | `#2f536c` |
| Quiet action border | `#6d899f` |

Blue means action or navigation. It is not ambient decoration.

- Use no more than one filled blue action in the first viewport.
- A filled action should use white text with verified contrast.
- The current primary button contrast is approximately `8.16:1`.
- Secondary actions may use a quiet outline and blue ink.
- Do not add button glows or resting shadows.

### Warm accent

Use `#9e6f52`, sampled from the brick backdrop, for tiny non-text accents. It should not compete with the blue action family.

Project logos, screenshots, and artwork may retain their native colors because those colors belong to the artifact rather than the site chrome.

## Typography and rhythm

Build hierarchy with a small number of deliberate levels.

Homepage calibration:

- major title: `46–62px`, line-height `1`;
- lead paragraph: `18px`, line-height `1.48`;
- supporting hero copy: `15.5px`, line-height `1.58`;
- preview-card title: `20px`, line-height `1.18`;
- preview-card description: `14px`, line-height `1.42`;
- section label: compact `11px` uppercase with restrained tracking.

Spacing calibration:

- `30px` after the homepage title;
- `18px` between prose groups;
- `26px` before primary actions;
- `22px` before tertiary social links.

Preferences:

- Major titles can have editorial weight but should not turn the page into a poster.
- Body copy should be clearly subordinate to the title without becoming tiny.
- Do not rely on generic paragraph margins. Define the spacing sequence for each content stack.
- When a card has unused room, increase useful text size or reduce card height before adding decorative content.
- Avoid excessive truncation. Clamp only to preserve a shared card edge, and allow enough lines to use the available space.
- Short section labels should say what the destination is: `Projects →`, not `Featured projects →`, when the section context already establishes that the items are selected.

## Images

Images should explain or preview the content.

- Prefer real project screenshots and relevant artifacts over logos, stock imagery, or generic illustrations.
- Use a portrait as a contained visual event, not a full-height background or giant lifestyle image.
- Do not add a mat behind an image unless it materially improves containment.
- When showing interface screenshots, prefer `object-fit: contain` so the full interface remains visible.
- A quiet image surface may provide letterboxing when source aspect ratios vary.
- Use `cover` only when cropping is intentional and no meaningful interface content is lost.
- Distribute images through long pages so they support the narrative rather than form one uninterrupted gallery.

## Cards and content previews

Cards are previews, not dashboard widgets.

Current homepage preview pattern:

- two cards per section;
- maximum card width: `500px`;
- desktop card height: `220px`;
- image rail on the left, copy rail on the right;
- image width: approximately `48%`;
- complete screenshot contained inside a quiet image surface;
- title and description aligned to the top with `20px 18px` copy padding;
- one quiet one-pixel border;
- no resting shadow;
- optional subtle lift, border change, and shadow on hover;
- three-line title clamp and five-line description clamp when required.

Use the same structural pattern for parallel content types when the goal is comparison or preview. On the homepage, Projects and Blog posts share one card anatomy.

Do not:

- force three cards into a row when two give the content room to breathe;
- make cards square when the content is naturally landscape-oriented;
- crop interface screenshots merely to fill the image rail;
- use tiny text to preserve an arbitrary card size;
- add technology chips unless they provide enough value to justify another layer of ink.

## Links and interaction

- Keep navigation simple: Projects, Blog, Experience, About, GitHub, and LinkedIn.
- Use `BW` as the brand mark. Do not repeat the headshot in navigation.
- Obvious navigation does not need permanent underlines.
- Use a hover underline or color change for contextual prose links.
- Do not make a full section-heading row clickable when only the label and arrow communicate navigation.
- Keep arrows close to their labels so they read as one compact link.
- Large preview cards may be fully clickable because the card itself is the preview object.
- Avoid duplicate links that waste vertical space, such as a section-heading link plus a separate `View all` link below the same content.

## Borders, shadows, radius, and ink

### Borders

Use a quiet one-pixel cool-neutral border only to:

- define paper against the page field;
- identify a secondary outlined action;
- establish a clickable card boundary;
- separate major adjacent surfaces.

Do not let a generic utility inherit primary text color as a border. Set divider colors explicitly.

### Shadows

- The outer paper may have one nearly imperceptible ambient shadow.
- Buttons and cards should not have resting shadows.
- Hover shadows should be subtle and should not compound another strong effect.

### Radius

Use a coherent, restrained family:

- outer paper: `8–10px`;
- major images: approximately `9px`;
- cards: `6–7px`;
- buttons and chips: `4–5px`.

Radius should describe containment, not decorate every rectangle.

## Section and footer behavior

- Major sections may alternate between paper and a quiet surface.
- Use one divider at a surface transition when the color change alone is insufficient.
- Do not combine a gradient, divider, border, and shadow to explain one transition.
- The footer should be clearly distinct from the content above it.
- The footer should use the page-field color and blend into the outer canvas.
- Remove footer side and bottom borders so the field can continue uninterrupted.

## Content preferences

- Projects are durable containers for a body of work, not gallery tiles.
- Blog posts are the stream of updates, experiments, debugging notes, and lessons connected to projects.
- Homepage sections should hint at available content rather than reproduce full indexes.
- Featured blog posts use `featured: true` in frontmatter.
- Select featured posts by `publishedAt` descending and take the newest requested count.
- Keep featured ordering deterministic.
- Show enough title, description, and image to explain why the content is worth opening.

## Explicit anti-patterns

Do not introduce:

- metric tiles or résumé-stat cards;
- a dashboard aesthetic;
- eyebrow copy above major page titles;
- decorative all-caps kickers above major headings;
- a giant portrait dominating half the viewport;
- dense screenshot grids with no narrative;
- generic stock imagery;
- beige, sepia, sand, or warm cream as the main field;
- neon or highly saturated accents;
- decorative lifestyle collages;
- unnecessary contact or skills pages;
- horizontal project timelines;
- redundant `View all` links;
- borders or fills whose difference is too subtle to perceive;
- arbitrary empty height intended only to make a section feel important.

## Applying these preferences to other pages

For each page:

1. Re-read the relevant section of `portfolio-redesign-plan.md`.
2. Inspect the corresponding concept in `portfolio-redesign-reference.png`.
3. Identify the page’s primary left/right composition.
4. Apply the shared gutters before styling individual components.
5. Map every non-image color to an existing palette role.
6. Define the type hierarchy and vertical rhythm explicitly.
7. Choose a small number of meaningful surfaces.
8. Use images that explain the page’s content.
9. Remove redundant borders, shadows, labels, chips, and links.
10. Verify desktop and narrow behavior in the running browser.

The homepage is a calibration example, not a component mandate. Other pages can use different layouts when their content requires it, but changes should preserve the same taste: strong alignment, restrained ink, useful images, compact previews, meaningful surfaces, and direct navigation.

## Visual verification standard

Do not use a production build as proof that the site works. Building disrupts the local development server and is only run when explicitly requested.

For visual changes:

- inspect the running site at `http://localhost:3010/`;
- use computed geometry to verify shared gutters and aligned edges;
- use computed colors to confirm intended surface differences;
- verify text contrast for filled controls;
- confirm image natural dimensions and loading state;
- confirm cards do not overflow;
- confirm responsive column changes at the intended breakpoint;
- capture a screenshot that visibly proves the change;
- reject changes that are technically different but visually indistinguishable.

## Review checklist

Before considering a page complete, ask:

- Do the navigation, title, body, images, and lower sections share the intended gutters?
- Does the right edge align as clearly as the left edge?
- Is the primary composition obvious without decorative explanation?
- Does every color map to a named role?
- Are surface changes clearly perceptible?
- Is every border necessary?
- Is any resting shadow doing work that a border or fill already does?
- Is the type hierarchy legible at a glance?
- Does the vertical rhythm come from deliberate spacing rather than default margins?
- Are images complete, relevant, and uncropped when interface detail matters?
- Do cards switch columns before their text becomes cramped?
- Are section links compact and non-duplicative?
- Does the footer clearly return to the page field?
- Is there any ink or vertical space that can be removed without losing meaning?
- Is there strong browser evidence that the final result matches the intended design?
