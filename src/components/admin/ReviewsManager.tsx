"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteTestimonial, saveTestimonial, setTestimonialApproved } from "@/app/admin/actions";
import { REVIEWER_ROLES, type Testimonial } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Card";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Stars } from "@/components/site/Stars";
import { SingleImage } from "./ImagePicker";

type Draft = Partial<Testimonial>;
const EMPTY: Draft = { name: "", role: "Home buyer", detail: "", project: "", quote: "", rating: 5, photo: "", approved: true };
const act = "inline-flex min-h-tap items-center justify-center rounded-sm border border-line bg-bg px-3 text-sm hover:border-primary hover:text-primary transition-colors";

export function ReviewsManager({ items, projects }: { items: Testimonial[]; projects: string[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const pendingList = items.filter((t) => !t.approved);
  const live = items.filter((t) => t.approved);

  const save = () => start(async () => {
    setError("");
    const r = await saveTestimonial(JSON.stringify(draft));
    if (!r.ok) return setError(r.error || "Could not save");
    setDraft(null);
    router.refresh();
  });

  const Row = ({ t }: { t: Testimonial }) => (
    <li className={cn("grid gap-3 border-t border-line bg-bg p-5", !t.approved && "border-l-2 border-l-accent")}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Stars value={t.rating} />
          <span className="font-semibold">{t.name}</span>
          <span className="text-sm text-muted">{[t.detail || t.role, t.project].filter(Boolean).join(" · ")}</span>
        </div>
        <span className="text-xs text-muted">{t.source === "website" ? "From website" : "Added by you"} · {formatDate(t.createdAt)}</span>
      </div>
      <p className="leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
      <div className="flex flex-wrap gap-1.5">
        {t.approved ? (
          <button className={act} disabled={pending} onClick={() => start(async () => { await setTestimonialApproved(t.id, false); router.refresh(); })}>Hide from website</button>
        ) : (
          <button className={cn(act, "border-success/60 text-success")} disabled={pending} onClick={() => start(async () => { await setTestimonialApproved(t.id, true); router.refresh(); })}>✓ Approve &amp; show</button>
        )}
        <button className={act} disabled={pending} onClick={() => setDraft({ ...t })}>Edit</button>
        <button className={cn(act, "hover:border-danger hover:text-danger")} disabled={pending}
          onClick={() => { if (confirm(`Delete the review by ${t.name}?`)) start(async () => { await deleteTestimonial(t.id); router.refresh(); }); }}>Delete</button>
      </div>
    </li>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Reviews</h1>
          <p className="text-muted">Only approved reviews appear on the home page. Share <b>/review</b> with your buyers to collect more.</p>
        </div>
        {!draft && <Button variant="solid" onClick={() => setDraft({ ...EMPTY })}>+ Add a review</Button>}
      </div>

      {draft && (
        <Panel className="grid gap-5">
          <h2 className="text-lg font-extrabold">{draft.id ? "Edit review" : "Add a review someone gave you"}</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" htmlFor="r-name" required><Input id="r-name" value={draft.name} onChange={(e) => set("name", e.target.value)} /></Field>
            <Field label="Rating" htmlFor="r-rating">
              <Select id="r-rating" value={draft.rating} onChange={(e) => set("rating", Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{"★".repeat(n)} ({n})</option>)}
              </Select>
            </Field>
            <Field label="Who they are" htmlFor="r-role">
              <Select id="r-role" value={draft.role} onChange={(e) => set("role", e.target.value)}>
                {REVIEWER_ROLES.map((r) => <option key={r}>{r}</option>)}
              </Select>
            </Field>
            <Field label="Project" htmlFor="r-project">
              <Select id="r-project" value={draft.project} onChange={(e) => set("project", e.target.value)}>
                <option value="">—</option>
                {projects.map((p) => <option key={p}>{p}</option>)}
              </Select>
            </Field>
            <Field label="Detail (optional)" htmlFor="r-detail" hint="e.g. 4 BHK owner, Shop owner, Project architect" className="sm:col-span-2">
              <Input id="r-detail" value={draft.detail} onChange={(e) => set("detail", e.target.value)} />
            </Field>
            <Field label="Review" htmlFor="r-quote" required className="sm:col-span-2" hint={`${draft.quote?.length ?? 0}/600 · short reviews read best`}>
              <Textarea id="r-quote" rows={4} maxLength={600} value={draft.quote} onChange={(e) => set("quote", e.target.value)} />
            </Field>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-medium">Photo (optional, only with their permission)</p>
              <div className="max-w-[200px]">
                <SingleImage value={draft.photo ? { url: draft.photo, alt: draft.name ?? "" } : null} aspect="aspect-square" label="Upload photo"
                  onChange={(v) => set("photo", v?.url ?? "")} />
              </div>
            </div>
            <Checkbox label="Show on website" checked={!!draft.approved} onChange={(e) => set("approved", e.target.checked)} />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="solid" onClick={save} disabled={pending}>{pending ? "Saving…" : "Save review"}</Button>
            <Button variant="ghost" onClick={() => setDraft(null)}>Cancel</Button>
            {error && <span className="text-sm text-danger">{error}</span>}
          </div>
        </Panel>
      )}

      {pendingList.length > 0 && (
        <section>
          <h2 className="mb-3 font-heading text-lg font-extrabold">Waiting for approval <span className="text-muted">({pendingList.length})</span></h2>
          <ul className="overflow-hidden rounded-md border-x border-b border-line">{pendingList.map((t) => <Row key={t.id} t={t} />)}</ul>
        </section>
      )}
      <section>
        <h2 className="mb-3 font-heading text-lg font-extrabold">On the website <span className="text-muted">({live.length})</span></h2>
        {live.length ? (
          <ul className="overflow-hidden rounded-md border-x border-b border-line">{live.map((t) => <Row key={t.id} t={t} />)}</ul>
        ) : (
          <p className="rounded-md border border-dashed border-line p-8 text-center text-muted">No reviews on the website yet. The reviews section on the home page appears as soon as you approve or add the first one.</p>
        )}
      </section>
    </div>
  );
}
