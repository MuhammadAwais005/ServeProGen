#!/usr/bin/env node
/**
 * Creates a clean source ZIP for sharing: `npm run package`
 *
 * - Packs only files committed to Git (git archive of HEAD), so node_modules,
 *   build output, .react-router, .git and anything in .gitignore are never included.
 * - Refuses to run if a tracked file looks like a secret (real .env files,
 *   server mail config, keys, certificates).
 * - Warns when there are uncommitted changes, because they are NOT in the ZIP.
 *
 * Output: exports/serveprogen-web-<short-sha>.zip (exports/ is git-ignored).
 * Works on Windows, macOS and Linux (needs Git on the PATH).
 */
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();

const FORBIDDEN = [
  { pattern: /(^|\/)\.env($|\.(?!example$))/, reason: "environment file" },
  { pattern: /(^|\/)node_modules\//, reason: "dependencies" },
  { pattern: /(^|\/)(build|\.react-router|exports)\//, reason: "build output" },
  { pattern: /(^|\/)mail-config\.php$/, reason: "mail credentials" },
  { pattern: /(^|\/)mail\.php$/, reason: "mail credentials" },
  {
    pattern: /^server\/private\/storage\/(?!\.gitkeep$|\.htaccess$).+/,
    reason: "server runtime data",
  },
  { pattern: /\.(pem|key|p12|pfx|crt)$/i, reason: "key or certificate" },
  { pattern: /(^|\/)id_(rsa|ed25519|ecdsa)(\.pub)?$/, reason: "SSH key" },
];

const files = git("ls-tree", "-r", "--name-only", "HEAD").split("\n").filter(Boolean);
const problems = files.flatMap((file) =>
  FORBIDDEN.filter(({ pattern }) => pattern.test(file)).map(
    ({ reason }) => `${file} (${reason})`,
  ),
);

if (problems.length > 0) {
  console.error("Refusing to package. These committed files must not be shared:");
  for (const p of problems) console.error(`  - ${p}`);
  console.error(
    "Remove them from Git (git rm --cached <file>) and add them to .gitignore.",
  );
  process.exit(1);
}

const dirty = git("status", "--porcelain");
if (dirty) {
  console.warn(
    "Warning: you have uncommitted changes. They are NOT included in the ZIP:",
  );
  console.warn(
    dirty
      .split("\n")
      .map((l) => `  ${l}`)
      .join("\n"),
  );
}

const sha = git("rev-parse", "--short", "HEAD");
mkdirSync("exports", { recursive: true });
const out = join("exports", `serveprogen-web-${sha}.zip`);

execFileSync("git", [
  "archive",
  "--format=zip",
  "--prefix=serveprogen-web/",
  "-o",
  out,
  "HEAD",
]);
console.log(`Packaged ${files.length} committed files → ${out}`);
