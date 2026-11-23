import { Container } from "@/components/ui/Section";

const Bar = ({ className = "", dark = false }: { className?: string; dark?: boolean }) => (
  <div className={`${dark ? "skeleton-dark" : "skeleton"} ${className}`} />
);

function Status() {
  return <span className="sr-only" role="status">Loading…</span>;
}

/** Photo-led pages (home, project): dark hero outline + content below. */
export function HeroPageSkeleton({ figures = false }: { figures?: boolean }) {
  return (
    <div aria-busy="true">
      <Status />
      <div className="relative flex min-h-[88svh] items-end bg-secondary">
        <Container className="pb-16 pt-32 md:pb-24">
          <Bar dark className="mb-6 h-3 w-48" />
          <Bar dark className="h-14 w-3/4 max-w-xl md:h-20" />
          <Bar dark className="mt-6 h-5 w-full max-w-lg" />
          <Bar dark className="mt-3 h-5 w-2/3 max-w-md" />
          <div className="mt-10 flex gap-3">
            <Bar dark className="h-12 w-40 rounded-btn" />
            <Bar dark className="h-12 w-32 rounded-btn" />
          </div>
        </Container>
      </div>
      {figures && (
        <Container className="grid grid-cols-2 gap-6 border-b border-line py-8 md:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i}><Bar className="h-10 w-24" /><Bar className="mt-3 h-3 w-20" /></div>
          ))}
        </Container>
      )}
      <Container className="grid gap-10 py-section md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-3">
          <Bar className="h-3 w-24" />
          <Bar className="h-8 w-5/6" />
          <Bar className="h-8 w-2/3" />
          <Bar className="mt-6 h-4 w-full" />
          <Bar className="h-4 w-11/12" />
          <Bar className="h-4 w-4/5" />
        </div>
        <div className="space-y-4">
          {[0, 1, 2, 3].map((i) => <Bar key={i} className="h-12 w-full" />)}
        </div>
      </Container>
    </div>
  );
}

/** List / form pages (projects, contact): light header + card grid. */
export function ListPageSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div aria-busy="true" className="pb-section pt-32 md:pt-40">
      <Status />
      <Container>
        <Bar className="mb-5 h-3 w-24" />
        <Bar className="h-12 w-64 md:h-16" />
        <Bar className="mt-5 h-5 w-full max-w-xl" />
        <div className="mt-12 flex gap-3 border-b border-line pb-4">
          {[0, 1, 2, 3].map((i) => <Bar key={i} className="h-6 w-24" />)}
        </div>
        <div className="mt-12 grid gap-x-gap gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: cards }).map((_, i) => (
            <div key={i}>
              <Bar className="aspect-[4/3] w-full rounded-md" />
              <Bar className="mt-5 h-5 w-2/3" />
              <Bar className="mt-2 h-3 w-1/2" />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export function AdminSkeleton() {
  return (
    <div aria-busy="true" className="space-y-6">
      <Status />
      <Bar className="h-9 w-48" />
      <Bar className="h-4 w-80" />
      <div className="overflow-hidden rounded-md border border-line bg-bg">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 border-t border-line p-4 first:border-t-0">
            <Bar className="h-16 w-24" />
            <div className="flex-1 space-y-2"><Bar className="h-4 w-1/3" /><Bar className="h-3 w-1/4" /></div>
            <Bar className="hidden h-10 w-48 sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
