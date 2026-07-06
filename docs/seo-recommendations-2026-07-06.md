# SEO recommendations for byroni.us

Audit date: 2026-07-06

Scope:

- Google Search Console domain property: `byroni.us`
- Production site: `https://byroni.us/`
- Subdomain with separate traffic: `https://hn.byroni.us/`
- Repo inspected: `/Users/byronwall/Projects/wall-portfolio`

## Executive summary

The highest-impact SEO fix is technical: production is serving `robots.txt` and `sitemap.xml` with the old starter-domain URL, `https://portfolio-blog-starter.vercel.app`. That means Google is being pointed at the wrong sitemap host even though the public pages themselves are reachable at `https://byroni.us/`.

Search Console performance is currently low-volume but useful. For the 3-month report ending 2026-07-04, the domain property showed 15 clicks, 4.66K impressions, 0.3% CTR, and average position 18.9. The main opportunity is to convert existing impressions on a few high-signal pages, especially the hydraulic schematic project page and HN Offline pages, while making sure the sitemap/canonical signals are correct.

## Search Console findings

Observed from the `byroni.us` domain property:

- Performance: 15 total web search clicks in the visible 3-month window.
- Detailed Performance report: 4.66K impressions, 0.3% average CTR, 18.9 average position, last updated 3.5 hours before review.
- Indexing: 112 indexed pages, 191 not indexed pages.
- Not indexed reasons:
  - `Crawled - currently not indexed`: 183
  - `Page with redirect`: 4
  - `Not found (404)`: 3
  - `Duplicate without user-selected canonical`: 1
- Experience:
  - HTTPS: 12 HTTPS, 0 non-HTTPS.
  - Core Web Vitals: no mobile or desktop field data.

Top queries by impressions were mostly:

- `"project euler 912" solution`
- `"project euler 912" answer`
- `hn.algolia`
- `hydraulic schematic drawing online`
- `hydraulic schematic program`
- `hydraulic schematic drawing software`
- `hydraulic schematic maker`
- `online hydraulic schematic software`

Top pages by clicks/impressions:

| Page | Clicks | Impressions | Read |
| --- | ---: | ---: | --- |
| `https://byroni.us/blog/libre-chat-coolify` | 9 | 417 | Good CTR relative to the site |
| `https://byroni.us/projects/0-hn-offline` | 2 | 289 | Relevant to HN subdomain traffic |
| `https://byroni.us/projects/hydraulic-schematic-tool` | 1 | 809 | High impressions, low CTR |
| `http://excel.byroni.us/blog/2018/11/23/concatenation.html` | 1 | 380 | Legacy subdomain still visible |
| `https://byroni.us/resume_byron_wall.pdf` | 1 | 326 | Search Console flagged recent impression growth |
| `https://hn.byroni.us/story/41841581` | 0 | 1,506 | High impressions, no clicks |
| `https://byroni.us/` | 0 | 148 | Homepage not converting search impressions |

## Production crawl findings

### 1. Fix sitemap and robots immediately

Production `https://byroni.us/robots.txt` currently serves:

```txt
User-Agent: *

Sitemap: https://portfolio-blog-starter.vercel.app/sitemap.xml
```

Production `https://byroni.us/sitemap.xml` emits URLs like:

```xml
<loc>https://portfolio-blog-starter.vercel.app</loc>
<loc>https://portfolio-blog-starter.vercel.app/blog</loc>
<loc>https://portfolio-blog-starter.vercel.app/blog/libre-chat-coolify</loc>
```

Repo cause: `app/sitemap.ts` defines:

```ts
export const baseUrl = 'https://portfolio-blog-starter.vercel.app'
```

That `baseUrl` is also imported by `app/robots.ts`, blog metadata, project metadata, OG image URLs, and JSON-LD.

Recommended change:

- Set `baseUrl` to `https://byroni.us`.
- Include all important indexable routes in `sitemap.xml`, not only `''`, `/blog`, and blog posts.
- Add `/projects`, project detail pages, `/about`, and any durable landing pages.
- Keep transient, duplicate, or utility URLs out of the main sitemap.

Expected impact: this removes a major conflicting crawl signal and should make the indexed/not-indexed report easier to interpret.

### 2. Add explicit canonical URLs

The production pages have useful title/description metadata, but I did not see explicit canonical link tags in the sampled HTML. Because the site has had starter-domain URLs in sitemaps and metadata, explicit canonicals should be added.

Recommended change:

- Add `alternates: { canonical: ... }` in Next metadata for the homepage, blog index, blog posts, projects index, project pages, and about page.
- Use `https://byroni.us/...` canonicals only.
- For legacy subdomains or old hosts, redirect or canonicalize intentionally.

### 3. Fix Open Graph and JSON-LD hostnames

The live hydraulic schematic page currently emits starter-domain Open Graph values:

