import { baseUrl } from "app/sitemap";
import Link from "next/link";
import {
  formatDate,
  getBlogPosts,
  getPostCategory,
  getProjects,
  getReadingTime,
} from "./utils";
import styles from "./blog.module.css";

export const metadata = {
  title: "Blog",
  description:
    "Technical notes from Byron Wall on software development, data analysis, SolidJS, TypeScript, AI tooling, and engineering workflows.",
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
};

export default function BlogPage() {
  const posts = getBlogPosts().sort((a, b) => {
    const dates = (b.metadata.publishedAt ?? "").localeCompare(a.metadata.publishedAt ?? "");
    return dates || a.slug.localeCompare(b.slug);
  });
  const projects = new Map(
    getProjects().map((project) => [project.slug, project.metadata.title]),
  );

  return (
    <main className={styles.blogIndex}>
      <header className={styles.indexHeader}>
        <h1>Blog</h1>
        <p className={styles.indexIntro}>Notes from building software: experiments, debugging trails, product decisions, and the tools that make the work easier to understand.</p>
      </header>
      <div className={styles.postList}>
        {posts.map((post) => {
          const projectTitle = typeof post.metadata.project === "string"
            ? projects.get(post.metadata.project)
            : undefined;
          return (
            <Link className={styles.postRow} href={`/blog/${post.slug}`} key={post.slug}>
              <div className={styles.postVisual}>
                {post.thumbnail ? (
                  <img className={styles.postImage} src={post.thumbnail} alt="" loading="lazy" />
                ) : (
                  <div className={styles.fallbackVisual}>
                    <span className={styles.fallbackMark}>BW / {post.metadata.title.slice(0, 2).toUpperCase()}</span>
                  </div>
                )}
              </div>
              <div className={styles.postCopy}>
                <div className={styles.postMeta}>
                  <span>{formatDate(post.metadata.publishedAt)}</span>
                  <span>{getReadingTime(post.content)}</span>
                  <span>{getPostCategory(post.metadata)}</span>
                  {projectTitle && <span>{projectTitle}</span>}
                </div>
                <h2 className={styles.postTitle}>{post.metadata.title} <span aria-hidden="true">↗</span></h2>
                <p className={styles.postSummary}>{post.metadata.summary}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
