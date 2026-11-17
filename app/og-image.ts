import { baseUrl } from "./sitemap";

type OgImageOptions = {
  title: string;
  description?: string;
  image?: string;
  section?: string;
};

export function getOgImageUrl({
  title,
  description,
  image,
  section,
}: OgImageOptions) {
  const url = new URL("/og", baseUrl);

  url.searchParams.set("title", title);
  if (description) url.searchParams.set("description", description);
  if (image) url.searchParams.set("image", image);
  if (section) url.searchParams.set("section", section);

  return url.toString();
}

// Index pages need their own card; otherwise they inherit the home card.
export function indexMetadata(title: string, description: string, path: string) {
  const url = `${baseUrl}${path}`;
  const image = getOgImageUrl({ title, description, section: "Byron Wall" });
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | Byron Wall`,
      description,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: `${title} — Byron Wall` }],
    },
    twitter: { card: "summary_large_image", title: `${title} | Byron Wall`, description, images: [image] },
  };
}
