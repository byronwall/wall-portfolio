import Link from "next/link";
import { notFound } from "next/navigation";
import { CustomMDX } from "app/components/mdx";
import { formatDate, getGames, getPostsForGame } from "app/blog/utils";
import { baseUrl } from "app/sitemap";
import { getGameAreas, getGamePlayHref, getGameTags, hasGameImage } from "../data";
import styles from "../games.module.css";
import { getOgImageUrl } from "app/og-image";

type GamePageProps = { params: Promise<{ slug: string }> };

function getHeadings(content: string) {
  return Array.from(content.matchAll(/^##\s+(.+)$/gm)).map((match) => ({
    label: match[1].replace(/[*_`]/g, ""),
    id: match[1].toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-"),
  }));
}

export async function generateStaticParams() {
  return getGames().map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: GamePageProps) {
  const { slug } = await params;
  const game = getGames().find((entry) => entry.slug === slug);
  if (!game) return;
  const title = game.metadata.title || game.slug;
  const description = game.metadata.summary || game.metadata.description;
  const canonical = `${baseUrl}/games/${game.slug}`;
  const ogImage = getOgImageUrl({ title, description, section: "Game" });
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, type: "website", url: canonical, images: [{ url: ogImage, width: 1200, height: 630, alt: `${title} — Byron Wall` }] },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  const game = getGames().find((entry) => entry.slug === slug);
  if (!game) notFound();
  const title = game.metadata.title || game.slug;
  const headings = getHeadings(game.content);
  const relatedPosts = getPostsForGame(game.slug);
  const playHref = getGamePlayHref(game);
  const localImage = hasGameImage(game);
  const areas = getGameAreas(game);
  const tags = getGameTags(game);

  return (
    <main className={styles.detailPage}>
      <Link href="/games" className={styles.back}>← Games</Link>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <h1>{title}</h1>
          <p>{game.metadata.description || game.metadata.summary}</p>
          <div className={styles.status}>{game.metadata.status || "Game"} · {areas.join(" · ")}</div>
          {tags.length > 0 && <ul className={styles.detailTags} aria-label="Game details">{tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>}
          <nav className={styles.detailActions} aria-label={`${title} actions`}>
            <a className={styles.playLink} href={playHref} target="_blank" rel="noreferrer">Play Gunk Patrol ↗</a>
            {typeof game.metadata.repo === "string" && <a href={game.metadata.repo} target="_blank" rel="noreferrer">Source ↗</a>}
          </nav>
        </div>
        <div className={styles.heroMedia}>
          {localImage ? <img src={game.thumbnail} alt={`${title} gameplay`} /> : <GamePlaceholder game={game} />}
        </div>
      </header>

      <div className={styles.story}>
        <aside className={styles.storyNav}>
          <span>Game notes</span>
          {headings.length > 0 && <nav aria-label="On this page">{headings.map((heading) => <a href={`#${heading.id}`} key={heading.id}>{heading.label}</a>)}</nav>}
        </aside>
        <article className={`prose ${styles.prose}`}><CustomMDX source={game.content} /></article>
      </div>

      <section className={styles.related} aria-labelledby="related-posts-heading">
        <h2 id="related-posts-heading">Related posts</h2>
        <p>Build notes and experiments connected to this game.</p>
        {relatedPosts.length > 0 ? <ul>{relatedPosts.map((post) => <li key={post.slug}><Link href={`/blog/${post.slug}`}>{post.metadata.title}</Link> <span>· {formatDate(post.metadata.publishedAt)}</span></li>)}</ul> : <div className={styles.relatedEmpty}>Build notes will appear here when a post is filed with <code>game: {game.slug}</code>.</div>}
      </section>
      <footer className={styles.footer}><Link href="/games">All games →</Link></footer>
    </main>
  );
}

function GamePlaceholder({ game }: { game: ReturnType<typeof getGames>[number] }) {
  return (
    <div className={`${styles.placeholder} ${styles.heroPlaceholder}`} aria-label="Gameplay screenshot placeholder">
      <div className={styles.placeholderTop}><span>Gameplay still / expected asset</span><span className={styles.placeholderSignal} /></div>
      <div className={styles.placeholderBottom}><div><strong>GUNK<br />PATROL</strong><small>Screenshot placeholder<br />{game.thumbnail || "/images/games/gunk-patrol/gameplay.png"}</small></div><span>90%</span></div>
    </div>
  );
}
