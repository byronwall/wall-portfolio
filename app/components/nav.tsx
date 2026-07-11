import Link from "next/link";
import { mainNavLinks, socialLinks } from "../data/site-links";

export function Navbar() {
  return (
    <header className="site-header">
      <div>
        <nav
          className="site-nav"
          id="nav"
        >
          <div className="site-nav-inner">
            <Link href="/" className="brand-mark" aria-label="Byron Wall, home">
              BW
            </Link>
            <div className="nav-links">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="nav-link"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="nav-socials">
              {socialLinks
                .filter(
                  (link) => link.shouldShowInNav && link.label !== "Resume"
                )
                .map(({ href, label, Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    className="nav-social-link"
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
    </header>
  );
}
