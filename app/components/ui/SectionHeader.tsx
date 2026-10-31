import type { ReactNode } from "react";
import { cn } from "~/lib/cn";

type SectionHeaderProps = {
  /** Two-digit section number, e.g. "01". */
  index?: string;
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "start" | "center";
  /** Heading level; h2 for page sections. */
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
};

/** Mono label ("01 / SERVICES") + display headline + optional intro. */
export function SectionHeader({
  index,
  label,
  title,
  intro,
  align = "start",
  as: Heading = "h2",
  id,
  className,
}: SectionHeaderProps) {
  return (
    <header
      className={cn(
        "flex max-w-3xl flex-col gap-5",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      <p className="text-label text-muted">
        {index && <span className="text-accent">{index}</span>}
        {index && <span aria-hidden="true"> / </span>}
        {label}
      </p>
      <Heading id={id} className={Heading === "h1" ? "text-h1" : "text-h2"}>
        {title}
      </Heading>
      {intro && <p className="text-lead text-muted">{intro}</p>}
    </header>
  );
}
