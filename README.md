# ServeProGen website

Official website of **ServeProGen**, a premium AI & software engineering studio.
_Engineering Intelligence. Building Possibilities._

React 19 · TypeScript · React Router 8 (static pre-rendering) · Vite 8 · Tailwind CSS 4 ·
GSAP · Motion · Lenis · Three.js / React Three Fiber · MDX + Zod · PHP + PHPMailer.
Built as static files for Hostinger shared hosting.

## Quick start

Requirements: **Node.js 22** (see `.nvmrc`), npm 10+, Git. PHP 8 is optional (only
needed to test the contact form against the real PHP endpoint locally).

```bash
npm install
npm run dev            # http://localhost:5173 (drafts visible, marked "Draft")
```

To see exactly what visitors will get:

```bash
npm run build          # production build: published content only
npm run serve          # http://localhost:4173, behaves like Hostinger (.htaccess rules)
```

Works the same in PowerShell, Command Prompt, macOS and Linux.

## Scripts

| Command                           | What it does                                                                                                                  |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`                     | Development server with hot reload. Shows drafts with a "Draft" banner.                                                       |
| `npm run build`                   | Production build into `build/client`. Published content only, no internal pages.                                              |
| `npm run build:preview`           | Build that includes drafts and `/brand`, always `noindex`. For review only.                                                   |
| `npm run serve`                   | Serves the last build like Hostinger does (clean URLs, 404, gzip, PHP for `/api`).                                            |
| `npm run typecheck`               | Route types + TypeScript.                                                                                                     |
| `npm run lint`                    | ESLint, including accessibility and React Hooks rules.                                                                        |
| `npm run format` / `format:check` | Prettier.                                                                                                                     |
| `npm test`                        | Unit tests (Vitest): content rules, SEO, contact form sync with PHP.                                                          |
| `npm run test:e2e`                | Browser tests (Playwright) on the production build. Run `npm run build` first. First time: `npx playwright install chromium`. |
| `npm run check`                   | Typecheck, lint, format, unit tests and build, in that order.                                                                 |
| `npm run package`                 | Clean ZIP of the **source** (last commit) into `exports/`. Refuses if secrets are committed.                                  |
| `npm run package:hostinger`       | ZIP of the **built site** + private folder for manual upload to Hostinger.                                                    |

## Editing content

Everything you'd want to change lives in `app/content/`. No component edits needed.

| File             | What it controls                                                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `site.ts`        | Company facts, navigation, contact details, social links, founder block, values, differentiators, capability strip, tech ecosystem, budget ranges |
| `services.ts`    | The five services: summaries, problems, capabilities, approach, FAQs                                                                              |
| `process.ts`     | The six process stages (Discover, Strategize, Design, Engineer, Validate, Launch & Evolve)                                                        |
| `projects/*.mdx` | One file per project / case study (`/work/<file-name>`)                                                                                           |
| `insights/*.mdx` | One file per article (`/insights/<file-name>`)                                                                                                    |
| `legal/*.mdx`    | Privacy Policy and Terms of Service                                                                                                               |

Unknown facts stay `null` in `site.ts`; the site hides them instead of guessing.

### Publishing a project

1. Copy `app/content/projects/_template.mdx` to `app/content/projects/<name>.mdx`.
2. Fill in the frontmatter and the case study. Real screenshots go in
   `public/projects/<name>/` and are listed under `screenshots`.
3. Anything not yet verified goes in `unconfirmed: [...]`.
4. Set `published: true`. The build **stops with a clear message** if a published
   project still has an `unconfirmed` list, status `unconfirmed`, or `[TO CONFIRM]` text.

Published projects appear on `/work`, get their own page, are added to the sitemap,
and (if `featured: true`) show in the homepage's "Selected work" section.

### Publishing an article

Copy `app/content/insights/_template.mdx`, write it, set the real `date`, then
`published: true`. Reading time and table of contents are generated automatically.
The three existing articles are labelled `sample: true` (layout testing) and can never
be published. The homepage Insights section appears once three real articles exist.

### Adding a page

Create the route file in `app/routes/` and register it in `app/routes.ts`. Static routes
are pre-rendered automatically.

## Project structure

```
app/
  content/        ← all editable content (see above)
  routes/         one file per page
  components/
    home/         homepage sections (Hero, ServicesBento, AiSpotlight, …)
    hero/         Neural Lattice 3D scene (lazy-loaded) and its loader
    layout/       header, footer, skip link, reveal and smooth-scroll systems
    ui/           Button, Card, Badge, form fields, page blocks
    work/ insights/ contact/ legal/ brand/   page-specific components
  lib/            SEO, contact form schema, motion tokens
  hooks/          device tier, reduced motion, scroll helpers
  styles/tokens.css   design tokens (colors, type scale, spacing, motion)
config/           build-time content index and Vite plugins
public/           static files: .htaccess, api/contact.php, logos, icons, OG image
server/private/   PHPMailer + mail-config template (deployed outside public_html)
scripts/          build, serve and packaging scripts
tests/            unit (Vitest) and e2e (Playwright) tests
docs/DEPLOYMENT.md   Hostinger staging, launch, DNS/SSL, email and rollback guide
```

## Quality bar

Every change should keep these green: `npm run check` and `npm run test:e2e`.
The browser tests cover every public page (with an axe WCAG 2.2 AA scan), broken
links, the 404, drafts never shipping, keyboard and mobile navigation, the contact
form against the real PHP endpoint, no-JavaScript and reduced-motion fallbacks, and
layouts from 360 px to 1920 px.

## Deployment

See **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**. In short: stage on a free Hostinger
subdomain, then launch on the purchased domain. Secrets (SMTP) only ever live on the
server in `private/mail-config.php`, never in Git.
