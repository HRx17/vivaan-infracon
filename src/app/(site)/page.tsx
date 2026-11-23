import Link from "next/link";
import type { CSSProperties } from "react";
import { getPublishedProjects, getSettings } from "@/lib/data";
import { STATUS_LABEL, STATUS_TENSE, type ProjectStatus } from "@/lib/types";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/ui/Parallax";
import { CountUp } from "@/components/ui/CountUp";
import { ScrollCue } from "@/components/site/ScrollCue";
import { Container, Section } from "@/components/ui/Section";
import { ContactButtons } from "@/components/site/ContactLinks";
import { IconArrow } from "@/components/site/Icons";
import { ProjectCard } from "@/components/site/ProjectCard";

const TIMELINE: { status: ProjectStatus; blurb: string }[] = [
  { status: "completed", blurb: "Handed over, lived in, and still standing up to inspection." },
  { status: "ongoing", blurb: "On site right now. Visits can be arranged for serious buyers." },
  { status: "upcoming", blurb: "In design and approvals. Open to land partners and early buyers." },
];

const PROCESS = [
  { n: "01", title: "Land & feasibility", body: "Title checks, soil reports and a straight answer on what the plot can carry, before anyone commits money." },
  { n: "02", title: "Design with intent", body: "Plans drawn around light, ventilation and how a family actually uses a home, not around maximising saleable area." },
  { n: "03", title: "Build in the open", body: "Monthly progress photos, clear payment milestones and a site you are welcome to visit." },
  { n: "04", title: "Handover & after", body: "Documentation in order, snag lists closed, and a builder who still picks up the phone a year later." },
];

