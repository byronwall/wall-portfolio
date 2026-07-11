import type { Metadata } from "next";
import Link from "next/link";
import { baseUrl } from "../sitemap";
import { experiences } from "./data";
import styles from "./experience.module.css";

export const metadata: Metadata = {
  title: "Experience",
  description: "A chronology of Byron Wall’s work across software, data products, and engineering.",
  alternates: { canonical: `${baseUrl}/experience` },
};

export default function ExperiencePage() {
  return (
    <main className={styles.page}>
      <header className={styles.intro}>
        <h1>Experience</h1>
        <p>A concise record of the teams I’ve joined and the technical problems I’ve helped solve.</p>
      </header>
      <ol className={styles.timeline}>
        {experiences.map((item) => (
          <li className={styles.entry} key={item.slug}>
            <div className={styles.dates}>{item.dates}</div>
            <span className={styles.dot} aria-hidden="true" />
            <div className={styles.entryCopy}>
              <h2><Link href={`/experience/${item.slug}`}>{item.company}</Link></h2>
              <p className={styles.role}>{item.role}</p>
              <p className={styles.summary}>{item.summary}</p>
            </div>
            <div className={styles.mark}>
              <img src={item.logoUrl} alt={`${item.company} logo`} />
            </div>
          </li>
        ))}
      </ol>
      <a className={styles.resume} href="/resume_byron_wall.pdf" target="_blank" rel="noreferrer">
        View résumé <span aria-hidden="true">↗</span>
      </a>
    </main>
  );
}
