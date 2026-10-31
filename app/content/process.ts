/**
 * The ServeProGen development process. These six stage names are approved and
 * must be used identically everywhere on the site: import from here, never retype.
 * Descriptions are draft copy for review.
 */

export type ProcessStage = {
  number: string;
  slug: string;
  name: string;
  summary: string;
};

export const processStages: ProcessStage[] = [
  {
    number: "01",
    slug: "discover",
    name: "Discover",
    summary:
      "We learn your goals, users and constraints, and define what success looks like.",
  },
  {
    number: "02",
    slug: "strategize",
    name: "Strategize",
    summary:
      "We choose the approach, architecture and scope that fit your budget and timeline.",
  },
  {
    number: "03",
    slug: "design",
    name: "Design",
    summary:
      "We shape the experience and the system: interfaces, data models and integrations.",
  },
  {
    number: "04",
    slug: "engineer",
    name: "Engineer",
    summary: "We build in short, reviewable increments with clean, tested code.",
  },
  {
    number: "05",
    slug: "validate",
    name: "Validate",
    summary:
      "We test functionality, performance, security and accessibility before release.",
  },
  {
    number: "06",
    slug: "launch-evolve",
    name: "Launch & Evolve",
    summary: "We deploy, then keep improving the product as your needs grow.",
  },
];
