import Image from "next/image";
import Link from "next/link";
import { mainNavLinks, socialLinks } from "../data/site-links";

export function Navbar() {
  return (
    <aside className="-ml-[8px] mb-8 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="w-full flex-wrap flex flex-row items-start relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          <div className="w-full flex flex-wrap flex-row items-center gap-2 pr-10 justify-between">
            <div className="flex flex-row items-center space-x-0">
              <Link href="/" className="flex items-center mr-4 shrink-0">
                <Image
                  src="/byron-wall-2024.jpeg"
                  alt="Profile picture"
                  width={40}
                  height={40}
                  className="rounded-full"
                  priority
                />
              </Link>
              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 m-1"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center space-x-4 ml-4">
              {socialLinks
                .filter((link) => link.shouldShowInNav)
                .map(({ href, label, Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    target={
                      href.startsWith("http") || href.endsWith(".pdf")
                        ? "_blank"
                        : undefined
                    }
                    rel={
                      href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    title={label}
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                    <span className="sr-only">{label}</span>
                  </Link>
                ))}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
}
