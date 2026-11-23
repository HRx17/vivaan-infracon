"use client";
import { useActionState, useState } from "react";
import { submitReview, type ReviewState } from "@/app/(site)/review/actions";
import { REVIEWER_ROLES } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { cn } from "@/lib/utils";

const ROLE_ICONS: Record<string, string> = {
  "Home buyer": "🏠", "Shop / office owner": "🏬", Investor: "📈", "Architect / consultant": "📐", Partner: "🤝", Other: "🙂",
};

export function ReviewForm({ projects, project }: { projects: string[]; project?: string }) {
  const [state, action, pending] = useActionState<ReviewState, FormData>(submitReview, { ok: false, message: "" });
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [role, setRole] = useState<string>("Home buyer");
  const err = state.errors ?? {};

  if (state.ok) {
    return (
      <div role="status" className="flex flex-col items-center gap-4 rounded-2xl border border-line p-10 text-center">
        <span className="text-5xl" aria-hidden>🙏</span>
        <p className="font-heading text-2xl font-extrabold">Thank you!</p>
        <p className="text-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-8" noValidate>
      <fieldset>
        <legend className="mb-3 text-sm font-medium">How was your experience?</legend>
        <div className="flex gap-2" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              aria-label={`${i} star${i > 1 ? "s" : ""}`}
              aria-pressed={rating === i}
              onClick={() => setRating(i)}
              onMouseEnter={() => setHover(i)}
              className="flex h-14 w-14 items-center justify-center rounded-xl border border-line transition-transform duration-200 hover:scale-110"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden className={(hover || rating) >= i ? "text-accent" : "text-line"}>
                <path fill="currentColor" d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z" />
              </svg>
            </button>
          ))}
        </div>
        <input type="hidden" name="rating" value={rating || ""} />
        {err.rating && <p role="alert" className="mt-2 text-xs text-danger">{err.rating}</p>}
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-medium">I am a…</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {REVIEWER_ROLES.map((r) => (
            <label key={r} className={cn(
              "flex min-h-[56px] cursor-pointer items-center gap-2 rounded-xl border px-3 text-sm font-medium transition-colors",
              role === r ? "border-primary bg-primary/5 text-primary" : "border-line hover:border-primary/50",
            )}>
              <input type="radio" name="role" value={r} checked={role === r} onChange={() => setRole(r)} className="sr-only" />
              <span aria-hidden className="text-xl">{ROLE_ICONS[r]}</span>{r}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="name" required error={err.name}>
          <Input id="name" name="name" autoComplete="name" required />
        </Field>
        <Field label="Project" htmlFor="project">
          <Select id="project" name="project" defaultValue={project ?? ""}>
            <option value="">Choose…</option>
            {projects.map((p) => <option key={p}>{p}</option>)}
          </Select>
        </Field>
        <Field label="What you bought or did (optional)" htmlFor="detail" className="sm:col-span-2" hint="e.g. 4 BHK owner, Shop owner, Architect">
          <Input id="detail" name="detail" />
        </Field>
        <Field label="Your review" htmlFor="quote" required error={err.quote} className="sm:col-span-2">
          <Textarea id="quote" name="quote" rows={4} placeholder="A few words about the quality, the team or the experience." />
        </Field>
      </div>
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company_website">Leave empty</label>
        <input id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted" aria-live="polite">{state.message}</p>
        <Button type="submit" variant="solid" size="lg" disabled={pending}>{pending ? "Sending…" : "Send review"}</Button>
      </div>
    </form>
  );
}
