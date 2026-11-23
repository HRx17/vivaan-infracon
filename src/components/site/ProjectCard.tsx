import Link from "next/link";
import type { Project } from "@/lib/types";
import { STATUS_LABEL } from "@/lib/types";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectPlaceholder } from "./ProjectPlaceholder";
import { cn } from "@/lib/utils";
import { IconArrow } from "./Icons";

export function ProjectCard({ project, size = "md", priority = false }: { project: Project; size?: "md" | "lg"; priority?: boolean }) {
  return (
    <article className="group">
      <Link href={`/projects/${project.slug}`} className="block focus-visible:outline-offset-4">
        <Reveal variant="image" className={cn("relative overflow-hidden rounded-md", size === "lg" ? "aspect-[4/3] md:aspect-[16/10]" : "aspect-[4/3]")}>
          <div className="reveal-zoom absolute inset-0">
          {project.cover?.url ? (
          <Photo
            src={project.cover?.url}
            alt={project.cover?.alt || project.title}
            fill
            priority={priority}
            sizes={size === "lg" ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            className="transition-transform duration-[1200ms] ease-brand group-hover:scale-[1.04]"
          />
          ) : (
            <div className="absolute inset-0 transition-transform duration-[1200ms] ease-brand group-hover:scale-[1.04]">
              <ProjectPlaceholder title={project.title} />
            </div>
          )}
          </div>
          <span className="absolute left-4 top-4 rounded-sm bg-bg/90 px-2.5 py-1 text-xs font-medium text-fg backdrop-blur">
            {STATUS_LABEL[project.status]}
          </span>
        </Reveal>
        <div className="mt-5 flex items-start justify-between gap-4 border-t border-line pt-4">
          <div>
            <h3 className={cn("font-extrabold transition-colors duration-brand group-hover:text-primary", size === "lg" ? "text-2xl" : "text-xl")}>
              {project.title}
            </h3>
            <p className="mt-1 text-sm text-muted">
              {[project.category, project.location, project.year].filter(Boolean).join(" · ")}
            </p>
          </div>
          <IconArrow className="mt-1 shrink-0 text-muted transition-transform duration-brand ease-brand group-hover:translate-x-1 group-hover:text-primary" />
        </div>
      </Link>
    </article>
  );
}
