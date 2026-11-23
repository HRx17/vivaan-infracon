import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const control =
  "block w-full min-h-tap rounded-sm border border-line bg-bg px-3.5 py-2.5 text-fg placeholder:text-muted/80 " +
  "transition-colors duration-brand ease-brand focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary " +
  "disabled:opacity-60";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-fg">
        {label}
        {required && <span className="ml-0.5 text-muted" aria-hidden> *</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs text-danger" role="alert">{error}</p>}
    </div>
  );
}

export function Input({ className, ...rest }: ComponentProps<"input">) {
  return <input className={cn(control, className)} {...rest} />;
}

export function Textarea({ className, ...rest }: ComponentProps<"textarea">) {
  return <textarea className={cn(control, "min-h-[140px] leading-relaxed", className)} {...rest} />;
}

export function Select({ className, children, ...rest }: ComponentProps<"select">) {
  return (
    <select className={cn(control, "appearance-none bg-[length:12px] bg-[right_14px_center] bg-no-repeat pr-10", className)}
      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath fill='none' stroke='%23888' stroke-width='1.5' d='M1 1l5 5 5-5'/%3E%3C/svg%3E\")" }}
      {...rest}>
      {children}
    </select>
  );
}

export function Checkbox({ label, className, ...rest }: { label: ReactNode } & ComponentProps<"input">) {
  return (
    <label className={cn("inline-flex min-h-tap cursor-pointer items-center gap-3 text-sm", className)}>
      <input type="checkbox" className="h-5 w-5 rounded-sm border-line accent-[rgb(var(--primary))]" {...rest} />
      <span>{label}</span>
    </label>
  );
}
