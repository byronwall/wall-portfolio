"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import styles from "./blog-index.module.css";

export type BlogIndexPost = {
  slug: string;
  title: string;
  summary: string;
  dateLabel: string;
  monthLabel: string;
  readingTime: string;
  category: string;
  projectSlug?: string;
  projectTitle?: string;
  projectLogo?: string;
  thumbnail?: string;
};

export type StartHerePick = BlogIndexPost & { why: string };

type Facet = { value: string; label: string; count: number; logo?: string };

// How many projects get a chip; the rest go in the "More" select.
const TOP_PROJECTS = 6;

function countBy(posts: BlogIndexPost[], key: (post: BlogIndexPost) => Omit<Facet, "count"> | undefined): Facet[] {
  const counts = new Map<string, Facet>();
  for (const post of posts) {
    const entry = key(post);
    if (!entry) continue;
    const facet = counts.get(entry.value) ?? { ...entry, count: 0 };
    facet.count += 1;
    counts.set(entry.value, facet);
  }
  // Posts arrive newest first, so ties keep the most recently active project first.
  return Array.from(counts.values()).sort((a, b) => b.count - a.count);
}

export function highlight(text: string, query: string): ReactNode {
  if (!query) return text;
  const lower = text.toLowerCase();
  const parts: ReactNode[] = [];
  let index = 0;
  let match = lower.indexOf(query, index);
  while (match !== -1) {
    if (match > index) parts.push(text.slice(index, match));
    parts.push(<mark key={match}>{text.slice(match, match + query.length)}</mark>);
    index = match + query.length;
    match = lower.indexOf(query, index);
  }
  parts.push(text.slice(index));
  return parts;
}

function writeUrl(q: string, category: string, project: string) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category) params.set("category", category);
  if (project) params.set("project", project);
  const search = params.toString();
  window.history.replaceState(null, "", `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`);
}

function ProjectIcon({ title, logo }: { title: string; logo?: string }) {
  if (logo) return <img className={`${styles.icon} project-logo-plate`} src={logo} alt="" />;
  return (
    <span className={styles.monogram} aria-hidden="true">
      {title.charAt(0).toUpperCase()}
    </span>
  );
}

