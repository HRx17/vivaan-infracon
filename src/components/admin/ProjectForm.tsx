"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveProject } from "@/app/admin/actions";
import type { Project, ProjectSpec, ProjectStatus, Visibility } from "@/lib/types";
import { STATUS_LABEL } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Card";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Gallery, SingleImage } from "./ImagePicker";

type Draft = Omit<Project, "id" | "order" | "createdAt" | "updatedAt"> & { id?: string };

const EMPTY: Draft = {
  slug: "", title: "", status: "completed", category: "", location: "", year: "", summary: "", description: "",
  cover: null, gallery: [], specs: [{ label: "", value: "" }], featured: false, visibility: "draft",
};
const CATEGORIES = ["Residential", "Villas", "Commercial", "Mixed use", "Plotted development", "Industrial", "Hospitality", "Institutional"];

export function ProjectForm({ initial, justCreated }: { initial?: Project; justCreated?: boolean }) {
  const router = useRouter();
  const [d, setD] = useState<Draft>(initial ? { ...initial } : EMPTY);
  const [slugTouched, setSlugTouched] = useState(!!initial);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(justCreated ? "Project created" : "");
  const [pending, start] = useTransition();
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => { setSaved(""); setD((x) => ({ ...x, [k]: v })); };

  function submit(visibility?: Visibility) {
    setError("");
    const payload = { ...d, visibility: visibility ?? d.visibility };
    start(async () => {
      const res = await saveProject(JSON.stringify(payload));
      if (!res.ok) return setError(res.error || "Could not save");
      setD((x) => ({ ...x, visibility: payload.visibility, id: res.id }));
      setSaved("Saved");
      if (!initial) router.replace(`/admin/projects/${res.id}?created=1`);
      else router.refresh();
    });
  }

  const setSpec = (i: number, patch: Partial<ProjectSpec>) => set("specs", d.specs.map((s, k) => (k === i ? { ...s, ...patch } : s)));

  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/admin" className="inline-flex min-h-tap items-center text-sm text-muted hover:text-fg">← All projects</Link>
          <h1 className="text-3xl font-extrabold">{initial ? d.title || "Untitled" : "New project"}</h1>
        </div>
        {initial && d.visibility === "published" && (
          <Link href={`/projects/${d.slug}`} target="_blank" className="inline-flex min-h-tap items-center text-sm text-primary">View live page ↗</Link>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-6">
          <Panel className="grid gap-5">
            <h2 className="text-lg font-extrabold">Details</h2>
            <Field label="Title" htmlFor="title" required>
              <Input id="title" value={d.title} required maxLength={140}
                onChange={(e) => { set("title", e.target.value); if (!slugTouched) set("slug", slugify(e.target.value)); }} />
            </Field>
            <Field label="Web address" htmlFor="slug" hint={<>yoursite.com/projects/<b>{d.slug || slugify(d.title) || "…"}</b></>}>
              <Input id="slug" value={d.slug} onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Category" htmlFor="category">
                <Input id="category" list="categories" value={d.category} onChange={(e) => set("category", e.target.value)} placeholder="Residential" />
                <datalist id="categories">{CATEGORIES.map((c) => <option key={c} value={c} />)}</datalist>
              </Field>
              <Field label="Location" htmlFor="location">
                <Input id="location" value={d.location} onChange={(e) => set("location", e.target.value)} placeholder="City, State" />
              </Field>
              <Field label={d.status === "upcoming" ? "Timeline" : "Year"} htmlFor="year">
                <Input id="year" value={d.year} onChange={(e) => set("year", e.target.value)} placeholder={d.status === "upcoming" ? "Launching 2027" : "2024"} />
              </Field>
            </div>
            <Field label="Short summary" htmlFor="summary" hint={`Shown on cards and as the page subtitle. ${d.summary.length}/400`}>
              <Textarea id="summary" rows={2} className="min-h-[80px]" maxLength={400} value={d.summary} onChange={(e) => set("summary", e.target.value)} />
            </Field>
            <Field label="Full description" htmlFor="description" hint="Leave a blank line between paragraphs.">
              <Textarea id="description" rows={9} value={d.description} onChange={(e) => set("description", e.target.value)} />
            </Field>
          </Panel>

          <Panel className="grid gap-5">
            <div>
              <h2 className="text-lg font-extrabold">Cover photo</h2>
              <p className="text-sm text-muted">The large image at the top of the project page and on cards. Landscape works best.</p>
            </div>
            <SingleImage value={d.cover} onChange={(v) => set("cover", v)} label="Upload cover photo" />
          </Panel>

          <Panel className="grid gap-5">
            <div>
              <h2 className="text-lg font-extrabold">Gallery</h2>
              <p className="text-sm text-muted">Every 3rd photo is shown full-width. Use the arrows to reorder.</p>
            </div>
            <Gallery value={d.gallery} onChange={(v) => set("gallery", v)}
              onMakeCover={(img) => {
                setSaved("");
                setD((x) => ({ ...x, cover: img, gallery: [...x.gallery.filter((g) => g.url !== img.url), ...(x.cover ? [x.cover] : [])] }));
              }} />
          </Panel>

          <Panel className="grid gap-4">
            <div>
              <h2 className="text-lg font-extrabold">Key facts</h2>
              <p className="text-sm text-muted">e.g. Built-up area · 62,000 sq. ft., Configuration · 3 & 4 BHK, RERA no., Progress.</p>
            </div>
            {d.specs.map((s, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <Input aria-label={`Fact ${i + 1} label`} placeholder="Label" value={s.label} onChange={(e) => setSpec(i, { label: e.target.value })} />
                <Input aria-label={`Fact ${i + 1} value`} placeholder="Value" value={s.value} onChange={(e) => setSpec(i, { value: e.target.value })} />
                <button type="button" aria-label={`Remove fact ${i + 1}`} className="h-tap w-tap rounded-sm border border-line text-muted hover:text-danger"
                  onClick={() => set("specs", d.specs.filter((_, k) => k !== i))}>×</button>
              </div>
            ))}
            <Button type="button" size="sm" variant="ghost" className="justify-self-start" onClick={() => set("specs", [...d.specs, { label: "", value: "" }])}>
              + Add fact
            </Button>
          </Panel>
        </div>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-32 lg:self-start">
          <Panel className="grid gap-5">
            <Field label="Stage" htmlFor="status" hint="Past, present or future work.">
              <Select id="status" value={d.status} onChange={(e) => set("status", e.target.value as ProjectStatus)}>
                {(Object.keys(STATUS_LABEL) as ProjectStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
              </Select>
            </Field>
            <Field label="Visibility" htmlFor="visibility">
              <Select id="visibility" value={d.visibility} onChange={(e) => set("visibility", e.target.value as Visibility)}>
                <option value="published">Published — visible on site</option>
                <option value="draft">Draft — hidden</option>
                <option value="archived">Archived — hidden, kept for records</option>
              </Select>
            </Field>
            <Checkbox label="Feature on the home page" checked={d.featured} onChange={(e) => set("featured", e.target.checked)} />
            <div className="flex flex-col gap-2 border-t border-line pt-5">
              <Button type="submit" variant="solid" disabled={pending}>{pending ? "Saving…" : "Save"}</Button>
              {d.visibility !== "published" && (
                <Button type="button" disabled={pending} onClick={() => submit("published")}>Save &amp; publish</Button>
              )}
              <p aria-live="polite" className="min-h-5 text-sm">
                {error ? <span className="text-danger">{error}</span> : saved ? <span className="text-success">✓ {saved}</span> : null}
              </p>
            </div>
          </Panel>
        </aside>
      </div>
    </form>
  );
}
