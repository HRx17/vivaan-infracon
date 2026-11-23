"use server";
import { addEnquiry, getSettings } from "@/lib/data";

export type ContactState = { ok: boolean; message: string; errors?: Record<string, string> };

const clip = (v: FormDataEntryValue | null, n: number) => String(v ?? "").trim().slice(0, n);

export async function submitEnquiry(_prev: ContactState, form: FormData): Promise<ContactState> {
  // honeypot: real people never fill this hidden field
  if (clip(form.get("company_website"), 200)) return { ok: true, message: "Thank you." };

  const data = {
    name: clip(form.get("name"), 120),
    email: clip(form.get("email"), 200),
    phone: clip(form.get("phone"), 40),
    interest: clip(form.get("interest"), 60),
    project: clip(form.get("project"), 160),
    message: clip(form.get("message"), 4000),
  };

  const errors: Record<string, string> = {};
  if (!data.name) errors.name = "Please tell me your name.";
  if (!data.email && !data.phone) errors.email = "Add an email or a phone number so I can reply.";
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "That email doesn't look right.";
  if (data.message.length < 10) errors.message = "A sentence or two about what you have in mind, please.";
  if (Object.keys(errors).length) return { ok: false, message: "Please check the highlighted fields.", errors };

  await addEnquiry(data);
  await notifyByEmail(data).catch((e) => console.error("Enquiry email failed", e));

  return { ok: true, message: `Thank you, ${data.name.split(" ")[0]}. Your message is with me and I'll reply soon.` };
}

async function notifyByEmail(d: Record<string, string>) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!key || !from) return;
  const settings = await getSettings();
  const lines = Object.entries(d).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`);
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [settings.email],
      reply_to: d.email || undefined,
      subject: `New enquiry from ${d.name}${d.project ? ` — ${d.project}` : ""}`,
      text: lines.join("\n"),
    }),
  });
}
