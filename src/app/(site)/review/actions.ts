"use server";
import { randomUUID } from "node:crypto";
import { getTestimonials, saveTestimonials } from "@/lib/data";
import { REVIEWER_ROLES } from "@/lib/types";

export type ReviewState = { ok: boolean; message: string; errors?: Record<string, string> };
const clip = (v: FormDataEntryValue | null, n: number) => String(v ?? "").trim().slice(0, n);

/** Public review form. Reviews are saved unapproved; they appear only after approval in Admin → Reviews. */
export async function submitReview(_: ReviewState, form: FormData): Promise<ReviewState> {
  if (clip(form.get("company_website"), 200)) return { ok: true, message: "Thank you." };
  const name = clip(form.get("name"), 80);
  const role = clip(form.get("role"), 40);
  const detail = clip(form.get("detail"), 60);
  const project = clip(form.get("project"), 120);
  const quote = clip(form.get("quote"), 600);
  const rating = Math.round(Number(form.get("rating")));
  const errors: Record<string, string> = {};
  if (!name) errors.name = "Please add your name.";
  if (!(rating >= 1 && rating <= 5)) errors.rating = "Tap the stars to rate.";
  if (quote.length < 5) errors.quote = "A few words, please.";
  if (Object.keys(errors).length) return { ok: false, message: "Please check the highlighted fields.", errors };

  const list = await getTestimonials();
  if (list.filter((t) => t.source === "website" && !t.approved).length > 300) return { ok: true, message: "Thank you!" };
  list.unshift({
    id: randomUUID(),
    name,
    role: (REVIEWER_ROLES as readonly string[]).includes(role) ? role : "Other",
    detail,
    project,
    quote,
    rating,
    photo: "",
    approved: false,
    source: "website",
    createdAt: new Date().toISOString(),
  });
  await saveTestimonials(list);
  return { ok: true, message: `Thank you, ${name.split(" ")[0]}! Your review will appear once it has been checked.` };
}
