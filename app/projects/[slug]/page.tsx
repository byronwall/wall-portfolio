import { getProjects } from "app/blog/utils";
import { CustomMDX } from "app/components/mdx";
import { baseUrl } from "app/sitemap";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../projects.module.css";
import { getOgImageUrl } from "app/og-image";

type ProjectPageProps = { params: Promise<{ slug: string }> };

function absoluteUrl(pathOrUrl: string) {
  return pathOrUrl.startsWith("http")
    ? pathOrUrl
    : `${baseUrl}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getHeadings(content: string) {
  return Array.from(content.matchAll(/^##\s+(.+)$/gm)).map((match) => ({
    label: match[1].replace(/[*_`]/g, ""),
    id: slugifyHeading(match[1].replace(/[*_`]/g, "")),
  }));
}

function projectStatus(date?: string) {
  if (!date) return "Project archive";
  return Number(date.slice(0, 4)) >= 2026 ? "Active project" : "Completed project";
}

export async function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjects().find((entry) => entry.slug === slug);
  if (!project) return;
  const { title, publishedAt, summary } = project.metadata;
  const canonicalUrl = `${baseUrl}/projects/${project.slug}`;
  const ogImage = getOgImageUrl({
    title,
    description: summary,
    image: project.thumbnail ? absoluteUrl(project.thumbnail) : undefined,
    section: "Project",
  });
  return {
    title,
    description: summary,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description: summary,
      type: "article",
      publishedTime: publishedAt,
      url: canonicalUrl,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${title} — Byron Wall` }],
    },
    twitter: { card: "summary_large_image", title, description: summary, images: [ogImage] },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjects().find((entry) => entry.slug === slug);
  if (!project) notFound();
  const headings = getHeadings(project.content);

  return (
    <main className={styles.detailPage}>
      <Link href="/projects" className={styles.backLink}>← Projects</Link>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <h1>{project.metadata.title}</h1>
          <p>{project.metadata.description ?? project.metadata.summary}</p>
          <div className={styles.heroDetails}>
            <div className={styles.status}>
              <span>{projectStatus(project.metadata.publishedAt)}</span>
              {project.metadata.publishedAt && <span>{project.metadata.publishedAt.slice(0, 4)}</span>}
            </div>
            {project.metadata.tags?.length ? (
              <ul className={styles.tags} aria-label="Technologies">
                {project.metadata.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
            ) : null}
          </div>
        </div>
        <div className={styles.heroMedia}>
          {project.thumbnail ? (
            <img src={project.thumbnail} alt={`${project.metadata.title} interface`} />
          ) : (
            <div className={styles.heroPlaceholder} aria-hidden="true">
              <span>{project.metadata.title.slice(0, 2).toUpperCase()}</span>
              <small>Project artifact forthcoming</small>
            </div>
          )}
        </div>
      </header>

      <div className={styles.story}>
        <aside className={styles.storyNav}>
          <span>Project story</span>
          {headings.length > 0 && (
            <nav aria-label="On this page">
              {headings.map((heading) => <a href={`#${heading.id}`} key={heading.id}>{heading.label}</a>)}
            </nav>
          )}
        </aside>
        <article className={`prose ${styles.prose}`}>
          <CustomMDX source={project.content} />
        </article>
      </div>

      <footer className={styles.nextProject}>
        <Link href="/projects">All projects →</Link>
      </footer>
    </main>
  );
}
