import { indexMetadata } from "../og-image";
import { getProjectIndexTier, getProjects, getProjectYears, sortProjectsForIndex } from "app/blog/utils";
import { ProjectsIndex, type ProjectItem } from "./projects-index";
import { getProjectStatus } from "./status";

export const metadata = indexMetadata(
  "Projects",
  "Selected software, data visualization, developer tooling, and engineering projects by Byron Wall.",
  "/projects",
);

type Project = ReturnType<typeof getProjects>[number];

function text(value: string | string[] | undefined) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function getLinks(project: Project) {
  const links: Array<[string, string | undefined]> = [
    ["Website", text(project.metadata.site)],
    ["Live demo", text(project.metadata.demo)],
    ["Source", text(project.metadata.repo)],
    ["Docs", text(project.metadata.docs)],
    ["Package", text(project.metadata.package)],
  ];
  return links.filter((link): link is [string, string] => Boolean(link[1])).slice(0, 2);
}

function toItem(project: Project): ProjectItem {
  const featured = getProjectIndexTier(project.metadata) === "featured";
  const status = getProjectStatus(project.metadata.status);
  const year = (value: unknown) => (typeof value === "string" ? value.match(/\d{4}/)?.[0] : undefined);
  const started = year(project.metadata.started) ?? year(project.metadata.date) ?? "0000";
  return {
    slug: project.slug,
    title: project.metadata.title?.trim() || project.slug,
    description: text(project.metadata.description) ?? text(project.metadata.summary),
    logo: text(project.metadata.logo),
    image: project.thumbnail && project.metadata.indexImage !== "placeholder" ? project.thumbnail : undefined,
    featured,
    archived: Boolean(text(project.metadata.ended)) || status?.toLowerCase() === "archived",
    facts: [featured ? "Featured" : undefined, status, getProjectYears(project.metadata)].filter((fact): fact is string => Boolean(fact)),
    tags: Array.isArray(project.metadata.tags) ? project.metadata.tags.filter(Boolean) : [],
    links: getLinks(project),
    sortDate: `${started} ${project.metadata.date ?? ""}`,
  };
}

export default function ProjectsPage() {
  const projects = sortProjectsForIndex(getProjects()).map(toItem);
  return (
    <main>
      <ProjectsIndex projects={projects} />
    </main>
  );
}
