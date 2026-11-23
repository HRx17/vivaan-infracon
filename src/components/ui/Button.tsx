import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "outline" | "solid" | "ghost" | "danger";
type Size = "md" | "lg" | "sm";

const base =
  "lift inline-flex items-center justify-center gap-2 rounded-btn font-medium whitespace-nowrap select-none " +
  "disabled:opacity-50 disabled:pointer-events-none min-h-tap";
const variants: Record<Variant, string> = {
  outline: "btn-sweep border border-primary text-primary",
  solid: "border border-primary bg-primary text-primary-fg hover:bg-secondary hover:border-secondary hover:text-white",
  ghost: "border border-transparent text-fg hover:border-line",
  danger: "border border-danger/60 text-danger hover:bg-danger hover:text-bg",
};
const sizes: Record<Size, string> = {
  sm: "px-3 text-sm",
  md: "px-5 text-[0.95rem]",
  lg: "px-7 text-base",
};

export function buttonClass(variant: Variant = "outline", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

export function Button({ variant, size, className, ...rest }: Common & ComponentProps<"button">) {
  return <button className={buttonClass(variant, size, className)} {...rest} />;
}

export function ButtonLink({
  variant,
  size,
  className,
  href,
  external,
  ...rest
}: Common & { href: string; external?: boolean } & Omit<ComponentProps<"a">, "href">) {
  const cls = buttonClass(variant, size, className);
  if (external || /^(https?:|mailto:|tel:)/.test(href)) {
    return (
      <a
        href={href}
        className={cls}
        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      />
    );
  }
  return <Link href={href} className={cls} {...rest} />;
}