export function BlogIndex({ posts, picks }: { posts: BlogIndexPost[]; picks: StartHerePick[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [project, setProject] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  // Filters live in the URL so a refresh or shared link keeps them.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") ?? "");
    setCategory(params.get("category") ?? "");
    setProject(params.get("project") ?? "");
  }, []);

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

  const update = (next: { q?: string; category?: string; project?: string }) => {
    const q = next.q ?? query;
    const c = next.category ?? category;
    const p = next.project ?? project;
    setQuery(q);
    setCategory(c);
    setProject(p);
    writeUrl(q.trim(), c, p);
  };

  const needle = query.trim().toLowerCase();
  const matchesQuery = (post: BlogIndexPost) =>
    !needle || `${post.title} ${post.summary} ${post.projectTitle ?? ""}`.toLowerCase().includes(needle);
  const matchesCategory = (post: BlogIndexPost) => !category || post.category === category;
  const matchesProject = (post: BlogIndexPost) => !project || post.projectSlug === project;
  const visible = posts.filter((post) => matchesQuery(post) && matchesCategory(post) && matchesProject(post));

  // Option order is fixed from the full list so nothing jumps around;
  // counts reflect the other active filters so a zero means "no results".
  const categoryOrder = useMemo(() => countBy(posts, (post) => ({ value: post.category, label: post.category })), [posts]);
  const projectOrder = useMemo(
    () =>
      countBy(posts, (post) =>
        post.projectSlug && post.projectTitle
          ? { value: post.projectSlug, label: post.projectTitle, logo: post.projectLogo }
          : undefined,
      ),
    [posts],
  );
  const categoryPool = posts.filter((post) => matchesQuery(post) && matchesProject(post));
  const projectPool = posts.filter((post) => matchesQuery(post) && matchesCategory(post));
  const categories = categoryOrder.map((facet) => ({
    ...facet,
    count: categoryPool.filter((post) => post.category === facet.value).length,
  }));
  const projects = projectOrder.map((facet) => ({
    ...facet,
    count: projectPool.filter((post) => post.projectSlug === facet.value).length,
  }));
  const topProjects = projects.slice(0, TOP_PROJECTS);
  const moreProjects = projects.slice(TOP_PROJECTS);
  const moreSelected = moreProjects.some((facet) => facet.value === project);

  const groups: Array<{ month: string; posts: BlogIndexPost[] }> = [];
  for (const post of visible) {
    const last = groups[groups.length - 1];
    if (last?.month === post.monthLabel) last.posts.push(post);
    else groups.push({ month: post.monthLabel, posts: [post] });
  }

  const isFiltered = Boolean(needle || category || project);

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <h1 className={styles.heading}>Blog</h1>
        <p className={styles.lede}>Notes from building software: experiments, debugging, and product decisions.</p>
        <div className={styles.tools}>
          <label className={styles.typeSelect}>
            <span className={styles.srOnly}>Post type</span>
            <select value={category} onChange={(event) => update({ category: event.target.value })}>
              <option value="">All types</option>
              {categories.map((facet) => (
                <option key={facet.value} value={facet.value}>
                  {facet.label} ({facet.count})
                </option>
              ))}
            </select>
          </label>
          <label className={styles.search}>
            <span className={styles.srOnly}>Search posts</span>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="8.5" cy="8.5" r="5.5" />
              <path d="m13 13 4 4" />
            </svg>
            <input
              ref={searchRef}
              type="search"
              placeholder="Search posts"
              value={query}
              onChange={(event) => update({ q: event.target.value })}
              onKeyDown={(event) => {
                if (event.key === "Escape") update({ q: "" });
              }}
            />
            <kbd aria-hidden="true">/</kbd>
          </label>
        </div>
      </header>

      <div className={styles.toolbar}>
        <nav className={styles.projects} aria-label="Filter by project">
          <button type="button" className={styles.chip} aria-pressed={!project} onClick={() => update({ project: "" })}>
            All
          </button>
          {topProjects.map((facet) => (
            <button
              key={facet.value}
              type="button"
              className={styles.chip}
              data-empty={facet.count === 0 || undefined}
              aria-pressed={project === facet.value}
              onClick={() => update({ project: project === facet.value ? "" : facet.value })}
            >
              <ProjectIcon title={facet.label} logo={facet.logo} />
              {facet.label}
              <span className={styles.count}>{facet.count}</span>
            </button>
          ))}
          {moreProjects.length > 0 && (
            <label className={styles.more} data-selected={moreSelected || undefined}>
              <span className={styles.srOnly}>More projects</span>
              <select value={moreSelected ? project : ""} onChange={(event) => update({ project: event.target.value })}>
                <option value="">More projects…</option>
                {moreProjects.map((facet) => (
                  <option key={facet.value} value={facet.value}>
                    {facet.label} ({facet.count})
                  </option>
                ))}
              </select>
            </label>
          )}
        </nav>

      </div>

      {!isFiltered && picks.length > 0 && (
        <section className={styles.startHere} id="start-here" aria-labelledby="start-here-heading">
          <h2 className={styles.sectionLabel} id="start-here-heading">Start here</h2>
          <ol className={styles.picks}>
            {picks.map((pick) => (
              <li key={pick.slug}>
                <Link className={styles.pick} href={`/blog/${pick.slug}`}>
                  <span className={styles.pickImage}>
                    {pick.thumbnail && <img src={pick.thumbnail} alt="" />}
                  </span>
                  <span className={styles.pickCopy}>
                    <span className={styles.pickTitle}>{pick.title}</span>
                    <span className={styles.pickWhy}>{pick.why}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className={styles.results}>
        <p className={styles.resultLine} aria-live="polite">
          {isFiltered ? (
            <>
              {visible.length} of {posts.length} posts
              <button type="button" onClick={() => update({ q: "", category: "", project: "" })}>
                Clear filters
              </button>
            </>
          ) : (
            <>All {posts.length} posts, newest first</>
          )}
        </p>

        {groups.length === 0 && (
          <p className={styles.empty}>No posts match. Try a shorter search or clear the filters.</p>
        )}

        {groups.map((group) => (
          <section className={styles.month} key={group.month} aria-label={group.month}>
            <h2 className={styles.monthLabel}>
              {group.month} <span>{group.posts.length}</span>
            </h2>
            <ol className={styles.rows}>
              {group.posts.map((post) => (
                <li key={post.slug}>
                  <Link className={styles.row} href={`/blog/${post.slug}`}>
                    <span className={styles.thumb}>
                      {post.thumbnail && <img src={post.thumbnail} alt="" loading="lazy" />}
                    </span>
                    <span className={styles.copy}>
                      <span className={styles.title}>{highlight(post.title, needle)}</span>
                      <span className={styles.summary}>{highlight(post.summary, needle)}</span>
                      <span className={styles.meta}>
                        <span>{post.dateLabel}</span>
                        <span>{post.category}</span>
                        {post.projectTitle && (
                          <span className={styles.metaProject}>
                            {post.projectLogo && <img className="project-logo-plate" src={post.projectLogo} alt="" />}
                            {post.projectTitle}
                          </span>
                        )}
                        <span>{post.readingTime}</span>
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
