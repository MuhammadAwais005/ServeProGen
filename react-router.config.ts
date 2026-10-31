import type { Config } from "@react-router/dev/config";
import { visibleEntries } from "./config/content.ts";
import { serviceSlugs } from "./app/content/services.ts";

/**
 * ServeProGen is deployed as static files on Hostinger shared hosting.
 * - ssr: false  → no Node server in production
 * - prerender   → every path below becomes real HTML at build time (SEO, speed)
 *
 * 1. Static pages: every route in app/routes.ts without a URL parameter is
 *    included automatically by getStaticPaths().
 * 2. /404: rendered by the catch-all route; .htaccess serves it for unknown URLs.
 * 3. Service pages: one per slug in app/content/services.ts.
 * 4. Case studies and articles: one per visible MDX file. Production builds
 *    include published files only; preview builds include drafts.
 */
export default {
  ssr: false,
  async prerender({ getStaticPaths }) {
    const paths = [
      ...getStaticPaths(),
      "/404",
      ...serviceSlugs.map((slug) => `/services/${slug}`),
      ...visibleEntries("projects").map((e) => `/work/${e.slug}`),
      ...visibleEntries("insights").map((e) => `/insights/${e.slug}`),
    ];
    return [...new Set(paths)];
  },
} satisfies Config;
