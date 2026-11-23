"use client";
import Link from "next/link";
import { useTransition } from "react";
import { deleteProject, moveProject, setProjectVisibility, toggleFeatured } from "@/app/admin/actions";
import type { Project } from "@/lib/types";
import { STATUS_LABEL } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Photo } from "@/components/ui/Photo";

const act = "inline-flex min-h-tap min-w-tap items-center justify-center rounded-sm border border-line bg-bg px-3 text-sm hover:border-primary hover:text-primary transition-colors disabled:opacity-40";
const VIS_STYLE = {
  published: "border-success/50 text-success",
  draft: "border-line text-muted",
  archived: "border-line text-muted line-through",
};

export function ProjectRow({ p, first, last }: { p: Project; first: boolean; last: boolean }) {
  const [pending, start] = useTransition();
  const run = (fn: () => Promise<unknown>) => start(async () => { await fn(); });

  return (
    <li className={cn("flex flex-col gap-4 border-t border-line bg-bg p-4 sm:flex-row sm:items-center", pending && "opacity-60")}>
      <Link href={`/admin/projects/${p.id}`} className="flex flex-1 items-center gap-4 min-w-0">
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-sm bg-surface">
          <Photo src={p.cover?.url} alt="" fill sizes="96px" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-heading font-extrabold">
            {p.featured && <span className="mr-1 text-accent" aria-label="Featured">★</span>}{p.title}
          </p>
          <p className="truncate text-sm text-muted">{[STATUS_LABEL[p.status], p.category, p.location].filter(Boolean).join(" · ")}</p>
          <span className={cn("mt-1 inline-block rounded-sm border px-1.5 text-xs capitalize", VIS_STYLE[p.visibility])}>{p.visibility}</span>
        </div>
      </Link>
      <div className="flex flex-wrap gap-1.5">
        <button className={act} aria-label={`Move ${p.title} up`} disabled={first || pending} onClick={() => run(() => moveProject(p.id, -1))}>↑</button>
        <button className={act} aria-label={`Move ${p.title} down`} disabled={last || pending} onClick={() => run(() => moveProject(p.id, 1))}>↓</button>
        <button className={act} disabled={pending} onClick={() => run(() => toggleFeatured(p.id))}>{p.featured ? "Unfeature" : "Feature"}</button>
        {p.visibility !== "published" && (
          <button className={act} disabled={pending} onClick={() => run(() => setProjectVisibility(p.id, "published"))}>Publish</button>
        )}
        {p.visibility === "published" && (
          <button className={act} disabled={pending} onClick={() => run(() => setProjectVisibility(p.id, "draft"))}>Hide</button>
        )}
        {p.visibility !== "archived" ? (
          <button className={act} disabled={pending} onClick={() => run(() => setProjectVisibility(p.id, "archived"))}>Archive</button>
        ) : (
          <button className={cn(act, "hover:border-danger hover:text-danger")} disabled={pending}
            onClick={() => { if (confirm(`Delete “${p.title}” and its photos permanently? This can't be undone.`)) run(() => deleteProject(p.id)); }}>
            Delete
          </button>
        )}
        <Link href={`/admin/projects/${p.id}`} className={cn(act, "border-primary text-primary")}>Edit</Link>
      </div>
    </li>
  );
}