- `og:url`: `https://portfolio-blog-starter.vercel.app/projects/hydraulic-schematic-tool`
- `og:image`: `https://portfolio-blog-starter.vercel.app/og?...`
- `twitter:image`: `https://portfolio-blog-starter.vercel.app/og?...`

Blog JSON-LD also uses `baseUrl`. Once `baseUrl` is corrected, validate that:

- `BlogPosting.url` uses `https://byroni.us/blog/...`
- `BlogPosting.image` is absolute and on `https://byroni.us`
- `author.name` is `Byron Wall`, not `My Portfolio`

### 4. Expand sitemap coverage for projects

The repo has 18 blog posts and 22 project entries, but the current sitemap only lists the homepage, `/blog`, and blog posts. Search Console shows project pages already getting impressions, so project URLs should be first-class sitemap entries.

Recommended sitemap entries:

- `/`
- `/blog`
- `/about`
- `/projects`
- `/blog/{slug}` for every post
- `/projects/{slug}` for every project

Use `publishedAt` or a real `updatedAt` frontmatter field for stable `lastModified`. Avoid using the current deploy date for static index pages unless the content really changed.

### 5. Improve high-impression page snippets

`/projects/hydraulic-schematic-tool` has 809 impressions and only 1 click. The current title and description are accurate but generic:

- Title: `Interactive Hydraulic Schematic Tool | Byron Wall`
- Description: `An Electron-based application for hydraulic system visualization and analysis`

Search Console queries show people are looking for online hydraulic schematic drawing software and makers. The page should speak directly to those searches without overclaiming.

Recommended revisions:

- Title candidate: `Hydraulic Schematic Drawing Tool Built with React and SVG`
- Description candidate: `A case study on building an interactive hydraulic schematic editor with React, TypeScript, Electron, SVG rendering, drag-and-drop components, and engineering validation workflows.`
- Add a short intro section using phrases from the real queries:
  - hydraulic schematic drawing software
  - hydraulic schematic maker
  - hydraulic system visualization
  - SVG schematic editor
- Add screenshots or diagrams if available. The current page is text-only in the crawled content.
- Add internal links from the homepage, projects index, and any related data-visualization posts using descriptive anchor text.

### 6. Treat `libre-chat-coolify` as a model page

`/blog/libre-chat-coolify` has the best observed click performance: 9 clicks from 417 impressions. It works because it has a specific problem, named tools, and practical steps.

Use it as the model for future posts:

- Specific title with product names.
- Clear first paragraph that says what problem was solved.
- H2 sections matching likely search intent.
- Practical checklists and commands.
- Links to primary references where useful.

### 7. Clean up indexing exclusions

The 183 `Crawled - currently not indexed` URLs are the main indexing bucket. Some may be expected, especially if `hn.byroni.us/story/...` creates many time-sensitive or thin story pages. The goal is not to index everything; it is to make the important pages clearly worth indexing and make unimportant pages clearly disposable.

Recommended process:

1. In Search Console Pages report, open `Crawled - currently not indexed`.
2. Export examples.
3. Classify them into:
   - important portfolio pages
   - old/legacy URLs
   - HN story pages
   - parameterized/duplicate URLs
   - true 404/redirect cleanup
4. For important pages: improve content, internal links, sitemap inclusion, title/description, and canonical.
5. For unimportant pages: remove from sitemap, add canonical/noindex where appropriate, or let them stay excluded.

## `hn.byroni.us` recommendations

### Current state

`hn.byroni.us` is visible in the domain-property Search Console data. One story URL had 1,506 impressions and 0 clicks, and other HN story URLs appear in the top pages table. Since the desired policy is that the HN site should not be indexed, treat this traffic as cleanup work rather than an SEO growth surface.

Live crawl observations:

- `https://hn.byroni.us/` is crawlable and renders a top-story page.
- `https://hn.byroni.us/robots.txt` returns HTTP 200 but renders the app's 404 HTML, not a real robots file.
- `https://hn.byroni.us/sitemap.xml` also returns HTTP 200 with app 404 HTML.
- The HN app homepage uses a generic title/description:
  - Title: `HN Offline`
  - Description: `Hacker News Offline`

### Split HN into its own Search Console property for cleanup

You already have a domain property for `byroni.us`, which aggregates all subdomains. Google documents that a Domain property includes all subdomains and protocols, while a URL-prefix property includes only URLs beginning with the exact prefix. Google also recommends adding URL-prefix properties when you want separate data for a subdomain, path, or protocol.

In this case, add the property so you can monitor removal/deindexing separately, not to improve ranking.

Process:

1. Open Google Search Console.
2. Open the property selector.
3. Choose `+ Add property`.
4. Select `URL-prefix`, not `Domain`.
5. Enter exactly:

   ```txt
   https://hn.byroni.us/
   ```

