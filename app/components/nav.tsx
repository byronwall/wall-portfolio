"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNavLinks, socialLinks } from "../data/site-links";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const pathname = usePathname() ?? "/";

  return (
    <header className="site-header">
      <nav className="site-nav-inner" id="nav" aria-label="Main">
        <Link href="/" className="brand-mark" aria-label="Byron Wall, home">
          BW
        </Link>
        <div className="nav-links">
          {mainNavLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link"
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <div className="nav-socials">
          {socialLinks
            .filter((link) => link.shouldShowInNav && link.label !== "Resume")
            .map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                className="nav-icon-button"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
              >
                {Icon && <Icon aria-hidden="true" />}
              </a>
            ))}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
