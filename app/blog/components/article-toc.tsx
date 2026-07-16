"use client";

import { useEffect, useState } from "react";
import styles from "../blog.module.css";

type TocItem = { id: string; title: string };

export function ArticleToc({
  items,
  variant = "editorial",
}: {
  items: TocItem[];
  variant?: "editorial" | "compact";
}) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const headings = items
      .map(({ id }) => document.getElementById(id))
      .filter((heading): heading is HTMLElement => Boolean(heading));

    if (!headings.length) return;

    const updateActiveSection = () => {
      const threshold = 140;
      const current = headings.reduce((active, heading) => {
        return heading.getBoundingClientRect().top <= threshold ? heading : active;
      }, headings[0]);
      setActiveId(current.id);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [items]);

  const isCompact = variant === "compact";

  return (
    <nav
      className={`${styles.toc} ${isCompact ? styles.tocCompact : ""}`}
      aria-label="On this page"
    >
      <span className={isCompact ? styles.tocCompactTitle : styles.tocTitle}>
        On this page
      </span>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={activeId === item.id ? styles.tocActive : undefined}
              aria-current={activeId === item.id ? "location" : undefined}
            >
              {isCompact && <span className={styles.tocMark} aria-hidden="true" />}
              <span className={isCompact ? styles.tocLabel : undefined}>{item.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
