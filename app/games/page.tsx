import Link from "next/link";
import { getGames } from "app/blog/utils";
import { baseUrl } from "app/sitemap";
import { getGamePlayHref, getGameTags, hasGameImage } from "./data";
import styles from "./games.module.css";

export const metadata = {
  title: "Games",
  description: "Small browser games and playful experiments by Byron Wall.",
  alternates: { canonical: `${baseUrl}/games` },
};

export default function GamesPage() {
  const games = getGames().sort((a, b) => (Number(a.metadata.indexOrder) || 99) - (Number(b.metadata.indexOrder) || 99));

  return (
    <main className={styles.page}>
      <header className={styles.intro}>
        <h1>Games</h1>
        <p className={styles.lede}>
          Small browser games where the rules are easy to learn, the feedback is
          visible, and a good idea can be played instead of only explained.
        </p>
      </header>

      <section className={styles.collection} aria-labelledby="games-heading">
        <h2 className={styles.collectionHeader} id="games-heading">Available now</h2>
        {games.length > 0 ? (
          <div className={styles.grid}>
            {games.map((game) => {
              const title = game.metadata.title || game.slug;
              const tags = getGameTags(game);
              const hasImage = hasGameImage(game);
              return (
                <article className={`${styles.card}${hasImage ? "" : ` ${styles.cardTextOnly}`}`} key={game.slug}>
                  {hasImage && (
                    <Link className={styles.visualLink} href={`/games/${game.slug}`} aria-label={`View ${title}`}>
                      <div className={styles.visual}>
                        <img src={game.thumbnail} alt={`${title} gameplay`} />
                      </div>
                    </Link>
                  )}
                  <div className={styles.copy}>
                    {game.metadata.status && <p className={styles.meta}>{game.metadata.status}</p>}
                    <h3><Link href={`/games/${game.slug}`}>{title}</Link></h3>
                    <p className={styles.description}>{game.metadata.description || game.metadata.summary}</p>
                    {tags.length > 0 && <ul className={styles.tags} aria-label="Game details">{tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>}
                    <nav className={styles.actions} aria-label={`${title} links`}>
                      <a href={getGamePlayHref(game)} target="_blank" rel="noreferrer">Play game <span aria-hidden="true">↗</span></a>
                      <Link href={`/games/${game.slug}`}>View details</Link>
                    </nav>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </section>
    </main>
  );
}
