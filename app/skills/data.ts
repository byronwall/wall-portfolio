import fs from "fs";
import path from "path";
import { getProjects, getSkills } from "app/blog/utils";
import manifest from "../../content/skills-manifest.json";

export const SKILLS_REPO = "https://github.com/byronwall/.agents/tree/main/skills";

/** The three stages of the loop, in order, with one line each. */
export const STAGES = [
  { name: "Plan", line: "Work out what to build and how, before any code." },
  { name: "Build", line: "Make the change, in parallel where it can be, and make it good." },
  { name: "Learn", line: "Look back at the work, and fix the setup that caused the friction." },
] as const;

export type SkillLink = { slug: string; title: string };

export type SkillItem = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  /** Skills this one calls or reads, and skills it hands its output to. */
  uses: SkillLink[];
  feeds: SkillLink[];
  /** Skills that call this one or hand it their output. */
  usedBy: SkillLink[];
  fedBy: SkillLink[];
  updated: string;
  lines: number;
  folders: string[];
  fileCount: number;
  image?: string;
  pick?: number;
  why?: string;
  projectSlug?: string;
  projectTitle?: string;
  projectLogo?: string;
};

type Skill = ReturnType<typeof getSkills>[number];

function list(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

/** Text files copied into public/skills/<folder> by scripts/sync-skills.mjs, SKILL.md first. */
export function getSkillFiles(folder: string) {
  const root = path.join(process.cwd(), "public/skills", folder);
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else files.push(path.relative(root, full));
    }
  };
  walk(root);
  const rank = (file: string) => (file === "SKILL.md" ? 0 : file.includes("/") ? 2 : 1);
  return files
    .sort((a, b) => rank(a) - rank(b) || (a < b ? -1 : 1))
    .map((file) => ({
      path: `/skills/${folder}/${file}`,
      name: file,
      language: languageFor(file),
    }));
}

function languageFor(file: string) {
  const ext = path.extname(file).slice(1);
  const map: Record<string, string> = { md: "markdown", py: "python", mjs: "javascript", js: "javascript", yaml: "yaml", yml: "yaml", json: "json", dot: "dot", css: "css" };
  return map[ext] ?? "shell";
}

function link(slug: string): SkillLink {
  const skill = getSkills().find((entry) => entry.slug === slug);
  if (!skill) throw new Error(`Unknown skill ${slug}`);
  return { slug, title: skill.metadata.title };
}

const links = (skill: Skill, key: "uses" | "feeds") => list(skill.metadata[key]).map(link);
const back = (slug: string, key: "uses" | "feeds") =>
  getSkills()
    .filter((other) => list(other.metadata[key]).includes(slug))
    .map((other) => link(other.slug));

export function toSkillItem(skill: Skill): SkillItem {
  const meta = skill.metadata;
  const folders = list(meta.skills);
  const stats = folders.map((folder) => (manifest as Record<string, { last: string; lines: number }>)[folder]);
  const project = getProjects().find((entry) => entry.slug === meta.project);
  return {
    slug: skill.slug,
    title: meta.title,
    summary: meta.summary,
    category: String(meta.category),
    uses: links(skill, "uses"),
    feeds: links(skill, "feeds"),
    usedBy: back(skill.slug, "uses"),
    fedBy: back(skill.slug, "feeds"),
    updated: stats.map((stat) => stat.last).sort().at(-1) ?? "",
    lines: stats.reduce((sum, stat) => sum + stat.lines, 0),
    folders,
    fileCount: folders.reduce((sum, folder) => sum + getSkillFiles(folder).length, 0),
    image: typeof meta.image === "string" ? meta.image : undefined,
    pick: meta.pick ? Number(meta.pick) : undefined,
    why: typeof meta.why === "string" ? meta.why : undefined,
    projectSlug: project?.slug,
    projectTitle: project?.metadata.title,
    projectLogo: typeof project?.metadata.logo === "string" ? project.metadata.logo : undefined,
  };
}

export function getSkillItems() {
  return getSkills()
    .sort((a, b) => Number(a.metadata.order) - Number(b.metadata.order))
    .map(toSkillItem);
}

/** Skills that ship inside one of my projects, rather than in ~/.agents. */
export const PROJECT_SKILLS: Array<{ project: string; skill: string; summary: string }> = [
  {
    project: "draftably",
    skill: "draftably skill install",
    summary: "Teaches agents the Draftably file format. CI fails any syntax change that doesn't update the skill.",
  },
  {
    project: "srcly",
    skill: "srcly-code-quality",
    summary: "Reads Srcly's headless reports to find code-quality hotspots and rank safe refactors.",
  },
  {
    project: "product-grid-management",
    skill: "product-grid-context",
    summary: "Pulls project, node, and graph context from a running Product Grid server through the pgm CLI.",
  },
  {
    project: "tsx-data-flow",
    skill: "render-path-dataflow-work",
    summary: "Turns the analyzer's output into one bounded fix: pick the worst grounded problem, fix one slice, re-verify.",
  },
];

export function getProjectSkills() {
  const projects = getProjects();
  return PROJECT_SKILLS.map((entry) => {
    const project = projects.find((item) => item.slug === entry.project);
    if (!project) throw new Error(`Unknown project ${entry.project}`);
    return {
      ...entry,
      title: project.metadata.title,
      logo: typeof project.metadata.logo === "string" ? project.metadata.logo : undefined,
    };
  });
}

/** "Nov 19, 2026" from "2026-11-19". */
export function formatDay(day: string) {
  return new Date(`${day}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}
