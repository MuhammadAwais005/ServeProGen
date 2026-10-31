/**
 * Company facts and site-wide settings: the single place to edit them.
 *
 * Rule: no invented facts. Unknown values stay `null`; the UI hides them or
 * shows a neutral fallback until they are confirmed.
 */

export const site = {
  name: "ServeProGen",
  tagline: "Engineering Intelligence. Building Possibilities.",
  positioning: "Premium AI & Software Engineering Studio",
  description:
    "ServeProGen is an AI and software engineering studio. We design and build intelligent software, AI-powered applications, SaaS products and automation for businesses and startups.",
  intro:
    "An emerging AI and software engineering studio that turns business challenges and ambitious ideas into practical, scalable and intelligent digital products.",
  vision:
    "To become a globally recognized technology company that transforms ambitious ideas into intelligent, scalable, and impactful digital solutions.",
  mission:
    "To empower businesses and startups through innovative software engineering, artificial intelligence, and automation, delivering practical technology that solves real-world problems.",

  /** Legal entity details: shown only once confirmed. */
  legal: {
    entityName: null as string | null,
    registeredAddress: null as string | null,
    jurisdiction: null as string | null,
  },

  /** Public contact details: set them here after the domain and mailbox exist. */
  contact: {
    email: null as string | null,
    phone: null as string | null,
    whatsapp: null as string | null,
    location: null as string | null,
    /** Optional booking link, e.g. a Calendly URL. */
    bookingUrl: null as string | null,
  },

  /** Social profiles: add a URL to show the link. */
  social: {
    linkedin: null as string | null,
    github: null as string | null,
    x: null as string | null,
    youtube: null as string | null,
  },

  /**
   * Founder block on the About page. Hidden while `enabled` is false.
   * Add an approved photo at public/images/founder.jpg and set `photo`.
   */
  founder: {
    enabled: false,
    name: null as string | null,
    role: "Founder",
    bio: null as string | null,
    photo: null as string | null,
    linkedin: null as string | null,
  },
} as const;

export type NavItem = { label: string; to: string; description?: string };

/** Primary navigation. Services opens a menu built from services.ts. */
export const mainNav: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Portfolio", to: "/work" },
  { label: "Insights", to: "/insights" },
  { label: "Contact", to: "/contact" },
];

export const primaryCta: NavItem = { label: "Start a Project", to: "/contact" };

export const companyNav: NavItem[] = [
  { label: "About", to: "/about" },
  { label: "Our Process", to: "/process" },
  { label: "Portfolio", to: "/work" },
  { label: "Insights", to: "/insights" },
  { label: "Contact", to: "/contact" },
];

export const legalNav: NavItem[] = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
];

/** Core values, with what each means in practice. */
export const values = [
  {
    name: "Innovation",
    text: "We look for the approach that genuinely moves the problem forward, not the one that is merely new.",
  },
  {
    name: "Engineering Excellence",
    text: "Clean architecture, tested code and documentation are part of the work, not extras.",
  },
  {
    name: "Transparency",
    text: "Clear estimates, honest progress and early warnings when something changes.",
  },
  {
    name: "Reliability",
    text: "Software that behaves predictably and keeps working after launch day.",
  },
  {
    name: "Creativity",
    text: "Thoughtful product and interface decisions that make complex systems feel simple.",
  },
  {
    name: "Continuous Improvement",
    text: "Every release and every project teaches us something we bring to the next one.",
  },
  {
    name: "Customer-Centric Development",
    text: "Features are measured by what they change for your users and your business.",
  },
] as const;

/** Real differentiators. No statistics, certifications or claims. */
export const differentiators = [
  {
    title: "Engineering-led problem solving",
    text: "We start from the problem and the constraints, then choose the technology. Not the other way round.",
  },
  {
    title: "Practical AI implementation",
    text: "AI where it adds measurable value: scoped carefully, evaluated honestly and integrated into real workflows.",
  },
  {
    title: "Software tailored to your business",
    text: "Custom systems shaped around how your team actually works, instead of forcing you into a template.",
  },
  {
    title: "Scalable architecture",
    text: "Foundations designed to grow: clean data models, sound APIs and room for the next feature.",
  },
  {
    title: "Transparent communication",
    text: "You see progress in short, reviewable increments and always know what is happening and why.",
  },
  {
    title: "Long-term product value",
    text: "Maintainable code, documentation and handover, so the product keeps paying off after launch.",
  },
] as const;

/** Capability strip on the homepage. */
export const capabilities = [
  "AI Engineering",
  "Full-Stack Development",
  "Machine Learning",
  "Computer Vision",
  "SaaS Development",
  "Intelligent Automation",
  "Deep Learning",
  "REST APIs",
] as const;

/** Technology ecosystem: only technologies the studio works with. */
export const techEcosystem = [
  {
    group: "Frontend",
    items: ["React", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS"],
  },
  { group: "Backend", items: ["Python", "Django", "Django REST Framework", "REST APIs"] },
  {
    group: "AI & Data",
    items: [
      "Machine Learning",
      "Deep Learning",
      "Computer Vision",
      "YOLO / YOLOX",
      "AI Agents",
      "scikit-learn",
    ],
  },
  { group: "Data", items: ["SQLite", "Relational databases"] },
  {
    group: "Tools",
    items: ["Git", "GitHub", "VS Code", "Streamlit", "Weights & Biases"],
  },
] as const;

/** Contact form options. */
export const budgetRanges = [
  "Not sure yet",
  "Under $1,000",
  "$1,000 – $5,000",
  "$5,000 – $15,000",
  "$15,000+",
] as const;
