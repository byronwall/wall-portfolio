import { getBlogPosts, getGames, getProjects, sortPostsNewestFirst } from "app/blog/utils";
import { mainNavLinks } from "app/data/site-links";
import { NotFoundFinder, type FinderEntry } from "./not-found-finder";

export const metadata = { title: "Page not found" };

// Long enough to fill the two-line clamp; cut at a word so the clamp never shows a half word.
const clip = (text = "", max = 240) =>
  text.length > max ? `${text.slice(0, text.lastIndexOf(" ", max)).replace(/[,;:.]$/, "")}…` : text;

export default function NotFound() {
  const posts = sortPostsNewestFirst(getBlogPosts());
  const projects = getProjects();
  const games = getGames();

  const entries: FinderEntry[] = [
    ...posts.map((post) => ({
      href: `/blog/${post.slug}`,
      slug: post.slug,
      title: post.metadata.title,
      summary: clip(post.metadata.summary),
      kind: "Post",
      date: post.metadata.publishedAt?.slice(0, 10) ?? "",
    })),
    ...projects.map((project) => ({
      href: `/projects/${project.slug}`,
      slug: project.slug,
      title: project.metadata.title || project.slug,
      summary: clip(project.metadata.description || project.metadata.summary),
      kind: "Project",
      date: project.metadata.publishedAt?.slice(0, 10) ?? "",
    })),
    ...games.map((game) => ({
      href: `/games/${game.slug}`,
      slug: game.slug,
      title: game.metadata.title || game.slug,
      summary: clip(game.metadata.description || game.metadata.summary),
      kind: "Game",
      date: game.metadata.publishedAt?.slice(0, 10) ?? "",
    })),
  ];

  const counts: Record<string, number> = {
    "/projects": projects.length,
    "/games": games.length,
    "/blog": posts.length,
  };
  const sections = mainNavLinks.map((link) => ({ ...link, count: counts[link.href] }));

  return <NotFoundFinder entries={entries} sections={sections} />;
}
