"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { IconClose, IconMenu } from "./Icons";

const LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/#about", label: "About" },
  { href: "/#process", label: "Approach" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ brand }: { brand: string }) {
  const pathname = usePathname();
  // pages that open with a full-bleed photograph get a transparent bar until scrolled
  const overlay = pathname === "/" || /^\/projects\/[^/]+$/.test(pathname);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const transparent = overlay && !scrolled && !open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-brand ease-brand",
        transparent ? "bg-transparent text-white" : "border-b border-line bg-bg/90 text-fg backdrop-blur",
      )}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:bg-bg focus:px-3 focus:py-2 focus:text-fg">
        Skip to content
      </a>
      <nav aria-label="Main" className="mx-auto flex h-[72px] max-w-container items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-h-tap items-center gap-3" aria-label={`${brand} — home`}>
          <span aria-hidden className="flex h-9 w-9 items-center justify-center border border-current font-heading text-sm font-extrabold">
            V
          </span>
          <span className="font-heading text-[1.05rem] font-extrabold tracking-tight">{brand}</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const active = l.href === "/projects" ? pathname.startsWith("/projects") : pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative inline-flex min-h-tap items-center px-3 text-sm font-medium opacity-90 hover:opacity-100",
                  active && "after:absolute after:inset-x-3 after:bottom-2 after:h-px after:bg-accent",
                )}
              >
                {l.label}
              </Link>
            );
          })}
          <span className="mx-2 h-5 w-px bg-current opacity-20" aria-hidden />
          <ThemeToggle />
          <ButtonLink
            href="/contact"
            size="sm"
            className={cn("ml-2", transparent && "border-white text-white hover:bg-white hover:text-[#0E1B33]")}
          >
            Start a conversation
          </ButtonLink>
        </div>

        <div className="flex items-center md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-tap w-tap items-center justify-center"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="h-[calc(100dvh-72px)] overflow-y-auto border-t border-line bg-bg px-4 pb-10 pt-6 text-fg md:hidden">
          <ul className="flex flex-col">
            {LINKS.map((l) => (
              <li key={l.href} className="border-b border-line">
                <Link href={l.href} className="flex min-h-[56px] items-center font-heading text-2xl font-extrabold" onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <ButtonLink href="/contact" variant="solid" size="lg" className="mt-8 w-full">
            Start a conversation
          </ButtonLink>
        </div>
      )}
    </header>
  );
}
