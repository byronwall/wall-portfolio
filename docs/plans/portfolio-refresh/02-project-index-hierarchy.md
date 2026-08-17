# Project index hierarchy plan

## Goal

Replace the prior vertical-list direction with a Bento hierarchy. Show about
two large projects, four medium projects, and smaller entries after them.
Make important, active, and substantial projects visible without hiding the
long tail.

## Current evidence

The memo asks for a bento or masonry-like index with one or two large featured
projects, four or five medium projects, and a smaller grid for the rest
(`07:12–08:55`). It also asks for strong imagery, project icons or favicons,
and more context on the large entries (`08:55–09:17`). The current flat list
forces the reader to scroll and gives important projects the same weight as
one-day experiments (`09:01–09:50`).

The repository has 24 project MDX entries. The page in
`app/projects/page.tsx` sorts every entry by `publishedAt` and renders the same
`.row` structure for each project. `app/projects/projects.module.css` defines a
uniform two-column row and a initials placeholder. Only two projects currently
have `status: "active"`; most still use the display value `Content coming soon`.
The home page already selects project entries with `featured: "true"`.

The earlier vertical-list direction is superseded. The decided layout is a
Bento hierarchy with about two large entries, four medium entries, and a
smaller remainder.

## Scope

- Define explicit index tiers and a deterministic order within each tier.
- Use the existing `featured` field for the first hero tier.
- Add one optional medium-tier field and one optional order field if needed.
- Keep lifecycle status separate from visual prominence.
- Give featured entries more room for description, links, and importance.
- Require an image for every public project index item. Prefer meaningful
  evidence. Track a placeholder when no meaningful image exists.
- Preserve the current visual system and responsive stacking behavior.

## Non-goals

- Do not delete or hide the small-project archive.
- Do not derive importance from publication year.
- Do not add filters, search, or a project timeline in this slice.
- Do not make every card show every link or every tag.
- Do not require a new icon asset before the hierarchy can render.
- Do not add draft, unlisted, or private publication states. All included
  project entries are public.

## Proposed implementation

Use a small, explicit display model:

```text
featured: "true"       -> hero tier; target one or two entries
indexTier: "medium"    -> selected tier; target four or five entries
indexOrder: 10         -> stable order within a tier
icon: "/images/..."    -> optional project mark or favicon
```

`featured` is the only promotion flag. `indexTier` and `indexOrder` are layout
fields, not publication states. Entries without `indexTier` remain compact.
Keep these fields separate from lifecycle status and visibility.

Render three semantic groups in `app/projects/page.tsx`:

1. Featured projects with large media and an expanded copy block.
2. Selected projects with medium cards.
3. The remaining archive in a compact grid or list.

Use CSS Grid with explicit spans instead of CSS columns. This keeps reading
order, keyboard order, and responsive behavior predictable. At the mobile
breakpoint, all groups should become one ordered list.

Featured cards should show only the context that helps a reader decide to
open the project:

- title and short description;
- lifecycle status;
- one or two primary links;
- one importance or role sentence when the content supports it;
- image and optional icon.

Use `project.thumbnail` for the main artifact. Use `icon` only as a separate
identity asset. Keep the existing initials fallback only for entries that the
image audit marks as having no meaningful artifact. Record each placeholder
slug and reason in the editorial inventory. Do not use a generic decorative
image in place of missing evidence.

Add a shared helper in `app/blog/utils.ts` only if the page and home need the
same tier ordering. The helper must apply the same tie-breakers on every route:
featured tier, explicit tier, `indexOrder`, then title. It must not depend on
the current date.

## Affected files or systems

| Area | Planned work |
| --- | --- |
| `content/projects/*.mdx` | Assign tiers, stable order, lifecycle status, and optional icons for selected entries. |
| `app/blog/utils.ts` | Centralize project index ordering if Home and Projects share it. Do not add visibility states. |
| `app/projects/page.tsx` | Render tier groups and richer featured entries. |
| `app/projects/projects.module.css` | Add desktop tier layouts, compact archive treatment, and mobile stacking. |
| `app/page.tsx` | Confirm home featured projects use the same approved featured set. |
| `public/images/projects/**` | Add or localize only useful hero and icon assets. |
| `app/components/project-cards.tsx` | Check whether the legacy hard-coded component is still used. Remove or align it only in a separate cleanup change. |

## Stages

1. Audit project importance, lifecycle, image quality, and available links.
2. Choose the first one or two featured entries and four or five medium
   entries. Record the reason for each assignment.
3. Add and validate the smallest metadata model.
4. Implement the three-group page structure with semantic links and stable
   ordering.
5. Add the responsive CSS and missing-asset fallback.
6. Compare the index with Home and correct any featured-set mismatch.

## Acceptance criteria

- The index shows one or two visually dominant projects first.
- Four or five additional projects have visible medium emphasis.
- The remaining projects remain discoverable without equal visual weight.
- Order is stable across refreshes and does not change because a year passes.
- Featured entries show useful context without becoming dense dashboards.
- Every public project index item has a meaningful image or a tracked
  placeholder. Missing images do not break card height, reading order, or
  accessibility.
- Keyboard users can reach every project in the same order as visual reading.
- Mobile renders one coherent sequence without hidden or duplicated cards.
- `featured` is the only promotion flag. No draft, unlisted, or private state
  is needed.

## Verification

- Audit all project frontmatter with `rg` before and after tier assignment.
- Check the image inventory and confirm every public index item has an image or
  a tracked placeholder.
- Use the existing development server to check `/projects` at desktop,
  tablet, and mobile widths.
- Open a featured project, a medium project, and a no-image project.
- Confirm links, image alt behavior, focus order, and status labels.
- Confirm Home and Projects use the same featured entries.
- Run narrow type or lint checks available in the repository. Do not run a
  production build.

## Dependencies

- Confirm the exact membership of the hero and medium tiers.
- Choose the final lifecycle vocabulary and replace `Content coming soon`.
- Decide whether every project needs a favicon or only selected projects.
- Decide whether featured cards need a new “why this matters” field or can use
  the existing description and summary.

## Risks

- Manual ranking can become stale as projects change.
- A masonry effect can damage scan order if it uses visual positioning only.
- External image URLs can fail or change without notice.
- A large featured tier can make the page feel like a marketing homepage.
- Mixing lifecycle and visual tier can produce misleading status signals.
