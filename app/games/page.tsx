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
  // Newest first.
  const games = getGames().sort((a, b) => String(b.metadata.publishedAt).localeCompare(String(a.metadata.publishedAt)));

  return (
    <main className={ui.page}>
      <ListHeader
        title="Games"
        stacked
        lede="My son comes up with the ideas for these games. I build them with coding agents, then we play them together and fix what he finds."
      />
      <div className={ui.section}>
        <ul className={ui.picks}>
          {games.map((game) => {
            const title = game.metadata.title || game.slug;
            const tags = getGameTags(game);
            const play = getGamePlayHref(game);
            return (
              <li key={game.slug}>
                <article className={styles.pickCard}>
                  <a className={ui.pick} href={play} target="_blank" rel="noreferrer">
                    <span className={ui.pickImage}>
                      {hasGameImage(game) && <img src={game.thumbnail} alt="" />}
                    </span>
                    <span className={ui.pickCopy}>
                      <span className={ui.pickTitle}>{title}</span>
                      <span className={ui.pickWhy}>{game.metadata.description || game.metadata.summary}</span>
                    </span>
                  </a>
                  {tags.length > 0 && <p className={styles.pickTags}>{tags.join(" · ")}</p>}
                  <div className={styles.cardActions}>
                    <a className="button button-primary" href={play} target="_blank" rel="noreferrer">
                      Play game <span aria-hidden="true">↗</span>
                    </a>
                    <Link className={styles.about} href={`/games/${game.slug}`}>
                      Read about it
                    </Link>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
