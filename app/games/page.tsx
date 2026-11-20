import { indexMetadata } from "../og-image";
import Link from "next/link";
import { ListHeader } from "../components/list-page";
import ui from "../components/list-page.module.css";
import { getGames } from "app/blog/utils";
import { getGamePlayHref, getGameTags, hasGameImage } from "./data";
import styles from "./games.module.css";

export const metadata = indexMetadata(
  "Games",
  "Small browser games and playful experiments by Byron Wall.",
  "/games",
);

export default function GamesPage() {
  const games = getGames().sort((a, b) => (Number(a.metadata.indexOrder) || 99) - (Number(b.metadata.indexOrder) || 99));

  return (
    <main className={ui.page}>
      <ListHeader
        title="Games"
        lede="Small browser games where the rules are easy to learn and a good idea can be played instead of only explained."
      />
      <div className={ui.section}>
        <ul className={ui.picks}>
          {games.map((game) => {
            const title = game.metadata.title || game.slug;
            const tags = getGameTags(game);
            return (
              <li key={game.slug}>
                <article className={styles.pickCard}>
                  <Link className={ui.pick} href={`/games/${game.slug}`}>
                    <span className={ui.pickImage}>
                      {hasGameImage(game) && <img src={game.thumbnail} alt="" />}
                    </span>
                    <span className={ui.pickCopy}>
                      <span className={ui.pickTitle}>{title}</span>
                      <span className={ui.pickWhy}>{game.metadata.description || game.metadata.summary}</span>
                    </span>
                  </Link>
                  {tags.length > 0 && <p className={styles.pickTags}>{tags.join(" · ")}</p>}
                  <a className={styles.play} href={getGamePlayHref(game)} target="_blank" rel="noreferrer">
                    Play game <span aria-hidden="true">↗</span>
                  </a>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
