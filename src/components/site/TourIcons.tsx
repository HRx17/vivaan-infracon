import type { TourIcon } from "@/lib/tours";
const P = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;
export function TourIconSvg({ name }: { name: TourIcon }) {
  switch (name) {
    case "balcony": return <svg {...P}><path d="M4 21V9l8-5 8 5v12" /><path d="M3 15h18M7 15v6M12 15v6M17 15v6" /></svg>;
    case "sofa": return <svg {...P}><path d="M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3" /><path d="M2 13a2 2 0 0 1 4 0v2h12v-2a2 2 0 0 1 4 0v5H2z" /><path d="M5 18v2M19 18v2" /></svg>;
    case "bed": return <svg {...P}><path d="M3 18V6M3 13h18v5M21 18v-5a3 3 0 0 0-3-3h-7v3" /><circle cx="7" cy="10" r="2" /></svg>;
    case "play": return <svg {...P}><circle cx="12" cy="12" r="9" /><path d="m10 8.5 5.5 3.5-5.5 3.5z" fill="currentColor" /></svg>;
    case "shop": return <svg {...P}><path d="M4 10v10h16V10" /><path d="M3 10 5 4h14l2 6a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z" /><path d="M10 20v-5h4v5" /></svg>;
    case "gate": return <svg {...P}><path d="M3 21V7M21 21V7M3 7h18" /><path d="M7 21V11M11 21V11M15 21V11M19 21V11" /><circle cx="12" cy="4" r="1.5" /></svg>;
    case "tree": return <svg {...P}><path d="M12 21v-6" /><path d="M7 15h10a4 4 0 0 0 0-8 5 5 0 0 0-10 0 4 4 0 0 0 0 8z" /></svg>;
    case "child": return <svg {...P}><circle cx="12" cy="5" r="2" /><path d="M12 7v6M8 10l4 2 4-2M9 21l3-8 3 8" /></svg>;
    case "gym": return <svg {...P}><path d="M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12" /></svg>;
  }
}
