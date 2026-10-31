import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { z } from "zod";
import { articleSchema, projectSchema } from "../app/content/schema";

/**
 * Build-time helpers shared by app/routes.ts and react-router.config.ts.
 * Loaded by React Router's tooling before bundling (also on `npm run dev`),
 * so content errors surface first, with the file name and the exact problem.
 */

const CONTENT_DIR = join(import.meta.dirname, "..", "app", "content");

/**
 * Internal pages (e.g. /brand) are for review only. They are included by default
 * (local, staging) and removed from production builds with:
 *   INCLUDE_INTERNAL_PAGES=false npm run build
 * The production deploy workflow (Phase 5) sets this variable.
 */
export const includeInternalPages = process.env.INCLUDE_INTERNAL_PAGES !== "false";

const collections = {
  projects: projectSchema,
  insights: articleSchema,
} as const;

type Collection = keyof typeof collections;

function readFrontmatter(file: string): unknown {
  const source = readFileSync(file, "utf8");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match?.[1] ? parse(match[1]) : undefined;
}

/** Validates every MDX file in a collection; throws a readable error on the first problem. */
function validate(collection: Collection) {
  const dir = join(CONTENT_DIR, collection);
  if (!existsSync(dir)) return [];

  return readdirSync(dir)
    .filter((file) => file.endsWith(".mdx") && !file.startsWith("_"))
    .sort()
    .map((file) => {
      const result = collections[collection].safeParse(readFrontmatter(join(dir, file)));
      if (!result.success) {
        throw new Error(
          `\n\nContent error in app/content/${collection}/${file}:\n` +
            `${z.prettifyError(result.error)}\n`,
        );
      }
      return { slug: file.replace(/\.mdx$/, ""), published: result.data.published };
    });
}

/** Slugs of valid MDX files with `published: true`. Drafts are never pre-rendered. */
export function publishedSlugs(collection: Collection): string[] {
  return validate(collection)
    .filter((entry) => entry.published)
    .map((entry) => entry.slug);
}
