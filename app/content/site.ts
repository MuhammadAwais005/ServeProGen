/**
 * Company facts. Everything public about ServeProGen that is not a service,
 * process stage, project or article lives here.
 *
 * Rule: no invented facts. Unknown values stay `null` and the UI hides them
 * or shows a neutral fallback until they are confirmed.
 */

export const site = {
  name: "ServeProGen",
  tagline: "Engineering Intelligence. Building Possibilities.",
  positioning: "Premium AI & Software Engineering Studio",
  description:
    "ServeProGen designs and engineers intelligent software: AI and machine learning, computer vision, SaaS products, automation and full-stack web applications.",
  vision:
    "To become a globally recognized technology company that transforms ambitious ideas into intelligent, scalable, and impactful digital solutions.",
  mission:
    "To empower businesses and startups through innovative software engineering, artificial intelligence, and automation, delivering practical technology that solves real-world problems.",
  values: [
    "Innovation",
    "Engineering Excellence",
    "Transparency",
    "Reliability",
    "Creativity",
    "Continuous Improvement",
    "Customer-Centric Development",
  ],

  /** Contact details: to be confirmed after the domain and mailbox exist. */
  contact: {
    email: null as string | null,
    phone: null as string | null,
    whatsapp: null as string | null,
    location: null as string | null,
  },

  /** Social profiles: add a URL to show the link in the footer. */
  social: {
    linkedin: null as string | null,
    github: null as string | null,
    x: null as string | null,
    youtube: null as string | null,
  },
} as const;

export type NavItem = { label: string; to: string };

/** Primary navigation (header). Order matters. */
export const mainNav: NavItem[] = [
  { label: "Services", to: "/services" },
  { label: "Work", to: "/work" },
  { label: "Process", to: "/process" },
  { label: "Insights", to: "/insights" },
  { label: "About", to: "/about" },
];

export const primaryCta: NavItem = { label: "Start a project", to: "/contact" };

export const legalNav: NavItem[] = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms & Conditions", to: "/terms" },
];
