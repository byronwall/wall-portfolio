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
