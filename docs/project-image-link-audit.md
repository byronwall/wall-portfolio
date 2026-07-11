# Project image link audit

Audited July 11, 2026 against every image reference in `content/projects/*.mdx`. Local assets and repaired remote URLs were checked for successful loading and nonzero image dimensions.

## Unresolved links

| Route | Source | Broken URL | Likely intended asset | Recommended fix |
| --- | --- | --- | --- | --- |
| `/projects/decisory` | `content/projects/decisory.mdx:8,18,24` | `https://raw.githubusercontent.com/byronwall/llm-question-asker/main/docs/screenshot-session.png` and `.../screenshot-home.png` | Home and session screenshots from the local `llm-question-asker` project | Capture fresh home and session screenshots, add them under `public/images/projects/decisory/`, and change the front matter and two body references to local paths. The repository is no longer publicly accessible and neither image exists in its current working tree or Git history. |

## Repaired during this audit

- `/projects/1-plantasktic`: replaced the unavailable live-site optimizer URL with the verified public GitHub source image.
- `/projects/bible-study`: localized the original plan and reader screenshots from the local project checkout.
- `/projects/product-grid-management`: localized the original canvas screenshot from the local project checkout.
- `/projects/logo-dodo`: localized the live site’s brand mark and three verified product boards, used a full direction board as the project hero, and added two refinement-board examples.
