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
    getProjects().map((project) => [project.slug, project.metadata]),
  );

  return (
    <main className={styles.blogIndex}>
      <header className={styles.indexHeader}>
        <h1>Blog</h1>
        <p className={styles.indexIntro}>Notes from building software: experiments, debugging trails, product decisions, and the tools that make the work easier to understand.</p>
      </header>
      <div className={styles.postList}>
        {posts.map((post) => {
          const project = typeof post.metadata.project === "string"
            ? projects.get(post.metadata.project)
            : undefined;
          return (
            <Link className={`${styles.postRow}${post.thumbnail ? "" : ` ${styles.postRowText}`}`} href={`/blog/${post.slug}`} key={post.slug}>
              {post.thumbnail && (
                <div className={styles.postVisual}>
                  <img className={styles.postImage} src={post.thumbnail} alt="" loading="lazy" />
                </div>
              )}
              <div className={styles.postCopy}>
                <div className={styles.postMeta}>
                  <span>{formatDate(post.metadata.publishedAt)}</span>
                  <span>{getReadingTime(post.content)}</span>
                  <span>{getPostCategory(post.metadata)}</span>
                  {project && <span className={styles.projectLabel}>{typeof project.logo === "string" && <img src={project.logo} alt="" />}{project.title}</span>}
                </div>
                <h2 className={styles.postTitle}>{post.metadata.title}</h2>
                <p className={styles.postSummary}>{post.metadata.summary}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
