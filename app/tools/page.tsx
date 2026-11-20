import { indexMetadata } from "../og-image";
import Link from "next/link";
import { ListHeader } from "../components/list-page";
import ui from "../components/list-page.module.css";
import styles from "./tools.module.css";

export const metadata = indexMetadata(
  "Tools",
  "Small, focused utilities by Byron Wall for planning, inspecting, and making technical work easier.",
  "/tools",
);

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
    <main className={ui.page}>
      <ListHeader
        title="Tools"
        lede="Small, focused utilities for one practical task, for when a simple surface is better than a larger application."
      />
      <div className={ui.section}>
        <ul className={ui.picks}>
          {tools.map((tool) => (
            <li key={tool.title}>
              <article className={styles.pickCard}>
                <a className={ui.pick} href={tool.toolHref}>
                  <span className={`${ui.pickImage} ${styles.pickPreview}`}>
                    <TablePreview />
                  </span>
                  <span className={ui.pickCopy}>
                    <span className={ui.pickTitle}>{tool.title}</span>
                    <span className={ui.pickWhy}>{tool.description}</span>
                  </span>
                </a>
                <nav className={styles.pickLinks} aria-label={`${tool.title} links`}>
                  <a href={tool.toolHref} target="_blank" rel="noreferrer">
                    Open tool <span aria-hidden="true">↗</span>
                  </a>
                  <Link href={tool.permanentHref}>Read the story</Link>
                </nav>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
