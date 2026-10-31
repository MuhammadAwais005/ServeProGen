/**
 * Project statuses. Kept separate from the Zod schema so client components
 * (e.g. StatusBadge) can use the labels without shipping Zod to the browser.
 */

export const projectStatuses = [
  "live",
  "in-development",
  "prototype",
  "research",
  "completed",
  "unconfirmed",
] as const;

export type ProjectStatus = (typeof projectStatuses)[number];

export const projectStatusLabel: Record<ProjectStatus, string> = {
  live: "Live",
  "in-development": "In development",
  prototype: "Prototype",
  research: "Research",
  completed: "Completed",
  unconfirmed: "Status to confirm",
};
