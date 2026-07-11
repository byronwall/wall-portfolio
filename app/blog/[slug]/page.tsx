import { notFound } from "next/navigation";
import { CustomMDX } from "app/components/mdx";
import { formatDate, getBlogPosts, getPostCategory, getReadingTime, getTableOfContents } from "app/blog/utils";
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

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
  } = post.metadata;

  const canonicalUrl = `${baseUrl}/blog/${post.slug}`;
  const previewImage = post.thumbnail ? absoluteUrl(post.thumbnail) : undefined;
  const ogImage = getOgImageUrl({
    title,
    description,
    image: previewImage,
    section: "Blog note",
  });

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
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
      title,
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

  return (
    <main className={styles.articlePage}>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
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
      <div className={styles.articleLayout}>
        <aside className={styles.articleRail}>
          <Link className={styles.backLink} href="/blog">← All notes</Link>
          <dl className={styles.railMeta}>
            <div><dt>Published</dt><dd>{formatDate(post.metadata.publishedAt)}</dd></div>
            <div><dt>Reading time</dt><dd>{readingTime}</dd></div>
            <div><dt>Filed under</dt><dd>{category}</dd></div>
          </dl>
          {tableOfContents.length > 0 && <ArticleToc items={tableOfContents} />}
        </aside>
        <div className={styles.articleMain}>
          <header className={styles.articleHeader}>
            <h1>{post.metadata.title}</h1>
            <p className={styles.articleSummary}>{post.metadata.summary}</p>
            <p className={styles.articleMobileMeta}>{formatDate(post.metadata.publishedAt)} · {readingTime} · {category}</p>
            {post.metadata.articleHero !== "false" && (
              <div className={styles.articleHero}>
                {post.thumbnail ? <img className={styles.articleHeroImage} src={post.thumbnail} alt="" /> : <div className={`${styles.fallbackVisual} ${styles.articleFallback}`}><span className={styles.fallbackMark}>BW / {post.metadata.title.slice(0, 2).toUpperCase()}</span></div>}
              </div>
            )}
          </header>
          <article className={`prose ${styles.articleBody}`}><CustomMDX source={post.content} /></article>
        </div>
      </div>
    </main>
  );
}
