import Link from "next/link";
import { indexMetadata } from "../og-image";
import { BlogIndex, type BlogIndexPost } from "./blog-index";
import {
  formatShortDate,
  getBlogPosts,
  getPostCategory,
  getProjects,
  getReadingTime,
  sortPostsNewestFirst,
} from "./utils";

export const metadata = indexMetadata(
  "Blog",
  "Technical notes from Byron Wall on software development, data analysis, SolidJS, TypeScript, AI tooling, and engineering workflows.",
  "/blog",
);

function getMonthLabel(date: string | undefined) {
  if (!date) return "Undated";
  return new Date(`${date.slice(0, 10)}T00:00:00`).toLocaleString("en-us", {
    month: "long",
    year: "numeric",
  });
}

const startHere = [
  {
    slug: "hill-climbing-draftably-layout-speed",
    why: "Benchmarks on fresh graphs, an exact-output gate, and the speedups I threw away.",
  },
  {
    slug: "showing-the-lines-behind-srclys-metrics",
    why: "A small product change exposed a scoring bug, and the fix tells zero apart from not measured.",
  },
  {
    slug: "the-prettiest-layout-lost",
    why: "Why the tool shows the trade-offs instead of picking the numeric winner for you.",
  },
  {
    slug: "testing-serena-against-bare-codex-navigation",
    why: "A blind, repeatable evaluation that came back negative, with its limits stated.",
  },
  {
    slug: "draftably-diagram-files-an-agent-and-i-both-edit",
    why: "The product idea: one plain-text diagram file that an agent writes and I drag.",
  },
];

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

  const titles = new Map(posts.map((post) => [post.slug, post.title]));
  const picks = startHere.filter((pick) => titles.has(pick.slug));

  return (
    <main>
      <header className="page-intro">
        <h1 className="page-title">Blog</h1>
        <p className="page-lede">
          Notes from building software: experiments, debugging trails, product
          decisions, and the tools that make the work easier to understand.
        </p>
      </header>
      <section className="start-here" id="start-here" aria-labelledby="start-here-heading">
        <h2 className="section-label" id="start-here-heading">Start here</h2>
        <ol className="start-here-list">
          {picks.map((pick) => (
            <li key={pick.slug}>
              <Link className="start-here-link" href={`/blog/${pick.slug}`}>
                <span className="start-here-title">{titles.get(pick.slug)}</span>
                <span className="start-here-why">{pick.why}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
      <BlogIndex posts={posts} />
    </main>
  );
}
