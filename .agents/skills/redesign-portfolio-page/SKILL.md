---
name: redesign-portfolio-page
description: Create, redesign, or finish pages in Byron Wall's portfolio using the approved visual system, redesign plan, and reference concepts. Use when asked to build or restyle the blog index, blog detail, projects index, project detail, experience, about, reference, or another portfolio page; carry homepage-established colors, gutters, typography, surfaces, cards, image treatment, responsive behavior, and visual-verification standards into the requested page.
---

# Redesign Portfolio Page

Implement the requested portfolio page in `/Users/byronwall/Projects/wall-portfolio`. Treat the finished homepage as the visual calibration point and the bundled plan/reference as page-specific direction.

## Required context

Read these resources before editing:

1. `references/portfolio-design-preferences.md` — governing taste, reusable rules, exact tokens, responsive standards, and review checklist.
2. `references/portfolio-redesign-plan.md` — page purpose, content requirements, and preferred composition.
3. `references/homepage-color-and-ink-spec.md` — palette roles and ink-budget reasoning.

Inspect `assets/portfolio-redesign-reference.png` and identify the concept for the requested page. Use it as directional visual evidence, not as a pixel-perfect template.

Also inspect the finished homepage and shared implementation before introducing page-local styles:

- `app/page.tsx`
- `app/global.css`
- `app/layout.tsx`
- `app/components/nav.tsx`
- `app/components/footer.tsx`

Read the existing route, its content loader, and nearby MDX/content examples before changing anything.

## Workflow

### 1. Establish the page job

State what the page must help a visitor understand or do. Select the corresponding plan/reference concept:

- Blog index: editorial stream with useful previews and scan rhythm.
- Blog detail: readable article with supporting images, metadata, and optional marginal navigation.
- Projects index: meaningful project rows or previews, not a dense gallery.
- Project detail: project summary plus a narrative body, screenshots, decisions, lessons, and related updates.
- Experience: clear chronology with restrained visual structure.
- About: direct personal/professional context without repeating the homepage.

Preserve existing content and metadata unless the user asks to change it.

### 2. Start with geometry

Apply the shared shell and gutter system before styling individual components.

- Align the brand, page title, body, section headings, images, and lower regions to intentional guides.
- Make the right edge as deliberate as the left edge.
- Prefer one strong left/right composition over a collection of unrelated cards.
- Let the page scroll; do not add empty height to make a region feel important.
- Switch columns before text or images become cramped.

Reuse shared tokens and styles where appropriate. Avoid copying homepage markup when the requested page has a different content job.

### 3. Build hierarchy and surfaces

Define a small, explicit type ladder and spacing sequence. Do not rely on generic margins.

Map every non-image color to an existing role from the bundled preferences. Use surfaces only to separate major regions. Use borders only for containment, interaction, or a meaningful surface transition.

Keep the page:

- cool-neutral;
- low-chroma;
- editorial and technical;
- image-aware;
- compact but readable;
- free of decorative dashboard ink.

### 4. Use images as evidence

Prefer real screenshots, diagrams, photographs, and artifacts that explain the content.

- Confirm every image loads and has nonzero natural dimensions.
- Use `contain` for interface screenshots when cropping would remove meaningful detail.
- Use `cover` only for intentional photographic crops.
- Use a quiet image surface when source ratios require letterboxing.
- Do not substitute stock imagery for an available project artifact.

### 5. Implement the complete page

Make the requested edits; do not stop at a critique or proposal. Keep shared behavior in shared components/styles when multiple pages consume it, but avoid broad refactors unrelated to the page.

Preserve deterministic server rendering:

- sort metadata-driven lists deterministically;
- avoid render-time random values, current-time branches, and viewport-dependent DOM trees;
- keep responsive changes in CSS when possible;
- use stable keys and stable wrapper structure.

### 6. Remove excess ink

Audit every border, fill, chip, label, divider, shadow, and link.

Remove:

- duplicate `View all` links when a section heading already links to the destination;
- resting button/card shadows;
- gradients used only as decoration;
- colors too similar to communicate a visible surface change;
- tiny text used to preserve an arbitrary card size;
- tags or metadata that do not help scanning;
- empty vertical space with no compositional purpose.

### 7. Verify in the running browser

Use `http://localhost:3010/`. Do not run `pnpm build`, `next build`, or another production build unless the user explicitly asks; builds disrupt the development server and are not proof that the page works.

Perform the narrowest relevant static check, such as `pnpm exec tsc --noEmit`, when code changes warrant it.

In the browser:

1. Hard-refresh or reload the requested route.
2. Inspect desktop composition and a narrower responsive state.
3. Measure shared left and right guides with computed geometry.
4. Confirm intended colors with computed styles.
5. Check text contrast for filled controls.
6. Confirm images load at nonzero natural dimensions.
7. Check card/list overflow and truncation.
8. Check the intended column transition.
9. Inspect console errors relevant to the page.
10. Capture a screenshot that visibly proves the finished result.

Reject a change that is technically present but visually indistinguishable. Iterate until the screenshot, geometry, and computed styles support the intended design.

## Handoff

Report:

- the implemented page and its primary composition;
- files changed;
- important shared preferences applied;
- responsive behavior verified;
- static checks run;
- browser measurements or evidence that establish alignment and surface behavior;
- an inline screenshot of the final page.

Keep the requested route open in the browser for review.
