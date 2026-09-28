import { getProjectIndexTier, getProjects, sortProjectsForIndex, type ProjectIndexTier } from "app/blog/utils";
import { baseUrl } from "app/sitemap";
import Link from "next/link";
import { getProjectStatus } from "./status";

export const metadata = {
  title: "Projects",
  description:
    "Selected software, data visualization, developer tooling, and engineering projects by Byron Wall.",
  alternates: { canonical: `${baseUrl}/projects` },
};

type Project = ReturnType<typeof getProjects>[number];

const tierLabels: Record<ProjectIndexTier, string> = {
  featured: "Featured work",
  medium: "More to explore",
  archive: "Project archive",
};

function getProjectTitle(project: Project) {
  return project.metadata.title?.trim() || project.slug;
}

function getProjectDescription(project: Project) {
  return (
    project.metadata.description?.trim() ||
    project.metadata.summary?.trim()
  );
}

function getOptionalMetadataText(value: string | string[] | undefined) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function getProjectYear(project: Project) {
  return project.metadata.publishedAt?.match(/\d{4}/)?.[0];
}

function getProjectLinks(project: Project) {
  const links: Array<[string, string | undefined]> = [
    ["Live demo", getOptionalMetadataText(project.metadata.demo)],
    ["Source", getOptionalMetadataText(project.metadata.repo)],
    ["Docs", getOptionalMetadataText(project.metadata.docs)],
    ["Package", getOptionalMetadataText(project.metadata.package)],
  ];

  return links
    .filter((link): link is [string, string] => Boolean(link[1]))
    .slice(0, 2);
}

function ProjectMedia({ project, eager }: { project: Project; eager: boolean }) {
  return (
    <div className="project-index-media">
      <img
        src={project.thumbnail}
        alt=""
        loading={eager ? "eager" : "lazy"}
      />
    </div>
  );
}

function ProjectMeta({ project }: { project: Project }) {
  const year = getProjectYear(project);
  const status = getProjectStatus(project.metadata.status);

  if (!status && !year) return null;

  return (
    <div className="project-index-meta">
      {status && <span>{status}</span>}
      {year && <time dateTime={project.metadata.publishedAt}>{year}</time>}
    </div>
  );
}

function ProjectTags({ project, limit }: { project: Project; limit: number }) {
  const tags = Array.isArray(project.metadata.tags)
    ? project.metadata.tags.filter(Boolean).slice(0, limit)
    : [];

  if (!tags.length) return null;

  return (
    <ul className="project-index-tags" aria-label="Technologies">
      {tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  );
}

function ProjectCard({
  project,
  tier,
  position,
}: {
  project: Project;
  tier: ProjectIndexTier;
  position: number;
}) {
  const title = getProjectTitle(project);
  const description = getProjectDescription(project);
  const links = tier === "featured" ? getProjectLinks(project) : [];
  const isFeaturedLead = tier === "featured" && position === 0;
  const hasImage = Boolean(project.thumbnail) && project.metadata.indexImage !== "placeholder";

  return (
    <article
      className={`project-index-card project-index-card-${tier}${
        isFeaturedLead ? " project-index-card-lead" : ""
      }${hasImage ? "" : " project-index-card-text"}`}
      data-tier={tier}
    >
      {hasImage && (
        <Link
          className="project-index-media-link"
          href={`/projects/${project.slug}`}
          aria-label={`Open ${title}`}
        >
          <ProjectMedia project={project} eager={tier === "featured" && position < 2} />
        </Link>
      )}
      <div className="project-index-copy">
        <ProjectMeta project={project} />
        <h3>
          <Link href={`/projects/${project.slug}`}>
            {title}
          </Link>
        </h3>
        {description && <p>{description}</p>}
        {tier === "featured" && links.length > 0 && (
          <nav className="project-index-links" aria-label={`${title} links`}>
            {links.map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noreferrer">
                {label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </nav>
        )}
        {tier !== "archive" && <ProjectTags project={project} limit={4} />}
      </div>
    </article>
  );
}

function ProjectGroup({
  tier,
  projects,
}: {
  tier: ProjectIndexTier;
  projects: Project[];
}) {
  if (!projects.length) return null;

  const headingId = `project-index-${tier}-heading`;

  return (
    <section className={`project-index-group project-index-group-${tier}`} aria-labelledby={headingId}>
      <div className="project-index-group-heading">
        <h2 id={headingId}>{tierLabels[tier]}</h2>
      </div>
      <div className={`project-index-grid project-index-grid-${tier}`}>
        {projects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} tier={tier} position={index} />
        ))}
      </div>
    </section>
  );
}

export default function ProjectsPage() {
  const projects = sortProjectsForIndex(getProjects());
  const projectsByTier = projects.reduce<Record<ProjectIndexTier, Project[]>>(
    (groups, project) => {
      groups[getProjectIndexTier(project.metadata)].push(project);
      return groups;
    },
    { featured: [], medium: [], archive: [] },
  );

  return (
    <main className="project-index-page">
      <header className="project-index-intro">
        <h1>Projects</h1>
        <p>
          Products, experiments, and developer tools built to make complex work
          easier to understand. Start with the work that best represents how I
          think, then browse the smaller experiments and utilities behind it.
        </p>
      </header>

      <div className="project-index-groups">
        <ProjectGroup tier="featured" projects={projectsByTier.featured} />
        <ProjectGroup tier="medium" projects={projectsByTier.medium} />
        <ProjectGroup tier="archive" projects={projectsByTier.archive} />
      </div>
    </main>
  );
}
