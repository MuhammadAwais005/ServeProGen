import type { ReactNode } from "react";
import { projectStatusLabel, type ProjectStatus } from "~/content/status";
import { cn } from "~/lib/cn";

const dotColor: Record<ProjectStatus, string> = {
  live: "bg-success",
  "in-development": "bg-accent",
  prototype: "bg-accent-soft",
  research: "bg-muted",
  completed: "bg-muted",
  unconfirmed: "bg-border-strong",
};

/** Honest project status. Text carries the meaning; the dot is a visual cue only. */
export function StatusBadge({
  status,
  className,
}: {
  status: ProjectStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[0.8125rem] leading-5 text-text",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", dotColor[status])}
      />
      {projectStatusLabel[status]}
    </span>
  );
}

/** Technology tag, e.g. "React", "YOLOX-S". */
export function TechTag({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-field border border-border px-2 py-1 font-mono text-[0.75rem] leading-4 text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
