import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Two storage drivers behind one interface:
 *  - Vercel Blob when BLOB_READ_WRITE_TOKEN is set (serverless / Vercel)
 *  - Local disk in ./data otherwise (local dev, a VPS, Docker)
 */
const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
const DATA_DIR = path.join(process.cwd(), "data");
const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

/** Data files live under an unguessable folder name derived from the auth secret. */
function blobDataPrefix() {
  const seed = process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD || "vivaan";
  return `data-${createHash("sha256").update(seed).digest("hex").slice(0, 20)}/`;
}

export async function readJSON<T>(key: string, fallback: T): Promise<T> {
  if (useBlob) {
    const { list } = await import("@vercel/blob");
    const pathname = `${blobDataPrefix()}${key}.json`;
    const { blobs } = await list({ prefix: pathname, limit: 1 });
    const hit = blobs.find((b) => b.pathname === pathname);
    if (!hit) return fallback;
    const res = await fetch(`${hit.url}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  }
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, `${key}.json`), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJSON<T>(key: string, value: T): Promise<void> {
  const body = JSON.stringify(value, null, 2);
  if (useBlob) {
    const { put } = await import("@vercel/blob");
    await put(`${blobDataPrefix()}${key}.json`, body, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    });
    return;
  }
  await fs.mkdir(DATA_DIR, { recursive: true });
  const file = path.join(DATA_DIR, `${key}.json`);
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, body, "utf8");
  await fs.rename(tmp, file);
}

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
export const ALLOWED_IMAGE_TYPES = Object.keys(EXT);

/** Saves an image and returns a URL usable in <Image src>. */
export async function saveImage(file: File): Promise<string> {
  const ext = EXT[file.type];
  if (!ext) throw new Error("Unsupported image type");
  const name = `${new Date().toISOString().slice(0, 10)}-${randomUUID().slice(0, 12)}.${ext}`;
  if (useBlob) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`uploads/${name}`, file, {
      access: "public",
      contentType: file.type,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    });
    return blob.url;
  }
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return `/media/${name}`;
}

/** Best-effort removal of an image we stored ourselves. */
export async function deleteImage(url: string): Promise<void> {
  try {
    if (useBlob && url.includes(".blob.vercel-storage.com/")) {
      const { del } = await import("@vercel/blob");
      await del(url);
    } else if (url.startsWith("/media/")) {
      const name = path.basename(url);
      await fs.unlink(path.join(UPLOAD_DIR, name));
    }
  } catch {
    /* ignore */
  }
}

export async function readLocalUpload(name: string): Promise<{ data: Buffer; type: string } | null> {
  const safe = path.basename(name);
  const ext = safe.split(".").pop() ?? "";
  const type = Object.entries(EXT).find(([, e]) => e === ext)?.[0];
  if (!type) return null;
  try {
    return { data: await fs.readFile(path.join(UPLOAD_DIR, safe)), type };
  } catch {
    return null;
  }
}
