import Link from "next/link";
import { baseUrl } from "app/sitemap";
import styles from "./tools.module.css";

export const metadata = {
  title: "Tools",
  description:
    "Small, focused utilities by Byron Wall for planning, inspecting, and making technical work easier.",
  alternates: {
    canonical: `${baseUrl}/tools`,
  },
};

const tools = [
  {
    title: "Date Table",
    description:
      "Build a clean, editable schedule with dates, notes, and flexible columns. Print the finished table when the plan is ready.",
    permanentHref: "/blog/date-table",
    toolHref: "/tools/date-table.html",
  },
];

function TablePreview() {
  return (
    <div className={styles.tablePreview} aria-hidden="true">
      <div className={styles.previewToolbar}>
        <span className={styles.previewDot} />
        <span className={styles.previewLine} />
        <span className={styles.previewButton}>Print</span>
      </div>
      <div className={styles.previewTable}>
        <div className={styles.previewRow}>
          <span>Date</span>
          <span>Focus</span>
          <span>Notes</span>
        </div>
        <div className={styles.previewRow}>
          <span>Mon 12</span>
          <span className={styles.previewFill} />
          <span className={styles.previewFillShort} />
        </div>
        <div className={styles.previewRow}>
          <span>Tue 13</span>
          <span className={styles.previewFill} />
          <span className={styles.previewFillShort} />
        </div>
        <div className={styles.previewRow}>
          <span>Wed 14</span>
          <span className={styles.previewFill} />
          <span className={styles.previewFillShort} />
        </div>
      </div>
    </div>
  );
}

export default function ToolsPage() {
  return (
    <main className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.kicker}>A small collection</p>
        <h1>Tools</h1>
        <p className={styles.lede}>
          Tools are small, focused utilities for making one practical task
          easier. These are the things I build when a simple, useful surface is
          better than a larger application.
        </p>
      </header>

      <section className={styles.collection} aria-labelledby="tools-heading">
        <div className={styles.collectionHeader}>
          <h2 id="tools-heading">Available now</h2>
          <span>{tools.length} utility</span>
        </div>

        <div className={styles.grid}>
          {tools.map((tool, index) => (
            <article className={styles.card} key={tool.title}>
              <a
                className={styles.cardVisual}
                href={tool.toolHref}
                aria-label={`Open ${tool.title} tool`}
              >
                <span className={styles.cardNumber}>0{index + 1}</span>
                <TablePreview />
              </a>
              <div className={styles.cardBody}>
                <div className={styles.cardMeta}>
                  <span>Browser utility</span>
                  <span>Standalone</span>
                </div>
                <h3>
                  <Link href={tool.toolHref}>
                    {tool.title} <span aria-hidden="true">↗</span>
                  </Link>
                </h3>
                <p>{tool.description}</p>
                <nav className={styles.cardActions} aria-label={`${tool.title} links`}>
                  <Link href={tool.permanentHref}>Read the story <span aria-hidden="true">↗</span></Link>
                  <a href={tool.toolHref} target="_blank" rel="noreferrer">
                    Open tool <span aria-hidden="true">↗</span>
                  </a>
                </nav>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
