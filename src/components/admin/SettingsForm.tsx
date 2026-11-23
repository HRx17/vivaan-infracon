"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveSiteSettings } from "@/app/admin/actions";
import type { SiteSettings } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Card";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { SingleImage } from "./ImagePicker";

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [s, setS] = useState(initial);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => { setMsg(null); setS((x) => ({ ...x, [k]: v })); };
  const text = (k: keyof SiteSettings, label: string, props: Record<string, unknown> = {}, hint?: string) => (
    <Field label={label} htmlFor={k} hint={hint}>
      <Input id={k} value={s[k] as string} onChange={(e) => set(k, e.target.value as never)} {...props} />
    </Field>
  );

  return (
    <form className="flex flex-col gap-6" onSubmit={(e) => {
      e.preventDefault();
      start(async () => {
        const r = await saveSiteSettings(JSON.stringify(s));
        setMsg(r.ok ? { ok: true, text: "Saved — the website is updated." } : { ok: false, text: r.error || "Could not save" });
        router.refresh();
      });
    }}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Site settings</h1>
          <p className="text-muted">Contact details, home page text and photos.</p>
        </div>
      </div>

      <Panel className="grid gap-5 sm:grid-cols-2">
        <h2 className="text-lg font-extrabold sm:col-span-2">How people reach you</h2>
        {text("email", "Email", { type: "email" })}
        {text("phone", "Phone (for the Call button)", { type: "tel", placeholder: "+91 98765 43210" })}
        {text("whatsapp", "WhatsApp number", { inputMode: "tel", placeholder: "919876543210" }, "With country code, digits only. Leave empty to hide WhatsApp buttons.")}
        {text("instagram", "Instagram URL", { type: "url", placeholder: "https://instagram.com/…" })}
        {text("linkedin", "LinkedIn URL", { type: "url" })}
        <Field label="Office address" htmlFor="address">
          <Textarea id="address" rows={3} className="min-h-[96px]" value={s.address} onChange={(e) => set("address", e.target.value)} />
        </Field>
      </Panel>

      <Panel className="grid gap-5">
        <h2 className="text-lg font-extrabold">Home page</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {text("brandName", "Brand name")}
          {text("ownerName", "Your name")}
        </div>
        {text("tagline", "Tagline (under the brand name)")}
        <Field label="Introduction (large text)" htmlFor="intro"><Textarea id="intro" rows={3} value={s.intro} onChange={(e) => set("intro", e.target.value)} /></Field>
        <Field label="About the company" htmlFor="about"><Textarea id="about" rows={4} value={s.about} onChange={(e) => set("about", e.target.value)} /></Field>
        <div>
          <p className="mb-2 text-sm font-medium">Numbers (up to 4)</p>
          <div className="grid gap-2">
            {s.stats.map((st, i) => (
              <div key={i} className="grid grid-cols-[110px_1fr_auto] gap-2">
                <Input aria-label={`Number ${i + 1}`} placeholder="25+" value={st.value} onChange={(e) => set("stats", s.stats.map((x, k) => k === i ? { ...x, value: e.target.value } : x))} />
                <Input aria-label={`Number ${i + 1} label`} placeholder="Projects delivered" value={st.label} onChange={(e) => set("stats", s.stats.map((x, k) => k === i ? { ...x, label: e.target.value } : x))} />
                <button type="button" aria-label="Remove" className="h-tap w-tap rounded-sm border border-line text-muted hover:text-danger" onClick={() => set("stats", s.stats.filter((_, k) => k !== i))}>×</button>
              </div>
            ))}
            {s.stats.length < 4 && <Button type="button" size="sm" variant="ghost" className="justify-self-start" onClick={() => set("stats", [...s.stats, { label: "", value: "" }])}>+ Add number</Button>}
          </div>
        </div>
      </Panel>

      <div className="grid gap-6 md:grid-cols-2">
        <Panel className="grid gap-3">
          <h2 className="text-lg font-extrabold">Home page photo</h2>
          <p className="text-sm text-muted">Full-screen background behind your name. Pick your strongest finished project.</p>
          <SingleImage value={s.heroImage} onChange={(v) => set("heroImage", v)} />
        </Panel>
        <Panel className="grid gap-3">
          <h2 className="text-lg font-extrabold">Your portrait</h2>
          <p className="text-sm text-muted">Shown large on the home page next to your name. A confident photo, ideally on site.</p>
          <SingleImage value={s.portrait} onChange={(v) => set("portrait", v)} aspect="aspect-[4/5]" />
        </Panel>
      </div>

      <div className="sticky bottom-0 -mx-4 flex items-center justify-end gap-4 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-md sm:border">
        <p aria-live="polite" className={msg?.ok ? "text-sm text-success" : "text-sm text-danger"}>{msg?.text}</p>
        <Button type="submit" variant="solid" disabled={pending}>{pending ? "Saving…" : "Save settings"}</Button>
      </div>
    </form>
  );
}
