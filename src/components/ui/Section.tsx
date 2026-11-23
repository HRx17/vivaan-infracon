import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function Section({
  id,
  eyebrow,
  title,
  lead,
  action,
  tone = "default",
  className,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  lead?: ReactNode;
  action?: ReactNode;
  tone?: "default" | "surface";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <section id={id} className={cn("py-section scroll-mt-20", tone === "surface" && "bg-surface", className)}>
      <Container>
        {(eyebrow || title) && (
          <Reveal className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              {eyebrow && (
                <div className="mb-5 flex items-center gap-4">
                  <span className="rule-accent" aria-hidden />
                  <p className="eyebrow">{eyebrow}</p>
                </div>
              )}
              {title && <h2 className="text-3xl font-extrabold sm:text-4xl md:text-[2.75rem]">{title}</h2>}
              {lead && <p className="mt-4 text-lg text-muted">{lead}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </Reveal>
        )}
        {children}
      </Container>
    </section>
  );
}
