import { socialLinks } from "../data/site-links";

export function Footer() {
  return (
    <footer className="mt-8 border-t py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex flex-wrap justify-center gap-6 items-center">
            {socialLinks
              .filter((link) => link.label !== "Resume")
              .map(({ href, label, Icon }) => (
                <a
                  key={href}
                  href={href}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                >
                  {Icon && <Icon className="w-6 h-6" />}
                  <span className="sr-only">{label}</span>
                </a>
              ))}
          </div>
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Byron Wall
          </p>
        </div>
      </div>
    </footer>
  );
}
