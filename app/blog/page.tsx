import { baseUrl } from "app/sitemap";
import { BlogIndex, type BlogIndexPost } from "./blog-index";
import {
  formatShortDate,
  getBlogPosts,
  getPostCategory,
  getProjects,
  getReadingTime,
  sortPostsNewestFirst,
} from "./utils";

export const metadata = {
  title: "Blog",
  description:
    "Technical notes from Byron Wall on software development, data analysis, SolidJS, TypeScript, AI tooling, and engineering workflows.",
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
};

function getMonthLabel(date: string | undefined) {
  if (!date) return "Undated";
  return new Date(`${date.slice(0, 10)}T00:00:00`).toLocaleString("en-us", {
    month: "long",
    year: "numeric",
  });
}

export default function BlogPage() {
  const projects = new Map(
    getProjects().map((project) => [project.slug, project.metadata]),
  );

  const posts: BlogIndexPost[] = sortPostsNewestFirst(getBlogPosts()).map((post) => {
    const projectSlug = typeof post.metadata.project === "string" ? post.metadata.project : undefined;
    const project = projectSlug ? projects.get(projectSlug) : undefined;
    return {
      slug: post.slug,
      title: post.metadata.title,
      summary: post.metadata.summary ?? "",
      dateLabel: formatShortDate(post.metadata.publishedAt, true),
      monthLabel: getMonthLabel(post.metadata.publishedAt),
      readingTime: getReadingTime(post.content),
      category: getPostCategory(post.metadata),
      projectSlug: project ? projectSlug : undefined,
      projectTitle: project?.title,
      projectLogo: typeof project?.logo === "string" ? project.logo : undefined,
      thumbnail: post.thumbnail,
    };
  });

  return (
    <main>
      <header className="page-intro">
        <h1 className="page-title">Blog</h1>
        <p className="page-lede">
          Notes from building software: experiments, debugging trails, product
          decisions, and the tools that make the work easier to understand.
        </p>
      </header>
      <BlogIndex posts={posts} />
    </main>
  );
}
