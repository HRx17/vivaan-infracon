"use server";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import {
  getAllProjects, getEnquiries, getSettings, saveAllProjects, saveEnquiries, saveSettings,
} from "@/lib/data";
import { deleteImage } from "@/lib/storage";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, checkPassword, createSessionToken } from "@/lib/session";
import type { Project, ProjectImage, ProjectSpec, ProjectStatus, SiteSettings, Visibility } from "@/lib/types";
import { slugify } from "@/lib/utils";

/* ───────── Auth ───────── */
export async function login(_: { error?: string }, form: FormData): Promise<{ error?: string }> {
  if (!process.env.ADMIN_PASSWORD) return { error: "ADMIN_PASSWORD is not set on the server. See README." };
  // small fixed delay slows down password guessing
  await new Promise((r) => setTimeout(r, 400));
  if (!(await checkPassword(String(form.get("password") ?? "")))) return { error: "That password isn't right." };
  const jar = await cookies();
  jar.set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_TTL_SECONDS,
  });
  const next = String(form.get("next") ?? "");
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

function refresh() {
  revalidatePath("/", "layout");
}

/* ───────── Projects ───────── */
const STATUSES: ProjectStatus[] = ["completed", "ongoing", "upcoming"];
const VIS: Visibility[] = ["published", "draft", "archived"];
const str = (v: unknown, n = 300) => (typeof v === "string" ? v.trim().slice(0, n) : "");
const img = (v: unknown): ProjectImage | null => {
  const o = v as ProjectImage | null;
  return o && typeof o.url === "string" && o.url ? { url: o.url.slice(0, 1000), alt: str(o.alt, 200), ...(o.wide ? { wide: true } : {}) } : null;
};

export type SaveResult = { ok: boolean; error?: string; id?: string };

export async function saveProject(payload: string): Promise<SaveResult> {
  await requireAdmin();
  let raw: Record<string, unknown>;
  try { raw = JSON.parse(payload); } catch { return { ok: false, error: "Invalid data" }; }

  const title = str(raw.title, 140);
  if (!title) return { ok: false, error: "A title is required." };
  const all = await getAllProjects();
  const existing = raw.id ? all.find((p) => p.id === raw.id) : undefined;

  let slug = slugify(str(raw.slug, 80) || title);
  const taken = (s: string) => all.some((p) => p.slug === s && p.id !== existing?.id);
  for (let i = 2; taken(slug); i++) slug = `${slugify(str(raw.slug, 80) || title)}-${i}`;

  const now = new Date().toISOString();
  const project: Project = {
    id: existing?.id ?? randomUUID(),
    slug,
    title,
    status: STATUSES.includes(raw.status as ProjectStatus) ? (raw.status as ProjectStatus) : "completed",
    category: str(raw.category, 60),
    location: str(raw.location, 120),
    year: str(raw.year, 40),
    summary: str(raw.summary, 400),
    description: str(raw.description, 10000),
    cover: img(raw.cover),
    gallery: (Array.isArray(raw.gallery) ? raw.gallery : []).map(img).filter(Boolean).slice(0, 60) as ProjectImage[],
    specs: (Array.isArray(raw.specs) ? raw.specs : [])
      .map((s: ProjectSpec) => ({ label: str(s?.label, 60), value: str(s?.value, 600) }))
      .filter((s) => s.label && s.value)
      .slice(0, 24),
    featured: !!raw.featured,
    visibility: VIS.includes(raw.visibility as Visibility) ? (raw.visibility as Visibility) : "draft",
    order: existing?.order ?? Math.min(0, ...all.map((p) => p.order)) - 1,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  // clean up photos that were removed from this project
  if (existing) {
    const keep = new Set([project.cover?.url, ...project.gallery.map((g) => g.url)]);
    const dropped = [existing.cover?.url, ...existing.gallery.map((g) => g.url)].filter((u): u is string => !!u && !keep.has(u));
    await Promise.all(dropped.map(deleteImage));
  }

  await saveAllProjects(existing ? all.map((p) => (p.id === project.id ? project : p)) : [project, ...all]);
  refresh();
  return { ok: true, id: project.id };
}

export async function setProjectVisibility(id: string, visibility: Visibility) {
  await requireAdmin();
  if (!VIS.includes(visibility)) return;
  const all = await getAllProjects();
  await saveAllProjects(all.map((p) => (p.id === id ? { ...p, visibility, updatedAt: new Date().toISOString() } : p)));
  refresh();
}

export async function toggleFeatured(id: string) {
  await requireAdmin();
  const all = await getAllProjects();
  await saveAllProjects(all.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p)));
  refresh();
}

