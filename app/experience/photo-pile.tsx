"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./photo-pile.module.css";

export type Photo = { src: string; alt: string; caption: string };

// A small stack of photos. The top one shows in full; the next two peek out
// behind it. Clicking any card opens the viewer at that photo.
export function PhotoPile({ photos }: { photos: Photo[] }) {
  const [top, setTop] = useState(0);
  const [viewing, setViewing] = useState<number | null>(null);
  const count = photos.length;
  const step = (d: number) => setTop((i) => (i + d + count) % count);

  return (
    <div className={styles.wrap}>
      <div className={styles.pile} data-count={Math.min(count, 3)}>
        {photos.map((photo, i) => {
          const depth = (i - top + count) % count;
          if (depth > 2) return null;
          return (
            <button
              key={photo.src}
              type="button"
              className={styles.card}
              data-depth={depth}
              onClick={() => setViewing(i)}
              aria-label={`View photo: ${photo.caption}`}
            >
              <img src={photo.src} alt={photo.alt} loading={depth === 0 ? "eager" : "lazy"} />
            </button>
          );
        })}
        <span className={styles.expand} aria-hidden="true">
          <svg viewBox="0 0 16 16"><path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5 9 7M2.5 13.5 7 9" /></svg>
        </span>
      </div>
      <div className={styles.bar}>
        <p className={styles.caption}>{photos[top].caption}</p>
        {count > 1 && (
          <div className={styles.nav}>
            <button type="button" onClick={() => step(-1)} aria-label="Previous photo">
              <svg viewBox="0 0 16 16"><path d="M10 3 5 8l5 5" /></svg>
            </button>
            <span>{top + 1} / {count}</span>
            <button type="button" onClick={() => step(1)} aria-label="Next photo">
              <svg viewBox="0 0 16 16"><path d="m6 3 5 5-5 5" /></svg>
            </button>
          </div>
        )}
      </div>
      {viewing !== null && (
        <PhotoViewer
          photos={photos}
          start={viewing}
          onClose={(last) => {
            setTop(last);
            setViewing(null);
          }}
        />
      )}
    </div>
  );
}

function PhotoViewer({ photos, start, onClose }: { photos: Photo[]; start: number; onClose: (last: number) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(start);
  const count = photos.length;
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // Swipe on touch screens.
  const touchX = useRef<number | null>(null);
  const photo = photos[index];

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
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
      aria-label="Photo viewer"
    >
      <div className={styles.top}>
        <span className={styles.counter}>{index + 1} / {count}</span>
        <button type="button" className={styles.iconButton} onClick={close} aria-label="Close viewer">
          <svg viewBox="0 0 16 16"><path d="m3.5 3.5 9 9M12.5 3.5l-9 9" /></svg>
        </button>
      </div>
      <div className={styles.stage} data-backdrop="true">
        <img key={photo.src} className={styles.full} src={photo.src} alt={photo.alt} />
        {count > 1 && (
          <>
            <button type="button" className={`${styles.side} ${styles.prev}`} onClick={() => go(-1)} aria-label="Previous photo">
              <svg viewBox="0 0 16 16"><path d="M10 3 5 8l5 5" /></svg>
            </button>
            <button type="button" className={`${styles.side} ${styles.next}`} onClick={() => go(1)} aria-label="Next photo">
              <svg viewBox="0 0 16 16"><path d="m6 3 5 5-5 5" /></svg>
            </button>
          </>
        )}
      </div>
      <div className={styles.foot}>
        <p className={styles.fullCaption}>{photo.caption}</p>
        {count > 1 && (
          <div className={styles.strip}>
            {photos.map((p, i) => (
              <button
                key={p.src}
                type="button"
                className={styles.stripThumb}
                aria-current={i === index}
                aria-label={`Show photo ${i + 1}`}
                onClick={() => setIndex(i)}
              >
                <img src={p.src} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>
    </dialog>
  );
}
