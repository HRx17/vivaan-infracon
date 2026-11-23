import Image from "next/image";
import type { Partner } from "@/lib/types";

/** Endless, smoothly scrolling strip of partner logos. Pauses on hover; static grid for reduced motion. */
export function PartnerMarquee({ partners }: { partners: Partner[] }) {
  if (!partners.length) return null;
  // repeat so one copy is always wider than the screen, then duplicate for a seamless loop
  const base = Array.from({ length: Math.max(1, Math.ceil(8 / partners.length)) }, () => partners).flat();
  const Item = ({ p, hidden }: { p: Partner; hidden?: boolean }) => (
    <li aria-hidden={hidden} className="group/item flex w-[200px] shrink-0 flex-col items-center gap-3 sm:w-[240px]">
      <div className="flex h-24 w-full items-center justify-center rounded-lg border border-line bg-white px-6 transition-all duration-500 ease-brand group-hover/item:-translate-y-1 group-hover/item:shadow-[0_18px_40px_-18px_rgba(14,27,51,.35)] sm:h-28">
        {p.logo ? (
          <Image src={p.logo} alt={hidden ? "" : p.name} width={180} height={80} className="max-h-16 w-auto object-contain grayscale transition duration-500 group-hover/item:grayscale-0 sm:max-h-20" />
        ) : (
          <span className="text-center font-heading text-lg font-extrabold text-[#0E1B33]">{p.name}</span>
        )}
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold">{p.name}</p>
        {p.role && <p className="text-xs text-muted">{p.role}</p>}
      </div>
    </li>
  );
  return (
    <div className="marquee group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div className="marquee-track flex w-max gap-6 sm:gap-10">
        <ul className="flex gap-6 sm:gap-10">{base.map((p, i) => <Item key={`a${i}`} p={p} hidden={i >= partners.length} />)}</ul>
        <ul className="flex gap-6 sm:gap-10" aria-hidden>{base.map((p, i) => <Item key={`b${i}`} p={p} hidden />)}</ul>
      </div>
    </div>
  );
}