export async function moveProject(id: string, dir: -1 | 1) {
  await requireAdmin();
  const all = await getAllProjects();
  const i = all.findIndex((p) => p.id === id);
  if (i < 0) return;
  // swap with the nearest neighbour in the same group (archived vs. not), matching the admin list
  const archived = all[i].visibility === "archived";
  let j = i + dir;
  while (j >= 0 && j < all.length && (all[j].visibility === "archived") !== archived) j += dir;
  if (j < 0 || j >= all.length) return;
  [all[i], all[j]] = [all[j], all[i]];
  await saveAllProjects(all.map((p, k) => ({ ...p, order: k })));
  refresh();
}

export async function deleteProject(id: string) {
  await requireAdmin();
  const all = await getAllProjects();
  const p = all.find((x) => x.id === id);
  if (!p) return;
  await Promise.all([p.cover?.url, ...p.gallery.map((g) => g.url)].filter((u): u is string => !!u).map(deleteImage));
  await saveAllProjects(all.filter((x) => x.id !== id));
  refresh();
}

/* ───────── Enquiries ───────── */
export async function updateEnquiry(id: string, patch: { read?: boolean; archived?: boolean }) {
  await requireAdmin();
  const list = await getEnquiries();
  await saveEnquiries(list.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  revalidatePath("/admin", "layout");
}

export async function deleteEnquiry(id: string) {
  await requireAdmin();
  const list = await getEnquiries();
  await saveEnquiries(list.filter((e) => e.id !== id));
  revalidatePath("/admin", "layout");
}

/* ───────── Settings ───────── */
export async function saveSiteSettings(payload: string): Promise<SaveResult> {
  await requireAdmin();
  let raw: Partial<SiteSettings>;
  try { raw = JSON.parse(payload); } catch { return { ok: false, error: "Invalid data" }; }
  const cur = await getSettings();
  const next: SiteSettings = {
    ownerName: str(raw.ownerName, 80) || cur.ownerName,
    brandName: str(raw.brandName, 80) || cur.brandName,
    tagline: str(raw.tagline, 200),
    intro: str(raw.intro, 600),
    about: str(raw.about, 1200),
    email: str(raw.email, 200),
    phone: str(raw.phone, 40),
    whatsapp: str(raw.whatsapp, 40).replace(/[^\d]/g, ""),
    address: str(raw.address, 300),
    instagram: str(raw.instagram, 300),
    linkedin: str(raw.linkedin, 300),
    heroImage: img(raw.heroImage),
    portrait: img(raw.portrait),
    stats: (Array.isArray(raw.stats) ? raw.stats : [])
      .map((s) => ({ label: str(s?.label, 40), value: str(s?.value, 20) }))
      .filter((s) => s.label && s.value)
      .slice(0, 4),
    partners: (Array.isArray(raw.partners) ? raw.partners : [])
      .map((x) => ({ name: str(x?.name, 80), role: str(x?.role, 60), logo: str(x?.logo, 1000) }))
      .filter((x) => x.name)
      .slice(0, 40),
  };
  for (const k of ["heroImage", "portrait"] as const) {
    if (cur[k]?.url && cur[k]?.url !== next[k]?.url) await deleteImage(cur[k]!.url);
  }
  await saveSettings(next);
  refresh();
  return { ok: true };
}
