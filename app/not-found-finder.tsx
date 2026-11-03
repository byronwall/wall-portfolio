"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { highlight } from "./blog/blog-index";
import { NotFoundArt } from "./not-found-art";
import styles from "./not-found.module.css";

export type FinderEntry = {
  href: string;
  slug: string;
  title: string;
  summary: string;
  kind: string;
  date: string;
};

type Section = { href: string; label: string; count?: number };

const STOP = new Set(["the", "and", "for", "with", "how", "does", "not", "exist", "nope", "page", "index", "html", "www"]);
const SECTION_KIND: Record<string, string> = { blog: "Post", projects: "Project", games: "Game" };

const words = (text: string) =>
  text.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 1 && !STOP.has(word));

function trigrams(text: string) {
  const padded = `  ${text} `;
  const grams = new Set<string>();
  for (let i = 0; i < padded.length - 2; i++) grams.add(padded.slice(i, i + 3));
  return grams;
}

function dice(a: string, b: string) {
  if (!a || !b) return 0;
  const ga = trigrams(a);
  const gb = trigrams(b);
  let shared = 0;
  for (const gram of ga) if (gb.has(gram)) shared++;
  return (2 * shared) / (ga.size + gb.size);
}

function wordMatch(word: string, candidates: string[]) {
  let best = 0;
  for (const candidate of candidates) {
    if (candidate === word) return 1;
    if (word.length > 2 && candidate.length > 2 && (candidate.startsWith(word) || word.startsWith(candidate))) best = Math.max(best, 0.8);
    else if (word.length > 3) {
      const similar = dice(word, candidate);
      if (similar > 0.5) best = Math.max(best, similar * 0.7);
    }
  }
  return best;
}

// Rank every entry against the missing path: whole-slug similarity catches typos,
// word overlap with the slug and title catches partial or reordered URLs.
function rankByPath(entries: FinderEntry[], pathname: string) {
  const parts = pathname.split("/").filter(Boolean).map((part) => decodeURIComponent(part));
  const kind = SECTION_KIND[parts[0]?.toLowerCase() ?? ""];
  const slug = (kind ? parts.slice(1) : parts).join("-").toLowerCase();
  const missing = words(slug);
  if (missing.length === 0) return [];

  return entries
    .map((entry) => {
      const candidates = words(`${entry.slug} ${entry.title}`);
      const overlap = missing.reduce((sum, word) => sum + wordMatch(word, candidates), 0) / missing.length;
      const score = Math.max(dice(slug, entry.slug), overlap) * (!kind || entry.kind === kind ? 1 : 0.85);
      return { entry, score };
    })
    .filter((item) => item.score >= 0.4)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function searchEntries(entries: FinderEntry[], needle: string) {
  return entries
    .map((entry) => {
      const inTitle = entry.title.toLowerCase().includes(needle);
      const inSummary = entry.summary.toLowerCase().includes(needle);
      return { entry, score: inTitle ? 2 : inSummary ? 1 : 0 };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || b.entry.date.localeCompare(a.entry.date));
}

const year = (date: string) => date.slice(0, 4);

export function NotFoundFinder({ entries, sections }: { entries: FinderEntry[]; sections: Section[] }) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (event.key !== "/" || (target instanceof Element && target.closest("input, textarea, select, [contenteditable]"))) return;
      event.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const needle = query.trim().toLowerCase();
  const closest = rankByPath(entries, pathname);
  // A strong match goes in the lede as the one-click fix, so the list skips it.
  const best = closest[0]?.score >= 0.6 ? closest[0].entry : undefined;
  const section = SECTION_KIND[pathname.split("/")[1]?.toLowerCase() ?? ""] ?? "Post";
  const recent = entries
    .filter((entry) => entry.kind === section && entry !== best)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  let heading = best ? "Also nearby" : "Nearest neighbors";
  let rows = closest.map((item) => item.entry).filter((entry) => entry !== best);
  if (needle) {
    const found = searchEntries(entries, needle);
    rows = found.slice(0, 8).map((item) => item.entry);
    heading = `${found.length} ${found.length === 1 ? "match" : "matches"} for “${query.trim()}”${found.length > 8 ? ", top 8" : ""}`;
  } else if (rows.length === 0) {
    heading = section === "Post" ? "Recent writing" : `Recent ${section.toLowerCase()}s`;
    rows = recent;
  }

  return (
    <main className={styles.page}>
      <header className={styles.intro}>
        <div className={styles.introText}>
          <p className={styles.code}>404 · node not found</p>
          <h1 className="page-title">This page floated off</h1>
          <p className={styles.lede}>
            Nothing is linked at <code className={styles.path}>{pathname}</code>.
            {best ? (
              <>
                {" "}The nearest node is{" "}
                <Link className={styles.bestLink} href={best.href}>
                  {best.title}
                </Link>
                .
              </>
            ) : (
              " It may have moved, or the link has a typo. The rest of the graph is still here."
            )}
          </p>
        </div>
        <NotFoundArt path={pathname} />
      </header>

      <div className={styles.body}>
        <section className={styles.finder} aria-label="Find a page">
          <label className={styles.search}>
            <span className={styles.srOnly}>Search posts, projects, and games</span>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="8.5" cy="8.5" r="5.5" />
              <path d="m13 13 4 4" />
            </svg>
            <input
              ref={searchRef}
              type="search"
              placeholder="Search posts, projects, and games"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setQuery("");
                if (event.key === "Enter" && rows[0]) router.push(rows[0].href);
              }}
            />
            <kbd aria-hidden="true">/</kbd>
          </label>

          <h2 className={styles.heading} aria-live="polite">{heading}</h2>
          {rows.length === 0 ? (
            <p className={styles.empty}>No nodes match. Try a shorter word, or browse a section.</p>
          ) : (
            <ol className={styles.rows}>
              {rows.map((entry) => (
                <li key={entry.href}>
                  <Link className={styles.row} href={entry.href}>
                    <span className={styles.title}>{highlight(entry.title, needle)}</span>
                    {entry.summary && <span className={styles.summary}>{highlight(entry.summary, needle)}</span>}
                    <span className={styles.meta}>
                      {entry.kind}
                      {entry.date && ` · ${year(entry.date)}`}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </section>

        <nav className={styles.sections} aria-label="Site sections">
          <h2 className={styles.heading}>Browse</h2>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            {sections.map((section) => (
              <li key={section.href}>
                <Link href={section.href}>
                  {section.label}
                  {section.count !== undefined && <span>{section.count}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
