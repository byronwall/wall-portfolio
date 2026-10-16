import { socialLinks } from "../data/site-links";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-links">
        <span>© {new Date().getFullYear()} Byron Wall</span>
        <a href="/resume_byron_wall.pdf" target="_blank" rel="noopener noreferrer">
          Résumé
        </a>
        <a href="/rss">RSS</a>
      </div>
      <div className="footer-socials">
        {socialLinks
          .filter((link) => link.label !== "Resume")
          .map(({ href, label, Icon }) => (
            <a
              key={href}
              href={href}
              className="nav-icon-button"
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={label}
            >
              {Icon && <Icon aria-hidden="true" />}
            </a>
          ))}
      </div>
    </footer>
  );
}
