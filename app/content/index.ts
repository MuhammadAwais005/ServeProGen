import projectList from "virtual:content/projects";
import articleList from "virtual:content/insights";
import type { ProjectArea } from "./status";

/**
 * Content access for routes and components.
 *
 * The lists contain only entries visible in the current mode: published ones in
 * production, everything (drafts flagged) in `npm run dev` and preview builds.
 */

export type Project = (typeof projectList)[number];
export type Article = (typeof articleList)[number];

export const isPreview = __CONTENT_PREVIEW__;

export const projects: Project[] = [...projectList].sort((a, b) => a.order - b.order);

export const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const projectsForService = (serviceSlug: string) =>
  projects.filter((p) => p.services.some((s) => s === serviceSlug));

export const projectAreasInUse = (): ProjectArea[] => [
  ...new Set(projects.flatMap((p) => p.areas)),
];

/** Published-first, newest-first; undated drafts last. */
export const articles: Article[] = [...articleList].sort((a, b) => {
  if (a.published !== b.published) return a.published ? -1 : 1;
  return (b.date ?? "").localeCompare(a.date ?? "");
});

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

/** Up to `count` other articles, same category first. */
export function relatedArticles(article: Article, count = 3) {
  const others = articles.filter((a) => a.slug !== article.slug);
  return [
    ...others.filter((a) => a.category === article.category),
    ...others.filter((a) => a.category !== article.category),
  ].slice(0, count);
}

/** The homepage preview only appears with at least three published articles. */
export const homepageArticles = () => {
  const published = articles.filter((a) => a.published);
  return published.length >= 3 ? published.slice(0, 3) : [];
};

export function formatDate(iso?: string) {
  if (!iso) return undefined;
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1)).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
