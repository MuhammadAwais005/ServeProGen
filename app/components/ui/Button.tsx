import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router";
import { cn } from "~/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap select-none " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-(--duration-base) ease-standard " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  // Dark text on orange: 7.21:1. White on orange would fail (2.53:1).
  primary: "bg-accent text-on-accent hover:bg-accent-soft hover:shadow-glow",
  secondary:
    "border border-border-strong text-text hover:border-accent-soft hover:bg-surface-raised",
  ghost: "text-text hover:text-accent-soft",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-small", // 44px: minimum touch target
  lg: "h-13 px-7 text-body",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type AsInternalLink = CommonProps & { to: string; href?: never };
type AsExternalLink = CommonProps & { href: string; to?: never } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "className" | "children"
  >;
type AsButton = CommonProps & { to?: never; href?: never } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "className" | "children"
  >;

export type ButtonProps = AsInternalLink | AsExternalLink | AsButton;

/**
 * One button for every call to action.
 * - `to`   → internal link (React Router)
 * - `href` → external link (opens safely in a new tab)
 * - none   → <button>, defaults to type="button"
 */
export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("to" in props && props.to) {
    return (
      <Link
        to={props.to}
        className={cn("group", classes)}
        prefetch="intent"
        viewTransition
      >
        {children}
      </Link>
    );
  }

  if ("href" in props && props.href) {
    const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
    return (
      <a {...rest} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  const {
    variant: _v,
    size: _s,
    className: _c,
    children: _ch,
    ...rest
  } = props as AsButton;
  return (
    <button type="button" {...rest} className={cn("group", classes)}>
      {children}
    </button>
  );
}

/** Arrow used in CTAs. Decorative: hidden from screen readers. */
export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      aria-hidden="true"
      className={cn(
        "transition-transform duration-(--duration-base) ease-standard group-hover:translate-x-0.5",
        className,
      )}
    >
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
