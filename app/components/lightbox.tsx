"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./lightbox.module.css";

export type LightboxImage = { src: string; alt: string; caption?: string };

// Full-screen image viewer. Esc, the close button, or a click outside the
// image closes it; arrow keys, the side buttons, or a swipe step between images.
export function Lightbox({
  images,
  index: start,
  onClose,
}: {
  images: LightboxImage[];
  index: number;
  onClose: (last: number) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(start);
  const count = images.length;
  const go = useCallback((d: number) => setIndex((i) => (i + d + count) % count), [count]);
  const close = useCallback(() => onClose(index), [index, onClose]);

  useEffect(() => {
    const el = dialog.current;
    el?.showModal();
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
      el?.close();
    };
  }, []);

  useEffect(() => {
    if (count < 2) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, count]);

  const touchX = useRef<number | null>(null);
  const image = images[index];
  const caption = image.caption ?? image.alt;

  return (
    <dialog
      ref={dialog}
      className={styles.viewer}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.backdrop) close();
      }}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null || count < 2) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
      aria-label="Image viewer"
    >
      <div className={styles.top} data-backdrop="true">
        <span className={styles.counter}>{count > 1 ? `${index + 1} / ${count}` : ""}</span>
        <button type="button" className={styles.iconButton} onClick={close} aria-label="Close viewer" autoFocus>
          <svg viewBox="0 0 16 16"><path d="m3.5 3.5 9 9M12.5 3.5l-9 9" /></svg>
        </button>
      </div>
      <div className={styles.stage} data-backdrop="true">
        <img key={image.src} className={styles.full} src={image.src} alt={image.alt} />
        {count > 1 && (
          <>
            <button type="button" className={`${styles.side} ${styles.prev}`} onClick={() => go(-1)} aria-label="Previous image">
              <svg viewBox="0 0 16 16"><path d="M10 3 5 8l5 5" /></svg>
            </button>
            <button type="button" className={`${styles.side} ${styles.next}`} onClick={() => go(1)} aria-label="Next image">
              <svg viewBox="0 0 16 16"><path d="m6 3 5 5-5 5" /></svg>
            </button>
          </>
        )}
      </div>
      <div className={styles.foot} data-backdrop="true">
        <p className={styles.caption}>{caption}</p>
      </div>
    </dialog>
  );
}

const SKIP = "a, button, [data-no-lightbox], .project-logo-plate";

function eligible(img: HTMLImageElement) {
  return !img.closest(SKIP) && img.closest("dialog") === null;
}

function toImage(img: HTMLImageElement): LightboxImage {
  const figcaption = img.closest("figure")?.querySelector("figcaption")?.textContent?.trim();
  return { src: img.currentSrc || img.src, alt: img.alt, caption: figcaption || undefined };
}

// Wraps content whose images should open in the lightbox. It finds images when
// one is clicked, so MDX and plain <img> tags need no changes.
export function LightboxScope({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<{ images: LightboxImage[]; index: number; from: HTMLImageElement } | null>(null);

  // Make each image reachable by keyboard.
  useEffect(() => {
    root.current?.querySelectorAll("img").forEach((img) => {
      if (!eligible(img)) return;
      img.tabIndex = 0;
      img.dataset.lightbox = "true";
      img.setAttribute("aria-haspopup", "dialog");
    });
  }, []);

  const openAt = (target: HTMLImageElement) => {
    // The hero often repeats the first body image, so keep one entry per src.
    const images: LightboxImage[] = [];
    let index = -1;
    for (const el of root.current?.querySelectorAll<HTMLImageElement>("img[data-lightbox]") ?? []) {
      const image = toImage(el);
      let at = images.findIndex((entry) => entry.src === image.src);
      if (at === -1) at = images.push(image) - 1;
      if (el === target) index = at;
    }
    if (index !== -1) setOpen({ images, index, from: target });
  };

  return (
    <div
      ref={root}
      className={styles.scope}
      onClick={(e) => {
        const img = (e.target as HTMLElement).closest("img");
        if (img?.dataset.lightbox) openAt(img);
      }}
      onKeyDown={(e) => {
        const img = e.target as HTMLElement;
        if (img.tagName !== "IMG" || !img.dataset.lightbox || (e.key !== "Enter" && e.key !== " ")) return;
        e.preventDefault();
        openAt(img as HTMLImageElement);
      }}
    >
      {children}
      {open && (
        <Lightbox
          images={open.images}
          index={open.index}
          onClose={() => {
            const from = open.from;
            setOpen(null);
            // Wait for the dialog to close before focus can move back.
            requestAnimationFrame(() => from.focus({ preventScroll: true }));
          }}
        />
      )}
    </div>
  );
}
