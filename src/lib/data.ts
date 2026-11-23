import "server-only";
import { cache } from "react";
import { randomUUID } from "node:crypto";
import { readJSON, writeJSON } from "./storage";
import { DEFAULT_SETTINGS, SAMPLE_PROJECTS } from "./seed";
import type { Enquiry, Project, ProjectStatus, SiteSettings } from "./types";

/* ───────── Projects ───────── */
export const getAllProjects = cache(async (): Promise<Project[]> => {
  const list = await readJSON<Project[] | null>("projects", null);
  return (list ?? SAMPLE_PROJECTS).slice().sort((a, b) => a.order - b.order);
});

export async function saveAllProjects(list: Project[]) {
  await writeJSON("projects", list);
}

export async function getPublishedProjects(status?: ProjectStatus) {
  const all = await getAllProjects();
  return all.filter((p) => p.visibility === "published" && (!status || p.status === status));
}

export async function getProjectBySlug(slug: string) {
  const all = await getAllProjects();
  return all.find((p) => p.slug === slug && p.visibility === "published") ?? null;
}

export async function getProjectById(id: string) {
  const all = await getAllProjects();
  return all.find((p) => p.id === id) ?? null;
}

/* ───────── Settings ───────── */
export const getSettings = cache(async (): Promise<SiteSettings> => {
  const s = await readJSON<Partial<SiteSettings>>("settings", {});
  return { ...DEFAULT_SETTINGS, ...s };
});

export async function saveSettings(s: SiteSettings) {
  await writeJSON("settings", s);
}

/* ───────── Enquiries ───────── */
export async function getEnquiries() {
  const list = await readJSON<Enquiry[]>("enquiries", []);
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveEnquiries(list: Enquiry[]) {
  await writeJSON("enquiries", list);
}

export async function addEnquiry(e: Omit<Enquiry, "id" | "createdAt" | "read" | "archived">) {
  const list = await getEnquiries();
  const entry: Enquiry = { ...e, id: randomUUID(), createdAt: new Date().toISOString(), read: false, archived: false };
  await saveEnquiries([entry, ...list].slice(0, 2000));
  return entry;
}
