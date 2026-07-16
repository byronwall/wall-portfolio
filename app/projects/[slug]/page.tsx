import { formatDate, getPostCategory, getPostsForProject, getProjects } from "app/blog/utils";
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
  const relatedPosts = getPostsForProject(project.slug);
  const projectLinks = [
    ["Live demo", project.metadata.demo],
    ["Source", project.metadata.repo],
    ["Package", project.metadata.package],
    ["Documentation", project.metadata.docs],
  ].filter((entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].length > 0);

  return (
    <main className={styles.detailPage}>
      <Link href="/projects" className={styles.backLink}>← Projects</Link>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <h1>{project.metadata.title}</h1>
          <p>{project.metadata.description ?? project.metadata.summary}</p>
          <div className={styles.heroDetails}>
            <div className={styles.status}>
              <span>{project.metadata.status ?? "Content coming soon"}</span>
              {project.metadata.publishedAt && <span>{project.metadata.publishedAt.slice(0, 4)}</span>}
            </div>
            {project.metadata.tags?.length ? (
              <ul className={styles.tags} aria-label="Technologies">
                {project.metadata.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
            ) : null}
          </div>
          {projectLinks.length > 0 && (
            <nav className={styles.projectLinks} aria-label="Project links">
              {projectLinks.map(([label, href]) => (
                <a href={href} key={label} target="_blank" rel="noreferrer">{label} ↗</a>
              ))}
            </nav>
          )}
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

      <section className={styles.relatedPosts} aria-labelledby="related-posts-heading">
        <div className={styles.relatedHeading}>
          <h2 id="related-posts-heading">Related posts</h2>
          <p>Updates, decisions, experiments, and lessons connected to this project.</p>
        </div>
        {relatedPosts.length > 0 ? (
          <div className="content-preview-grid">
            {relatedPosts.map((post) => (
              <Link className="content-preview-card" href={`/blog/${post.slug}`} key={post.slug}>
                {post.thumbnail ? (
                  <img src={post.thumbnail} alt="" className="content-preview-image" loading="lazy" />
                ) : (
                  <div className={styles.relatedPlaceholder} aria-hidden="true">
                    BW / {post.metadata.title.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="content-preview-copy">
                  <p className={styles.relatedMeta}>{formatDate(post.metadata.publishedAt)} · {getPostCategory(post.metadata)}</p>
                  <h2>{post.metadata.title}</h2>
                  <p>{post.metadata.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.emptyRelated}>Content coming soon.</div>
        )}
      </section>

      <footer className={styles.nextProject}>
        <Link href="/projects">All projects →</Link>
      </footer>
    </main>
  );
}
