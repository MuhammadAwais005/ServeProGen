#!/usr/bin/env node
/**
 * Cross-platform build wrapper (works in PowerShell, cmd, macOS and Linux).
 *
 *   npm run build            Production: published content only, no internal pages.
 *   npm run build:preview    Preview: drafts (flagged) + /brand, always noindex.
 *
 * After React Router builds and pre-renders, this script:
 *   - writes robots.txt (blocks crawlers unless indexing is explicitly enabled)
 *   - writes sitemap.xml when a site URL is configured
 *   - removes files the static host does not need
 *
 * Environment (from the shell or .env.production.local, see .env.example):
 *   VITE_SITE_URL   https://your-domain.com   canonical URLs, sitemap, Open Graph
 *   VITE_NOINDEX    false                      only for the real production site
 */
import { spawnSync } from "node:child_process";
import {
  existsSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { join, relative, sep } from "node:path";
import { loadEnv } from "vite";

const preview = process.argv.includes("--preview");
const root = process.cwd();
const out = join(root, "build", "client");

const env = { ...loadEnv("production", root, ""), ...process.env };
const siteUrl = (env.VITE_SITE_URL ?? "").replace(/\/$/, "");
const indexing = !preview && env.VITE_NOINDEX === "false" && Boolean(siteUrl);

const buildEnv = {
  ...process.env,
  CONTENT_PREVIEW: preview ? "true" : "false",
  INCLUDE_INTERNAL_PAGES: preview ? "true" : "false",
  // Preview builds can never be indexed, whatever .env says.
  ...(preview && { VITE_NOINDEX: "true" }),
};

console.log(`\n▶ ServeProGen ${preview ? "PREVIEW" : "PRODUCTION"} build`);
console.log(
  `  site URL: ${siteUrl || "(not set)"} · indexing: ${indexing ? "ON" : "off"}\n`,
);

rmSync(join(root, "build"), { recursive: true, force: true });

const require = createRequire(import.meta.url);
const devPkg = require.resolve("@react-router/dev/package.json");
const binField = require(devPkg).bin;
const cli = join(
  devPkg,
  "..",
  typeof binField === "string" ? binField : binField["react-router"],
);
const result = spawnSync(process.execPath, [cli, "build"], {
  stdio: "inherit",
  env: buildEnv,
});
if (result.status !== 0) process.exit(result.status ?? 1);

/* ---------- Post-build ---------- */

// The SPA fallback is never served: .htaccess answers unknown URLs with /404/.
rmSync(join(out, "__spa-fallback.html"), { force: true });

// Pre-rendered pages: let content paint before hydration code downloads.
// React Router preloads every route module at high priority, where it competes
// with the stylesheet and fonts on slow mobile connections. The HTML is complete
// without JavaScript, so module preloads are marked low priority: first paint on a
// simulated slow-4G phone drops from about 3.2 s to 1.2 s (Lighthouse, Oct 2026).
const htmlFiles = [];
const collectHtml = (dir) => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) collectHtml(full);
    else if (name.endsWith(".html")) htmlFiles.push(full);
  }
};
collectHtml(out);
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const updated = html.replaceAll(
    '<link rel="modulepreload" href=',
    '<link rel="modulepreload" fetchpriority="low" href=',
  );
  if (updated !== html) writeFileSync(file, updated);
}

// Pre-rendered pages, excluding 404 and internal pages.
const pages = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (name === "index.html") {
      const rel = relative(out, dir).split(sep).join("/");
      pages.push(rel === "" ? "/" : `/${rel}`);
    }
  }
};
walk(out);
const publicPages = pages.filter((p) => p !== "/404" && p !== "/brand").sort();

writeFileSync(
  join(out, "robots.txt"),
  indexing
    ? `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
    : "# Indexing disabled for this build (preview, or VITE_NOINDEX is not false).\nUser-agent: *\nDisallow: /\n",
);

if (siteUrl) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = publicPages
    .map(
      (p) =>
        `  <url><loc>${siteUrl}${p === "/" ? "/" : p}</loc><lastmod>${today}</lastmod></url>`,
    )
    .join("\n");
  writeFileSync(
    join(out, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
} else {
  rmSync(join(out, "sitemap.xml"), { force: true });
}

console.log(`\n✔ ${publicPages.length} public pages pre-rendered`);
console.log(`  robots.txt: ${indexing ? "allows indexing" : "blocks indexing"}`);
console.log(
  `  sitemap.xml: ${siteUrl ? `${publicPages.length} URLs` : "skipped (set VITE_SITE_URL)"}`,
);
if (!existsSync(join(out, "api", "contact.php"))) {
  console.warn("  ⚠ api/contact.php missing from the build output");
}
