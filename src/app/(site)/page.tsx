import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { getApprovedTestimonials, getPublishedProjects, getSettings } from "@/lib/data";
import { STATUS_LABEL, type ProjectStatus } from "@/lib/types";
import { telLink, whatsappLink } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/ui/Parallax";
import { CountUp } from "@/components/ui/CountUp";
import { Container, Section } from "@/components/ui/Section";
import { HeroCollage, type CollageItem } from "@/components/site/HeroCollage";
import { ProjectCard } from "@/components/site/ProjectCard";
import { TestimonialMarquee } from "@/components/site/TestimonialMarquee";
import { Stars } from "@/components/site/Stars";
import { IconArrow, IconPhone, IconWhatsApp } from "@/components/site/Icons";

const I = { width: 28, height: 28, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

/* Four-step approach: an icon and a few words each, easy to read at a glance */
const APPROACH: { icon: ReactNode; title: string; line: string }[] = [
  { icon: <svg {...I}><path d="M3 20h18M5 20V9l7-5 7 5v11" /><path d="M9 20v-6h6v6" /></svg>, title: "Right land", line: "Clear titles, checked soil" },
  { icon: <svg {...I}><path d="M4 4h16v16H4z" /><path d="M4 10h16M10 10v10" /></svg>, title: "Smart design", line: "Light, air, real family life" },
  { icon: <svg {...I}><circle cx="12" cy="12" r="3" /><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /></svg>, title: "Open site", line: "Visit any time, see progress" },
  { icon: <svg {...I}><path d="M7 11V7a5 5 0 0 1 10 0v4" /><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M12 15v2" /></svg>, title: "Honest handover", line: "On time, papers in order" },
];

const STAGES: { status: ProjectStatus; icon: ReactNode; label: string }[] = [
  { status: "completed", label: "Completed", icon: <svg {...I}><path d="M20 6 9 17l-5-5" /></svg> },
  { status: "ongoing", label: "Building now", icon: <svg {...I}><path d="M2 20h20M6 20V8h12v12M10 8V4h4v4" /></svg> },
  { status: "upcoming", label: "Coming soon", icon: <svg {...I}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg> },
];

export default async function HomePage() {
  const [settings, projects, reviews] = await Promise.all([getSettings(), getPublishedProjects(), getApprovedTestimonials()]);
  const avg = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;
  const featured = (projects.filter((p) => p.featured).length ? projects.filter((p) => p.featured) : projects).slice(0, 3);
  const [lead, ...rest] = featured;
  const wa = whatsappLink(settings.whatsapp, `Hello ${settings.ownerName.split(" ")[0]}, I'd like to talk about a project with ${settings.brandName}.`);
  const s = (i: number) => ({ "--i": i }) as CSSProperties;
  // up to three project photos for the hero collage: covers first, then gallery shots
  const collage: CollageItem[] = [];
  for (const p of projects) if (p.cover?.url) collage.push({ src: p.cover.url, alt: p.cover.alt || p.title, title: p.title, href: `/projects/${p.slug}` });
  for (const p of projects) for (const g of p.gallery) if (collage.length < 3 && !g.url.includes("plan")) collage.push({ src: g.url, alt: g.alt || p.title, title: p.title, href: `/projects/${p.slug}` });

  return (
    <>
      {/* Hero: the founder, with project photos that fly into place */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface via-bg to-bg">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgb(var(--primary)/.08),transparent_45%)]" />
        <Container className="relative grid min-h-[100svh] items-center gap-12 pb-16 pt-28 md:grid-cols-[1.05fr_1fr] md:gap-8 md:pt-24">
          <div className="hero-stagger order-2 md:order-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/vivaan-logo.png" alt={settings.brandName} width={669} height={210} className="logo-themed mb-8 h-14 w-auto sm:h-16" style={s(0)} />
            <div className="mb-6 flex items-center gap-4" style={s(0)}>
              <span className="rule-accent" aria-hidden />
              <p className="eyebrow">Founder · {settings.brandName}</p>
            </div>
            <h1 className="text-[3.2rem] font-extrabold leading-[0.95] sm:text-7xl lg:text-8xl" style={s(1)}>
              {settings.ownerName.split(" ").map((w, i) => (
                <span key={i} className={i === 1 ? "block text-primary" : "block"}>{w}</span>
              ))}
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted md:text-xl" style={s(2)}>{settings.tagline}</p>
            <div className="mt-10 flex flex-wrap gap-3" style={s(3)}>
              <ButtonLink href="/projects" variant="solid" size="lg">See projects <IconArrow /></ButtonLink>
              {wa && (
                <ButtonLink href={wa} size="lg" className="!bg-none border-[#25D366] bg-[#25D366] !text-[#0b1b10] hover:brightness-110">
                  <IconWhatsApp /> WhatsApp
                </ButtonLink>
              )}
            </div>
            <dl className="mt-12 flex gap-8" style={s(4)}>
              <div className="flex flex-col-reverse"><dt className="text-xs uppercase tracking-eyebrow text-muted">Projects</dt><dd className="font-heading text-3xl font-extrabold tabular-nums">{projects.length}</dd></div>
              <div className="flex flex-col-reverse"><dt className="text-xs uppercase tracking-eyebrow text-muted">Building now</dt><dd className="font-heading text-3xl font-extrabold tabular-nums">{projects.filter((p) => p.status === "ongoing").length}</dd></div>
            </dl>
          </div>
          <div className="order-1 md:order-2">
            <HeroCollage portrait={settings.portrait} name={settings.ownerName} items={collage} />
          </div>
        </Container>
      </section>

      {/* Numbers */}
      {settings.stats.length > 0 && (
        <div className="border-b border-line">
          <Container>
            <dl className="grid grid-cols-3">
              {settings.stats.slice(0, 3).map((st, i) => (
                <Reveal key={st.label} delay={i * 100} className="flex flex-col-reverse items-center gap-1 border-line py-10 text-center [&:not(:last-child)]:border-r">
                  <dt className="text-xs font-semibold uppercase tracking-eyebrow text-muted sm:text-sm">{st.label}</dt>
                  <dd className="font-heading text-4xl font-extrabold tabular-nums text-fg sm:text-6xl"><CountUp value={st.value} /></dd>
                </Reveal>
              ))}
            </dl>
          </Container>
        </div>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="overflow-hidden py-section">
          <Container>
            <Reveal className="mb-12 flex flex-col items-center gap-4 text-center">
              <div className="flex items-center gap-4">
                <span className="rule-accent" aria-hidden />
                <p className="eyebrow">What people say</p>
                <span className="rule-accent" aria-hidden />
              </div>
              <h2 className="text-3xl font-extrabold sm:text-5xl">Trusted by owners</h2>
              <p className="flex items-center gap-2 text-muted">
                <Stars value={Math.round(avg)} size={20} />
                <span className="font-semibold text-fg">{avg.toFixed(1)}</span> · {reviews.length} review{reviews.length > 1 ? "s" : ""}
              </p>
            </Reveal>
          </Container>
          <Reveal variant="fade">
            <TestimonialMarquee items={reviews} />
          </Reveal>
          <div className="mt-10 text-center">
            <ButtonLink href="/review">Write a review</ButtonLink>
          </div>
        </section>
      )}

      {/* Projects by Vivaan Infracon */}
      {lead && (
        <Section
          tone="surface"
          eyebrow={`By ${settings.brandName}`}
          title="Projects"
          action={<ButtonLink href="/projects">All projects <IconArrow /></ButtonLink>}
        >
          <div className={rest.length ? "grid gap-x-gap gap-y-14 lg:grid-cols-[1.6fr_1fr]" : "grid"}>
            <Reveal><ProjectCard project={lead} size="lg" priority /></Reveal>
            {rest.length > 0 && (
              <div className="grid gap-y-14 sm:grid-cols-2 sm:gap-x-gap lg:grid-cols-1">
                {rest.map((p, i) => (
                  <Reveal key={p.id} delay={(i + 1) * 90}><ProjectCard project={p} /></Reveal>
                ))}
              </div>
            )}
          </div>
          <ul className="mt-14 grid grid-cols-3 gap-3 sm:gap-gap">
            {STAGES.map((st, i) => {
              const n = projects.filter((p) => p.status === st.status).length;
              return (
                <li key={st.status}>
                  <Reveal delay={i * 90}>
                    <Link href={`/projects?status=${st.status}`} className="lift group flex h-full flex-col items-center gap-2 rounded-lg border border-line bg-bg px-2 py-6 text-center hover:border-primary sm:flex-row sm:gap-4 sm:px-6 sm:text-left">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface text-primary transition-colors group-hover:bg-primary group-hover:text-primary-fg">{st.icon}</span>
                      <span>
                        <span className="block font-heading text-2xl font-extrabold tabular-nums">{n}</span>
                        <span className="block text-xs text-muted sm:text-sm">{st.label}</span>
                      </span>
                    </Link>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      {/* About + approach */}
      <Section id="about" eyebrow={`About ${settings.brandName}`} title={<>Built on trust.</>} lead={settings.about}>
        <ol className="grid grid-cols-2 gap-x-gap gap-y-10 lg:grid-cols-4">
          {APPROACH.map((a, i) => (
            <Reveal key={a.title} delay={i * 90}>
              <li className="group flex flex-col items-start gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface text-primary transition-all duration-500 ease-brand group-hover:-translate-y-1 group-hover:bg-primary group-hover:text-primary-fg">
                  {a.icon}
                </span>
                <span>
                  <span className="block font-heading text-xl font-extrabold">{a.title}</span>
                  <span className="mt-1 block text-muted">{a.line}</span>
                </span>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* Talk */}
      <section className="relative overflow-hidden bg-secondary py-section text-white">
        <div aria-hidden className="absolute inset-0 opacity-25">
          <Photo src={lead?.cover?.url} alt="" fill sizes="100vw" />
        </div>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#0B1222] via-[#0B1222]/85 to-[#0B1222]/60" />
        <Container className="relative">
          <Reveal className="max-w-2xl">
            <div className="mb-5 flex items-center gap-4">
              <span className="rule-accent" aria-hidden />
              <p className="text-xs font-semibold uppercase tracking-eyebrow text-white/80">Buy · Invest · Partner</p>
            </div>
            <h2 className="text-4xl font-extrabold text-white sm:text-6xl">Let&rsquo;s talk.</h2>
            <p className="mt-4 text-lg text-white/85">{settings.ownerName} replies personally.</p>
            <div className="mt-10 flex flex-wrap gap-3">
              {wa && (
                <ButtonLink href={wa} size="lg" className="!bg-none border-[#25D366] bg-[#25D366] !text-[#0b1b10] hover:brightness-110">
                  <IconWhatsApp /> WhatsApp
                </ButtonLink>
              )}
              {settings.phone && (
                <ButtonLink href={telLink(settings.phone)} size="lg" className="!bg-none border-white text-white hover:bg-white hover:!text-[#0E1B33]">
                  <IconPhone /> Call
                </ButtonLink>
              )}
              <ButtonLink href="/contact" size="lg" className="!bg-none border-white/50 text-white hover:border-white">
                Send a message <IconArrow />
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
