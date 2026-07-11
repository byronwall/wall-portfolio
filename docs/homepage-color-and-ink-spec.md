# Homepage color and ink strategy

Status: design brief and baseline visual audit  
Reference: `docs/portfolio-redesign-reference.png`, concept 1  
Live baseline: `http://localhost:3010/`, inspected July 10, 2026

## Design objective

The homepage should feel editorial, technical, and quiet. Its visual hierarchy should come primarily from scale, weight, spacing, and alignment. Color, borders, shadows, pills, and filled surfaces are supporting signals, not decoration.

The governing test is: **every visible mark must either carry content, establish hierarchy, communicate interaction, or clarify grouping.** If removing a mark does not make one of those jobs harder, remove it.

This is not a monochrome page. It is a low-chroma page with a tightly controlled blue action signal and a few artifact-owned colors in project marks and photography.

## Palette

### Neutral ink

Use one cool charcoal family rather than a collection of unrelated grays.

| Role | Target | Use |
| --- | --- | --- |
| Primary ink | `#141b2b` | Name, project titles, brand, important prose |
| Body ink | `#3d4657` | Introductory and supporting paragraphs |
| Muted ink | `#68758a` | Metadata, social icons, section labels |
| Disabled/tertiary ink | `#8993a3` | Rare; only for genuinely tertiary information |

Rules:

- Do not introduce another gray when one of these roles already fits.
- Do not use pure black. The primary charcoal supplies enough contrast without becoming a separate visual event.
- A component should normally contain no more than two text-ink levels.
- Bold text may gain weight without also becoming a new color.

### Surfaces

| Role | Target | Use |
| --- | --- | --- |
| Page field | `#eef2f6` | Cool outer canvas and footer field |
| Main paper | `#ffffff` or a visually equivalent translucent white | Primary content surface |
| Quiet section | `#f7f9fc` | Featured-work field when separation is needed |
| Quiet chip | `#edf0f4` | Technology tags only |
| Image mat | `#f0f3f7` | Only if the portrait crop needs optical separation |

The page field and paper may differ slightly, but the difference should be felt before it is noticed. Section surfaces should be flat; gradients are not part of the target visual language.

### Accent color

Use a single cool blue family for actions and links.

| Role | Target | Use |
| --- | --- | --- |
| Primary action | `#2f536c` | The one dominant CTA; sampled from the portrait shirt |
| Primary hover | `#263f52` | Hover state |
| Quiet action ink | `#2f536c` | Secondary CTA and small navigational links |
| Quiet action border | `#6d899f` | Secondary CTA outline; a lighter shirt-blue value |
| Warm accent | `#9e6f52` | Tiny non-text accents; sampled from the brick backdrop |

Rules:

- Blue means “action” or “navigation,” not decoration.
- There should be only one filled blue control in the first viewport.
- Purple and orange may appear in a project-owned mark or a small semantic callout, but not as ambient page accents.
- Photography and project artwork are allowed to carry their own color. The surrounding UI should become quieter when they do.

## Ink budget

### Text

- Primary heading and brand use primary ink.
- Body copy uses body ink; the opening line may be slightly darker or larger, not both excessively.
- Metadata and icons use muted ink.
- Link affordance should be supplied by context, blue action ink, or a hover underline. Do not add permanent underlines to already obvious navigation.

### Borders

Borders are permitted only for these jobs:

1. Defining the outer paper against the page field.
2. Identifying a secondary outlined action.
3. Defining a clickable featured card when the card would otherwise not read as a unit.
4. Separating the hero from featured work when the surface change alone is insufficient.

The default border is one physical pixel in a cool neutral. Nested borders should be avoided. In particular, a bordered shell plus a divider plus three bordered cards is already the maximum reasonable border hierarchy for this page.

### Shadows

- The outer paper may have one nearly imperceptible ambient shadow.
- Buttons and cards should not have resting shadows.
- A hover shadow is acceptable only when it replaces, rather than compounds, another strong hover signal.
- The primary CTA does not need a glow. Its fill already establishes priority.

### Radius

Use a small, coherent radius family:

- Outer paper: `8–10px`
- Image mat: `10–12px`
- Cards: `6–7px`
- Buttons and tags: `4–5px`

Radius must describe containment. Do not round a region merely to make it feel designed.

### Filled regions

At rest, the homepage should contain no more than these non-image filled regions:

- outer page field;
- main paper;
- featured-work field, if retained;
- one primary CTA;
- technology chips;
- portrait mat, only if it materially improves the crop.

## Component strategy

### Navigation

The navigation is ink on paper. It gets no container, divider, active pill, or background. The brand is the darkest item. Navigation links are primary/body ink, and social icons are muted ink.

### Hero

