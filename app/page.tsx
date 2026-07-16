import Image from "next/image";
import Link from "next/link";
import { SocialIcons } from "./components/social-icons";
import { getBlogPosts, getProjects } from "./blog/utils";
import { experiences } from "./experience/data";

export default function Home() {
  const featuredProjects = getProjects()
    .filter((project) => project.metadata.featured === "true")
    .sort((a, b) => (a.slug < b.slug ? -1 : 1))
    .slice(0, 2);
  const featuredPosts = getBlogPosts()
    .filter((post) => post.metadata.featured === "true")
    .sort((a, b) => {
      const aDate = a.metadata.publishedAt ?? "";
      const bDate = b.metadata.publishedAt ?? "";
      return aDate === bDate ? (a.slug < b.slug ? -1 : 1) : aDate < bDate ? 1 : -1;
    })
    .slice(0, 2);
  const recentExperience = experiences.slice(0, 2);

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
            <Link className="button button-secondary" href="/blog">
              Read the blog
            </Link>
          </div>

          <div className="home-socials" aria-label="Social links">
            <a href="https://github.com/byronwall" target="_blank" rel="noreferrer" aria-label="GitHub">
              <SocialIcons.GitHub />
            </a>
            <a href="https://www.linkedin.com/in/byronwall/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <SocialIcons.LinkedIn />
            </a>
            <a href="mailto:byron@byroni.us" aria-label="Email Byron">
              <SocialIcons.Email />
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

      <section className="featured-work" aria-labelledby="featured-projects-heading">
        <Link className="section-heading-link" href="/projects">
          <span className="section-label" id="featured-projects-heading">Projects</span>
          <span aria-hidden="true">→</span>
        </Link>
        <div className="content-preview-grid">
          {featuredProjects.map((project) => (
            <Link className="content-preview-card" href={`/projects/${project.slug}`} key={project.slug}>
              {project.thumbnail && <img src={project.thumbnail} alt="" className="content-preview-image" loading="lazy" />}
              <div className="content-preview-copy">
                <h2>{project.metadata.title}</h2>
                <p>{project.metadata.description ?? project.metadata.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-blog" aria-labelledby="featured-posts-heading">
        <Link className="section-heading-link" href="/blog">
          <span className="section-label" id="featured-posts-heading">Blog posts</span>
          <span aria-hidden="true">→</span>
        </Link>
        <div className="content-preview-grid">
          {featuredPosts.map((post) => (
            <Link className="content-preview-card" href={`/blog/${post.slug}`} key={post.slug}>
              {post.thumbnail && (
                <Image
                  src={post.thumbnail}
                  alt=""
                  width={400}
                  height={400}
                  className="content-preview-image"
                />
              )}
              <div className="content-preview-copy">
                <h2>{post.metadata.title}</h2>
                <p>{post.metadata.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-experience" aria-labelledby="featured-experience-heading">
        <Link className="section-heading-link" href="/experience">
          <span className="section-label" id="featured-experience-heading">Experience</span>
          <span aria-hidden="true">→</span>
        </Link>
        <div className="content-preview-grid">
          {recentExperience.map((experience) => (
            <Link
              className="content-preview-card experience-preview-card"
              href={`/experience/${experience.slug}`}
              key={experience.slug}
            >
              <div className="experience-preview-logo">
                <img src={experience.logoUrl} alt={`${experience.company} logo`} />
              </div>
              <div className="content-preview-copy experience-preview-copy">
                <h2>{experience.company}</h2>
                <p className="experience-preview-role">{experience.role}</p>
                <p>{experience.summary}</p>
                <p className="experience-preview-dates">{experience.dates}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
