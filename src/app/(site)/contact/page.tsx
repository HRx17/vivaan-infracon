import type { Metadata } from "next";
import { getPublishedProjects, getSettings } from "@/lib/data";
import { mailtoLink, telLink, whatsappLink } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Section";
import { ContactButtons } from "@/components/site/ContactLinks";
import { ContactForm } from "@/components/site/ContactForm";

export const metadata: Metadata = { title: "Contact", description: "Talk to Nileesh Baldha about buying, building or partnering with Vivaan Infracon." };

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ project?: string }> }) {
  const { project } = await searchParams;
  const [settings, projects] = await Promise.all([getSettings(), getPublishedProjects()]);
  const wa = whatsappLink(settings.whatsapp);
  const rows = [
    settings.email && { label: "Email", value: settings.email, href: mailtoLink(settings.email) },
    settings.phone && { label: "Phone", value: settings.phone, href: telLink(settings.phone) },
    wa && { label: "WhatsApp", value: settings.whatsapp.startsWith("+") ? settings.whatsapp : `+${settings.whatsapp}`, href: wa },
    settings.address && { label: "Office", value: settings.address },
  ].filter(Boolean) as { label: string; value: string; href?: string }[];

  return (
    <div className="pb-section pt-32 md:pt-40">
      <Container className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
        <Reveal>
          <div className="mb-5 flex items-center gap-4">
            <span className="rule-accent" aria-hidden />
            <p className="eyebrow">Contact</p>
          </div>
          <h1 className="text-4xl font-extrabold sm:text-6xl">Let&rsquo;s build something worth keeping.</h1>
          <p className="mt-6 max-w-md text-lg text-muted">
            Buyers, landowners, investors and fellow builders — reach me directly, or leave the details and I&rsquo;ll come back to you.
          </p>
          <ContactButtons settings={settings} context={project} className="mt-8 flex flex-wrap gap-3" />
          <dl className="mt-12">
            {rows.map((r) => (
              <div key={r.label} className="flex flex-col gap-1 border-t border-line py-4 sm:flex-row sm:justify-between sm:gap-6">
                <dt className="text-sm text-muted">{r.label}</dt>
                <dd className="font-medium sm:text-right">
                  {r.href ? (
                    <a href={r.href} className="break-all hover:text-primary" {...(r.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{r.value}</a>
                  ) : (
                    <span className="whitespace-pre-line">{r.value}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal delay={80} className="relative lg:pt-4">
          <h2 className="mb-8 text-2xl font-extrabold">Send an enquiry</h2>
          <ContactForm project={project} projects={projects.map((p) => p.title)} />
        </Reveal>
      </Container>
    </div>
  );
}
