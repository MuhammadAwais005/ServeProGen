import type { MetaDescriptor } from "react-router";
import { site } from "~/content/site";

const SITE_URL = (import.meta.env.VITE_SITE_URL ?? "").replace(/\/$/, "");
const GLOBAL_NOINDEX = import.meta.env.VITE_NOINDEX !== "false";

type PageMetaInput = {
  /** Page title without the brand suffix. Omit on the homepage. */
  title?: string;
  description?: string;
  /** Path starting with "/", used for the canonical URL. */
  path: string;
  /** Force noindex for this page (e.g. internal pages). */
  noindex?: boolean;
  type?: "website" | "article";
};

/**
 * Builds the meta tags for a route. Use in every route's `meta` export:
 *   export const meta = () => pageMeta({ title: "Services", path: "/services" });
 */
export function pageMeta({
  title,
  description = site.description,
  path,
  noindex = false,
  type = "website",
}: PageMetaInput): MetaDescriptor[] {
  const fullTitle = title ? `${title} | ${site.name}` : `${site.name} | ${site.tagline}`;

  const tags: MetaDescriptor[] = [
    { title: fullTitle },
    { name: "description", content: description },
    { property: "og:site_name", content: site.name },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { name: "twitter:card", content: "summary_large_image" },
  ];

  if (SITE_URL) {
    const url = `${SITE_URL}${path === "/" ? "" : path}` || SITE_URL;
    tags.push({ tagName: "link", rel: "canonical", href: url });
    tags.push({ property: "og:url", content: url });
  }

  if (GLOBAL_NOINDEX || noindex) {
    tags.push({ name: "robots", content: "noindex, nofollow" });
  }

  return tags;
}
