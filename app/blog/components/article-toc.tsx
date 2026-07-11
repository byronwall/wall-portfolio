"use client";

import { useEffect, useState } from "react";
import styles from "../blog.module.css";

type TocItem = { id: string; title: string };

export function ArticleToc({ items }: { items: TocItem[] }) {
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

  return (
    <nav className={styles.toc} aria-label="On this page">
      <span className={styles.tocTitle}>On this page</span>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={activeId === item.id ? styles.tocActive : undefined}
              aria-current={activeId === item.id ? "location" : undefined}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
