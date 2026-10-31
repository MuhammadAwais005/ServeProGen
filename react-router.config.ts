import type { Config } from "@react-router/dev/config";
import { publishedSlugs } from "./config/build";

/**
 * ServeProGen is deployed as static files on Hostinger shared hosting.
 * - ssr: false  → no Node server in production
 * - prerender   → every path below becomes real HTML at build time (SEO, speed)
 *
 * How pages get pre-rendered:
 * 1. Static pages: every route in app/routes.ts without a URL parameter is
 *    included automatically by getStaticPaths(). Adding a route = adding a page.
 * 2. /404: rendered by the catch-all route, listed explicitly; .htaccess serves it.
 * 3. Dynamic MDX pages: one URL per file in app/content/projects and
 *    app/content/insights with `published: true`. Drafts are never rendered.
 *    The matching routes (work/:slug, insights/:slug) arrive in Phase 2.
 */
export default {
  ssr: false,
  async prerender({ getStaticPaths }) {
    const paths = [
      ...getStaticPaths(),
      "/404",
      ...publishedSlugs("projects").map((slug) => `/work/${slug}`),
      ...publishedSlugs("insights").map((slug) => `/insights/${slug}`),
    ];
    return [...new Set(paths)];
  },
} satisfies Config;
