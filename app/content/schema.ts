import { z } from "zod";
import { serviceSlugs } from "./services";
import {
  articleCategories,
  projectAreas,
  projectStatuses,
  projectVisuals,
} from "./status";

/**
 * Content schemas. Every MDX file is validated against these when the dev server
 * or a build starts (config/content.ts). Invalid content stops the build with
 * the file name and the exact field.
 */

const PLACEHOLDER = "[TO CONFIRM]";

/** Frontmatter fields that can be marked as not yet confirmed by the founder. */
const confirmableFields = [
  "title",
  "category",
  "summary",
  "status",
  "services",
  "areas",
  "stack",
  "features",
  "role",
  "year",
  "links",
] as const;

const containsPlaceholder = (value: unknown): boolean =>
  typeof value === "string"
    ? value.includes(PLACEHOLDER)
    : Array.isArray(value)
      ? value.some(containsPlaceholder)
      : false;

export const projectSchema = z
  .object({
    title: z.string().min(1),
    category: z.string().min(1),
    summary: z.string().min(1).max(320),
    status: z.enum(projectStatuses),
    services: z.array(z.enum(serviceSlugs)).min(1),
    areas: z.array(z.enum(projectAreas)).min(1),
    stack: z.array(z.string()).default([]),
    features: z.array(z.string()).default([]),
    role: z.string().optional(),
    year: z.number().int().min(2000).max(2100).optional(),
    links: z
      .object({
        demo: z.url().optional(),
        repo: z.url().optional(),
      })
      .default({}),
    /** Illustrative visual shown until real screenshots exist. */
    visual: z.enum(projectVisuals),
    /** Real screenshots in public/projects/<slug>/; empty until supplied. */
    screenshots: z
      .array(z.object({ src: z.string().startsWith("/"), alt: z.string().min(1) }))
      .default([]),
    /** Fields still awaiting founder confirmation. Must be empty to publish. */
    unconfirmed: z.array(z.enum(confirmableFields)).default([]),
    featured: z.boolean().default(false),
    published: z.boolean().default(false),
    order: z.number().default(100),
  })
  .superRefine((project, ctx) => {
    if (!project.published) return;
    if (project.unconfirmed.length > 0) {
      ctx.addIssue({
        code: "custom",
        path: ["unconfirmed"],
        message: `Confirm these fields before publishing: ${project.unconfirmed.join(", ")}.`,
      });
    }
    if (project.status === "unconfirmed") {
      ctx.addIssue({
        code: "custom",
        path: ["status"],
        message: "A published project needs a confirmed status.",
      });
    }
    for (const field of ["summary", "category", "features", "stack"] as const) {
      if (containsPlaceholder(project[field])) {
        ctx.addIssue({
          code: "custom",
          path: [field],
          message: "A published project cannot contain placeholder text.",
        });
      }
    }
  });

export type ProjectFrontmatter = z.infer<typeof projectSchema>;

export const articleSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1).max(200),
    category: z.enum(articleCategories),
    author: z.string().default("ServeProGen"),
    /** Publication date. Required to publish; never invented for drafts. */
    date: z.iso.date().optional(),
    updated: z.iso.date().optional(),
    cover: z
      .object({ src: z.string().startsWith("/"), alt: z.string().min(1) })
      .optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    /** Marks a layout-testing sample; such articles can never be published. */
    sample: z.boolean().default(false),
    published: z.boolean().default(false),
  })
  .superRefine((article, ctx) => {
    if (!article.published) return;
    if (!article.date) {
      ctx.addIssue({
        code: "custom",
        path: ["date"],
        message: "A published article needs a publication date.",
      });
    }
    if (article.sample) {
      ctx.addIssue({
        code: "custom",
        path: ["sample"],
        message: "Sample articles are for layout testing and cannot be published.",
      });
    }
  });

export type ArticleFrontmatter = z.infer<typeof articleSchema>;
