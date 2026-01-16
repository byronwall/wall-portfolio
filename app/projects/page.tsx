import { getProjects } from "app/blog/utils";
import Link from "next/link";

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Projects</h1>
      <div className="grid gap-8">
        {projects.map((project) => (
          <article key={project.slug} className="mb-8">
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
            <div className="flex gap-2">
              {project.metadata.tags?.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
