import type { Experience } from "./data";

// Not every employer has a usable logo; fall back to its short mark in text.
export function CompanyLogo({ item }: { item: Experience }) {
  if (item.logoUrl) return <img src={item.logoUrl} alt={`${item.company} logo`} />;
  return <span className="company-logo-text" aria-label={item.company}>{item.mark}</span>;
}
