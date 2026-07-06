import { getProjects } from "app/blog/utils";
import { baseUrl } from "app/sitemap";
import Link from "next/link";

export const metadata = {
  title: "Projects",
  description:
    "Selected software, data visualization, developer tooling, and engineering projects by Byron Wall.",
  alternates: {
    canonical: `${baseUrl}/projects`,
  },
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Projects</h1>
      <div className="grid gap-8">
        {projects.map((project) => (
          <article
            key={project.slug}
            className="grid gap-4 sm:grid-cols-[180px_1fr] sm:items-start"
          >
            <Link
              href={`/projects/${project.slug}`}
              className="block overflow-hidden rounded border border-neutral-200 bg-neutral-50 no-underline dark:border-neutral-800 dark:bg-neutral-900"
              aria-label={`${project.metadata.title} project`}
            >
              {project.thumbnail ? (
                <div
                  className="aspect-video bg-cover bg-center transition-transform duration-200 hover:scale-105"
                  style={{ backgroundImage: `url(${project.thumbnail})` }}
                />
              ) : (
                <div className="aspect-video bg-neutral-100 dark:bg-neutral-900" />
              )}
            </Link>
            <div>
              <h2 className="text-2xl font-bold mb-2">
                <Link
                  href={`/projects/${project.slug}`}
                  className="hover:underline"
                >
                  {project.metadata.title}
                </Link>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {project.metadata.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.metadata.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
