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
import styles from "./index.module.css";

export type ProjectItem = {
  slug: string;
  title: string;
  description?: string;
  logo?: string;
  image?: string;
  featured: boolean;
  archived: boolean;
  facts: string[];
  tags: string[];
  links: Array<[string, string]>;
  /** Start year, then publish date, for the "Newest" sort. */
  sortDate: string;
};

// Languages and frameworks get chips; every other tag goes in the "More" select.
const CHIP_TAGS = ["TypeScript", "Python", "React", "SolidJS"];
const TAG_LOGOS: Record<string, string> = {
  TypeScript: "/images/tech/typescript.svg",
  Python: "/images/tech/python.svg",
  React: "/images/tech/react.svg",
  SolidJS: "/images/tech/solidjs.svg",
};
const FILTER_KEYS = ["q", "tag", "status", "sort"] as const;

function ProjectRow({ project, needle, eager }: { project: ProjectItem; needle: string; eager?: boolean }) {
  const href = `/projects/${project.slug}`;
  return (
    <article className={styles.row}>
      <Link className={styles.thumb} href={href} aria-hidden="true" tabIndex={-1}>
        {project.image ? (
          <img src={project.image} alt="" loading={eager ? "eager" : "lazy"} />
        ) : project.logo ? (
          <img className={styles.thumbLogo} src={project.logo} alt="" loading="lazy" />
        ) : (
          <span className={styles.thumbInitial}>{project.title.charAt(0)}</span>
        )}
      </Link>
      <div className={styles.copy}>
        <Facts project={project} />
        <h2 className={styles.title}>
          <Link href={href}>
            {project.logo && <img className={styles.titleLogo} src={project.logo} alt="" />}
            {highlight(project.title, needle)}
          </Link>
        </h2>
        {project.description && <p className={styles.summary}>{highlight(project.description, needle)}</p>}
        <Meta project={project} />
      </div>
    </article>
  );
}

function Facts({ project, hideFeatured }: { project: ProjectItem; hideFeatured?: boolean }) {
  const facts = hideFeatured ? project.facts.filter((fact) => fact !== "Featured") : project.facts;
  if (facts.length === 0) return null;
  return (
    <p className={styles.facts}>
      {facts.map((fact) => (
        <span key={fact} className={fact === "Featured" ? styles.featured : undefined}>{fact}</span>
      ))}
    </p>
  );
}

function Meta({ project }: { project: ProjectItem }) {
  if (project.tags.length === 0 && project.links.length === 0) return null;
  return (
    <p className={styles.meta}>
      {project.tags.length > 0 && <span>{project.tags.slice(0, 5).join(" · ")}</span>}
      {project.links.map(([label, url]) => (
        <a key={label} href={url} target="_blank" rel="noreferrer">
          {label} <span aria-hidden="true">↗</span>
        </a>
      ))}
    </p>
  );
}

/** A featured project: label and title above its image. */
function FeaturedPick({ project }: { project: ProjectItem }) {
  const href = `/projects/${project.slug}`;
  return (
    <article className={styles.featuredPick}>
      <div className={styles.copy}>
        <Facts project={project} hideFeatured />
        <h2 className={styles.featuredTitle}>
          <Link href={href}>
            {project.logo && <img className={styles.titleLogo} src={project.logo} alt="" />}
            {project.title}
          </Link>
        </h2>
        {project.description && <p className={styles.summary}>{project.description}</p>}
      </div>
      <Link className={styles.featuredImage} href={href} aria-hidden="true" tabIndex={-1}>
        {project.image && <img src={project.image} alt="" />}
      </Link>
      <Meta project={project} />
    </article>
  );
}

