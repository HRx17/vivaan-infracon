"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/** Thin accent bar at the top of the screen from the moment an internal link is clicked until the new page arrives. */
export function NavigationProgress() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  useEffect(() => {
    setState((s) => (s === "loading" ? "done" : s));
    const t = setTimeout(() => setState((s) => (s === "done" ? "idle" : s)), 600);
    return () => clearTimeout(t);
  }, [pathname, search]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return;
      setState("loading");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[95] h-[3px] bg-accent shadow-[0_0_10px_rgb(var(--accent)/.6)]"
      style={{
        width: state === "idle" ? 0 : state === "loading" ? "85%" : "100%",
        opacity: state === "done" ? 0 : 1,
        transition:
          state === "loading" ? "width 8s cubic-bezier(.1,.75,.2,1)" : state === "done" ? "width 200ms ease, opacity 400ms ease 250ms" : "none",
      }}
    />
  );
}
