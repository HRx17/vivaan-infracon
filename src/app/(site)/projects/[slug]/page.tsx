import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { getProjectBySlug, getPublishedProjects, getSettings } from "@/lib/data";
import { STATUS_LABEL } from "@/lib/types";
import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/ui/Parallax";
import { CountUp } from "@/components/ui/CountUp";
import { GalleryLightbox } from "@/components/site/GalleryLightbox";
import { ScrollCue } from "@/components/site/ScrollCue";
import { ProjectPlaceholder } from "@/components/site/ProjectPlaceholder";
import { BuildingTour } from "@/components/site/BuildingTour";
import { TOURS } from "@/lib/tours";
import { telLink, whatsappLink } from "@/lib/utils";
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

  const tour = TOURS[project.slug];
  const others = all.filter((p) => p.id !== project.id);
  const related = [...others.filter((p) => p.status === project.status), ...others.filter((p) => p.status !== project.status)].slice(0, 3);
  const amenitiesSpec = project.specs.find((s) => /^amenities$/i.test(s.label));
  const amenities = amenitiesSpec ? amenitiesSpec.value.split(/\s*[,;·]\s*/).filter(Boolean).map((a) => a[0].toUpperCase() + a.slice(1)) : [];
  const figures = project.specs.slice(0, 8).filter((s) => /^\d[\d,]*(?:\.\d+)?(?=[\s,]|$)/.test(s.value)).slice(0, 4);
  const facts = [
    { label: "Status", value: STATUS_LABEL[project.status] },
    project.category && { label: "Type", value: project.category },
    project.location && { label: "Location", value: project.location },
    project.year && { label: project.status === "upcoming" ? "Timeline" : "Year", value: project.year },
    ...project.specs.filter((s) => s !== amenitiesSpec),
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <article>
      {tour ? (
        <BuildingTour
          tour={tour}
          headingLevel="h1"
          whatsapp={whatsappLink(settings.whatsapp, `Hello, I'm interested in ${project.title}.`)}
          phone={settings.phone ? telLink(settings.phone) : null}
        />
      ) : (
      <header className="relative flex min-h-[88svh] items-end overflow-hidden bg-secondary text-white">
          <Parallax className="absolute inset-0">
            <div className="hero-settle absolute inset-0">
              {project.cover?.url ? (
                <Photo src={project.cover.url} alt={project.cover.alt || project.title} fill priority sizes="100vw" />
              ) : (
                <ProjectPlaceholder title={project.title} large />
              )}
            </div>
          </Parallax>
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0B1222]/90 via-[#0B1222]/35 to-[#0B1222]/30" />
          <Container className="relative pb-14 pt-32 md:pb-20">
            <div className="hero-stagger max-w-3xl">
              <Link href="/projects" className="mb-8 inline-flex min-h-tap items-center gap-2 text-sm text-white/85 transition-colors hover:text-white" style={{ "--i": 0 } as CSSProperties}>
                <IconArrow className="rotate-180" /> All projects
              </Link>
              <div className="mb-5 flex items-center gap-4" style={{ "--i": 1 } as CSSProperties}>
                <span className="rule-accent" aria-hidden />
                <p className="text-xs font-semibold uppercase tracking-eyebrow text-white/85">
                  {[STATUS_LABEL[project.status], project.location].filter(Boolean).join(" · ")}
                </p>
              </div>
              <h1 className="text-4xl font-extrabold text-white sm:text-6xl md:text-7xl" style={{ "--i": 2 } as CSSProperties}>{project.title}</h1>
              <p className="mt-5 text-lg text-white/90 md:text-xl" style={{ "--i": 3 } as CSSProperties}>{project.summary}</p>
            </div>
          </Container>
          <ScrollCue />
        </header>
      )}

      {!tour && figures.length > 0 && (
        <div className="border-b border-line">
          <Container>
            <dl className={`grid grid-cols-2 ${({ 3: "md:grid-cols-3", 4: "md:grid-cols-4" } as Record<number, string>)[figures.length] ?? ""}`}>
              {figures.map((f, i) => {
                const [, num, rest] = f.value.match(/^([\d,.]+)[\s,]*(.*)$/) ?? [, f.value, ""];
                return (
                  <Reveal key={f.label} delay={i * 100} className="flex flex-col-reverse gap-1 border-line py-8 pr-4 odd:border-r md:border-r md:last:border-r-0 md:pl-6 md:first:pl-0">
                    <dt className="text-sm text-muted">{f.label}{rest && <span className="block text-xs text-muted/80">{rest}</span>}</dt>
                    <dd className="font-heading text-4xl font-extrabold tabular-nums text-fg md:text-5xl"><CountUp value={num as string} /></dd>
                  </Reveal>
                );
              })}
            </dl>
          </Container>
        </div>
      )}

      <Container className="grid gap-14 py-section lg:grid-cols-[1fr_360px] lg:gap-20">
        <div className="max-w-2xl space-y-5 text-lg leading-relaxed">
          {!project.description.trim() && (
            <Reveal className="flex items-center gap-4 rounded-lg border border-line p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface text-primary" aria-hidden>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2" /><path d="m21 17-5-5-9 9" /></svg>
              </span>
              <p className="text-base text-muted">More photos and details coming soon. Ask us anything about {project.title}.</p>
            </Reveal>
          )}
          {project.description.trim() && project.description.split(/\n{2,}/).map((para, i) => (
            <Reveal key={i} delay={Math.min(i, 3) * 80}>
              <p className={i === 0 ? "text-fg" : "text-muted"}>{para}</p>
            </Reveal>
          ))}
        </div>
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <dl>
            {facts.map((f, i) => (
              <Reveal key={f.label + f.value} variant="fade" delay={Math.min(i, 10) * 45} className="flex justify-between gap-6 border-t border-line py-4">
                <dt className="shrink-0 text-sm text-muted">{f.label}</dt>
                <dd className="text-right font-medium">{f.value}</dd>
              </Reveal>
            ))}
          </dl>
          <Reveal className="border-t border-line pt-6">
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
          </Reveal>
        </aside>
      </Container>

      {amenities.length > 0 && (
        <section className="bg-surface py-section">
          <Container>
            <Reveal className="mb-10 max-w-2xl">
              <div className="mb-5 flex items-center gap-4">
                <span className="rule-accent" aria-hidden />
                <p className="eyebrow">Lifestyle</p>
              </div>
              <h2 className="text-3xl font-extrabold sm:text-4xl">Amenities</h2>
            </Reveal>
            <ul className="grid grid-cols-2 gap-x-gap sm:grid-cols-3 lg:grid-cols-4">
              {amenities.map((a, i) => (
                <li key={a}>
                  <Reveal delay={(i % 4) * 70} className="group flex min-h-[64px] items-center gap-3 border-t border-line py-4">
                    <span aria-hidden className="h-px w-4 bg-accent transition-all duration-500 ease-brand group-hover:w-8" />
                    <span className="font-medium">{a}</span>
                  </Reveal>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {project.gallery.length > 0 && (
        <Container className="py-section">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-5 flex items-center gap-4">
                <span className="rule-accent" aria-hidden />
                <p className="eyebrow">Gallery</p>
              </div>
              <h2 className="text-3xl font-extrabold sm:text-4xl">Inside {project.title}</h2>
            </div>
            <p className="text-sm text-muted">{project.gallery.length} images · tap any to enlarge</p>
          </Reveal>
          <GalleryLightbox images={project.gallery} title={project.title} />
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
              {related.map((p, i) => <Reveal key={p.id} delay={i * 90}><ProjectCard project={p} /></Reveal>)}
            </div>
          </Container>
        </section>
      )}
    </article>
  );
}
