import type { ReactNode } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "virtual:display-font.css";
import "./app.css";
import { SiteFooter } from "./components/layout/SiteFooter";
import { SiteHeader } from "./components/layout/SiteHeader";
import { SkipLink } from "./components/layout/SkipLink";
import { NotFound } from "./routes/not-found";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
  { rel: "manifest", href: "/site.webmanifest" },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#08090D" />
        <Meta />
        <Links />
      </head>
      <body>
        <SkipLink />
        <SiteHeader />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFound />;
  }

  const details =
    import.meta.env.DEV && error instanceof Error ? error.message : undefined;

  return (
    <section className="mx-auto flex min-h-[70svh] max-w-site flex-col justify-center gap-6 px-4 pt-header sm:px-6 lg:px-8">
      <p className="text-label text-accent">Error</p>
      <h1 className="text-h1">Something went wrong.</h1>
      <p className="text-lead text-muted">
        Please refresh the page or try again shortly.
      </p>
      {details && (
        <pre className="overflow-x-auto rounded-card border border-border bg-surface p-4 text-small">
          <code>{details}</code>
        </pre>
      )}
    </section>
  );
}
