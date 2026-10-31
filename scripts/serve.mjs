#!/usr/bin/env node
/**
 * Serves the production build locally the way Hostinger will (see public/.htaccess):
 *   - /services        → build/client/services/index.html
 *   - /services/       → 301 to /services
 *   - unknown URLs     → build/client/404/index.html with status 404
 *   - dotfiles         → 403
 *   - /api/*.php       → forwarded to `php -S` when PHP is installed, using
 *                        server/private as the private folder (mail-config.php there)
 *
 *   npm run serve               → http://localhost:4173
 *   npm run serve -- --port 5000
 */
import { spawn, spawnSync } from "node:child_process";
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer, request } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { createGzip } from "node:zlib";

const args = process.argv.slice(2);
const port = Number(args[args.indexOf("--port") + 1]) || 4173;
const root = resolve("build", "client");
const phpPort = port + 1000;

if (!existsSync(join(root, "index.html"))) {
  console.error(
    "No build found. Run `npm run build` (or `npm run build:preview`) first.",
  );
  process.exit(1);
}

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".webmanifest": "application/manifest+json",
  ".data": "text/x-script",
};

const hasPhp = spawnSync("php", ["-v"]).status === 0;
let php;
if (hasPhp) {
  php = spawn("php", ["-S", `127.0.0.1:${phpPort}`, "-t", root], {
    env: {
      ...process.env,
      SERVEPROGEN_PRIVATE_DIR:
        process.env.SERVEPROGEN_PRIVATE_DIR ?? resolve("server", "private"),
    },
    stdio: "ignore",
  });
  let stopping = false;
  // If PHP exits on its own (usually because the port is taken by a stale server),
  // say so loudly: a leftover PHP process would answer with the wrong settings.
  php.on("exit", (code) => {
    if (stopping) return;
    console.error(
      `\n✖ PHP server on port ${phpPort} stopped (exit code ${code}).` +
        `\n  Another process may already be using that port; the contact form will not work.` +
        `\n  Stop it, or run this server with a different --port.\n`,
    );
  });
  // Always take the PHP child down with us, however this process is stopped.
  process.on("exit", () => {
    stopping = true;
    php?.kill();
  });
  for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
    process.on(signal, () => process.exit(0));
  }
}

const compressible = new Set([
  ".html",
  ".js",
  ".css",
  ".json",
  ".svg",
  ".txt",
  ".xml",
  ".data",
]);

/** Sends a file, gzip-compressed like Hostinger does for text assets. */
const send = (req, res, status, file, headers = {}) => {
  const gzip =
    compressible.has(extname(file)) &&
    /\bgzip\b/.test(req.headers["accept-encoding"] ?? "");
  res.writeHead(status, {
    "Content-Type": types[extname(file)] ?? "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
    Vary: "Accept-Encoding",
    ...(gzip && { "Content-Encoding": "gzip" }),
    ...headers,
  });
  const stream = createReadStream(file);
  (gzip ? stream.pipe(createGzip()) : stream).pipe(res);
};

createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  const path = decodeURIComponent(url.pathname);

  if (path.split("/").some((part) => part.startsWith(".") && part.length > 1)) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  if (path.startsWith("/api/") && path.endsWith(".php")) {
    if (!hasPhp) {
      res.writeHead(503, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: "not_configured" }));
      return;
    }
    const proxy = request(
      {
        host: "127.0.0.1",
        port: phpPort,
        path: req.url,
        method: req.method,
        headers: req.headers,
      },
      (upstream) => {
        res.writeHead(upstream.statusCode ?? 502, upstream.headers);
        upstream.pipe(res);
      },
    );
    proxy.on("error", () => res.writeHead(502).end());
    req.pipe(proxy);
    return;
  }

  if (path.length > 1 && path.endsWith("/")) {
    res.writeHead(301, { Location: path.slice(0, -1) + url.search }).end();
    return;
  }

  const file = normalize(join(root, path));
  if (!file.startsWith(root)) {
    res.writeHead(403).end();
    return;
  }
  const candidates = [file, join(file, "index.html")];
  const hit = candidates.find((c) => existsSync(c) && statSync(c).isFile());
  if (hit) {
    const immutable = hit.includes(`${join(root, "assets")}`);
    send(req, res, 200, hit, {
      "Cache-Control": immutable ? "public, max-age=31536000, immutable" : "no-cache",
    });
    return;
  }
  send(req, res, 404, join(root, "404", "index.html"), { "Cache-Control": "no-cache" });
}).listen(port, () => {
  console.log(`ServeProGen build → http://localhost:${port}`);
  console.log(
    hasPhp
      ? "PHP found: /api/contact.php runs with server/private/mail-config.php (if present)."
      : "PHP not found: the contact form will report that it is not configured.",
  );
});
