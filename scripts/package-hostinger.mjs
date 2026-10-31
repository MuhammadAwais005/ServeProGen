#!/usr/bin/env node
/**
 * Packages the BUILT site for Hostinger: `npm run package:hostinger`
 * (run `npm run build` first, with the production settings you want).
 *
 * Output: exports/serveprogen-hostinger-<sha>.zip containing
 *   public_html/   → contents of build/client (upload into the domain's public_html)
 *   private/       → PHPMailer, the mail-config TEMPLATE and storage rules
 *                    (upload next to public_html, NOT inside it)
 *   UPLOAD.txt     → where each folder goes
 *
 * Safety:
 *   - refuses preview builds (they contain drafts and internal pages)
 *   - never includes a real mail-config.php, .env files or keys
 *   - pure Node (no zip tool needed), works on Windows, macOS and Linux
 */
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join, relative, sep } from "node:path";
import { deflateRawSync } from "node:zlib";

const root = process.cwd();
const client = join(root, "build", "client");
const privateSrc = join(root, "server", "private");

const die = (msg) => {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
};

if (!existsSync(join(client, "index.html")))
  die("No build found. Run `npm run build` first.");
// /brand/index.html is the internal review page; public/brand/ (logo files) is fine.
if (existsSync(join(client, "brand", "index.html"))) {
  die(
    "This is a PREVIEW build (it contains /brand and drafts). Run `npm run build` instead.",
  );
}

const robots = readFileSync(join(client, "robots.txt"), "utf8");
const indexing = !/Disallow: \//.test(robots);
const hasSitemap = existsSync(join(client, "sitemap.xml"));

/* ---------- Collect files ---------- */

const FORBIDDEN =
  /(^|\/)(\.env(\.(?!example$).*)?|mail-config\.php|.*\.(pem|key|p12|pfx))$/;

/** @type {{ name: string, data: Buffer }[]} */
const entries = [];
const addTree = (dir, prefix, filter = () => true) => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const rel = `${prefix}/${relative(dir, full).split(sep).join("/")}`;
    if (statSync(full).isDirectory()) addTree(full, rel, filter);
    else if (filter(rel)) {
      if (FORBIDDEN.test(rel)) die(`Refusing to package a secret-looking file: ${rel}`);
      entries.push({ name: rel, data: readFileSync(full) });
    }
  }
};

addTree(client, "public_html");
// Private folder: template + vendor + storage rules only. A real mail-config.php
// (if one exists locally) is deliberately skipped.
addTree(privateSrc, "private", (rel) => !rel.endsWith("/mail-config.php"));

entries.push({
  name: "UPLOAD.txt",
  data: Buffer.from(
    [
      "ServeProGen: Hostinger upload",
      "================================",
      "",
      "On Hostinger the domain folder looks like:",
      "  /home/<account>/domains/<your-domain>/",
      "      public_html/   <- upload the CONTENTS of this zip's public_html/ here",
      "      private/       <- upload this zip's private/ folder here (next to public_html)",
      "",
      "Then, on the server only:",
      "  1. Copy private/mail-config.example.php to private/mail-config.php",
      "  2. Fill in the real values (keep mode 'dry_run' until the mailbox exists)",
      "  3. Make private/storage writable by PHP (755 on Hostinger is normal)",
      "",
      `This build: indexing ${indexing ? "ON" : "OFF (noindex)"}, sitemap ${hasSitemap ? "included" : "not included"}.`,
      "Full guide: docs/DEPLOYMENT.md in the source repository.",
      "",
    ].join("\n"),
  ),
});

/* ---------- Minimal ZIP writer (deflate) ---------- */

const crcTable = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

const now = new Date();
const dosTime =
  (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
const dosDate =
  ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();

const chunks = [];
const central = [];
let offset = 0;
for (const { name, data } of entries) {
  const nameBuf = Buffer.from(name, "utf8");
  const compressed = deflateRawSync(data, { level: 9 });
  const useDeflate = compressed.length < data.length;
  const body = useDeflate ? compressed : data;
  const crc = crc32(data);

  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4);
  local.writeUInt16LE(0x0800, 6); // UTF-8 names
  local.writeUInt16LE(useDeflate ? 8 : 0, 8);
  local.writeUInt16LE(dosTime, 10);
  local.writeUInt16LE(dosDate, 12);
  local.writeUInt32LE(crc, 14);
  local.writeUInt32LE(body.length, 18);
  local.writeUInt32LE(data.length, 22);
  local.writeUInt16LE(nameBuf.length, 26);
  chunks.push(local, nameBuf, body);

  const cd = Buffer.alloc(46);
  cd.writeUInt32LE(0x02014b50, 0);
  cd.writeUInt16LE(20, 4);
  cd.writeUInt16LE(20, 6);
  cd.writeUInt16LE(0x0800, 8);
  cd.writeUInt16LE(useDeflate ? 8 : 0, 10);
  cd.writeUInt16LE(dosTime, 12);
  cd.writeUInt16LE(dosDate, 14);
  cd.writeUInt32LE(crc, 16);
  cd.writeUInt32LE(body.length, 20);
  cd.writeUInt32LE(data.length, 24);
  cd.writeUInt16LE(nameBuf.length, 28);
  cd.writeUInt32LE(offset, 42);
  central.push(cd, nameBuf);

  offset += local.length + nameBuf.length + body.length;
}
const centralBuf = Buffer.concat(central);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(entries.length, 8);
end.writeUInt16LE(entries.length, 10);
end.writeUInt32LE(centralBuf.length, 12);
end.writeUInt32LE(offset, 16);

let sha = "local";
try {
  sha = execFileSync("git", ["rev-parse", "--short", "HEAD"], {
    encoding: "utf8",
  }).trim();
} catch {
  // not a git checkout: keep "local"
}
mkdirSync("exports", { recursive: true });
const out = join("exports", `serveprogen-hostinger-${sha}.zip`);
writeFileSync(out, Buffer.concat([...chunks, centralBuf, end]));

const pages = entries.filter((e) => e.name.endsWith("/index.html")).length;
console.log(`\n✔ ${out}`);
console.log(
  `  ${entries.length} files · ${pages} HTML pages · indexing ${indexing ? "ON" : "OFF"}`,
);
if (!indexing) {
  console.log(
    "  (noindex build: right for staging. For launch set VITE_SITE_URL and VITE_NOINDEX=false.)",
  );
}
