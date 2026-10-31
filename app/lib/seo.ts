import type { MetaDescriptor } from "react-router";
import { site } from "~/content/site";

/** Canonical origin, e.g. https://serveprogen.com. Empty until the domain is set. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? "").replace(/\/$/, "");
const GLOBAL_NOINDEX = import.meta.env.VITE_NOINDEX !== "false";

export const DEFAULT_OG_IMAGE = "/og/serveprogen-og.png";

export const absoluteUrl = (path: string) =>
  SITE_URL ? `${SITE_URL}${path === "/" ? "/" : path}` : undefined;

type PageMetaInput = {
  /** Page title without the brand suffix. Omit on the homepage. */
  title?: string;
  description?: string;
  /** Path starting with "/", used for the canonical URL. */
  path: string;
  noindex?: boolean;
  type?: "website" | "article";
  image?: string;
  imageAlt?: string;
  publishedTime?: string;
  modifiedTime?: string;
  /** JSON-LD objects for this page (Organization/WebSite are added on "/"). */
  jsonLd?: Record<string, unknown>[];
};

/**
 * Builds every meta tag for a route. Use in each route's `meta` export:
 *   export const meta = () => pageMeta({ title: "Services", path: "/services" });
 */
export function pageMeta({
  title,
  description = site.description,
  path,
  noindex = false,
  type = "website",
  image = DEFAULT_OG_IMAGE,
  imageAlt = `${site.name}: ${site.tagline}`,
  publishedTime,
  modifiedTime,
  jsonLd = [],
}: PageMetaInput): MetaDescriptor[] {
  const fullTitle = title ? `${title} | ${site.name}` : `${site.name} | ${site.tagline}`;
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image) ?? image;

  const tags: MetaDescriptor[] = [
    { title: fullTitle },
    { name: "description", content: description },
    { property: "og:site_name", content: site.name },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:image", content: imageUrl },
    { property: "og:image:alt", content: imageAlt },
    { property: "og:locale", content: "en_US" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
  ];

  if (url) {
    tags.push({ tagName: "link", rel: "canonical", href: url });
    tags.push({ property: "og:url", content: url });
  }
  if (publishedTime)
    tags.push({ property: "article:published_time", content: publishedTime });
  if (modifiedTime)
    tags.push({ property: "article:modified_time", content: modifiedTime });

  if (GLOBAL_NOINDEX || noindex) {
    tags.push({ name: "robots", content: "noindex, nofollow" });
  }

  const graph = path === "/" ? [organizationLd(), websiteLd(), ...jsonLd] : jsonLd;
  for (const item of graph) tags.push({ "script:ld+json": item });

  return tags;
}

/* ---------- JSON-LD builders: only confirmed facts, nothing invented ---------- */

export function organizationLd() {
  const sameAs = Object.values(site.social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    slogan: site.tagline,
    description: site.description,
    ...(SITE_URL && {
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/brand/generator-node-logo-512.png`,
    }),
    ...(site.contact.email && { email: site.contact.email }),
    ...(sameAs.length > 0 && { sameAs }),
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    description: site.description,
    ...(SITE_URL && { url: `${SITE_URL}/` }),
  };
}

export type Crumb = { label: string; to: string };

export function breadcrumbLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.label,
      ...(absoluteUrl(crumb.to) && { item: absoluteUrl(crumb.to) }),
    })),
  };
}

export function serviceLd(service: { title: string; summary: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.summary,
    serviceType: service.title,
    provider: { "@type": "Organization", name: site.name },
    ...(absoluteUrl(`/services/${service.slug}`) && {
      url: absoluteUrl(`/services/${service.slug}`),
    }),
  };
}

export function articleLd(article: {
  title: string;
  description: string;
  slug: string;
  author: string;
  date?: string;
  updated?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    author: {
      "@type": article.author === site.name ? "Organization" : "Person",
      name: article.author,
    },
    publisher: { "@type": "Organization", name: site.name },
    ...(article.date && { datePublished: article.date }),
    ...((article.updated ?? article.date) && {
      dateModified: article.updated ?? article.date,
    }),
    ...(absoluteUrl(`/insights/${article.slug}`) && {
      mainEntityOfPage: absoluteUrl(`/insights/${article.slug}`),
    }),
  };
}
