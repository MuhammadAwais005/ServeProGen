import { ChevronRight, Plus } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router";
import { ArrowRight, Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { primaryCta } from "~/content/site";
import { cn } from "~/lib/cn";
import type { Crumb } from "~/lib/seo";

/** Props that opt an element into the CSS reveal system, with optional stagger. */
export const reveal = (index = 0) => ({
  "data-reveal": "",
  style: { "--reveal-index": index } as CSSProperties,
});

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-[0.8125rem] text-muted">
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={crumb.to} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="text-text">
                  {crumb.label}
                </span>
              ) : (
                <>
                  <Link to={crumb.to} className="transition-colors hover:text-text">
                    {crumb.label}
                  </Link>
                  <ChevronRight aria-hidden="true" className="size-3.5 opacity-60" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

type PageHeroProps = {
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  crumbs?: Crumb[];
  children?: ReactNode;
  /** Decorative visual shown to the right on large screens. */
  aside?: ReactNode;
  className?: string;
};

/** Standard hero for inner pages: breadcrumbs, mono label, H1, intro. */
export function PageHero({
  label,
  title,
  intro,
  crumbs,
  children,
  aside,
  className,
}: PageHeroProps) {
  return (
    <section className={cn("relative isolate overflow-hidden pt-header", className)}>
      <div aria-hidden="true" className="bg-blueprint absolute inset-0 -z-20" />
      <div
        aria-hidden="true"
        className="glow-accent absolute -top-40 -right-40 -z-10 size-[40rem] opacity-50"
      />
      <Container className="grid items-end gap-12 pt-14 pb-16 lg:grid-cols-[1.4fr_1fr] lg:pt-20 lg:pb-24">
        <div className="flex max-w-3xl flex-col gap-6">
          {crumbs && <Breadcrumbs crumbs={crumbs} />}
          <p className="text-label hero-fade flex items-center gap-3 text-muted">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
            {label}
          </p>
          <h1 className="text-h1">
            <span className="hero-line">
              <span>{title}</span>
            </span>
          </h1>
          {intro && (
            <p
              className="text-lead hero-fade max-w-2xl text-muted"
              style={{ "--line": 1 } as CSSProperties}
            >
              {intro}
            </p>
          )}
          {children && (
            <div className="hero-fade" style={{ "--line": 2 } as CSSProperties}>
              {children}
            </div>
          )}
        </div>
        {aside && <div className="hidden lg:block">{aside}</div>}
      </Container>
    </section>
  );
}

/** Section wrapper with consistent rhythm and an optional top border. */
export function Section({
  children,
  className,
  bordered = true,
  id,
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  bordered?: boolean;
  id?: string;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "section-y relative",
        bordered && "border-t border-border",
        className,
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}

/** Closing call-to-action band used at the end of most pages. */
export function CtaBand({
  title = "Have an idea worth engineering?",
  text = "Let's turn your next challenge into a practical digital solution.",
  cta = "Start a Conversation",
  secondary,
}: {
  title?: string;
  text?: string;
  cta?: string;
  secondary?: { label: string; to: string };
}) {
  return (
    <section
      aria-labelledby="cta-title"
      className="relative isolate overflow-hidden border-t border-border"
    >
      <div aria-hidden="true" className="bg-blueprint absolute inset-0 -z-20" />
      <div
        aria-hidden="true"
        className="glow-accent absolute top-1/2 left-1/2 -z-10 size-[52rem] -translate-x-1/2 -translate-y-1/2"
      />
      <Container className="section-y flex flex-col items-center gap-7 text-center">
        <p className="text-label text-accent" {...reveal(0)}>
          Next step
        </p>
        <h2 id="cta-title" className="text-h1 max-w-4xl" {...reveal(1)}>
          {title}
        </h2>
        <p className="text-lead max-w-xl text-muted" {...reveal(2)}>
          {text}
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2" {...reveal(3)}>
          <Button to={primaryCta.to} size="lg">
            {cta}
            <ArrowRight />
          </Button>
          {secondary && (
            <Button to={secondary.to} variant="secondary" size="lg">
              {secondary.label}
            </Button>
          )}
        </div>
      </Container>
    </section>
  );
}

/** Accessible FAQ built on native <details>: works without JavaScript. */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-left [&::-webkit-details-marker]:hidden">
            <span className="font-display text-lg font-semibold text-text sm:text-xl">
              {item.q}
            </span>
            <Plus
              aria-hidden="true"
              className="mt-1 size-5 shrink-0 text-accent transition-transform duration-(--duration-base) group-open:rotate-45"
            />
          </summary>
          <p className="max-w-3xl pb-6 text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

/** Shown on draft pages in preview mode. Never rendered in production builds. */
export function DraftNotice({ reasons = [] }: { reasons?: string[] }) {
  return (
    <div
      role="note"
      className="mb-8 rounded-card border border-dashed border-accent/60 bg-accent/5 p-4 text-small text-text"
    >
      <p className="font-medium">
        <span className="text-label mr-2 text-accent">Draft preview</span>
        This page is not public. It appears only in local and preview builds.
      </p>
      {reasons.length > 0 && (
        <p className="mt-1 text-muted">To confirm: {reasons.join(", ")}.</p>
      )}
    </div>
  );
}

/** Two-column row: sticky heading on the left, content on the right. */
export function SplitRow({
  label,
  title,
  children,
  id,
}: {
  label: string;
  title: ReactNode;
  children: ReactNode;
  id?: string;
}) {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.4fr] lg:gap-20">
      <div
        className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start"
        {...reveal()}
      >
        <p className="text-label text-muted">
          <span className="text-accent">{label.split(" / ")[0]}</span>
          {label.includes(" / ") && <span aria-hidden="true"> / </span>}
          {label.split(" / ")[1]}
        </p>
        <h2 id={id} className="text-h2">
          {title}
        </h2>
      </div>
      <div {...reveal(1)}>{children}</div>
    </div>
  );
}
