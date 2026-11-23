"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/actions";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function AdminNav({ unread }: { unread: number }) {
  const path = usePathname();
  const items = [
    { href: "/admin", label: "Projects", active: path === "/admin" || path.startsWith("/admin/projects") },
    { href: "/admin/enquiries", label: "Enquiries", active: path.startsWith("/admin/enquiries"), badge: unread },
    { href: "/admin/settings", label: "Site settings", active: path.startsWith("/admin/settings") },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur">
      <div className="mx-auto flex max-w-container items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/admin" className="flex min-h-tap items-center gap-2 font-heading font-extrabold">
          <span aria-hidden className="h-px w-5 bg-accent" /> Admin
        </Link>
        <div className="flex items-center">
          <Link href="/" target="_blank" className="hidden min-h-tap items-center px-3 text-sm text-muted hover:text-fg sm:inline-flex">View site ↗</Link>
          <ThemeToggle />
          <form action={logout}>
            <button className="inline-flex min-h-tap items-center px-3 text-sm text-muted hover:text-fg">Sign out</button>
          </form>
        </div>
      </div>
      <nav aria-label="Admin" className="mx-auto max-w-container overflow-x-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex min-w-max gap-1">
          {items.map((i) => (
            <li key={i.href}>
              <Link
                href={i.href}
                aria-current={i.active ? "page" : undefined}
                className={cn(
                  "-mb-px inline-flex min-h-tap items-center gap-2 border-b px-3 text-sm font-medium",
                  i.active ? "border-accent text-fg" : "border-transparent text-muted hover:text-fg",
                )}
              >
                {i.label}
                {!!i.badge && <span className="rounded-sm bg-primary px-1.5 text-xs text-primary-fg">{i.badge}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
