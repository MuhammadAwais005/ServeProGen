import { type RouteConfig, index, route } from "@react-router/dev/routes";
import { includeInternalPages } from "../config/build";

/**
 * Route table. Static routes listed here are pre-rendered automatically
 * (see react-router.config.ts). The catch-all must stay last.
 */
export default [
  index("routes/home.tsx"),

  // Internal review page: excluded from production builds.
  ...(includeInternalPages ? [route("brand", "routes/brand.tsx")] : []),

  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