export default async function HomePage() {
  const [settings, projects] = await Promise.all([getSettings(), getPublishedProjects()]);
  const featured = (projects.filter((p) => p.featured).length ? projects.filter((p) => p.featured) : projects).slice(0, 3);
  const counts = (s: ProjectStatus) => projects.filter((p) => p.status === s);
  const [lead, ...rest] = featured;

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-secondary text-white">
        <Parallax className="absolute inset-0">
          <div className="hero-settle absolute inset-0">
            <Photo src={settings.heroImage?.url} alt={settings.heroImage?.alt || ""} fill priority sizes="100vw" />
          </div>
        </Parallax>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0B1222]/90 via-[#0B1222]/45 to-[#0B1222]/25" />
        <Container className="relative pb-16 pt-32 md:pb-24">
          <div className="hero-stagger max-w-3xl">
            <div className="mb-6 flex items-center gap-4" style={{ "--i": 0 } as CSSProperties}>
              <span className="rule-accent" aria-hidden />
              <p className="text-xs font-semibold uppercase tracking-eyebrow text-white/85">
                {settings.ownerName} · Builder &amp; Founder
              </p>
            </div>
            <h1 className="text-[2.6rem] font-extrabold leading-[1.05] text-white sm:text-6xl md:text-7xl" style={{ "--i": 1 } as CSSProperties}>
              {settings.brandName}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/90 md:text-xl" style={{ "--i": 2 } as CSSProperties}>{settings.tagline}</p>
            <div className="mt-10 flex flex-wrap gap-3" style={{ "--i": 3 } as CSSProperties}>
              <ButtonLink href="/projects" size="lg" className="border-white bg-white !text-[#0E1B33] hover:bg-transparent hover:!text-white">
                View the work <IconArrow />
              </ButtonLink>
              <ButtonLink href="/contact" size="lg" className="border-white/80 !bg-none text-white hover:bg-white hover:!text-[#0E1B33]">
                Collaborate
              </ButtonLink>
            </div>
          </div>
        </Container>
        <ScrollCue />
      </section>

      {/* Intro + stats */}
      <Section id="about">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] md:gap-20">
          <Reveal>
            <div className="mb-5 flex items-center gap-4">
              <span className="rule-accent" aria-hidden />
              <p className="eyebrow">About</p>
            </div>
            <p className="font-heading text-2xl font-semibold leading-snug sm:text-3xl">{settings.intro}</p>
            <p className="mt-6 max-w-xl text-lg text-muted">{settings.about}</p>
            <Link href="/contact" className="mt-8 inline-flex min-h-tap items-center gap-2 font-medium text-primary hover:gap-3 transition-all duration-brand">
              Work with me <IconArrow />
            </Link>
          </Reveal>
          <div className="flex flex-col gap-8">
            {settings.portrait?.url && (
              <Reveal variant="image" className="relative aspect-[4/5] overflow-hidden rounded-md">
                <div className="reveal-zoom absolute inset-0">
                  <Photo src={settings.portrait.url} alt={settings.portrait.alt || settings.ownerName} fill sizes="(min-width: 768px) 40vw, 100vw" />
                </div>
              </Reveal>
            )}
            {settings.stats.length > 0 && (
              <dl className="grid grid-cols-3 gap-4 md:grid-cols-1 md:gap-0">
                {settings.stats.map((s, i) => (
                  <Reveal key={s.label} delay={i * 80} className="flex flex-col-reverse md:border-t md:border-line md:py-6">
                    <dt className="text-sm text-muted">{s.label}</dt>
                    <dd className="font-heading text-3xl font-extrabold tabular-nums text-fg md:text-5xl"><CountUp value={s.value} /></dd>
                  </Reveal>
                ))}
              </dl>
            )}
          </div>
        </div>
      </Section>

      {/* Featured */}
      {lead && (
        <Section
          tone="surface"
          eyebrow="Selected work"
          title="Featured projects"
          action={<ButtonLink href="/projects">All projects <IconArrow /></ButtonLink>}
        >
          <div className="grid gap-x-gap gap-y-14 lg:grid-cols-[1.6fr_1fr]">
            <Reveal><ProjectCard project={lead} size="lg" /></Reveal>
            <div className="grid gap-y-14 sm:grid-cols-2 sm:gap-x-gap lg:grid-cols-1">
              {rest.map((p, i) => (
                <Reveal key={p.id} delay={(i + 1) * 80}><ProjectCard project={p} /></Reveal>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Past / present / future */}
      <Section eyebrow="Past · Present · Future" title="A body of work, still growing" lead="Browse by stage. Each project page carries the full details and a direct line to me.">
        <div className="grid gap-10 md:grid-cols-3 md:gap-gap">
          {TIMELINE.map((t, i) => {
            const list = counts(t.status);
            return (
              <Reveal key={t.status} delay={i * 80}>
                <Card accent as="article" className="h-full">
                  <p className="eyebrow">{STATUS_TENSE[t.status]}</p>
                  <h3 className="mt-3 text-2xl font-extrabold">{STATUS_LABEL[t.status]}</h3>
                  <p className="mt-3 text-muted">{t.blurb}</p>
                  <ul className="mt-6">
                    {list.slice(0, 3).map((p) => (
                      <li key={p.id} className="border-t border-line">
                        <Link href={`/projects/${p.slug}`} className="group flex min-h-[52px] items-center justify-between gap-3 py-2">
                          <span className="font-medium group-hover:text-primary transition-colors duration-brand">{p.title}</span>
                          <span className="shrink-0 text-sm text-muted">{p.year}</span>
                        </Link>
                      </li>
                    ))}
                    {list.length === 0 && <li className="border-t border-line py-3 text-sm text-muted">More coming soon.</li>}
                  </ul>
                  <Link href={`/projects?status=${t.status}`} className="mt-4 inline-flex min-h-tap items-center gap-2 text-sm font-medium text-primary">
                    View {list.length} {list.length === 1 ? "project" : "projects"} <IconArrow />
                  </Link>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Process */}
      <Section id="process" tone="surface" eyebrow="Approach" title="How I build">
        <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-gap">
          {PROCESS.map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <Card as="li" className="h-full">
                <p className="font-heading text-sm font-semibold text-primary">{s.n}</p>
                <h3 className="mt-3 text-xl font-extrabold">{s.title}</h3>
                <p className="mt-3 text-muted">{s.body}</p>
              </Card>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* CTA */}
      <section className="py-section">
        <Container>
          <Reveal className="grid gap-10 border-y border-line py-14 md:grid-cols-[1.4fr_1fr] md:items-end md:py-20">
            <div>
              <div className="mb-5 flex items-center gap-4">
                <span className="rule-accent" aria-hidden />
                <p className="eyebrow">Buy · Invest · Partner</p>
              </div>
              <h2 className="text-3xl font-extrabold sm:text-5xl">Have land, a brief, or an eye on one of these homes?</h2>
              <p className="mt-4 max-w-xl text-lg text-muted">Message me directly. I reply to every enquiry personally, usually the same day.</p>
            </div>
            <div className="flex flex-col gap-4 md:items-end">
              <ContactButtons settings={settings} />
              <Link href="/contact" className="inline-flex min-h-tap items-center gap-2 text-sm font-medium text-primary">
                Or send a detailed enquiry <IconArrow />
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
