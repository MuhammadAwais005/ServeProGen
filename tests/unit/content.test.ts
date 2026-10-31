import { describe, expect, it } from "vitest";
import { loadCollection } from "../../config/content";
import { articleSchema, projectSchema } from "../../app/content/schema";
import { processStages } from "../../app/content/process";
import { serviceSlugs, services } from "../../app/content/services";

const baseProject = {
  title: "Example",
  category: "Computer Vision",
  summary: "A real, confirmed summary.",
  status: "live",
  services: ["ai-ml"],
  areas: ["ai-ml"],
  visual: "detection",
};

describe("content files", () => {
  it("every project and article file is valid", () => {
    expect(() => loadCollection("projects")).not.toThrow();
    expect(() => loadCollection("insights")).not.toThrow();
  });

  it("keeps every project unpublished until the founder confirms it", () => {
    for (const project of loadCollection("projects")) {
      expect(project.meta.published, project.slug).toBe(false);
    }
  });

  it("never claims unconfirmed Dastarkhwan features", () => {
    const dastarkhwan = loadCollection("projects").find((p) => p.slug === "dastarkhwan");
    const text = JSON.stringify(dastarkhwan?.meta).toLowerCase();
    for (const claim of ["gemini", "channels", "order routing", "pickup", "takeaway"]) {
      expect(text, claim).not.toContain(claim);
    }
  });

  it("sample articles are drafts", () => {
    for (const article of loadCollection("insights")) {
      if (article.meta.sample) expect(article.meta.published).toBe(false);
    }
  });

  it("builds a table of contents with anchor ids", () => {
    const article = loadCollection("insights").find(
      (a) => a.slug === "from-dataset-to-edge",
    );
    expect(article?.toc[0]).toEqual({
      depth: 2,
      text: "Start with the decision, not the model",
      id: "start-with-the-decision-not-the-model",
    });
  });
});

describe("publishing gates", () => {
  it("accepts a fully confirmed published project", () => {
    expect(projectSchema.safeParse({ ...baseProject, published: true }).success).toBe(
      true,
    );
  });

  it("blocks publishing with unconfirmed fields", () => {
    const r = projectSchema.safeParse({
      ...baseProject,
      published: true,
      unconfirmed: ["status"],
    });
    expect(r.success).toBe(false);
  });

  it("blocks publishing with an unconfirmed status", () => {
    const r = projectSchema.safeParse({
      ...baseProject,
      published: true,
      status: "unconfirmed",
    });
    expect(r.success).toBe(false);
  });

  it("blocks publishing with placeholder text", () => {
    const r = projectSchema.safeParse({
      ...baseProject,
      published: true,
      features: ["[TO CONFIRM] something"],
    });
    expect(r.success).toBe(false);
  });

  it("requires a date to publish an article and never publishes samples", () => {
    const article = { title: "T", description: "D", category: "Automation" };
    expect(articleSchema.safeParse({ ...article, published: true }).success).toBe(false);
    expect(
      articleSchema.safeParse({ ...article, published: true, date: "2026-11-01" })
        .success,
    ).toBe(true);
    expect(
      articleSchema.safeParse({
        ...article,
        published: true,
        date: "2026-11-01",
        sample: true,
      }).success,
    ).toBe(false);
  });
});

describe("structured content", () => {
  it("uses the six approved process stage names, in order", () => {
    expect(processStages.map((s) => s.name)).toEqual([
      "Discover",
      "Strategize",
      "Design",
      "Engineer",
      "Validate",
      "Launch & Evolve",
    ]);
  });

  it("defines all five services with FAQs and capabilities", () => {
    expect(services.map((s) => s.slug)).toEqual([...serviceSlugs]);
    for (const s of services) {
      expect(s.capabilities.length, s.slug).toBeGreaterThan(3);
      expect(s.faqs.length, s.slug).toBeGreaterThan(1);
    }
  });
});
