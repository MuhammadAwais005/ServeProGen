import { cn } from "~/lib/cn";

/**
 * Generator Node: one stroke crosses a 3x3 node lattice in an S, from a hollow
 * input ring to a single orange output node.
 * Construction: 24-unit grid, nodes at 4 / 12 / 20, 2-unit stroke, 45° chamfers.
 * Below 24px rendered size, use variant="small" (ring becomes a solid dot, heavier stroke).
 */

const PATH = "M17.8 4H5.6L4 5.6v4.8L5.6 12h12.8l1.6 1.6v4.8L18.4 20H6.6";
const PATH_SMALL = "M17.6 4H5.6L4 5.6v4.8L5.6 12h12.8l1.6 1.6v4.8L18.4 20H6.6";

type LogoMarkProps = {
  size?: number;
  variant?: "default" | "small";
  /** Accessible name. Pass null when the mark sits next to visible brand text. */
  title?: string | null;
  className?: string;
};

export function LogoMark({
  size = 32,
  variant = "default",
  title = "ServeProGen",
  className,
}: LogoMarkProps) {
  const small = variant === "small";
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={cn("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title ?? undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path
        d={small ? PATH_SMALL : PATH}
        stroke="currentColor"
        strokeWidth={small ? 2.4 : 2}
      />
      {small ? (
        <circle cx="20" cy="4" r="2.4" fill="currentColor" />
      ) : (
        <circle cx="20" cy="4" r="2.2" stroke="currentColor" strokeWidth="1.2" />
      )}
      <circle cx="4" cy="20" r={small ? 2.9 : 2.6} fill="var(--color-accent)" />
    </svg>
  );
}

type LogoProps = {
  className?: string;
  markSize?: number;
};

/** Horizontal lockup: mark + wordmark. The wordmark is live text for accessibility. */
export function Logo({ className, markSize = 28 }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-text", className)}>
      <LogoMark size={markSize} title={null} />
      <span className="font-display text-[1.25rem] leading-none font-semibold tracking-[-0.015em]">
        ServeProGen
      </span>
    </span>
  );
}
