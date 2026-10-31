import { existsSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";
import { CONTENT_DIR, visibleEntries, type Collection } from "./content";

/**
 * Content plugin. Exposes four virtual modules:
 *
 *   virtual:content/projects        metadata only (lists, cards, filters)
 *   virtual:content/project-bodies  compiled MDX bodies (case-study route only)
 *   virtual:content/insights        metadata only
 *   virtual:content/insight-bodies  compiled MDX bodies (article route only)
 *
 * Only entries visible in the current mode are emitted, so draft text is never
 * bundled into a production build. Adding or removing an .mdx file reloads dev.
 */
export function contentPlugin(): Plugin {
  const prefix = "virtual:content/";
  const modules: Record<string, { collection: Collection; bodies: boolean }> = {
    projects: { collection: "projects", bodies: false },
    "project-bodies": { collection: "projects", bodies: true },
    insights: { collection: "insights", bodies: false },
    "insight-bodies": { collection: "insights", bodies: true },
  };

  return {
    name: "serveprogen:content",
    resolveId(id) {
      if (id.startsWith(prefix) && id.slice(prefix.length) in modules) return `\0${id}`;
      return undefined;
    },
    load(id) {
      if (!id.startsWith(`\0${prefix}`)) return undefined;
      const spec = modules[id.slice(prefix.length + 1)];
      if (!spec) return undefined;
      const entries = visibleEntries(spec.collection);

      // Watch every content file so frontmatter edits rebuild this module.
      for (const entry of entries) this.addWatchFile(entry.file);

      if (!spec.bodies) {
        const data = entries.map(({ slug, meta, readingMinutes, toc }) => ({
          slug,
          readingMinutes,
          toc,
          ...meta,
        }));
        return `export default ${JSON.stringify(data)};`;
      }

      const imports = entries
        .map(
          (e, i) => `import B${i} from ${JSON.stringify(e.file.replaceAll("\\", "/"))};`,
        )
        .join("\n");
      const map = entries.map((e, i) => `${JSON.stringify(e.slug)}: B${i}`).join(",\n");
      return `${imports}\nexport default {\n${map}\n};`;
    },
    configureServer(server) {
      const reload = (file: string) => {
        if (!file.startsWith(CONTENT_DIR) || !file.endsWith(".mdx")) return;
        for (const name of Object.keys(modules)) {
          const mod = server.moduleGraph.getModuleById(`\0${prefix}${name}`);
          if (mod) server.moduleGraph.invalidateModule(mod);
        }
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("add", reload);
      server.watcher.on("unlink", reload);
      server.watcher.on("change", reload);
    },
  };
}

/**
 * Local stand-in for public/api/contact.php while running `npm run dev`
 * (Vite cannot execute PHP). It validates with the same Zod schema as the form
 * and always answers in dry-run mode: nothing is ever sent, and the UI says so.
 * To test the real PHP endpoint locally, see docs/CONTACT-FORM.md.
 */
export function contactDevApiPlugin(): Plugin {
  return {
    name: "serveprogen:contact-dev-api",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api/contact.php", (req, res) => {
        const send = (status: number, body: unknown) => {
          res.statusCode = status;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
        };
        if (req.method !== "POST") return send(405, { ok: false, error: "method" });

        let raw = "";
        req.on("data", (chunk: Buffer) => {
          raw += chunk.toString();
          if (raw.length > 20_000) req.destroy();
        });
        req.on("end", async () => {
          try {
            const { contactSchema } = await server.ssrLoadModule("/app/lib/contact.ts");
            const parsed = contactSchema.safeParse(JSON.parse(raw || "{}"));
            if (!parsed.success) {
              const fields: Record<string, string> = {};
              for (const issue of parsed.error.issues) {
                const key = String(issue.path[0] ?? "form");
                fields[key] ??= issue.message;
              }
              return send(422, { ok: false, error: "validation", fields });
            }
            if (parsed.data.website) return send(400, { ok: false, error: "spam" });
            await new Promise((r) => setTimeout(r, 500));
            return send(200, { ok: true, delivered: false, mode: "dry-run" });
          } catch {
            return send(500, { ok: false, error: "server" });
          }
        });
      });
    },
  };
}

/**
 * Clash Display is licensed separately and added by hand (public/fonts/README.md).
 * Its @font-face is emitted only when the file exists, so a missing font never
 * causes a 404 or a build warning; headings fall back to Geist.
 */
export function displayFontPlugin(): Plugin {
  const virtualId = "virtual:display-font.css";
  const resolvedId = `\0${virtualId}`;
  const fontFile = resolve(
    import.meta.dirname,
    "..",
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