6. Verify ownership. Because `byroni.us` is already verified as a domain property, child properties may auto-verify if Search Console can reuse the parent verification.
7. After verification, use the new `https://hn.byroni.us/` property for HN-specific Performance, Pages, Removals, and URL Inspection.
8. Keep the existing `byroni.us` domain property as the aggregate roll-up.
9. Do not submit an HN sitemap if the site is intended to remain non-indexable.

Official references:

- Google Search Console property types: https://support.google.com/webmasters/answer/34592
- Google ownership verification and child-property auto-verification: https://support.google.com/webmasters/answer/9008080

### Noindex the HN site

The sibling app lives at `/Users/byronwall/Projects/hn-client`. It is a SolidStart/Vinxi app with `@solidjs/meta` already installed and `MetaProvider` already wrapped around the router in `src/app.tsx`.

Recommended implementation:

- Add a global robots meta tag in the HN app shell:

  ```tsx
  import { Meta } from "@solidjs/meta";

  <Meta name="robots" content="noindex, nofollow" />
  ```

- Put it in the shared app/root layer so every route gets it, including `/`, `/day`, `/week`, `/offline`, and `/story/{id}`.
- If you want links on the page to still pass discovery signals, use `noindex, follow` instead. For a private-ish utility subdomain, `noindex, nofollow` is the cleaner default.

### Add a real HN robots file

Add real files or routes:

```txt
# https://hn.byroni.us/robots.txt
User-agent: *
Disallow: /
```

The HN app has a `public/` directory, so the simplest implementation is to add `/Users/byronwall/Projects/hn-client/public/robots.txt`.

Do not serve a sitemap for HN if the goal is no indexing. Also fix the current behavior where `/robots.txt` and `/sitemap.xml` return HTTP 200 with app 404 HTML. Either serve a real `robots.txt` and let `/sitemap.xml` return a real 404/410, or serve an empty/non-discoverability sitemap only if some other tooling requires the path.

### Use Search Console removal tools after noindex is live

After `noindex` is deployed:

1. In the new `https://hn.byroni.us/` URL-prefix property, inspect a few indexed or impression-heavy story URLs.
2. Confirm the live page has `noindex`.
3. Use the Removals report for temporary hiding if you want the results out faster.
4. Let Google recrawl for permanent removal from the index.
5. Monitor the HN property until indexed URL counts and impressions decay.

## Prioritized action plan

### P0: Fix crawl identity

- Change `baseUrl` from `https://portfolio-blog-starter.vercel.app` to `https://byroni.us`.
- Redeploy and verify:
  - `https://byroni.us/robots.txt`
  - `https://byroni.us/sitemap.xml`
  - `og:url` on one blog post and one project page
  - generated JSON-LD URL fields
- Add explicit canonical metadata.

### P1: Expand discoverability

- Add project URLs and `/projects` to the sitemap.
- Submit the corrected sitemap in Search Console.
- Request validation for indexing issues only after the corrected sitemap is live.
- Add internal links to high-value pages from homepage, projects index, and related posts.

### P2: Improve pages with existing impressions

- Rewrite `/projects/hydraulic-schematic-tool` title/description/body intro around the observed hydraulic schematic queries.
- Add screenshots or diagrams to the hydraulic page.
- Strengthen `/projects/0-hn-offline` as the indexable portfolio explanation for the HN app.
- Keep `https://hn.byroni.us/` itself non-indexable.

### P3: Split and deindex HN search reporting

- Add `https://hn.byroni.us/` as a URL-prefix property in Search Console.
- Add global `noindex, nofollow` metadata in `/Users/byronwall/Projects/hn-client`.
- Add `public/robots.txt` with `Disallow: /`.
- Do not submit an HN sitemap.
- Use the HN property to monitor deindexing and request temporary removals if needed.

### P4: Measurement loop

After deploying the crawl fixes:

- Check Search Console after 7 days for sitemap processing.
- Check Performance after 14-28 days for CTR movement on:
  - `/projects/hydraulic-schematic-tool`
  - `/projects/0-hn-offline`
  - `/blog/libre-chat-coolify`
- Check the HN property after 14-28 days for declining impressions and indexed URL counts.
- Track:
  - impressions
  - CTR
  - average position
  - indexed vs not indexed count
  - examples in `Crawled - currently not indexed`

## Suggested implementation checklist

- [ ] Update `app/sitemap.ts` `baseUrl`.
- [ ] Add project and static routes to `sitemap()`.
- [ ] Add canonical metadata via `alternates.canonical`.
- [ ] Fix blog JSON-LD author name.
- [ ] Redeploy `byroni.us`.
- [ ] Validate live `robots.txt` and `sitemap.xml`.
- [ ] Submit corrected sitemap in Search Console.
- [ ] Create `https://hn.byroni.us/` URL-prefix property for cleanup monitoring.
- [ ] Add global `noindex, nofollow` metadata in `/Users/byronwall/Projects/hn-client`.
- [ ] Add `/Users/byronwall/Projects/hn-client/public/robots.txt` with `Disallow: /`.
- [ ] Do not submit an HN sitemap.
