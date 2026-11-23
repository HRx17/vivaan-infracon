import Link from "next/link";
import { getAllProjects } from "@/lib/data";
import type { Visibility } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { ProjectRow } from "@/components/admin/ProjectRow";

const TABS: { key: "active" | Visibility; label: string }[] = [
  { key: "active", label: "Active" },
  { key: "published", label: "Published" },
  { key: "draft", label: "Drafts" },
  { key: "archived", label: "Archived" },
];

export default async function AdminProjects({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { view } = await searchParams;
  const tab = TABS.find((t) => t.key === view)?.key ?? "active";
  const all = await getAllProjects();
  const match = (v: Visibility) => (tab === "active" ? v !== "archived" : v === tab);
  const list = all.filter((p) => match(p.visibility));
  const isSample = all.some((p) => p.cover?.url.includes("images.unsplash.com"));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Projects</h1>
          <p className="text-muted">Order here is the order on the website. ★ = shown on the home page.</p>
        </div>
        <ButtonLink href="/admin/projects/new" variant="solid">+ New project</ButtonLink>
      </div>

      {isSample && (
        <p className="border-l-2 border-accent bg-bg px-4 py-3 text-sm">
          The projects and photos here are samples so you can see the design. Replace them with your real work, or archive and then delete them. The home page photo is under Site settings.
        </p>
      )}

      <nav aria-label="Filter" className="flex gap-1 overflow-x-auto border-b border-line">
        {TABS.map((t) => {
          const n = all.filter((p) => (t.key === "active" ? p.visibility !== "archived" : p.visibility === t.key)).length;
          return (
            <Link key={t.key} href={t.key === "active" ? "/admin" : `/admin?view=${t.key}`} aria-current={tab === t.key ? "page" : undefined}
              className={cn("-mb-px inline-flex min-h-tap items-center gap-1.5 border-b px-3 text-sm font-medium",
                tab === t.key ? "border-accent text-fg" : "border-transparent text-muted hover:text-fg")}>
              {t.label} <span className="text-xs text-muted">{n}</span>
            </Link>
          );
        })}
      </nav>

      {list.length ? (
        <ul className="overflow-hidden rounded-md border-b border-x border-line">
          {list.map((p, i) => <ProjectRow key={p.id} p={p} first={i === 0} last={i === list.length - 1} />)}
        </ul>
      ) : (
        <p className="py-10 text-center text-muted">No projects here.</p>
      )}
    </div>
  );
}
