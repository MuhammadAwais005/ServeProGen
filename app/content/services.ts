/**
 * The five ServeProGen services. Capabilities come from the company knowledge
 * base; the one-line summaries are draft copy for review.
 */

export const serviceSlugs = [
  "full-stack-web",
  "ai-ml",
  "saas",
  "automation",
  "custom-software",
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

export type Service = {
  slug: ServiceSlug;
  title: string;
  summary: string;
  capabilities: string[];
};

export const services: Service[] = [
  {
    slug: "full-stack-web",
    title: "Full-Stack Web Development",
    summary: "Fast, secure web applications from interface to database.",
    capabilities: [
      "React",
      "Django",
      "REST APIs",
      "Responsive applications",
      "Authentication",
      "Database integration",
    ],
  },
  {
    slug: "ai-ml",
    title: "Artificial Intelligence & Machine Learning",
    summary: "Models and AI features that turn data and images into decisions.",
    capabilities: [
      "Machine learning",
      "Deep learning",
      "Computer vision",
      "Object detection",
      "Image classification",
      "AI-powered applications",
    ],
  },
  {
    slug: "saas",
    title: "SaaS Product Development",
    summary: "Multi-tenant products built to grow with their users.",
    capabilities: [
      "Multi-tenant applications",
      "Business dashboards",
      "Management systems",
      "Scalable software products",
    ],
  },
  {
    slug: "automation",
    title: "Business Process Automation",
    summary: "AI agents and workflows that take repetitive work off your team.",
    capabilities: ["AI agents", "Chatbots", "Workflow automation", "API integrations"],
  },
  {
    slug: "custom-software",
    title: "Custom Software Solutions",
    summary: "Software shaped around how your business actually works.",
    capabilities: [
      "Business applications",
      "Management systems",
      "Tailored digital products",
    ],
  },
];

export const getService = (slug: ServiceSlug) => services.find((s) => s.slug === slug);
