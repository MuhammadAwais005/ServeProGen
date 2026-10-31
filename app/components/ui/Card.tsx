import type { ElementType, ReactNode } from "react";
import { cn } from "~/lib/cn";

type CardProps = {
  as?: ElementType;
  /** Adds hover glow; use when the whole card is a link target. */
  interactive?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Base surface for services, projects and articles.
 * Interactive cards: put a single <a> inside with an ::after overlay
 * (see the "stretched link" pattern in the Phase 1 spec) so the card is one tab stop.
 */
export function Card({
  as: Tag = "div",
  interactive = false,
  className,
  children,
}: CardProps) {
  return (
    <Tag
      className={cn(
        "relative rounded-card border border-border bg-surface p-6 sm:p-8",
        interactive &&
          "transition-[border-color,box-shadow,background-color] duration-(--duration-base) ease-standard " +
            "focus-within:border-accent/60 hover:border-accent/50 hover:bg-surface-raised hover:shadow-glow-sm",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
