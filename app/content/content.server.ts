import { z } from "zod";
import { articleSchema, projectSchema } from "./schema";

/**
 * Content index: BUILD-TIME ONLY (".server" files never reach the browser).
 *
 * Route loaders call these functions. With `ssr: false` + pre-rendering, loaders
 * run once during `npm run build`, so Zod validation and frontmatter parsing
 * cost visitors nothing. Invalid content stops the build with a readable error.
 *
 * Drop an .mdx file into content/projects or content/insights and it is picked
 * up automatically. Files starting with "_" are templates and are ignored.
 * The MDX bodies themselves are loaded per page from ./mdx.ts.
 */

type MdxModule = { frontmatter?: unknown };

const slugFromPath = (path: string) =>
  (path.split("/").pop() ?? path).replace(/\.mdx$/, "");

function parse<T extends z.ZodType>(schema: T, data: unknown, path: string): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid frontmatter in ${path}\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

const projectModules = import.meta.glob<MdxModule>(
  ["./projects/*.mdx", "!./projects/_*.mdx"],
  { eager: true },
);

const articleModules = import.meta.glob<MdxModule>(
  ["./insights/*.mdx", "!./insights/_*.mdx"],
  { eager: true },
);

const allProjects = Object.entries(projectModules)
  .map(([path, mod]) => ({
    slug: slugFromPath(path),
    ...parse(projectSchema, mod.frontmatter, path),
  }))
  .sort((a, b) => a.order - b.order);

const allArticles = Object.entries(articleModules)
  .map(([path, mod]) => ({
    slug: slugFromPath(path),
    ...parse(articleSchema, mod.frontmatter, path),
  }))
  .sort((a, b) => b.date.localeCompare(a.date));

export type ProjectMeta = (typeof allProjects)[number];
export type ArticleMeta = (typeof allArticles)[number];

/** Every project, including drafts. Internal pages only. */
export const getAllProjects = (): ProjectMeta[] => allProjects;

/** Confirmed, published projects: the only ones public pages may show. */
export const getProjects = (): ProjectMeta[] => allProjects.filter((p) => p.published);

export const getProject = (slug: string): ProjectMeta | undefined =>
  getProjects().find((p) => p.slug === slug);

export const getArticles = (): ArticleMeta[] => allArticles.filter((a) => a.published);

export const getArticle = (slug: string): ArticleMeta | undefined =>
  getArticles().find((a) => a.slug === slug);
