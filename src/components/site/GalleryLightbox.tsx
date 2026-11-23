"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ProjectImage } from "@/lib/types";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/** Project gallery: curtain-reveal on scroll, tap any photo for a full-screen viewer (arrows, swipe, Esc). */
export function GalleryLightbox({ images, title }: { images: ProjectImage[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);

  const go = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + images.length) % images.length)), [images.length]);
  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.__lenis?.start();
      lastFocus.current?.focus();
    };
  }, [open, go, close]);

  const twoUp = images.length === 2;
  return (
    <>
      <ul className="grid items-start gap-gap sm:grid-cols-2">
        {images.map((img, i) => {
          const wide = img.wide ?? (i === 0 || twoUp);
          return (
            <li key={img.url + i} className={wide ? "sm:col-span-2" : undefined}>
              <figure>
                <button
                  type="button"
                  onClick={(e) => { lastFocus.current = e.currentTarget; setOpen(i); }}
                  className="group block w-full cursor-zoom-in text-left"
                  aria-label={`View larger: ${img.alt || `${title} image ${i + 1}`}`}
                >
                  <Reveal variant="image" className="overflow-hidden rounded-md">
                    <div className="reveal-zoom">
                      <Photo
                        src={img.url}
                        alt={img.alt || `${title} — image ${i + 1}`}
                        width={0}
                        height={0}
                        sizes={wide ? "(min-width: 1200px) 1200px, 100vw" : "(min-width: 640px) 50vw, 100vw"}
                        style={{ width: "100%", height: "auto" }}
                        className="transition-transform duration-[1200ms] ease-brand group-hover:scale-[1.025]"
                      />
                    </div>
                  </Reveal>
                </button>
                {img.alt && (
                  <Reveal variant="fade" delay={200}>
                    <figcaption className="mt-3 flex items-center gap-3 text-sm text-muted">
                      <span className="tabular-nums text-xs text-muted/80">{String(i + 1).padStart(2, "0")}</span>
                      <span className="h-px w-4 bg-line" aria-hidden />
                      {img.alt}
                    </figcaption>
                  </Reveal>
                )}
              </figure>
            </li>
          );
        })}
      </ul>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} gallery`}
          className="fixed inset-0 z-[100] flex flex-col bg-[#05080f]/95 text-white backdrop-blur-sm"
          onClick={close}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 text-sm sm:px-6" onClick={(e) => e.stopPropagation()}>
            <span className="tabular-nums text-white/70">{open + 1} / {images.length}</span>
            <button ref={closeRef} type="button" onClick={close} className="inline-flex h-tap w-tap items-center justify-center rounded-btn hover:bg-white/10" aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
          </div>
          <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
            <div key={open} className="lb-in absolute inset-0 mx-4 sm:mx-20">
              <Image src={images[open].url} alt={images[open].alt || title} fill sizes="100vw" className="object-contain" priority />
            </div>
            {images.length > 1 && (["prev", "next"] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => go(dir === "next" ? 1 : -1)}
                aria-label={dir === "next" ? "Next image" : "Previous image"}
                className={cn(
                  "absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 transition-colors hover:bg-white hover:text-[#0E1B33] sm:inline-flex",
                  dir === "next" ? "right-4" : "left-4",
                )}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden className={dir === "prev" ? "rotate-180" : undefined}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </button>
            ))}
          </div>
          <p className="px-4 pb-5 pt-3 text-center text-sm text-white/80 sm:px-6" onClick={(e) => e.stopPropagation()}>
            {images[open].alt}
            {images.length > 1 && <span className="ml-2 text-white/50 sm:hidden">· swipe for more</span>}
          </p>
        </div>
      )}
    </>
  );
}
