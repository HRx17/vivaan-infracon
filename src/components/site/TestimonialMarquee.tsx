import Image from "next/image";
import type { Testimonial } from "@/lib/types";
import { Stars } from "./Stars";

function Card({ t, hidden }: { t: Testimonial; hidden?: boolean }) {
  const initials = t.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <li aria-hidden={hidden} className="group/card w-[300px] shrink-0 sm:w-[380px]">
      <figure className="flex h-full flex-col gap-4 rounded-2xl border border-line bg-bg p-6 transition-all duration-500 ease-brand group-hover/card:-translate-y-1 group-hover/card:border-primary/40 group-hover/card:shadow-[0_24px_50px_-24px_rgba(14,27,51,.35)]">
        <div className="flex items-center justify-between">
          <Stars value={t.rating} size={18} />
          <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden className="text-primary/20"><path fill="currentColor" d="M9.5 6C6.5 7.3 4.6 9.9 4.6 13.4V18h5.6v-5.6H7.4c0-2 1.1-3.6 3.2-4.6zM19 6c-3 1.3-4.9 3.9-4.9 7.4V18h5.6v-5.6h-2.8c0-2 1.1-3.6 3.2-4.6z" /></svg>
        </div>
        <blockquote className="line-clamp-5 flex-1 text-[1.05rem] leading-relaxed text-fg">&ldquo;{t.quote}&rdquo;</blockquote>
        <figcaption className="flex items-center gap-3 border-t border-line pt-4">
          {t.photo ? (
            <Image src={t.photo} alt="" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
          ) : (
            <span aria-hidden className="flex h-11 w-11 items-center justify-center rounded-full bg-surface font-heading text-sm font-extrabold text-primary">{initials}</span>
          )}
          <span className="min-w-0">
            <span className="block truncate font-semibold">{t.name}</span>
            <span className="block truncate text-xs text-muted">{[t.detail || t.role, t.project].filter(Boolean).join(" · ")}</span>
          </span>
        </figcaption>
      </figure>
    </li>
  );
}

/** Endless strip(s) of review cards; a second row runs the other way once there are enough reviews. */
export function TestimonialMarquee({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;
  const rows = items.length >= 6 ? [items.filter((_, i) => i % 2 === 0), items.filter((_, i) => i % 2 === 1)] : [items];
  return (
    <div className="flex flex-col gap-6">
      {rows.map((row, r) => {
        const base = Array.from({ length: Math.max(1, Math.ceil(5 / row.length)) }, () => row).flat();
        return (
          <div key={r} className="marquee relative overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
            <div className={`marquee-track flex w-max gap-6 ${r === 1 ? "marquee-reverse" : ""}`} style={{ animationDuration: `${Math.max(30, base.length * 9)}s` }}>
              <ul className="flex gap-6">{base.map((t, i) => <Card key={`a${i}`} t={t} hidden={i >= row.length} />)}</ul>
              <ul className="flex gap-6" aria-hidden>{base.map((t, i) => <Card key={`b${i}`} t={t} hidden />)}</ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
