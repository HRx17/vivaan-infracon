import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { mailtoLink, telLink, whatsappLink } from "@/lib/utils";
import { Container } from "@/components/ui/Section";

export function Footer({ settings }: { settings: SiteSettings }) {
  const wa = whatsappLink(settings.whatsapp);
  const year = new Date().getFullYear();
  const linkCls = "inline-flex min-h-tap items-center text-muted hover:text-fg transition-colors duration-brand";
  return (
    <footer className="border-t border-line">
      <Container className="grid gap-10 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-heading text-2xl font-extrabold">{settings.brandName}</p>
          <p className="mt-3 max-w-sm text-muted">{settings.tagline}</p>
          <span className="rule-accent mt-6" aria-hidden />
        </div>
        <div>
          <p className="eyebrow mb-3">Explore</p>
          <ul>
            <li><Link className={linkCls} href="/projects?status=completed">Completed work</Link></li>
            <li><Link className={linkCls} href="/projects?status=ongoing">Under construction</Link></li>
            <li><Link className={linkCls} href="/projects?status=upcoming">Upcoming</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-3">Contact</p>
          <ul>
            {settings.email && <li><a className={`${linkCls} break-all`} href={mailtoLink(settings.email)}>{settings.email}</a></li>}
            {settings.phone && <li><a className={linkCls} href={telLink(settings.phone)}>{settings.phone}</a></li>}
            {wa && <li><a className={linkCls} href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>}
            {settings.instagram && <li><a className={linkCls} href={settings.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>}
            {settings.linkedin && <li><a className={linkCls} href={settings.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>}
            {settings.address && <li className="pt-2 text-muted whitespace-pre-line">{settings.address}</li>}
          </ul>
        </div>
      </Container>
      <Container className="flex flex-col gap-2 border-t border-line py-6 text-sm text-muted sm:flex-row sm:justify-between">
        <p>© {year} {settings.brandName}. Built by {settings.ownerName}.</p>
        <Link href="/admin" className="inline-flex min-h-tap items-center hover:text-fg sm:min-h-0">Admin</Link>
      </Container>
    </footer>
  );
}
