import { getProjects } from "app/blog/utils";
import { baseUrl } from "app/sitemap";
import Link from "next/link";
import styles from "./projects.module.css";

export const metadata = {
  title: "Projects",
  description:
    "Selected software, data visualization, developer tooling, and engineering projects by Byron Wall.",
  alternates: { canonical: `${baseUrl}/projects` },
};

function projectStatus(date?: string) {
  if (!date) return "Project archive";
  const year = Number(date.slice(0, 4));
  return year >= 2026 ? "Active" : year >= 2024 ? "Recent" : "Archive";
}

export default function ProjectsPage() {
  const projects = getProjects().sort((a, b) => {
    const dateOrder = (b.metadata.publishedAt ?? "").localeCompare(
      a.metadata.publishedAt ?? "",
    );
    return dateOrder || a.metadata.title.localeCompare(b.metadata.title);
  });

  return (
    <main className={styles.page}>
      <header className={styles.intro}>
        <h1>Projects</h1>
        <p>
          Products, experiments, and developer tools built to make complex work
          easier to understand. Each project is a record of the interface,
          technical decisions, and lessons behind it.
        </p>
      </header>

      <div className={styles.ledger}>
        {projects.map((project, index) => (
          <article className={styles.row} key={project.slug}>
            <Link
              className={styles.media}
              href={`/projects/${project.slug}`}
              aria-label={`View ${project.metadata.title}`}
            >
              {project.thumbnail ? (
                <img src={project.thumbnail} alt="" loading={index < 3 ? "eager" : "lazy"} />
              ) : (
                <span className={styles.placeholder} aria-hidden="true">
                  {project.metadata.title.slice(0, 2).toUpperCase()}
                </span>
              )}
            </Link>
            <div className={styles.copy}>
              <div className={styles.meta}>
                <span>{projectStatus(project.metadata.publishedAt)}</span>
                {project.metadata.publishedAt && (
                  <time dateTime={project.metadata.publishedAt}>
                    {project.metadata.publishedAt.slice(0, 4)}
                  </time>
                )}
              </div>
              <h2>
                <Link href={`/projects/${project.slug}`}>
                  {project.metadata.title} <span aria-hidden="true">↗</span>
                </Link>
              </h2>
              <p>{project.metadata.description ?? project.metadata.summary}</p>
              {project.metadata.tags?.length ? (
                <ul className={styles.tags} aria-label="Technologies">
                  {project.metadata.tags.slice(0, 4).map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
