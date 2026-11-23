/** Small animated "scroll" indicator at the bottom of full-screen heroes. */
export function ScrollCue() {
  return (
    <div aria-hidden className="fade-in-late pointer-events-none absolute bottom-8 right-6 hidden flex-col items-center gap-3 text-[10px] font-semibold uppercase tracking-eyebrow text-white/70 md:flex lg:right-10">
      <span className="[writing-mode:vertical-rl]">Scroll</span>
      <span className="relative h-14 w-px overflow-hidden bg-white/25">
        <span className="scroll-dot absolute inset-x-0 top-0 h-1/3 bg-accent" />
      </span>
    </div>
  );
}
