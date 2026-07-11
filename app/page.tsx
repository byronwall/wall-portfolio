import Image from "next/image";
import Link from "next/link";
import { SocialIcons } from "./components/social-icons";
import { getBlogPosts } from "./blog/utils";

const featuredProjects = [
  {
    title: "HN Offline",
    description:
      "An offline-first Hacker News reader that keeps stories and comments available without a connection.",
    href: "/projects/0-hn-offline",
    image: "https://raw.githubusercontent.com/byronwall/hn-offline/master/docs/image.png",
  },
  {
    title: "Alt Image Zoom Modal",
    description:
      "A Chrome extension for inspecting, saving, and organizing page images with a fast pan-and-zoom viewer.",
    href: "/projects/chrome-image-modal",
    image: "/images/projects/chrome-image-modal/modal.png",
  },
];

export default function Home() {
  const featuredPosts = getBlogPosts()
    .filter((post) => post.metadata.featured === "true")
    .sort((a, b) => {
      const aDate = a.metadata.publishedAt ?? "";
      const bDate = b.metadata.publishedAt ?? "";
      return aDate === bDate ? (a.slug < b.slug ? -1 : 1) : aDate < bDate ? 1 : -1;
    })
    .slice(0, 2);

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
            <a href="https://relational.ai" target="_blank" rel="noreferrer">
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
            <Link className="content-preview-card" href={project.href} key={project.title}>
              <img
                src={project.image}
                alt=""
                className="content-preview-image"
                loading="lazy"
              />
              <div className="content-preview-copy">
                <h2>{project.title}</h2>
                <p>{project.description}</p>
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
    </main>
  );
}
