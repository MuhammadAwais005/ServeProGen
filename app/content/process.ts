/**
 * The ServeProGen development process. The six stage names are approved and
 * must be used identically everywhere: import from here, never retype them.
 */

export type ProcessStage = {
  number: string;
  slug: string;
  name: string;
  summary: string;
  detail: string;
  activities: string[];
  outputs: string[];
};

export const processStages: ProcessStage[] = [
  {
    number: "01",
    slug: "discover",
    name: "Discover",
    summary: "Understand the business, the problem, the audience and the goals.",
    detail:
      "We learn how your business works today, who the users are, what is getting in the way and what success should look like. Constraints such as budget, timeline and existing systems are put on the table early.",
    activities: [
      "Stakeholder conversations",
      "Problem and goal definition",
      "Review of existing systems and data",
      "Requirements gathering",
    ],
    outputs: ["Shared problem statement", "Success criteria", "Initial requirements"],
  },
  {
    number: "02",
    slug: "strategize",
    name: "Strategize",
    summary: "Define the solution, architecture, priorities and delivery roadmap.",
    detail:
      "We turn what we learned into a plan: the shape of the solution, the technical direction, what to build first and how delivery will be staged. Trade-offs are explained so decisions are made together.",
    activities: [
      "Solution and architecture options",
      "Technology selection",
      "Scope and prioritisation",
      "Delivery roadmap",
    ],
    outputs: ["Architecture outline", "Prioritised scope", "Roadmap and estimate"],
  },
  {
    number: "03",
    slug: "design",
    name: "Design",
    summary: "Create user journeys, wireframes, interfaces and visual systems.",
    detail:
      "We design how the product works before writing production code: user journeys, wireframes and interfaces, plus the data models and integrations behind them. Designs are reviewed with you and refined early, when changes are cheap.",
    activities: [
      "User journeys and flows",
      "Wireframes and interface design",
      "Design system",
      "Data and API design",
    ],
    outputs: ["Approved designs", "Component system", "Technical design notes"],
  },
  {
    number: "04",
    slug: "engineer",
    name: "Engineer",
    summary: "Build the frontend, backend, integrations and AI capabilities.",
    detail:
      "We build in short, reviewable increments: front end, back end, integrations and AI components. You see working software regularly, not just a status update at the end.",
    activities: [
      "Frontend and backend development",
      "Integrations and APIs",
      "AI and data components",
      "Regular demos",
    ],
    outputs: [
      "Working increments",
      "Source code in version control",
      "Technical documentation",
    ],
  },
  {
    number: "05",
    slug: "validate",
    name: "Validate",
    summary: "Test functionality, performance, accessibility, reliability and quality.",
    detail:
      "Before release we test that everything works as specified, performs well, is accessible and handles errors gracefully. AI components are evaluated on data they have never seen.",
    activities: [
      "Functional and regression testing",
      "Performance and accessibility checks",
      "Security review",
      "Model evaluation where relevant",
    ],
    outputs: ["Test results", "Resolved issues", "Release readiness"],
  },
  {
    number: "06",
    slug: "launch-evolve",
    name: "Launch & Evolve",
    summary: "Deploy, monitor and keep improving the product over time.",
    detail:
      "We prepare and run the deployment, monitor the product once it is live and plan the next improvements based on real usage. Handover documentation means your team is never locked out.",
    activities: [
      "Deployment and launch",
      "Monitoring and support",
      "Feedback and analytics review",
      "Iteration planning",
    ],
    outputs: ["Live product", "Handover documentation", "Improvement roadmap"],
  },
];
