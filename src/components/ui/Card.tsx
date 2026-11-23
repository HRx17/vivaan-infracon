import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Elegant style: no boxes or shadows — a 1px top rule frames the content. */
export function Card({
  className,
  children,
  as: Tag = "div",
  accent = false,
}: {
  className?: string;
  children: ReactNode;
  as?: "div" | "article" | "li";
  accent?: boolean;
}) {
  return (
    <Tag className={cn("relative border-t border-line pt-card", className)}>
      {accent && <span aria-hidden className="absolute -top-px left-0 h-px w-12 bg-accent" />}
      {children}
    </Tag>
  );
}

/** Bordered panel — used in the admin where grouping helps scanning. */
export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-md border border-line bg-bg p-card", className)}>{children}</div>;
}
