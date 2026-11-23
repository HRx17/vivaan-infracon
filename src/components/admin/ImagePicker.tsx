"use client";
import { useRef, useState } from "react";
import type { ProjectImage } from "@/lib/types";
import { uploadImage } from "@/lib/compress";
import { Photo } from "@/components/ui/Photo";
import { Input } from "@/components/ui/Field";
import { cn } from "@/lib/utils";

const btn = "inline-flex min-h-tap items-center justify-center rounded-sm border border-line bg-bg px-3 text-sm hover:border-primary hover:text-primary transition-colors";

function DropZone({ multiple, onFiles, busy, label }: { multiple?: boolean; onFiles: (f: File[]) => void; busy: boolean; label: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); onFiles(Array.from(e.dataTransfer.files)); }}
      className={cn("flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-md border border-dashed p-6 text-center",
        over ? "border-primary bg-primary/5" : "border-line bg-bg")}
    >
      <button type="button" className={btn} disabled={busy} onClick={() => ref.current?.click()}>
        {busy ? "Uploading…" : label}
      </button>
      <p className="text-xs text-muted">or drag photos here · JPG, PNG, WebP · resized automatically</p>
      <input ref={ref} type="file" accept="image/*" multiple={multiple} hidden
        onChange={(e) => { onFiles(Array.from(e.target.files ?? [])); e.target.value = ""; }} />
    </div>
  );
}

function useUploader(onError: (m: string) => void) {
  const [busy, setBusy] = useState(false);
  async function run(files: File[]) {
    setBusy(true);
    const urls: string[] = [];
    for (const f of files.filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name))) {
      try { urls.push(await uploadImage(f)); } catch (e) { onError((e as Error).message); }
    }
    setBusy(false);
    return urls;
  }
  return { busy, run };
}

export function SingleImage({ value, onChange, label = "Upload photo", aspect = "aspect-[16/10]" }: {
  value: ProjectImage | null; onChange: (v: ProjectImage | null) => void; label?: string; aspect?: string;
}) {
  const [err, setErr] = useState("");
  const { busy, run } = useUploader(setErr);
  return (
    <div className="flex flex-col gap-3">
      {value ? (
        <div className="flex flex-col gap-3">
          <div className={cn("relative overflow-hidden rounded-md bg-surface", aspect)}>
            <Photo src={value.url} alt={value.alt} fill sizes="600px" />
          </div>
          <Input aria-label="Photo description (alt text)" placeholder="Describe the photo (for accessibility & SEO)" value={value.alt}
            onChange={(e) => onChange({ ...value, alt: e.target.value })} />
          <div className="flex gap-2">
            <label className={cn(btn, "cursor-pointer")}>
              {busy ? "Uploading…" : "Replace"}
              <input type="file" accept="image/*" hidden onChange={async (e) => {
                setErr(""); const [u] = await run(Array.from(e.target.files ?? [])); e.target.value = "";
                if (u) onChange({ url: u, alt: value.alt });
              }} />
            </label>
            <button type="button" className={btn} onClick={() => onChange(null)}>Remove</button>
          </div>
        </div>
      ) : (
        <DropZone busy={busy} label={label} onFiles={async (f) => { setErr(""); const [u] = await run(f.slice(0, 1)); if (u) onChange({ url: u, alt: "" }); }} />
      )}
      {err && <p role="alert" className="text-sm text-danger">{err}</p>}
    </div>
  );
}

export function Gallery({ value, onChange, onMakeCover }: {
  value: ProjectImage[]; onChange: (v: ProjectImage[]) => void; onMakeCover?: (img: ProjectImage) => void;
}) {
  const [err, setErr] = useState("");
  const { busy, run } = useUploader(setErr);
  const move = (i: number, d: number) => {
    const j = i + d; if (j < 0 || j >= value.length) return;
    const next = value.slice(); [next[i], next[j]] = [next[j], next[i]]; onChange(next);
  };
  return (
    <div className="flex flex-col gap-4">
      {value.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {value.map((g, i) => (
            <li key={g.url} className="flex flex-col gap-2 rounded-md border border-line bg-bg p-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-surface">
                <Photo src={g.url} alt={g.alt} fill sizes="300px" />
                <span className="absolute left-2 top-2 rounded-sm bg-bg/90 px-1.5 text-xs">{i + 1}</span>
              </div>
              <Input aria-label={`Caption for photo ${i + 1}`} placeholder="Caption / description" value={g.alt}
                onChange={(e) => onChange(value.map((x, k) => (k === i ? { ...x, alt: e.target.value } : x)))} />
              <div className="flex flex-wrap gap-1">
                <button type="button" className={btn} aria-label="Move earlier" onClick={() => move(i, -1)} disabled={i === 0}>←</button>
                <button type="button" className={btn} aria-label="Move later" onClick={() => move(i, 1)} disabled={i === value.length - 1}>→</button>
                {onMakeCover && <button type="button" className={btn} onClick={() => onMakeCover(g)}>Set as cover</button>}
                <button type="button" className={cn(btn, "hover:border-danger hover:text-danger")} onClick={() => onChange(value.filter((_, k) => k !== i))}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <DropZone multiple busy={busy} label="Add photos" onFiles={async (f) => {
        setErr(""); const urls = await run(f); if (urls.length) onChange([...value, ...urls.map((url) => ({ url, alt: "" }))]);
      }} />
      {err && <p role="alert" className="text-sm text-danger">{err}</p>}
    </div>
  );
}
