import { indexMetadata } from "../og-image";
import { BlogIndex, type BlogIndexPost, type StartHerePick } from "./blog-index";
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
    slug: "draftably-diagram-files-an-agent-and-i-both-edit",
    why: "The product idea: one plain-text diagram file that an agent writes and I drag.",
  },
  {
    slug: "showing-the-lines-behind-srclys-metrics",
    why: "A small product change exposed a scoring bug, and the fix tells zero apart from not measured.",
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

  const bySlug = new Map(posts.map((post) => [post.slug, post]));
  const picks: StartHerePick[] = startHere.flatMap((pick) => {
    const post = bySlug.get(pick.slug);
    return post ? [{ ...post, why: pick.why }] : [];
  });

  return (
    <main>
      <BlogIndex posts={posts} picks={picks} />
    </main>
  );
}
