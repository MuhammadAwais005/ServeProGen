import { z } from "zod";
import { serviceSlugs } from "./services";
import { projectStatuses } from "./status";

/**
 * Content schemas. Every MDX file is checked against these at build time;
 * invalid content stops the build with a readable error.
 */

const PLACEHOLDER = "[TO CONFIRM]";

/** Frontmatter fields that can be marked as not yet confirmed by the founder. */
const confirmableFields = [
  "title",
  "category",
  "summary",
  "status",
  "services",
  "stack",
  "role",
  "year",
  "links",
] as const;

export const projectSchema = z
  .object({
    title: z.string().min(1),
    category: z.string().min(1),
    summary: z.string().min(1),
    status: z.enum(projectStatuses),
    services: z.array(z.enum(serviceSlugs)).min(1),
    stack: z.array(z.string()).default([]),
    role: z.string().optional(),
    year: z.number().int().min(2000).max(2100).optional(),
    links: z
      .object({
        demo: z.url().optional(),
        repo: z.url().optional(),
      })
      .default({}),
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
    if (project.summary.includes(PLACEHOLDER)) {
      ctx.addIssue({
        code: "custom",
        path: ["summary"],
        message: "A published project cannot contain placeholder text.",
      });
    }
  });

export type ProjectFrontmatter = z.infer<typeof projectSchema>;

export const articleSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).max(180),
  date: z.iso.date(),
  updated: z.iso.date().optional(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
});

export type ArticleFrontmatter = z.infer<typeof articleSchema>;
