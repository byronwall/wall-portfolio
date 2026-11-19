import { CompanyLogo } from "./company-logo";
import { indexMetadata } from "../og-image";
import type { Metadata } from "next";
import Link from "next/link";
import { experiences } from "./data";
import styles from "./experience.module.css";

export const metadata: Metadata = indexMetadata(
  "Experience",
  "A chronology of Byron Wall’s work across software, data products, and engineering.",
  "/experience",
);

export default function ExperiencePage() {
  return (
    <main className={styles.page}>
      <header className="page-intro">
        <div className={styles.titleRow}>
          <h1 className="page-title">Experience</h1>
          <a className="button button-secondary" href="/resume_byron_wall.pdf" target="_blank" rel="noreferrer">
            View résumé <span aria-hidden="true">↗</span>
          </a>
        </div>
        <p className="page-lede">A concise record of the teams I’ve joined and the technical problems I’ve helped solve.</p>
      </header>
      <div className={styles.body}>
      <ol className={styles.timeline}>
        {experiences.map((item) => (
          <li className={styles.entry} key={item.slug}>
            <div className={styles.lead}>
              <div className={styles.mark}>
                <CompanyLogo item={item} />
              </div>
              <div className={styles.dates}>{item.dates}</div>
            </div>
            <span className={styles.dot} aria-hidden="true" />
            <div className={styles.entryCopy}>
              <h2><Link href={`/experience/${item.slug}`}>{item.company}</Link></h2>
              <p className={styles.role}>{item.role}</p>
              <p className={styles.summary}>{item.summary}</p>
            </div>
          </li>
        ))}
      </ol>
      </div>
    </main>
  );
}
