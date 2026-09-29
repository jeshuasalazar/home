import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const Phone = (p: P) => (
  <svg {...base} {...p} aria-hidden="true">
    <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </svg>
);
export const Compass = (p: P) => (
  <svg {...base} {...p} aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5-5 2 2-5z" />
  </svg>
);
export const Nodes = (p: P) => (
  <svg {...base} {...p} aria-hidden="true">
    <circle cx="12" cy="5" r="2" />
    <circle cx="5" cy="19" r="2" />
    <circle cx="19" cy="19" r="2" />
    <path d="M11 6.8 6 17.2M13 6.8l5 10.4M7 19h10" />
  </svg>
);
export const Mic = (p: P) => (
  <svg {...base} {...p} aria-hidden="true">
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
  </svg>
);
export const Chevron = (p: P) => (
  <svg {...base} strokeWidth={2} {...p} aria-hidden="true">
    <path d="m9 6 6 6-6 6" />
  </svg>
);
export const Copy = (p: P) => (
  <svg {...base} {...p} aria-hidden="true">
    <rect x="9" y="9" width="11" height="11" rx="2.5" />
    <path d="M5 15V6a2 2 0 0 1 2-2h8" />
  </svg>
);
export const Check = (p: P) => (
  <svg {...base} strokeWidth={2.2} {...p} aria-hidden="true">
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
export const Calendar = (p: P) => (
  <svg {...base} {...p} aria-hidden="true">
    <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
);
export const Mail = (p: P) => (
  <svg {...base} {...p} aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);
export const LinkedIn = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p} aria-hidden="true">
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3zM9.5 9.75h3.8v1.5h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.61 0-1.85 1.25-1.85 2.55v4.91h-3.95z" />
  </svg>
);
export const Close = (p: P) => (
  <svg {...base} strokeWidth={2} {...p} aria-hidden="true">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
