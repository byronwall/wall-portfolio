import type { MetadataRoute } from "next";
import { getBlogPosts, getGames, getProjects } from "app/blog/utils";

export const baseUrl = "https://byroni.us";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = getBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  const projects = getProjects().map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project.metadata.publishedAt,
  }));

  const experienceRoutes = [
    "/experience",
    "/experience/relationalai",
    "/experience/allison-software",
    "/experience/allison-engineering",
    "/experience/tda-research",
  ];

  const routes = ["", "/blog", "/projects", "/games", "/tools", "/about", ...experienceRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  const games = getGames().map((game) => ({
    url: `${baseUrl}/games/${game.slug}`,
    lastModified: game.metadata.publishedAt,
  }));

  return [...routes, ...blogs, ...projects, ...games];
}
