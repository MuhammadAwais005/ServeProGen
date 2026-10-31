import type { Config } from "@react-router/dev/config";

/**
 * ServeProGen is deployed as static files on Hostinger shared hosting.
 * - ssr: false  → no Node server in production
 * - prerender   → every listed path becomes real HTML at build time (SEO, speed)
 *
 * Add each new public route here (Phase 2+). Dynamic routes such as
 * /work/:slug and /insights/:slug will be generated from the content folder.
 */
export default {
  ssr: false,
  prerender: ["/", "/brand", "/404"],
} satisfies Config;
