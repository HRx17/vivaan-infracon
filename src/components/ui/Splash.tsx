/** Branded splash shown on first load until the page and hero photo are ready (see themeScript). */
export function Splash() {
  return (
    <div id="splash" aria-hidden>
      <div className="flex flex-col items-center gap-6">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="text-fg">
          <rect className="splash-mark" x="2" y="2" width="60" height="60" stroke="currentColor" strokeWidth="1.5" />
          <path className="splash-mark" d="M20 20 L32 46 L44 20" stroke="rgb(var(--accent))" strokeWidth="2.5" strokeLinecap="square" />
        </svg>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/vivaan-logo.png" alt="" width={669} height={210} className="logo-themed h-10 w-auto" />
        <span className="relative block h-px w-32 overflow-hidden bg-line">
          <span className="splash-bar absolute inset-y-0 left-0 w-1/3 bg-accent" />
        </span>
      </div>
    </div>
  );
}
