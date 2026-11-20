import { formatDate, getPostCategory, getPostsForProject, getProjects, getProjectYears } from "app/blog/utils";
import { CustomMDX } from "app/components/mdx";
import { baseUrl } from "app/sitemap";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../projects.module.css";
import { getOgImageUrl } from "app/og-image";
import { getProjectStatus } from "../status";
import { experiences } from "app/experience/data";
import { ViewerScope, type ViewerImage } from "app/components/image-viewer";
import { ProjectGallery } from "./project-gallery";

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

// The thumbnail plus every image in the project's content, in order, once each.
function getGalleryImages(thumbnail: string | undefined, title: string, content: string) {
  const images: ViewerImage[] = [];
  const add = (src: string | undefined, alt: string) => {
    if (src && !images.some((image) => image.src === src)) images.push({ src, alt: alt.trim() || title });
  };
  const pattern = /!\[([^\]]*)]\(([^)\s]+)(?:\s+"[^"]*")?\)|<img\b[^>]*>/g;
  const found = Array.from(content.matchAll(pattern)).map((match) => {
    if (match[2]) return { src: match[2], alt: match[1] };
    const tag = match[0];
    return { src: tag.match(/\bsrc=["']([^"']+)["']/)?.[1], alt: tag.match(/\balt=["']([^"']*)["']/)?.[1] ?? "" };
  });
  const thumbAlt = found.find((image) => image.src === thumbnail)?.alt ?? `${title} interface`;
  add(thumbnail, thumbAlt);
  found.forEach((image) => add(image.src, image.alt));
  return images;
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
  const status = getProjectStatus(project.metadata.status);
  const year = getProjectYears(project.metadata);
  const projectLinks = [
    ["Website", project.metadata.site],
    ["Live demo", project.metadata.demo],
    ["Source", project.metadata.repo],
    ["Package", project.metadata.package],
    ["Documentation", project.metadata.docs],
  ].filter((entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].length > 0);
  const images = getGalleryImages(project.thumbnail, project.metadata.title, project.content);
  const employer = experiences.find((entry) => entry.slug === project.metadata.employer);

  return (
    <main className={styles.detailPage}>
      <Link href="/projects" className={styles.backLink}>← Projects</Link>
      <ViewerScope images={images}>
      <header className={`${styles.hero}${images.length ? "" : ` ${styles.heroTextOnly}`}`}>
        <div className={styles.heroCopy}>
          <h1 className={styles.heroTitle}>{typeof project.metadata.logo === "string" && <img className="project-logo-plate" src={project.metadata.logo} alt="" />}{project.metadata.title}</h1>
          <p>{project.metadata.description ?? project.metadata.summary}</p>
          {(status || year || project.metadata.tags?.length) && (
            <p className={styles.heroFacts}>
              {[status, year].filter(Boolean).join(" · ")}
              {project.metadata.tags?.length ? (
                <span className={styles.heroTags}>{project.metadata.tags.join(", ")}</span>
              ) : null}
            </p>
          )}
          {employer && (
            <Link className={styles.employer} href={`/experience/${employer.slug}`}>
              {employer.logoUrl && <img className={styles.employerLogo} src={employer.logoUrl} alt="" />}
              <span>
                Built at {employer.company}
                <small>{employer.role}</small>
              </span>
            </Link>
          )}
          {projectLinks.length > 0 && (
            <nav className={styles.projectLinks} aria-label="Project links">
              {projectLinks.map(([label, href]) => (
                <a href={href} key={label} target="_blank" rel="noreferrer">{label} ↗</a>
              ))}
            </nav>
          )}
        </div>
        {images.length > 0 && <ProjectGallery images={images} />}
      </header>

      <div className={styles.story}>
        <aside className={styles.storyNav}>
          {headings.length > 1 && (
            <nav aria-label="On this page">
              {headings.map((heading) => <a href={`#${heading.id}`} key={heading.id}>{heading.label}</a>)}
            </nav>
          )}
        </aside>
        <article className={`prose ${styles.prose}`}>
          <CustomMDX source={project.content} />
        </article>
      </div>
      </ViewerScope>

      {relatedPosts.length > 0 && (
        <section className={styles.relatedPosts} aria-labelledby="related-posts-heading">
          <div className={styles.relatedHeading}>
            <h2 id="related-posts-heading">Related posts</h2>
          </div>
          <div className="content-preview-grid">
            {relatedPosts.map((post) => (
              <Link className={`content-preview-card${post.thumbnail ? "" : " content-preview-card-text"}`} href={`/blog/${post.slug}`} key={post.slug}>
                {post.thumbnail && <img src={post.thumbnail} alt="" className="content-preview-image" loading="lazy" />}
                <div className="content-preview-copy">
                  <p className={styles.relatedMeta}>{formatDate(post.metadata.publishedAt)} · {getPostCategory(post.metadata)}</p>
                  <h2>{post.metadata.title}</h2>
                  <p>{post.metadata.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <footer className={styles.nextProject}>
        <Link href="/projects">All projects →</Link>
      </footer>
    </main>
  );
}
