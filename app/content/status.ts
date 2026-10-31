/**
 * Shared content enums and labels. Kept free of Zod so client components can
 * import them without shipping the validation library to the browser.
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

/** Portfolio filter areas. */
export const projectAreas = [
  "web",
  "ai-ml",
  "computer-vision",
  "saas",
  "automation",
] as const;

export type ProjectArea = (typeof projectAreas)[number];

export const projectAreaLabel: Record<ProjectArea, string> = {
  web: "Web Development",
  "ai-ml": "AI & Machine Learning",
  "computer-vision": "Computer Vision",
  saas: "SaaS Applications",
  automation: "Automation",
};

/** Illustrative visuals used until real screenshots are supplied. */
export const projectVisuals = [
  "dashboard",
  "qr-menu",
  "detection",
  "classification",
  "evaluation",
] as const;

export type ProjectVisualKind = (typeof projectVisuals)[number];

export const articleCategories = [
  "Artificial Intelligence",
  "Machine Learning",
  "Computer Vision",
  "Software Engineering",
  "SaaS Development",
  "Automation",
  "Technology Insights",
] as const;

export type ArticleCategory = (typeof articleCategories)[number];
