import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedProjects } from "@/lib/data";
import { STATUS_LABEL, type ProjectStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Section";
import { ProjectCard } from "@/components/site/ProjectCard";

export const metadata: Metadata = { title: "Projects", description: "Completed, ongoing and upcoming projects by Vivaan Infracon." };

const FILTERS: { key: ProjectStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "completed", label: STATUS_LABEL.completed },
  { key: "ongoing", label: STATUS_LABEL.ongoing },
  { key: "upcoming", label: STATUS_LABEL.upcoming },
];

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const active = (FILTERS.find((f) => f.key === status)?.key ?? "all") as ProjectStatus | "all";
  const all = await getPublishedProjects();
  const list = active === "all" ? all : all.filter((p) => p.status === active);

  return (
    <div className="pb-section pt-32 md:pt-40">
      <Container>
        <Reveal className="max-w-3xl">
          <div className="mb-5 flex items-center gap-4">
            <span className="rule-accent" aria-hidden />
            <p className="eyebrow">Portfolio</p>
          </div>
          <h1 className="text-4xl font-extrabold sm:text-6xl">Projects</h1>
          <p className="mt-5 text-lg text-muted">
            Homes and buildings I have delivered, the sites I am on today, and what is next on the drawing board.
          </p>
        </Reveal>

        <nav aria-label="Filter projects" className="-mx-4 mt-12 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
          <ul className="flex min-w-max gap-2">
            {FILTERS.map((f) => {
              const n = f.key === "all" ? all.length : all.filter((p) => p.status === f.key).length;
              const on = f.key === active;
              return (
                <li key={f.key}>
                  <Link
                    href={f.key === "all" ? "/projects" : `/projects?status=${f.key}`}
                    aria-current={on ? "page" : undefined}
                    scroll={false}
                    className={cn(
                      "relative -mb-px inline-flex min-h-[52px] items-center gap-2 border-b px-3 text-sm font-medium transition-colors duration-brand",
                      on ? "border-accent text-fg" : "border-transparent text-muted hover:text-fg",
                    )}
                  >
                    {f.label} <span className="text-xs text-muted">{n}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {list.length ? (
          <div className="mt-12 grid gap-x-gap gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 80}>
                <ProjectCard project={p} priority={i < 3} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-16 text-muted">Nothing here yet — check back soon.</p>
        )}
      </Container>
    </div>
  );
}
