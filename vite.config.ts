import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig } from "vite";
import {
  contactDevApiPlugin,
  contentPlugin,
  displayFontPlugin,
} from "./config/vite-plugins";

export default defineConfig(({ command }) => {
  // The dev server previews drafts by default; production builds never do,
  // unless scripts/build.mjs --preview sets CONTENT_PREVIEW explicitly.
  if (command === "serve" && process.env.CONTENT_PREVIEW === undefined) {
    process.env.CONTENT_PREVIEW = "true";
  }

  return {
    define: {
      __CONTENT_PREVIEW__: JSON.stringify(process.env.CONTENT_PREVIEW === "true"),
    },
    plugins: [
      // MDX must run before React Router so .mdx files compile to components.
      {
        enforce: "pre",
        ...mdx({
          remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
          rehypePlugins: [rehypeSlug],
          providerImportSource: undefined,
        }),
      },
      contentPlugin(),
      contactDevApiPlugin(),
      displayFontPlugin(),
      tailwindcss(),
      reactRouter(),
    ],
    resolve: {
      tsconfigPaths: true,
    },
    build: {
      // three.js is split into the lazily loaded hero chunk; warn only above it.
      chunkSizeWarningLimit: 900,
    },
  };
});
