"use client";
import { useEffect, useRef, useState } from "react";

/** Animates the leading number in a value like "48", "25+", "4,032 sq. ft." or "1M+" when it scrolls into view. */
export function CountUp({ value, duration = 1600, className }: { value: string; duration?: number; className?: string }) {
  const m = value.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/s);
  const target = m ? parseFloat(m[2].replace(/,/g, "")) : NaN;
  const decimals = m && m[2].includes(".") ? m[2].split(".")[1].length : 0;
  const grouped = !!m && m[2].includes(",");
  const [n, setN] = useState<number | null>(null);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || Number.isNaN(target) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setN(0);
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / duration);
        setN(target * (1 - Math.pow(1 - p, 4)));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [target, duration]);

  if (!m || Number.isNaN(target)) return <span className={className}>{value}</span>;
  const shown = n === null ? m[2] : grouped
    ? n.toLocaleString("en-IN", { maximumFractionDigits: decimals, minimumFractionDigits: decimals })
    : n.toFixed(decimals);
  return (
    <span ref={ref} className={className} aria-label={value}>
      <span aria-hidden>{m[1]}{shown}{m[3]}</span>
    </span>
  );
}
