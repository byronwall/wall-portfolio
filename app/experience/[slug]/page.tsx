import { PhotoGallery } from "../photo-gallery";
import { CompanyLogo } from "../company-logo";
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
      <section className={item.photo || item.map ? styles.hero : `${styles.hero} ${styles.heroSolo}`}>
        <div>
          {item.logoUrl && <div className={styles.identity}><div className={styles.mark}><CompanyLogo item={item} /></div></div>}
          <h1>{item.company}</h1>
          <p className={styles.role}>{item.role}</p>
          <div className={styles.meta}><span>{item.dates}</span><span>{item.location}</span></div>
          <p className={styles.overview}>{item.overview}</p>
        </div>
        {(item.photo || item.map) && (
          <div className={styles.media}>
            {item.photo && <img className={styles.photo} src={item.photo.src} alt={item.photo.alt} />}
            <div className={styles.mediaFoot}>
              <p>{item.photo?.credit}</p>
              {item.map && <img className={styles.map} src={item.map} alt={`Map of ${item.location}`} />}
            </div>
          </div>
        )}
      </section>
      {item.gallery && (
        <section className={styles.gallery} aria-labelledby="photos-heading">
          <h2 id="photos-heading">Photos</h2>
          <PhotoGallery photos={item.gallery} />
        </section>
      )}
      <section className={styles.body}>
        <div className={styles.focus}>
          <h2>What I worked on</h2>
          <ul>{item.focus.map((focus) => <li key={focus}>{focus}</li>)}</ul>
        </div>
        <aside className={styles.aside}>
          <h2>Systems &amp; tools</h2>
          <div className={styles.tags}>{item.tools.map((tool) => <span className={styles.tag} key={tool}>{tool}</span>)}</div>
          {item.externalUrl && <a className={styles.companyLink} href={item.externalUrl} target="_blank" rel="noreferrer">Company site ↗</a>}
        </aside>
        {item.reflection && (
          <div className={styles.reflection}>
            <h2>What stayed with me</h2>
            <p>{item.reflection}</p>
          </div>
        )}
      </section>
    </main>
  );
}
