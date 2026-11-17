"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./photo-gallery.module.css";

type Photo = { src: string; alt: string; caption: string };

// Thumbnails that open one photo at a time in a native dialog.
export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  };
  const step = (d: number) => setIndex((i) => (i + d + photos.length) % photos.length);
  const photo = photos[index];

  // Arrow keys page through photos while the viewer is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!dialog.current?.open) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <>
      <ul className={styles.thumbs}>
        {photos.map((p, i) => (
          <li key={p.src}>
            <button type="button" className={styles.thumb} onClick={() => open(i)} aria-label={`Open photo: ${p.caption}`}>
              <img src={p.src} alt={p.alt} loading="lazy" />
            </button>
            <p className={styles.caption}>{p.caption}</p>
          </li>
        ))}
      </ul>
      <dialog
        ref={dialog}
        className={styles.viewer}
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      >
        <figure>
          <img src={photo.src} alt={photo.alt} />
          <figcaption>
            <span>{photo.caption}</span>
            <span className={styles.controls}>
              {photos.length > 1 && (
                <>
                  <button type="button" onClick={() => step(-1)} aria-label="Previous photo">←</button>
                  <span>{index + 1} / {photos.length}</span>
                  <button type="button" onClick={() => step(1)} aria-label="Next photo">→</button>
                </>
              )}
              <button type="button" onClick={() => dialog.current?.close()} aria-label="Close">✕</button>
            </span>
          </figcaption>
        </figure>
      </dialog>
    </>
  );
}
