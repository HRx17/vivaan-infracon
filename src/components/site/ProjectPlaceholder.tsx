/** Branded stand-in for projects that don't have photos yet. */
export function ProjectPlaceholder({ title, large = false }: { title: string; large?: boolean }) {
  const initials = title.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-gradient-to-br from-secondary via-[#13306b] to-[#0B1222]">
      <svg className="absolute inset-0 h-full w-full opacity-[0.12]" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 9 }).map((_, i) => (
          <rect key={i} x={40 + i * 38} y={300 - (60 + ((i * 47) % 140))} width="26" height={60 + ((i * 47) % 140)} fill="none" stroke="white" strokeWidth="1" />
        ))}
      </svg>
      <span className={`absolute inset-0 flex items-center justify-center font-heading font-extrabold tracking-tight text-white/90 ${large ? "text-[9rem] md:text-[14rem]" : "text-7xl"}`}>
        {initials}
      </span>
      <span className="absolute bottom-4 left-4 h-px w-12 bg-accent" />
    </div>
  );
}
