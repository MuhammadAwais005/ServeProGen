import type { ServiceIconKind } from "~/content/services";
import { cn } from "~/lib/cn";

/**
 * Service glyphs drawn on the same 24-unit grid and stroke weight as the
 * Generator Node logo. One orange node per glyph: the signal.
 */
const glyphs: Record<ServiceIconKind, React.ReactNode> = {
  // Full-stack: three stacked layers joined by one path
  stack: (
    <>
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 6v6M16 12v6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="1.5 2"
      />
      <circle cx="16" cy="18" r="2.2" fill="var(--color-accent)" />
    </>
  ),
  // AI & ML: a small neural layer
  neural: (
    <>
      <path
        d="M5 6l7 6M5 18l7-6M5 6l7 0M12 12l7-6M12 12l7 6"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <circle cx="5" cy="6" r="1.8" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="5" cy="18" r="1.8" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="19" cy="6" r="1.8" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="19" cy="18" r="2.2" fill="var(--color-accent)" />
    </>
  ),
  // SaaS: isolated tenant cells sharing one foundation
  tenant: (
    <>
      <rect
        x="4"
        y="4"
        width="7"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="13"
        y="4"
        width="7"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="4"
        y="13"
        width="7"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="13"
        y="13"
        width="7"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="16.5" cy="16.5" r="2" fill="var(--color-accent)" />
    </>
  ),
  // Automation: a looping flow with a trigger
  flow: (
    <>
      <path
        d="M6 8h9.4L17 9.6v4.8L15.4 16H8.6L7 14.4V12"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M5 10.5 7 12l2-1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="4.5" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="19.5" cy="12" r="2.2" fill="var(--color-accent)" />
    </>
  ),
  // Custom software: a blueprint frame with a measured corner
  blueprint: (
    <>
      <path d="M4 4h12l4 4v12H4z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 4v4h4" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8 11h8M8 15h5" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="16" cy="15" r="2" fill="var(--color-accent)" />
    </>
  ),
};

export function ServiceIcon({
  kind,
  size = 24,
  className,
}: {
  kind: ServiceIconKind;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0 text-text", className)}
    >
      {glyphs[kind]}
    </svg>
  );
}
