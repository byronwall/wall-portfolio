import Image from "next/image";
import Link from "next/link";

interface ProjectCard {
  title: string;
  description: string;
  link: string;
  imageUrl: string;
  faviconUrl: string;
}

const projects: ProjectCard[] = [
  {
    title: "HN Offline",
    description:
      "An offline-first Hacker News reader using service workers. Browse and read HN comments even when you're disconnected.",
    link: "https://hnoffline.dev",
    imageUrl: "/images/hn-offline-logo.png", // Add this image when available
    faviconUrl: "/images/hn-offline-favicon.ico",
  },
  {
    title: "Plan•Task•Tic",
    description:
      "A powerful task management platform designed to help you organize and track your projects efficiently.",
    link: "https://plantasktic.dev",
    imageUrl: "/images/plantasktic-logo.png", // Add this image when available
    faviconUrl: "/images/plantasktic-favicon.ico",
  },
];

export function ProjectCards() {
  return (
    <div className="my-8">
      <h2 className="text-3xl font-bold mb-6">Featured Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Link
            key={project.title}
            href={project.link}
            className="group block hover:no-underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="border rounded-lg p-6 h-full transition-all duration-200 hover:shadow-lg hover:border-gray-400 dark:hover:border-gray-600">
              <div className="aspect-video relative mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                {project.imageUrl ? (
                  <Image
                    src={project.imageUrl}
                    alt={`${project.title} logo`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-lg">Logo coming soon</span>
                  </div>
                )}
              </div>
              {/* add a favicon next to the title */}
              <div className="flex items-center">
                <Image
                  src={project.faviconUrl}
                  alt="Favicon"
                  width={16}
                  height={16}
                  className="mr-2"
                />
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-500 transition-colors">
                  {project.title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {project.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
