import { defineConfig } from "vitest/config";

export default defineConfig({
  define: {
    __CONTENT_PREVIEW__: "false",
  },
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
  },
});
