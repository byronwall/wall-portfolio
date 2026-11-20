"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./list-page.module.css";

export { styles as listStyles };

export type Facet = { value: string; label: string; count: number; logo?: string };

export function ListHeader({ title, lede }: { title: string; lede: ReactNode }) {
  return (
    <header className={styles.head}>
      <h1 className={styles.heading}>{title}</h1>
      <p className={styles.lede}>{lede}</p>
    </header>
  );
}

/** Filter values that live in the URL, so a refresh or shared link keeps them. */
export function useUrlFilters<K extends string>(keys: readonly K[]) {
  const [values, setValues] = useState(() => Object.fromEntries(keys.map((key) => [key, ""])) as Record<K, string>);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setValues(Object.fromEntries(keys.map((key) => [key, params.get(key) ?? ""])) as Record<K, string>);
    // keys is a constant list from the caller.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (next: Partial<Record<K, string>>) => {
    const merged = { ...values, ...next };
    setValues(merged);
    const params = new URLSearchParams();
    for (const key of keys) {
      const value = merged[key].trim();
      if (value) params.set(key, value);
    }
    const search = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`);
  };

  return [values, update] as const;
}

export function SearchBox({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (event.key !== "/" || (target instanceof Element && target.closest("input, textarea, select, [contenteditable]"))) return;
      event.preventDefault();
      ref.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <label className={styles.search}>
      <span className={styles.srOnly}>{label}</span>
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="8.5" cy="8.5" r="5.5" />
        <path d="m13 13 4 4" />
      </svg>
      <input
        ref={ref}
        type="search"
        placeholder={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") onChange("");
        }}
      />
      <kbd aria-hidden="true">/</kbd>
    </label>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
  quiet,
  width,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  quiet?: boolean;
  width?: number;
}) {
  return (
    <label className={styles.select} data-quiet={quiet || undefined} data-selected={(quiet && value) || undefined}>
      <span className={styles.srOnly}>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} style={width ? { width } : undefined}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function FacetIcon({ facet }: { facet: Facet }) {
  if (facet.logo) return <img className={`${styles.icon} project-logo-plate`} src={facet.logo} alt="" />;
  return (
    <span className={styles.monogram} aria-hidden="true">
      {facet.label.charAt(0).toUpperCase()}
    </span>
  );
}

/** "All", the top facets as chips, and the rest in a "More" select. */
export function FacetChips({
  label,
  facets,
  value,
  onChange,
  top,
  moreLabel,
  icons,
}: {
  label: string;
  facets: Facet[];
  value: string;
  onChange: (value: string) => void;
  top: number;
  moreLabel: string;
  icons?: boolean;
}) {
  const shown = facets.slice(0, top);
  const more = facets.slice(top);
  const moreSelected = more.some((facet) => facet.value === value);

  return (
    <nav className={styles.chips} aria-label={label}>
      <button type="button" className={styles.chip} aria-pressed={!value} onClick={() => onChange("")}>
        All
      </button>
      {shown.map((facet) => (
        <button
          key={facet.value}
          type="button"
          className={styles.chip}
          data-empty={facet.count === 0 || undefined}
          aria-pressed={value === facet.value}
          onClick={() => onChange(value === facet.value ? "" : facet.value)}
        >
          {icons && <FacetIcon facet={facet} />}
          {facet.label}
          <span className={styles.count}>{facet.count}</span>
        </button>
      ))}
      {more.length > 0 && (
        <Select
          label={moreLabel}
          quiet
          width={132}
          value={moreSelected ? value : ""}
          onChange={onChange}
          options={[
            { value: "", label: `${moreLabel}…` },
            ...more.map((facet) => ({ value: facet.value, label: `${facet.label} (${facet.count})` })),
          ]}
        />
      )}
    </nav>
  );
}

/** Count items per facet value. Ties keep the input order. */
export function countFacets<T>(items: T[], keys: (item: T) => Array<Omit<Facet, "count">>): Facet[] {
  const counts = new Map<string, Facet>();
  for (const item of items) {
    for (const entry of keys(item)) {
      const facet = counts.get(entry.value) ?? { ...entry, count: 0 };
      facet.count += 1;
      counts.set(entry.value, facet);
    }
  }
  return Array.from(counts.values()).sort((a, b) => b.count - a.count);
}

export function highlight(text: string, query: string): ReactNode {
  if (!query) return text;
  const lower = text.toLowerCase();
  const parts: ReactNode[] = [];
  let index = 0;
  let match = lower.indexOf(query, index);
  while (match !== -1) {
    if (match > index) parts.push(text.slice(index, match));
    parts.push(<mark key={match}>{text.slice(match, match + query.length)}</mark>);
    index = match + query.length;
    match = lower.indexOf(query, index);
  }
  parts.push(text.slice(index));
  return parts;
}
