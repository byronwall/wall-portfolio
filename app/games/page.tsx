import Link from "next/link";
import { getGames } from "app/blog/utils";
import { baseUrl } from "app/sitemap";
import { getGameAreas, getGamePlayHref, getGameTags, hasGameImage } from "./data";
import styles from "./games.module.css";

export const metadata = {
  title: "Games",
  description: "Small browser games and playful experiments by Byron Wall.",
  alternates: { canonical: `${baseUrl}/games` },
};

function GamePlaceholder({ game }: { game: ReturnType<typeof getGames>[number] }) {
  return (
    <div className={styles.placeholder} aria-hidden="true">
      <div className={styles.placeholderTop}>
        <span>Route 01 / {getGameAreas(game)[0]}</span>
        <span className={styles.placeholderSignal} />
      </div>
      <div className={styles.placeholderBottom}>
        <div>
          <strong>GUNK<br />PATROL</strong>
          <small>Green in. Blue out.<br />Keep moving.</small>
        </div>
        <span>90%</span>
      </div>
    </div>
  );
}

function GameVisual({ game }: { game: ReturnType<typeof getGames>[number] }) {
  return (
    <div className={styles.visual}>
      {hasGameImage(game) ? <img src={game.thumbnail} alt="Gunk Patrol swamp cleanup gameplay" /> : <GamePlaceholder game={game} />}
    </div>
  );
}

export default function GamesPage() {
  const games = getGames().sort((a, b) => (Number(a.metadata.indexOrder) || 99) - (Number(b.metadata.indexOrder) || 99));

  return (
    <main className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.kicker}>Playful systems</p>
        <h1>Games</h1>
        <p className={styles.lede}>
          Small browser games where the rules are easy to learn, the feedback is
          visible, and a good idea can be played instead of only explained.
        </p>
      </header>

      <section className={styles.collection} aria-labelledby="games-heading">
        <div className={styles.collectionHeader}>
          <h2 id="games-heading">Available now</h2>
          <span>{games.length} {games.length === 1 ? "game" : "games"}</span>
        </div>
        {games.length > 0 ? (
          <div className={styles.grid}>
            {games.map((game) => {
              const title = game.metadata.title || game.slug;
              const tags = getGameTags(game);
              return (
                <article className={styles.card} key={game.slug}>
                  <Link className={styles.visualLink} href={`/games/${game.slug}`} aria-label={`View ${title}`}>
                    <GameVisual game={game} />
                  </Link>
                  <div className={styles.copy}>
                    <div className={styles.meta}>
                      <span>{game.metadata.status || "Game"}</span>
                      <span>Touch-first</span>
                    </div>
                    <h3><Link href={`/games/${game.slug}`}>{title} <span aria-hidden="true">↗</span></Link></h3>
                    <p className={styles.description}>{game.metadata.description || game.metadata.summary}</p>
                    {tags.length > 0 && <ul className={styles.tags} aria-label="Game details">{tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>}
                    <nav className={styles.actions} aria-label={`${title} links`}>
                      <a href={getGamePlayHref(game)} target="_blank" rel="noreferrer">Play game <span aria-hidden="true">↗</span></a>
                      <Link href={`/games/${game.slug}`}>View details <span aria-hidden="true">↗</span></Link>
                    </nav>
                  </div>
                </article>
              );
            })}
          </div>
        ) : <p className={styles.empty}>The first game is being prepared.</p>}
      </section>
    </main>
  );
}
