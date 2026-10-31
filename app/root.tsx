import { domAnimation, LazyMotion } from "motion/react";
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
// Loaded as a URL and rendered with `precedence` (below) so React writes the
// stylesheet BEFORE the ~20 module preloads in <head>. As a side-effect import it
// came last, and on slow mobile connections first paint waited behind the JS.
import appCss from "./app.css?url";
import { RevealObserver } from "./components/layout/RevealObserver";
import { SiteFooter } from "./components/layout/SiteFooter";
import { SiteHeader } from "./components/layout/SiteHeader";
import { SkipLink } from "./components/layout/SkipLink";
import { SmoothScroll } from "./components/layout/SmoothScroll";
import { Button } from "./components/ui/Button";
import { NotFound } from "./routes/not-found";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
  { rel: "manifest", href: "/site.webmanifest" },
];

/** Marks JS as available before first paint so reveal styles apply without a flash. */
const JS_FLAG = `document.documentElement.classList.add("js")`;

export function Layout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script adds class="js" before React loads.
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#08090D" />
        <meta name="color-scheme" content="dark" />
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
        <link rel="stylesheet" href={appCss} precedence="default" />
        <Meta />
        <Links />
      </head>
      <body>
        <LazyMotion features={domAnimation} strict>
          <SkipLink />
          <SiteHeader />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter />
        </LazyMotion>
        <RevealObserver />
        <SmoothScroll />
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
      <div>
        <Button to="/" variant="secondary">
          Back to home
        </Button>
      </div>
      {details && (
        <pre className="overflow-x-auto rounded-card border border-border bg-surface p-4 text-small">
          <code>{details}</code>
        </pre>
      )}
    </section>
  );
}
