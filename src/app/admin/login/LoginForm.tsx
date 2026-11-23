"use client";
import { useActionState } from "react";
import { login } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(login, {});
  return (
    <form action={action} className="mt-8 flex flex-col gap-5">
      <input type="hidden" name="next" value={next ?? ""} />
      <Field label="Password" htmlFor="password" error={state.error}>
        <Input id="password" name="password" type="password" autoComplete="current-password" required autoFocus />
      </Field>
      <Button type="submit" variant="solid" size="lg" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</Button>
    </form>
  );
}
