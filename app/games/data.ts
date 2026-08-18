import fs from "fs";
import path from "path";
import { getGames } from "app/blog/utils";

export function getGame(slug: string) {
  return getGames().find((game) => game.slug === slug);
}

export function getGameAreas(game: ReturnType<typeof getGames>[number]) {
  return Array.isArray(game.metadata.areas) ? game.metadata.areas : ["Swamp", "Sewer / tunnel", "City"];
}

export function getGameTags(game: ReturnType<typeof getGames>[number]) {
  return Array.isArray(game.metadata.tags) ? game.metadata.tags.filter(Boolean) : [];
}

export function getGamePlayHref(game: ReturnType<typeof getGames>[number]) {
  return typeof game.metadata.play === "string" && game.metadata.play
    ? game.metadata.play
    : `/games/${game.slug}/play.html`;
}

export function hasGameImage(game: ReturnType<typeof getGames>[number]) {
  const image = game.thumbnail;
  return Boolean(
    image &&
      image.startsWith("/") &&
      fs.existsSync(path.join(process.cwd(), "public", image.slice(1))),
  );
}
