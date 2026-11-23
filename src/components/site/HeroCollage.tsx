import Link from "next/link";
import type { CSSProperties } from "react";
import { Photo } from "@/components/ui/Photo";
import { Parallax } from "@/components/ui/Parallax";

export interface CollageItem { src: string; alt: string; title: string; href: string }

/**
 * Founder portrait in the centre with project photos that fly in, tilt into place,
 * then float gently and drift apart a little on scroll.
 */
const SLOTS: { cls: string; aspect: string; from: string; rot: number; speed: number; delay: number }[] = [
  { cls: "left-0 top-[4%] w-[44%] z-10", aspect: "aspect-[4/5]", from: "-60vw, -10vh", rot: -7, speed: -0.06, delay: 450 },
  { cls: "right-0 top-0 w-[38%] z-10", aspect: "aspect-[4/5]", from: "50vw, -30vh", rot: 6, speed: -0.12, delay: 600 },
  { cls: "-bottom-[2%] -right-[3%] w-[40%] z-30", aspect: "aspect-[4/3]", from: "40vw, 40vh", rot: -3, speed: 0.08, delay: 750 },
];

export function HeroCollage({ portrait, name, items }: { portrait?: { url: string; alt: string } | null; name: string; items: CollageItem[] }) {
  const initials = name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="relative mx-auto aspect-[1/1.05] w-full max-w-[560px]">
      {items.slice(0, 3).map((it, i) => {
        const s = SLOTS[i];
        return (
          <Parallax key={it.src} speed={s.speed} className={`absolute ${s.cls}`}>
            <div className="collage-in" style={{ "--from": s.from, "--rot": `${s.rot}deg`, "--d": `${s.delay}ms` } as CSSProperties}>
              <div className="collage-float" style={{ "--fd": `${i * -2.3}s` } as CSSProperties}>
                <Link href={it.href} className="group block" aria-label={`Open ${it.title}`}>
                  <div className={`relative ${s.aspect} overflow-hidden rounded-2xl bg-surface shadow-[0_30px_60px_-25px_rgba(14,27,51,.45)] ring-4 ring-bg transition-transform duration-500 ease-brand group-hover:-translate-y-1 group-hover:scale-[1.03]`}>
                    <Photo src={it.src} alt={it.alt} fill sizes="(min-width: 768px) 260px, 45vw" className="transition-transform duration-700 ease-brand group-hover:scale-105" />
                    <span className="absolute bottom-2 left-2 rounded-full bg-bg/90 px-2.5 py-1 text-[11px] font-semibold text-fg backdrop-blur">{it.title}</span>
                  </div>
                </Link>
              </div>
            </div>
          </Parallax>
        );
      })}

      {/* founder portrait */}
      <div className="absolute left-1/2 top-1/2 z-20 w-[54%] -translate-x-1/2 -translate-y-[46%]">
        <div className="collage-in" style={{ "--from": "0px, 12vh", "--rot": "0deg", "--d": "250ms" } as CSSProperties}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-secondary shadow-[0_40px_80px_-30px_rgba(14,27,51,.6)] ring-[6px] ring-bg">
            {portrait?.url ? (
              <Photo src={portrait.url} alt={portrait.alt || name} fill priority sizes="(min-width: 768px) 300px, 55vw" />
            ) : (
              <div aria-hidden className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-secondary via-[#13306b] to-[#0B1222] text-white">
                <span className="font-heading text-7xl font-extrabold tracking-tight">{initials}</span>
                <span className="mt-3 h-px w-10 bg-accent" />
              </div>
            )}
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent" />
            <p className="absolute bottom-3 left-4 right-4 hidden text-white sm:block">
              <span className="block font-heading text-lg font-extrabold leading-tight">{name}</span>
              <span className="block text-xs text-white/80">Founder</span>
            </p>
          </div>
        </div>
      </div>

      {/* soft accent shapes */}
      <span aria-hidden className="collage-in absolute -left-6 bottom-[18%] -z-0 h-28 w-28 rounded-full bg-accent/15 blur-2xl" style={{ "--from": "0px, 0px", "--rot": "0deg", "--d": "900ms" } as CSSProperties} />
      <span aria-hidden className="collage-in absolute -right-4 top-[30%] -z-0 h-40 w-40 rounded-full bg-primary/15 blur-3xl" style={{ "--from": "0px, 0px", "--rot": "0deg", "--d": "1000ms" } as CSSProperties} />
    </div>
  );
}
