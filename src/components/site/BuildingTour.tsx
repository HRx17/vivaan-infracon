"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Tour, TourStop } from "@/lib/tours";
import { TourIconSvg } from "./TourIcons";

/**
 * Immersive scroll tour: the building fills the screen and stays pinned while scrolling
 * glides a "camera" between parts of it. At each stop a matching photo or video pops in.
 * Everything is driven by scroll position, so scrolling back rewinds it.
 */
const STOP_VH = 95; // scroll distance per stop

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const OVERVIEW: Pick<TourStop, "x" | "y" | "z"> = { x: 0.5, y: 0.5, z: 1 };

export function BuildingTour({
  tour,
  whatsapp,
  phone,
  detailsHref,
  headingLevel = "h2",
}: {
  tour: Tour;
  whatsapp?: string | null;
  phone?: string | null;
  detailsHref?: string;
  headingLevel?: "h1" | "h2";
}) {
  const { stops, bases } = tour;
  const N = stops.length;
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const baseEls = useRef<(HTMLDivElement | null)[]>([]);
  const popEls = useRef<(HTMLDivElement | null)[]>([]);
  const videoEls = useRef<(HTMLVideoElement | null)[]>([]);
  const marker = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const outro = useRef<HTMLDivElement>(null);
  const dots = useRef<(HTMLButtonElement | null)[]>([]);
  const skipBtn = useRef<HTMLButtonElement>(null);
  const [reduced, setReduced] = useState(false);
  const Heading = headingLevel;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setReduced(true);
    const sec = section.current!;
    let raf = 0;
    let shown = -1; // eased progress actually drawn

    const tick = () => {
      raf = 0;
      const H = window.innerHeight;
      const target = clamp(-sec.getBoundingClientRect().top / (sec.offsetHeight - H)) * (N - 1);
      shown = shown < 0 ? target : shown + (target - shown) * 0.16;
      if (Math.abs(target - shown) < 0.0008) shown = target;
      render(shown);
      if (shown !== target) raf = requestAnimationFrame(tick);
    };

    const render = (p: number) => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const mobile = W < 768;
      const rect = sec.getBoundingClientRect();

      // framed → full screen as the section arrives
      const f = clamp(rect.top / H);
      if (frame.current) {
        const ix = f * (mobile ? 4 : 8);
        frame.current.style.clipPath = `inset(${f * 12}% ${ix}% ${0}% ${ix}% round ${f * 28}px)`;
      }

      const i = Math.min(N - 2, Math.floor(p));
      const t = p - i;
      const tt = ease(clamp((t - 0.22) / 0.56)); // hold near each stop, move in between
      const A = stops[i];
      const B = stops[i + 1];

      const screenTarget = (s: TourStop) => {
        if (!s.media) return { tx: 0.5, ty: 0.5 };
        if (mobile) return { tx: 0.5, ty: 0.3 };
        return { tx: s.side === "left" ? 0.68 : 0.32, ty: 0.5 };
      };

      bases.forEach((base, b) => {
        const el = baseEls.current[b];
        if (!el) return;
        const a = A.base === b ? A : OVERVIEW;
        const c = B.base === b ? B : OVERVIEW;
        const opacity = (A.base === b ? 1 : 0) * (1 - tt) + (B.base === b ? 1 : 0) * tt;
        el.style.opacity = String(opacity);
        if (opacity < 0.001) return;
        const s0 = Math.max(W / base.w, H / base.h);
        const dw = base.w * s0;
        const dh = base.h * s0;
        const ta = A.base === b ? screenTarget(A) : { tx: 0.5, ty: 0.5 };
        const tc = B.base === b ? screenTarget(B) : { tx: 0.5, ty: 0.5 };
        const z = a.z * Math.pow(c.z / a.z, tt);
        const fx = a.x + (c.x - a.x) * tt;
        const fy = a.y + (c.y - a.y) * tt;
        const tx = (ta.tx + (tc.tx - ta.tx) * tt) * W;
        const ty = (ta.ty + (tc.ty - ta.ty) * tt) * H;
        let X = tx - z * fx * dw;
        let Y = ty - z * fy * dh;
        X = z * dw <= W ? (W - z * dw) / 2 : clamp(X, W - z * dw, 0);
        Y = z * dh <= H ? (H - z * dh) / 2 : clamp(Y, H - z * dh, 0);
        el.style.width = `${dw}px`;
        el.style.height = `${dh}px`;
        el.style.transform = `translate3d(${X}px, ${Y}px, 0) scale(${z})`;
      });

      // pop-ups appear while the camera holds on their stop
      let active = -1;
      stops.forEach((s, k) => {
        const el = popEls.current[k];
        if (!el) return;
        const v = ease(clamp(1 - (Math.abs(p - k) - 0.12) / 0.2));
        if (v > 0.5) active = k;
        el.style.opacity = String(v);
        el.style.filter = v < 1 ? `blur(${(1 - v) * 14}px)` : "none";
        el.style.transform = `${mobile ? "translateX(-50%)" : "translateY(-50%)"} translateY(${(1 - v) * 40}px) scale(${0.72 + 0.28 * v})`;
        el.style.pointerEvents = v > 0.6 ? "auto" : "none";
        const vid = videoEls.current[k];
        if (vid) {
          if (v > 0.5 && vid.paused) vid.play().catch(() => {});
          if (v < 0.2 && !vid.paused) vid.pause();
        }
      });

      if (marker.current) {
        const s = active >= 0 ? stops[active] : null;
        const tgt = s ? screenTarget(s) : null;
        const mv = active >= 0 ? ease(clamp(1 - (Math.abs(p - active) - 0.1) / 0.15)) : 0;
        marker.current.style.opacity = String(mv);
        if (tgt) marker.current.style.transform = `translate3d(${tgt.tx * W}px, ${tgt.ty * H}px, 0) translate(-50%, -50%)`;
      }
      if (intro.current) {
        const v = clamp(1 - p / 0.4);
        intro.current.style.opacity = String(v);
        intro.current.style.transform = `translateY(${(1 - v) * -40}px)`;
        intro.current.style.pointerEvents = v > 0.5 ? "auto" : "none";
      }
      if (outro.current) {
        const v = ease(clamp((p - (N - 1.35)) / 0.3));
        outro.current.style.opacity = String(v);
        outro.current.style.transform = `translateY(${(1 - v) * 40}px)`;
        outro.current.style.pointerEvents = v > 0.6 ? "auto" : "none";
      }
      if (skipBtn.current) {
        const v = p > 0.35 && p < N - 1.4 ? 1 : 0;
        skipBtn.current.style.opacity = String(v);
        skipBtn.current.style.pointerEvents = v ? "auto" : "none";
      }
      const cur = Math.round(p);
      dots.current.forEach((d, k) => d?.setAttribute("aria-current", k === cur ? "step" : "false"));
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [N, bases, stops]);

  const goTo = (k: number) => {
    const sec = section.current;
    if (!sec) return;
    const total = sec.offsetHeight - window.innerHeight;
    const top = sec.offsetTop + (k / (N - 1)) * total;
    if (window.__lenis) window.__lenis.scrollTo(top, { duration: 1.6 });
    else window.scrollTo({ top, behavior: "smooth" });
  };
  const skip = () => {
    const sec = section.current;
    if (!sec) return;
    const top = sec.offsetTop + sec.offsetHeight - 40;
    if (window.__lenis) window.__lenis.scrollTo(top, { duration: 2 });
    else window.scrollTo({ top, behavior: "smooth" });
  };

  const ctas = (
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      {whatsapp && (
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="lift inline-flex min-h-tap items-center gap-2 rounded-btn bg-[#25D366] px-6 font-semibold text-[#0b1b10]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.3-.8-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9 0-1.4.7-2 1-2.3.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.6 2.1 1.1 1 2 1.3 2.3 1.4.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.4.2.5.3.1.3.1.8-.1 1.1z" /></svg>
          WhatsApp
        </a>
      )}
      {phone && (
        <a href={phone} className="lift inline-flex min-h-tap items-center gap-2 rounded-btn border border-white/70 px-6 font-semibold text-white hover:bg-white hover:text-[#0E1B33]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>
          Call
        </a>
      )}
      {detailsHref && (
        <Link href={detailsHref} className="lift inline-flex min-h-tap items-center gap-2 rounded-btn border border-white/40 px-6 font-semibold text-white/90 hover:border-white">
          See everything →
        </Link>
      )}
    </div>
  );

  /* Reduced motion: a calm, static version with the same content */
  if (reduced) {
    return (
      <section className="bg-[#0B1222] py-section text-white">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <Heading className="text-4xl font-extrabold text-white sm:text-6xl">{tour.title}</Heading>
          <p className="mt-3 text-lg text-white/80">{tour.tagline}</p>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stops.filter((s) => s.media).map((s) => (
              <li key={s.label} className="overflow-hidden rounded-lg bg-white/5">
                {s.media!.type === "video" ? (
                  <video src={s.media!.src} poster={s.media!.poster} controls muted playsInline className="aspect-[4/3] w-full object-cover" />
                ) : (
                  <Image src={s.media!.src} alt={s.media!.alt} width={600} height={450} className="aspect-[4/3] w-full object-cover" />
                )}
                <p className="flex items-center gap-2 p-4 font-heading text-lg font-extrabold">{s.icon && <TourIconSvg name={s.icon} />}{s.label}</p>
              </li>
            ))}
          </ul>
          {ctas}
        </div>
      </section>
    );
  }

  return (
    <section ref={section} aria-label={`${tour.title}: scroll tour`} className="relative bg-[#0B1222]" style={{ height: `${N * STOP_VH}vh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div ref={frame} className="absolute inset-0 overflow-hidden bg-[#0B1222]" style={{ clipPath: "inset(12% 8% 0% 8% round 28px)" }}>
          {bases.map((b, k) => (
            <div
              key={b.src}
              ref={(el) => { baseEls.current[k] = el; }}
              className="absolute left-0 top-0 origin-top-left"
              style={{ opacity: k === 0 ? 1 : 0, willChange: "transform, opacity" }}
            >
              {/* full-resolution file on purpose: the camera zooms up to 3× */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.src} alt="" className="photo-warm h-full w-full select-none" draggable={false} decoding="async" fetchPriority={k === 0 ? "high" : "low"} />
            </div>
          ))}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,8,15,.55)_100%)]" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0B1222]/70 to-transparent" />

          {/* focus marker */}
          <div ref={marker} aria-hidden className="pointer-events-none absolute left-0 top-0 opacity-0">
            <span className="absolute -inset-6 animate-ping rounded-full border border-accent/70" />
            <span className="block h-4 w-4 rounded-full border-2 border-white bg-accent shadow-[0_0_0_6px_rgb(245_165_36/.25)]" />
          </div>

          {/* intro */}
          <div ref={intro} className="absolute inset-x-0 bottom-0 flex flex-col items-center px-4 pb-14 text-center text-white">
            <span className="rule-accent mb-5" aria-hidden />
            <Heading className="text-5xl font-extrabold text-white drop-shadow-lg sm:text-7xl">{tour.title}</Heading>
            <p className="mt-3 text-lg text-white/90 drop-shadow">{tour.tagline}</p>
            <div className="mt-8 flex flex-col items-center gap-2 text-xs font-semibold uppercase tracking-eyebrow text-white/80">
              <span className="relative flex h-10 w-6 justify-center rounded-full border-2 border-white/70">
                <span className="scroll-dot absolute top-1.5 h-2 w-1 rounded-full bg-accent" />
              </span>
              Scroll to explore
            </div>
          </div>

          {/* pop-ups */}
          {stops.map((s, k) =>
            s.media ? (
              <div
                key={k}
                ref={(el) => { popEls.current[k] = el; }}
                className={
                  "absolute w-[84vw] max-w-[460px] opacity-0 " +
                  "bottom-[7svh] left-1/2 md:bottom-auto md:top-1/2 md:w-[36vw] " +
                  (s.side === "left" ? "md:left-[6vw]" : "md:left-auto md:right-[6vw]")
                }
                style={{ willChange: "transform, opacity, filter" }}
              >
                <div className="overflow-hidden rounded-2xl bg-[#0B1222] shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)] ring-1 ring-white/15">
                  <div className={`relative ${s.media.type === "video" ? "aspect-[4/5] md:aspect-[9/13]" : "aspect-[4/3]"}`}>
                    {s.media.type === "video" ? (
                      <video
                        ref={(el) => { videoEls.current[k] = el; }}
                        src={s.media.src}
                        poster={s.media.poster}
                        muted
                        loop
                        playsInline
                        preload="none"
                        aria-label={s.media.alt}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <Image src={s.media.src} alt={s.media.alt} fill sizes="(min-width: 768px) 36vw, 84vw" className="photo-warm object-cover" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 px-5 py-4 text-white">
                    {s.icon && <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-[#0E1B33]"><TourIconSvg name={s.icon} /></span>}
                    <div>
                      <p className="font-heading text-xl font-extrabold leading-tight">{s.label}</p>
                      {s.sub && <p className="text-sm text-white/70">{s.sub}</p>}
                    </div>
                  </div>
                </div>
              </div>
            ) : null,
          )}

          {/* finale */}
          <div ref={outro} className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B1222]/55 px-4 text-center text-white opacity-0">
            <dl className="flex flex-wrap justify-center gap-x-12 gap-y-6">
              {tour.figures.map((f) => (
                <div key={f.label} className="flex flex-col-reverse items-center">
                  <dt className="text-sm font-semibold uppercase tracking-eyebrow text-white/80">{f.label}</dt>
                  <dd className="font-heading text-6xl font-extrabold tabular-nums text-white drop-shadow-lg sm:text-7xl">{f.value}</dd>
                </div>
              ))}
            </dl>
            {ctas}
          </div>

          {/* progress + skip */}
          <nav aria-label="Tour stops" className="absolute right-3 top-1/2 hidden -translate-y-1/2 flex-col gap-2 md:flex">
            {stops.map((s, k) => (
              <button
                key={k}
                ref={(el) => { dots.current[k] = el; }}
                type="button"
                onClick={() => goTo(k)}
                aria-label={s.label ?? (k === 0 ? "Start" : "Finish")}
                className="group flex h-6 w-6 items-center justify-center"
              >
                <span className="h-2 w-2 rounded-full bg-white/40 transition-all duration-300 group-hover:bg-white group-aria-[current=step]:h-5 group-aria-[current=step]:bg-accent" />
              </button>
            ))}
          </nav>
          <button ref={skipBtn} type="button" onClick={skip} style={{ opacity: 0 }} className="absolute right-4 top-4 transition-opacity duration-300 inline-flex min-h-tap items-center rounded-full bg-black/35 px-4 text-xs font-semibold text-white/90 backdrop-blur hover:bg-black/55 md:right-6 md:top-6">
            Skip tour ↓
          </button>
        </div>
      </div>
    </section>
  );
}
