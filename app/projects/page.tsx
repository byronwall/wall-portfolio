import { indexMetadata } from "../og-image";
import { getProjectIndexTier, getProjects, getProjectYears, sortProjectsForIndex } from "app/blog/utils";
import Link from "next/link";
import { getProjectStatus } from "./status";
import styles from "./index.module.css";

export const metadata = indexMetadata(
  "Projects",
  "Selected software, data visualization, developer tooling, and engineering projects by Byron Wall.",
  "/projects",
);

type Project = ReturnType<typeof getProjects>[number];

function text(value: string | string[] | undefined) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function getLinks(project: Project) {
  const links: Array<[string, string | undefined]> = [
    ["Live demo", text(project.metadata.demo)],
    ["Source", text(project.metadata.repo)],
    ["Docs", text(project.metadata.docs)],
    ["Package", text(project.metadata.package)],
  ];
  return links.filter((link): link is [string, string] => Boolean(link[1])).slice(0, 2);
}

function ProjectRow({ project, lead, eager }: { project: Project; lead?: boolean; eager?: boolean }) {
  const href = `/projects/${project.slug}`;
  const title = project.metadata.title?.trim() || project.slug;
  const description = text(project.metadata.description) ?? text(project.metadata.summary);
  const logo = text(project.metadata.logo);
  const hasImage = Boolean(project.thumbnail) && project.metadata.indexImage !== "placeholder";
  const featured = getProjectIndexTier(project.metadata) === "featured";
  const facts = [featured ? "Featured" : undefined, getProjectStatus(project.metadata.status), getProjectYears(project.metadata)].filter(Boolean);
  const tags = Array.isArray(project.metadata.tags) ? project.metadata.tags.filter(Boolean).slice(0, 5) : [];
  const links = getLinks(project);

  return (
    <article className={lead ? styles.lead : styles.row}>
      <Link className={styles.thumb} href={href} aria-hidden="true" tabIndex={-1}>
        {hasImage ? (
          <img src={project.thumbnail} alt="" loading={eager ? "eager" : "lazy"} />
        ) : logo ? (
          <img className={styles.thumbLogo} src={logo} alt="" loading="lazy" />
        ) : (
          <span className={styles.thumbInitial}>{title.charAt(0)}</span>
        )}
      </Link>
      <div className={styles.copy}>
        {facts.length > 0 && (
          <p className={styles.facts}>
            {facts.map((fact, i) => (
              <span key={fact} className={i === 0 && featured ? styles.featured : undefined}>{fact}</span>
            ))}
          </p>
        )}
        <h2 className={styles.title}>
          <Link href={href}>
            {logo && <img className={styles.titleLogo} src={logo} alt="" />}
            {title}
          </Link>
        </h2>
        {description && <p className={styles.summary}>{description}</p>}
        {(tags.length > 0 || links.length > 0) && (
          <p className={styles.meta}>
            {tags.length > 0 && <span>{tags.join(" · ")}</span>}
            {links.map(([label, url]) => (
              <a key={label} href={url} target="_blank" rel="noreferrer">
                {label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </p>
        )}
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  const projects = sortProjectsForIndex(getProjects());
  const main = projects.filter((p) => getProjectIndexTier(p.metadata) !== "archive");
  const archive = projects.filter((p) => getProjectIndexTier(p.metadata) === "archive");
  const [lead, ...rest] = main;

  return (
    <main className={styles.page}>
      <header className="page-intro">
        <h1 className="page-title">Projects</h1>
        <p className="page-lede">
          Products, experiments, and developer tools built to make complex work
          easier to understand. Start with the work that best represents how I
          think, then browse the smaller experiments and utilities behind it.
        </p>
      </header>

      <div className={styles.body}>
        {lead && <ProjectRow project={lead} lead eager />}
        <ul className={styles.rows}>
          {rest.map((project, i) => (
            <li key={project.slug}>
              <ProjectRow project={project} eager={i < 3} />
            </li>
          ))}
        </ul>

        {archive.length > 0 && (
          <section className={styles.archive} aria-labelledby="project-archive-heading">
            <h2 id="project-archive-heading" className={styles.groupLabel}>
              Archive <span>{archive.length}</span>
            </h2>
            <ul className={styles.rows}>
              {archive.map((project) => (
                <li key={project.slug}>
                  <ProjectRow project={project} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
