import type { SVGProps } from "react";

export type IconName =
  | "arrow"
  | "phone"
  | "pin"
  | "leaf"
  | "menu"
  | "close"
  | "bed"
  | "water"
  | "dining"
  | "music"
  | "parking"
  | "accessibility"
  | "pet"
  | "groups"
  | "image"
  | "play"
  | "star"
  | "quote";
const paths: Record<IconName, React.ReactNode> = {
  arrow: (
    <>
      <path d="M4 12h16M14 6l6 6-6 6" />
    </>
  ),
  phone: (
    <path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a14 14 0 0 1-7-7l2-2-2-5Z" />
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  leaf: (
    <>
      <path d="M20 3c-9-1-17 5-15 12 2 7 15 5 15-12Z" />
      <path d="M3 22 16 9" />
    </>
  ),
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  bed: (
    <>
      <path d="M3 18V7M21 18V7M3 15h18M3 10h18v5M7 10V7h10v3" />
    </>
  ),
  water: (
    <path d="M2 8c3-4 5 4 8 0s5 4 8 0 4 0 4 0M2 14c3-4 5 4 8 0s5 4 8 0 4 0 4 0M2 20c3-4 5 4 8 0s5 4 8 0 4 0 4 0" />
  ),
  dining: (
    <>
      <path d="M5 3v7M9 3v7M7 3v18M5 10h4M17 3v18M17 3c-4 2-4 8 0 9" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V5l11-2v13M9 8l11-2" />
      <ellipse cx="6" cy="18" rx="3" ry="2" />
      <ellipse cx="17" cy="16" rx="3" ry="2" />
    </>
  ),
  parking: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
    </>
  ),
  accessibility: (
    <>
      <circle cx="12" cy="4" r="2" />
      <path d="M4 9h16M12 7v8M12 15l-5 6M12 15l5 6" />
    </>
  ),
  pet: (
    <>
      <ellipse cx="12" cy="16" rx="5" ry="4" />
      <ellipse cx="5" cy="9" rx="2" ry="3" />
      <ellipse cx="10" cy="5" rx="2" ry="3" />
      <ellipse cx="16" cy="5" rx="2" ry="3" />
      <ellipse cx="21" cy="10" rx="2" ry="3" />
    </>
  ),
  groups: (
    <>
      <circle cx="9" cy="7" r="3" />
      <path d="M3 21v-4a6 6 0 0 1 12 0v4M17 4a3 3 0 0 1 0 6M17 13a5 5 0 0 1 4 5v3" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8" cy="8" r="2" />
      <path d="m3 18 6-6 4 4 4-6 4 7" />
    </>
  ),
  play: <path d="m8 4 13 8-13 8V4Z" />,
  star: <path d="m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z" />,
  quote: (
    <>
      <path d="M10 5H4v7h5c0 3-1 5-4 7M21 5h-6v7h5c0 3-1 5-4 7" />
    </>
  ),
};
export function Icon({
  name,
  className = "",
  ...props
}: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={`icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
