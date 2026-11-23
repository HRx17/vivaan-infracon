import Link from "next/link";
import { getEnquiries } from "@/lib/data";
import { cn } from "@/lib/utils";
import { EnquiryItem } from "@/components/admin/EnquiryItem";

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const archivedView = (await searchParams).view === "archived";
  const all = await getEnquiries();
  const list = all.filter((e) => e.archived === archivedView);
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold">Enquiries</h1>
        <p className="text-muted">Messages sent through the contact form. WhatsApp and email messages go straight to you.</p>
      </div>
      <nav aria-label="Filter" className="flex gap-1 border-b border-line">
        {[{ k: false, l: "Inbox", href: "/admin/enquiries" }, { k: true, l: "Archived", href: "/admin/enquiries?view=archived" }].map((t) => (
          <Link key={t.l} href={t.href} aria-current={archivedView === t.k ? "page" : undefined}
            className={cn("-mb-px inline-flex min-h-tap items-center gap-1.5 border-b px-3 text-sm font-medium",
              archivedView === t.k ? "border-accent text-fg" : "border-transparent text-muted hover:text-fg")}>
            {t.l} <span className="text-xs text-muted">{all.filter((e) => e.archived === t.k).length}</span>
          </Link>
        ))}
      </nav>
      {list.length ? (
        <ul className="overflow-hidden rounded-md border-x border-b border-line">{list.map((e) => <EnquiryItem key={e.id} e={e} />)}</ul>
      ) : (
        <p className="py-10 text-center text-muted">{archivedView ? "Nothing archived." : "No enquiries yet. They'll appear here as soon as someone uses the contact form."}</p>
      )}
    </div>
  );
}
