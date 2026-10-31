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
} from "./config/vite-plugins.ts";

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
    // Dev server only: pre-bundle libraries that are imported lazily (scroll effects,
    // the 3D hero, the contact form). Without this, the first `npm run dev` on a new
    // machine discovers them mid-page, reloads, and briefly shows React hook errors.
    optimizeDeps: {
      include: [
        "gsap",
        "gsap/ScrollTrigger",
        "lenis",
        "lucide-react",
        "motion/react",
        "react-hook-form",
        "@hookform/resolvers/zod",
        "zod",
        "three",
        "@react-three/fiber",
      ],
    },
    build: {
      // The only chunk above 500 kB is the Neural Lattice hero (three.js + React
      // Three Fiber, ~920 kB raw / ~240 kB gzip). It is never on the critical path:
      // it loads after the page is visible, only on capable devices, and never under
      // reduced motion or on low-power devices (see useDeviceTier). Any other chunk
      // growing past 1 MB still warns.
      chunkSizeWarningLimit: 1000,
    },
  };
});
