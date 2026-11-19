import path from "node:path";
import sharp from "sharp";
import Image from "next/image";
import Link from "next/link";
import {
  formatShortDate,
  getBlogPosts,
  getProjects,
  sortPostsNewestFirst,
  sortProjectsForIndex,
} from "./blog/utils";
import { experiences } from "./experience/data";

// Read a local thumbnail's size so the card reserves its exact aspect ratio before the image loads.
async function imageSize(src?: string) {
  if (!src?.startsWith("/")) return undefined;
  try {
    const { width, height } = await sharp(path.join(process.cwd(), "public", src)).metadata();
    return width && height ? { width, height } : undefined;
  } catch {
    return undefined;
  }
}

// "April 2025 – Present" -> "2025 – Present"; "June 2010 – July 2014" -> "2010 – 2014".
const yearSpan = (dates: string) =>
  dates.split("–").map((part) => part.match(/\d{4}/)?.[0] ?? part.trim()).join(" – ");

function PreviewCard({ href, title, text, thumbnail, size }: {
  href: string;
  title: string;
  text?: string;
  thumbnail?: string;
  size?: { width: number; height: number };
}) {
  return (
    <Link className={`content-preview-card${thumbnail ? "" : " content-preview-card-text"}`} href={href}>
      {thumbnail && (
        <img src={thumbnail} alt="" className="content-preview-image" loading="lazy" width={size?.width} height={size?.height} />
      )}
      <div className="content-preview-copy">
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
    </Link>
  );
}

export default async function Home() {
  const projects = getProjects();
  const projectTitles = new Map(
    projects.map((project) => [project.slug, project.metadata.title]),
  );
  const featuredProjects = sortProjectsForIndex(
    projects.filter((project) => project.metadata.featured === "true"),
  ).slice(0, 2);
  const projectOrder = (slug?: string | string[]) =>
    Number(projects.find((project) => project.slug === slug)?.metadata.indexOrder ?? Infinity);
  const posts = sortPostsNewestFirst(getBlogPosts());
  const featuredPosts = posts
    .filter((post) => post.metadata.featured === "true")
    .slice(0, 2)
    .sort((a, b) => projectOrder(a.metadata.project) - projectOrder(b.metadata.project));
  const featuredSlugs = new Set(featuredPosts.map((post) => post.slug));
  const latestPosts = posts.filter((post) => !featuredSlugs.has(post.slug)).slice(0, 6);
  const projectSizes = await Promise.all(featuredProjects.map((project) => imageSize(project.thumbnail)));
  const postSizes = await Promise.all(featuredPosts.map((post) => imageSize(post.thumbnail)));

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-intro">
          <h1>Byron Wall</h1>
          <p className="home-lede">I build interfaces for data and AI.</p>
          <p>
            I’m a <strong>Full Stack Engineer</strong> at{" "}
            <a
              className="home-company-link"
              href="https://relational.ai"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                aria-hidden="true"
                className="home-company-mark"
                focusable="false"
                viewBox="0 0 36 28"
              >
                <path d="M11.266 2.045 17.936 8.718 24.609 2.045" />
                <path d="m24.609 26.045-6.673-6.67-6.67 6.67" />
                <path d="M8.547 7.366 1.874 14.05l6.673 6.659" />
                <path d="m27.321 20.709 6.674-6.659-6.641-6.652" />
              </svg>
              RelationalAI
            </a>
            , working on the Rel app, where people build semantic models and
            work with Rel, its decision agent in Snowflake. Before that, I created a time series data
            analysis platform used by engineers at Allison Transmission.
          </p>
          <p className="home-years">
            Sixteen years in engineering, nine building software, nearly four
            in full-time software roles. TypeScript, SolidJS, React, Python.
          </p>

          <div className="home-actions">
            <Link className="button button-primary" href="/projects">
              Selected work
            </Link>
            <a
              className="button button-secondary"
              href="/resume_byron_wall.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Résumé <span aria-hidden="true">↗</span>
            </a>
            <a className="button button-secondary" href="mailto:byron@byroni.us">
              Email
            </a>
          </div>
        </div>

        <div className="home-portrait-wrap">
          <Image
            src="/byron-wall-headshot.webp"
            alt="Byron Wall"
            width={400}
            height={400}
            className="home-portrait"
            priority
          />
        </div>
      </section>

      <section className="home-section" aria-labelledby="featured-projects-heading">
        <Link className="section-heading-link" href="/projects">
          <span className="section-label" id="featured-projects-heading">Projects</span>
          <span className="section-count">{projects.length}</span>
          <span aria-hidden="true">→</span>
        </Link>
        <div className="content-preview-grid">
          {featuredProjects.map((project, i) => (
            <PreviewCard
              key={project.slug}
              href={`/projects/${project.slug}`}
              title={project.metadata.title}
              text={project.metadata.description ?? project.metadata.summary}
              thumbnail={project.thumbnail}
              size={projectSizes[i]}
            />
          ))}
        </div>
      </section>

      <section className="home-section" aria-labelledby="featured-posts-heading">
        <Link className="section-heading-link" href="/blog">
          <span className="section-label" id="featured-posts-heading">Writing</span>
          <span className="section-count">{posts.length}</span>
          <span aria-hidden="true">→</span>
        </Link>
        <div className="content-preview-grid">
          {featuredPosts.map((post, i) => (
            <PreviewCard
              key={post.slug}
              href={`/blog/${post.slug}`}
              title={post.metadata.title}
              text={post.metadata.summary}
              thumbnail={post.thumbnail}
              size={postSizes[i]}
            />
          ))}
        </div>
        <ul className="latest-list" aria-label="Latest posts">
          {latestPosts.map((post) => {
            const project =
              typeof post.metadata.project === "string"
                ? projectTitles.get(post.metadata.project)
                : undefined;
            return (
              <li key={post.slug}>
                <Link className="latest-link" href={`/blog/${post.slug}`}>
                  <time className="latest-date" dateTime={post.metadata.publishedAt}>
                    {formatShortDate(post.metadata.publishedAt)}
                  </time>
                  <span className="latest-title">
                    {post.metadata.title}
                    {project && <span className="latest-project"> · {project}</span>}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="home-start-here">
          New here? <Link href="/blog#start-here">Start with three posts →</Link>
        </p>
      </section>

      <section className="home-section" aria-labelledby="featured-experience-heading">
        <Link className="section-heading-link" href="/experience">
          <span className="section-label" id="featured-experience-heading">Experience</span>
          <span aria-hidden="true">→</span>
        </Link>
        <ul className="experience-ledger">
          {experiences.map((experience) => (
            <li key={experience.slug}>
              <Link className="experience-ledger-link" href={`/experience/${experience.slug}`}>
                <span className="experience-ledger-dates">{yearSpan(experience.dates)}</span>
                <span className="experience-ledger-company">{experience.company}</span>
                <span className="experience-ledger-role">{experience.role}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
