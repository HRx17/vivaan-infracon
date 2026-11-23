import type { SiteSettings } from "@/lib/types";
import { mailtoLink, telLink, whatsappLink } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { IconMail, IconPhone, IconWhatsApp } from "./Icons";

/** Direct contact buttons. Only shows channels that are filled in under Admin → Settings. */
export function ContactButtons({
  settings,
  context,
  className,
}: {
  settings: SiteSettings;
  context?: string;
  className?: string;
}) {
  const text = context
    ? `Hello ${settings.ownerName.split(" ")[0]}, I'm interested in ${context}.`
    : `Hello ${settings.ownerName.split(" ")[0]}, I'd like to talk about a project with ${settings.brandName}.`;
  const wa = whatsappLink(settings.whatsapp, text);
  return (
    <div className={className ?? "flex flex-wrap gap-3"}>
      {wa && (
        <ButtonLink href={wa} variant="solid">
          <IconWhatsApp /> WhatsApp
        </ButtonLink>
      )}
      {settings.email && (
        <ButtonLink href={mailtoLink(settings.email, context ? `Enquiry: ${context}` : `Enquiry for ${settings.brandName}`)} variant={wa ? "outline" : "solid"}>
          <IconMail /> Email
        </ButtonLink>
      )}
      {settings.phone && (
        <ButtonLink href={telLink(settings.phone)} variant="outline">
          <IconPhone /> Call
        </ButtonLink>
      )}
    </div>
  );
}
