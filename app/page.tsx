import Image from "next/image";
import Link from "next/link";
import {
  formatShortDate,
  getBlogPosts,
  getProjects,
  sortPostsNewestFirst,
} from "./blog/utils";
import { experiences } from "./experience/data";

export default function Home() {
  const projects = getProjects();
  const projectTitles = new Map(
    projects.map((project) => [project.slug, project.metadata.title]),
  );
  const featuredProjects = projects
    .filter((project) => project.metadata.featured === "true")
    .sort((a, b) => (a.slug < b.slug ? -1 : 1))
    .slice(0, 2);
  const posts = sortPostsNewestFirst(getBlogPosts());
  const featuredPosts = posts
    .filter((post) => post.metadata.featured === "true")
    .slice(0, 2);
  const featuredSlugs = new Set(featuredPosts.map((post) => post.slug));
  const latestPosts = posts.filter((post) => !featuredSlugs.has(post.slug)).slice(0, 6);

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-intro">
          <h1>Byron Wall</h1>
          <p className="home-lede">
            Software engineer with more than 14 years of experience building
            real-world web applications and data products.
          </p>
          <p>
            I build full-stack applications, data tools, and developer tooling.
            I’m currently a <strong>Full Stack Engineer</strong> at{" "}
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
            , working on an agentic and LLM-driven data modeling application for
            Snowflake.
          </p>
          <p>
            I prefer TypeScript, SolidJS, and SolidStart, and care about clean
            code, thoughtful interfaces, and measurable impact.
          </p>

          <div className="home-actions">
            <Link className="button button-primary" href="/projects">
              View projects
            </Link>
            <a
              className="button button-secondary"
              href="/resume_byron_wall.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Résumé <span aria-hidden="true">↗</span>
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

      <section className="home-section home-section-quiet" aria-labelledby="featured-projects-heading">
        <Link className="section-heading-link" href="/projects">
          <span className="section-label" id="featured-projects-heading">Projects</span>
          <span className="section-count">{projects.length}</span>
          <span aria-hidden="true">→</span>
        </Link>
        <div className="content-preview-grid">
          {featuredProjects.map((project) => (
            <Link className={`content-preview-card${project.thumbnail ? "" : " content-preview-card-text"}`} href={`/projects/${project.slug}`} key={project.slug}>
              {project.thumbnail && (
                <img src={project.thumbnail} alt="" className="content-preview-image" loading="lazy" />
              )}
              <div className="content-preview-copy">
                <h2>{project.metadata.title}</h2>
                <p>{project.metadata.description ?? project.metadata.summary}</p>
              </div>
            </Link>
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
          {featuredPosts.map((post) => (
            <Link className={`content-preview-card${post.thumbnail ? "" : " content-preview-card-text"}`} href={`/blog/${post.slug}`} key={post.slug}>
              {post.thumbnail && (
                <img src={post.thumbnail} alt="" className="content-preview-image" loading="lazy" />
              )}
              <div className="content-preview-copy">
                <h2>{post.metadata.title}</h2>
                <p>{post.metadata.summary}</p>
              </div>
            </Link>
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
      </section>

      <section className="home-section home-section-quiet" aria-labelledby="featured-experience-heading">
        <Link className="section-heading-link" href="/experience">
          <span className="section-label" id="featured-experience-heading">Experience</span>
          <span aria-hidden="true">→</span>
        </Link>
        <ul className="experience-ledger">
          {experiences.map((experience) => (
            <li key={experience.slug}>
              <Link className="experience-ledger-link" href={`/experience/${experience.slug}`}>
                <div className="logo-plate">
                  <img src={experience.logoUrl} alt={`${experience.company} logo`} />
                </div>
                <div className="experience-ledger-copy">
                  <h3>{experience.company}</h3>
                  <p>{experience.role}</p>
                  <p className="experience-ledger-dates">{experience.dates}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
