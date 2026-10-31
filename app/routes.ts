import { type RouteConfig, index, route } from "@react-router/dev/routes";

/**
 * Phase 1 routes. Each later page is added here AND to the prerender list in
 * react-router.config.ts. The catch-all must stay last.
 */
export default [
  index("routes/home.tsx"),
  route("brand", "routes/brand.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
