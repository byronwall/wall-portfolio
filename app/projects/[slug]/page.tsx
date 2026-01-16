import { getProjects } from "app/blog/utils";
import { CustomMDX } from "app/components/mdx";
import { baseUrl } from "app/sitemap";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const projects = getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export function generateMetadata({ params }) {
  let post = getProjects().find((post) => post.slug === params.slug);
  if (!post) {
    return;
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  let ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${baseUrl}/projects/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProjects().find((project) => project.slug === params.slug);

  if (!project) {
    return notFound();
  }

  return (
    <article className="max-w-5xl mx-auto">
      <Link
        href="/projects"
        className="hover:underline mb-4 block"
      >
        ← Back to Projects
      </Link>
      <h1 className="text-4xl font-bold mb-4">{project.metadata.title}</h1>
      <div className="flex gap-2 mb-8">
        {project.metadata.tags?.map((tag) => (
          <span
            key={tag}
            className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="prose dark:prose-invert max-w-none">
        <CustomMDX source={project.content} />
      </div>
    </article>
  );
}
