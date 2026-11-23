"use client";
import { useActionState } from "react";
import { submitEnquiry, type ContactState } from "@/app/(site)/contact/actions";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";

const INTERESTS = ["Buying a home or unit", "Building on my land", "Joint venture / land partnership", "Investment", "Commercial space", "Something else"];

export function ContactForm({ project, projects }: { project?: string; projects: string[] }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitEnquiry, { ok: false, message: "" });

  if (state.ok) {
    return (
      <div role="status" className="border-t border-accent pt-8">
        <p className="font-heading text-2xl font-extrabold">Message received.</p>
        <p className="mt-3 text-lg text-muted">{state.message}</p>
      </div>
    );
  }

  const err = state.errors ?? {};
  return (
    <form action={action} className="grid gap-5 sm:grid-cols-2" noValidate>
      <Field label="Your name" htmlFor="name" required error={err.name}>
        <Input id="name" name="name" autoComplete="name" required aria-invalid={!!err.name} />
      </Field>
      <Field label="Phone / WhatsApp" htmlFor="phone">
        <Input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" />
      </Field>
      <Field label="Email" htmlFor="email" error={err.email} className="sm:col-span-2" hint="Email or phone — whichever you prefer.">
        <Input id="email" name="email" type="email" autoComplete="email" aria-invalid={!!err.email} />
      </Field>
      <Field label="I'm interested in" htmlFor="interest">
        <Select id="interest" name="interest" defaultValue={INTERESTS[0]}>
          {INTERESTS.map((i) => <option key={i}>{i}</option>)}
        </Select>
      </Field>
      <Field label="Project (optional)" htmlFor="project">
        <Select id="project" name="project" defaultValue={project ?? ""}>
          <option value="">Not a specific project</option>
          {project && !projects.includes(project) && <option>{project}</option>}
          {projects.map((p) => <option key={p}>{p}</option>)}
        </Select>
      </Field>
      <Field label="Message" htmlFor="message" required error={err.message} className="sm:col-span-2">
        <Textarea id="message" name="message" required rows={6} aria-invalid={!!err.message}
          placeholder="Location, plot size, budget range, timeline — whatever you have so far." />
      </Field>
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company_website">Leave this empty</label>
        <input id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted" aria-live="polite">{state.message}</p>
        <Button type="submit" variant="solid" size="lg" disabled={pending}>
          {pending ? "Sending…" : "Send enquiry"}
        </Button>
      </div>
    </form>
  );
}
