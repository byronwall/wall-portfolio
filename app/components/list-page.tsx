"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import styles from "./list-page.module.css";

export { styles as listStyles };

export type Facet = { value: string; label: string; count: number; logo?: string };

export function ListHeader({ title, lede, stacked }: { title: string; lede: ReactNode; stacked?: boolean }) {
  return (
    <header className={styles.head} data-stacked={stacked || undefined}>
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
      if (event.key !== "/" || (target instanceof Element && target.closest("input, textarea, select, [contenteditable], [role=listbox]"))) return;
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

export type SelectOption = { value: string; label: string };

/** A button that opens a menu of options. Not a native select, so it matches the site in every browser. */
export function Select({
  label,
  value,
  onChange,
  options,
  quiet,
  width,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  quiet?: boolean;
  /** Button text when no option matches the value. */
  placeholder?: string;
  width?: number;
}) {
  const id = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const current = options.find((option) => option.value === value) ?? (placeholder ? undefined : options[0]);

  const place = () => {
    const button = buttonRef.current;
    const menu = menuRef.current;
    if (!button || !menu) return;
    const rect = button.getBoundingClientRect();
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - menu.offsetWidth - 8));
    const below = rect.bottom + 4;
    const top = below + menu.offsetHeight > window.innerHeight - 8 ? Math.max(8, rect.top - 4 - menu.offsetHeight) : below;
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    menu.style.minWidth = `${rect.width}px`;
  };

  const show = (index: number) => {
    setActive(index);
    if (!menuRef.current?.matches(":popover-open")) menuRef.current?.showPopover();
    menuRef.current?.focus();
  };

  const choose = (index: number) => {
    const option = options[index];
    if (option) onChange(option.value);
    menuRef.current?.hidePopover();
    buttonRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    place();
    menuRef.current?.focus();
    // Keep the menu under its button while the page scrolls.
    const follow = (event: Event) => {
      if (event.target instanceof Node && menuRef.current?.contains(event.target)) return;
      place();
    };
    window.addEventListener("resize", follow);
    window.addEventListener("scroll", follow, true);
    return () => {
      window.removeEventListener("resize", follow);
      window.removeEventListener("scroll", follow, true);
    };
  }, [open]);

  useEffect(() => {
    if (open) menuRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const onMenuKey = (event: React.KeyboardEvent) => {
    const last = options.length - 1;
    const moves: Record<string, number> = { ArrowDown: Math.min(last, active + 1), ArrowUp: Math.max(0, active - 1), Home: 0, End: last };
    if (event.key in moves) {
      event.preventDefault();
      setActive(moves[event.key]);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(active);
    } else if (event.key === "Tab") {
      menuRef.current?.hidePopover();
    } else if (event.key.length === 1) {
      const key = event.key.toLowerCase();
      const match = options.findIndex((option, index) => index > active && option.label.toLowerCase().startsWith(key));
      const wrap = options.findIndex((option) => option.label.toLowerCase().startsWith(key));
      if (match !== -1 || wrap !== -1) setActive(match !== -1 ? match : wrap);
    }
  };

  const selectedIndex = current ? options.indexOf(current) : 0;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={styles.select}
        data-quiet={quiet || undefined}
        data-selected={(quiet && value) || undefined}
        data-open={open || undefined}
        style={width ? { minWidth: width } : undefined}
        aria-label={`${label}: ${current?.label ?? placeholder}`}
        title={current?.label ?? placeholder}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        popoverTarget={id}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            show(selectedIndex);
          }
        }}
        onClick={() => setActive(selectedIndex)}
      >
        <span className={styles.selectLabel}>{current?.label ?? placeholder}</span>
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="m4.5 6.5 3.5 3.5 3.5-3.5" />
        </svg>
      </button>
      <ul
        ref={menuRef}
        id={id}
        popover="auto"
        role="listbox"
        aria-label={label}
        tabIndex={-1}
        aria-activedescendant={`${id}-${active}`}
        className={styles.menu}
        onToggle={(event) => setOpen((event as unknown as ToggleEvent).newState === "open")}
        onKeyDown={onMenuKey}
      >
        {options.map((option, index) => (
          <li
            key={option.value}
            id={`${id}-${index}`}
            role="option"
            aria-selected={option.value === current?.value}
            data-active={index === active || undefined}
            onPointerMove={() => setActive(index)}
            onClick={() => choose(index)}
          >
            {option.label}
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="m3.5 8.5 3 3 6-7" />
            </svg>
          </li>
        ))}
      </ul>
    </>
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
          value={moreSelected ? value : ""}
          onChange={onChange}
          placeholder={`${moreLabel}…`}
          options={more.map((facet) => ({ value: facet.value, label: `${facet.label} (${facet.count})` }))}
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
