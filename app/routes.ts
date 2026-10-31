import { type RouteConfig, index, route } from "@react-router/dev/routes";
import { includeInternalPages } from "../config/content";

/**
 * Route table. Static routes are pre-rendered automatically; dynamic ones are
 * listed in react-router.config.ts. The catch-all must stay last.
 */
export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("services", "routes/services._index.tsx"),
  route("services/:slug", "routes/services.$slug.tsx"),
  route("work", "routes/work._index.tsx"),
  route("work/:slug", "routes/work.$slug.tsx"),
  route("process", "routes/process.tsx"),
  route("insights", "routes/insights._index.tsx"),
  route("insights/:slug", "routes/insights.$slug.tsx"),
  route("contact", "routes/contact.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("terms", "routes/terms.tsx"),

  // Internal review page: excluded from production builds.
  ...(includeInternalPages() ? [route("brand", "routes/brand.tsx")] : []),

  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
