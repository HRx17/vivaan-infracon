"use client";
import { useTransition } from "react";
import { deleteEnquiry, updateEnquiry } from "@/app/admin/actions";
import type { Enquiry } from "@/lib/types";
import { cn, formatDate, mailtoLink, telLink, whatsappLink } from "@/lib/utils";

const act = "inline-flex min-h-tap items-center justify-center rounded-sm border border-line bg-bg px-3 text-sm hover:border-primary hover:text-primary transition-colors";

export function EnquiryItem({ e }: { e: Enquiry }) {
  const [pending, start] = useTransition();
  const wa = e.phone ? whatsappLink(e.phone.replace(/^0+/, ""), `Hello ${e.name.split(" ")[0]}, this is Nileesh from Vivaan Infracon, replying to your enquiry.`) : null;
  return (
    <li className={cn("border-t border-line bg-bg p-5", pending && "opacity-60", !e.read && "border-l-2 border-l-primary")}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-heading text-lg font-extrabold">{e.name}{!e.read && <span className="ml-2 align-middle text-xs font-semibold text-primary">NEW</span>}</p>
        <time className="text-sm text-muted" dateTime={e.createdAt}>{formatDate(e.createdAt)}</time>
      </div>
      <p className="mt-1 text-sm text-muted">{[e.interest, e.project].filter(Boolean).join(" · ")}</p>
      <p className="mt-3 whitespace-pre-line">{e.message}</p>
      <div className="mt-3 flex flex-wrap gap-x-6 text-sm">
        {e.email && <a className="inline-flex min-h-tap items-center text-primary break-all" href={mailtoLink(e.email, `Re: your enquiry${e.project ? ` about ${e.project}` : ""}`)}>{e.email}</a>}
        {e.phone && <a className="inline-flex min-h-tap items-center text-primary" href={telLink(e.phone)}>{e.phone}</a>}
        {wa && <a className="inline-flex min-h-tap items-center text-primary" href={wa} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <button className={act} disabled={pending} onClick={() => start(() => updateEnquiry(e.id, { read: !e.read }))}>{e.read ? "Mark unread" : "Mark read"}</button>
        <button className={act} disabled={pending} onClick={() => start(() => updateEnquiry(e.id, { archived: !e.archived, read: true }))}>{e.archived ? "Restore" : "Archive"}</button>
        <button className={cn(act, "hover:border-danger hover:text-danger")} disabled={pending}
          onClick={() => { if (confirm("Delete this enquiry permanently?")) start(() => deleteEnquiry(e.id)); }}>Delete</button>
      </div>
    </li>
  );
}
