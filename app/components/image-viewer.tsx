"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import styles from "./image-viewer.module.css";

export type ViewerImage = { src: string; alt: string; caption?: string };

const HASH = /^#image-(\d+)$/;
const SKIP = "a, [data-no-viewer], .project-logo-plate, dialog";
const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

// Wraps content whose images open in the full-screen viewer.
// - Plain <img> tags (MDX, heroes) are found on mount and become keyboard targets.
// - Any element with data-viewer-src (gallery buttons, photo cards) opens that image.
// Pass `images` when the full set is known up front; otherwise the set is the
// images in the scope, in page order, once per src. `#image-N` opens image N.
export function ViewerScope({
  images,
  onClose,
  className,
  children,
}: {
  images?: ViewerImage[];
  onClose?: (src: string) => void;
  className?: string;
  children: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<{ list: ViewerImage[]; index: number; from?: HTMLElement } | null>(null);

  const list = useCallback((): ViewerImage[] => {
    if (images) return images;
    const out: ViewerImage[] = [];
    for (const el of root.current?.querySelectorAll<HTMLElement>("[data-viewer-src]") ?? []) {
      const src = el.dataset.viewerSrc!;
      if (out.some((image) => image.src === src)) continue;
      const caption = el.closest("figure")?.querySelector("figcaption")?.textContent?.trim();
      out.push({ src, alt: el.dataset.viewerAlt ?? el.getAttribute("alt") ?? "", caption: caption || undefined });
    }
    return out;
  }, [images]);

  // Mark plain images so the keyboard and the click handler can reach them.
  useEffect(() => {
    root.current?.querySelectorAll("img").forEach((img) => {
      if (img.closest(SKIP) || img.closest("button, [data-viewer-src]")) return;
      img.dataset.viewerSrc = img.getAttribute("src") ?? img.src;
      img.tabIndex = 0;
      img.setAttribute("role", "button");
      img.setAttribute("aria-haspopup", "dialog");
      img.setAttribute("aria-label", `View image: ${img.alt || "full screen"}`);
    });
    const fromHash = () => {
      const at = location.hash.match(HASH);
      const all = list();
      const index = at ? Number(at[1]) - 1 : -1;
      if (all[index]) setOpen((o) => o ?? { list: all, index });
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [list]);

  const openFrom = (el: HTMLElement) => {
    let all = list();
    let index = all.findIndex((image) => image.src === el.dataset.viewerSrc);
    if (index === -1) {
      all = [{ src: el.dataset.viewerSrc!, alt: el.dataset.viewerAlt ?? el.getAttribute("alt") ?? "" }];
      index = 0;
    }
    setOpen({ list: all, index, from: el });
  };

  return (
    <div
      ref={root}
      className={className ?? styles.scope}
      onClick={(e) => {
        const el = (e.target as HTMLElement).closest<HTMLElement>("[data-viewer-src]");
        if (el && root.current?.contains(el) && !el.closest("dialog")) openFrom(el);
      }}
      onKeyDown={(e) => {
        const el = e.target as HTMLElement;
        if (el.tagName !== "IMG" || !el.dataset.viewerSrc || (e.key !== "Enter" && e.key !== " ")) return;
        e.preventDefault();
        openFrom(el);
      }}
    >
      {children}
      {open && (
        <ImageViewer
          images={open.list}
          start={open.index}
          // The element to fly back to: the opener, or whatever shows this src now.
          origin={(src) =>
            open.from?.dataset.viewerSrc === src && open.from.isConnected
              ? open.from
              : root.current?.querySelector<HTMLElement>(`[data-viewer-src="${CSS.escape(src)}"]`) ?? undefined
          }
          onClose={(src) => {
            const back = open.from;
            setOpen(null);
            onClose?.(src);
            requestAnimationFrame(() => back?.focus({ preventScroll: true }));
          }}
        />
      )}
    </div>
  );
}

type View = { z: number; x: number; y: number };
const FIT: View = { z: 1, x: 0, y: 0 };

function ImageViewer({
  images,
  start,
  origin,
  onClose,
}: {
  images: ViewerImage[];
  start: number;
  origin: (src: string) => HTMLElement | undefined;
  onClose: (src: string) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const [index, setIndex] = useState(start);
  const [view, setView] = useState<View>(FIT);
  const count = images.length;
  const image = images[index];
  const zoomed = view.z > 1.01;

  const go = useCallback((d: number) => setIndex((i) => (i + d + count) % count), [count]);

  // Largest useful zoom: the image at its own pixel size, and never less than 2x.
  const maxZoom = () => {
    const el = img.current;
    if (!el || !el.offsetWidth) return 4;
    return Math.max(2, Math.min(8, el.naturalWidth / el.offsetWidth));
  };

  // Keep the image covering the stage edge it overflows, and centered where it fits.
  const clamp = useCallback((v: View): View => {
    const el = img.current;
    const box = stage.current?.getBoundingClientRect();
    if (!el || !box) return v;
    const mx = Math.max(0, (el.offsetWidth * v.z - box.width) / 2);
    const my = Math.max(0, (el.offsetHeight * v.z - box.height) / 2);
    return { z: v.z, x: Math.min(mx, Math.max(-mx, v.x)), y: Math.min(my, Math.max(-my, v.y)) };
  }, []);

  // Zoom to z, keeping the screen point (cx, cy) over the same image pixel.
  const zoomAt = useCallback(
    (z: number, cx?: number, cy?: number) => {
      setView((v) => {
        const el = img.current;
        if (!el) return v;
        const next = Math.min(maxZoom(), Math.max(1, z));
        if (next === 1) return FIT;
        // The image's untransformed center; the stage is its offset parent.
        const box = stage.current!.getBoundingClientRect();
        const ox = box.left + el.offsetLeft + el.offsetWidth / 2;
        const oy = box.top + el.offsetTop + el.offsetHeight / 2;
        const px = (cx ?? box.left + box.width / 2) - ox;
        const py = (cy ?? box.top + box.height / 2) - oy;
        return clamp({ z: next, x: px - ((px - v.x) * next) / v.z, y: py - ((py - v.y) * next) / v.z });
      });
    },
    [clamp],
  );

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    const src = images[index].src;
    const done = () => onClose(src);
    const el = img.current;
    const to = origin(src)?.getBoundingClientRect();
    if (reduceMotion() || !el) return done();
    dialog.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: "ease-in", fill: "forwards" });
    if (to && to.bottom > 0 && to.top < innerHeight && !zoomed) {
      el.animate([{ transform: "none" }, { transform: flight(el.getBoundingClientRect(), to) }], {
        duration: 220,
        easing: "cubic-bezier(.4, 0, .2, 1)",
        fill: "forwards",
      }).finished.then(done, done);
    } else {
      setTimeout(done, 200);
    }
  }, [images, index, onClose, origin, zoomed]);

  // Open as a modal, lock page scroll, and fly the image out of its thumbnail.
  useLayoutEffect(() => {
    const el = dialog.current!;
    el.showModal();
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const from = origin(images[start].src)?.getBoundingClientRect();
    const full = img.current;
    if (!reduceMotion()) {
      el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180, easing: "ease-out" });
      if (from && full) {
        const fly = () => full.animate([{ transform: flight(full.getBoundingClientRect(), from) }, { transform: "none" }], { duration: 280, easing: "cubic-bezier(.2, .8, .2, 1)" });
        if (full.complete) fly();
        else full.addEventListener("load", fly, { once: true });
      }
    }
    return () => {
      root.style.overflow = prev;
      el.close();
    };
    // Runs once per open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset zoom on each image, keep its thumb in view, and mirror it in the URL.
  useEffect(() => {
    setView(FIT);
    strip.current?.children[index]?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    history.replaceState(history.state, "", `#image-${index + 1}`);
  }, [index]);

  useEffect(() => () => history.replaceState(history.state, "", location.pathname + location.search), []);

  const viewRef = useRef(view);
  viewRef.current = view;

  // Pinch (ctrl + wheel) zooms around the pointer. A plain wheel zooms from fit
  // and pans once zoomed. React's wheel listener is passive, so attach by hand.
  useEffect(() => {
    const el = stage.current!;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const v = viewRef.current;
      if (!e.ctrlKey && v.z > 1.01) setView(clamp({ z: v.z, x: v.x - e.deltaX, y: v.y - e.deltaY }));
      else zoomAt(v.z * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.002)), e.clientX, e.clientY);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt, clamp]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const v = viewRef.current;
      if (e.key === "ArrowRight" && count > 1) go(1);
      else if (e.key === "ArrowLeft" && count > 1) go(-1);
      else if (e.key === "Home") setIndex(0);
      else if (e.key === "End") setIndex(count - 1);
      else if (e.key === "+" || e.key === "=") zoomAt(v.z * 1.5);
      else if (e.key === "-") zoomAt(v.z / 1.5);
      else if (e.key === "0") setView(FIT);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, count, zoomAt]);

  // Pointer gestures: drag pans when zoomed and swipes between images when not;
  // two fingers pinch; a tap on the image toggles zoom, a tap outside it closes.
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  // Pointer capture retargets pointerup to the stage, so note the target on pointerdown.
  const gesture = useRef<{ x: number; y: number; view: View; moved: boolean; dist?: number; onImage?: boolean } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    stage.current?.setPointerCapture(e.pointerId);
    stage.current?.setAttribute("data-drag", "");
    const [a, b] = [...pointers.current.values()];
    gesture.current = { x: e.clientX, y: e.clientY, view: viewRef.current, moved: false, dist: b ? Math.hypot(a.x - b.x, a.y - b.y) : undefined, onImage: e.target === img.current };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const g = gesture.current;
    if (!g || !pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const [a, b] = [...pointers.current.values()];
    if (b && g.dist) {
      g.moved = true;
      zoomAt((g.view.z * Math.hypot(a.x - b.x, a.y - b.y)) / g.dist, (a.x + b.x) / 2, (a.y + b.y) / 2);
      return;
    }
    const dx = e.clientX - g.x;
    const dy = e.clientY - g.y;
    if (Math.hypot(dx, dy) > 6) g.moved = true;
    if (g.view.z > 1.01) setView(clamp({ z: g.view.z, x: g.view.x + dx, y: g.view.y + dy }));
    else if (img.current && count > 1) img.current.style.translate = `${dx}px 0`;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const g = gesture.current;
    pointers.current.delete(e.pointerId);
    if (!g) return;
    if (pointers.current.size > 0) {
      // One finger of a pinch lifted: carry on as a pan from here.
      const [rest] = [...pointers.current.values()];
      gesture.current = { x: rest.x, y: rest.y, view: viewRef.current, moved: true };
      return;
    }
    gesture.current = null;
    stage.current?.removeAttribute("data-drag");
    if (img.current) img.current.style.translate = "";
    const dx = e.clientX - g.x;
    if (!g.moved) {
      if (g.onImage) zoomAt(zoomed ? 1 : maxZoom(), e.clientX, e.clientY);
      else if (!zoomed) close();
      return;
    }
    if (g.view.z <= 1.01 && !g.dist && count > 1 && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - g.y)) go(dx < 0 ? 1 : -1);
  };

  const caption = image.caption ?? image.alt;

  return (
    <dialog
      ref={dialog}
      className={styles.viewer}
      aria-label="Image viewer"
      onCancel={(e) => {
        e.preventDefault();
        if (zoomed) setView(FIT);
        else close();
      }}
    >
      <div className={styles.bar}>
        <span className={styles.counter} aria-live="polite">
          {count > 1 ? `${index + 1} / ${count}` : ""}
        </span>
        <div className={styles.tools}>
          <button
            type="button"
            className={styles.tool}
            onClick={() => zoomAt(zoomed ? 1 : maxZoom())}
            aria-label={zoomed ? "Fit to screen" : "Zoom to full size"}
            title={zoomed ? "Fit (0)" : "Zoom (+)"}
          >
            {zoomed ? (
              <svg viewBox="0 0 16 16"><path d="M6.5 2.5v4h-4M9.5 13.5v-4h4M2.5 2.5l4 4M13.5 13.5l-4-4" /></svg>
            ) : (
              <svg viewBox="0 0 16 16"><path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5 9 7M2.5 13.5 7 9" /></svg>
            )}
            <span className={styles.zoomLabel}>{zoomed ? `${Math.round(view.z * 100)}%` : "Fit"}</span>
          </button>
          <a className={styles.tool} href={image.src} target="_blank" rel="noreferrer" aria-label="Open original in a new tab" title="Open original">
            <svg viewBox="0 0 16 16"><path d="M9 2.5h4.5V7M13.5 2.5 7.5 8.5M12 9.5v3.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5H7" /></svg>
          </a>
          <button type="button" className={styles.tool} onClick={close} aria-label="Close viewer" title="Close (Esc)">
            <svg viewBox="0 0 16 16"><path d="m3.5 3.5 9 9M12.5 3.5l-9 9" /></svg>
          </button>
        </div>
      </div>

      <div
        ref={stage}
        className={styles.stage}
        data-zoomed={zoomed}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <img
          ref={img}
          key={image.src}
          className={styles.full}
          src={image.src}
          alt={image.alt}
          draggable={false}
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.z})` }}
        />
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
        <p className={styles.caption}>{caption}</p>
        {count > 1 && (
          <div ref={strip} className={styles.strip}>
            {images.map((entry, i) => (
              <button
                key={entry.src}
                type="button"
                className={styles.thumb}
                aria-current={i === index}
                aria-label={`Show image ${i + 1}: ${entry.alt}`}
                onClick={() => setIndex(i)}
              >
                <img src={entry.src} alt="" loading="lazy" draggable={false} />
              </button>
            ))}
          </div>
        )}
      </div>
    </dialog>
  );
}

// Transform that moves and scales box `from` onto box `to` (origin at center).
function flight(from: DOMRect, to: DOMRect) {
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  return `translate(${dx}px, ${dy}px) scale(${to.width / from.width}, ${to.height / from.height})`;
}
