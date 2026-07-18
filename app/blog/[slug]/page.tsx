import { notFound } from "next/navigation";
import { CustomMDX } from "app/components/mdx";
import { formatDate, getBlogPosts, getPostCategory, getPostsForProject, getProjects, getReadingTime, getTableOfContents } from "app/blog/utils";
import { baseUrl } from "app/sitemap";
import Link from "next/link";
import { ArticleToc } from "../components/article-toc";
import styles from "../blog.module.css";
import { getOgImageUrl } from "app/og-image";

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

function absoluteUrl(pathOrUrl: string) {
  return pathOrUrl.startsWith("http")
    ? pathOrUrl
    : `${baseUrl}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderArticleTitle(title: string, codeTokens?: string[]) {
  if (!codeTokens?.length) return title;

  const tokenSet = new Set(codeTokens);
  const tokenPattern = new RegExp(
    `(${codeTokens.map(escapeRegExp).join("|")})`,
    "g",
  );

  return title.split(tokenPattern).map((part, index) =>
    tokenSet.has(part) ? (
      <code className={styles.articleTitleCode} key={`${part}-${index}`}>
        {part}
      </code>
    ) : (
      part
    ),
  );
}

export async function generateStaticParams() {
  let posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPageProps) {
  const { slug } = await params;
  let post = getBlogPosts().find((post) => post.slug === slug);
  if (!post) {
    return;
  }

  const title = post.metadata.title;
  const seoTitle =
    typeof post.metadata.seoTitle === "string" ? post.metadata.seoTitle : title;
  const description =
    typeof post.metadata.seoDescription === "string"
      ? post.metadata.seoDescription
      : post.metadata.summary;
  const publishedTime = post.metadata.publishedAt;
  const modifiedTime =
    typeof post.metadata.updatedAt === "string"
      ? post.metadata.updatedAt
      : publishedTime;

  const canonicalUrl = `${baseUrl}/blog/${post.slug}`;
  const previewImage = post.thumbnail ? absoluteUrl(post.thumbnail) : undefined;
  const ogImage = getOgImageUrl({
    title: seoTitle,
    description,
    image: previewImage,
    section: "Blog note",
  });

  return {
    title: seoTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seoTitle,
      description,
      type: "article",
      publishedTime,
      modifiedTime,
      url: canonicalUrl,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${title} — Byron Wall`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description,
      images: [ogImage],
    },
  };
}

export default async function Blog({ params }: BlogPageProps) {
  const { slug } = await params;
  let post = getBlogPosts().find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  const readingTime = getReadingTime(post.content);
  const category = getPostCategory(post.metadata);
  const tableOfContents = getTableOfContents(post.content);
  const isInteractive = post.metadata.layout === "interactive";
  const currentPostSlug = post.slug;
  const projectSlug = typeof post.metadata.project === "string" ? post.metadata.project : undefined;
  const relatedProject = projectSlug
    ? getProjects().find((project) => project.slug === projectSlug)
    : undefined;
  const relatedPosts = projectSlug
    ? getPostsForProject(projectSlug).filter((entry) => entry.slug !== currentPostSlug).slice(0, 3)
    : [];

  return (
    <main className={`${styles.articlePage} ${isInteractive ? `${styles.interactiveArticlePage} interactive-article-page` : ""}`}>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified:
              typeof post.metadata.updatedAt === "string"
                ? post.metadata.updatedAt
                : post.metadata.publishedAt,
            description: post.metadata.summary,
            image: getOgImageUrl({
              title: post.metadata.title,
              description: post.metadata.summary,
              image: post.thumbnail ? absoluteUrl(post.thumbnail) : undefined,
              section: "Blog note",
            }),
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              "@type": "Person",
              name: "Byron Wall",
            },
          }),
        }}
      />
      {isInteractive && (
        <div className={styles.interactiveTopbar}>
          <Link className={styles.interactiveBackLink} href="/blog">← All notes</Link>
          <div className={styles.interactiveMeta} aria-label="Article details">
            <span>{formatDate(post.metadata.publishedAt)}</span>
            <span>{readingTime}</span>
            <span>{category}</span>
            {relatedProject && <Link href={`/projects/${relatedProject.slug}`}>{relatedProject.metadata.title} →</Link>}
          </div>
        </div>
      )}
      <div className={`${styles.articleLayout} ${isInteractive ? styles.interactiveLayout : ""}`}>
        <aside className={`${styles.articleRail} ${isInteractive ? styles.interactiveRail : ""}`}>
          {isInteractive ? (
            tableOfContents.length > 0 && <ArticleToc items={tableOfContents} variant="compact" />
          ) : (
            <>
              <Link className={styles.backLink} href="/blog">← All notes</Link>
              <dl className={styles.railMeta}>
                <div><dt>Published</dt><dd>{formatDate(post.metadata.publishedAt)}</dd></div>
                {typeof post.metadata.updatedAt === "string" &&
                  post.metadata.updatedAt !== post.metadata.publishedAt && (
                    <div><dt>Updated</dt><dd>{formatDate(post.metadata.updatedAt)}</dd></div>
                  )}
                <div><dt>Reading time</dt><dd>{readingTime}</dd></div>
                <div><dt>Filed under</dt><dd>{category}</dd></div>
                {relatedProject && <div><dt>Related project</dt><dd><Link href={`/projects/${relatedProject.slug}`}>{relatedProject.metadata.title} →</Link></dd></div>}
              </dl>
              {tableOfContents.length > 0 && <ArticleToc items={tableOfContents} />}
            </>
          )}
        </aside>
        <div className={`${styles.articleMain} ${isInteractive ? styles.interactiveMain : ""}`}>
          <header className={styles.articleHeader}>
            <h1>
              {renderArticleTitle(
                post.metadata.title,
                Array.isArray(post.metadata.titleCode)
                  ? post.metadata.titleCode
                  : undefined,
              )}
            </h1>
            <p className={styles.articleSummary}>{post.metadata.summary}</p>
            <p className={styles.articleMobileMeta}>{formatDate(post.metadata.publishedAt)} · {readingTime} · {category}{relatedProject ? ` · ${relatedProject.metadata.title}` : ""}</p>
            {post.metadata.articleHero !== "false" && (
              <div className={styles.articleHero}>
                {post.thumbnail ? <img className={styles.articleHeroImage} src={post.thumbnail} alt="" /> : <div className={`${styles.fallbackVisual} ${styles.articleFallback}`}><span className={styles.fallbackMark}>BW / {post.metadata.title.slice(0, 2).toUpperCase()}</span></div>}
              </div>
            )}
          </header>
          <article className={`prose ${styles.articleBody} ${isInteractive ? styles.interactiveBody : ""}`}><CustomMDX source={post.content} /></article>
          {relatedProject && (
            <footer className={styles.articleRelated}>
              <p>Part of <Link href={`/projects/${relatedProject.slug}`}>{relatedProject.metadata.title}</Link>.</p>
              {relatedPosts.length > 0 && (
                <div>
                  <span>More from this project</span>
                  <ul>{relatedPosts.map((entry) => <li key={entry.slug}><Link href={`/blog/${entry.slug}`}>{entry.metadata.title}</Link></li>)}</ul>
                </div>
              )}
            </footer>
          )}
        </div>
      </div>
    </main>
  );
}
