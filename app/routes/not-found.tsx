import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { pageMeta } from "~/lib/seo";

export const meta = () =>
  pageMeta({
    title: "Page not found",
    description: "The page you were looking for does not exist.",
    path: "/404",
    noindex: true,
  });

/** Branded 404. Pre-rendered to /404/index.html and served by .htaccess for unknown URLs. */
export function NotFound() {
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="bg-blueprint absolute inset-0 -z-10" />
      <Container className="flex min-h-[80svh] flex-col justify-center gap-6 pt-header">
        <p className="text-label text-accent">404</p>
        <h1 className="text-h1 max-w-2xl">This page isn&rsquo;t part of the system.</h1>
        <p className="text-lead max-w-xl text-muted">
          The link may be broken or the page may have moved.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button to="/" size="lg">
            Back to home
          </Button>
          <Button to="/contact" variant="secondary" size="lg">
            Contact us
          </Button>
        </div>
      </Container>
    </section>
  );
}

export default NotFound;
