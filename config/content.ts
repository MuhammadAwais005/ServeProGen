import GithubSlugger from "github-slugger";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parse } from "yaml";
import { z } from "zod";
import { articleSchema, projectSchema } from "../app/content/schema.ts";

/**
 * Build-time content index (Node only).
 *
 * Used by react-router.config.ts (which URLs to pre-render) and by the Vite
 * content plugin (which entries exist in the app at all). Drafts are excluded
 * from production builds at the module level, so their text never reaches the
 * browser bundle.
 */

export const CONTENT_DIR = resolve(import.meta.dirname, "..", "app", "content");

/**
 * Preview mode shows drafts with a visible "Draft" banner. It is ON for
 * `npm run dev` and `npm run build:preview`, OFF for `npm run build`.
 */
export const isContentPreview = () => process.env.CONTENT_PREVIEW === "true";

/** Internal review pages (/brand). Off for production builds. */
export const includeInternalPages = () => process.env.INCLUDE_INTERNAL_PAGES !== "false";

const collections = {
  projects: projectSchema,
  insights: articleSchema,
} as const;

export type Collection = keyof typeof collections;

export type TocItem = { depth: 2 | 3; text: string; id: string };

export type ContentEntry<C extends Collection> = {
  slug: string;
  file: string;
  meta: z.infer<(typeof collections)[C]>;
  readingMinutes: number;
  toc: TocItem[];
};

/** Headings for the table of contents; ids match rehype-slug's output. */
function tableOfContents(body: string): TocItem[] {
  const slugger = new GithubSlugger();
  const withoutCode = body.replace(/```[\s\S]*?```/g, "");
  return [...withoutCode.matchAll(/^(#{2,3})\s+(.+?)\s*#*\s*$/gm)].map((m) => {
    const text = m[2]!.replace(/[*_`]/g, "").replace(/\[(.+?)\]\(.+?\)/g, "$1");
    return { depth: m[1]!.length as 2 | 3, text, id: slugger.slug(text) };
  });
}

function splitFrontmatter(source: string) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  return { data: match?.[1] ? parse(match[1]) : undefined, body: match?.[2] ?? source };
}

function readingMinutes(body: string) {
  const words = body
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  // 200 words per minute, rounded up: a 1.4-minute read is shown as 2 min.
  return Math.max(1, Math.ceil(words / 200));
}

/** All valid entries in a collection, drafts included. Throws on invalid content. */
export function loadCollection<C extends Collection>(collection: C): ContentEntry<C>[] {
  const dir = join(CONTENT_DIR, collection);
  if (!existsSync(dir)) return [];

  return readdirSync(dir)
    .filter((name) => name.endsWith(".mdx") && !name.startsWith("_"))
    .sort()
    .map((name) => {
      const file = join(dir, name);
      const { data, body } = splitFrontmatter(readFileSync(file, "utf8"));
      const result = collections[collection].safeParse(data);
      if (!result.success) {
        throw new Error(
          `\n\nContent error in app/content/${collection}/${name}:\n` +
            `${z.prettifyError(result.error)}\n`,
        );
      }
      return {
        slug: name.replace(/\.mdx$/, ""),
        file,
        meta: result.data as ContentEntry<C>["meta"],
        readingMinutes: readingMinutes(body),
        toc: tableOfContents(body),
      };
    });
}

/** Entries visible in the current mode: published only, or everything in preview. */
export function visibleEntries<C extends Collection>(collection: C): ContentEntry<C>[] {
  const preview = isContentPreview();
  return loadCollection(collection).filter((entry) => preview || entry.meta.published);
}
