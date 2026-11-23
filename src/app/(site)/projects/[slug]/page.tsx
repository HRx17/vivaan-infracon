import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, getPublishedProjects, getSettings } from "@/lib/data";
import { STATUS_LABEL } from "@/lib/types";
import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Section";
import { ContactButtons } from "@/components/site/ContactLinks";
import { IconArrow } from "@/components/site/Icons";
import { ProjectCard } from "@/components/site/ProjectCard";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProjectBySlug((await params).slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.summary,
    openGraph: p.cover ? { images: [{ url: p.cover.url, alt: p.cover.alt }] } : undefined,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const [project, settings, all] = await Promise.all([getProjectBySlug(slug), getSettings(), getPublishedProjects()]);
  if (!project) notFound();

  const others = all.filter((p) => p.id !== project.id);
  const related = [...others.filter((p) => p.status === project.status), ...others.filter((p) => p.status !== project.status)].slice(0, 3);
  const facts = [
    { label: "Status", value: STATUS_LABEL[project.status] },
    project.category && { label: "Type", value: project.category },
    project.location && { label: "Location", value: project.location },
    project.year && { label: project.status === "upcoming" ? "Timeline" : "Year", value: project.year },
    ...project.specs,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <article>
      <header className="relative flex min-h-[78svh] items-end overflow-hidden bg-secondary text-white">
        <Photo src={project.cover?.url} alt={project.cover?.alt || project.title} fill priority sizes="100vw" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0B1222]/90 via-[#0B1222]/35 to-[#0B1222]/30" />
        <Container className="relative pb-14 pt-32 md:pb-20">
          <Link href="/projects" className="mb-8 inline-flex min-h-tap items-center gap-2 text-sm text-white/85 hover:text-white">
            <IconArrow className="rotate-180" /> All projects
          </Link>
          <Reveal className="max-w-3xl">
            <div className="mb-5 flex items-center gap-4">
              <span className="rule-accent" aria-hidden />
              <p className="text-xs font-semibold uppercase tracking-eyebrow text-white/85">{STATUS_LABEL[project.status]}</p>
            </div>
            <h1 className="text-4xl font-extrabold text-white sm:text-6xl">{project.title}</h1>
            <p className="mt-5 text-lg text-white/90 md:text-xl">{project.summary}</p>
          </Reveal>
        </Container>
      </header>

      <Container className="grid gap-14 py-section lg:grid-cols-[1fr_360px] lg:gap-20">
        <Reveal>
          <div className="max-w-2xl space-y-5 text-lg leading-relaxed">
            {project.description.split(/\n{2,}/).map((para, i) => (
              <p key={i} className={i === 0 ? "text-fg" : "text-muted"}>{para}</p>
            ))}
          </div>
        </Reveal>
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <dl>
            {facts.map((f) => (
              <div key={f.label + f.value} className="flex justify-between gap-6 border-t border-line py-4">
                <dt className="text-sm text-muted">{f.label}</dt>
                <dd className="text-right font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
          <div className="border-t border-line pt-6">
            <p className="mb-4 font-heading text-lg font-extrabold">
              {project.status === "completed" ? "Want something like this?" : "Interested in this project?"}
            </p>
            <ContactButtons settings={settings} context={project.title} />
            <Link
              href={`/contact?project=${encodeURIComponent(project.title)}`}
              className="mt-4 inline-flex min-h-tap items-center gap-2 text-sm font-medium text-primary"
            >
              Send an enquiry <IconArrow />
            </Link>
          </div>
        </aside>
      </Container>

      {project.gallery.length > 0 && (
        <Container className="pb-section">
          <ul className="grid items-start gap-gap sm:grid-cols-2">
            {project.gallery.map((img, i) => {
              const wide = img.wide ?? (i === 0 || project.gallery.length === 2);
              return (
                <li key={img.url + i} className={wide ? "sm:col-span-2" : undefined}>
                  <Reveal>
                    <figure>
                      <div className="overflow-hidden rounded-md bg-surface">
                        {/* natural aspect ratio — floor plans and elevations are never cropped */}
                        <Photo
                          src={img.url}
                          alt={img.alt || `${project.title} — image ${i + 1}`}
                          width={0}
                          height={0}
                          sizes={wide ? "(min-width: 1200px) 1200px, 100vw" : "(min-width: 640px) 50vw, 100vw"}
                          style={{ width: "100%", height: "auto" }}
                        />
                      </div>
                      {img.alt && <figcaption className="mt-3 text-sm text-muted">{img.alt}</figcaption>}
                    </figure>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </Container>
      )}

      {related.length > 0 && (
        <section className="border-t border-line bg-surface py-section">
          <Container>
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-3xl font-extrabold">More projects</h2>
              <ButtonLink href="/projects">View all <IconArrow /></ButtonLink>
            </div>
            <div className="grid gap-x-gap gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
          </Container>
        </section>
      )}
    </article>
  );
}
