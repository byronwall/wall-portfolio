"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  countFacets,
  FacetChips,
  highlight,
  ListHeader,
  listStyles as ui,
  SearchBox,
  Select,
  useUrlFilters,
} from "../components/list-page";
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

// How many projects get a chip; the rest go in the "More" select.
const TOP_PROJECTS = 4;
const FILTER_KEYS = ["q", "category", "project"] as const;

export function BlogIndex({ posts, picks }: { posts: BlogIndexPost[]; picks: StartHerePick[] }) {
  const [{ q: query, category, project }, update] = useUrlFilters(FILTER_KEYS);

  const needle = query.trim().toLowerCase();
  const matchesQuery = (post: BlogIndexPost) =>
    !needle || `${post.title} ${post.summary} ${post.projectTitle ?? ""}`.toLowerCase().includes(needle);
  const matchesCategory = (post: BlogIndexPost) => !category || post.category === category;
  const matchesProject = (post: BlogIndexPost) => !project || post.projectSlug === project;
  const visible = posts.filter((post) => matchesQuery(post) && matchesCategory(post) && matchesProject(post));

  // Option order is fixed from the full list so nothing jumps around;
  // counts reflect the other active filters so a zero means "no results".
  const categoryOrder = useMemo(() => countFacets(posts, (post) => [{ value: post.category, label: post.category }]), [posts]);
  const projectOrder = useMemo(
    () =>
      countFacets(posts, (post) =>
        post.projectSlug && post.projectTitle
          ? [{ value: post.projectSlug, label: post.projectTitle, logo: post.projectLogo }]
          : [],
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

  const groups: Array<{ month: string; posts: BlogIndexPost[] }> = [];
  for (const post of visible) {
    const last = groups[groups.length - 1];
    if (last?.month === post.monthLabel) last.posts.push(post);
    else groups.push({ month: post.monthLabel, posts: [post] });
  }

  const isFiltered = Boolean(needle || category || project);

  return (
    <div className={ui.page}>
      <ListHeader title="Blog" lede="Notes from building software: experiments, debugging, and product decisions." />

      <div className={ui.controls}>
        <FacetChips
          label="Filter by project"
          facets={projects}
          value={project}
          onChange={(value) => update({ project: value })}
          top={TOP_PROJECTS}
          moreLabel="More projects"
          icons
        />
        <div className={ui.tools}>
          <Select
            label="Post type"
            value={category}
            onChange={(value) => update({ category: value })}
            width={124}
            options={[
              { value: "", label: "All types" },
              ...categories.map((facet) => ({ value: facet.value, label: `${facet.label} (${facet.count})` })),
            ]}
          />
          <SearchBox label="Search posts" value={query} onChange={(value) => update({ q: value })} />
        </div>
      </div>

      {!isFiltered && picks.length > 0 && (
        <section className={ui.section} id="start-here" aria-labelledby="start-here-heading">
          <h2 className={ui.sectionLabel} id="start-here-heading">Start here</h2>
          <ol className={ui.picks}>
            {picks.map((pick) => (
              <li key={pick.slug}>
                <Link className={ui.pick} href={`/blog/${pick.slug}`}>
                  <span className={ui.pickImage}>
                    {pick.thumbnail && <img src={pick.thumbnail} alt="" />}
                  </span>
                  <span className={ui.pickCopy}>
                    <span className={ui.pickTitle}>{pick.title}</span>
                    <span className={ui.pickWhy}>{pick.why}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className={styles.results}>
        <p className={ui.resultLine} aria-live="polite">
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
          <p className={ui.empty}>No posts match. Try a shorter search or clear the filters.</p>
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
