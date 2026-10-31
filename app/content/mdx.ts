import type { ComponentType } from "react";

/**
 * Lazy MDX bodies for case studies and articles. Each file becomes its own
 * small chunk, loaded only on its own page. Metadata comes from route loaders
 * (content.server.ts); only the rendered body ships to the browser.
 */

type MdxBody = { default: ComponentType };

const projectBodies = import.meta.glob<MdxBody>([
  "./projects/*.mdx",
  "!./projects/_*.mdx",
]);
const articleBodies = import.meta.glob<MdxBody>([
  "./insights/*.mdx",
  "!./insights/_*.mdx",
]);

export const loadProjectBody = (slug: string) =>
  projectBodies[`./projects/${slug}.mdx`]?.();
export const loadArticleBody = (slug: string) =>
  articleBodies[`./insights/${slug}.mdx`]?.();
