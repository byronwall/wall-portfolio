import fs from "fs";
import path from "path";

export type BaseMetadata = {
  title: string;
  description: string;
  date: string;
  publishedAt: string;
  summary: string;
  image?: string;
  tags?: string[];
  [key: string]: string | string[] | undefined;
};

function normalizeImageSrc(src: string) {
  try {
    const imageUrl = new URL(src);
    const optimizedSrc = imageUrl.searchParams.get("url");

    if (imageUrl.pathname === "/_next/image" && optimizedSrc) {
      return optimizedSrc.startsWith("/")
        ? `${imageUrl.origin}${optimizedSrc}`
        : optimizedSrc;
    }
  } catch {
    // Relative URLs are already valid for local project thumbnails.
  }

  return src;
}

function getFirstContentImage(content: string) {
  const markdownImageMatch = content.match(
    /!\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/
  );
  const htmlImageMatch = content.match(/<img[\s\S]*?\bsrc=["']([^"']+)["']/i);
  const imageSrc = markdownImageMatch?.[1] ?? htmlImageMatch?.[1];

  return imageSrc ? normalizeImageSrc(imageSrc) : undefined;
}

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  let match = frontmatterRegex.exec(fileContent);
  let frontMatterBlock = match![1];
  let content = fileContent.replace(frontmatterRegex, "").trim();
  let frontMatterLines = frontMatterBlock.trim().split("\n");
  let metadata = {} as BaseMetadata;

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(": ");
    let value = valueArr.join(": ").trim();
    value = value.replace(/^['"](.*)['"]$/, "$1"); // Remove quotes

    // Handle arrays (like tags)
    if (value.startsWith("[") && value.endsWith("]")) {
      value = value.slice(1, -1); // Remove brackets
      metadata[key.trim()] = value
        .split(",")
        .map((item) => item.trim().replace(/^['"](.*)['"]$/, "$1"));
    } else {
      metadata[key.trim()] = value;
    }
  });

  return { metadata, content };
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string) {
  let rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

function getMDXData(dir: string) {
  let mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    let { metadata, content } = readMDXFile(path.join(dir, file));
    let slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
      thumbnail: metadata.image ?? getFirstContentImage(content),
    };
  });
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), "app", "blog", "posts"));
}

export function getPostsForProject(slug: string) {
  return getBlogPosts()
    .filter((post) => post.metadata.project === slug)
    .sort((a, b) => {
      const dateOrder = (b.metadata.publishedAt ?? "").localeCompare(
        a.metadata.publishedAt ?? "",
      );
      return dateOrder || (a.slug < b.slug ? -1 : 1);
    });
}

export function getReadingTime(content: string) {
  const words = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}

export function getPostCategory(metadata: BaseMetadata) {
  if (metadata.type && typeof metadata.type === "string") {
    return metadata.type.charAt(0).toUpperCase() + metadata.type.slice(1);
  }
  if (metadata.category && typeof metadata.category === "string") return metadata.category;
  const text = `${metadata.title} ${metadata.summary} ${(metadata.tags ?? []).join(" ")}`.toLowerCase();
  if (/debug|fix|troubleshoot|suspense/.test(text)) return "Engineering note";
  if (/image|canvas|interface|ui|design/.test(text)) return "Interface work";
  if (/llm|codex|prompt|openai|chatgpt/.test(text)) return "AI tooling";
  if (/ship|package|deploy|extension|cli/.test(text)) return "Tooling";
  return "Project update";
}

export function getTableOfContents(content: string) {
  return Array.from(content.matchAll(/^##\s+(.+)$/gm)).map((match) => ({
    title: match[1].replace(/[`*_]/g, ""),
    id: match[1]
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/&/g, "-and-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-"),
  }));
}

export function getProjects() {
  const projectsDirectory = path.join(process.cwd(), "content/projects");

  return getMDXData(projectsDirectory);
}

export function formatDate(date: string | undefined, includeRelative = false) {
  if (!date) {
    return "N/A";
  }
  let currentDate = new Date();
  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }
  let targetDate = new Date(date);

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  let daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = "";

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`;
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`;
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`;
  } else {
    formattedDate = "Today";
  }

  let fullDate = targetDate.toLocaleString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${formattedDate})`;
}
