import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { baseUrl } from "../../sitemap";
import { experiences, getExperience } from "../data";
import styles from "./detail.module.css";

export function generateStaticParams() {
  return experiences.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getExperience(slug);
  if (!item) return {};
  return { title: `${item.company} — ${item.role}`, description: item.summary, alternates: { canonical: `${baseUrl}/experience/${slug}` } };
}

export default async function ExperienceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getExperience(slug);
  if (!item) notFound();

  return (
    <main className={styles.page}>
      <Link className={styles.back} href="/experience">← Back to experience</Link>
      <section className={styles.hero}>
        <div>
          <div className={styles.identity}><div className={styles.mark}><img src={item.logoUrl} alt={`${item.company} logo`} /></div></div>
          <h1>{item.company}</h1>
          <p className={styles.role}>{item.role}</p>
          <div className={styles.meta}><span>{item.dates}</span><span>{item.location}</span></div>
          <p className={styles.overview}>{item.overview}</p>
        </div>
        <div className={styles.artifact} role="img" aria-label={`Reserved space for a representative ${item.company} artifact`}>
          <span className={styles.artifactMark} aria-hidden="true">{item.mark}</span>
          <p>{item.artifactLabel}</p>
        </div>
      </section>
      <section className={styles.body}>
        <div className={styles.focus}>
          <h2>What I worked on</h2>
          <ul>{item.focus.map((focus) => <li key={focus}>{focus}</li>)}</ul>
        </div>
        <aside className={styles.aside}>
          <h2>Systems &amp; tools</h2>
          <div className={styles.tags}>{item.tools.map((tool) => <span className={styles.tag} key={tool}>{tool}</span>)}</div>
          <a className={styles.companyLink} href={item.externalUrl} target="_blank" rel="noreferrer">Company site ↗</a>
        </aside>
        <div className={styles.reflection}>
          <h2>What stayed with me</h2>
          <p>{item.reflection}</p>
        </div>
      </section>
    </main>
  );
}
