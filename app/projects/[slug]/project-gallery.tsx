"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./project-gallery.module.css";

export type GalleryImage = { src: string; alt: string };

// The project's images at the top of its page: one featured image, the rest
// as thumbnails below it. Any image opens a full-screen viewer.
// Viewer pattern follows app/experience/photo-pile.tsx.
export function ProjectGallery({ images }: { images: GalleryImage[] }) {
  const [viewing, setViewing] = useState<number | null>(null);
  const [lead, ...rest] = images;

  return (
    <div className={styles.gallery}>
      <button type="button" className={styles.lead} onClick={() => setViewing(0)} aria-label={`View image: ${lead.alt}`}>
        <img src={lead.src} alt={lead.alt} />
        <span className={styles.expand} aria-hidden="true">
          <svg viewBox="0 0 16 16"><path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5 9 7M2.5 13.5 7 9" /></svg>
        </span>
      </button>
      {rest.length > 0 && (
        <div className={styles.thumbs}>
          {rest.map((image, i) => (
            <button
              key={image.src}
              type="button"
              className={styles.thumb}
              onClick={() => setViewing(i + 1)}
              aria-label={`View image: ${image.alt}`}
            >
              <img src={image.src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
      {viewing !== null && <Viewer images={images} start={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}

function Viewer({ images, start, onClose }: { images: GalleryImage[]; start: number; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const [index, setIndex] = useState(start);
  const count = images.length;
  const go = useCallback((d: number) => setIndex((i) => (i + d + count) % count), [count]);

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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const image = images[index];

  return (
    <dialog
      ref={dialog}
      className={styles.viewer}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.backdrop) onClose();
      }}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
      aria-label="Image viewer"
    >
      <div className={styles.top}>
        <span className={styles.counter}>{index + 1} / {count}</span>
        <button type="button" className={styles.iconButton} onClick={onClose} aria-label="Close viewer">
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
      <div className={styles.foot}>
        <p className={styles.caption}>{image.alt}</p>
        {count > 1 && (
          <div className={styles.strip}>
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                className={styles.stripThumb}
                aria-current={i === index}
                aria-label={`Show image ${i + 1}`}
                onClick={() => setIndex(i)}
              >
                <img src={img.src} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>
    </dialog>
  );
}