The hero is defined by the two-column composition and whitespace. It gets no panel border or background. The portrait is the dominant color event. The mat should be removed if the photograph remains clearly contained without it.

### Actions

Keep one filled blue action and one outlined blue action. Remove the primary button shadow. The social row is tertiary and should be muted enough that it does not become a third action tier.

### Featured work

The featured region is a quiet continuation of the page, not a dashboard. Its cards may retain a one-pixel border because the entire card is clickable, but they should have no resting shadow. The section should use either a flat quiet surface or a single divider—not a gradient plus a divider unless testing shows that both are necessary.

Tags are the smallest filled UI elements. Their fill should remain neutral and their contrast modest. Project icons may keep their native color because that color belongs to the artifact, not the site chrome.

### Footer

The footer is visually subordinate to featured work. A divider may be used, but it must use the same quiet border token as the rest of the page. It must never inherit the primary text color as a border.

## Baseline visual audit

The current implementation is directionally close to the reference: cool paper, charcoal ink, blue actions, a restrained portrait, and white project cards. The remaining problem is not a wrong palette so much as **too many nearly equivalent tokens and too many simultaneous containment cues**.

The browser audit found:

- 16 computed text colors on the homepage. Several are one-off variations that do not create a meaningful hierarchy.
- 16 opaque or translucent filled elements: the paper, two buttons, the portrait mat, three cards, and nine tags.
- Eight bordered regions: the paper, two buttons, the featured divider, three cards, and the footer divider.
- Two resting shadows: the paper and the primary CTA.

At the inspected desktop layout, the main paper measured about `982px` wide. The hero was `510px` high, the portrait mat `240 × 240px`, the featured region `323px` high, and each featured card about `280 × 179px`.

### Pixel/ink comparison with the reference

The reference is a six-concept collage rather than a standalone viewport capture, so a literal image-difference percentage would be misleading: its homepage panel has been scaled and composited. The reliable comparison is therefore the topology of ink—where edges, fills, and color events occur—plus measured live CSS pixels.

| Region | Reference intent | Current rendering | Assessment |
| --- | --- | --- | --- |
| Outer paper | Very quiet one-pixel edge on cool field | `#e1e5eb` edge + 40px ambient shadow | Keep edge; shadow is acceptable but optional |
| Hero | Whitespace-led, portrait supplies most color | Whitespace-led, plus a `#f0f3f7` 12px portrait mat | Mat is extra ink unless it fixes the crop |
| Primary CTA | Flat blue priority signal | Blue fill, blue border, and blue drop shadow | Shadow is redundant |
| Secondary CTA | Thin blue outline | Thin blue outline | Correct |
| Hero/featured boundary | Quiet sectional transition | Divider + two-stop gradient | One cue too many |
| Featured cards | White clickable units with fine edges | White cards with fine edges | Correct at rest |
| Tags | Small neutral chips | Nine neutral chips | Correct, but keep contrast quiet |
| Footer | Subordinate close | Divider can resolve to primary ink through generic utility styling | Excessive if rendered dark; must use the quiet border token |

### Highest-value ink reductions

1. **Remove the primary CTA shadow.** The filled blue rectangle already carries all required emphasis.
2. **Replace the featured-work gradient with a flat `#f7f9fc` surface.** Retain the top divider initially; then test whether the surface change makes it redundant.
3. **Remove the portrait mat as an A/B test.** Keep only the image radius. Restore a thinner mat only if the photo loses containment against white.
4. **Set the footer divider explicitly to the quiet border token.** Do not allow `currentColor` to produce a charcoal rule.
5. **Collapse the homepage’s text colors into the four neutral roles above.** The current variations `#273044`, `#20283a`, `#171e2d`, `#536075`, `#556072`, `#566174`, and `#727d8f` are individually reasonable but collectively noisy.
6. **Do not add more decorative color.** The purple diamond and project favicons already provide enough artifact-owned accent color below the fold.

## Acceptance criteria

The homepage passes the color/ink review when:

- every non-image color maps to a named palette role;
- the first viewport contains one filled blue action and no other saturated UI fill;
- no resting card or button shadow remains;
- no divider is darker than the quiet neutral border token;
- the featured section uses no gradient;
- no component uses both a strong border and a shadow at rest;
- text hierarchy uses no more than four neutral ink roles across the page;
- removing any remaining border or fill would make grouping or interaction materially less clear.

## Next visual-analysis pass

After the ink reductions are implemented, capture the homepage at one fixed desktop viewport and one fixed mobile viewport. Compare those captures to this brief, not directly to the scaled collage. Record bounding boxes for the paper, hero text, portrait, CTA row, featured boundary, cards, and footer; then inspect edge density and color counts again. That second pass should decide the two intentionally provisional questions: whether the portrait needs a mat and whether featured work needs both a surface shift and a divider.
