import Image from "next/image";
import Link from "next/link";

interface ProjectCard {
  title: string;
  description: string;
  link: string;
  faviconUrl: string;
  tags?: string[];
  className?: string;
}

const projects: ProjectCard[] = [
  {
    title: "HN Offline",
    description:
      "An offline-first Hacker News reader using service workers. Browse and read HN comments even when you're disconnected.",
    link: "/projects/hn-offline",
    faviconUrl: "/images/hn-offline-favicon.png",
    tags: ["Remix", "SolidJS", "TypeScript", "Service Workers"],
    className: "border-orange-500 hover:border-orange-600",
  },
  {
    title: "Plan•Task•Tic",
    description:
      "A powerful task management platform designed to help you organize and track your projects efficiently.",
    link: "https://plantasktic.dev",
    faviconUrl: "/images/plantasktic-favicon.png",
    tags: ["Next.js", "React", "TypeScript", "Tailwind"],
    className: "border-black hover:border-gray-400 dark:hover:border-gray-600",
  },
];

export function ProjectCards() {
  return (
    <div className="my-8">
      <h2 className="text-3xl font-bold mb-6">Featured Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          (() => {
            const isExternal = project.link.startsWith("http");
            return (
          <Link
            key={project.title}
            href={project.link}
            className="group block hover:no-underline"
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
          >
            <div
              className={`border rounded-lg p-6 h-full transition-all duration-200 hover:shadow-lg  ${project.className}`}
            >
              {/* add a favicon next to the title */}
              <div className="flex items-center">
                <Image
                  src={project.faviconUrl}
                  alt="Favicon"
                  width={24}
                  height={24}
                  className="mr-2"
                />
                <h3 className="text-xl font-semibold  group-hover:text-blue-500 transition-colors">
                  {project.title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {project.tags?.map((tag) => (
                  <span className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
            );
          })()
        ))}
      </div>
    </div>
  );
}