export function ProjectsIndex({ projects }: { projects: ProjectItem[] }) {
  const [{ q: query, tag, status, sort }, update] = useUrlFilters(FILTER_KEYS);

  const needle = query.trim().toLowerCase();
  const matchesQuery = (p: ProjectItem) =>
    !needle || `${p.title} ${p.description ?? ""} ${p.tags.join(" ")}`.toLowerCase().includes(needle);
  const matchesTag = (p: ProjectItem) => !tag || p.tags.includes(tag);
  const matchesStatus = (p: ProjectItem) => !status || (status === "archived") === p.archived;

  const tagOrder = useMemo(() => {
    const facets = countFacets(projects, (p) => p.tags.map((t) => ({ value: t, label: t, logo: TAG_LOGOS[t] })));
    const pinned = CHIP_TAGS.flatMap((name) => facets.filter((facet) => facet.value === name));
    return [...pinned, ...facets.filter((facet) => !CHIP_TAGS.includes(facet.value))];
  }, [projects]);
  const tagPool = projects.filter((p) => matchesQuery(p) && matchesStatus(p));
  const tags = tagOrder.map((facet) => ({ ...facet, count: tagPool.filter((p) => p.tags.includes(facet.value)).length }));
  const statusPool = projects.filter((p) => matchesQuery(p) && matchesTag(p));
  const activeCount = statusPool.filter((p) => !p.archived).length;
  const archivedCount = statusPool.length - activeCount;

  const visible = projects.filter((p) => matchesQuery(p) && matchesTag(p) && matchesStatus(p));
  if (sort === "newest") visible.sort((a, b) => b.sortDate.localeCompare(a.sortDate));
  if (sort === "name") visible.sort((a, b) => a.title.localeCompare(b.title));

  const isFiltered = Boolean(needle || tag || status);
  const showFeatured = !isFiltered && !sort;
  const featured = showFeatured ? visible.filter((p) => p.featured) : [];
  const rows = showFeatured ? visible.filter((p) => !p.featured) : visible;
  const sortLabel = sort === "newest" ? "newest first" : sort === "name" ? "by name" : "featured and current work first";

  return (
    <div className={ui.page}>
      <ListHeader
        title="Projects"
        lede="Products, experiments, and developer tools built to make complex work easier to understand."
      />

      <div className={ui.controls}>
        <FacetChips
          label="Filter by technology"
          facets={tags}
          value={tag}
          onChange={(value) => update({ tag: value })}
          top={CHIP_TAGS.length}
          moreLabel="More tags"
          icons
        />
        <div className={ui.tools}>
          <Select
            label="Status"
            value={status}
            onChange={(value) => update({ status: value })}
            width={112}
            options={[
              { value: "", label: "Any status" },
              { value: "active", label: `Active (${activeCount})` },
              { value: "archived", label: `Archived (${archivedCount})` },
            ]}
          />
          <Select
            label="Sort"
            value={sort}
            onChange={(value) => update({ sort: value })}
            width={100}
            options={[
              { value: "", label: "Featured" },
              { value: "newest", label: "Newest" },
              { value: "name", label: "Name" },
            ]}
          />
          <SearchBox label="Search projects" value={query} onChange={(value) => update({ q: value })} />
        </div>
      </div>

      {featured.length > 0 && (
        <section className={ui.section} aria-labelledby="featured-heading">
          <h2 className={ui.sectionLabel} id="featured-heading">Featured</h2>
          <div className={styles.featuredGrid}>
            {featured.map((project) => (
              <FeaturedPick key={project.slug} project={project} />
            ))}
          </div>
        </section>
      )}

      <p className={ui.resultLine} aria-live="polite">
        {isFiltered ? (
          <>
            {visible.length} of {projects.length} projects
            <button type="button" onClick={() => update({ q: "", tag: "", status: "" })}>
              Clear filters
            </button>
          </>
        ) : (
          <>All {projects.length} projects, {sortLabel}</>
        )}
      </p>

      {visible.length === 0 && <p className={ui.empty}>No projects match. Try a shorter search or clear the filters.</p>}

      <ul className={styles.rows}>
        {rows.map((project, i) => (
          <li key={project.slug}>
            <ProjectRow project={project} needle={needle} eager={i < 3} />
          </li>
        ))}
      </ul>
    </div>
  );
}
