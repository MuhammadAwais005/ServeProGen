import { existsSync } from "node:fs";
import { resolve } from "node:path";
import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig, type Plugin } from "vite";

/**
 * Clash Display is licensed separately and added by hand (public/fonts/README.md).
 * This plugin emits its @font-face only when the file exists, so a missing font
 * never causes a 404 request or a build warning; headings fall back to Geist.
 * After adding the file, restart `npm run dev`.
 */
function displayFont(): Plugin {
  const virtualId = "virtual:display-font.css";
  const resolvedId = `\0${virtualId}`;
  const fontFile = resolve(
    import.meta.dirname,
    "public/fonts/ClashDisplay-Variable.woff2",
  );

  return {
    name: "serveprogen:display-font",
    resolveId(id) {
      return id === virtualId ? resolvedId : undefined;
    },
    load(id) {
      if (id !== resolvedId) return undefined;
      if (!existsSync(fontFile)) {
        return "/* Clash Display not installed: headings use the Geist fallback. */";
      }
      return `@font-face {
  font-family: "Clash Display";
  src: url("/fonts/ClashDisplay-Variable.woff2") format("woff2");
  font-weight: 200 700;
  font-style: normal;
  font-display: swap;
}`;
    },
  };
}

export default defineConfig({
  plugins: [
    // MDX must run before React Router so .mdx files compile to components.
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
        providerImportSource: undefined,
      }),
    },
    displayFont(),
    tailwindcss(),
    reactRouter(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
