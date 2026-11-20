import type { ViewerImage } from "app/components/image-viewer";
import styles from "./project-gallery.module.css";

// The project's images at the top of its page: one featured image, the rest as
// thumbnails below it. The page's ViewerScope opens any of them full screen.
export function ProjectGallery({ images }: { images: ViewerImage[] }) {
  const [lead, ...rest] = images;

  return (
    <div className={styles.gallery}>
      <button type="button" className={styles.lead} data-viewer-src={lead.src} data-viewer-alt={lead.alt} aria-label={`View image: ${lead.alt}`}>
        <img src={lead.src} alt={lead.alt} />
        <span className={styles.expand} aria-hidden="true">
          <svg viewBox="0 0 16 16"><path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5 9 7M2.5 13.5 7 9" /></svg>
        </span>
      </button>
      {rest.length > 0 && (
        <div className={styles.thumbs}>
          {rest.map((image) => (
            <button
              key={image.src}
              type="button"
              className={styles.thumb}
              data-viewer-src={image.src}
              data-viewer-alt={image.alt}
              aria-label={`View image: ${image.alt}`}
            >
              <img src={image.src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
