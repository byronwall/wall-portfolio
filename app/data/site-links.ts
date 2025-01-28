import { SocialIcons } from "../components/social-icons";

export interface SiteLink {
  href: string;
  label: string;
  external?: boolean;
  Icon?: React.ComponentType<{ className?: string }>;
  shouldShowInNav?: boolean;
}

export const mainNavLinks: SiteLink[] = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export const socialLinks: SiteLink[] = [
  {
    href: "/resume_byron_wall.pdf",
    label: "Resume",
    Icon: SocialIcons.Resume,
    shouldShowInNav: true,
  },
  {
    href: "https://github.com/byronwall",
    label: "GitHub",
    external: true,
    Icon: SocialIcons.GitHub,
    shouldShowInNav: true,
  },
  {
    href: "https://www.linkedin.com/in/byronwall/",
    label: "LinkedIn",
    external: true,
    Icon: SocialIcons.LinkedIn,
    shouldShowInNav: true,
  },
  {
    href: "https://x.com/byronwall",
    label: "Twitter",
    external: true,
    Icon: SocialIcons.Twitter,
  },
  {
    href: "https://www.youtube.com/@byronwalld",
    label: "YouTube",
    external: true,
    Icon: SocialIcons.YouTube,
  },
  {
    href: "mailto:byron@byroni.us",
    label: "Email",
    external: true,
    Icon: SocialIcons.Email,
  },
];
