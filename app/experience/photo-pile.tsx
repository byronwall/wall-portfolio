"use client";

import { useState } from "react";
import { ViewerScope } from "app/components/image-viewer";
import styles from "./photo-pile.module.css";

export type Photo = { src: string; alt: string; caption: string };

// A small stack of photos. The top one shows in full; the next two peek out
// behind it. Clicking any card opens the shared viewer at that photo.
export function PhotoPile({ photos }: { photos: Photo[] }) {
  const [top, setTop] = useState(0);
  const count = photos.length;
  const step = (d: number) => setTop((i) => (i + d + count) % count);

  return (
    <ViewerScope images={photos} onClose={(src) => setTop(Math.max(0, photos.findIndex((p) => p.src === src)))} className={styles.wrap}>
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
              data-viewer-src={photo.src}
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
    </ViewerScope>
  );
}
