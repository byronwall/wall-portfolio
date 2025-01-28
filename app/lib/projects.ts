import { readFileSync, readdirSync } from "fs";
import matter from "gray-matter";
import { join } from "path";
import { compileMDX } from "next-mdx-remote/rsc";

const projectsDirectory = join(process.cwd(), "content/projects");

export type Project = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  content: string;
};

export function getProjects(): Project[] {
  const files = readdirSync(projectsDirectory);
  const projects = files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const source = readFileSync(join(projectsDirectory, file), "utf-8");
      const { data, content } = matter(source);
      return {
        slug: file.replace(/\.mdx$/, ""),
        title: data.title,
        description: data.description,
        date: data.date,
        tags: data.tags || [],
        content,
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  return projects;
}

export async function getProject(slug: string) {
  const source = readFileSync(join(projectsDirectory, `${slug}.mdx`), "utf-8");
  const { data, content } = matter(source);

  const { content: compiledContent } = await compileMDX({
    source: content,
    options: { parseFrontmatter: true },
  });

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    tags: data.tags || [],
    content: compiledContent,
  };
}
