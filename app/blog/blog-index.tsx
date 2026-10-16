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

type Facet = { value: string; label: string; count: number };

function countBy(posts: BlogIndexPost[], key: (post: BlogIndexPost) => [string, string] | undefined): Facet[] {
  const counts = new Map<string, Facet>();
  for (const post of posts) {
    const entry = key(post);
    if (!entry) continue;
    const [value, label] = entry;
    const facet = counts.get(value) ?? { value, label, count: 0 };
    facet.count += 1;
    counts.set(value, facet);
  }
  return Array.from(counts.values()).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function highlight(text: string, query: string): ReactNode {
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
  window.history.replaceState(null, "", `${window.location.pathname}${search ? `?${search}` : ""}`);
}

export function BlogIndex({ posts }: { posts: BlogIndexPost[] }) {
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

  // Facet order is fixed from the full list so options never jump around;
  // counts reflect the other active filters so a zero means "no results".
  const categoryOrder = useMemo(() => countBy(posts, (post) => [post.category, post.category]), [posts]);
  const projectOrder = useMemo(
    () => countBy(posts, (post) => (post.projectSlug && post.projectTitle ? [post.projectSlug, post.projectTitle] : undefined)),
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

  const groups: Array<{ month: string; posts: BlogIndexPost[] }> = [];
  for (const post of visible) {
    const last = groups[groups.length - 1];
    if (last?.month === post.monthLabel) last.posts.push(post);
    else groups.push({ month: post.monthLabel, posts: [post] });
  }

  const isFiltered = Boolean(needle || category || project);

  return (
    <div className={styles.layout}>
      <aside className={styles.rail} aria-label="Filter posts">
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

        <FacetList
          title="Type"
          allLabel="All posts"
          total={categoryPool.length}
          facets={categories}
          selected={category}
          onSelect={(value) => update({ category: value })}
        />
        <FacetList
          title="Project"
          allLabel="Any project"
          total={projectPool.length}
          facets={projects}
          selected={project}
          onSelect={(value) => update({ project: value })}
        />
      </aside>

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
            <>{posts.length} posts, newest first</>
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

function FacetList({
  title,
  allLabel,
  total,
  facets,
  selected,
  onSelect,
}: {
  title: string;
  allLabel: string;
  total: number;
  facets: Facet[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className={styles.facet}>
      <h2 className={styles.facetTitle}>{title}</h2>
      <select
        className={styles.facetSelect}
        value={selected}
        onChange={(event) => onSelect(event.target.value)}
        aria-label={title}
      >
        <option value="">{allLabel}</option>
        {facets.map((facet) => (
          <option key={facet.value} value={facet.value}>
            {facet.label} ({facet.count})
          </option>
        ))}
      </select>
      <ul className={styles.facetList}>
        <li>
          <button type="button" aria-pressed={!selected} onClick={() => onSelect("")}>
            <span>{allLabel}</span>
            <span className={styles.count}>{total}</span>
          </button>
        </li>
        {facets.map((facet) => (
          <li key={facet.value}>
            <button
              type="button"
              className={facet.count === 0 ? styles.facetEmpty : undefined}
              aria-pressed={selected === facet.value}
              onClick={() => onSelect(selected === facet.value ? "" : facet.value)}
            >
              <span>{facet.label}</span>
              <span className={styles.count}>{facet.count}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
