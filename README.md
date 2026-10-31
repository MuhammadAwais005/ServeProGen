# ServeProGen website

Official website of **ServeProGen**, a premium AI & software engineering studio.
_Engineering Intelligence. Building Possibilities._

React 19 + TypeScript, React Router 8 (static pre-rendering), Vite 8, Tailwind CSS 4.
Built as static files for Hostinger shared hosting.

## Requirements

- Node.js 22 (see `.nvmrc`)
- npm 10+

## Getting started

```bash
npm install
cp .env.example .env.local   # optional; defaults are safe for local work
npm run dev                  # http://localhost:5173
```

Optional: add the Clash Display font, see `public/fonts/README.md`.

## Scripts

| Command             | What it does                                                  |
| ------------------- | ------------------------------------------------------------- |
| `npm run dev`       | Local dev server with hot reload                              |
| `npm run build`     | Production build; pre-renders every route into `build/client` |
| `npm run preview`   | Serves the production build locally                           |
| `npm run typecheck` | Generates route types and runs TypeScript                     |
| `npm run lint`      | ESLint, including accessibility rules                         |
| `npm run format`    | Formats code with Prettier                                    |
| `npm run check`     | Everything CI runs, in order                                  |

## Where things live

```
app/
  content/          ← edit text here: company, services, process, projects, articles
    site.ts           company facts, navigation, contact details (null = hidden)
    services.ts       the five services
    process.ts        the six process stages (single source of truth)
    projects/*.mdx    one file per project; set published: true when confirmed
    insights/*.mdx    one file per article
  components/       ui/, layout/, brand/, sections/
  routes/           one file per page
  styles/tokens.css design tokens
public/             static files copied as-is (.htaccess, icons, logo files)
server/             contact form server code and config template (no secrets)
```

### Adding a project

1. Copy `app/content/projects/_template.mdx` to `app/content/projects/my-project.mdx`.
2. Fill in the frontmatter and write the case study below it.
3. Set `published: true` only when every fact is confirmed. The build refuses a
   published project with an unconfirmed status or placeholder text.

### Adding an article

Copy `app/content/insights/_template.mdx`, write, set `published: true`.

## Content rules

No testimonials, clients, statistics or results unless they are real and confirmed.
Unknown contact details stay `null` in `site.ts`; the UI hides them.

## Deployment

Not yet. Plan: GitHub → CI → optional Hostinger staging subdomain → production
on the purchased domain, each step only after approval.
Secrets (SMTP) never go in this repository; see `server/README.md`.
