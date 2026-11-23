"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type Variant = "up" | "fade" | "left" | "image";

/**
 * Animates its content the first time it scrolls into view.
 *  - up / fade / left: opacity + short travel
 *  - image: curtain reveal; wrap the photo in <div className="reveal-zoom"> for the settle-zoom
 */
export function Reveal({
  children,
  className,
  delay = 0,
  variant = "up",
  style,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: Variant;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return void el.classList.add("is-visible");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("is-visible");
            io.disconnect();
          }
        }),
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      data-reveal={variant}
      className={className}
      style={delay ? { ...style, transitionDelay: `${delay}ms` } : style}
    >
      {children}
    </div>
  );
}
