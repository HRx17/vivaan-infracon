type P = { className?: string };
const s = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, "aria-hidden": true } as const;

export const IconArrow = ({ className }: P) => (
  <svg {...s} className={className}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const IconMail = ({ className }: P) => (
  <svg {...s} className={className}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
);
export const IconPhone = ({ className }: P) => (
  <svg {...s} className={className}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>
);
export const IconWhatsApp = ({ className }: P) => (
  <svg {...s} className={className}><path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z" /><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .9a5 5 0 0 1-2.8-2.8l.9-1-1-2z" /></svg>
);
export const IconPin = ({ className }: P) => (
  <svg {...s} className={className}><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>
);
export const IconMenu = ({ className }: P) => (
  <svg {...s} className={className}><path d="M4 8h16M4 16h16" /></svg>
);
export const IconClose = ({ className }: P) => (
  <svg {...s} className={className}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
